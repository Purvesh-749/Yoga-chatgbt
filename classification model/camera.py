import cv2
import numpy as np
import time
from movenet import Movenet
from inference import classify_pose

# =========================
# INIT
# =========================
movenet = Movenet("movenet_thunder.tflite")
cap = cv2.VideoCapture(0)

# =========================
# SHARED STATE (Flask uses this)
# =========================
current_pose = "unknown"
current_confidence = 0.0
target_pose = "any"

hold_time = 0.0
best_time = 0.0
correct = False
_last_correct_time = None

# =========================
# MoveNet skeleton edges
# =========================
EDGES = [
    (5, 7), (7, 9),
    (6, 8), (8, 10),
    (5, 6),
    (5, 11), (6, 12),
    (11, 12),
    (11, 13), (13, 15),
    (12, 14), (14, 16)
]

# =========================
# ANGLE UTILS
# =========================
def angle(a, b, c):
    """
    Calculate angle between points a-b-c
    """
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)

    ba = a - b
    bc = c - b

    cosine = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
    angle = np.degrees(np.arccos(np.clip(cosine, -1.0, 1.0)))
    return angle


# =========================
# COBRA RULE (IMPORTANT)
# =========================
def is_cobra_pose(person):
    kp = person.keypoints

    # mandatory keypoints with confidence
    required = [5, 7, 9, 11, 13]  # shoulder, elbow, wrist, hip, knee
    for i in required:
        if kp[i].score < 0.4:
            return False

    shoulder = [kp[5].coordinate.x, kp[5].coordinate.y]
    elbow    = [kp[7].coordinate.x, kp[7].coordinate.y]
    wrist    = [kp[9].coordinate.x, kp[9].coordinate.y]

    hip      = [kp[11].coordinate.x, kp[11].coordinate.y]
    knee     = [kp[13].coordinate.x, kp[13].coordinate.y]

    elbow_angle = angle(shoulder, elbow, wrist)
    torso_angle = angle(shoulder, hip, knee)

    return elbow_angle > 155 and torso_angle > 155


# =========================
# VIDEO STREAM
# =========================
def gen_frames():
    global current_pose, current_confidence
    global hold_time, best_time, correct, _last_correct_time

    while True:
        ok, frame = cap.read()
        if not ok:
            break

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        person = movenet.detect(rgb)

        keypoints = []

        # draw keypoints
        for kp in person.keypoints:
            keypoints.extend([kp.coordinate.x, kp.coordinate.y])
            if kp.score > 0.3:
                cv2.circle(
                    frame,
                    (int(kp.coordinate.x), int(kp.coordinate.y)),
                    4,
                    (0, 255, 0),
                    -1
                )

        # draw skeleton
        for a, b in EDGES:
            pa, pb = person.keypoints[a], person.keypoints[b]
            if pa.score > 0.3 and pb.score > 0.3:
                cv2.line(
                    frame,
                    (int(pa.coordinate.x), int(pa.coordinate.y)),
                    (int(pb.coordinate.x), int(pb.coordinate.y)),
                    (0, 255, 0),
                    2
                )

        # =========================
        # CLASSIFICATION + RULES
        # =========================
        if len(keypoints) == 34:
            kp_np = np.array(keypoints).reshape(1, -1)
            pose, conf = classify_pose(kp_np)

            current_pose = pose
            current_confidence = round(conf * 100, 2)

            is_correct_pose = False

            if conf > 0.6:
                if target_pose == "cobra":
                    is_correct_pose = is_cobra_pose(person)

                elif target_pose == "any":
                    is_correct_pose = True

                else:
                    is_correct_pose = (pose == target_pose)


            correct = is_correct_pose
            now = time.time()

            if is_correct_pose:
                if _last_correct_time is None:
                    _last_correct_time = now
                hold_time = round(now - _last_correct_time, 1)
                best_time = max(best_time, hold_time)
            else:
                _last_correct_time = None
                hold_time = 0.0

            color = (0, 255, 0) if correct else (0, 0, 255)

            cv2.putText(
                frame,
                f"{pose} ({current_confidence:.1f}%)",
                (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                color,
                2
            )

        _, buffer = cv2.imencode(".jpg", frame)
        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n"
            + buffer.tobytes()
            + b"\r\n"
        )

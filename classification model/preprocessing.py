def preprocess_keypoints(keypoints):
    """
    keypoints shape: (1, 34)
    MUST MATCH TRAINING PREPROCESS
    """

    import numpy as np

    # reshape to (17, 2)
    kp = np.array(keypoints, dtype=np.float32).reshape(17, 2)

    # =========================
    # 1. HIP CENTERING
    # =========================
    left_hip = kp[11]
    right_hip = kp[12]
    center = (left_hip + right_hip) / 2
    kp = kp - center

    # =========================
    # 2. SCALE NORMALIZATION
    # =========================
    left_shoulder = kp[5]
    torso_size = np.linalg.norm(left_shoulder - kp[11])
    max_dist = np.max(np.linalg.norm(kp, axis=1))

    pose_size = max(torso_size * 2.5, max_dist)
    kp = kp / pose_size

    # =========================
    # 3. FLATTEN
    # =========================
    return kp.reshape(1, 34)
    
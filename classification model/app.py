from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import camera

app = Flask(__name__)
CORS(app)

# =========================
# VIDEO STREAM
# =========================
@app.route("/video_feed")
def video_feed():
    return Response(
        camera.gen_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame"
    )

# =========================
# STATUS (React polls this)
# =========================
@app.route("/status")
def status():
    return jsonify({
        "pose": str(camera.current_pose),
        "confidence": float(camera.current_confidence),
        "hold_time": float(camera.hold_time),
        "best_time": float(camera.best_time),
        "correct": bool(camera.correct)
    })

# =========================
# SET TARGET POSE
# =========================
@app.route("/set_pose", methods=["POST"])
def set_pose():
    data = request.get_json()
    camera.target_pose = data.get("pose", "any")
    return jsonify({"ok": True, "target_pose": camera.target_pose})

# =========================
# MAIN
# =========================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

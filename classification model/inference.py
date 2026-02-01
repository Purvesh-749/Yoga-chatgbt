import numpy as np
import tensorflow as tf
from preprocessing import preprocess_keypoints

# Load trained model ONCE
model = tf.keras.models.load_model("weights.best.hdf5")

POSE_LABELS = [
    "chair",
    "cobra",
    "dog",
    "no_pose",
    "shoulder_stand",
    "triangle",
    "tree",
    "warrior"
]

def classify_pose(keypoints):
    """
    keypoints shape: (1, 34)
    returns: pose_name, confidence (0–1)
    """

    keypoints = preprocess_keypoints(keypoints)

    preds = model.predict(keypoints, verbose=0)
    idx = int(np.argmax(preds[0]))

    pose = POSE_LABELS[idx]
    confidence = float(preds[0][idx])

    return pose, confidence

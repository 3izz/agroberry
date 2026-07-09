import os
import cv2
from PIL import Image

BASE = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(BASE, "scripts", "preview_frames")
os.makedirs(OUT, exist_ok=True)

JOBS = [
    ("assets/video/landscape-garden-showcase.mp4", "garden", [8, 20, 35, 50]),
    ("assets/video/farmland-agriculture-showcase.mp4", "farm", [5, 10, 18, 25]),
]

for rel_path, tag, seeks in JOBS:
    path = os.path.join(BASE, rel_path)
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 24
    frame_count = cap.get(cv2.CAP_PROP_FRAME_COUNT)
    duration = frame_count / fps if fps else 0
    print(tag, "duration approx", round(duration, 1), "sec", "fps", fps)
    for s in seeks:
        if s >= duration:
            continue
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(fps * s))
        ok, frame = cap.read()
        if not ok:
            continue
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        img = Image.fromarray(frame_rgb)
        img.thumbnail((900, 900))
        img.save(os.path.join(OUT, f"{tag}_{s}s.jpg"), "JPEG", quality=75)
    cap.release()
print("DONE")

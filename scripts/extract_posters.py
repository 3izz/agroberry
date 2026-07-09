import os
import cv2
from PIL import Image

BASE = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(BASE, "assets", "images", "video-posters")
os.makedirs(OUT, exist_ok=True)

JOBS = [
    ("assets/video/landscape-garden-showcase.mp4", "landscape-garden-poster", 2.0, 1920),
    ("assets/video/farmland-agriculture-showcase.mp4", "farmland-agriculture-poster", 2.0, 1600),
]

for rel_path, name, seek_seconds, max_width in JOBS:
    path = os.path.join(BASE, rel_path)
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 24
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(fps * seek_seconds))
    ok, frame = cap.read()
    if not ok:
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        ok, frame = cap.read()
    cap.release()
    if not ok:
        print("FAILED", rel_path)
        continue
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    img = Image.fromarray(frame_rgb)
    if img.width > max_width:
        ratio = max_width / img.width
        img = img.resize((max_width, int(img.height * ratio)), Image.LANCZOS)
    img.save(os.path.join(OUT, name + ".jpg"), "JPEG", quality=82, optimize=True, progressive=True)
    img.save(os.path.join(OUT, name + ".webp"), "WEBP", quality=80, method=6)
    print("OK", name, img.width, img.height)

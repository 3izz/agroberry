import os
from PIL import Image, ImageOps

SRC_DIR = os.path.join(os.path.dirname(__file__), "..")
OUT_DIR = os.path.join(SRC_DIR, "assets", "images")

# (source filename, destination subfolder, destination basename, max_width)
MAPPING = [
    ("photo_1_2026-07-04_00-55-50.jpg", "shop", "storefront-entrance-signage-01", 1920),
    ("photo_2_2026-07-04_00-55-50.jpg", "shop", "storefront-entrance-signage-02", 1920),
    ("photo_3_2026-07-04_00-55-50.jpg", "plants", "lucky-bamboo-arrangement-01", 1600),
    ("photo_4_2026-07-04_00-55-50.jpg", "plants", "lucky-bamboo-arrangement-02", 1600),
    ("photo_5_2026-07-04_00-55-50.jpg", "plants", "indoor-planter-shelf-colorful", 1600),
    ("photo_6_2026-07-04_00-55-50.jpg", "shop", "ceramic-planter-floral-large", 1600),
    ("photo_7_2026-07-04_00-55-50.jpg", "plants", "aglaonema-dark-foliage-display", 1600),
    ("photo_8_2026-07-04_00-55-50.jpg", "shop", "ceramic-planters-collection", 1600),
    ("photo_9_2026-07-04_00-55-50.jpg", "plants", "aglaonema-red-pink-closeup", 1600),
    ("photo_10_2026-07-04_00-55-50.jpg", "plants", "mini-cactus-succulent-trio", 1600),
    ("photo_11_2026-07-04_00-55-50.jpg", "plants", "calla-lily-red-white-blooms", 1600),
    ("photo_12_2026-07-04_00-55-50.jpg", "plants", "dieffenbachia-variegated-closeup", 1600),
    ("photo_13_2026-07-04_00-55-50.jpg", "shop", "modern-ceramic-pots-shelf-row", 1600),
    ("photo_14_2026-07-04_00-55-50.jpg", "shop", "interior-plant-display-wall-01", 1600),
    ("photo_15_2026-07-04_00-55-50.jpg", "plants", "snake-plant-sansevieria-closeup", 1600),
    ("photo_16_2026-07-04_00-55-50.jpg", "shop", "interior-plant-display-wall-02", 1600),
    ("photo_17_2026-07-04_00-55-50.jpg", "plants", "calathea-white-star-closeup", 1600),
    ("photo_18_2026-07-04_00-55-50.jpg", "shop", "interior-plant-display-wall-03-wood", 1600),
    ("photo_19_2026-07-04_00-55-50.jpg", "plants", "calathea-rattlesnake-closeup", 1600),
    ("photo_20_2026-07-04_00-55-50.jpg", "plants", "succulent-duo-marble-pots", 1600),
    ("photo_2026-07-04_01-08-28.jpg", "shop", "interior-plant-display-wall-04", 1920),
    ("photo_2026-07-09_09-37-29.jpg", "logo", "agroberry-logo-full", 1200),
]

THUMB_WIDTH = 700

def save_variant(img, path, quality=80):
    img.save(path, "JPEG", quality=quality, optimize=True, progressive=True)

def save_webp(img, path, quality=78):
    img.save(path, "WEBP", quality=quality, method=6)

def process(src_name, subdir, basename, max_width):
    src_path = os.path.join(SRC_DIR, src_name)
    if not os.path.exists(src_path):
        print("MISSING:", src_path)
        return
    img = Image.open(src_path)
    img = ImageOps.exif_transpose(img)
    if img.mode != "RGB":
        img = img.convert("RGB")

    out_subdir = os.path.join(OUT_DIR, subdir)
    os.makedirs(out_subdir, exist_ok=True)

    # Full size variant
    full = img.copy()
    if full.width > max_width:
        ratio = max_width / full.width
        full = full.resize((max_width, int(full.height * ratio)), Image.LANCZOS)
    save_variant(full, os.path.join(out_subdir, basename + ".jpg"))
    save_webp(full, os.path.join(out_subdir, basename + ".webp"))
    print(f"{basename}: full {full.width}x{full.height}")

    # Thumbnail variant (skip for logo)
    if subdir != "logo":
        thumb = img.copy()
        if thumb.width > THUMB_WIDTH:
            ratio = THUMB_WIDTH / thumb.width
            thumb = thumb.resize((THUMB_WIDTH, int(thumb.height * ratio)), Image.LANCZOS)
        save_variant(thumb, os.path.join(out_subdir, basename + "-thumb.jpg"), quality=76)
        save_webp(thumb, os.path.join(out_subdir, basename + "-thumb.webp"), quality=74)

for row in MAPPING:
    process(*row)

print("DONE")

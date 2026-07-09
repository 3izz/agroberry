import os
from rembg import remove
from PIL import Image

BASE = os.path.join(os.path.dirname(__file__), "..")
LOGO_DIR = os.path.join(BASE, "assets", "images", "logo")
os.makedirs(LOGO_DIR, exist_ok=True)

src = Image.open(os.path.join(BASE, "assets", "images", "logo", "agroberry-logo-full.jpg")).convert("RGBA")
full_transparent = remove(src)
bbox = full_transparent.getbbox()
full_transparent = full_transparent.crop(bbox)
print("full transparent size", full_transparent.size)

# Save wordmark (transparent) at web size
w, h = full_transparent.size
target_w = 900
ratio = target_w / w
wordmark = full_transparent.resize((target_w, int(h * ratio)), Image.LANCZOS)
wordmark.save(os.path.join(LOGO_DIR, "agroberry-logo-transparent.png"), optimize=True)
wordmark.convert("RGBA").save(os.path.join(LOGO_DIR, "agroberry-logo-transparent.webp"), "WEBP", quality=92)

# Crop just the strawberry mark (left portion) at full resolution for favicon use
# The strawberry+leaves occupies roughly the left 27% of width, full height
fw, fh = full_transparent.size
crop_w = int(fw * 0.25)
mark = full_transparent.crop((0, 0, crop_w, fh))
mbbox = mark.getbbox()
mark = mark.crop(mbbox)
print("mark size", mark.size)

# Pad to square canvas with transparent margin
side = max(mark.size)
pad = int(side * 0.12)
canvas_size = side + pad * 2
square = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
offset = ((canvas_size - mark.width) // 2, (canvas_size - mark.height) // 2)
square.paste(mark, offset, mark)
square.save(os.path.join(LOGO_DIR, "agroberry-mark-transparent.png"), optimize=True)

# Favicon sizes with a white rounded-square backing for visibility on any tab theme
def rounded_square_icon(size, bg=(255, 255, 255, 255), radius_ratio=0.22):
    icon = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    from PIL import ImageDraw
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    radius = int(size * radius_ratio)
    draw.rounded_rectangle((0, 0, size, size), radius=radius, fill=255)
    bg_layer = Image.new("RGBA", (size, size), bg)
    icon = Image.composite(bg_layer, icon, mask)
    mark_resized = square.resize((int(size * 0.78), int(size * 0.78)), Image.LANCZOS)
    mx = (size - mark_resized.width) // 2
    my = (size - mark_resized.height) // 2
    icon.alpha_composite(mark_resized, (mx, my))
    return icon

for size, name in [(32, "favicon-32.png"), (180, "apple-touch-icon.png"), (192, "icon-192.png"), (512, "icon-512.png")]:
    icon = rounded_square_icon(size)
    icon.save(os.path.join(LOGO_DIR, name))

# .ico (multi-size)
ico_sizes = [16, 32, 48]
icons = [rounded_square_icon(s) for s in ico_sizes]
icons[-1].save(os.path.join(LOGO_DIR, "favicon.ico"), sizes=[(s, s) for s in ico_sizes])

print("DONE")

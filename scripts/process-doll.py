#!/usr/bin/env python3
"""Chroma-key the paper-doll body and extract worn-gear overlays by differencing."""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path("/workspace")
RAW = ROOT / "artifacts/imagine_images"
OUT = ROOT / "public/art/gear"
WEAR = OUT / "wear"
PREVIEW = ROOT / "artifacts/doll-preview"
WEAR.mkdir(parents=True, exist_ok=True)
PREVIEW.mkdir(parents=True, exist_ok=True)

W, H = 576, 864

LAYERS = {
    "hoodie": "doll-hoodie.jpg",
    "leather": "doll-leather.jpg",
    "labcoat": "doll-labcoat.jpg",
    "turnout": "doll-turnout.jpg",
    "vest": "doll-vest.jpg",
    "plate": "doll-plate.jpg",
    "jeans": "doll-jeans.jpg",
    "boots": "doll-boots.jpg",
    "gloves": "doll-gloves.jpg",
    "hat": "doll-hat.jpg",
    "helm": "doll-helm.jpg",
    "glasses": "doll-glasses.jpg",
    "gasmask": "doll-gasmask.jpg",
    "pack": "doll-pack.jpg",
    "knife": "doll-knife.jpg",
    "pistol": "doll-pistol.jpg",
    "bat": "doll-bat.jpg",
    "axe": "doll-axe.jpg",
    "rifle": "doll-rifle.jpg",
}

# y0,y1,x0,x1 as fractions of the canvas — keep difference only inside the slot.
REGIONS = {
    "hat": (0.02, 0.28, 0.28, 0.72),
    "helm": (0.00, 0.30, 0.24, 0.76),
    "glasses": (0.08, 0.17, 0.40, 0.60),
    "gasmask": (0.02, 0.34, 0.26, 0.74),
    "hoodie": (0.14, 0.62, 0.16, 0.84),
    "leather": (0.14, 0.62, 0.16, 0.84),
    "labcoat": (0.12, 0.74, 0.14, 0.86),
    "turnout": (0.10, 0.74, 0.12, 0.88),
    "vest": (0.16, 0.54, 0.26, 0.74),
    "plate": (0.16, 0.54, 0.26, 0.74),
    "jeans": (0.42, 0.92, 0.20, 0.80),
    "boots": (0.74, 0.98, 0.20, 0.80),
    "gloves": (0.40, 0.64, 0.10, 0.90),
    "pack": (0.12, 0.60, 0.16, 0.84),
    "knife": (0.36, 0.74, 0.50, 0.92),
    "pistol": (0.38, 0.70, 0.50, 0.94),
    "bat": (0.10, 0.80, 0.46, 0.96),
    "axe": (0.08, 0.80, 0.46, 0.98),
    "rifle": (0.12, 0.78, 0.18, 0.86),
}

THRESH = {
    "glasses": 10,
    "hat": 28,
    "helm": 28,
    "gasmask": 26,
    "gloves": 32,
    "knife": 36,
    "pistol": 38,
    "bat": 34,
    "axe": 34,
    "rifle": 32,
    "boots": 38,
    "jeans": 46,
    "hoodie": 44,
    "leather": 42,
    "labcoat": 38,
    "turnout": 38,
    "vest": 40,
    "plate": 40,
    "pack": 38,
}


def load_rgb(path: Path) -> np.ndarray:
    im = Image.open(path).convert("RGB").resize((W, H), Image.Resampling.LANCZOS)
    return np.asarray(im, dtype=np.uint8)


def magenta(rgb: np.ndarray) -> np.ndarray:
    r = rgb[..., 0].astype(np.int16)
    g = rgb[..., 1].astype(np.int16)
    b = rgb[..., 2].astype(np.int16)
    mag = (r > 140) & (b > 140) & (g < 130) & ((r - g) > 30) & ((b - g) > 20)
    mag |= (r > 180) & (b > 160) & (g < 160) & ((r - g) > 25)
    return mag


def dilate(mask: np.ndarray, k: int = 3) -> np.ndarray:
    img = Image.fromarray((mask.astype(np.uint8) * 255))
    img = img.filter(ImageFilter.MaxFilter(k))
    return np.asarray(img) > 127


def erode(mask: np.ndarray, k: int = 3) -> np.ndarray:
    img = Image.fromarray((mask.astype(np.uint8) * 255))
    img = img.filter(ImageFilter.MinFilter(k))
    return np.asarray(img) > 127


def chroma_body(rgb: np.ndarray) -> np.ndarray:
    mag = magenta(rgb)
    fringe = dilate(mag, 3) & ~mag
    alpha = np.full(mag.shape, 255, dtype=np.uint8)
    alpha[mag] = 0
    alpha[fringe] = 0
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    dark = (r.astype(int) + g.astype(int) + b.astype(int)) < 100
    alpha[dark & dilate(mag, 7)] = 0
    return np.dstack([rgb, alpha])


def region_mask(key: str) -> np.ndarray:
    y0, y1, x0, x1 = REGIONS[key]
    m = np.zeros((H, W), dtype=bool)
    m[int(H * y0) : int(H * y1), int(W * x0) : int(W * x1)] = True
    return m


def extract_layer(body: np.ndarray, dressed: np.ndarray, key: str) -> np.ndarray:
    mag = magenta(dressed)
    dist = np.sqrt(((dressed.astype(np.float32) - body.astype(np.float32)) ** 2).sum(axis=2))
    thresh = THRESH.get(key, 44)
    keep = (~mag) & (dist > thresh) & region_mask(key)

    # drop silhouette-edge ghosts unless the color really changed
    body_fg = ~magenta(body)
    edge = dilate(body_fg, 3) & ~erode(body_fg, 3)
    keep = keep & ~((edge) & (dist < thresh + 35))

    # leftover skin
    r, g, b = dressed[..., 0].astype(int), dressed[..., 1].astype(int), dressed[..., 2].astype(int)
    skin = (r > 95) & (g > 65) & (b > 45) & (r > g + 8) & (r > b + 15) & ((g - b) < 45)
    # Drop leftover oval-head skin so the player portrait shows through hats/helmets.
    if key != "gasmask":
        keep = keep & ~((skin) & (dist < thresh + 28))

    if key == "glasses":
        keep = dilate(keep, 3)
    else:
        keep = dilate(erode(keep, 3), 3)

    alpha = np.zeros(keep.shape, dtype=np.uint8)
    alpha[keep] = 255
    soft = (~mag) & (~keep) & region_mask(key) & (dist > thresh * 0.75)
    alpha[soft] = 70
    alpha[mag] = 0
    alpha[dilate(mag, 3) & (dist < thresh)] = 0
    return np.dstack([dressed, alpha])


def bbox(alpha: np.ndarray, min_a: int = 80) -> tuple[int, int, int, int] | None:
    ys, xs = np.where(alpha >= min_a)
    if len(xs) == 0:
        return None
    return int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())


def head_metrics(body_rgba: np.ndarray) -> dict:
    a = body_rgba[..., 3]
    h, w = a.shape
    rows: list[tuple[int, int, int, int]] = []
    for y in range(h):
        xs = np.where(a[y] > 80)[0]
        if len(xs):
            rows.append((y, int(xs.min()), int(xs.max()), int(xs.max() - xs.min())))
    assert rows
    sample = [r[3] for r in rows[:50]]
    typical = int(np.median(sample)) if sample else 40
    end = rows[0]
    for r in rows:
        if r[3] > typical * 1.55 and r[0] > rows[0][0] + 24:
            break
        end = r
    head_rows = [r for r in rows if r[0] <= end[0]]
    y0 = head_rows[0][0]
    y1 = head_rows[-1][0]
    x0 = min(r[1] for r in head_rows)
    x1 = max(r[2] for r in head_rows)
    # slightly expand so the photo covers the egg
    pad_x = max(2, int((x1 - x0) * 0.12))
    pad_y = max(2, int((y1 - y0) * 0.08))
    x0 = max(0, x0 - pad_x)
    x1 = min(w - 1, x1 + pad_x)
    y0 = max(0, y0 - pad_y)
    y1 = min(h - 1, y1 + pad_y)
    fig = bbox(a)
    return {
        "size": {"w": w, "h": h},
        "figure": fig,
        "head_px": {"x0": x0, "y0": y0, "x1": x1, "y1": y1},
        "head_pct": {
            "left": round(100 * x0 / w, 2),
            "top": round(100 * y0 / h, 2),
            "width": round(100 * (x1 - x0) / w, 2),
            "height": round(100 * (y1 - y0) / h, 2),
        },
    }


def crop_box(arr: np.ndarray) -> np.ndarray:
    # Pad around the figure so weapons that stick out still fit.
    return arr[36:822, 148:458]


def save_rgba(arr: np.ndarray, path: Path) -> None:
    Image.fromarray(arr, "RGBA").save(path, optimize=True)


def composite(layers: list[np.ndarray]) -> np.ndarray:
    h, w = layers[0].shape[:2]
    out = np.zeros((h, w, 4), dtype=np.float32)
    for layer in layers:
        src = layer.astype(np.float32) / 255.0
        sa = src[..., 3:4]
        out[..., :3] = src[..., :3] * sa + out[..., :3] * (1 - sa)
        out[..., 3:4] = sa + out[..., 3:4] * (1 - sa)
    return (out * 255).clip(0, 255).astype(np.uint8)


def paste_face(base: np.ndarray, face_path: Path, head: dict) -> np.ndarray:
    im = Image.fromarray(base, "RGBA")
    face = Image.open(face_path).convert("RGB")
    hx = head["head_px"]
    w, h = hx["x1"] - hx["x0"], hx["y1"] - hx["y0"]
    # crop the portrait toward the upper face
    fw, fh = face.size
    side = min(fw, int(fh * 0.85))
    left = (fw - side) // 2
    top = int(fh * 0.08)
    face = face.crop((left, top, left + side, top + int(side * (h / w)))).resize((w, h), Image.Resampling.LANCZOS)
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).ellipse((1, 1, w - 2, h - 2), fill=255)
    im.paste(face, (hx["x0"], hx["y0"]), mask)
    return np.asarray(im)


def main() -> None:
    body_rgb = load_rgb(RAW / "doll-body.jpg")
    body_rgba = crop_box(chroma_body(body_rgb))
    save_rgba(body_rgba, OUT / "body.png")
    # Tight oval on the blank egg, not the shoulders.
    h, w = body_rgba.shape[:2]
    metrics = {
        "size": {"w": w, "h": h},
        "head_px": {"x0": 96, "y0": 8, "x1": 176, "y1": 122},
        "head_pct": {
            "left": round(100 * 96 / w, 2),
            "top": round(100 * 8 / h, 2),
            "width": round(100 * 80 / w, 2),
            "height": round(100 * 114 / h, 2),
        },
    }
    print("HEAD", json.dumps(metrics))
    print("CROPPED", body_rgba.shape)

    extracted: dict[str, np.ndarray] = {}
    for key, fname in LAYERS.items():
        dressed = load_rgb(RAW / fname)
        layer = crop_box(extract_layer(body_rgb, dressed, key))
        extracted[key] = layer
        save_rgba(layer, WEAR / f"{key}.png")
        box = bbox(layer[..., 3])
        cover = float((layer[..., 3] > 80).mean() * 100)
        print(f"{key:8} cover={cover:5.2f}% bbox={box}")

    kits = {
        "bare": [],
        "chef": ["jeans", "labcoat", "knife"],
        "vet": ["jeans", "boots", "hoodie", "pack", "pistol", "helm"],
        "fire": ["jeans", "boots", "turnout", "gloves", "axe", "helm"],
        "doc": ["jeans", "labcoat", "glasses"],
        "cop": ["jeans", "boots", "vest", "pistol"],
        "hat": ["jeans", "hoodie", "hat"],
        "gas": ["jeans", "plate", "gasmask", "rifle"],
    }
    face = ROOT / "public/art/p-vet.jpg"
    for name, keys in kits.items():
        stack = [body_rgba] + [extracted[k] for k in keys]
        comp = composite(stack)
        save_rgba(comp, PREVIEW / f"{name}.png")
        if name in {"vet", "hat", "bare", "fire"}:
            save_rgba(paste_face(comp, face, metrics), PREVIEW / f"{name}-face.png")
        print("preview", name)

    (PREVIEW / "head.json").write_text(json.dumps(metrics, indent=2))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Orthographic 4-facing layered doll sheets. R&D only. Not shipped in v0.1 loop."""
from pathlib import Path
from PIL import Image, ImageDraw

W, H = 180, 440
OUT = Path("/workspace/public/rd/doll")
FACINGS = ("front", "right", "back", "left")

SKIN = (196, 154, 114, 255)
SKIN_D = (168, 126, 92, 255)
HAIR = (92, 36, 40, 255)
HAIR_D = (62, 22, 26, 255)
SHIRT = (47, 74, 50, 255)
SHIRT_D = (36, 56, 38, 255)
CAMO_A = (62, 74, 42, 255)
CAMO_B = (90, 92, 48, 255)
CAMO_C = (40, 48, 32, 255)
JEANS = (52, 64, 88, 255)
SOCK = (48, 168, 168, 255)
SHOE = (186, 186, 190, 255)
SHOE_D = (120, 120, 124, 255)
STEEL = (140, 144, 148, 255)


def blank():
    return Image.new("RGBA", (W, H), (0, 0, 0, 0))


def ellipse(d, box, fill):
    d.ellipse(box, fill=fill)


def rect(d, box, fill):
    d.rectangle(box, fill=fill)


def poly(d, pts, fill):
    d.polygon(pts, fill=fill)


def cx():
    return W // 2


def save(im, layer, facing):
    OUT.mkdir(parents=True, exist_ok=True)
    im.save(OUT / f"{layer}-{facing}.png")


def draw_skin(facing, step=0):
    im = blank()
    d = ImageDraw.Draw(im)
    x = cx()
    lf, rf = ([14, 4, -12, 4][step], [-8, 4, 14, 4][step])
    # head
    if facing in ("front", "back"):
        ellipse(d, (x - 28, 18, x + 28, 78), SKIN)
        if facing == "front":
            ellipse(d, (x - 10, 44, x - 4, 52), SKIN_D)
            ellipse(d, (x + 4, 44, x + 10, 52), SKIN_D)
            ellipse(d, (x - 6, 58, x + 6, 64), (160, 100, 90, 255))
        ellipse(d, (x - 34, 40, x - 24, 56), SKIN_D)
        ellipse(d, (x + 24, 40, x + 34, 56), SKIN_D)
        rect(d, (x - 10, 72, x + 10, 92), SKIN)
        poly(d, [(x - 36, 90), (x + 36, 90), (x + 30, 200), (x - 30, 200)], SKIN)
        la, ra = -lf, -rf
        poly(d, [(x - 36, 96), (x - 52, 96), (x - 58 + la, 210), (x - 42 + la, 214), (x - 38, 120)], SKIN)
        poly(d, [(x + 36, 96), (x + 52, 96), (x + 58 + ra, 210), (x + 42 + ra, 214), (x + 38, 120)], SKIN)
        ellipse(d, (x - 62 + la, 200, x - 38 + la, 226), SKIN)
        ellipse(d, (x + 38 + ra, 200, x + 62 + ra, 226), SKIN)
        poly(d, [(x - 28, 198), (x - 4, 198), (x - 8 + lf, 330), (x - 30 + lf, 330)], SKIN)
        poly(d, [(x + 4, 198), (x + 28, 198), (x + 30 + rf, 330), (x + 8 + rf, 330)], SKIN)
    else:
        if facing == "right":
            ellipse(d, (x - 36, 18, x + 20, 78), SKIN)
            poly(d, [(x + 18, 48), (x + 34, 54), (x + 18, 60)], SKIN_D)
        else:
            ellipse(d, (x - 20, 18, x + 36, 78), SKIN)
            poly(d, [(x - 18, 48), (x - 34, 54), (x - 18, 60)], SKIN_D)
        rect(d, (x - 8, 72, x + 8, 92), SKIN)
        poly(d, [(x - 16, 90), (x + 16, 90), (x + 14, 200), (x - 14, 200)], SKIN)
        kick = lf
        if facing == "right":
            poly(d, [(x - 10, 100), (x - 22, 100), (x - 18, 200), (x - 6, 200)], SKIN_D)
            poly(d, [(x + 8, 96), (x + 24, 100), (x + 28 + kick // 2, 210), (x + 12 + kick // 2, 214)], SKIN)
            ellipse(d, (x + 10 + kick // 2, 202, x + 34 + kick // 2, 228), SKIN)
        else:
            poly(d, [(x + 10, 100), (x + 22, 100), (x + 18, 200), (x + 6, 200)], SKIN_D)
            poly(d, [(x - 8, 96), (x - 24, 100), (x - 28 - kick // 2, 210), (x - 12 - kick // 2, 214)], SKIN)
            ellipse(d, (x - 34 - kick // 2, 202, x - 10 - kick // 2, 228), SKIN)
        poly(d, [(x - 12, 198), (x + 12, 198), (x + 10 + kick, 330), (x - 10 + kick, 330)], SKIN)
    return im
    im = blank()
    d = ImageDraw.Draw(im)
    x = cx()
    # head
    if facing in ("front", "back"):
        ellipse(d, (x - 28, 18, x + 28, 78), SKIN)
        if facing == "front":
            ellipse(d, (x - 10, 44, x - 4, 52), SKIN_D)  # eyes
            ellipse(d, (x + 4, 44, x + 10, 52), SKIN_D)
            ellipse(d, (x - 6, 58, x + 6, 64), (160, 100, 90, 255))
        # ears
        ellipse(d, (x - 34, 40, x - 24, 56), SKIN_D)
        ellipse(d, (x + 24, 40, x + 34, 56), SKIN_D)
        # neck
        rect(d, (x - 10, 72, x + 10, 92), SKIN)
        # torso
        poly(d, [(x - 36, 90), (x + 36, 90), (x + 30, 200), (x - 30, 200)], SKIN)
        # arms hang
        poly(d, [(x - 36, 96), (x - 52, 96), (x - 58, 210), (x - 42, 214), (x - 38, 120)], SKIN)
        poly(d, [(x + 36, 96), (x + 52, 96), (x + 58, 210), (x + 42, 214), (x + 38, 120)], SKIN)
        ellipse(d, (x - 62, 200, x - 38, 226), SKIN)  # hands
        ellipse(d, (x + 38, 200, x + 62, 226), SKIN)
        # legs
        poly(d, [(x - 28, 198), (x - 4, 198), (x - 8, 330), (x - 30, 330)], SKIN)
        poly(d, [(x + 4, 198), (x + 28, 198), (x + 30, 330), (x + 8, 330)], SKIN)
    else:
        # side: thinner, nose, one visible arm
        flip = facing == "left"
        def fx(v):
            return W - v if flip else v
        # head
        ellipse(d, (fx(x - 8) - 28, 18, fx(x - 8) + 28, 78), SKIN)
        # nose
        nx = fx(x + 22) if not flip else fx(x + 22)
        if facing == "right":
            poly(d, [(x + 18, 48), (x + 34, 54), (x + 18, 60)], SKIN_D)
        else:
            poly(d, [(x - 18, 48), (x - 34, 54), (x - 18, 60)], SKIN_D)
        rect(d, (x - 8, 72, x + 8, 92), SKIN)
        poly(d, [(x - 16, 90), (x + 16, 90), (x + 14, 200), (x - 14, 200)], SKIN)
        # far arm (thin, behind — drawn darker)
        if facing == "right":
            poly(d, [(x - 10, 100), (x - 22, 100), (x - 18, 200), (x - 6, 200)], SKIN_D)
        else:
            poly(d, [(x + 10, 100), (x + 22, 100), (x + 18, 200), (x + 6, 200)], SKIN_D)
        # near arm
        if facing == "right":
            poly(d, [(x + 8, 96), (x + 24, 100), (x + 28, 210), (x + 12, 214)], SKIN)
            ellipse(d, (x + 10, 202, x + 34, 228), SKIN)
        else:
            poly(d, [(x - 8, 96), (x - 24, 100), (x - 28, 210), (x - 12, 214)], SKIN)
            ellipse(d, (x - 34, 202, x - 10, 228), SKIN)
        poly(d, [(x - 12, 198), (x + 12, 198), (x + 10, 330), (x - 10, 330)], SKIN)
    return im


def draw_shirt(facing, kind="tee"):
    im = blank()
    d = ImageDraw.Draw(im)
    x = cx()
    c, cd = SHIRT, SHIRT_D
    if kind == "tank":
        if facing in ("front", "back"):
            poly(d, [(x - 30, 92), (x + 30, 92), (x + 26, 188), (x - 26, 188)], c)
            # straps
            rect(d, (x - 28, 88, x - 16, 110), c)
            rect(d, (x + 16, 88, x + 28, 110), c)
        else:
            poly(d, [(x - 14, 92), (x + 14, 92), (x + 12, 188), (x - 12, 188)], c)
            rect(d, (x - 6, 88, x + 6, 110), c)
        return im
    # tee with sleeves
    if facing in ("front", "back"):
        poly(d, [(x - 34, 90), (x + 34, 90), (x + 28, 196), (x - 28, 196)], c)
        poly(d, [(x - 34, 92), (x - 54, 98), (x - 50, 150), (x - 32, 140)], cd)
        poly(d, [(x + 34, 92), (x + 54, 98), (x + 50, 150), (x + 32, 140)], cd)
        if facing == "front":
            # faded stencil, original, not a licensed mark
            d.text((x - 16, 128), "NITE", fill=(220, 220, 200, 90))
    else:
        poly(d, [(x - 16, 90), (x + 16, 90), (x + 14, 196), (x - 14, 196)], c)
        if facing == "right":
            poly(d, [(x + 10, 96), (x + 26, 102), (x + 24, 150), (x + 10, 140)], cd)
        else:
            poly(d, [(x - 10, 96), (x - 26, 102), (x - 24, 150), (x - 10, 140)], cd)
    return im


def camo_fill(im, mask_color=CAMO_A):
    px = im.load()
    for y in range(H):
        for x in range(W):
            if px[x, y][3] < 10:
                continue
            n = (x * 13 + y * 7) % 11
            px[x, y] = CAMO_A if n < 5 else CAMO_B if n < 8 else CAMO_C
    return im


def draw_pants(facing, kind="camo", step=0):
    im = blank()
    d = ImageDraw.Draw(im)
    x = cx()
    fill = CAMO_A if kind == "camo" else JEANS
    lf, rf = ([14, 4, -12, 4][step], [-8, 4, 14, 4][step])
    if facing in ("front", "back"):
        poly(
            d,
            [
                (x - 30, 186),
                (x + 30, 186),
                (x + 32 + rf, 320),
                (x + 6 + rf, 320),
                (x + 4, 210),
                (x - 4, 210),
                (x - 6 + lf, 320),
                (x - 32 + lf, 320),
            ],
            fill,
        )
        rect(d, (x - 8, 186, x + 8, 200), fill)
    else:
        kick = lf
        poly(d, [(x - 14, 186), (x + 14, 186), (x + 12 + kick, 320), (x - 12 + kick, 320)], fill)
    if kind == "camo":
        camo_fill(im)
    return im
    im = blank()
    d = ImageDraw.Draw(im)
    x = cx()
    fill = CAMO_A if kind == "camo" else JEANS
    if facing in ("front", "back"):
        poly(d, [(x - 30, 186), (x + 30, 186), (x + 32, 320), (x + 6, 320), (x + 4, 210), (x - 4, 210), (x - 6, 320), (x - 32, 320)], fill)
        rect(d, (x - 8, 186, x + 8, 200), fill)
    else:
        poly(d, [(x - 14, 186), (x + 14, 186), (x + 12, 320), (x - 12, 320)], fill)
    if kind == "camo":
        camo_fill(im)
    return im


def draw_socks(facing, step=0):
    im = blank()
    d = ImageDraw.Draw(im)
    x = cx()
    lf, rf = ([14, 4, -12, 4][step], [-8, 4, 14, 4][step])
    if facing in ("front", "back"):
        rect(d, (x - 30 + lf, 318, x - 8 + lf, 368), SOCK)
        rect(d, (x + 8 + rf, 318, x + 30 + rf, 368), SOCK)
    else:
        rect(d, (x - 12 + lf, 318, x + 12 + lf, 368), SOCK)
    return im


def draw_shoes(facing, step=0):
    im = blank()
    d = ImageDraw.Draw(im)
    x = cx()
    lf, rf = ([14, 4, -12, 4][step], [-8, 4, 14, 4][step])
    if facing in ("front", "back"):
        ellipse(d, (x - 36 + lf, 358, x - 4 + lf, 392), SHOE)
        ellipse(d, (x + 4 + rf, 358, x + 36 + rf, 392), SHOE)
        if facing == "front":
            rect(d, (x - 28 + lf, 378, x - 12 + lf, 386), SHOE_D)
            rect(d, (x + 12 + rf, 378, x + 28 + rf, 386), SHOE_D)
    elif facing == "right":
        ellipse(d, (x - 8 + lf, 358, x + 40 + lf, 392), SHOE)
        rect(d, (x + 16 + lf, 378, x + 34 + lf, 386), SHOE_D)
    else:
        ellipse(d, (x - 40 + lf, 358, x + 8 + lf, 392), SHOE)
        rect(d, (x - 34 + lf, 378, x - 16 + lf, 386), SHOE_D)
    return im


def draw_hair(facing):
    im = blank()
    d = ImageDraw.Draw(im)
    x = cx()
    if facing == "front":
        ellipse(d, (x - 30, 12, x + 30, 48), HAIR)
        poly(d, [(x - 28, 28), (x - 36, 70), (x - 22, 66), (x - 18, 40)], HAIR)
        poly(d, [(x + 28, 28), (x + 36, 70), (x + 22, 66), (x + 18, 40)], HAIR)
        # bangs
        poly(d, [(x - 20, 30), (x - 8, 48), (x + 8, 48), (x + 20, 30), (x, 22)], HAIR_D)
    elif facing == "back":
        ellipse(d, (x - 30, 12, x + 30, 52), HAIR)
        # braid / pony
        poly(d, [(x - 8, 48), (x + 8, 48), (x + 6, 140), (x - 6, 140)], HAIR)
        ellipse(d, (x - 10, 128, x + 10, 168), HAIR_D)
        for i in range(4):
            ellipse(d, (x - 9, 52 + i * 20, x + 9, 72 + i * 20), HAIR if i % 2 == 0 else HAIR_D)
    elif facing == "right":
        ellipse(d, (x - 20, 12, x + 24, 52), HAIR)
        poly(d, [(x - 8, 40), (x - 4, 150), (x + 10, 148), (x + 8, 44)], HAIR)
        ellipse(d, (x - 8, 140, x + 12, 172), HAIR_D)
        poly(d, [(x + 8, 28), (x + 22, 46), (x + 6, 44)], HAIR_D)
    else:
        ellipse(d, (x - 24, 12, x + 20, 52), HAIR)
        poly(d, [(x + 8, 40), (x + 4, 150), (x - 10, 148), (x - 8, 44)], HAIR)
        ellipse(d, (x - 12, 140, x + 8, 172), HAIR_D)
        poly(d, [(x - 8, 28), (x - 22, 46), (x - 6, 44)], HAIR_D)
    return im


def draw_weapon(facing, frame=0):
    """frame 0 idle down, 1 raise, 2 swing across."""
    im = blank()
    d = ImageDraw.Draw(im)
    x = cx()
    # crowbar-ish
    def bar(x0, y0, x1, y1, w=5):
        d.line([(x0, y0), (x1, y1)], fill=STEEL, width=w)

    if facing == "front":
        if frame == 0:
            bar(x + 48, 210, x + 54, 300)
            ellipse(d, (x + 44, 292, x + 62, 310), STEEL)
        elif frame == 1:
            bar(x + 50, 90, x + 58, 200)
        else:
            bar(x - 20, 70, x + 70, 110)
    elif facing == "back":
        if frame == 0:
            bar(x - 54, 210, x - 48, 300)
        elif frame == 1:
            bar(x - 58, 90, x - 50, 200)
        else:
            bar(x - 70, 70, x + 20, 110)
    elif facing == "right":
        if frame == 0:
            bar(x + 28, 214, x + 34, 305)
        elif frame == 1:
            bar(x + 30, 80, x + 36, 190)
        else:
            bar(x - 10, 60, x + 80, 100)
    else:
        if frame == 0:
            bar(x - 34, 214, x - 28, 305)
        elif frame == 1:
            bar(x - 36, 80, x - 30, 190)
        else:
            bar(x - 80, 60, x + 10, 100)
    return im


def composite(layers):
    im = blank()
    for layer in layers:
        im = Image.alpha_composite(im, layer)
    return im


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for f in FACINGS:
        save(draw_skin(f), "skin", f)
        save(draw_shirt(f, "tee"), "tee", f)
        save(draw_shirt(f, "tank"), "tank", f)
        save(draw_pants(f, "camo"), "camo", f)
        save(draw_pants(f, "jeans"), "jeans", f)
        save(draw_socks(f), "socks", f)
        save(draw_shoes(f), "shoes", f)
        save(draw_hair(f), "hair", f)
        for fr in range(3):
            save(draw_weapon(f, fr), f"weapon{fr}", f)
        for step in range(4):
            baked = composite(
                [
                    draw_skin(f, step),
                    draw_socks(f, step),
                    draw_shoes(f, step),
                    draw_pants(f, "camo", step),
                    draw_shirt(f, "tee"),
                    draw_hair(f),
                    draw_weapon(f, 0),
                ]
            )
            baked.save(OUT / f"walk-{f}-{step}.png")
    print("wrote", len(list(OUT.glob("*.png"))), "pngs to", OUT)


if __name__ == "__main__":
    main()

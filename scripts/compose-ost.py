#!/usr/bin/env python3
"""Original ASH STATE instrumentals — combat / end / occupy.

Not SUNO: additive + FM + noise percussion + comb reverb, composed in D minor.
"""
from __future__ import annotations

import math
from pathlib import Path

import numpy as np

SR = 44100


def midi(m: float) -> float:
    return 440.0 * (2.0 ** ((m - 69.0) / 12.0))


def env_adsr(n: int, a: float, d: float, s: float, r: float, sustain_lvl: float = 0.7) -> np.ndarray:
    a_n = max(1, int(a * SR))
    d_n = max(1, int(d * SR))
    r_n = max(1, int(r * SR))
    s_n = max(0, n - a_n - d_n - r_n)
    e = np.empty(n, dtype=np.float32)
    e[:a_n] = np.linspace(0, 1, a_n, dtype=np.float32)
    if d_n:
        start = a_n
        e[start : start + d_n] = np.linspace(1, sustain_lvl, d_n, dtype=np.float32)
    if s_n:
        e[a_n + d_n : a_n + d_n + s_n] = sustain_lvl
    tail = n - (a_n + d_n + s_n)
    if tail > 0:
        e[-tail:] = np.linspace(sustain_lvl, 0, tail, dtype=np.float32)
    return e


def noise(n: int, seed: int) -> np.ndarray:
    rng = np.random.default_rng(seed)
    return rng.standard_normal(n).astype(np.float32)


def pan_stereo(mono: np.ndarray, pan: float) -> np.ndarray:
    ang = (pan + 1.0) * 0.25 * math.pi
    l = math.cos(ang)
    r = math.sin(ang)
    out = np.empty((len(mono), 2), dtype=np.float32)
    out[:, 0] = mono * l
    out[:, 1] = mono * r
    return out


def add_at(buf: np.ndarray, start: int, stereo: np.ndarray) -> None:
    if start >= len(buf):
        return
    n = min(len(stereo), len(buf) - start)
    if n <= 0:
        return
    buf[start : start + n] += stereo[:n]


def comb_reverb(stereo: np.ndarray, wet: float = 0.28) -> np.ndarray:
    delays = [int(0.0297 * SR), int(0.0371 * SR), int(0.0411 * SR), int(0.0437 * SR)]
    g = 0.77
    acc = np.zeros_like(stereo)
    for d in delays:
        padded = np.zeros_like(stereo)
        padded[d:] = stereo[:-d] * g
        acc += padded
    acc *= 0.25
    mix = stereo * (1.0 - wet) + acc * wet
    return mix.astype(np.float32)


def piano(dur: float, freq: float, vel: float = 0.5, seed: int = 1) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    e = np.exp(-t * 3.4).astype(np.float32) * (1.0 - np.exp(-t * 90.0)).astype(np.float32)
    s = np.zeros(n, dtype=np.float32)
    amps = (1.0, 0.62, 0.34, 0.18, 0.11, 0.07, 0.045, 0.028, 0.016)
    for i, a in enumerate(amps):
        det = 1.0 + i * 0.00035
        s += a * np.sin(2 * np.pi * freq * (i + 1) * det * t).astype(np.float32)
    hammer = noise(n, seed) * np.exp(-t * 55.0).astype(np.float32) * 0.11
    return (vel * e * (s * 0.22 + hammer)).astype(np.float32)


def cello(dur: float, freq: float, vel: float = 0.4) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    e = env_adsr(n, 0.18, 0.4, max(0.0, dur - 0.9), 0.55, 0.75)
    vib = 1.0 + 0.0035 * np.sin(2 * np.pi * 5.1 * t)
    phase = np.cumsum(freq * vib) / SR
    saw = 2.0 * (phase - np.floor(phase + 0.5))
    sine = np.sin(2 * np.pi * phase)
    raw = 0.55 * saw + 0.45 * sine
    # cheap brightness roll-off
    raw = raw.astype(np.float32)
    return (vel * e * raw * 0.22).astype(np.float32)


def pad(dur: float, freqs: list[float], vel: float = 0.3, seed: int = 3) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    e = env_adsr(n, 1.6, 0.8, max(0.0, dur - 3.2), 2.0, 0.85)
    s = np.zeros(n, dtype=np.float32)
    rng = np.random.default_rng(seed)
    for f in freqs:
        for det in (-0.008, 0.0, 0.009):
            ph = (f * (1.0 + det) * t + float(rng.random())) % 1.0
            s += (2.0 * ph - 1.0) * 0.15
    s = s.astype(np.float32)
    return (vel * e * s * 0.18).astype(np.float32)


def bass(dur: float, freq: float, vel: float = 0.55) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    e = np.exp(-t * 4.8).astype(np.float32) * (1.0 - np.exp(-t * 70.0)).astype(np.float32)
    drop = freq * np.exp(-t * 1.8) + freq * 0.55
    tone = np.sin(2 * np.pi * np.cumsum(drop) / SR)
    harm = 0.35 * np.sin(4 * np.pi * np.cumsum(drop) / SR)
    return (vel * e * (tone + harm) * 0.42).astype(np.float32)


def kick(dur: float = 0.45, seed: int = 9) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    f = 145.0 * np.exp(-t * 16.5) + 36.0
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.2)
    click = noise(n, seed) * np.exp(-t * 80.0) * 0.22
    return (body + click).astype(np.float32) * 0.9


def hat(dur: float = 0.09, open_: bool = False, seed: int = 11) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    decay = 18.0 if open_ else 55.0
    x = noise(n, seed)
    # crude highpass
    x = np.diff(x, prepend=x[:1]) * 0.7
    return (x * np.exp(-t * decay) * (0.22 if open_ else 0.14)).astype(np.float32)


def snare(dur: float = 0.28, seed: int = 13) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    tone = np.sin(2 * np.pi * 180.0 * t) * np.exp(-t * 14.0) * 0.25
    nse = noise(n, seed) * np.exp(-t * 12.0) * 0.55
    return (tone + nse).astype(np.float32) * 0.55


def heartbeat(dur: float = 0.7, seed: int = 17) -> np.ndarray:
    n = int(dur * SR)
    out = np.zeros(n, dtype=np.float32)
    lub = kick(0.28, seed) * 0.85
    dub = kick(0.32, seed + 1) * 0.55
    out[: len(lub)] += lub
    off = int(0.22 * SR)
    end = min(n, off + len(dub))
    out[off:end] += dub[: end - off]
    return out


def drone(dur: float, freq: float, vel: float = 0.2) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    e = env_adsr(n, 2.2, 1.0, max(0.0, dur - 5.0), 2.4, 0.9)
    a = np.sin(2 * np.pi * freq * t)
    b = np.sin(2 * np.pi * freq * 1.005 * t)
    c = np.sin(2 * np.pi * (freq * 0.5) * t) * 0.6
    return (vel * e * (a + b + c) * 0.18).astype(np.float32)


def wind(n: int, seed: int = 21) -> np.ndarray:
    x = noise(n, seed)
    # very slow amplitude
    t = np.arange(n, dtype=np.float32) / SR
    amp = 0.5 + 0.5 * np.sin(2 * np.pi * 0.07 * t)
    # integrate = lowpass-ish
    acc = np.cumsum(x) / 80.0
    acc = acc - np.mean(acc)
    acc = np.clip(acc, -3, 3) / 3.0
    return (acc * amp * 0.04).astype(np.float32)


def normalize(stereo: np.ndarray, peak: float = 0.92) -> np.ndarray:
    m = float(np.max(np.abs(stereo))) + 1e-9
    y = stereo * (peak / m)
    # soft clip
    y = np.tanh(y * 1.15) / math.tanh(1.15)
    return y.astype(np.float32)


def loop_xfade(stereo: np.ndarray, sec: float = 0.18) -> np.ndarray:
    n = int(sec * SR)
    n = min(n, len(stereo) // 8)
    fade = np.linspace(0.0, 1.0, n, dtype=np.float32)[:, None]
    y = stereo.copy()
    y[-n:] = y[-n:] * (1.0 - fade) + y[:n] * fade
    return y


def write_wav(path: Path, stereo: np.ndarray) -> None:
    import wave
    import struct

    pcm = np.clip(stereo, -1.0, 1.0)
    i16 = (pcm * 32767.0).astype(np.int16)
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(i16.tobytes())


def bars_to_samples(bars: int, bpm: float) -> int:
    return int(bars * 4 * 60.0 / bpm * SR)


def beat_to_sample(beat: float, bpm: float) -> int:
    return int(beat * 60.0 / bpm * SR)


# --- compositions ----------------------------------------------------------


def compose_combat() -> np.ndarray:
    bpm = 96.0
    bars = 32
    n = bars_to_samples(bars, bpm)
    buf = np.zeros((n, 2), dtype=np.float32)
    # bed
    add_at(buf, 0, pan_stereo(drone(n / SR, midi(38), 0.28), 0.0))
    add_at(buf, 0, pan_stereo(drone(n / SR, midi(45), 0.16), -0.4))
    add_at(buf, 0, pan_stereo(drone(n / SR, midi(51), 0.1), 0.45))
    add_at(buf, 0, pan_stereo(wind(n, 4), 0.1))

    # heartbeat throughout, slightly ahead of the kick
    hb_period = 2.0  # seconds, anxious
    t0 = 0
    k = 0
    while t0 < n:
        add_at(buf, t0, pan_stereo(heartbeat(0.7, 30 + k) * 0.55, 0.0))
        t0 += int(hb_period * SR)
        k += 1

    # kicks on 1 and 3 from bar 4
    for bar in range(4, bars):
        for beat in (0.0, 2.0):
            s = beat_to_sample(bar * 4 + beat, bpm)
            add_at(buf, s, pan_stereo(kick(0.4, 40 + bar) * 0.7, 0.0))

    # ticking hats from bar 8
    for bar in range(8, bars):
        for b in range(8):
            s = beat_to_sample(bar * 4 + b * 0.5, bpm)
            open_ = b % 4 == 3 and bar >= 16
            add_at(buf, s, pan_stereo(hat(0.12 if open_ else 0.07, open_, 50 + bar * 8 + b) * 0.7, 0.25 if b % 2 else -0.2))

    # bass pulse from bar 8: D C Bb A  (root motion)
    roots = [50, 48, 46, 45]  # D3 C3 Bb2 A2 midi
    for bar in range(8, bars):
        f = midi(roots[bar % 4])
        s = beat_to_sample(bar * 4, bpm)
        add_at(buf, s, pan_stereo(bass(1.6, f, 0.62), 0.0))
        if bar >= 16:
            s2 = beat_to_sample(bar * 4 + 2.0, bpm)
            add_at(buf, s2, pan_stereo(bass(0.7, f * 1.5, 0.28), 0.1))

    # dissonant string pads every 4 bars from bar 12
    chords = [
        [midi(50), midi(56), midi(62)],  # D F Ab  (dark)
        [midi(48), midi(55), midi(60)],  # C E G
        [midi(46), midi(53), midi(58)],  # Bb D F
        [midi(45), midi(52), midi(61)],  # A C# Ab (ugly)
    ]
    for bar in range(12, bars, 4):
        ch = chords[(bar // 4) % 4]
        s = beat_to_sample(bar * 4, bpm)
        add_at(buf, s, pan_stereo(pad(4 * 4 * 60 / bpm, ch, 0.38, 70 + bar), -0.35))
        add_at(buf, s, pan_stereo(pad(4 * 4 * 60 / bpm, [c * 2 for c in ch[:2]], 0.18, 90 + bar), 0.4))

    # piano stabs from bar 16
    stabs = [62, 68, 65, 61]  # D5 Ab5 F5 C#5
    for bar in range(16, bars):
        if bar % 2:
            continue
        note = stabs[(bar // 2) % 4]
        s = beat_to_sample(bar * 4, bpm)
        add_at(buf, s, pan_stereo(piano(1.8, midi(note), 0.42, 100 + bar), -0.15))
        add_at(buf, s, pan_stereo(piano(1.8, midi(note - 12), 0.28, 110 + bar), 0.2))
        if bar >= 24:
            s2 = beat_to_sample(bar * 4 + 2.5, bpm)
            add_at(buf, s2, pan_stereo(piano(0.7, midi(note + 3), 0.22, 120 + bar), 0.35))

    # last 2 bars drop hats, leave drone + heartbeat for loop
    return loop_xfade(comb_reverb(normalize(buf, 0.9), 0.32), 0.22)


def compose_end() -> np.ndarray:
    bpm = 54.0
    bars = 16
    n = bars_to_samples(bars, bpm)
    buf = np.zeros((n, 2), dtype=np.float32)
    add_at(buf, 0, pan_stereo(drone(n / SR, midi(26), 0.34), 0.0))  # D1
    add_at(buf, 0, pan_stereo(drone(n / SR, midi(38), 0.18), -0.25))
    add_at(buf, 0, pan_stereo(wind(n, 8) * 1.4, 0.0))

    # cello long tones
    cello_line = [38, 37, 36, 38, 41, 39, 38, 33]  # D C# C D F E D A
    bar_len = 4 * 60.0 / bpm
    for i, m in enumerate(cello_line):
        s = beat_to_sample(i * 8, bpm)  # 2 bars each
        add_at(buf, s, pan_stereo(cello(bar_len * 2.15, midi(m), 0.48), 0.22))

    # piano melody (two-bar phrases)
    melody = [
        (0.0, 62, 1.6),
        (2.0, 65, 1.4),
        (4.0, 69, 1.8),
        (6.0, 67, 1.5),
        (8.0, 65, 1.4),
        (10.0, 64, 1.2),
        (12.0, 62, 2.0),
        (16.0, 57, 2.2),
        (20.0, 58, 1.6),
        (22.0, 60, 1.4),
        (24.0, 62, 1.8),
        (26.0, 65, 1.5),
        (28.0, 64, 1.4),
        (30.0, 62, 1.2),
        (32.0, 60, 1.6),
        (36.0, 62, 3.4),
        (40.0, 57, 1.8),
        (44.0, 53, 2.2),
        (48.0, 50, 4.0),
        (52.0, 62, 1.5),
        (54.0, 60, 1.5),
        (56.0, 58, 2.0),
        (60.0, 57, 3.5),
    ]
    for beat, m, dur in melody:
        s = beat_to_sample(beat, bpm)
        add_at(buf, s, pan_stereo(piano(dur, midi(m), 0.52, 200 + int(beat * 3)), -0.18))
        add_at(buf, s, pan_stereo(piano(dur * 0.9, midi(m - 12), 0.22, 250 + int(beat)), 0.28))

    # sparse high bell
    for beat in (7.5, 23.5, 39.5, 55.5):
        s = beat_to_sample(beat, bpm)
        t = np.arange(int(2.4 * SR), dtype=np.float32) / SR
        bell = np.sin(2 * np.pi * midi(81) * t) * np.exp(-t * 1.6) * 0.12
        bell += 0.4 * np.sin(2 * np.pi * midi(81) * 2.003 * t) * np.exp(-t * 2.1)
        add_at(buf, s, pan_stereo(bell.astype(np.float32), 0.55))

    return loop_xfade(comb_reverb(normalize(buf, 0.88), 0.4), 0.4)


def compose_occupy() -> np.ndarray:
    bpm = 76.0
    bars = 24
    n = bars_to_samples(bars, bpm)
    buf = np.zeros((n, 2), dtype=np.float32)
    add_at(buf, 0, pan_stereo(drone(n / SR, midi(38), 0.2), 0.0))
    add_at(buf, 0, pan_stereo(drone(n / SR, midi(45), 0.12), 0.3))
    add_at(buf, 0, pan_stereo(wind(n, 12) * 0.8, -0.1))

    # soft kick on 1 from bar 4
    for bar in range(4, bars):
        s = beat_to_sample(bar * 4, bpm)
        add_at(buf, s, pan_stereo(kick(0.5, 300 + bar) * 0.38, 0.0))
        if bar % 2 == 1:
            s2 = beat_to_sample(bar * 4 + 2.5, bpm)
            add_at(buf, s2, pan_stereo(snare(0.22, 310 + bar) * 0.18, 0.1))

    # piano ostinato D-A-F-A / G-A-E-A
    ost = [62, 57, 65, 57, 67, 57, 64, 57]
    for bar in range(bars):
        for i, m in enumerate(ost):
            s = beat_to_sample(bar * 4 + i * 0.5, bpm)
            vel = 0.28 if i % 2 else 0.4
            add_at(buf, s, pan_stereo(piano(0.7, midi(m), vel, 400 + bar * 8 + i), -0.22 + (i % 3) * 0.12))

    # cello countermelody from bar 8
    counter = [50, 53, 55, 57, 58, 57, 55, 53]
    for i, m in enumerate(counter):
        bar = 8 + i * 2
        if bar >= bars:
            break
        s = beat_to_sample(bar * 4, bpm)
        add_at(buf, s, pan_stereo(cello(4 * 2 * 60 / bpm, midi(m), 0.36), 0.32))

    # string pad lift bars 12-20
    for bar in (12, 16, 20):
        s = beat_to_sample(bar * 4, bpm)
        ch = [midi(50), midi(57), midi(62), midi(65)]
        add_at(buf, s, pan_stereo(pad(4 * 4 * 60 / bpm, ch, 0.32, 500 + bar), -0.3))

    # closing resolve last 4 bars: high D
    s = beat_to_sample(20 * 4, bpm)
    add_at(buf, s, pan_stereo(piano(6.0, midi(74), 0.45, 600), 0.15))
    add_at(buf, s, pan_stereo(piano(6.0, midi(69), 0.3, 601), -0.2))

    return loop_xfade(comb_reverb(normalize(buf, 0.9), 0.3), 0.22)


def to_mp3(wav: Path, mp3: Path) -> None:
    import subprocess

    subprocess.check_call(
        ["ffmpeg", "-y", "-i", str(wav), "-codec:a", "libmp3lame", "-q:a", "4", "-ar", "44100", str(mp3)],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def main() -> None:
    out = Path("/workspace/public/game/music")
    tmp = Path("/tmp/ash-ost")
    tmp.mkdir(parents=True, exist_ok=True)
    jobs = [
        ("combat", compose_combat),
        ("end", compose_end),
        ("occupy", compose_occupy),
    ]
    for name, fn in jobs:
        print(f"composing {name}…", flush=True)
        stereo = fn()
        wav = tmp / f"{name}.wav"
        write_wav(wav, stereo)
        to_mp3(wav, out / f"{name}.mp3")
        print(f"  -> {out / f'{name}.mp3'}  {stereo.shape[0] / SR:.1f}s", flush=True)


if __name__ == "__main__":
    main()

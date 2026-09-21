import { asset } from "./asset";

let ctx: AudioContext | null = null;
let muted = false;
let master: GainNode | null = null;
let sfxBus: GainNode | null = null;

type Mood = "off" | "title" | "hub" | "mission" | "occupy" | "end";

const TRACKS: Record<Exclude<Mood, "off"> | "combat", string> = {
  title: "/game/music/title.mp3",
  hub: "/game/music/hub.mp3",
  mission: "/game/music/mission.mp3",
  occupy: "/game/music/occupy.mp3",
  end: "/game/music/end.mp3",
  combat: "/game/music/combat.mp3",
};

const VOL: Record<Exclude<Mood, "off"> | "combat", number> = {
  title: 0.62,
  hub: 0.52,
  mission: 0.58,
  occupy: 0.55,
  end: 0.5,
  combat: 0.64,
};

let wanted: Mood = "title";
let bgmMood: Mood = "off";
let loading: Mood | "off" | null = null;
let current: HTMLAudioElement | null = null;
let fading: HTMLAudioElement | null = null;
let fadeRaf = 0;
let tensionTarget = 0;
let tension = 0;
let mixRaf = 0;
let combat: HTMLAudioElement | null = null;

function clampVol(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C({ latencyHint: "interactive" });
    master = ctx.createGain();
    sfxBus = ctx.createGain();
    master.gain.value = 1;
    sfxBus.gain.value = 0.9;
    sfxBus.connect(master);
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function killFade() {
  if (fadeRaf) cancelAnimationFrame(fadeRaf);
  fadeRaf = 0;
}

const pool: Partial<Record<Exclude<Mood, "off"> | "combat", HTMLAudioElement>> = {};

function elFor(mood: Exclude<Mood, "off"> | "combat"): HTMLAudioElement | null {
  if (typeof document === "undefined") return null;
  if (pool[mood]) return pool[mood]!;
  const el = document.createElement("audio");
  el.src = asset(TRACKS[mood]);
  el.loop = true;
  el.preload = "auto";
  el.setAttribute("data-bgm", mood);
  el.setAttribute("playsinline", "");
  el.style.display = "none";
  document.body.appendChild(el);
  pool[mood] = el;
  return el;
}

function fadeSwap(next: HTMLAudioElement | null, toVol: number, ms = 900) {
  killFade();
  const from = current && current !== next ? current : null;
  fading = from;
  current = next;
  const t0 = performance.now();
  const startFrom = from ? from.volume : 0;
  const tick = (now: number) => {
    const k = Math.min(1, (now - t0) / ms);
    if (from) from.volume = clampVol(startFrom * (1 - k));
    if (next) {
      const duck = bgmMood === "mission" ? 1 - tension * 0.42 : 1;
      next.volume = clampVol(toVol * k * duck);
    }
    if (k < 1) {
      fadeRaf = requestAnimationFrame(tick);
      return;
    }
    if (from && from !== next) {
      from.pause();
      from.currentTime = 0;
    }
    fading = null;
  };
  fadeRaf = requestAnimationFrame(tick);
}

function playMood(mood: Exclude<Mood, "off">) {
  if (typeof window === "undefined") return;
  const el = elFor(mood);
  if (!el) return;
  if (bgmMood === mood && !el.paused) return;
  if (loading === mood) return;
  loading = mood;
  el.volume = 0;
  const p = el.play();
  if (!p) {
    loading = null;
    return;
  }
  void p
    .then(() => {
      loading = null;
      bgmMood = mood;
      fadeSwap(el, muted ? 0 : VOL[mood]);
      mixCombat();
    })
    .catch(() => {
      loading = null;
    });
}

function stopBgm() {
  bgmMood = "off";
  fadeSwap(null, 0, 400);
  if (combat) {
    combat.pause();
    combat.volume = 0;
  }
}

function mixCombat() {
  if (mixRaf) return;
  const step = () => {
    mixRaf = 0;
    tension += (tensionTarget - tension) * 0.08;
    if (muted || bgmMood !== "mission") {
      if (combat) combat.volume = 0;
      if (current && bgmMood !== "off") current.volume = clampVol(VOL[bgmMood]);
      if (Math.abs(tensionTarget - tension) > 0.01) mixRaf = requestAnimationFrame(step);
      return;
    }
    if (current) current.volume = clampVol(VOL.mission * (1 - tension * 0.42));
    if (tension > 0.08) {
      if (!combat) combat = elFor("combat");
      if (combat && combat.paused) void combat.play().catch(() => {});
      if (combat) combat.volume = clampVol(VOL.combat * tension);
    } else if (combat) {
      combat.volume = clampVol(combat.volume * 0.9);
    }
    if (Math.abs(tensionTarget - tension) > 0.008 || (combat && combat.volume > 0.01)) {
      mixRaf = requestAnimationFrame(step);
    }
  };
  mixRaf = requestAnimationFrame(step);
}

export function unlockAudio() {
  ac();
  if (wanted !== "off" && wanted !== bgmMood) playMood(wanted);
}

export function setMuted(v: boolean) {
  muted = v;
  if (v) {
    if (current) current.volume = 0;
    if (combat) combat.volume = 0;
    if (master) master.gain.value = 0;
  } else {
    if (master) master.gain.value = 1;
    if (wanted !== "off") playMood(wanted);
  }
}

export function setBgm(mood: Mood) {
  wanted = mood;
  if (muted || mood === "off") {
    stopBgm();
    return;
  }
  playMood(mood);
}

export function setTension(n: number) {
  tensionTarget = clampVol(n);
  mixCombat();
}

function beep(freq: number, dur = 0.08, type: OscillatorType = "square", gain = 0.04) {
  if (muted) return;
  const c = ac();
  if (!c || !sfxBus) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime);
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g);
  g.connect(sfxBus);
  o.start();
  o.stop(c.currentTime + dur);
}

export function click() {
  beep(220, 0.05, "square", 0.03);
}

export function ok() {
  beep(330, 0.07, "triangle", 0.04);
  setTimeout(() => beep(440, 0.08, "triangle", 0.03), 60);
}

export function warn() {
  beep(140, 0.12, "sawtooth", 0.04);
}

export function hit() {
  beep(90, 0.1, "sawtooth", 0.05);
}

export function pickup() {
  beep(520, 0.06, "triangle", 0.035);
}

export function swing() {
  beep(180, 0.07, "square", 0.03);
}

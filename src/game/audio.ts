let ctx: AudioContext | null = null;
let muted = false;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function unlockAudio() {
  ac();
}

export function setMuted(v: boolean) {
  muted = v;
}

export function tone(freq: number, dur = 0.08, type: OscillatorType = "square", gain = 0.04) {
  if (muted) return;
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime);
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g);
  g.connect(c.destination);
  o.start();
  o.stop(c.currentTime + dur);
}

export function click() {
  tone(220, 0.05, "square", 0.03);
}

export function ok() {
  tone(330, 0.07, "triangle", 0.04);
  setTimeout(() => tone(440, 0.08, "triangle", 0.03), 60);
}

export function warn() {
  tone(140, 0.12, "sawtooth", 0.04);
}

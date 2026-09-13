export function stepRng(r: number): { r: number; n: number } {
  let a = (r + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  const n = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return { r: a, n };
}

export function roll(r: number): { r: number; n: number } {
  return stepRng(r);
}

export function range(r: number, min: number, max: number): { r: number; n: number } {
  const s = stepRng(r);
  return { r: s.r, n: min + Math.floor(s.n * (max - min + 1)) };
}

export function pick<T>(r: number, arr: readonly T[]): { r: number; item: T } {
  const s = range(r, 0, arr.length - 1);
  return { r: s.r, item: arr[s.n] };
}

export function chance(r: number, p: number): { r: number; ok: boolean } {
  const s = stepRng(r);
  return { r: s.r, ok: s.n < p };
}

export function jitter(r: number, base: number, spread: number): { r: number; n: number } {
  const s = range(r, -spread, spread);
  return { r: s.r, n: Math.max(0, base + s.n) };
}

export function uid(r: number): { r: number; id: string } {
  const a = stepRng(r);
  const b = stepRng(a.r);
  return { r: b.r, id: (a.n * 1e9 + b.n * 1e6).toString(36).slice(0, 8) };
}

/** "web" and "demo" lock twenty states. "full" is Android and the Steam release. */
declare const __OMN_EDITION__: string;

export type Edition = "web" | "demo" | "full";

export const EDITION: Edition = (() => {
  try {
    if (__OMN_EDITION__ === "web") return "web";
    if (__OMN_EDITION__ === "demo") return "demo";
    return "full";
  } catch {
    return "full";
  }
})();

/** Twenty states around the Kentucky start, still including Chicago. */
export const WEB_STATES = new Set([
  "ky",
  "oh",
  "in",
  "il",
  "tn",
  "mo",
  "wi",
  "mi",
  "pa",
  "ia",
  "ar",
  "al",
  "ms",
  "wv",
  "va",
  "nc",
  "ga",
  "sc",
  "ks",
  "ok",
]);

export const WEB_STATE_LIST = [...WEB_STATES];

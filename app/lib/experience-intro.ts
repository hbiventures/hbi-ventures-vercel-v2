export const INTRO_SEEN_KEY = "hbi-platform-intro-v1-seen";

export function introMode(options: {
  seen: boolean; hash: string; scrollY: number; reducedMotion: boolean;
  saveData: boolean;
}): "hidden" | "static" | "video" {
  if (options.seen || options.hash || options.scrollY > 80) return "hidden";
  return options.reducedMotion || options.saveData ? "static" : "video";
}

export const INTRO_SEEN_KEY = "hbi-platform-intro-v1-seen";

/** Select once per playback, before mounting media: never download two films. */
export function introMedia(viewportWidth: number) {
  const portrait = viewportWidth <= 700;
  return {
    portrait,
    video: portrait ? "/intro/platform-story-mobile-v1.mp4" : "/intro/platform-story-v1.mp4",
    poster: portrait ? "/intro/platform-story-mobile-poster.webp" : "/intro/platform-story-poster.webp",
    width: portrait ? 720 : 960,
    height: portrait ? 900 : 540,
  };
}

export function introMode(options: {
  seen: boolean; hash: string; scrollY: number; reducedMotion: boolean;
  saveData: boolean;
}): "hidden" | "static" | "video" {
  if (options.seen || options.hash || options.scrollY > 80) return "hidden";
  return options.reducedMotion || options.saveData ? "static" : "video";
}

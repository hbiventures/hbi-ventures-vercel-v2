export type VoiceActivity = { hearing: boolean; responding: boolean; output: boolean };
export const initialVoiceActivity: VoiceActivity = { hearing: false, responding: false, output: false };
export type VoiceVisualState = "ready" | "connecting" | "listening" | "hearing" | "thinking" | "speaking" | "muted" | "paused" | "ended";

// Generation completion is not playback completion. Keep the speaking state
// until the Realtime output buffer drains or is cleared on interruption.
export function nextVoiceActivity(current: VoiceActivity, event: { type?: string }): VoiceActivity {
  switch (event.type) {
    case "input_audio_buffer.speech_started": return { hearing: true, responding: false, output: false };
    case "input_audio_buffer.speech_stopped": return { ...current, hearing: false, responding: true };
    case "response.created": return { ...current, responding: true };
    case "output_audio_buffer.started": return { ...current, output: true };
    case "output_audio_buffer.stopped":
    case "output_audio_buffer.cleared": return { ...current, output: false, responding: false };
    case "response.done": return { ...current, responding: false };
    case "error": return { ...current, responding: false };
    default: return current;
  }
}

export function voiceVisualState(phase: "ready" | "connecting" | "live" | "ended", activity: VoiceActivity, muted: boolean, playbackPaused: boolean): VoiceVisualState {
  if (phase !== "live") return phase;
  if (activity.hearing && !muted) return "hearing";
  if (activity.output) return playbackPaused ? "paused" : "speaking";
  if (activity.responding) return "thinking";
  return muted ? "muted" : "listening";
}

export const voiceVisualLabels: Record<VoiceVisualState, string> = {
  ready: "Ready when you are",
  connecting: "Connecting with Marin…",
  listening: "Marin is listening",
  hearing: "Marin is listening to you",
  thinking: "Marin is preparing a reply",
  speaking: "Marin is speaking",
  muted: "Your microphone is muted",
  paused: "Marin’s audio is paused",
  ended: "Voice conversation ended",
};

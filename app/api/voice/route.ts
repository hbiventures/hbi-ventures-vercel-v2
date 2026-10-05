import { navigatorInstructions } from "../../lib/navigator";
import { platformProjects } from "../../lib/platform-projects";
import { assistantQuotaConfigured, assistantRateLimit } from "../../lib/assistant-rate-limit";
import { voiceInstructions, voiceOutputTokenLimit } from "../../lib/voice-session";

export const runtime = "nodejs";
export const maxDuration = 30;
export function GET() {
  const quotaReady = process.env.NODE_ENV !== "production" || assistantQuotaConfigured();
  return Response.json({ available: Boolean(process.env.HBI_VOICE_ENABLED === "true" && process.env.OPENAI_API_KEY && quotaReady) }, { headers: { "Cache-Control": "no-store" } });
}
export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  const fail = (error: string, status: number) => Response.json({ error }, { status, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin) return fail("Request origin was not accepted.", 403);
  if (!request.headers.get("content-type")?.startsWith("application/sdp")) return fail("Invalid voice request.", 400);
  // Deliberate rollout gate: verify model access, quotas and live audio before enabling.
  if (process.env.HBI_VOICE_ENABLED !== "true" || !process.env.OPENAI_API_KEY) return fail("Voice is not available yet. Please use the text conversation or Contact HBI.", 503);
  const limit = await assistantRateLimit(request, "voice");
  if (limit !== "ok") return fail(limit === "limited" ? "Voice limit reached. Please try again later." : "Voice is temporarily unavailable.", limit === "limited" ? 429 : 503);
  if (Number(request.headers.get("content-length")) > 20000) return fail("Voice request too large.", 413);
  const sdp = await request.text();
  if (sdp.length > 20000 || !sdp.startsWith("v=0")) return fail("Invalid voice request.", 400);
  const form = new FormData();
  form.set("sdp", sdp);
  form.set("session", JSON.stringify({
    type: "realtime", model: process.env.OPENAI_VOICE_MODEL || "gpt-realtime-2.1",
    instructions: `${navigatorInstructions(platformProjects)}\n${voiceInstructions}`,
    max_output_tokens: voiceOutputTokenLimit,
    audio: { input: { noise_reduction: { type: "near_field" }, transcription: { model: "gpt-4o-mini-transcribe" }, turn_detection: { type: "server_vad", threshold: 0.65, silence_duration_ms: 700, prefix_padding_ms: 300, interrupt_response: true, create_response: true } }, output: { voice: "marin" } },
  }));
  try {
    const response = await fetch("https://api.openai.com/v1/realtime/calls", { method: "POST", headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: form, signal: AbortSignal.any([request.signal, AbortSignal.timeout(20000)]) });
    if (!response.ok) return fail("Voice could not connect. Please use text or try again.", 502);
    return new Response(await response.text(), { headers: { ...headers, "Content-Type": "application/sdp" } });
  } catch { return fail("Voice could not connect. Please use text or try again.", 502); }
}

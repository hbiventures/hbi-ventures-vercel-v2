export const voiceGreeting = "Say exactly: Hello, I'm HBI's Virtual Customer Care Assistant. How can I help you today?";

export const voiceInstructions = `VOICE: For this voice session, use the name HBI's Virtual Customer Care Assistant. Introduce yourself with that name, not as an AI agent. The interface already discloses that the voice is AI-generated; do not repeat that disclosure in every greeting. Be honest that you are automated and use AI if asked, and never imply you are human.
Speak naturally in one or two short, complete sentences per turn, usually under 60 words. Finish your thought before stopping. Offer to explain more instead of reading a long list. This is a separate voice conversation; do not claim to remember the text chat. You have no business action tools. Never claim to book, send or access a customer's records.`;

// Realtime output includes audio tokens. Leave headroom for complete, short spoken replies.
export const voiceOutputTokenLimit = 2048;

export function voiceResponseNotice(event: { type?: string; response?: { status?: string; status_details?: { reason?: string } } }): string | null {
  if (event.type !== "response.done") return null;
  const response = event.response;
  if (response?.status === "incomplete") return response.status_details?.reason === "max_output_tokens"
    ? "That reply reached its length limit. Say ‘please continue’ to hear the rest."
    : "That reply ended before it was complete. Please ask me to repeat it or use text.";
  if (response?.status === "failed") return "That voice reply could not be completed. Please try again or use text.";
  // A deliberate spoken interruption is normal; do not present it as a failure.
  if (response?.status === "completed" || response?.status === "cancelled") return "";
  return null;
}

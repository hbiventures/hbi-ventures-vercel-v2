export const assistantInterests = [
  { id: "digital-experience", label: "Digital experiences" },
  { id: "assistant", label: "Virtual assistants" },
  { id: "integrations", label: "Integration services" },
  { id: "automation", label: "Workflow automation" },
  { id: "analytics", label: "Analytics & reporting" },
  { id: "academy", label: "STEAM Academy" },
  { id: "partnerships", label: "Foundation & partnerships" },
] as const;
export type AssistantInterest = typeof assistantInterests[number]["id"];
export function parseAssistantInterests(value: unknown): AssistantInterest[] {
  if (!Array.isArray(value)) return [];
  return assistantInterests.filter(item => value.includes(item.id)).map(item => item.id);
}
// Suggestions only, never represented as visitor-confirmed interests.
export function suggestInterests(text: string): AssistantInterest[] {
  const patterns = [/website|digital experience|hosting|design/i, /assistant|chatbot|voice/i, /integrat|api\b|crm|calendar|payment|form/i, /automat|workflow|follow.up|routing/i, /analytic|report|dashboard|campaign/i, /steam|academy|student|school/i, /foundation|partner|scholarship|sponsor/i];
  return assistantInterests.filter((_, index) => patterns[index].test(text)).map(item => item.id);
}
export function transcriptText(messages: readonly { role: string; text: string; failed?: boolean }[]) {
  return messages.filter(m => !m.failed && m.text.trim()).map(m => `${m.role === "user" ? "Visitor" : "HBI Customer Care Assistant"}: ${m.text}`).join("\n\n");
}
export const assistantHandoffKey = "hbi-assistant-handoff-v1";
export type AssistantHandoff = { version: 1; expiresAt: number; interests: AssistantInterest[]; transcript: string; transcriptApproved: boolean };
export function parseAssistantHandoff(raw: string | null): AssistantHandoff | null {
  try {
    if (!raw || raw.length > 70000) return null;
    const value = JSON.parse(raw);
    if (value?.version !== 1 || typeof value.expiresAt !== "number" || value.expiresAt < Date.now() || value.expiresAt > Date.now() + 31 * 60 * 1000) return null;
    if (typeof value.transcript !== "string" || value.transcript.length > 30000 || typeof value.transcriptApproved !== "boolean") return null;
    return { version: 1, expiresAt: value.expiresAt, interests: parseAssistantInterests(value.interests), transcriptApproved: value.transcriptApproved, transcript: value.transcriptApproved ? value.transcript : "" };
  } catch { return null; }
}

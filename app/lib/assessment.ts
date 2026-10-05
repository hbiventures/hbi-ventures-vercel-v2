export const assessmentStorageKey = "hbi-approved-assessment-v1";
export const assessmentInterest = "AI Automation Assessment";
export const briefFields = [
  ["challenge", "Organizational challenge"],
  ["process", "Current process"],
  ["workflow", "Proposed AI-assisted workflow"],
  ["review", "Human review points"],
  ["integrations", "Possible integrations"],
  ["mvp", "Suggested MVP"],
  ["value", "Potential operational value"],
  ["next", "Recommended next step"],
] as const;
export type Brief = Record<(typeof briefFields)[number][0], string>;
export type ApprovedAssessment = { version: 1; approved: true; organization: string; message: string; interest?: "HBI Innovation Foundry" };

export function createGuidedBrief(challenge: string, process: string, tools: string): Brief {
  return {
    challenge,
    process,
    workflow: "Suggested starting point: capture incoming information, prepare an AI-assisted draft, route it to a person for review, then update the agreed system after approval.",
    review: "Your team checks accuracy, exceptions and sensitive information before any action is taken.",
    integrations: tools.trim() || "To identify together. Access, data availability and permissions need confirmation.",
    mvp: "Pilot one repeatable workflow with a small sample and a named reviewer before expanding.",
    value: "Potential to reduce repetitive handling and improve consistency. Establish a baseline and measure results during the pilot; no savings estimate yet.",
    next: "Discuss the challenge with HBI Innovation Foundry to confirm scope, feasibility and a first pilot.",
  };
}

export function serializeBrief(brief: Brief): string {
  return ["Automation Opportunity Brief — visitor-reviewed guided draft", ...briefFields.map(([key, label]) => `${label}:\n${brief[key].trim()}`)].join("\n\n");
}

export function parseApprovedAssessment(raw: string | null): ApprovedAssessment | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const item = value as Record<string, unknown>;
    if (item.version !== 1 || item.approved !== true || typeof item.organization !== "string" || item.organization.length > 160 || typeof item.message !== "string" || !item.message.trim() || item.message.length > 5000) return null;
    if (item.interest !== undefined && item.interest !== "HBI Innovation Foundry") return null;
    return { version: 1, approved: true, organization: item.organization, message: item.message, ...(item.interest === "HBI Innovation Foundry" ? { interest: item.interest } : {}) };
  } catch { return null; }
}

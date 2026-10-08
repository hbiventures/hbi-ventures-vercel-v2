/** Capability interests, not packages. Existing internal codes preserve link/analytics compatibility. */
export const engagementOffers = [
  { id: "digital-experience", label: "Digital experience" },
  { id: "integrations", label: "API & business-tool integration" },
  { id: "automation", label: "Workflow automation" },
  { id: "assistant", label: "Virtual assistants" },
  { id: "analytics", label: "Analytics & reporting" },
] as const;

export type EngagementOffer = typeof engagementOffers[number]["id"];
export const engagementEntries = ["hero", "offer", "lia", "ejc", "steam", "closing", "header", "foundry", "virtual-front-desk", "assessment", "direct"] as const;
export type EngagementEntry = typeof engagementEntries[number];

export const contactInterests = [
  "AI Automation Assessment", "HBI STEAM Academy", "HBI Innovation Foundry",
  "Web Application Development", "Solutions Architecture", "Product Development",
  "AI Agent Development", "HBI Foundation", "Corporate Partnership", "School Partnership",
  "Research Collaboration", "Sponsorship", "Volunteer", "Student Programs", "General Inquiry",
] as const;

export function parseContactInterest(value: unknown) {
  return contactInterests.find(interest => interest === value) ?? "";
}

export function parseEngagementOffer(value: unknown): EngagementOffer | "" {
  return engagementOffers.find(offer => offer.id === value)?.id ?? "";
}

export function parseEngagementEntry(value: unknown): EngagementEntry {
  return engagementEntries.find(entry => entry === value) ?? "direct";
}

export function engagementHref(offer: EngagementOffer, entry: EngagementEntry) {
  return `/contact?offer=${offer}&from=${entry}`;
}

export function engagementLabel(value: unknown) {
  return engagementOffers.find(offer => offer.id === value)?.label ?? "Not selected";
}

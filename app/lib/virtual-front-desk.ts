export const virtualFrontDeskIndustries = [
  "events",
  "wellness",
  "professional-services",
  "home-auto",
  "fitness",
] as const;

export type VirtualFrontDeskIndustry = typeof virtualFrontDeskIndustries[number];
export type VirtualFrontDeskVariant = VirtualFrontDeskIndustry | "general";

export const virtualFrontDeskCities = ["college-park", "east-point"] as const;
export type VirtualFrontDeskCity = typeof virtualFrontDeskCities[number];

export function parseVirtualFrontDeskIndustry(value: unknown): VirtualFrontDeskVariant {
  return virtualFrontDeskIndustries.find(industry => industry === value) ?? "general";
}

export function parseVirtualFrontDeskCity(value: unknown): VirtualFrontDeskCity | "local" {
  return virtualFrontDeskCities.find(city => city === value) ?? "local";
}

export const virtualFrontDeskCampaign = "virtual_front_desk_oct2026";

export function parseVirtualFrontDeskCampaign(value: unknown) {
  return value === virtualFrontDeskCampaign ? value : "direct";
}

export function parseVirtualFrontDeskContent(value: unknown, industry: VirtualFrontDeskVariant) {
  const expected = industry === "general" ? "general_v1" : `${industry}_v1`;
  return value === expected ? value : "not_set";
}

export type VirtualFrontDeskAttribution = {
  industry: VirtualFrontDeskVariant;
  city: VirtualFrontDeskCity | "local";
  campaign: typeof virtualFrontDeskCampaign | "direct";
  content: string;
};

export function virtualFrontDeskContactHref({ industry, city, campaign }: Omit<VirtualFrontDeskAttribution, "content">) {
  const query = new URLSearchParams({
    offer: "assistant",
    from: "virtual-front-desk",
    vfd_content: `${industry}_v1`,
  });
  if (industry !== "general") query.set("vfd_industry", industry);
  if (city !== "local") query.set("vfd_city", city);
  if (campaign !== "direct") query.set("vfd_campaign", campaign);
  return `/contact?${query.toString()}`;
}

export const virtualFrontDeskScenarios: Record<VirtualFrontDeskVariant, {
  label: string;
  eyebrow: string;
  intro: string;
  question: string;
  guide: string;
  nextStep: string;
  example: string;
}> = {
  general: {
    label: "All small businesses",
    eyebrow: "For College Park & East Point small businesses",
    intro: "Help customers get an approved answer, understand the right next step, and continue to the scheduling process your business already uses.",
    question: "Do you offer the service I need?",
    guide: "The assistant asks a few approved questions and explains the most relevant service or inquiry path.",
    nextStep: "The customer continues to your existing calendar, request form, or a person on your team.",
    example: "A customer arrives after hours with a question. They receive an approved answer and a clear next step without replacing your current tools.",
  },
  events: {
    label: "Events & hospitality",
    eyebrow: "For local venues, caterers & hospitality teams",
    intro: "Answer venue and event questions, collect the basics, and guide qualified prospects toward the right tour or consultation request.",
    question: "Can this space support my date, guest count, and event type?",
    guide: "The assistant explains approved venue details and collects the information your team needs before a tour request.",
    nextStep: "The prospect reaches the correct inquiry form, tour calendar, or venue lead.",
    example: "A prospective host asks about capacity, outside vendors, and tour availability. The assistant answers approved FAQs and guides the person to the tour-request path.",
  },
  wellness: {
    label: "Beauty & wellness",
    eyebrow: "For local salons, spas & wellness businesses",
    intro: "Help new clients choose the right service, understand preparation requirements, and continue to the appropriate booking path.",
    question: "Which service should I book?",
    guide: "The assistant uses your approved service descriptions to explain options and preparation details.",
    nextStep: "The client continues to the correct stylist, service calendar, group inquiry, or team member.",
    example: "A first-time client is unsure which service to select. The assistant explains the approved differences and links to the right booking option.",
  },
  "professional-services": {
    label: "Professional services",
    eyebrow: "For local accounting & professional-service firms",
    intro: "Route routine service questions and consultation requests while keeping advice, documents, and sensitive information with your team.",
    question: "Which service or consultation do I need?",
    guide: "The assistant explains approved service categories and what to prepare without giving regulated advice.",
    nextStep: "The prospect requests the right consultation or moves to a person for review.",
    example: "A prospect asks whether they need bookkeeping, tax, or advisory support. The assistant describes the approved categories and routes the person to consultation intake.",
  },
  "home-auto": {
    label: "Home & field services",
    eyebrow: "For local plumbers, electricians & field-service teams",
    intro: "Collect useful job details, explain approved service boundaries, and move qualified customers toward an estimate, service request, or person on the team.",
    question: "Do you serve my area, and what is the right next step for this issue?",
    guide: "The assistant gathers approved details such as service type, location, timing, and urgency without diagnosing a hazard or promising emergency availability.",
    nextStep: "The customer reaches the appropriate estimate request, service calendar, emergency guidance, or owner follow-up.",
    example: "A homeowner asks whether a plumber or electrician serves their area and how quickly someone can respond. The assistant gathers approved details, presents any business-provided safety guidance, and routes the request without diagnosing the problem or confirming availability.",
  },
  fitness: {
    label: "Fitness & community",
    eyebrow: "For local gyms, studios & member-based businesses",
    intro: "Answer first-visit questions, guide prospects to the right program, and connect them to a trial, intro session, or staff member.",
    question: "Where should a new member begin?",
    guide: "The assistant explains approved program differences, schedules, and first-visit expectations.",
    nextStep: "The visitor continues to a trial, intro-session request, class calendar, or member lead.",
    example: "A new visitor wants to start but does not know which program fits. The assistant explains the entry options and guides the person to the next step.",
  },
};

export { virtualFrontDeskStories } from "./virtual-front-desk-stories.js";

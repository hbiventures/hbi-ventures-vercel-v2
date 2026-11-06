/** Approved process wording/order. Marker keys change presentation, not scope. */
export const clientConnectProcess = [
  { title: "Audience discovery", description: "Define your offer, intended audience, geography and goals together.", marker: "audience" },
  { title: "Source-backed research", description: "Research potential clients and referral partners using relevant sources.", marker: "research" },
  { title: "Client approval", description: "You approve the offer, claims and outreach before it is used.", marker: "approval" },
  { title: "Coordinated outreach and follow-up", description: "Manage approved outreach and follow-up within the agreed pilot scope.", marker: "outreach" },
  { title: "Consented introduction", description: "Arrange an introduction when interested prospects agree to connect with your team.", marker: "introduction" },
  { title: "Reporting", description: "Review activity, responses and agreed next steps.", marker: "reporting" },
] as const;

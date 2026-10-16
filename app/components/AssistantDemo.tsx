"use client";
import { useState } from "react";

const scenarios = {
  inquiry: { label: "Route a customer inquiry", input: "Example: A visitor asks about connecting their inquiry form to a CRM.", category: "Integration services", destination: "Proposed owner: HBI Innovation Foundry", draft: "Thanks for your interest. Which form and CRM do you use? We can discuss compatibility and a practical first step." },
  appointment: { label: "Prepare an appointment follow-up", input: "Example: A visitor asks for a discovery conversation next week.", category: "Discovery request", destination: "Proposed owner: HBI customer care team", draft: "We’d be happy to discuss your project. Please share your preferred times and time zone so the team can confirm availability." },
} as const;
export function AssistantDemo() {
  const [scenario, setScenario] = useState<keyof typeof scenarios>("inquiry");
  const [reviewed, setReviewed] = useState(false);
  const item = scenarios[scenario];
  return <section className="assistant-demo" aria-label="Automation demonstration">
    <span className="assistant-eyebrow">Interactive demo · synthetic data</span>
    <h3>From inquiry to a reviewed next step.</h3>
    <label>Try a workflow<select value={scenario} onChange={e => { setScenario(e.target.value as keyof typeof scenarios); setReviewed(false); }}>{Object.entries(scenarios).map(([id, value]) => <option key={id} value={id}>{value.label}</option>)}</select></label>
    <p>{item.input}</p><dl><dt>Classify</dt><dd>{item.category}</dd><dt>Route</dt><dd>{item.destination}</dd><dt>Prepare</dt><dd>{item.draft}</dd></dl>
    <button type="button" onClick={() => setReviewed(true)} disabled={reviewed}>{reviewed ? "Demo reviewed" : "Simulate human review"}</button>
    <p role="status">{reviewed ? "Review complete in this demo. Nothing was sent, booked or updated." : "Illustrative workflow, not a connected CRM or booking service. A person reviews the draft before any real action."}</p>
  </section>;
}

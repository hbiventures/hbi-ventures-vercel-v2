"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { BrowserIcon, ChatCircleDotsIcon, DatabaseIcon, ChartBarIcon, FileTextIcon, UserCircleIcon, CheckCircleIcon } from "@phosphor-icons/react";

const capabilities = [
  { label: "Digital experiences", icon: BrowserIcon, title: "A living vision board into your organization", copy: "Bring your purpose, people and work to life, then give visitors a meaningful way to connect.", proof: "Explore the LIA, EJC and HBI STEAM experiences above.", steps: ["Discover", "Explore", "Connect"] },
  { label: "Assistants & automation", icon: ChatCircleDotsIcon, title: "A new project inquiry", copy: "Digital experience refresh with calendar integration and visitor assistance.", proof: "Ready for your team’s review", steps: ["Receive", "Prepare", "Review"] },
  { label: "Connected integrations", icon: DatabaseIcon, title: "A calendar update, connected", copy: "An approved event in a source calendar can keep website gathering information current.", proof: "EJC demonstrates calendar-backed gathering updates.", steps: ["Source", "Connect", "Display"] },
  { label: "Analytics & strategy", icon: ChartBarIcon, title: "Insight that informs the next decision", copy: "Review website and campaign engagement, then shape your next campaign around the evidence.", proof: "LIA includes analytics-informed campaign strategy.", steps: ["Measure", "Understand", "Improve"] },
] as const;
const scenarios = ["Answer a visitor question", "Connect a request", "Understand engagement"];
const stepDescriptions = ["A visitor submits a request through your digital experience.", "AI prepares a draft based on your content and guidelines.", "Your team reviews, customizes if needed, and sends the response."];

export function WorkflowTheatre() {
  const [selected, setSelected] = useState(1);
  const [scenario, setScenario] = useState(1);
  const [step, setStep] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const capability = capabilities[selected];
  const StepIcons = [ChatCircleDotsIcon, FileTextIcon, UserCircleIcon];
  function select(index: number) { setSelected(index); setScenario(index === 3 ? 2 : index === 1 ? 1 : -1); setStep(0); }
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "ArrowRight" ? (index + 1) % capabilities.length : event.key === "ArrowLeft" ? (index + capabilities.length - 1) % capabilities.length : event.key === "Home" ? 0 : event.key === "End" ? capabilities.length - 1 : null;
    if (next === null) return;
    event.preventDefault(); select(next); tabs.current[next]?.focus();
  }
  const title = selected === 1 && scenario === 0 ? "A visitor finds their next step" : capability.title;
  const copy = selected === 1 && scenario === 0 ? "A visitor asks about your services. The assistant prepares an answer grounded in approved information." : capability.copy;

  return <section className="wt-theatre" aria-labelledby="theatre-title"><div className="wt-container">
    <p className="wt-kicker">See it in practice</p><h2 id="theatre-title">Connect the experience. <span>Support the work.</span></h2>
    <div className="wt-tabs" role="tablist" aria-label="Explore HBI capabilities">{capabilities.map((item, index) => <button key={item.label} ref={node => { tabs.current[index] = node; }} id={`capability-tab-${index}`} aria-controls="capability-panel" role="tab" aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} onKeyDown={event => navigate(event, index)} onClick={() => select(index)}><item.icon size={27} weight="light" aria-hidden="true" />{item.label}</button>)}</div>
    <div className="wt-demo-layout" id="capability-panel" role="tabpanel" aria-labelledby={`capability-tab-${selected}`}>
      <div className="wt-scenarios" role="group" aria-label="Example scenarios">{scenarios.map((item, index) => { const Icon = [ChatCircleDotsIcon, FileTextIcon, ChartBarIcon][index]; return <button key={item} aria-pressed={scenario === index} onClick={() => { select(index === 2 ? 3 : 1); setScenario(index); }}><Icon size={27} weight="light" aria-hidden="true" />{item}</button>; })}</div>
      <div className="wt-demo-main">
        <ol className="wt-steps" aria-label="Example workflow">{capability.steps.map((label, index) => { const Icon = StepIcons[index]; return <li key={label} aria-current={step === index ? "step" : undefined}><span className="wt-step-icon"><Icon size={38} weight="light" aria-hidden="true" /></span><strong>{label}</strong><p>{selected === 1 ? stepDescriptions[index] : selected === 0 ? ["Understand your visitors and what they need.", "Bring content, services and useful tools together.", "Make the next action clear and accessible."][index] : selected === 2 ? ["Start with the approved source of information.", "Connect the source through an agreed integration.", "Present relevant information in the experience."][index] : ["Collect relevant site and campaign signals.", "Review the data in context with your team.", "Use the findings to guide the next decision."][index]}</p></li>; })}</ol>
        <div className="wt-demo-result" aria-live="polite"><FileTextIcon size={32} weight="light" aria-hidden="true" /><div className="wt-result-copy" key={`${selected}-${scenario}`}><strong>{title}</strong><p>{copy}</p></div><span><CheckCircleIcon size={18} aria-hidden="true" />{step === 2 ? capability.proof : `Step ${step + 1}: ${capability.steps[step]}`}</span></div>
        <div className="wt-demo-controls"><button type="button" disabled={step === 0} onClick={() => setStep(value => value - 1)}>Previous step</button><span aria-live="polite">{step + 1} of 3</span><button type="button" disabled={step === 2} onClick={() => setStep(value => value + 1)}>Next step</button></div>
      </div>
    </div>
    <p className="wt-demo-disclaimer">Illustrative demonstration · Sample data only · No requests are sent</p>
  </div></section>;
}

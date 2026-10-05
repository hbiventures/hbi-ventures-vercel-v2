"use client";

import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { CompassIcon, MagnifyingGlassIcon, ChatCircleDotsIcon, CheckCircleIcon, PencilSimpleIcon } from "@phosphor-icons/react";
import posthog from "posthog-js";
import { assessmentStorageKey, briefFields, createGuidedBrief, serializeBrief, type Brief } from "../lib/assessment";

const choices = [
  { id: "explore", label: "Explore HBI", icon: CompassIcon },
  { id: "assessment", label: "Discover an automation opportunity", icon: MagnifyingGlassIcon },
  { id: "discuss", label: "Discuss a project", icon: ChatCircleDotsIcon },
] as const;
const posthogConfigured = Boolean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST);
function track(event: string) { if (posthogConfigured) posthog.capture(event, { source: "homepage_navigator" }); }

export function InnovationNavigator() {
  const [path, setPath] = useState<(typeof choices)[number]["id"]>("assessment");
  const [step, setStep] = useState<"intro" | "questions" | "review">("intro");
  const [organization, setOrganization] = useState("");
  const [challenge, setChallenge] = useState("");
  const [process, setProcess] = useState("");
  const [systems, setSystems] = useState("");
  const [brief, setBrief] = useState<Brief | null>(null);
  const [approved, setApproved] = useState(false);
  const [error, setError] = useState("");
  const panelTitle = useRef<HTMLHeadingElement>(null);

  function focusPanel() { window.requestAnimationFrame(() => panelTitle.current?.focus()); }
  function begin() { setStep("questions"); setError(""); track("assessment_started"); focusPanel(); }
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBrief(createGuidedBrief(challenge.trim(), process.trim(), systems.trim()));
    setApproved(false); setStep("review"); setError(""); track("assessment_brief_prepared"); focusPanel();
  }
  function transfer() {
    if (!approved || !brief) return;
    const message = serializeBrief(brief);
    if (message.length > 5000) { setError("Please shorten the brief to 5,000 characters before continuing."); return; }
    try {
      window.sessionStorage.setItem(assessmentStorageKey, JSON.stringify({ version: 1, approved: true, organization: organization.trim(), message }));
      track("assessment_brief_approved");
      window.location.assign("/contact?from=assessment");
    } catch { setError("Your browser could not carry the brief to Contact Us. You can copy your answers and open Contact Us directly."); }
  }

  return <section className="eco-navigator" aria-labelledby="navigator-title"><div className="eco-container eco-navigator-grid">
    <div className="eco-navigator-intro"><p className="eco-kicker">HBI Innovation Navigator</p><h2 id="navigator-title">Where do you <br />want to begin?</h2><p>Get guidance, explore opportunities or start a conversation. Your next step starts here.</p>
      <div className="eco-nav-choices" role="group" aria-label="Choose your HBI path">{choices.map(choice => <button key={choice.id} type="button" aria-pressed={path === choice.id} onClick={() => { setPath(choice.id); setError(""); }}><choice.icon size={24} aria-hidden="true" /><span>{choice.label}</span></button>)}</div>
      <p className="eco-navigator-note">A starting point for a real conversation.<br />Your team stays in control.</p>
    </div>
    <div className="eco-navigator-panel" id="navigator-panel">
      {path === "explore" && <div className="eco-explore"><span className="eco-panel-label">One organization. Three ways forward.</span><h3>Find your path through HBI.</h3><p>Choose the area that matches what you want to accomplish.</p><Link href="/innovation-foundry"><strong>Build with the Innovation Foundry</strong><span>AI, automation and digital products</span></Link><a href="https://hbisteam.org"><strong>Learn with the STEAM Academy</strong><span>Programs and projects at hbisteam.org</span></a><Link href="/foundation"><strong>Connect with the Foundation</strong><span>Community access, scholarships and giving</span></Link></div>}
      {path === "discuss" && <div className="eco-discuss"><span className="eco-panel-label">From a question to a conversation</span><ChatCircleDotsIcon size={44} weight="light" aria-hidden="true" /><h3>What are you working on?</h3><p>Talk with the HBI AI assistant about your idea, or bring it straight to our team.</p><button type="button" className="eco-button" onClick={() => window.dispatchEvent(new Event("hbi-open-navigator"))}>Ask the HBI Navigator</button><Link className="eco-text-link" href="/contact">Contact the HBI team</Link><small>AI answers are a starting point. Confirm project scope with our team.</small></div>}
      {path === "assessment" && <>
        <div className="eco-assessment-top"><span className="eco-panel-label">{step === "intro" ? "An opportunity, made clearer" : step === "questions" ? "Describe your process" : "Review your brief"}</span><span className="eco-draft-tag">{step === "intro" ? "Guided assessment" : "Draft"}</span></div>
        <h3 tabIndex={-1} ref={panelTitle}>{step === "questions" ? "Bring us the process." : "Automation Opportunity Brief"}</h3>
        {step === "intro" && <div className="eco-assessment-preview"><p>Turn a day-to-day challenge into a practical starting brief for HBI Innovation Foundry.</p><dl><div><dt>The challenge</dt><dd>Where does work slow down?</dd></div><div><dt>The opportunity</dt><dd>What could AI help your team prepare?</dd></div><div><dt>Human review</dt><dd>Where should your people make the call?</dd></div><div><dt>The first step</dt><dd>Define a focused, useful pilot.</dd></div></dl><div className="eco-brief-actions"><button className="eco-button" type="button" onClick={begin}>Start my assessment</button><span>Describe. Review. Connect.</span></div><p className="eco-small-note">Your answers stay in this page until you approve a brief. Continuing to Contact Us does not send a message.</p></div>}
        {step === "questions" && <form className="eco-assessment-form" onSubmit={prepare}><p>Describe one repeatable task. We’ll organize your answers into an editable guided draft.</p><label>Organization <span>Optional</span><input value={organization} onChange={e => setOrganization(e.target.value)} maxLength={160} autoComplete="organization" /></label><label>What challenge would you like to solve?<textarea value={challenge} onChange={e => setChallenge(e.target.value)} maxLength={450} required placeholder="For example, requests arrive across several inboxes and need manual sorting." /></label><label>How does the process work today?<textarea value={process} onChange={e => setProcess(e.target.value)} maxLength={450} required placeholder="What starts the work, who handles it, and what happens next?" /></label><label>Which tools or systems are involved? <span>Optional</span><input value={systems} onChange={e => setSystems(e.target.value)} maxLength={450} placeholder="Email, spreadsheets, CRM…" /></label><div className="eco-brief-actions"><button className="eco-button" type="submit">Prepare my brief</button><button className="eco-back" type="button" onClick={() => { setStep("intro"); focusPanel(); }}>Back</button></div><p className="eco-small-note">Include process details only; leave out passwords and private customer information.</p></form>}
        {step === "review" && brief && <div className="eco-review"><p>A guided draft from your answers, with suggested starting points. Edit anything below. Feasibility and integrations will be confirmed with HBI.</p><div className="eco-review-fields">{briefFields.map(([key, label]) => <label key={key}><span>{label}<PencilSimpleIcon size={15} aria-hidden="true" /></span><textarea maxLength={450} value={brief[key]} onChange={e => { setBrief({ ...brief, [key]: e.target.value }); setApproved(false); setError(""); }} /></label>)}</div><label className="eco-approval"><input type="checkbox" checked={approved} onChange={e => setApproved(e.target.checked)} /><span>I have reviewed this brief and approve copying it into Contact Us.</span></label><div className="eco-brief-actions"><button className="eco-button" disabled={!approved} type="button" onClick={transfer}>Continue to Contact Us</button><button className="eco-back" type="button" onClick={() => { setStep("questions"); setApproved(false); focusPanel(); }}>Edit answers</button></div><p className="eco-small-note"><CheckCircleIcon size={16} aria-hidden="true" />Nothing is sent until you select “Send message” on Contact Us.</p></div>}
      </>}
      {error && <p role="alert" className="eco-error">{error} <Link href="/contact">Open Contact Us</Link></p>}
    </div>
  </div></section>;
}

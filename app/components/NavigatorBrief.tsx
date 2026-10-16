"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { assessmentStorageKey, parseApprovedAssessment } from "../lib/assessment";
import { projectBriefMessage } from "../lib/navigator";
import { assistantHandoffKey, assistantInterests, type AssistantInterest } from "../lib/assistant-interests";
import { trackAssistant } from "../lib/assistant-analytics";

export function NavigatorBrief({ active, seed, transcript = "", suggestedInterests = [], onBack }: { active: boolean; seed: string; transcript?: string; suggestedInterests?: AssistantInterest[]; onBack: () => void }) {
  const [organization, setOrganization] = useState("");
  const [notes, setNotes] = useState("");
  const [systems, setSystems] = useState("");
  const [outcome, setOutcome] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [approved, setApproved] = useState(false);
  const [error, setError] = useState("");
  const [interests, setInterests] = useState<AssistantInterest[]>([]);
  const [includeTranscript, setIncludeTranscript] = useState(false);
  const [reviewedTranscript, setReviewedTranscript] = useState("");
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!active) return;
    if (!initialized.current) {
      // Seed once; returning to the chat must not overwrite edits.
      if (notesRef.current) notesRef.current.value = seed;
      initialized.current = true;
    }
    heading.current?.focus();
  }, [active, seed]);

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentNotes = notesRef.current?.value.trim() ?? notes.trim();
    if (!currentNotes) { setError("Please describe what you would like to explore."); return; }
    setNotes(currentNotes); setMessage(projectBriefMessage(currentNotes, systems, outcome));
    setReviewedTranscript(transcript); setIncludeTranscript(false);
    setApproved(false); setError("");
    window.requestAnimationFrame(() => heading.current?.focus());
  }

  function transfer() {
    if (!approved || !message) return;
    if (includeTranscript && (!reviewedTranscript.trim() || reviewedTranscript.length > 30000)) { setError("Please shorten the transcript to 30,000 characters or turn off transcript sharing."); return; }
    const raw = JSON.stringify({ version: 1, approved: true, organization: organization.trim(), message: message.trim(), interest: "HBI Innovation Foundry" });
    if (!parseApprovedAssessment(raw)) { setError("Please include a brief of 1–5,000 characters and an organization name of no more than 160 characters."); return; }
    try {
      window.sessionStorage.setItem(assessmentStorageKey, raw);
      window.sessionStorage.setItem(assistantHandoffKey, JSON.stringify({ version: 1, expiresAt: Date.now() + 30 * 60 * 1000, interests, transcriptApproved: includeTranscript, transcript: includeTranscript ? reviewedTranscript.trim() : "" }));
      trackAssistant("navigator_brief_approved", { confirmed_interests: interests });
      window.location.assign("/contact?from=assessment");
    } catch { setError("Browser storage is unavailable. Copy your reviewed brief below and paste it into Contact HBI. Nothing has been sent."); }
  }

  return <section className="navigator-brief"><button type="button" className="navigator-back" onClick={onBack}>Back to conversation</button><h2 tabIndex={-1} ref={heading}>{message === null ? "Prepare your project brief" : "Review your project brief"}</h2><p>A guided draft, not a completed assessment or proposal. Only your own words are carried over from the chat. Edit or remove anything before continuing.</p>
    {message === null ? <form onSubmit={prepare}>
      <label>Organization (optional)<input maxLength={160} value={organization} onChange={event => setOrganization(event.target.value)} autoComplete="organization" /></label>
      <label>What would you like to explore?<textarea ref={notesRef} defaultValue={notes || seed} maxLength={2400} required rows={5} /></label>
      <label>Existing tools or process (optional)<textarea value={systems} onChange={event => setSystems(event.target.value)} maxLength={600} rows={3} /></label>
      <label>Desired outcome (optional)<textarea value={outcome} onChange={event => setOutcome(event.target.value)} maxLength={600} rows={3} /></label>
      <p>Leave out passwords, payment details and private customer information. These brief fields are not sent to the AI provider.</p><button className="navigator-primary" type="submit">Review my brief</button>
    </form> : <div className="navigator-brief-review">
      <label>Organization (optional)<input maxLength={160} value={organization} onChange={event => { setOrganization(event.target.value); setApproved(false); }} /></label>
      <label>Editable project brief<textarea rows={12} maxLength={5000} value={message} onChange={event => { setMessage(event.target.value); setApproved(false); setError(""); }} /></label>
      <fieldset className="assistant-interests"><legend>Confirm your interests (optional)</legend><p>{suggestedInterests.length ? `Possible matches from your questions: ${assistantInterests.filter(item => suggestedInterests.includes(item.id)).map(item => item.label).join(", ")}. Select only what fits.` : "Choose the areas you would like HBI to discuss."}</p>{assistantInterests.map(item => <label key={item.id}><input type="checkbox" checked={interests.includes(item.id)} onChange={event => { setInterests(current => event.target.checked ? [...current, item.id] : current.filter(id => id !== item.id)); setApproved(false); }} />{item.label}</label>)}</fieldset>
      {!!transcript && <><label className="navigator-approval"><input type="checkbox" checked={includeTranscript} onChange={event => { setIncludeTranscript(event.target.checked); setApproved(false); }} /><span>Also include my conversation transcript with my inquiry to HBI.</span></label>{includeTranscript && <label>Review and edit the transcript<textarea rows={8} value={reviewedTranscript} onChange={event => { setReviewedTranscript(event.target.value); setApproved(false); }} /><small>Remove sensitive information. Voice captions and assistant answers may contain errors. Maximum 30,000 characters; nothing is silently truncated.</small></label>}</>}
      <label className="navigator-approval"><input type="checkbox" checked={approved} onChange={event => setApproved(event.target.checked)} /><span>I have reviewed this brief and approve copying it into Contact Us.</span></label>
      <button className="navigator-primary" type="button" disabled={!approved || !message.trim()} onClick={transfer}>Continue to Contact Us</button>
      <p>Your approved brief is carried through this browser session. Nothing is submitted until you choose “Send message” on Contact Us.</p>
    </div>}
    {error && <p role="alert" className="navigator-error">{error} <a href="/contact">Contact HBI</a></p>}
  </section>;
}

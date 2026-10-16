"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import { assessmentInterest, assessmentStorageKey, parseApprovedAssessment } from "../lib/assessment";
import { contactInterests, engagementOffers, parseContactInterest, parseEngagementEntry, parseEngagementOffer, type EngagementEntry, type EngagementOffer } from "../lib/engagement";
import { assistantHandoffKey, assistantInterests, parseAssistantHandoff, type AssistantHandoff } from "../lib/assistant-interests";
import { trackAssistant } from "../lib/assistant-analytics";
import { parseVirtualFrontDeskCampaign, parseVirtualFrontDeskCity, parseVirtualFrontDeskContent, parseVirtualFrontDeskIndustry, virtualFrontDeskScenarios, type VirtualFrontDeskAttribution } from "../lib/virtual-front-desk";

const posthogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

function trackContact(event: string, form: HTMLFormElement) {
  if (!posthogConfigured) return;
  const data = new FormData(form);
  // Explicit allowlisted categories only; never names, email, message, URLs or lead references.
  try {
    const entry = parseEngagementEntry(data.get("entry"));
    const landingIndustry = parseVirtualFrontDeskIndustry(data.get("vfd_industry"));
    posthog.capture(event, {
      offer: parseEngagementOffer(data.get("offer")) || "not_selected",
      entry,
      interest: parseContactInterest(data.get("interest")) || "not_selected",
      ...(entry === "virtual-front-desk" ? {
        landing_industry: landingIndustry,
        landing_city: parseVirtualFrontDeskCity(data.get("vfd_city")),
        landing_campaign: parseVirtualFrontDeskCampaign(data.get("vfd_campaign")),
        landing_content: parseVirtualFrontDeskContent(data.get("vfd_content"), landingIndustry),
      } : {}),
    });
  } catch { /* A tracking failure must not block an inquiry or report it as failed. */ }
}

export function ContactForm({ initialOffer = "", entry = "direct", initialAttribution }: { initialOffer?: EngagementOffer | ""; entry?: EngagementEntry; initialAttribution?: VirtualFrontDeskAttribution }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const submission = useRef<{ signature: string; id: string } | null>(null);
  const started = useRef(false);
  const sending = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [prefilled, setPrefilled] = useState(false);
  const [reference, setReference] = useState("");
  const [assistantContext, setAssistantContext] = useState<AssistantHandoff | null>(null);
  const [sendTranscript, setSendTranscript] = useState(false);

  useEffect(() => {
    const form = formRef.current;
    if (!form || entry !== "assessment") return;
    try {
      const draft = parseApprovedAssessment(window.sessionStorage.getItem(assessmentStorageKey));
      if (!draft) return;
      (form.elements.namedItem("organization") as HTMLInputElement).value = draft.organization;
      (form.elements.namedItem("interest") as HTMLSelectElement).value = draft.interest ?? assessmentInterest;
      (form.elements.namedItem("message") as HTMLTextAreaElement).value = draft.message;
      // One-time hydration from browser storage; the initial server render has no access to this handoff.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrefilled(true);
      const context = parseAssistantHandoff(window.sessionStorage.getItem(assistantHandoffKey));
      setAssistantContext(context);
      setSendTranscript(context?.transcriptApproved ?? false);
      window.sessionStorage.removeItem(assistantHandoffKey);
      window.sessionStorage.removeItem(assessmentStorageKey);
    } catch { /* Contact remains usable when browser storage is unavailable. */ }
  }, [entry]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload: Record<string, unknown> = Object.fromEntries(data.entries());
    if (assistantContext) {
      payload.assistant_interests = assistantContext.interests;
      payload.transcript_consent = sendTranscript;
      payload.transcript = sendTranscript ? assistantContext.transcript : "";
    }
    const signature = JSON.stringify(payload);
    if (submission.current?.signature !== signature) submission.current = { signature, id: crypto.randomUUID() };
    payload.submission_id = submission.current.id;

    sending.current = true;
    setStatus("sending");
    setErrorMessage("");
    setReference("");
    trackContact("contact_form_attempted", form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(25000),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.ok !== true) {
        throw new Error(result.error || "We could not send your message.");
      }

      trackContact("contact_form_submitted", form);
      for (const category of assistantContext?.interests ?? []) trackAssistant("assistant_inquiry_submitted", { category, classification: "visitor_confirmed" });
      setReference(typeof result.reference === "string" ? result.reference : "");
      form.reset();
      setPrefilled(false);
      setAssistantContext(null); setSendTranscript(false);
      submission.current = null;
      setStatus("success");
    } catch (error) {
      trackContact("contact_form_failed", form);
      setErrorMessage(
        error instanceof Error && error.name !== "TimeoutError"
          ? error.message
          : "Delivery could not be confirmed. Retry the unchanged form, or email us directly.",
      );
      setStatus("error");
    } finally { sending.current = false; }
  }

  return (
    <form ref={formRef} className="contact-form ph-no-capture" onSubmit={handleSubmit} aria-busy={status === "sending"} onFocusCapture={event => {
      if (!started.current) { started.current = true; trackContact("contact_form_started", event.currentTarget); }
    }}>
      <input type="hidden" name="entry" value={entry} />
      {initialAttribution && <>
        <input type="hidden" name="vfd_industry" value={initialAttribution.industry} />
        <input type="hidden" name="vfd_city" value={initialAttribution.city} />
        <input type="hidden" name="vfd_campaign" value={initialAttribution.campaign} />
        <input type="hidden" name="vfd_content" value={initialAttribution.content} />
      </>}
      {prefilled && <div className="assessment-prefill-note" role="status"><strong>Your reviewed brief is ready.</strong>You can edit it below. Nothing is sent until you choose “Send message”.</div>}
      <p className="contact-form-intro">Tell us a little about your project. Required fields are marked with *.</p>
      {initialAttribution && <p className="assessment-prefill-note" role="status"><strong>Workflow review context saved.</strong>{virtualFrontDeskScenarios[initialAttribution.industry].label}{initialAttribution.city !== "local" ? ` · ${initialAttribution.city === "east-point" ? "East Point" : "College Park"}` : ""}. This category-only context will accompany your inquiry; add your current tools and scheduling path below.</p>}
      <label className="form-honeypot" aria-hidden="true">Website<input name="website" autoComplete="off" tabIndex={-1} /></label>
      <div className="form-row"><label>First name *<input name="first_name" maxLength={80} autoComplete="given-name" required /></label><label>Last name *<input name="last_name" maxLength={80} autoComplete="family-name" required /></label></div>
      <div className="form-row"><label>Email address *<input type="email" name="email" maxLength={254} autoComplete="email" required /></label><label>Phone number <span>Optional</span><input type="tel" name="phone" maxLength={40} autoComplete="tel" /></label></div>
      <label>Organization <span>Optional</span><input name="organization" maxLength={160} autoComplete="organization" /></label>
      <label>Area of interest *<select name="interest" required defaultValue={initialOffer ? "HBI Innovation Foundry" : ""}><option value="" disabled>Select one</option>{contactInterests.map(interest => <option key={interest}>{interest}</option>)}</select></label>
      <label>Service to discuss <span>Optional</span><select name="offer" defaultValue={initialOffer} onChange={event => {
        if (event.target.value && formRef.current) (formRef.current.elements.namedItem("interest") as HTMLSelectElement).value = "HBI Innovation Foundry";
      }}><option value="">Not sure yet / another HBI inquiry</option>{engagementOffers.map(offer => <option value={offer.id} key={offer.id}>{offer.label}</option>)}</select></label>
      <label>Message *<textarea name="message" maxLength={5000} required placeholder="What should work better? Tell us about your audience, existing tools and desired timing. For other HBI inquiries, share how we can help." /></label>
      {assistantContext && <fieldset className="assistant-contact-context"><legend>Your assistant handoff</legend><p>Only the details you approve here are included in your inquiry.</p><div className="assistant-interests">{assistantInterests.map(item => <label key={item.id}><input type="checkbox" checked={assistantContext.interests.includes(item.id)} onChange={event => setAssistantContext({ ...assistantContext, interests: event.target.checked ? [...assistantContext.interests, item.id] : assistantContext.interests.filter(id => id !== item.id) })} />{item.label}</label>)}</div>{assistantContext.transcriptApproved && <><label className="navigator-approval"><input type="checkbox" checked={sendTranscript} onChange={event => setSendTranscript(event.target.checked)} />Include my reviewed transcript in this email to HBI.</label>{sendTranscript && <label>Transcript to share<textarea rows={8} maxLength={30000} value={assistantContext.transcript} onChange={event => setAssistantContext({ ...assistantContext, transcript: event.target.value })} /></label>}</>}<p>These are your confirmed interests—not an automated score. This information is not displayed publicly.</p></fieldset>}
      <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending message…" : "Send message"}</button>
      <div className="form-status" aria-live="polite">
        {status === "success" && <p className="form-success">Thank you—your inquiry has been accepted for email delivery to HBI. We’ll review it and follow up using your contact details.{reference && <span className="contact-reference">Inquiry reference: {reference}</span>}</p>}
        {status === "error" && <p className="form-error">{errorMessage} <a href="mailto:info@hbiventures.com">Email us directly</a></p>}
      </div>
      <p className="form-note">Sending shares these details with HBI via our email provider, Resend, so we can respond. Do not include passwords, payment details or private customer information. This form does not send your message to the AI assistant. <a href="/privacy#information">Privacy Notice</a>.</p>
    </form>
  );
}

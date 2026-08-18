"use client";

import { FormEvent, useRef, useState } from "react";
import posthog from "posthog-js";

const posthogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const submissionId = useRef<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    submissionId.current ||= crypto.randomUUID();
    payload.submission_id = submissionId.current;

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "We could not send your message.");
      }

      if (posthogConfigured) {
        posthog.capture("contact_form_submitted", {
          interest: typeof payload.interest === "string" ? payload.interest : undefined,
        });
      }
      form.reset();
      submissionId.current = null;
      setStatus("success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not send your message. Please try again.",
      );
      setStatus("error");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} aria-busy={status === "sending"}>
      <label className="form-honeypot" aria-hidden="true">Website<input name="website" autoComplete="off" tabIndex={-1} /></label>
      <div className="form-row"><label>First name<input name="first_name" autoComplete="given-name" required /></label><label>Last name<input name="last_name" autoComplete="family-name" required /></label></div>
      <div className="form-row"><label>Email address<input type="email" name="email" autoComplete="email" required /></label><label>Phone number <span>Optional</span><input type="tel" name="phone" autoComplete="tel" /></label></div>
      <label>Organization <span>Optional</span><input name="organization" autoComplete="organization" /></label>
      <label>Area of interest<select name="interest" required defaultValue=""><option value="" disabled>Select one</option><option>HBI STEAM Academy</option><option>HBI Innovation Foundry</option><option>Web Application Development</option><option>Solutions Architecture</option><option>Product Development</option><option>AI Agent Development</option><option>HBI Foundation</option><option>Corporate Partnership</option><option>School Partnership</option><option>Research Collaboration</option><option>Sponsorship</option><option>Volunteer</option><option>Student Programs</option><option>General Inquiry</option></select></label>
      <label>Message<textarea name="message" required placeholder="Tell us what you’re exploring, building, or hoping to support." /></label>
      <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending message…" : "Send message"} <span>↗</span></button>
      <div className="form-status" aria-live="polite">
        {status === "success" && <p className="form-success">Thank you—your message was sent to HBIVentures. We’ll be in touch.</p>}
        {status === "error" && <p className="form-error">{errorMessage} <a href="mailto:info@hbiventures.com">Email us directly ↗</a></p>}
      </div>
      <p className="form-note">Your message will be securely delivered to info@hbiventures.com.</p>
    </form>
  );
}

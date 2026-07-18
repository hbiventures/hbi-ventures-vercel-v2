"use client";

import { FormEvent } from "react";

export function ContactForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = `${data.get("first_name")} ${data.get("last_name")}`.trim();
    const subject = `HBI Ventures inquiry: ${data.get("interest")}`;
    const body = [
      `Name: ${name}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone") || "Not provided"}`,
      `Organization: ${data.get("organization") || "Not provided"}`,
      `Area of interest: ${data.get("interest")}`,
      "",
      `${data.get("message")}`,
    ].join("\n");
    window.location.href = `mailto:info@hbiventures.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row"><label>First name<input name="first_name" autoComplete="given-name" required /></label><label>Last name<input name="last_name" autoComplete="family-name" required /></label></div>
      <div className="form-row"><label>Email address<input type="email" name="email" autoComplete="email" required /></label><label>Phone number <span>Optional</span><input type="tel" name="phone" autoComplete="tel" /></label></div>
      <label>Organization <span>Optional</span><input name="organization" autoComplete="organization" /></label>
      <label>Area of interest<select name="interest" required defaultValue=""><option value="" disabled>Select one</option><option>HBI STEAM Academy</option><option>HBI Innovation Foundry</option><option>HBI Foundation</option><option>Corporate Partnership</option><option>School Partnership</option><option>Research Collaboration</option><option>Sponsorship</option><option>Volunteer</option><option>Student Programs</option><option>General Inquiry</option></select></label>
      <label>Message<textarea name="message" required placeholder="Tell us what you’re exploring, building, or hoping to support." /></label>
      <button type="submit">Prepare email <span>↗</span></button>
      <p className="form-note">This securely opens the email app on your device. You’ll review and send the message from there.</p>
    </form>
  );
}

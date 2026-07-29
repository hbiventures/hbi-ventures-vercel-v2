import { NextResponse } from "next/server";

export const runtime = "nodejs";

const allowedInterests = new Set([
  "HBI STEAM Academy",
  "HBI Innovation Foundry",
  "Web Application Development",
  "Solutions Architecture",
  "Product Development",
  "AI Agent Development",
  "HBI Foundation",
  "Corporate Partnership",
  "School Partnership",
  "Research Collaboration",
  "Sponsorship",
  "Volunteer",
  "Student Programs",
  "General Inquiry",
]);

type RateLimitEntry = { count: number; resetAt: number };

declare global {
  var hbiContactRateLimits: Map<string, RateLimitEntry> | undefined;
}

const rateLimits = globalThis.hbiContactRateLimits ?? new Map<string, RateLimitEntry>();
globalThis.hbiContactRateLimits = rateLimits;

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isRateLimited(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientId = forwardedFor?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = rateLimits.get(clientId);

  if (!current || current.resetAt <= now) {
    rateLimits.set(clientId, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return false;
  }

  current.count += 1;
  return current.count > 5;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Request origin was not accepted." }, { status: 403 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "The submitted form could not be read." }, { status: 400 });
  }

  // Bots commonly complete hidden fields. Return success without sending.
  if (text(payload.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const firstName = text(payload.first_name, 80);
  const lastName = text(payload.last_name, 80);
  const email = text(payload.email, 254);
  const phone = text(payload.phone, 40);
  const organization = text(payload.organization, 160);
  const interest = text(payload.interest, 100);
  const message = text(payload.message, 5000);
  const submissionId = text(payload.submission_id, 100);

  if (!firstName || !lastName || !isValidEmail(email) || !allowedInterests.has(interest) || !message) {
    return NextResponse.json(
      { error: "Please complete all required fields with valid information." },
      { status: 400 },
    );
  }

  if (isRateLimited(request)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL || "info@hbiventures.com";

  if (!apiKey || !fromEmail) {
    console.error("Contact email is missing RESEND_API_KEY or CONTACT_FROM_EMAIL.");
    return NextResponse.json(
      { error: "Email delivery is temporarily unavailable. Please email info@hbiventures.com directly." },
      { status: 503 },
    );
  }

  const name = `${firstName} ${lastName}`.trim();
  const emailBody = [
    "New HBIVentures website inquiry",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Organization: ${organization || "Not provided"}`,
    `Area of interest: ${interest}`,
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `hbi-contact-${submissionId || crypto.randomUUID()}`,
        "User-Agent": "HBIVentures-Website/1.0",
      },
      body: JSON.stringify({
        from: `HBIVentures Website <${fromEmail}>`,
        to: [toEmail],
        reply_to: email,
        subject: `HBIVentures inquiry: ${interest}`,
        text: emailBody,
      }),
    });

    if (!response.ok) {
      console.error("Resend rejected a contact email.", response.status, await response.text());
      return NextResponse.json(
        { error: "We could not send your message. Please try again or email info@hbiventures.com." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact email request failed.", error);
    return NextResponse.json(
      { error: "We could not send your message. Please try again or email info@hbiventures.com." },
      { status: 502 },
    );
  }
}

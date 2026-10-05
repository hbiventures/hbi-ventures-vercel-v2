import { NextResponse } from "next/server";
import { engagementLabel, parseContactInterest, parseEngagementEntry, parseEngagementOffer } from "../../lib/engagement";
import { assistantInterests, parseAssistantInterests } from "../../lib/assistant-interests";

export const runtime = "nodejs";

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
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new Error("Invalid form shape");
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
  const interest = parseContactInterest(payload.interest);
  const message = text(payload.message, 5000);
  const submittedId = text(payload.submission_id, 100);
  const submissionId = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submittedId) ? submittedId : crypto.randomUUID();
  const offer = parseEngagementOffer(payload.offer);
  const entry = parseEngagementEntry(payload.entry);
  const confirmedInterests = parseAssistantInterests(payload.assistant_interests);
  const transcriptApproved = payload.transcript_consent === true;
  if (transcriptApproved && (typeof payload.transcript !== "string" || !payload.transcript.trim() || payload.transcript.length > 30000)) return NextResponse.json({ error: "Please review your transcript (maximum 30,000 characters) or remove it." }, { status: 400 });
  // An unapproved transcript is discarded, even when sent by a custom client.
  const approvedTranscript = transcriptApproved ? (payload.transcript as string).trim() : "";

  if (!firstName || !lastName || !isValidEmail(email) || !interest || !message) {
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
    `Service to discuss: ${engagementLabel(offer)}`,
    `Website entry: ${entry}`,
    `Inquiry reference: ${submissionId}`,
    `Visitor-confirmed interests: ${assistantInterests.filter(item => confirmedInterests.includes(item.id)).map(item => item.label).join(", ") || "Not provided"}`,
    `Transcript sharing consent: ${transcriptApproved ? "Explicit opt-in on submitted form" : "Not granted; no transcript included"}`,
    "",
    "Message:",
    message,
    ...(approvedTranscript ? ["", "Visitor-reviewed conversation transcript (may be edited; not an authoritative record or agreement):", approvedTranscript] : []),
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(15000),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `hbi-contact-${submissionId}`,
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
      console.error("Resend rejected a contact email.", response.status);
      return NextResponse.json(
        { error: "We could not send your message. Please try again or email info@hbiventures.com." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, reference: submissionId });
  } catch {
    console.error("Contact email request failed or timed out.");
    return NextResponse.json(
      { error: "Delivery could not be confirmed. Retry the unchanged form, or email info@hbiventures.com directly." },
      { status: 502 },
    );
  }
}

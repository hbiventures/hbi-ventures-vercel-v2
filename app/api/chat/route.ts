import { NextRequest, NextResponse } from "next/server";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

type OpenAIResponse = {
  error?: { message?: string };
  output?: Array<{
    content?: Array<{ text?: string; type?: string }>;
    type?: string;
  }>;
  output_text?: string;
};

const MODEL = process.env.OPENAI_CHAT_MODEL?.trim() || "gpt-4o-mini";
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

const HBI_ASSISTANT_INSTRUCTIONS = `
You are the public-facing virtual assistant for HBIVentures. Help website visitors
understand HBI and choose the right next step.

Use only the verified HBI information below. Do not invent dates, prices, eligibility
rules, commitments, partnerships, results, or contact details. If the answer is not
covered, say you do not have that detail and invite the visitor to use the Connect
With Us page or email info@hbiventures.com.

Verified HBI information:
- HBIVentures connects innovation, education, and community impact.
- HBI STEAM Academy is the nonprofit arm of HBIVentures. It prepares students
  through hands-on work in emerging technology, AI, data science, cybersecurity,
  IoT, product development, digital media, business, and real-world problem solving.
- HBI Innovation Foundry offers web application development, solutions architecture,
  product development, and AI agent development.
- Innovation Foundry MVP projects operate in focused three-month development sprints.
- HBI works with schools, educators, businesses, sponsors, technology organizations,
  healthcare, sports, media, and community partners.
- The HBI Foundation supports access, scholarships, community programs, charitable
  giving, corporate partnerships, and mission-aligned investment.
- The portfolio includes technology and community projects. The website also
  features Metric Mate and Soccer IQ Institute partner stories.
- Relevant website paths are /steam-academy, /innovation-foundry, /foundation,
  /portfolio, /partners, and /contact.
- The contact email is info@hbiventures.com.

Response rules:
- Answer in a warm, professional, direct voice.
- Keep most answers to 2-4 short sentences.
- Ask at most one useful follow-up question.
- Recommend the most relevant HBI page when helpful.
- Never claim to be human.
- Do not collect sensitive personal information. Direct detailed inquiries to the
  secure contact form.
`.trim();

function clientIdentifier(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(identifier: string) {
  const now = Date.now();
  const current = requestBuckets.get(identifier);

  if (!current || current.resetAt <= now) {
    requestBuckets.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > MAX_REQUESTS;
}

function validMessages(value: unknown): ChatMessage[] | null {
  if (!Array.isArray(value)) return null;

  const messages = value
    .slice(-10)
    .filter(
      (item): item is ChatMessage =>
        typeof item === "object" &&
        item !== null &&
        (item as ChatMessage).role !== undefined &&
        ["assistant", "user"].includes((item as ChatMessage).role) &&
        typeof (item as ChatMessage).text === "string",
    )
    .map((item) => ({ role: item.role, text: item.text.trim().slice(0, 900) }))
    .filter((item) => item.text.length > 0);

  if (!messages.length || messages[messages.length - 1]?.role !== "user") {
    return null;
  }

  return messages;
}

function responseText(payload: OpenAIResponse) {
  if (payload.output_text?.trim()) return payload.output_text.trim();

  return (
    payload.output
      ?.flatMap((item) => item.content ?? [])
      .filter((item) => item.type === "output_text" && item.text)
      .map((item) => item.text?.trim())
      .filter(Boolean)
      .join("\n")
      .trim() || ""
  );
}

async function isFlagged(apiKey: string, text: string) {
  try {
    const response = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: text,
        model: "omni-moderation-latest",
      }),
    });

    if (!response.ok) return false;
    const payload = (await response.json()) as {
      results?: Array<{ flagged?: boolean }>;
    };
    return payload.results?.[0]?.flagged === true;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    console.error("HBI assistant is missing OPENAI_API_KEY.");
    return NextResponse.json(
      { error: "The HBI assistant is temporarily unavailable." },
      { status: 503 },
    );
  }

  if (isRateLimited(clientIdentifier(request))) {
    return NextResponse.json(
      { error: "Please wait a few minutes before asking another question." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages = validMessages(
    typeof body === "object" && body !== null
      ? (body as { messages?: unknown }).messages
      : null,
  );

  if (!messages) {
    return NextResponse.json(
      { error: "Please enter a question for the HBI assistant." },
      { status: 400 },
    );
  }

  const latestQuestion = messages[messages.length - 1].text;
  if (await isFlagged(apiKey, latestQuestion)) {
    return NextResponse.json({
      answer:
        "I can help with HBIVentures programs, services, partnerships, and contact information. What would you like to explore?",
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: messages.map((message) => ({
          content: message.text,
          role: message.role,
        })),
        instructions: HBI_ASSISTANT_INSTRUCTIONS,
        max_output_tokens: 260,
        model: MODEL,
        store: false,
        temperature: 0.3,
      }),
    });

    const payload = (await response.json()) as OpenAIResponse;
    if (!response.ok) {
      console.error(
        "OpenAI rejected an HBI assistant request.",
        response.status,
        payload.error?.message ?? "Unknown error",
      );
      return NextResponse.json(
        { error: "The HBI assistant could not answer right now. Please try again." },
        { status: 502 },
      );
    }

    const answer = responseText(payload);
    if (!answer) {
      return NextResponse.json(
        { error: "The HBI assistant did not return an answer. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("HBI assistant request failed.", error);
    return NextResponse.json(
      { error: "The HBI assistant could not answer right now. Please try again." },
      { status: 502 },
    );
  }
}

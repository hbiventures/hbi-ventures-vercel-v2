import { NextRequest, NextResponse } from "next/server";
import { navigatorInstructions, relatedReferences, validChatMessages } from "../../lib/navigator";
import { platformProjects } from "../../lib/platform-projects";
import { readSse } from "../../lib/assistant-stream";
import { assistantRateLimit } from "../../lib/assistant-rate-limit";

type OpenAIResponse = {
  error?: { message?: string };
  output?: Array<{
    content?: Array<{ text?: string; type?: string }>;
    type?: string;
  }>;
  output_text?: string;
};

const MODEL = process.env.OPENAI_CHAT_MODEL?.trim() || "gpt-4o-mini";

const HBI_ASSISTANT_INSTRUCTIONS = navigatorInstructions(platformProjects);

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
  const response = await fetch("https://api.openai.com/v1/moderations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input: text, model: "omni-moderation-latest" }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) throw new Error("Moderation unavailable");
  const payload = (await response.json()) as { results?: Array<{ flagged?: boolean }> };
  if (typeof payload.results?.[0]?.flagged !== "boolean") throw new Error("Invalid moderation response");
  return payload.results[0].flagged;
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "Request origin was not accepted." }, { status: 403 });
  if (Number(request.headers.get("content-length")) > 50000) return NextResponse.json({ error: "Request too large." }, { status: 413 });
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    console.error("HBI assistant is missing OPENAI_API_KEY.");
    return NextResponse.json(
      { error: "The HBI assistant is temporarily unavailable." },
      { status: 503 },
    );
  }

  const sharedLimit = await assistantRateLimit(request, "chat");
  if (sharedLimit === "unavailable") return NextResponse.json({ error: "The assistant is temporarily unavailable. Please contact HBI." }, { status: 503 });
  if (sharedLimit === "limited") {
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

  const messages = validChatMessages(
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
  const streaming = (body as { stream?: unknown }).stream === true;
  const controller = new AbortController();
  const signal = AbortSignal.any([request.signal, controller.signal, AbortSignal.timeout(25000)]);
  try {
    if (await isFlagged(apiKey, latestQuestion)) {
      return NextResponse.json({
        answer: "I can help with HBI’s services, projects, partnerships and contact information. Please describe your project without sensitive personal information.",
      });
    }

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
        max_output_tokens: 700,
        model: MODEL,
        store: false,
        ...(streaming ? { stream: true } : {}),
        ...(/^gpt-4/.test(MODEL) ? { temperature: 0.3 } : {}),
      }),
      signal,
    });

    if (streaming && response.ok && response.body) {
      const upstream = response.body;
      const encoder = new TextEncoder();
      let cancelled = false;
      const stream = new ReadableStream({
        async start(output) {
          const send = (data: unknown) => { if (!cancelled) output.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`)); };
          let answer = "";
          let complete = false;
          try {
            for await (const event of readSse(upstream)) {
              if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
                answer += event.delta;
                if (answer.length > 12000) throw new Error("Output limit");
                send({ type: "delta", text: event.delta });
              }
              if (event.type === "response.completed") complete = true;
              if (["error", "response.failed", "response.incomplete"].includes(event.type)) throw new Error("Incomplete response");
            }
            if (!complete || !answer.trim()) throw new Error("Incomplete response");
            send({ type: "done", references: relatedReferences(`${latestQuestion} ${answer}`) });
          } catch { send({ type: "error", message: "The answer was interrupted. Please retry or contact HBI." }); }
          finally { if (!cancelled) output.close(); }
        },
        cancel() { cancelled = true; controller.abort(); },
      });
      return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-store", "X-Accel-Buffering": "no" } });
    }
    const payload = (await response.json()) as OpenAIResponse;
    if (!response.ok) {
      console.error(
        "OpenAI rejected an HBI assistant request.",
        response.status,
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

    return NextResponse.json({ answer, references: relatedReferences(`${latestQuestion} ${answer}`) });
  } catch (error) {
    // Do not log provider payloads or visitor conversation content.
    console.error("HBI assistant request failed.", error instanceof Error ? error.name : "Unknown error");
    return NextResponse.json(
      { error: "The HBI assistant could not answer right now. Please try again." },
      { status: 502 },
    );
  }
}

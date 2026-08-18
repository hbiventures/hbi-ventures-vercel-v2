"use client";

import { FormEvent, useEffect, useState } from "react";
import posthog from "posthog-js";
import {
  audienceChangeEvent,
  audiencePaths,
  audienceStorageKey,
  getAudiencePath,
} from "./audiencePaths";

type Message = { role: "assistant" | "user"; text: string };

const suggestions = ["Programs", "Partnerships", "Technology", "Contact"];
const visitorPaths = audiencePaths.filter((path) => path.id !== "overview");
const posthogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

function capture(event: string, properties: { audience: string; source?: "suggestion" | "freeform" }) {
  if (posthogConfigured) posthog.capture(event, properties);
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const savedPath = getAudiencePath(window.localStorage.getItem(audienceStorageKey));
    return savedPath && savedPath.id !== "overview" ? savedPath.id : null;
  });
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi! I’m HBI’s virtual assistant. What would you like to accomplish today?" },
  ]);
  const selectedPath = getAudiencePath(profile);

  useEffect(() => {
    function syncAudience(event: Event) {
      const id = (event as CustomEvent<{ id?: string }>).detail?.id;
      const path = getAudiencePath(id ?? null);
      if (!path || path.id === "overview") {
        setProfile(null);
        return;
      }
      setProfile(path.id);
      setMessages([{ role: "assistant", text: path.message }]);
    }

    window.addEventListener(audienceChangeEvent, syncAudience);
    return () => window.removeEventListener(audienceChangeEvent, syncAudience);
  }, []);

  function choosePath(id: string) {
    const path = visitorPaths.find((item) => item.id === id);
    if (!path) return;
    capture("chat_path_selected", { audience: path.id });
    setProfile(id);
    setMessages([{ role: "assistant", text: path.message }]);
    window.localStorage.setItem(audienceStorageKey, id);
    window.dispatchEvent(new CustomEvent(audienceChangeEvent, { detail: { id } }));
  }

  function skipWelcome() {
    setOpen(false);
  }

  function closeAssistant() {
    setOpen(false);
  }

  function changePath() {
    setProfile(null);
    setMessages([{ role: "assistant", text: "What would you like to accomplish today?" }]);
    window.localStorage.removeItem(audienceStorageKey);
    window.dispatchEvent(new CustomEvent(audienceChangeEvent, { detail: { id: "overview" } }));
    setOpen(false);
    window.setTimeout(() => document.getElementById("audience-selector")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  async function ask(question: string, source: "suggestion" | "freeform") {
    const cleaned = question.trim();
    if (!cleaned || pending) return;

    capture("chat_question_submitted", {
      audience: profile ?? "overview",
      source,
    });
    const conversation = [...messages, { role: "user" as const, text: cleaned }];
    setMessages(conversation);
    setInput("");
    setPending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation }),
      });
      const payload = (await response.json()) as {
        answer?: string;
        error?: string;
      };

      if (!response.ok || !payload.answer) {
        throw new Error(payload.error || "The assistant could not answer.");
      }

      capture("chat_response_received", {
        audience: profile ?? "overview",
        source,
      });
      setMessages((current) => [
        ...current,
        { role: "assistant", text: payload.answer as string },
      ]);
    } catch (error) {
      capture("chat_response_failed", {
        audience: profile ?? "overview",
        source,
      });
      const text =
        error instanceof Error
          ? error.message
          : "The assistant is temporarily unavailable.";
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: `${text} You can also email info@hbiventures.com.`,
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(input, "freeform");
  }

  const onboarding = open && !profile;

  return (
    <div className={onboarding ? "chatbot-shell onboarding" : "chatbot-shell"}>
      {open && (
        <section className="chatbot-panel" role={onboarding ? "dialog" : "region"} aria-modal={onboarding ? "false" : undefined} aria-labelledby="hbi-assistant-title">
          <header><div><strong id="hbi-assistant-title">Ask HBI</strong><span>{onboarding ? "AI-guided welcome" : "HBI virtual assistant"}</span></div><button type="button" onClick={closeAssistant} aria-label="Close chat">×</button></header>
          {onboarding ? (
            <div className="chatbot-onboarding">
              <p className="chatbot-welcome-kicker">Welcome to HBIVentures</p>
              <h2>What brings you here today?</h2>
              <p>Choose a path for tailored recommendations, or continue directly into the complete HBI experience.</p>
              <div>{visitorPaths.map((path) => <button type="button" onClick={() => choosePath(path.id)} key={path.id}><strong>{path.label}</strong><span>{path.detail}</span><b>→</b></button>)}</div>
              <button className="chatbot-skip" type="button" onClick={skipWelcome}>Explore the full website <span>→</span></button>
            </div>
          ) : (
            <>
              <div className="chatbot-messages" aria-live="polite">{messages.map((message, index) => <p className={message.role} key={`${message.role}-${index}`}>{message.text}</p>)}{pending && <p className="assistant chatbot-thinking">HBI is thinking…</p>}</div>
              {selectedPath && <div className="chatbot-path-links"><span>Recommended for you</span>{selectedPath.links.map(([label, href]) => <a href={href} key={href}>{label} <b>→</b></a>)}</div>}
              <div className="chatbot-suggestions">{suggestions.map((item) => <button type="button" disabled={pending} onClick={() => void ask(item, "suggestion")}  key={item}>{item}</button>)}</div>
              <form onSubmit={submit}><label htmlFor="hbi-chat-input">Ask a question</label><div><input id="hbi-chat-input" value={input} disabled={pending} maxLength={900} onChange={(event) => setInput(event.target.value)} placeholder="Type your question…"/><button type="submit" disabled={pending || !input.trim()} aria-label="Send question">→</button></div></form>
              <div className="chatbot-demo-note"><small>AI-generated answers use verified HBI website information.</small><button type="button" onClick={changePath}>Change my path</button></div>
            </>
          )}
        </section>
      )}
      {!onboarding && <button className="chatbot-toggle" type="button" onClick={() => setOpen((current) => { const next = !current; if (next) capture("chat_opened", { audience: profile ?? "overview" }); return next; })} aria-expanded={open} aria-label={open ? "Close HBI assistant" : "Open HBI assistant"}><span>✦</span> Ask HBI</button>}
    </div>
  );
}

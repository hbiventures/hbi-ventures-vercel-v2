"use client";

import { FormEvent, useEffect, useState } from "react";

type Message = { role: "assistant" | "user"; text: string };

const suggestions = ["Programs", "Partnerships", "Technology", "Contact"];
const visitorPaths = [
  { id: "student", label: "Student or family", detail: "Programs, skills, and career pathways", message: "Great—I’ll guide you toward student programs, hands-on learning, and future career pathways.", links: [["Explore STEAM Academy", "/steam-academy"], ["Watch student stories", "/#stories"]] },
  { id: "educator", label: "School or educator", detail: "Cohorts, curriculum, and collaboration", message: "Welcome! I’ll highlight cohort opportunities, project-based learning, and ways schools can work with HBI.", links: [["View STEAM programs", "/steam-academy"], ["Discuss a partnership", "/contact"]] },
  { id: "partner", label: "Business or partner", detail: "Innovation, talent, and sponsorship", message: "I’ll focus your experience on innovation services, talent development, sponsorship, and strategic partnerships.", links: [["Explore the Foundry", "/innovation-foundry"], ["Meet HBI partners", "/partners"]] },
  { id: "supporter", label: "Donor or supporter", detail: "Access, scholarships, and impact", message: "Thank you. I’ll guide you toward the HBI Foundation, community impact, and ways to expand access and opportunity.", links: [["Visit the Foundation", "/foundation"], ["Connect with HBI", "/contact"]] },
  { id: "technology", label: "Technology explorer", detail: "AI, IoT, products, and portfolio", message: "Let’s explore HBI’s work across AI, IoT, data science, connected systems, and product innovation.", links: [["View the portfolio", "/portfolio"], ["Explore technology", "/innovation-foundry"]] },
];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi! I’m HBI’s virtual assistant. What would you like to accomplish today?" },
  ]);
  const selectedPath = visitorPaths.find((path) => path.id === profile);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedPath = window.localStorage.getItem("hbi-visitor-path");
      if (savedPath) setProfile(savedPath);
      if (!window.localStorage.getItem("hbi-assistant-seen")) setOpen(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function choosePath(id: string) {
    const path = visitorPaths.find((item) => item.id === id);
    if (!path) return;
    setProfile(id);
    setMessages([{ role: "assistant", text: path.message }]);
    window.localStorage.setItem("hbi-visitor-path", id);
    window.localStorage.setItem("hbi-assistant-seen", "true");
  }

  function skipWelcome() {
    window.localStorage.setItem("hbi-assistant-seen", "true");
    setOpen(false);
  }

  function closeAssistant() {
    if (!profile) window.localStorage.setItem("hbi-assistant-seen", "true");
    setOpen(false);
  }

  function changePath() {
    setProfile(null);
    setMessages([{ role: "assistant", text: "What would you like to accomplish today?" }]);
    window.localStorage.removeItem("hbi-visitor-path");
    setOpen(true);
  }

  async function ask(question: string) {
    const cleaned = question.trim();
    if (!cleaned || pending) return;

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

      setMessages((current) => [
        ...current,
        { role: "assistant", text: payload.answer as string },
      ]);
    } catch (error) {
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
    void ask(input);
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
              <div className="chatbot-suggestions">{suggestions.map((item) => <button type="button" disabled={pending} onClick={() => void ask(item)} key={item}>{item}</button>)}</div>
              <form onSubmit={submit}><label htmlFor="hbi-chat-input">Ask a question</label><div><input id="hbi-chat-input" value={input} disabled={pending} maxLength={900} onChange={(event) => setInput(event.target.value)} placeholder="Type your question…"/><button type="submit" disabled={pending || !input.trim()} aria-label="Send question">→</button></div></form>
              <div className="chatbot-demo-note"><small>AI-generated answers use verified HBI website information.</small><button type="button" onClick={changePath}>Change my path</button></div>
            </>
          )}
        </section>
      )}
      {!onboarding && <button className="chatbot-toggle" type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-label={open ? "Close HBI assistant" : "Open HBI assistant"}><span>✦</span> Ask HBI</button>}
    </div>
  );
}

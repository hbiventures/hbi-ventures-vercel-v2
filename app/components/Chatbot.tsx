"use client";

import { FormEvent, useEffect, useState } from "react";

type Message = { role: "assistant" | "user"; text: string };

const suggestions = ["Programs", "Partnerships", "Technology", "Contact"];
const visitorPaths = [
  { id: "student", label: "Student or family", detail: "Programs, skills, and career pathways", message: "Great—I’ll guide you toward student programs, hands-on learning, and future career pathways.", links: [["Explore STEAM Academy", "/steam-academy"], ["Watch student stories", "/#stories"]] },
  { id: "educator", label: "School or educator", detail: "Cohorts, curriculum, and collaboration", message: "Welcome! I’ll highlight cohort opportunities, project-based learning, and ways schools can work with HBI.", links: [["View STEAM programs", "/steam-academy"], ["Discuss a partnership", "/contact"]] },
  { id: "partner", label: "Business or partner", detail: "Innovation, talent, and sponsorship", message: "I’ll focus your experience on innovation services, talent development, sponsorship, and strategic partnerships.", links: [["Explore the Foundry", "/innovation-foundry"], ["Meet HBI partners", "/partners"]] },
  { id: "supporter", label: "Donor or supporter", detail: "Access, scholarships, and impact", message: "Thank you. I’ll guide you toward the HBI Foundation, community impact, and ways to expand access and opportunity.", links: [["Visit the Foundation", "/foundation"], ["Connect with HBI", "/contact"]] },
  { id: "technology", label: "Technology explorer", detail: "AI, IoT, products, and portfolio", message: "Let’s explore HBI’s work across AI, IoT, data science, connected systems, and product innovation.", links: [["View the portfolio", "/portfolio"], ["Explore technology", "/#technology"]] },
];

function answerFor(question: string) {
  const value = question.toLowerCase();
  if (value.includes("steam") || value.includes("student") || value.includes("program")) return "HBI STEAM Academy prepares students through hands-on challenges in AI, data science, cybersecurity, IoT, product development, digital media, and business.";
  if (value.includes("partner") || value.includes("sponsor")) return "HBI works with education, technology, sports, healthcare, media, and community organizations. Use the Connect With Us button to begin a partnership conversation.";
  if (value.includes("technology") || value.includes("ai") || value.includes("iot")) return "HBI focuses on AI, data science, connected devices, cybersecurity, smart systems, connected mobility, product innovation, UX, and creative technology.";
  if (value.includes("foundation") || value.includes("donat")) return "The HBI Foundation expands access through scholarships, community programs, charitable giving, corporate partnerships, and mission-aligned investment.";
  if (value.includes("video") || value.includes("metric") || value.includes("soccer")) return "The Videos section features Metric Mate and Soccer IQ Institute. Scroll to Partners in Action to watch both embedded videos.";
  if (value.includes("contact") || value.includes("email")) return "You can reach HBI Ventures at info@hbiventures.com or use the Connect With Us page.";
  return "I’m the HBI demo assistant. Ask me about programs, partnerships, technology, the Foundation, videos, or contact information.";
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi! I’m the HBI demo assistant. What would you like to accomplish today?" },
  ]);
  const selectedPath = visitorPaths.find((path) => path.id === profile);

  useEffect(() => {
    const savedPath = window.localStorage.getItem("hbi-visitor-path");
    if (savedPath) setProfile(savedPath);
    if (!window.localStorage.getItem("hbi-assistant-seen")) setOpen(true);
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

  function changePath() {
    setProfile(null);
    setMessages([{ role: "assistant", text: "What would you like to accomplish today?" }]);
    window.localStorage.removeItem("hbi-visitor-path");
    setOpen(true);
  }

  function ask(question: string) {
    const cleaned = question.trim();
    if (!cleaned) return;
    setMessages((current) => [...current, { role: "user", text: cleaned }, { role: "assistant", text: answerFor(cleaned) }]);
    setInput("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(input);
  }

  const onboarding = open && !profile;

  return (
    <div className={onboarding ? "chatbot-shell onboarding" : "chatbot-shell"}>
      {open && (
        <section className="chatbot-panel" aria-label="HBI demo assistant">
          <header><div><strong>Ask HBI</strong><span>{onboarding ? "AI-first digital concierge" : "AI-first demo assistant"}</span></div><button type="button" onClick={() => setOpen(false)} aria-label="Close chat">×</button></header>
          {onboarding ? (
            <div className="chatbot-onboarding">
              <p className="chatbot-welcome-kicker">Welcome to HBI Ventures</p>
              <h2>What brings you here today?</h2>
              <p>Choose a path and I’ll create an AI-first journey to the most relevant programs, stories, solutions, and ways to connect.</p>
              <div>{visitorPaths.map((path) => <button type="button" onClick={() => choosePath(path.id)} key={path.id}><strong>{path.label}</strong><span>{path.detail}</span><b>→</b></button>)}</div>
              <button className="chatbot-skip" type="button" onClick={skipWelcome}>Skip and explore the full website</button>
            </div>
          ) : (
            <>
              <div className="chatbot-messages" aria-live="polite">{messages.map((message, index) => <p className={message.role} key={`${message.role}-${index}`}>{message.text}</p>)}</div>
              {selectedPath && <div className="chatbot-path-links"><span>Recommended for you</span>{selectedPath.links.map(([label, href]) => <a href={href} key={href}>{label} <b>→</b></a>)}</div>}
              <div className="chatbot-suggestions">{suggestions.map((item) => <button type="button" onClick={() => ask(item)} key={item}>{item}</button>)}</div>
              <form onSubmit={submit}><label htmlFor="hbi-chat-input">Ask a question</label><div><input id="hbi-chat-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type your question…"/><button type="submit" aria-label="Send question">→</button></div></form>
              <div className="chatbot-demo-note"><small>Demo only—answers use information from this website.</small><button type="button" onClick={changePath}>Change my path</button></div>
            </>
          )}
        </section>
      )}
      {!onboarding && <button className="chatbot-toggle" type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-label={open ? "Close HBI assistant" : "Open HBI assistant"}><span>✦</span> Ask HBI</button>}
    </div>
  );
}

"use client";

import { FormEvent, type KeyboardEvent, useEffect, useRef, useState } from "react";
import { CompassIcon, XIcon } from "@phosphor-icons/react";
import { NavigatorBrief } from "./NavigatorBrief";
import { TalkToHbi } from "./TalkToHbi";
import { AssistantDemo } from "./AssistantDemo";
import { readSse } from "../lib/assistant-stream";
import { suggestInterests, transcriptText } from "../lib/assistant-interests";
import { assistantAnalyticsConsentKey, trackAssistant as track } from "../lib/assistant-analytics";
import { isReferenceId, navigatorReferences, navigatorTopics, relatedReferences, visitorBriefSeed, type ChatMessage, type NavigatorTopic, type ReferenceId } from "../lib/navigator";

type Message = ChatMessage & { references?: ReferenceId[]; source?: "suggestion" | "freeform" | "voice"; failed?: boolean };
const welcome: Message = { role: "assistant", text: "I’m HBI’s Customer Care Assistant. I can explain our capabilities, show relevant projects, or help you prepare a project brief. What would you like to improve?" };

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState<NavigatorTopic | null>(null);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [briefOpen, setBriefOpen] = useState(false);
  const [briefSeed, setBriefSeed] = useState("");
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [partial, setPartial] = useState("");
  const [stopped, setStopped] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const stopRequested = useRef(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const inFlight = useRef<AbortController | null>(null);

  useEffect(() => {
    // Session-only consent; do not restore recordings or conversations from storage.
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate this tab's explicit consent after SSR
      setAnalyticsConsent(window.sessionStorage.getItem(assistantAnalyticsConsentKey) === "yes");
    } catch { /* Optional analytics. */ }
    function openNavigator() { setOpen(true); track("chat_opened", { entry: "page" }); }
    window.addEventListener("hbi-open-navigator", openNavigator);
    return () => { window.removeEventListener("hbi-open-navigator", openNavigator); inFlight.current?.abort(); };
  }, []);

  useEffect(() => {
    if (open) {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.current?.showModal();
      inputRef.current?.focus();
    } else if (dialog.current?.open) {
      dialog.current.close();
      (returnFocus.current?.isConnected ? returnFocus.current : launcher.current)?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!briefOpen && log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [messages, pending, briefOpen, partial]);

  async function ask(question: string, source: "suggestion" | "freeform" | "voice", retry = false) {
    const cleaned = question.trim();
    if (!cleaned || inFlight.current) return;
    const controller = new AbortController();
    inFlight.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 35000);
    const conversation = retry ? messages.filter(m => !m.failed) : [...messages, { role: "user" as const, text: cleaned, source }];
    setMessages(conversation); setInput(""); setPending(true); setPartial(""); setStopped(false); stopRequested.current = false;
    track("chat_question_submitted", { entry: source });
    try {
      const response = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({ stream: true, messages: conversation.filter(m => !m.failed).slice(-10).map(m => ({ role: m.role, text: m.text.slice(0, 900) })) }),
      });
      let payload;
      if (response.ok && response.headers.get("content-type")?.includes("text/event-stream") && response.body) {
        let answer = ""; let completed = false; let references: ReferenceId[] = [];
        for await (const event of readSse(response.body)) {
          if (event.type === "error") throw new Error("Interrupted");
          if (event.type === "delta" && typeof event.text === "string") { answer += event.text; setPartial(answer); }
          if (event.type === "done") { completed = true; references = event.references; }
        }
        if (!completed) throw new Error("Interrupted");
        payload = { answer, references };
      } else payload = await response.json();
      if (!response.ok || typeof payload.answer !== "string" || !payload.answer.trim()) throw new Error("Unavailable");
      const references = Array.isArray(payload.references) ? payload.references.filter(isReferenceId).slice(0, 3) : [];
      setMessages(current => [...current, { role: "assistant", text: payload.answer, references }]);
      track("chat_response_received");
      for (const category of suggestInterests(cleaned)) track("assistant_interest_suggested", { category, classification: "keyword_suggestion" });
    } catch {
      setMessages(current => [...current, { role: "assistant", failed: true, text: stopRequested.current ? "Answer stopped. You can retry or ask another question." : "I couldn’t complete that answer. You can retry, explore related pages, prepare a brief, or contact HBI directly.", references: relatedReferences(cleaned) }]);
      track("chat_response_failed");
    } finally { window.clearTimeout(timeout); inFlight.current = null; setPending(false); setPartial(""); }
  }

  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void ask(input, "freeform"); }
  function containFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), summary, audio[controls], [tabindex="0"]')).filter(element => element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && (document.activeElement === first || !controls.includes(document.activeElement as HTMLElement))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || !controls.includes(document.activeElement as HTMLElement))) { event.preventDefault(); first.focus(); }
  }
  function prepareBrief() {
    setBriefSeed(visitorBriefSeed(messages.filter(m => m.source === "freeform" || m.source === "voice")));
    setBriefOpen(true); track("navigator_brief_started");
  }
  const defaultReferences: ReferenceId[] = topic === "ecosystem" ? ["foundry", "steam", "foundation", "partners"] : ["lia", "ejc", "steam"];
  const lastQuestion = [...messages].reverse().find(m => m.role === "user");
  function close() { setVoiceOpen(false); inFlight.current?.abort(); setOpen(false); }

  return <div className="navigator-shell">
    <button ref={launcher} type="button" className="navigator-launcher" aria-haspopup="dialog" aria-controls="hbi-navigator-dialog" aria-expanded={open} onClick={() => { setOpen(true); track("chat_opened", { entry: "launcher" }); }}><CompassIcon size={22} aria-hidden="true" />HBI Customer Care Assistant</button>
    <dialog ref={dialog} id="hbi-navigator-dialog" className={`navigator-dialog ph-no-capture${expanded ? " navigator-expanded" : ""}`} aria-labelledby="hbi-assistant-title" onKeyDown={containFocus} onCancel={event => { event.preventDefault(); close(); }}>
      <header className="navigator-header"><div><strong id="hbi-assistant-title">HBI Customer Care Assistant</strong><span>Powered by HBI Digital Experience Platform</span></div><button type="button" className="navigator-close" onClick={close} aria-label="Close HBI Customer Care Assistant"><XIcon size={22} aria-hidden="true" /></button></header>
      <div className="assistant-toolbar"><button type="button" onClick={() => setExpanded(!expanded)} aria-pressed={expanded}>{expanded ? "Compact view" : "Expand view"}</button><button type="button" disabled={pending || briefOpen} onClick={() => setVoiceOpen(!voiceOpen)} aria-pressed={voiceOpen}>{voiceOpen ? "Close voice" : "Talk to HBI"}</button><button type="button" disabled={pending || voiceOpen || briefOpen} onClick={() => setDemoOpen(!demoOpen)} aria-expanded={demoOpen}>{demoOpen ? "Close demo" : "Try automation demo"}</button></div>
      <div className="navigator-contact"><span>Explore. Review. Connect.</span><a href="/contact" onClick={() => { track("navigator_contact_opened"); setOpen(false); }}>Contact HBI</a></div>
      {voiceOpen && open && <div className="navigator-brief-container"><TalkToHbi onTranscript={items => setMessages(current => [...current, ...items.map(item => ({ ...item, text: `[Voice caption] ${item.text}`, source: "voice" as const }))])} onEnd={() => setVoiceOpen(false)} /></div>}
      <div hidden={!briefOpen || voiceOpen} className="navigator-brief-container"><NavigatorBrief active={briefOpen && open} seed={briefSeed} transcript={transcriptText(messages.slice(1))} suggestedInterests={suggestInterests(messages.filter(m => m.role === "user").map(m => m.text).join(" "))} onBack={() => { setBriefOpen(false); window.requestAnimationFrame(() => inputRef.current?.focus()); }} /></div>
      <div className="navigator-chat" hidden={briefOpen || voiceOpen}>
        <div className="navigator-scroll" ref={log}>
          {demoOpen && <AssistantDemo />}
          {messages.length === 1 && <section className="navigator-start" aria-label="Optional starting points"><span className="assistant-eyebrow">Explore. Imagine. Build.</span><h2>What could work better?</h2><p>Tell me about your organization. Let’s find a useful next step.</p><div>{navigatorTopics.map(item => <button key={item.id} type="button" disabled={pending} aria-pressed={topic === item.id} onClick={() => { setTopic(item.id); track("chat_path_selected", { topic: item.id }); void ask(item.question, "suggestion"); }}>{item.label}</button>)}</div></section>}
          <nav className="navigator-projects" aria-label="Explore approved project and HBI pages">{defaultReferences.map(id => <a key={id} href={navigatorReferences[id].href} onClick={() => { track("navigator_evidence_opened", { reference: id }); setOpen(false); }}>{navigatorReferences[id].label}</a>)}</nav>
          <div role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions text" className="navigator-messages">{messages.map((message, index) => <article className={`navigator-message ${message.role}`} key={index}><span className="navigator-speaker">{message.role === "user" ? "You" : "HBI Customer Care Assistant"}</span><p>{message.text}</p>{!!message.references?.length && <nav aria-label="Related HBI pages" className="navigator-references"><span>Related work · HBI-approved information</span>{message.references.map(id => <a key={id} href={navigatorReferences[id].href} onClick={() => { track("navigator_evidence_opened", { reference: id }); close(); }}><strong>{navigatorReferences[id].label}</strong><small>{navigatorReferences[id].detail}</small></a>)}</nav>}{message.failed && index === messages.length - 1 && lastQuestion && <button type="button" disabled={pending} onClick={() => void ask(lastQuestion.text, lastQuestion.source ?? "freeform", true)}>Retry answer</button>}</article>)}</div>
          {partial && <article className="navigator-message" aria-hidden="true"><span className="navigator-speaker">HBI · answering</span><p>{partial}</p></article>}
          <p className="navigator-status" role="status">{pending ? "Preparing an answer from HBI’s approved information…" : ""}</p>
          <details className="assistant-privacy"><summary>Privacy & interest analytics</summary><p>Sharing your transcript with HBI is optional and happens only through your reviewed inquiry. Separate, optional interaction analytics use category labels and project clicks, not your questions or contact information.</p><label><input type="checkbox" checked={analyticsConsent} onChange={event => { const enabled = event.target.checked; try { window.sessionStorage.setItem(assistantAnalyticsConsentKey, enabled ? "yes" : "no"); setAnalyticsConsent(enabled); } catch { setAnalyticsConsent(false); } }} />Allow assistant interaction analytics in this browser session.</label><p>You can turn this off at any time. It stops future assistant events; it does not delete previously collected events. Analytics are reported to HBI through PostHog, not shown publicly.</p></details>
        </div>
        <div className="navigator-composer"><div className="assistant-actions"><button type="button" className="navigator-brief-button" disabled={pending} onClick={prepareBrief}>Prepare project brief</button>{pending && <button type="button" onClick={() => { stopRequested.current = true; setStopped(true); inFlight.current?.abort(); }} disabled={stopped}>Stop answer</button>}</div><form onSubmit={submit}><label htmlFor="hbi-chat-input">Ask HBI Customer Care Assistant</label><div><input ref={inputRef} id="hbi-chat-input" value={input} onChange={event => setInput(event.target.value)} maxLength={900} placeholder="What would you like to explore?" autoComplete="off" /><button type="submit" disabled={pending || !input.trim()}>Send</button></div></form><p>Automated assistance can make mistakes. Don’t share sensitive information. Nothing is sent to HBI’s team until you review and submit an inquiry.</p></div>
      </div>
    </dialog>
  </div>;
}

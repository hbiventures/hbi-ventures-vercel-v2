"use client";

import { FormEvent, type KeyboardEvent, useEffect, useRef, useState } from "react";
import {
  CaretDownIcon,
  ChartBarIcon,
  ChatCircleDotsIcon,
  CompassIcon,
  FileTextIcon,
  GearIcon,
  LinkIcon,
  ShieldCheckIcon,
  UsersIcon,
  WaveformIcon,
  XIcon,
} from "@phosphor-icons/react";
import { NavigatorBrief } from "./NavigatorBrief";
import { TalkToHbi } from "./TalkToHbi";
import { AssistantDemo } from "./AssistantDemo";
import { readSse } from "../lib/assistant-stream";
import { suggestInterests, transcriptText } from "../lib/assistant-interests";
import { assistantAnalyticsConsentKey, trackAssistant as track } from "../lib/assistant-analytics";
import { isReferenceId, navigatorReferences, navigatorTopics, relatedReferences, visitorBriefSeed, type ChatMessage, type NavigatorTopic, type ReferenceId } from "../lib/navigator";
import { parseVirtualFrontDeskIndustry, virtualFrontDeskScenarios } from "../lib/virtual-front-desk";

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
  const [moreOpen, setMoreOpen] = useState(false);
  const [partial, setPartial] = useState("");
  const [stopped, setStopped] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [landingContext, setLandingContext] = useState("");
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
    function openNavigator(event: Event) {
      const detail = event instanceof CustomEvent && event.detail && typeof event.detail === "object" ? event.detail as Record<string, unknown> : null;
      if (detail?.source === "virtual-front-desk") {
        const industry = parseVirtualFrontDeskIndustry(detail.industry);
        setLandingContext(virtualFrontDeskScenarios[industry].label);
        setVoiceOpen(detail.mode === "voice");
        track("chat_opened", { entry: "virtual-front-desk", industry });
      } else {
        setLandingContext("");
        setVoiceOpen(false);
        track("chat_opened", { entry: "page" });
      }
      setOpen(true);
    }
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
  function close() { setVoiceOpen(false); setMoreOpen(false); inFlight.current?.abort(); setOpen(false); }
  function showChat() {
    setVoiceOpen(false);
    setBriefOpen(false);
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  const startTopics = navigatorTopics.filter(item => item.id !== "ecosystem");
  const topicPresentation = {
    website: { icon: ChatCircleDotsIcon, detail: "Get guidance on common questions and next steps." },
    automation: { icon: GearIcon, detail: "Explore ways to save time and reduce manual work." },
    integrations: { icon: LinkIcon, detail: "Learn how HBI can work with your existing systems." },
  } as const;

  return <div className="navigator-shell">
    <button ref={launcher} type="button" className="navigator-launcher" aria-haspopup="dialog" aria-controls="hbi-navigator-dialog" aria-expanded={open} onClick={() => { setOpen(true); track("chat_opened", { entry: "launcher" }); }}><CompassIcon size={22} aria-hidden="true" />HBI Customer Care Assistant</button>
    <dialog ref={dialog} id="hbi-navigator-dialog" className={`navigator-dialog ph-no-capture${expanded ? " navigator-expanded" : ""}`} aria-labelledby="hbi-assistant-title" onKeyDown={containFocus} onCancel={event => { event.preventDefault(); close(); }}>
      <header className="navigator-header"><div><strong id="hbi-assistant-title">HBI Customer Care Assistant</strong><span>Powered by HBI Digital Experience Platform</span></div><button type="button" className="navigator-close" onClick={close} aria-label="Close HBI Customer Care Assistant"><XIcon size={22} aria-hidden="true" /></button></header>
      <div className="assistant-modebar">
        <div className="assistant-mode-tabs" aria-label="Assistant mode">
          <button type="button" className={!voiceOpen && !briefOpen ? "is-active" : ""} aria-pressed={!voiceOpen && !briefOpen} onClick={showChat}><ChatCircleDotsIcon size={20} aria-hidden="true" />Chat</button>
          <button type="button" className={voiceOpen ? "is-active" : ""} disabled={pending || briefOpen} aria-pressed={voiceOpen} onClick={() => { setVoiceOpen(true); setDemoOpen(false); }}><WaveformIcon size={21} aria-hidden="true" />Speak with Marin</button>
        </div>
        <div className="assistant-more-wrap">
          <button type="button" className="assistant-more-toggle" aria-expanded={moreOpen} aria-controls="assistant-more-menu" onClick={() => setMoreOpen(current => !current)}>More<CaretDownIcon size={16} aria-hidden="true" /></button>
          {moreOpen && <div id="assistant-more-menu" className="assistant-more-menu">
            <button type="button" onClick={() => { setExpanded(current => !current); setMoreOpen(false); }}>{expanded ? "Use compact view" : "Use expanded view"}</button>
            <button type="button" disabled={pending || voiceOpen || briefOpen} onClick={() => { setDemoOpen(current => !current); setMoreOpen(false); }}>{demoOpen ? "Close automation demo" : "Try automation demo"}</button>
            <a href="/contact" onClick={() => { track("navigator_contact_opened"); setOpen(false); }}>Contact HBI</a>
          </div>}
        </div>
      </div>
      {voiceOpen && open && <div className="navigator-brief-container"><TalkToHbi onTranscript={items => setMessages(current => [...current, ...items.map(item => ({ ...item, text: `[Voice caption] ${item.text}`, source: "voice" as const }))])} onEnd={() => setVoiceOpen(false)} /></div>}
      <div hidden={!briefOpen || voiceOpen} className="navigator-brief-container"><NavigatorBrief active={briefOpen && open} seed={briefSeed} transcript={transcriptText(messages.slice(1))} suggestedInterests={suggestInterests(messages.filter(m => m.role === "user").map(m => m.text).join(" "))} onBack={() => { setBriefOpen(false); window.requestAnimationFrame(() => inputRef.current?.focus()); }} /></div>
      <div className="navigator-chat" hidden={briefOpen || voiceOpen}>
        <div className="navigator-scroll" ref={log}>
          {demoOpen && <AssistantDemo />}
          {messages.length === 1 && <section className="navigator-start" aria-label="Optional starting points">
            <h2>How can HBI help?</h2>
            <p>{landingContext ? `You’re viewing the ${landingContext} example. Ask how HBI could shape the approved information, human handoff, and scheduling path.` : "Get answers, explore options, or take the next step for your business."}</p>
            <div className="navigator-start-list">{startTopics.map(item => {
              const presentation = topicPresentation[item.id];
              const TopicIcon = presentation.icon;
              return <button key={item.id} type="button" disabled={pending} aria-pressed={topic === item.id} onClick={() => { setTopic(item.id); track("chat_path_selected", { topic: item.id }); void ask(item.question, "suggestion"); }}>
                <span className="navigator-start-icon"><TopicIcon size={23} aria-hidden="true" /></span>
                <span><strong>{item.label}</strong><small>{presentation.detail}</small></span>
              </button>;
            })}</div>
          </section>}
          {messages.length === 1 && <button type="button" className="navigator-feature-row navigator-brief-entry" disabled={pending} onClick={prepareBrief}><span className="navigator-feature-icon"><FileTextIcon size={22} aria-hidden="true" /></span><span><strong>Prepare a project brief</strong><small>Share a few details to get better guidance.</small></span></button>}
          {messages.length === 1 && <details className="navigator-resource-group">
            <summary><span className="navigator-feature-icon"><ChartBarIcon size={22} aria-hidden="true" /></span><span>Explore example projects and outcomes</span><CaretDownIcon size={18} aria-hidden="true" /></summary>
            <nav className="navigator-projects" aria-label="Explore approved project and HBI pages">{defaultReferences.map(id => <a key={id} href={navigatorReferences[id].href} onClick={() => { track("navigator_evidence_opened", { reference: id }); setOpen(false); }}><strong>{navigatorReferences[id].label}</strong><small>{navigatorReferences[id].detail}</small></a>)}</nav>
          </details>}
          <div role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions text" className="navigator-messages">{messages.map((message, index) => index === 0 && messages.length === 1 ? null : <article className={`navigator-message ${message.role}`} key={index}><span className="navigator-speaker">{message.role === "user" ? "You" : "HBI Customer Care Assistant"}</span><p>{message.text}</p>{!!message.references?.length && <nav aria-label="Related HBI pages" className="navigator-references"><span>Related work · HBI-approved information</span>{message.references.map(id => <a key={id} href={navigatorReferences[id].href} onClick={() => { track("navigator_evidence_opened", { reference: id }); close(); }}><strong>{navigatorReferences[id].label}</strong><small>{navigatorReferences[id].detail}</small></a>)}</nav>}{message.failed && index === messages.length - 1 && lastQuestion && <button type="button" disabled={pending} onClick={() => void ask(lastQuestion.text, lastQuestion.source ?? "freeform", true)}>Retry answer</button>}</article>)}</div>
          {partial && <article className="navigator-message" aria-hidden="true"><span className="navigator-speaker">HBI · answering</span><p>{partial}</p></article>}
          <div className="navigator-status" role="status" aria-live="polite" aria-atomic="true">
            {pending && (stopped ? "Stopping…" : partial ? "Answering…" : <div className="assistant-thinking">
              <span className="assistant-thinking-mark" aria-hidden="true"><CompassIcon size={20} /></span>
              <span>Thinking…</span>
              <span className="assistant-thinking-dots" aria-hidden="true"><i /><i /><i /></span>
            </div>)}
          </div>
          <div className="navigator-privacy-row"><span className="navigator-feature-icon"><ShieldCheckIcon size={22} aria-hidden="true" /></span><a href="/privacy#assistant" onClick={() => setOpen(false)}>Privacy Notice</a><label><input type="checkbox" checked={analyticsConsent} onChange={event => { const enabled = event.target.checked; try { window.sessionStorage.setItem(assistantAnalyticsConsentKey, enabled ? "yes" : "no"); setAnalyticsConsent(enabled); } catch { setAnalyticsConsent(false); } }} />Allow limited interaction analytics—not my questions</label></div>
          <a className="navigator-feature-row navigator-contact-link" href="/contact" onClick={() => { track("navigator_contact_opened"); setOpen(false); }}><span className="navigator-feature-icon"><UsersIcon size={22} aria-hidden="true" /></span><span>Contact HBI</span></a>
        </div>
        <div className="navigator-composer"><div className="assistant-actions">{messages.length > 1 && <button type="button" className="navigator-brief-button" disabled={pending} onClick={prepareBrief}>Prepare project brief</button>}{pending && <button type="button" onClick={() => { stopRequested.current = true; setStopped(true); inFlight.current?.abort(); }} disabled={stopped}>Stop answer</button>}</div><form onSubmit={submit}><label className="navigator-visually-hidden" htmlFor="hbi-chat-input">Ask HBI Customer Care Assistant</label><div><input ref={inputRef} id="hbi-chat-input" value={input} onChange={event => setInput(event.target.value)} maxLength={900} placeholder="Ask about your business or project" autoComplete="off" /><button type="submit" disabled={pending || !input.trim()}>Send</button></div></form><p>Messages are processed by HBI’s platform and OpenAI. Don’t share sensitive information. <a href="/privacy#assistant" onClick={() => setOpen(false)}>Privacy Notice</a>.</p></div>
      </div>
    </dialog>
  </div>;
}

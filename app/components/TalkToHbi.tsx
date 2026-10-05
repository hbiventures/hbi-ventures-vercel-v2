"use client";
import { useEffect, useRef, useState } from "react";
import { MicrophoneIcon, MicrophoneSlashIcon } from "@phosphor-icons/react";
import type { ChatMessage } from "../lib/navigator";
import { voiceGreeting, voiceResponseNotice } from "../lib/voice-session";

type Caption = ChatMessage & { id: string };
export function TalkToHbi({ onTranscript, onEnd }: { onTranscript: (messages: ChatMessage[]) => void; onEnd: () => void }) {
  const [phase, setPhase] = useState<"ready" | "connecting" | "live" | "ended">("ready");
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [caption, setCaption] = useState("");
  const [consent, setConsent] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const pc = useRef<RTCPeerConnection | null>(null);
  const media = useRef<MediaStream | null>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const channel = useRef<RTCDataChannel | null>(null);
  const pending = useRef<AbortController | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generation = useRef(0);
  const transcript = useRef<Caption[]>([]);
  const delivered = useRef(false);

  function disconnect() {
    generation.current++;
    pending.current?.abort(); pending.current = null;
    if (timer.current) clearTimeout(timer.current);
    media.current?.getTracks().forEach(track => track.stop()); media.current = null;
    channel.current?.close(); channel.current = null;
    const connection = pc.current; pc.current = null;
    if (connection) { connection.onconnectionstatechange = null; connection.close(); }
    if (audio.current) { audio.current.pause(); audio.current.srcObject = null; }
  }
  useEffect(() => {
    const readiness = new AbortController();
    void fetch("/api/voice", { signal: readiness.signal }).then(response => response.ok ? response.json() : null).then(value => setAvailable(value?.available === true)).catch(() => { if (!readiness.signal.aborted) setAvailable(false); });
    function hidden() { if (document.hidden) { disconnect(); setPhase("ended"); } }
    document.addEventListener("visibilitychange", hidden);
    return () => { readiness.abort(); document.removeEventListener("visibilitychange", hidden); disconnect(); };
  }, []);

  function addCaption(id: string, role: "user" | "assistant", text: string) {
    if (!text.trim()) return;
    const item = { id, role, text: text.slice(0, 4000) };
    const index = transcript.current.findIndex(entry => entry.id === id && entry.role === role);
    if (index >= 0) transcript.current[index] = item; else transcript.current.push(item);
    transcript.current = transcript.current.slice(-80);
    setCaptions([...transcript.current]); setCaption("");
  }

  async function start() {
    if (!consent || !available || pc.current || phase === "connecting") return;
    const attempt = ++generation.current;
    setError(""); setPhase("connecting"); setMuted(false);
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection === "undefined") throw new Error("unsupported");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: false });
      if (attempt !== generation.current) { stream.getTracks().forEach(track => track.stop()); return; }
      media.current = stream;
      const connection = new RTCPeerConnection(); pc.current = connection;
      stream.getTracks().forEach(track => connection.addTrack(track, stream));
      connection.ontrack = event => { if (audio.current) { audio.current.srcObject = event.streams[0]; void audio.current.play().catch(() => setError("Use the audio player’s Play button to hear the assistant.")); } };
      connection.onconnectionstatechange = () => {
        if (connection.connectionState === "connected") setPhase("live");
        if (["failed", "disconnected", "closed"].includes(connection.connectionState)) { disconnect(); setPhase("ended"); setError("Voice disconnected. Your completed captions are below; text chat is still available."); }
      };
      const data = connection.createDataChannel("oai-events"); channel.current = data;
      data.onopen = () => data.send(JSON.stringify({ type: "response.create", response: { instructions: voiceGreeting } }));
      data.onmessage = event => {
        try {
          const value = JSON.parse(event.data);
          const notice = voiceResponseNotice(value);
          if (notice !== null) setError(notice);
          if (value.type === "conversation.item.input_audio_transcription.completed") addCaption(value.item_id, "user", value.transcript || "");
          if (value.type === "response.output_audio_transcript.done") addCaption(value.item_id || value.response_id, "assistant", value.transcript || "");
          if (value.type === "response.output_audio_transcript.delta") setCaption(current => (current + (value.delta || "")).slice(-4000));
          if (value.type === "error" || value.type === "conversation.item.input_audio_transcription.failed") setError("A voice turn could not be completed. Please repeat it or use text.");
        } catch { /* Ignore non-JSON transport events. */ }
      };
      const offer = await connection.createOffer(); await connection.setLocalDescription(offer);
      const controller = new AbortController(); pending.current = controller;
      const response = await fetch("/api/voice", { method: "POST", headers: { "Content-Type": "application/sdp" }, body: offer.sdp, signal: AbortSignal.any([controller.signal, AbortSignal.timeout(25000)]) });
      if (!response.ok) { const result = await response.json().catch(() => ({})); throw new Error(result.error || "Voice could not connect."); }
      const sdp = await response.text();
      if (attempt !== generation.current) return;
      await connection.setRemoteDescription({ type: "answer", sdp });
      // Bound the normal UI session. Provider-side limits are a separate deployment gate.
      timer.current = setTimeout(() => { disconnect(); setPhase("ended"); setError("This five-minute voice session has ended. You can return to text or start again."); }, 5 * 60 * 1000);
    } catch (failure) {
      if (attempt !== generation.current) return;
      disconnect(); setPhase("ended");
      setError(failure instanceof DOMException && failure.name === "NotAllowedError" ? "Microphone permission was not granted. You can continue using text." : failure instanceof Error && failure.message === "unsupported" ? "Voice is not supported in this browser. Please use text." : failure instanceof Error ? failure.message : "Voice is unavailable. Please use text.");
    }
  }
  function end() { disconnect(); setPhase("ended"); setCaption(""); }
  function back() {
    disconnect();
    if (!delivered.current) { onTranscript(transcript.current.map(({ role, text }) => ({ role, text }))); delivered.current = true; }
    onEnd();
  }
  return <section className="assistant-voice ph-no-capture" aria-label="Talk to HBI">
    <span className="assistant-eyebrow">Talk to HBI · optional voice</span><h2>Your Virtual Customer Care Assistant.</h2>
    <p>This is an AI-generated voice, not a live HBI team member. Audio is sent to OpenAI during the call. HBI does not save an audio recording in this experience. Provider data policies still apply.</p>
    {(phase === "ready" || phase === "ended") && <><label className="navigator-approval"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} />I agree to send microphone audio to OpenAI for this voice conversation.</label><button type="button" className="navigator-primary" disabled={!consent || !available} onClick={() => void start()}>Start voice conversation</button></>}
    {available !== true && <p role="status">{available === null ? "Checking voice availability…" : "Voice is not enabled in this environment yet. Text conversation and Contact HBI remain available."}</p>}
    <p role="status">{phase === "connecting" ? "Connecting voice…" : phase === "live" ? muted ? "Microphone muted" : "Microphone on · listening — you can interrupt" : "Microphone off"}</p>
    {(phase === "connecting" || phase === "live") && <div className="assistant-actions"><button type="button" disabled={phase !== "live"} onClick={() => { const next = !muted; media.current?.getAudioTracks().forEach(track => { track.enabled = !next; }); setMuted(next); }}>{muted ? <MicrophoneSlashIcon aria-hidden="true" /> : <MicrophoneIcon aria-hidden="true" />}{muted ? "Unmute microphone" : "Mute microphone"}</button><button type="button" onClick={end}>End voice conversation</button></div>}
    <audio ref={audio} autoPlay controls aria-label="Assistant voice playback" />
    {error && <p role="alert">{error}</p>}
    <div className="assistant-captions" role="log" aria-label="Voice captions" aria-live="polite">{captions.map(item => <p key={`${item.role}-${item.id}`}><strong>{item.role === "user" ? "You" : "HBI"}:</strong> {item.text}</p>)}{caption && <p aria-live="off">{caption}</p>}</div>
    <p>Captions may contain errors. Returning to text adds completed captions to this browser’s conversation, labeled as voice. Review them before choosing to share a transcript. The voice session starts separately from your text chat.</p>
    <button type="button" className="navigator-back" onClick={back}>Return to text conversation</button>
  </section>;
}

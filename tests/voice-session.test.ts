import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { voiceDelivery, voiceGreeting, voiceInstructions, voiceOutputTokenLimit, voiceResponseNotice } from '../app/lib/voice-session.ts';

test('Marin cheerleader delivery applies consistently to the greeting and conversation', () => {
  assert.ok(voiceGreeting.includes(voiceDelivery));
  assert.ok(voiceInstructions.includes(voiceDelivery));
  assert.match(voiceDelivery, /CHEERLEADER.*enthusiastic and bubbly/);
  assert.match(voiceDelivery, /not rushed or shouty/);
  assert.match(voiceDelivery, /finish sentence endings clearly/);
  assert.match(voiceDelivery, /calm and empathetic/);
  assert.match(voiceDelivery, /upbeat from the first "Hello"/);
  assert.match(voiceDelivery, /lively pitch variation/);
  assert.match(voiceDelivery, /brisk conversational pace/);
  assert.match(voiceDelivery, /across follow-up turns, not just the introduction/);
  assert.match(voiceDelivery, /quiet or brief visitor response alone is not a reason to become subdued/);
  assert.match(voiceDelivery, /Respect an explicit request to slow down/);
  assert.match(readFileSync('app/api/voice/route.ts', 'utf8'), /voice: "marin"/);
  assert.match(readFileSync('app/api/voice/route.ts', 'utf8'), /instructions:.*voiceInstructions/);
});

test('voice greeting uses the approved identity and retains truthful disclosure', () => {
  assert.match(voiceGreeting, /Hello, I'm Marin, HBI's Virtual Customer Care Assistant/);
  assert.match(voiceInstructions, /Your name is Marin/);
  assert.match(voiceGreeting, /HBI's Virtual Customer Care Assistant/);
  assert.doesNotMatch(voiceGreeting, /AI agent|AI-generated|automated Customer/);
  assert.match(voiceInstructions, /Be honest.*if asked/);
  assert.match(voiceInstructions, /short, complete sentences/);
  assert.match(voiceInstructions, /one vivid but concise illustrative story at a time/);
  assert.match(voiceInstructions, /customer moment.*potential business value.*measure or boundary/);
  assert.match(voiceInstructions, /Never present an illustrative story as a deployed customer result/);
  assert.equal(voiceOutputTokenLimit, 2048);
  const component = readFileSync('app/components/TalkToHbi.tsx', 'utf8');
  const chat = readFileSync('app/components/Chatbot.tsx', 'utf8');
  const privacy = readFileSync('app/privacy/page.tsx', 'utf8');
  assert.match(component, /instructions: voiceGreeting/);
  assert.match(component, /Marin is an AI-generated voice/);
  assert.match(privacy, /Marin is an AI-generated voice, not a live HBI team member/);
  assert.match(component, /voiceResponseNotice\(value\)/);
  assert.match(chat, /detail\.mode === "voice"/);
});

test('voice completion notices distinguish truncation, failure and normal interruption', () => {
  assert.match(voiceResponseNotice({ type: 'response.done', response: { status: 'incomplete', status_details: { reason: 'max_output_tokens' } } })!, /length limit.*continue/);
  assert.match(voiceResponseNotice({ type: 'response.done', response: { status: 'incomplete' } })!, /before it was complete/);
  assert.match(voiceResponseNotice({ type: 'response.done', response: { status: 'failed' } })!, /could not be completed/);
  for (const status of ['completed', 'cancelled']) assert.equal(voiceResponseNotice({ type: 'response.done', response: { status } }), '');
  assert.equal(voiceResponseNotice({ type: 'response.output_audio_transcript.delta' }), null);
  assert.equal(voiceResponseNotice({ type: 'response.done' }), null);
});

test('session privacy names platform and processor, separates retention and requires a fresh microphone opt-in', () => {
  const voice = readFileSync('app/components/TalkToHbi.tsx', 'utf8');
  const chat = readFileSync('app/components/Chatbot.tsx', 'utf8');
  const privacy = readFileSync('app/privacy/page.tsx', 'utf8');
  assert.match(privacy, /HBI Digital Experience Platform, which uses OpenAI APIs/);
  assert.match(privacy, /directly from your browser to OpenAI/);
  assert.match(privacy, /does not delete information already sent or processed/);
  assert.match(privacy, /Sharing a transcript with HBI is optional/);
  assert.match(privacy, /Muting pauses microphone input but keeps the session connected/);
  assert.match(voice, /Each new voice session requires a fresh opt-in/);
  assert.match(voice, /disabled=\{!consent \|\| !available\}/);
  const start = voice.slice(voice.indexOf('async function start()'), voice.indexOf('function end()'));
  assert.ok(start.indexOf('if (!consent') < start.indexOf('setConsent(false)'));
  assert.ok(start.indexOf('setConsent(false)') < start.indexOf('await navigator.mediaDevices.getUserMedia'));
  assert.match(chat, /href="\/privacy#assistant"/);
  assert.match(privacy, /Questions and conversation context.*HBI Digital Experience Platform/);
  assert.doesNotMatch(chat, /Nothing is sent to HBI’s team/);
  assert.match(privacy, /https:\/\/developers.openai.com\/api\/docs\/guides\/your-data/);
});

test('voice keeps point-of-use consent while detailed notices live on the privacy page', () => {
  const voice = readFileSync('app/components/TalkToHbi.tsx', 'utf8');
  const privacy = readFileSync('app/privacy/page.tsx', 'utf8');
  assert.doesNotMatch(voice, /<details[^>]*assistant-privacy/);
  assert.match(voice, /href="\/privacy#voice"/);
  assert.match(voice, /checked=\{consent\} onChange=\{event => setConsent\(event.target.checked\)\}/);
  assert.match(privacy, /Captions may contain errors/);
  assert.match(privacy, /HBI does not save an audio recording/);
  assert.match(voice, /media\.current\?\.getTracks\(\)\.forEach\(track => track\.stop\(\)\)/);
  assert.match(voice, /connection\.close\(\)/);
});

test('privacy notice is linked sitewide and centralizes assistant, voice, analytics and contact disclosures', () => {
  const page = readFileSync('app/privacy/page.tsx', 'utf8');
  const header = readFileSync('app/components/SiteHeader.tsx', 'utf8');
  const chat = readFileSync('app/components/Chatbot.tsx', 'utf8');
  assert.match(header, /\["Privacy", "\/privacy"\]/);
  for (const id of ['information', 'assistant', 'voice', 'analytics', 'sharing', 'retention', 'contact']) assert.match(page, new RegExp(`id="${id}"`));
  assert.doesNotMatch(chat, /<details className="assistant-privacy"/);
  assert.match(chat, /Allow limited interaction analytics—not my questions/);
  assert.match(chat, /Messages are processed by HBI’s platform and OpenAI.*Privacy Notice/);
});

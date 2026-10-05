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
  assert.match(readFileSync('app/api/voice/route.ts', 'utf8'), /voice: "marin"/);
});

test('voice greeting uses the approved identity and retains truthful disclosure', () => {
  assert.match(voiceGreeting, /HBI's Virtual Customer Care Assistant/);
  assert.doesNotMatch(voiceGreeting, /AI agent|AI-generated|automated Customer/);
  assert.match(voiceInstructions, /Be honest.*if asked/);
  assert.match(voiceInstructions, /short, complete sentences/);
  assert.equal(voiceOutputTokenLimit, 2048);
  const component = readFileSync('app/components/TalkToHbi.tsx', 'utf8');
  assert.match(component, /instructions: voiceGreeting/);
  assert.match(component, /This is an AI-generated voice, not a live HBI team member/);
  assert.match(component, /voiceResponseNotice\(value\)/);
});

test('voice completion notices distinguish truncation, failure and normal interruption', () => {
  assert.match(voiceResponseNotice({ type: 'response.done', response: { status: 'incomplete', status_details: { reason: 'max_output_tokens' } } })!, /length limit.*continue/);
  assert.match(voiceResponseNotice({ type: 'response.done', response: { status: 'incomplete' } })!, /before it was complete/);
  assert.match(voiceResponseNotice({ type: 'response.done', response: { status: 'failed' } })!, /could not be completed/);
  for (const status of ['completed', 'cancelled']) assert.equal(voiceResponseNotice({ type: 'response.done', response: { status } }), '');
  assert.equal(voiceResponseNotice({ type: 'response.output_audio_transcript.delta' }), null);
  assert.equal(voiceResponseNotice({ type: 'response.done' }), null);
});

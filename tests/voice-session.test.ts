import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { voiceGreeting, voiceInstructions, voiceOutputTokenLimit, voiceResponseNotice } from '../app/lib/voice-session.ts';

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

import test from 'node:test';
import assert from 'node:assert/strict';
import { initialVoiceActivity, nextVoiceActivity, voiceVisualLabels, voiceVisualState } from '../app/lib/voice-activity.ts';

test('Marin listens, prepares and speaks in response to transport events', () => {
  let state = initialVoiceActivity;
  assert.equal(voiceVisualState('live', state, false, false), 'listening');
  state = nextVoiceActivity(state, { type: 'input_audio_buffer.speech_started' });
  assert.equal(voiceVisualState('live', state, false, false), 'hearing');
  state = nextVoiceActivity(state, { type: 'input_audio_buffer.speech_stopped' });
  assert.equal(voiceVisualState('live', state, false, false), 'thinking');
  state = nextVoiceActivity(state, { type: 'response.created' });
  assert.equal(voiceVisualState('live', state, false, false), 'thinking');
  state = nextVoiceActivity(state, { type: 'output_audio_buffer.started' });
  assert.equal(voiceVisualState('live', state, false, false), 'speaking');
  state = nextVoiceActivity(state, { type: 'response.done' });
  assert.equal(voiceVisualState('live', state, false, false), 'speaking', 'generation done must not cut off playback animation');
  state = nextVoiceActivity(state, { type: 'output_audio_buffer.stopped' });
  assert.equal(voiceVisualState('live', state, false, false), 'listening');
});

test('interruption switches to listening and does not leave a false speaking state', () => {
  let state = nextVoiceActivity(initialVoiceActivity, { type: 'output_audio_buffer.started' });
  state = nextVoiceActivity(state, { type: 'input_audio_buffer.speech_started' });
  state = nextVoiceActivity(state, { type: 'output_audio_buffer.cleared' });
  assert.equal(voiceVisualState('live', state, false, false), 'hearing');
  assert.equal(voiceVisualState('live', state, true, false), 'muted');
});

test('microphone mute does not suppress Marin playback; paused audio does', () => {
  const state = nextVoiceActivity(initialVoiceActivity, { type: 'output_audio_buffer.started' });
  assert.equal(voiceVisualState('live', state, true, false), 'speaking');
  assert.equal(voiceVisualState('live', state, false, true), 'paused');
  assert.equal(voiceVisualState('live', initialVoiceActivity, true, false), 'muted');
});

test('connection lifecycle overrides stale activity and every state has a text label', () => {
  const speaking = nextVoiceActivity(initialVoiceActivity, { type: 'output_audio_buffer.started' });
  for (const phase of ['ready', 'connecting', 'ended'] as const) assert.equal(voiceVisualState(phase, speaking, false, false), phase);
  for (const label of Object.values(voiceVisualLabels)) assert.ok(label.length > 0);
  assert.equal(nextVoiceActivity(initialVoiceActivity, { type: 'unknown' }), initialVoiceActivity);
  const thinking = nextVoiceActivity(initialVoiceActivity, { type: 'response.created' });
  assert.equal(voiceVisualState('live', nextVoiceActivity(thinking, { type: 'error' }), false, false), 'listening');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const chat = readFileSync(new URL('../app/components/Chatbot.tsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('../app/navigator.css', import.meta.url), 'utf8');

test('thinking indicator reflects pending, streaming and stopping without fake delays', () => {
  assert.match(chat, /pending && \(stopped \? "Stopping…" : partial \? "Answering…"/);
  assert.match(chat, /role="status" aria-live="polite" aria-atomic="true"/);
  assert.match(chat, /assistant-thinking-dots" aria-hidden="true"/);
  assert.match(chat, /finally \{[^\n]*setPending\(false\)/);
  assert.match(css, /@keyframes assistant-thinking-dot/);
});

test('thinking animation respects device and page motion preferences', () => {
  assert.match(css, /prefers-reduced-motion: reduce[^\n]*animation: none !important/);
  assert.match(css, /body:has\(\.wt-home\[data-motion="paused"\]\)[^\n]*animation: none/);
  assert.match(css, /navigator-dialog:not\(\[open\]\)[^\n]*animation-play-state: paused/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { introMode, INTRO_SEEN_KEY } from '../app/lib/experience-intro.ts';

const fresh = { seen: false, hash: '', scrollY: 0, reducedMotion: false, smallScreen: false, saveData: false };
test('first desktop visit plays; repeat visits and deep links reach the homepage directly', () => {
  assert.equal(introMode(fresh), 'video');
  assert.equal(introMode({ ...fresh, seen: true }), 'hidden');
  assert.equal(introMode({ ...fresh, hash: '#work' }), 'hidden');
  assert.equal(introMode({ ...fresh, scrollY: 200 }), 'hidden');
  assert.equal(INTRO_SEEN_KEY, 'hbi-platform-intro-v1-seen');
});
test('motion, mobile and data-saving preferences do not request the film', () => {
  for (const setting of ['reducedMotion', 'smallScreen', 'saveData']) {
    assert.equal(introMode({ ...fresh, [setting]: true }), 'static');
  }
});
test('intro keeps immediate escape, real CTA, error recovery and session-only storage', () => {
  const source = readFileSync('app/components/ExperienceIntro.tsx', 'utf8');
  for (const pattern of [/Skip intro/, /Pause intro/, /Escape/, /onEnded=\{finish\}/, /onError=/, /stalledFor >= 8/, /sessionStorage/, /prefers-reduced-motion/, /<EngagementLink/, /pagehide/]) assert.match(source, pattern);
  assert.doesNotMatch(source, /localStorage|getUserMedia|fetch\(|autoPlay|loop=/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { introMedia, introMode, INTRO_SEEN_KEY } from '../app/lib/experience-intro.ts';

const fresh = { seen: false, hash: '', scrollY: 0, reducedMotion: false, saveData: false };
test('phone playback selects one readable portrait film and a matching fallback', () => {
  for (const width of [320, 375, 390, 430, 700]) {
    const media = introMedia(width);
    assert.equal(media.portrait, true);
    assert.equal(media.width / media.height, 4 / 5);
    assert.match(media.video, /mobile-v1\.mp4$/);
    assert.match(media.poster, /mobile-poster\.webp$/);
  }
  for (const width of [701, 844, 1280, 1920]) {
    assert.equal(introMedia(width).video, '/intro/platform-story-v1.mp4');
    assert.equal(introMedia(width).portrait, false);
  }
  const source = readFileSync('app/components/ExperienceIntro.tsx', 'utf8');
  assert.equal((source.match(/<source /g) || []).length, 1);
  assert.match(source, /poster=\{media\.poster\}/);
  assert.match(source, /data-portrait=\{media\.portrait\}/);
  assert.match(source, /setMedia\(introMedia\(window.innerWidth\)\)/);
});
test('first desktop visit plays; repeat visits and deep links reach the homepage directly', () => {
  assert.equal(introMode(fresh), 'video');
  assert.equal(introMode({ ...fresh, seen: true }), 'hidden');
  assert.equal(introMode({ ...fresh, hash: '#work' }), 'hidden');
  assert.equal(introMode({ ...fresh, scrollY: 200 }), 'hidden');
  assert.equal(INTRO_SEEN_KEY, 'hbi-platform-intro-v1-seen');
});
test('motion and data-saving preferences do not request the film', () => {
  for (const setting of ['reducedMotion', 'saveData']) {
    assert.equal(introMode({ ...fresh, [setting]: true }), 'static');
  }
});
test('intro keeps mobile inline playback, immediate escape, recovery and session-only storage', () => {
  const source = readFileSync('app/components/ExperienceIntro.tsx', 'utf8');
  for (const pattern of [/Skip intro/, /Pause intro/, /Escape/, /onEnded=\{finish\}/, /onError=/, /stalledFor >= 8/, /sessionStorage/, /prefers-reduced-motion/, /<EngagementLink/, /pagehide/]) assert.match(source, pattern);
  assert.match(source, /autoPlay muted playsInline/);
  assert.doesNotMatch(source, /max-width: 700px|localStorage|getUserMedia|fetch\(|loop=/);
});

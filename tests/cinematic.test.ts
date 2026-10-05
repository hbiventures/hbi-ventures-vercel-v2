import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync('app/workflow-theatre.css', 'utf8');
const hero = readFileSync('app/components/ExperienceHero.tsx', 'utf8');
const control = readFileSync('app/components/CinematicMotionControl.tsx', 'utf8');

test('cinematic effects progressively enhance the existing linked project imagery', () => {
  assert.match(hero, /platformProjects\.map/);
  assert.match(hero, /href=\{project\.url\}/);
  assert.match(hero, /wt-hero-plane-/);
  assert.match(css, /@supports \(animation-timeline: scroll\(\)\)/);
  assert.match(css, /@supports \(animation-timeline: view\(\)\)/);
  assert.match(css, /animation-range: 0px 580px/);
  assert.match(css, /@media \(min-width: 901px\)/);
  assert.doesNotMatch(control, /requestAnimationFrame|addEventListener|setInterval/);
});

test('cinematic motion has an accessible local opt-out and system preference fallback', () => {
  assert.match(control, /aria-pressed=\{paused\}/);
  assert.match(control, /Reduce page motion/);
  assert.match(control, /delete page\.dataset\.motion/);
  assert.match(css, /html:has\(\.wt-home\[data-motion="paused"\]\).*scroll-behavior: auto/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /\.wt-home\[data-motion="paused"\].*animation: none !important; transition: none !important/);
  // No hidden content, scroll locking, heavy new assets or endless motion.
  const cinematicCss = css.slice(css.indexOf('/* Cinematic enhancement:'));
  assert.doesNotMatch(cinematicCss, /opacity: 0[;} ]|overflow: hidden|infinite|position: fixed|url\(/);
});

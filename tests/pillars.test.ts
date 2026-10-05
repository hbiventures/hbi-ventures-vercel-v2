import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { navigatorInstructions } from '../app/lib/navigator.ts';

test('homepage explains all three roles and a shared HBI purpose before platform proof', () => {
  const home = readFileSync('app/page.tsx', 'utf8');
  const overview = readFileSync('app/components/PillarsOverview.tsx', 'utf8');
  const hero = readFileSync('app/components/ExperienceHero.tsx', 'utf8');
  assert.ok(home.indexOf('<PillarsOverview') < home.indexOf('<ProofShowcase'));
  assert.match(overview, /id="pillars"/);
  assert.doesNotMatch(hero, /id="pillars"/);
  for (const phrase of ['HBI Innovation Foundry', 'HBI STEAM Academy', 'HBI Foundation', 'Build practical solutions.', 'Develop future-ready talent.', 'Expand access to opportunity.', 'How they work together', 'practical innovation, future-ready talent and broader opportunity']) assert.ok(overview.includes(phrase), phrase);
  for (const href of ['/innovation-foundry', 'https://hbisteam.org', '/foundation', '/about']) assert.ok(overview.includes(href), href);
  assert.match(overview, /Home of the HBI Digital Experience Platform/);
});

test('About and Navigator explain complementary roles without promising financial or staffing relationships', () => {
  const about = readFileSync('app/about/page.tsx', 'utf8');
  assert.match(about, /practical innovation, future-ready talent and broader opportunity/);
  const instructions = navigatorInstructions([]);
  assert.match(instructions, /not a guaranteed learner-to-job pipeline/);
  assert.match(instructions, /Do not imply Academy students staff client projects/);
  assert.match(instructions, /Foundry purchases automatically fund scholarships/);
});

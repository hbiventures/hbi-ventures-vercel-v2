import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';

test('hero makes the audience and capabilities explicit without losing the approved vision', () => {
  const hero = readFileSync('app/components/ExperienceHero.tsx', 'utf8');
  assert.match(hero, /what you offer/);
  assert.match(hero, /small and midsize organizations/);
  assert.match(hero, /customer care assistants, connected tools and workflow automation/);
  assert.match(hero, /living vision board/);
});

test('project inquiry paths are visible outside story disclosures and have distinct accessible names', () => {
  const proof = readFileSync('app/components/ProofShowcase.tsx', 'utf8');
  assert.ok(proof.indexOf('className="wt-project-inquiry"') < proof.indexOf('<details'));
  assert.match(proof, /sr-only.*to \{project.label\}/);
  assert.equal((proof.match(/Discuss a similar project/g) ?? []).length, 1);
});

test('conceptual platform art is lightweight, decorative and does not replace real project proof', () => {
  const offer = readFileSync('app/components/ExperienceOffer.tsx', 'utf8');
  assert.match(offer, /connected-platform-v1.webp" alt="" width=\{1200\} height=\{800\}/);
  assert.match(offer, /Conceptual illustration/);
  assert.ok(statSync('public/refresh/connected-platform-v1.webp').size < 100_000);
  for (const title of ['Connect your tools', 'Support your customers', 'Reduce repetitive handoffs', 'Learn what works']) assert.ok(offer.includes(title));
});

test('workflow demonstrations start and reset at the first step', () => {
  const theatre = readFileSync('app/components/WorkflowTheatre.tsx', 'utf8');
  assert.match(theatre, /\[step, setStep\] = useState\(0\)/);
  assert.match(theatre, /function select\(index: number\).*setStep\(0\)/);
});

test('vision copy is visible and divided into readable themes with a distinct conclusion', () => {
  const offer = readFileSync('app/components/ExperienceOffer.tsx', 'utf8');
  const story = offer.slice(offer.indexOf('className="wt-offer-story"'), offer.indexOf('className="wt-offer-platform"'));
  for (const phrase of [
    'More than a collection of web pages, we create a connected digital experience',
    'Bring your brand to life',
    'Turn engagement into action',
    'Connect the work behind the experience',
    'AI-powered assistants, integrations, automation, and analytics work together',
    'a manual process, a disconnected system, or a customer journey',
    'The result is more than a website.',
    'grow with your organization.',
  ]) assert.ok(story.includes(phrase), `Missing vision content: ${phrase}`);
  assert.equal((story.match(/<h3>/g) ?? []).length, 3);
  assert.equal((story.match(/<p(?:\s|>)/g) ?? []).length, 9);
  assert.ok(!story.includes('<details'));
});

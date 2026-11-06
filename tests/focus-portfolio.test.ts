import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { focusPortfolioProject, platformProjects } from '../app/lib/platform-projects.ts';
import { relatedReferences, navigatorReferences, navigatorInstructions } from '../app/lib/navigator.ts';
import { assistantStrategyVersion } from '../app/lib/assistant-strategy.js';

test('FOCUS is a text-only Shopify UI/UX case separate from the three hosted platform projects', () => {
  assert.equal(focusPortfolioProject.name, 'FOCUS-I-APPAREL');
  assert.equal(focusPortfolioProject.storyTitle, 'From brand story to shopping');
  assert.equal(focusPortfolioProject.url, 'https://www.focusiapparel.com/');
  assert.equal(focusPortfolioProject.image, null);
  assert.deepEqual(platformProjects.map(p => p.id), ['lia', 'ejc', 'steam']);
  assert.equal(focusPortfolioProject.capabilities.length, 4);
  assert.doesNotMatch(focusPortfolioProject.capabilities.join(' '), /hosting|analytics|reporting|checkout|conversion|research|size.chart|terminology/i);
  assert.match(focusPortfolioProject.detail, /Shopify hosting, catalog, cart and checkout infrastructure/);
});

test('FOCUS uses the same project map, description, external destination and expandable story without client imagery', () => {
  const source = readFileSync('app/components/ProofShowcase.tsx', 'utf8');
  assert.match(source, /const projectStories = \[\.\.\.platformProjects, focusPortfolioProject\]/);
  assert.match(source, /projectStories.map\(project => <article className="wt-project"/);
  assert.match(source, /project.image \? <Image/);
  assert.match(source, /Shopify storefront UI\/UX/);
  assert.match(source, /Visit FOCUS-I-APPAREL/);
  assert.match(source, /<details className="wt-project-details"/);
  assert.match(source, /Platform foundations delivered for LIA, EJC and HBI STEAM/);
  assert.doesNotMatch(source, /Delivered across every project/);
});

test('Marin keeps app-owned FOCUS links visible without replacing Client Connect precedence', () => {
  for (const prompt of ['FOCUS-I-APPAREL', 'focusiapparel', 'Focus Apparel LIA video EJC STEAM partners']) {
    const refs = relatedReferences(prompt);
    assert.equal(refs[0], 'focusApparel');
    assert.ok(refs.length <= 3);
  }
  assert.equal(relatedReferences('Client Connect and FOCUS-I-APPAREL LIA EJC')[0], 'clientConnect');
  assert.ok(relatedReferences('Client Connect and FOCUS-I-APPAREL LIA EJC').includes('focusApparel'));
  assert.equal(navigatorReferences.focusApparel.href, focusPortfolioProject.url);
});

test('shared text and voice knowledge distinguish scoped FOCUS work from unsupported platform/outcome claims', () => {
  assert.equal(assistantStrategyVersion, '2026-11-06-focus-portfolio');
  const instructions = navigatorInstructions(platformProjects);
  for (const fact of ['FOCUS-I-APPAREL — SCOPED SHOPIFY UI/UX PROJECT', 'direct Shop all entry', 'journal Coming Soon presentation', 'Do not attribute HBI hosting, analytics or reporting', 'Do not claim deferred size-chart or terminology fixes were completed', 'Do not invent client testimonials or endorsement', 'HBI DEP Client Connect', 'Marin only explains and guides']) assert.ok(instructions.includes(fact), fact);
});

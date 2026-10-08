import test from 'node:test';
import assert from 'node:assert/strict';
import { assistantCommercialStrategy, assistantStrategyVersion } from '../app/lib/assistant-strategy.js';
import { navigatorInstructions } from '../app/lib/navigator.ts';
import { platformProjects } from '../app/lib/platform-projects.ts';

test('both assistant channels receive versioned platform, product and end-to-end positioning', () => {
  const instructions = navigatorInstructions(platformProjects);
  assert.ok(instructions.includes(assistantCommercialStrategy));
  assert.ok(instructions.includes(assistantStrategyVersion));
  for (const phrase of [
    'developed by HBI within the HBI Innovation Foundry',
    'Digital Front Desk is a new HBI product',
    'Virtual Front Desk is an alternate name',
    'No existing website or established workflow is required',
    'end-to-end solution to house the Digital Front Desk',
    'a complete rebuild is not automatically necessary',
    'no business action tools',
  ]) assert.ok(instructions.includes(phrase), phrase);
});

test('skill-supported outcomes remain scoped services, not fabricated platform modules or client proof', () => {
  for (const phrase of ['UX/UI', '3D storytelling', 'short product videos', 'dashboards', 'document, spreadsheet or presentation workflows',
    'potential solutions to scope', 'not additional released products or delivered customer outcomes',
    'never imply customers receive access', 'not a self-service feature', 'human approval']) {
    if (phrase === 'not a self-service feature') assert.match(assistantCommercialStrategy, /does not mean every capability is a self-service feature/);
    else assert.ok(assistantCommercialStrategy.includes(phrase), phrase);
  }
  assert.match(assistantCommercialStrategy, /No prices, packages, guaranteed savings/);
  assert.match(assistantCommercialStrategy, /Do not claim accessibility certification or regulatory compliance/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('shared link styling removes underlines without removing keyboard focus outlines', () => {
  const css = readFileSync('app/workflow-theatre.css', 'utf8');
  assert.match(css, /a, a \*, \[role="link"\], \[role="link"\] \* \{ text-decoration: none !important; \}/);
  assert.match(css, /:focus-visible \{ outline: 3px solid/);
  assert.doesNotMatch(css.slice(css.indexOf('/* Site-wide link treatment')), /outline: (none|0)/);
});

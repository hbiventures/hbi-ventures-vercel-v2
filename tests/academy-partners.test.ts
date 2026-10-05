import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { navigatorInstructions, navigatorReferences } from '../app/lib/navigator.ts';

test('Academy program partner directory is not presented as Ventures partners', () => {
  const home = readFileSync('app/page.tsx', 'utf8');
  const navigation = readFileSync('app/components/SiteHeader.tsx', 'utf8');
  assert.doesNotMatch(home, /Our partners|All 19 partners|featuredPartners|partnerGroups/);
  assert.doesNotMatch(navigation, /\["Partners",|\/#partners/);
});

test('legacy directory and assistant partner references lead to the Academy', () => {
  const destination = 'https://hbisteam.org/about#partners-title';
  const route = readFileSync('app/partners/page.tsx', 'utf8');
  assert.ok(route.includes(`redirect("${destination}")`));
  assert.equal(navigatorReferences.partners.href, destination);
  assert.match(navigatorReferences.partners.label, /STEAM Academy/);
  assert.match(navigatorInstructions([]), /partner directory belongs to HBI STEAM Academy, not HBI Ventures or the Innovation Foundry/);
});

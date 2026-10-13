import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import robots from '../app/robots.ts';
import sitemap from '../app/sitemap.ts';
import { relatedReferences } from '../app/lib/navigator.ts';
import { assistantCommercialStrategy } from '../app/lib/assistant-strategy.js';
import { engagementLabel } from '../app/lib/engagement.ts';
import { virtualFrontDeskScenarios, virtualFrontDeskCampaign } from '../app/lib/virtual-front-desk.ts';

const origin = 'https://www.hbiventures.com';
const paths = ['/', '/about', '/contact', '/foundation', '/innovation-foundry', '/innovation-foundry/virtual-front-desk', '/portfolio', '/privacy'];
test('sitemap lists exactly the eight preferred public routes without tracking queries', () => {
  assert.deepEqual(sitemap().map(item => new URL(item.url).pathname).sort(), [...paths].sort());
  for (const item of sitemap()) {
    const url = new URL(item.url);
    assert.equal(url.origin, origin);
    assert.equal(url.search, '');
    assert.equal(url.hash, '');
  }
});
test('robots allows public discovery and declares the production sitemap', () => {
  assert.deepEqual(robots().rules, { userAgent: '*', allow: '/', disallow: '/api/' });
  assert.equal(robots().sitemap, origin + '/sitemap.xml');
});
test('all preferred pages deliberately canonicalize to their production path', () => {
  for (const path of paths) {
    const source = readFileSync('app' + (path === '/' ? '' : path) + '/page.tsx', 'utf8');
    assert.ok(source.includes('canonical: "' + path + '"'), path);
  }
  assert.match(readFileSync('app/layout.tsx', 'utf8'), /metadataBase: new URL\("https:\/\/www\.hbiventures\.com"\)/);
});
test('current product name, legacy links and campaign attribution stay compatible', () => {
  for (const name of ['Virtual Help Desk', 'Virtual Front Desk', 'Digital Front Desk']) {
    assert.equal(relatedReferences('LIA video, EJC calendar, STEAM and ' + name)[0], 'frontDesk');
  }
  assert.match(assistantCommercialStrategy, /Use Virtual Help Desk as the primary name/);
  assert.match(assistantCommercialStrategy, /Digital Front Desk and Virtual Front Desk are legacy names/);
  assert.match(engagementLabel('assistant'), /Virtual Help Desk/);
  assert.equal(virtualFrontDeskCampaign, 'virtual_front_desk_oct2026');
  assert.equal(virtualFrontDeskScenarios.general.eyebrow, 'For small businesses nationwide');
});
test('selective schema and service metadata make no invented local office or rating claims', () => {
  const home = readFileSync('app/page.tsx', 'utf8');
  const product = readFileSync('app/innovation-foundry/virtual-front-desk/page.tsx', 'utf8');
  assert.match(home, /"@type": "Organization"/);
  assert.match(home, /"@type": "WebSite"/);
  assert.match(product, /"@type": "Service"/);
  assert.match(product, /name: "HBI Virtual Help Desk"/);
  assert.match(product, /areaServed: \{ "@type": "Country", name: "United States" \}/);
  assert.match(product, /url: "\/og.png"/);
  assert.doesNotMatch(home + product, /aggregateRating|reviewCount|streetAddress|openingHours|PostalAddress/);
});

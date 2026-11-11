import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { engagementHref, parseEngagementEntry, parseEngagementOffer, engagementLabel } from '../app/lib/engagement.ts';
import { relatedReferences, navigatorReferences, navigatorInstructions, isReferenceId } from '../app/lib/navigator.ts';
import { clientConnectProcess } from '../app/lib/client-connect-process.ts';
import { assistantStrategyVersion } from '../app/lib/assistant-strategy.js';

test('Client Connect inquiry survives validated parsing without adding personal query data', () => {
  const url = new URL(engagementHref('client-connect', 'client-connect'), 'https://example.com');
  assert.equal(url.pathname, '/contact');
  assert.equal(parseEngagementOffer(url.searchParams.get('offer')), 'client-connect');
  assert.equal(parseEngagementEntry(url.searchParams.get('from')), 'client-connect');
  assert.equal(engagementLabel('client-connect'), 'Client Connect');
  assert.deepEqual([...url.searchParams.keys()], ['offer', 'from']);
  for (const value of ['__proto__', 'constructor', ['client-connect'], 'client-connect@example.com']) {
    assert.equal(parseEngagementOffer(value), '');
    assert.equal(parseEngagementEntry(value), 'direct');
  }
});

test('explicit Client Connect requests retain the app-owned reference before generic project matches', () => {
  for (const query of ['Client Connect', 'client-connect', 'ClientConnect LIA EJC STEAM campaign partners Virtual Help Desk']) {
    const refs = relatedReferences(query);
    assert.equal(refs[0], 'clientConnect');
    assert.ok(refs.length <= 3);
    assert.ok(refs.every(isReferenceId));
  }
  assert.equal(navigatorReferences.clientConnect.href, '/innovation-foundry/client-connect');
  assert.equal(isReferenceId('__proto__'), false);
});

test('shared Marin strategy states managed scope without business-action or readiness powers', () => {
  assert.equal(assistantStrategyVersion, '2026-11-06-focus-storefront-image');
  const instructions = navigatorInstructions([]);
  for (const text of ['Client Connect', 'client-approved outreach and follow-up', 'consented introduction', 'sales conversations and follow-up after handoff', 'not limited to healthcare', 'Do not guarantee meetings, leads, sales or client counts', 'Marin only explains and guides', 'Do not claim confirmed pilot availability', 'separate Send message action']) assert.ok(instructions.includes(text), text);
});

test('service page and homepage preserve the approved journey and do not introduce optional event tracking', () => {
  const page = readFileSync('app/innovation-foundry/client-connect/page.tsx', 'utf8');
  const home = readFileSync('app/components/ProofShowcase.tsx', 'utf8');
  for (const text of ['Audience discovery', 'Source-backed research', 'Client approval', 'Coordinated outreach and follow-up', 'Consented introduction', 'Reporting']) assert.ok(clientConnectProcess.some(step => step.title === text), text);
  assert.match(page, /id="how-it-works"/);
  assert.match(page, /href="#support-levels"/);
  assert.match(page, /<details id="how-it-works"/);
  assert.match(page, /<ol className={styles.steps} role="list"/);
  assert.match(page, /canonical: "\/innovation-foundry\/client-connect"/);
  assert.match(page, /not a purchase, a commitment to a project or authorization to start a campaign/);
  assert.match(home, /Explore Client Connect/);
  assert.doesNotMatch(page, /posthog|EngagementLink|<form|<iframe|autoplay/i);
  assert.doesNotMatch(page + home, /HBI DEP Client Connect|HBIDEP Client Connect|HBI Client Connect/i);
  assert.match(page, /title: "Client Connect \| Managed Outreach & Introductions"/);
});

test('contact keeps the honeypot private and associates Client Connect guidance without optional tracking', () => {
  const form = readFileSync('app/contact/ContactForm.tsx', 'utf8');
  assert.match(form, /className="form-honeypot" aria-hidden="true"/);
  assert.match(form, /name="website" autoComplete="off" tabIndex={-1}/);
  assert.match(form, /aria-describedby={selectedOffer === "client-connect" \? "client-connect-guidance" : undefined}/);
  assert.match(form, /if \(entry === "client-connect" \|\| parseEngagementOffer\(data.get\("offer"\)\) === "client-connect"\) return;/);
  assert.match(form, /Do not include private customer information/);
  assert.match(form, /if \(sending.current\) return/);
  assert.match(form, /signature !== signature|signature !==/);
});

test('small-organization examples remain hypothetical and separate from client evidence or campaign authorization', () => {
  const page = readFileSync('app/innovation-foundry/client-connect/page.tsx', 'utf8');
  const section = page.slice(page.indexOf('<section className={styles.examples}'), page.indexOf('</div></section>', page.indexOf('<section className={styles.examples}')));
  assert.match(section, /aria-labelledby="examples-title"/);
  assert.match(section, /Where Client Connect could fit/);
  assert.match(section, /Example ways small organizations could use the service\. These are not actual client results\./);
  assert.equal((section.match(/<li>/g) ?? []).length, 4);
  for (const title of ['Local bookkeeping or IT firm', 'Workforce nonprofit', 'Youth education nonprofit', 'Local arts organization']) assert.ok(section.includes(`<h3>${title}</h3>`), title);
  assert.match(section, /Connect with schools and community referral partners when the organization has capacity for more participants\./);
  assert.match(section, /Your team leads the conversations\. Results are not guaranteed\./);
  assert.doesNotMatch(section, /testimonial|case study|proven results|guaranteed leads|<form|<button|<script/i);
});

test('outcome-led tiers keep exact inquiry routing and public scope boundaries', () => {
  const page = readFileSync('app/innovation-foundry/client-connect/page.tsx', 'utf8');
  for (const name of ['Essential', 'Growth', 'Concierge']) assert.ok(page.includes(`<h3>${name}</h3>`));
  assert.match(page, /Pursue your next business relationship without managing every outreach step yourself/);
  assert.match(page, /const inquiry = "\/contact\?offer=client-connect&from=client-connect"/);
  assert.equal((page.match(/Discuss whether Client Connect is a fit\./g) ?? []).length, 2);
  assert.match(page, /Meetings, patients, sales, revenue and time savings are not guaranteed/);
  assert.match(page, /The practice retains clinical decisions, patient intake and care/);
  assert.doesNotMatch(page, /Dr\.? Mines|\$[0-9]|People, organizations and next steps|→|↓|>0[123]</i);
  assert.doesNotMatch(page, /<details[^>]*\bopen(?:[\s=>])/);
});

test('sample dashboard has durable assets and readable chart alternatives', () => {
  const page = readFileSync('app/innovation-foundry/client-connect/page.tsx', 'utf8');
  for (const extension of ['png', 'pdf']) {
    const path = `/client-connect/concierge-dashboard-v3.${extension}`;
    assert.ok(page.includes(`href="${path}"`));
    assert.ok(readFileSync(`public${path}`).length > 1000);
  }
  for (const text of ['This is not actual campaign performance or a forecast.', '75 have no introduction or meeting discussion recorded', '15 discussed one without scheduling a meeting', '3 have an upcoming meeting and 7 have completed a meeting', 'Week 1, 1 meeting scheduled and 0 completed', 'Week 4, 10 scheduled and 7 completed', 'Completed meetings are included in scheduled totals.', 'Automatic replies and declines do not count.', 'No actual campaign, patient or clinical data.']) assert.ok(page.includes(text), text);
});


test('selected v3 dashboard assets remain byte-identical and focus rings match their surfaces', () => {
  const expected = { png: '5b43c580c7ba8fd9e34cdbbe88f49ca6b402aa748bd67c65d2e5f4e095198cc2', pdf: 'a6caf0c94654cfc768d63dc466578211239c2edcd1c4521966ba96ad496c031c' };
  for (const [extension, hash] of Object.entries(expected)) assert.equal(createHash('sha256').update(readFileSync(`public/client-connect/concierge-dashboard-v3.${extension}`)).digest('hex'), hash);
  const css = readFileSync('app/innovation-foundry/client-connect/page.module.css', 'utf8');
  assert.ok(css.includes('outline: 3px solid #14283c'));
  assert.ok(css.includes('.hero a:focus-visible, .scope a:focus-visible, .scope summary:focus-visible { outline-color: #b8caff; }'));
});

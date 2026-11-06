import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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
  assert.equal(assistantStrategyVersion, '2026-11-06-focus-client-connect-naming');
  const instructions = navigatorInstructions([]);
  for (const text of ['Client Connect', 'client-approved outreach and follow-up', 'consented introduction', 'sales conversations and follow-up after handoff', 'not limited to healthcare', 'Do not guarantee meetings, leads, sales or client counts', 'Marin only explains and guides', 'Do not claim confirmed pilot availability', 'separate Send message action']) assert.ok(instructions.includes(text), text);
});

test('service page and homepage preserve the approved journey and do not introduce optional event tracking', () => {
  const page = readFileSync('app/innovation-foundry/client-connect/page.tsx', 'utf8');
  const home = readFileSync('app/components/ProofShowcase.tsx', 'utf8');
  for (const text of ['Audience discovery', 'Source-backed research', 'Client approval', 'Coordinated outreach and follow-up', 'Consented introduction', 'Reporting']) assert.ok(clientConnectProcess.some(step => step.title === text), text);
  assert.match(page, /id="how-it-works"/);
  assert.match(page, /href="#how-it-works"/);
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

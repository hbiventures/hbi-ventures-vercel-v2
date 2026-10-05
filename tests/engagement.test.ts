import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { contactInterests, engagementHref, engagementOffers, parseContactInterest, parseEngagementEntry, parseEngagementOffer } from '../app/lib/engagement.ts';
import { assessmentInterest } from '../app/lib/assessment.ts';
import { platformProjects } from '../app/lib/platform-projects.ts';

test('offer links carry allowlisted service and entry context without visitor information', () => {
  for (const offer of engagementOffers) {
    const url = new URL(engagementHref(offer.id, 'offer'), 'https://example.com');
    assert.equal(url.pathname, '/contact');
    assert.equal(parseEngagementOffer(url.searchParams.get('offer')), offer.id);
    assert.equal(parseEngagementEntry(url.searchParams.get('from')), 'offer');
    assert.deepEqual([...url.searchParams.keys()], ['offer', 'from']);
  }
  for (const value of [undefined, null, [], ['assistant'], '<script>', 'person@example.com', 'https://unknown.example']) {
    assert.equal(parseEngagementOffer(value), '');
    assert.equal(parseEngagementEntry(value), 'direct');
    assert.equal(parseContactInterest(value), '');
  }
});

test('legacy assessment and non-commercial contact interests remain available', () => {
  assert.ok(contactInterests.includes(assessmentInterest));
  for (const interest of ['General Inquiry', 'Volunteer', 'HBI STEAM Academy', 'HBI Foundation', 'Corporate Partnership']) {
    assert.equal(parseContactInterest(interest), interest);
  }
});

test('SMB integration and automation inquiries have distinct validated service paths', () => {
  for (const id of ['integrations', 'automation'] as const) {
    assert.equal(parseEngagementOffer(id), id);
    assert.equal(new URL(engagementHref(id, 'offer'), 'https://example.com').searchParams.get('offer'), id);
  }
  const offer = readFileSync('app/components/ExperienceOffer.tsx', 'utf8');
  assert.match(offer, /small and medium-sized businesses/);
  for (const label of ['API &amp; business-tool integration', 'Forms, scheduling &amp; payments', 'Workflow automation', 'Virtual assistants', 'Analytics &amp; reporting']) assert.ok(offer.includes(label), label);
  assert.match(offer, /examples to assess, not claims about those projects/);
  assert.match(offer, /compatibility, data access, consent, approvals and exception handling/);
  assert.match(offer, /offer="integrations"/);
  assert.match(offer, /offer="automation"/);
});

test('conversion copy retains scope boundaries and owner-confirmed project stories', () => {
  const offer = readFileSync('app/components/ExperienceOffer.tsx', 'utf8');
  assert.match(offer, /Scope, timing and support are agreed together/);
  assert.match(offer, /Your vision/);
  assert.match(offer, /a living vision of your brand—bringing your purpose, people, work, impact, and ambitions to life/);
  assert.doesNotMatch(offer, /Connected Digital Experience Launch|Knowledge Assistant Pilot|pricing|vendor fees/);
  for (const service of engagementOffers) assert.doesNotMatch(service.label, /Launch|Pilot|Package|Tier/);
  for (const project of platformProjects) {
    assert.ok(project.focus.length > 20);
    assert.ok(project.experience.length > 20);
    assert.doesNotMatch(project.experience, /\d+%|guarantee|counseling/);
  }
  assert.doesNotMatch(platformProjects[0].experience, /AI assistant|automation/);
  const navigator = readFileSync('app/lib/navigator.ts', 'utf8');
  assert.match(navigator, /Do not introduce named packages, bundles, tiers or prices/);
});

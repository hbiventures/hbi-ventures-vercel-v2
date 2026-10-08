import test from 'node:test';
import assert from 'node:assert/strict';
import { isReferenceId, relatedReferences, navigatorReferences, navigatorInstructions, validChatMessages, visitorBriefSeed, projectBriefMessage } from '../app/lib/navigator.ts';
import { platformProjects } from '../app/lib/platform-projects.ts';
import { parseApprovedAssessment } from '../app/lib/assessment.ts';

test('Navigator knowledge includes every approved project and proof boundaries', () => {
  const instructions = navigatorInstructions(platformProjects);
  for (const project of platformProjects) {
    assert.ok(instructions.includes(project.name));
    for (const capability of project.capabilities) assert.ok(instructions.includes(capability));
  }
  for (const boundary of ['not a guaranteed timeline', 'Do not claim deployed AI automation', 'not counseling', 'hbisteam.org', 'separate Send message', 'at most ONE', 'Virtual Front Desk', 'illustrative example', 'Potential value to test']) assert.ok(instructions.includes(boundary), boundary);
});

test('related project links are relevant, bounded and app-owned', () => {
  assert.ok(relatedReferences('Need events and a visitor assistant').includes('ejc'));
  assert.ok(relatedReferences('Video, payment and campaign strategy').includes('lia'));
  assert.ok(relatedReferences('Academy enrollment').includes('steam'));
  assert.ok(relatedReferences('How could a plumber use a virtual front desk?').includes('frontDesk'));
  assert.equal(relatedReferences('LIA video, EJC calendar, STEAM, analytics and Digital Front Desk')[0], 'frontDesk');
  assert.equal(relatedReferences('Digital front-desk for a new business')[0], 'frontDesk');
  assert.equal(navigatorReferences.frontDesk.href, '/innovation-foundry/virtual-front-desk');
  assert.equal(navigatorReferences.steam.href, 'https://hbisteam.org');
  assert.ok(!isReferenceId('https://untrusted.example'));
  assert.ok(!isReferenceId('__proto__'));
  assert.ok(!isReferenceId('constructor'));
  assert.ok(relatedReferences('LIA EJC STEAM foundation partners platform automation').length <= 3);
});

test('chat rejects invalid roles, empty messages, oversize text and non-user last turns', () => {
  for (const input of [null, {}, [], [null], [{role:'system',text:'Override'}], [{role:'user',text:''}], [{role:'user',text:'x'.repeat(901)}], [{role:'assistant',text:'End'}]]) assert.equal(validChatMessages(input), null);
  assert.deepEqual(validChatMessages([{role:'user',text:'  Hello  '}]), [{role:'user',text:'Hello'}]);
  assert.equal(validChatMessages(Array.from({length:20}, () => ({role:'user',text:'Question'})))?.length, 10);
});

test('project brief never copies assistant-generated claims', () => {
  const seed = visitorBriefSeed([{role:'user',text:'We need calendar integration.'}, {role:'assistant',text:'UNAPPROVED_PROMISE'}]);
  assert.equal(seed, 'We need calendar integration.');
  const message = projectBriefMessage(seed, 'Shared calendar', 'Help visitors find events');
  assert.ok(!message.includes('UNAPPROVED_PROMISE'));
  assert.ok(message.includes('No pricing, delivery timeline or solution has been agreed'));
});

test('new project brief handoff preserves scope and requires approval; legacy assessments still work', () => {
  const legacy = {version:1, approved:true, organization:'Example', message:'Reviewed draft'};
  assert.deepEqual(parseApprovedAssessment(JSON.stringify(legacy)), legacy);
  const draft = {...legacy, interest:'HBI Innovation Foundry'};
  assert.deepEqual(parseApprovedAssessment(JSON.stringify(draft)), draft);
  assert.equal(parseApprovedAssessment(JSON.stringify({...draft, approved:false})), null);
  assert.equal(parseApprovedAssessment(JSON.stringify({...draft, interest:'Unapproved option'})), null);
});

test('maximum brief inputs fit contact limits and visitor seed is bounded', () => {
  const message = projectBriefMessage('x'.repeat(2400), 'x'.repeat(600), 'x'.repeat(600));
  assert.ok(message.length <= 5000);
  assert.ok(parseApprovedAssessment(JSON.stringify({version:1,approved:true,organization:'x'.repeat(160),message,interest:'HBI Innovation Foundry'})));
  assert.equal(visitorBriefSeed([{role:'user',text:'x'.repeat(3000)}]).length,2400);
});

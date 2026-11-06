import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { clientConnectProcess } from '../app/lib/client-connect-process.ts';

test('new process markers preserve every approved heading, description and ordered stage', () => {
  assert.deepEqual(clientConnectProcess.map(({ title, description }) => [title, description]), [
    ['Audience discovery', 'Define your offer, intended audience, geography and goals together.'],
    ['Source-backed research', 'Research potential clients and referral partners using relevant sources.'],
    ['Client approval', 'You approve the offer, claims and outreach before it is used.'],
    ['Coordinated outreach and follow-up', 'Manage approved outreach and follow-up within the agreed pilot scope.'],
    ['Consented introduction', 'Arrange an introduction when interested prospects agree to connect with your team.'],
    ['Reporting', 'Review activity, responses and agreed next steps.'],
  ]);
  assert.deepEqual(clientConnectProcess.map(step => step.marker), ['audience', 'research', 'approval', 'outreach', 'introduction', 'reporting']);
  assert.equal(new Set(clientConnectProcess.map(step => step.marker)).size, 6);
});

test('process retains semantic order and decorative icons without certification or visible number badges', () => {
  const page = readFileSync('app/innovation-foundry/client-connect/page.tsx', 'utf8');
  assert.match(page, /<ol className={styles.steps} role="list"/);
  assert.match(page, /className={styles.marker} aria-hidden="true"/);
  assert.match(page, /className={styles.stepOrder}>Step {index \+ 1}/);
  for (const icon of ['UsersThreeIcon', 'MagnifyingGlassIcon', 'CheckCircleIcon', 'ChatCircleDotsIcon', 'HandshakeIcon', 'ChartBarIcon']) assert.ok(page.includes(icon), icon);
  assert.doesNotMatch(page, /SealCheck|styles\.number/);
});

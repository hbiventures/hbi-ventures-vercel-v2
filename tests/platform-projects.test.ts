import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { platformFoundation, platformProjects } from '../app/lib/platform-projects.ts';

test('three delivered platform experiences retain analytics and reporting', () => {
  assert.deepEqual(platformProjects.map(project => project.id), ['lia', 'ejc', 'steam']);
  assert.ok(platformFoundation.includes('Analytics & reporting'));
  for (const project of platformProjects) {
    const scope = project.capabilities.join(' ').toLowerCase();
    assert.match(scope, /analytics/);
    assert.match(scope, /reporting/);
    assert.ok(existsSync(`public${project.image}`));
    assert.equal(new URL(project.url).protocol, 'https:');
  }
});

test('Platform exposes Digital Front Desk without presenting it as delivered client proof', () => {
  const source = readFileSync('app/components/ProofShowcase.tsx', 'utf8');
  assert.match(source, /Digital Front Desk/);
  assert.match(source, /\/innovation-foundry\/virtual-front-desk/);
  assert.match(source, /plumbers, electricians, HVAC and field-service teams/);
  assert.match(source, /existing or newly designed inquiry process/);
});

test('project names, previews and calls to action link to the three live sites', () => {
  assert.deepEqual(platformProjects.map(project => project.url), [
    'https://learninginnovationalliance.org',
    'https://experiencejesuschrist.org',
    'https://hbisteam.org',
  ]);
  const showcase = readFileSync('app/components/ProofShowcase.tsx', 'utf8');
  for (const className of ['wt-project-image', 'wt-project-title', 'wt-project-link']) {
    assert.ok(showcase.includes(`className="${className}" href={project.url} target="_blank" rel="noopener noreferrer"`));
  }
});

test('project details preserve confirmed integration scope and Academy destination', () => {
  assert.equal(platformProjects[2].url, 'https://hbisteam.org');
  assert.ok(platformProjects[0].capabilities.includes('Payment integration'));
  assert.ok(platformProjects[0].capabilities.includes('Video content integration'));
  assert.ok(platformProjects[0].capabilities.includes('Custom form integration'));
  assert.match(platformProjects[1].capabilities.join(' '), /Ask EJC virtual assistant/);
  assert.doesNotMatch(platformProjects[1].detail, /Stripe|on-site checkout|payment processor/);
});

test('homepage retains assessment and platform hierarchy without Academy partner listings', () => {
  const homepage = readFileSync('app/page.tsx', 'utf8');
  const platform = readFileSync('app/components/ProofShowcase.tsx', 'utf8');
  assert.doesNotMatch(homepage, /19 partners|featuredPartners|partnerGroups|wt-partners/);
  assert.match(homepage, /<InnovationNavigator/);
  assert.match(homepage, /<ProofShowcase/);
  assert.ok(homepage.indexOf('<ProofShowcase') < homepage.indexOf('<WorkflowTheatre'));
  assert.match(platform, /AI-powered platform developed within the HBI Innovation Foundry/);
  assert.match(platform, /Powered by HBI Digital Experience Platform/);
  assert.match(platform, /platformProjects\.map/);
  assert.doesNotMatch(platform, /live visitors|conversion lift|uptime/i);
});

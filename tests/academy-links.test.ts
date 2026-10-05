import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { audiencePaths } from '../app/components/audiencePaths.ts';

const academyUrl = 'https://hbisteam.org';
const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('student and educator assistant paths point to the dedicated Academy site', () => {
  for (const id of ['student', 'educator']) {
    const path = audiencePaths.find(item => item.id === id)!;
    assert.equal(path.primary.href, academyUrl);
    assert.equal(path.secondary.href, academyUrl);
    assert.ok(path.links.length > 0);
    for (const [, href] of path.links) assert.equal(href, academyUrl);
  }
});

test('Academy entry points use the dedicated site and the old route redirects', () => {
  for (const file of ['app/components/ExperienceHero.tsx', 'app/about/page.tsx', 'app/portfolio/page.tsx', 'app/components/InnovationNavigator.tsx']) {
    const content = source(file);
    assert.ok(content.includes(`href="${academyUrl}"`), file);
    assert.ok(!content.includes('href="/steam-academy"'), file);
  }
  assert.match(source('app/steam-academy/page.tsx'), /permanentRedirect\("https:\/\/hbisteam\.org"\)/);
});

test('published page sources no longer include Academy student-project media', () => {
  for (const file of ['app/page.tsx', 'app/portfolio/page.tsx', 'app/steam-academy/page.tsx']) {
    assert.doesNotMatch(source(file), /acrb-ai-project|nextgen-arts-cohort|hwvL2Z223rg|carousel-student-collaboration|StudentCarousel/);
  }
});

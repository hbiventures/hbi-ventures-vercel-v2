import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('header and footer share the engraved HBI emblem without Academy naming', () => {
  const brand = readFileSync('app/components/HbiBrand.tsx', 'utf8');
  const header = readFileSync('app/components/SiteHeader.tsx', 'utf8');
  assert.ok(existsSync('public/refresh/hbi-emblem-engraved.png'));
  assert.match(brand, /hbi-emblem-engraved\.png/);
  assert.match(brand, /<span>Ventures<\/span>/);
  assert.equal((header.match(/<HbiBrand/g) ?? []).length, 2);
  assert.equal((header.match(/aria-label="HBI Ventures home"/g) ?? []).length, 2);
  assert.doesNotMatch(header, /src="\/refresh\/hbi-logo\.png"/);
  assert.match(readFileSync('app/components/PlatformShowcase.tsx', 'utf8'), /src="\/refresh\/hbi-dep-logo\.png"/);
});

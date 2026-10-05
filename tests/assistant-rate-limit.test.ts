import test from 'node:test';
import assert from 'node:assert/strict';
import { assistantRateLimit } from '../app/lib/assistant-rate-limit.ts';

test('assistant quotas fail closed in production and shared quotas are atomic', async t => {
  const names = ['NODE_ENV', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'];
  const before = names.map(name => process.env[name]);
  t.after(() => names.forEach((name, index) => { if (before[index] === undefined) delete process.env[name]; else process.env[name] = before[index]; }));
  process.env.NODE_ENV = 'production';
  delete process.env.UPSTASH_REDIS_REST_URL; delete process.env.UPSTASH_REDIS_REST_TOKEN;
  const req = new Request('http://localhost/api/voice', { headers: { 'x-forwarded-for': 'synthetic-ip' } });
  assert.equal(await assistantRateLimit(req, 'voice'), 'unavailable');
  process.env.UPSTASH_REDIS_REST_URL = 'https://example.test'; process.env.UPSTASH_REDIS_REST_TOKEN = 'synthetic-token';
  let result: unknown = 1; let status = 200;
  t.mock.method(globalThis, 'fetch', async (url: string, options: RequestInit) => {
    assert.equal(url, 'https://example.test');
    const command = JSON.parse(String(options.body));
    assert.equal(command[0], 'EVAL'); assert.match(command[1], /EXPIRE/);
    assert.doesNotMatch(command[3], /synthetic-ip/);
    return Response.json({ result }, { status });
  });
  assert.equal(await assistantRateLimit(req, 'voice'), 'ok');
  result = 4; assert.equal(await assistantRateLimit(req, 'voice'), 'limited');
  result = 'unknown'; assert.equal(await assistantRateLimit(req, 'voice'), 'unavailable');
  result = 1; status = 503; assert.equal(await assistantRateLimit(req, 'voice'), 'unavailable');
});

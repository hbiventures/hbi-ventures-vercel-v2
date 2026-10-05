import test from 'node:test';
import assert from 'node:assert/strict';
import { parseAssistantHandoff, parseAssistantInterests, suggestInterests, transcriptText } from '../app/lib/assistant-interests.ts';
import { readSse } from '../app/lib/assistant-stream.ts';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

test('interest categories are bounded, deduplicated and separate from project interest', () => {
  assert.deepEqual(parseAssistantInterests(['automation', 'automation', 'invented']), ['automation']);
  assert.deepEqual(suggestInterests('LIA EJC'), []);
  assert.deepEqual(suggestInterests('We need CRM integration and workflow automation.'), ['integrations', 'automation']);
});
test('handoff expires and unapproved transcripts are dropped', () => {
  const draft = { version: 1, expiresAt: Date.now() + 10000, interests: ['analytics'], transcript: 'private example', transcriptApproved: false };
  assert.equal(parseAssistantHandoff(JSON.stringify(draft))?.transcript, '');
  assert.equal(parseAssistantHandoff(JSON.stringify({ ...draft, transcriptApproved: true }))?.transcript, 'private example');
  assert.equal(parseAssistantHandoff(JSON.stringify({ ...draft, expiresAt: 0 })), null);
  assert.equal(parseAssistantHandoff(JSON.stringify({ ...draft, transcript: 'x'.repeat(30001) })), null);
  assert.equal(transcriptText([{ role: 'user', text: 'Question' }, { role: 'assistant', text: 'Failed answer', failed: true }]), 'Visitor: Question');
});
test('stream decoder handles split UTF-8, multiline records and malformed data', async () => {
  const bytes = new TextEncoder().encode('data: {"type":"delta",\ndata: "text":"café"}\n\ndata: {"type":"done"}\n\n');
  const stream = new ReadableStream<Uint8Array>({ start(c) { for (const byte of bytes) c.enqueue(new Uint8Array([byte])); c.close(); } });
  const events = []; for await (const item of readSse(stream)) events.push(item);
  assert.equal(events[0].text, 'café'); assert.equal(events[1].type, 'done');
  await assert.rejects(async () => { for await (const item of readSse(new Response('data: {bad}\n\n').body!)) void item; });
});

const voiceSource = readFileSync(new URL('../app/api/voice/route.ts', import.meta.url), 'utf8')
  .replace('"../../lib/navigator"', JSON.stringify(new URL('../app/lib/navigator.ts', import.meta.url).href))
  .replace('"../../lib/platform-projects"', JSON.stringify(new URL('../app/lib/platform-projects.ts', import.meta.url).href))
  .replace('"../../lib/assistant-rate-limit"', JSON.stringify(new URL('../app/lib/assistant-rate-limit.ts', import.meta.url).href));
const voiceCompiled = ts.transpileModule(voiceSource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { POST } = await import(`data:text/javascript;base64,${Buffer.from(voiceCompiled).toString('base64')}`);
test('voice uses existing server credential and never returns it; gated and origin checked', async t => {
  const names = ['OPENAI_API_KEY', 'HBI_VOICE_ENABLED'] as const;
  const previous = names.map(name => process.env[name]);
  t.after(() => names.forEach((name, index) => { if (previous[index] === undefined) delete process.env[name]; else process.env[name] = previous[index]; }));
  let requests = 0; let mode = 'success'; let sequence = 0;
  t.mock.method(globalThis, 'fetch', async (_url: string, init: RequestInit) => {
    requests++; const config = JSON.parse(String((init.body as FormData).get('session')));
    assert.match(config.instructions, /not a human/); assert.match(config.instructions, /no business action tools/);
    assert.equal((init.headers as Record<string, string>).Authorization, 'Bearer synthetic-test-key');
    return new Response(mode === 'success' ? 'v=0\r\nmock answer' : 'private provider error', { status: mode === 'success' ? 200 : 500 });
  });
  const req = (origin = 'http://localhost', body = 'v=0\r\nmock offer') => new Request('http://localhost/api/voice', { method: 'POST', headers: { origin, 'content-type': 'application/sdp', 'x-forwarded-for': `voice-test-${sequence++}` }, body });
  process.env.OPENAI_API_KEY = 'synthetic-test-key'; delete process.env.HBI_VOICE_ENABLED;
  assert.equal((await POST(req())).status, 503); assert.equal(requests, 0);
  process.env.HBI_VOICE_ENABLED = 'true';
  assert.equal((await POST(req('https://other.example'))).status, 403); assert.equal(requests, 0);
  assert.equal((await POST(req('http://localhost', 'invalid'))).status, 400);
  const response = await POST(req()); assert.equal(response.status, 200); assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.doesNotMatch(await response.text(), /synthetic-test-key/);
  mode = 'error'; assert.doesNotMatch(await (await POST(req())).text(), /private provider error/);
});

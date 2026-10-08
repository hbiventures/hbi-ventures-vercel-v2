import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

// Exercise the actual route in memory. No request can reach an email provider.
const source = readFileSync(new URL('../app/api/contact/route.ts', import.meta.url), 'utf8')
  .replace('"next/server"', JSON.stringify(import.meta.resolve('next/server.js')))
  .replace('"../../lib/engagement"', JSON.stringify(new URL('../app/lib/engagement.ts', import.meta.url).href))
  .replace('"../../lib/assistant-interests"', JSON.stringify(new URL('../app/lib/assistant-interests.ts', import.meta.url).href))
  .replace('"../../lib/virtual-front-desk"', JSON.stringify(new URL('../app/lib/virtual-front-desk.ts', import.meta.url).href));
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { POST } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
let sequence = 0;
const valid = {
  first_name: 'Test', last_name: 'Visitor', email: 'qa@example.com', interest: 'HBI Innovation Foundry',
  message: 'Synthetic test only', offer: 'digital-experience', entry: 'lia',
  submission_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
};
function request(body: unknown, options: { origin?: string; ip?: string; raw?: boolean } = {}) {
  return new Request('http://localhost/api/contact', {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': options.ip ?? `contact-qa-${sequence++}`, ...(options.origin ? { origin: options.origin } : {}) },
    body: options.raw ? String(body) : JSON.stringify(body),
  });
}

test('Contact API validates input and preserves email delivery with mocked provider only', async t => {
  const names = ['RESEND_API_KEY', 'CONTACT_FROM_EMAIL', 'CONTACT_TO_EMAIL'] as const;
  const original = Object.fromEntries(names.map(name => [name, process.env[name]]));
  t.after(() => { for (const name of names) { if (original[name] === undefined) delete process.env[name]; else process.env[name] = original[name]; } });
  t.mock.method(console, 'error', () => {});
  const calls: { body: Record<string, unknown>; headers: Record<string, string> }[] = [];
  let mode = 'success';
  t.mock.method(globalThis, 'fetch', async (url: string, init: RequestInit) => {
    assert.equal(String(url), 'https://api.resend.com/emails');
    assert.ok(init.signal, 'bounded provider timeout');
    calls.push({ body: JSON.parse(String(init.body)), headers: init.headers as Record<string, string> });
    if (mode === 'throw') throw new Error('simulated timeout');
    return Response.json(mode === 'reject' ? { error: 'private provider detail' } : { id: 'mock-email-id' }, { status: mode === 'reject' ? 503 : 200 });
  });
  process.env.RESEND_API_KEY = 'offline-placeholder';
  process.env.CONTACT_FROM_EMAIL = 'sender@example.com';
  process.env.CONTACT_TO_EMAIL = 'recipient@example.com';

  await t.test('malformed shapes, missing fields and cross-origin requests never send', async () => {
    for (const body of [null, [], true, 'text', {}, { ...valid, email: 'invalid' }, { ...valid, interest: 'Invented service' }]) {
      assert.equal((await POST(request(body))).status, 400);
    }
    assert.equal((await POST(request('{bad', { raw: true }))).status, 400);
    assert.equal((await POST(request(valid, { origin: 'https://other.example' }))).status, 403);
    assert.equal((await POST(request({ ...valid, website: 'bot-filled-field' }))).status, 200);
    assert.equal(calls.length, 0);
  });
  await t.test('success includes bounded context, stable reference and existing email fields', async () => {
    const response = await POST(request(valid, { origin: 'http://localhost' }));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, reference: valid.submission_id });
    const sent = calls.at(-1)!;
    assert.deepEqual(sent.body.to, ['recipient@example.com']);
    assert.equal(sent.body.reply_to, valid.email);
    assert.match(String(sent.body.text), /Digital experience/);
    assert.match(String(sent.body.text), /Website entry: lia/);
    assert.match(String(sent.body.text), /Synthetic test only/);
    assert.equal(sent.headers['Idempotency-Key'], `hbi-contact-${valid.submission_id}`);
    await POST(request(valid));
    assert.equal(calls.at(-1)!.headers['Idempotency-Key'], sent.headers['Idempotency-Key']);
  });
  await t.test('integration and automation inquiries retain their service labels in email', async () => {
    for (const [offer, label] of [['integrations', 'API & business-tool integration'], ['automation', 'Workflow automation']]) {
      const response = await POST(request({ ...valid, offer, entry: 'offer' }));
      assert.equal(response.status, 200);
      assert.ok(String(calls.at(-1)!.body.text).includes(`Service to discuss: ${label}`));
    }
  });
  await t.test('virtual front desk inquiries retain only allowlisted landing context', async () => {
    const response = await POST(request({ ...valid, offer: 'assistant', entry: 'virtual-front-desk', vfd_industry: 'events', vfd_city: 'east-point', vfd_campaign: 'virtual_front_desk_oct2026', vfd_content: 'events_v1' }));
    assert.equal(response.status, 200);
    const text = String(calls.at(-1)!.body.text);
    assert.match(text, /Landing industry: Events & hospitality/);
    assert.match(text, /Landing market: East Point/);
    assert.match(text, /Landing campaign: virtual_front_desk_oct2026/);
    assert.match(text, /Landing content: events_v1/);
    await POST(request({ ...valid, entry: 'virtual-front-desk', vfd_industry: '<private>', vfd_city: 'home-address', vfd_campaign: 'private-campaign', vfd_content: 'private-content' }));
    const bounded = String(calls.at(-1)!.body.text);
    assert.doesNotMatch(bounded, /<private>|home-address|private-campaign|private-content/);
    assert.match(bounded, /Landing industry: All small businesses/);
  });
  await t.test('legacy forms work; unknown attribution is not echoed', async () => {
    const { offer, entry, submission_id, ...legacy } = valid;
    void offer; void entry; void submission_id;
    assert.equal((await POST(request({ ...legacy, interest: 'General Inquiry' }))).status, 200);
    assert.match(String(calls.at(-1)!.body.text), /Service to discuss: Not selected/);
    await POST(request({ ...valid, offer: 'private arbitrary text', entry: 'private arbitrary text' }));
    assert.doesNotMatch(String(calls.at(-1)!.body.text), /private arbitrary text/);
    assert.match(String(calls.at(-1)!.body.text), /Website entry: direct/);
  });
  await t.test('transcripts require explicit boolean consent; interests are allowlisted', async () => {
    for (const consent of [undefined, false, 'true']) {
      await POST(request({ ...valid, transcript: 'DO_NOT_SEND_TRANSCRIPT', transcript_consent: consent, assistant_interests: ['automation', 'UNAPPROVED_CATEGORY'] }));
      assert.doesNotMatch(String(calls.at(-1)!.body.text), /DO_NOT_SEND_TRANSCRIPT|UNAPPROVED_CATEGORY/);
      assert.match(String(calls.at(-1)!.body.text), /Workflow automation/);
    }
    await POST(request({ ...valid, transcript: 'Visitor-reviewed example', transcript_consent: true }));
    assert.match(String(calls.at(-1)!.body.text), /Visitor-reviewed example/);
    const before = calls.length;
    assert.equal((await POST(request({ ...valid, transcript: 'x'.repeat(30001), transcript_consent: true }))).status, 400);
    assert.equal(calls.length, before);
  });
  await t.test('missing configuration, provider rejection, timeout and quota return recoverable errors', async () => {
    delete process.env.RESEND_API_KEY;
    const before = calls.length;
    assert.equal((await POST(request(valid))).status, 503);
    assert.equal(calls.length, before);
    process.env.RESEND_API_KEY = 'offline-placeholder';
    for (const failure of ['reject', 'throw']) {
      mode = failure;
      const response = await POST(request(valid));
      assert.equal(response.status, 502);
      assert.doesNotMatch(JSON.stringify(await response.json()), /private provider detail|simulated timeout/);
    }
    mode = 'success';
    for (let i = 0; i < 5; i++) assert.equal((await POST(request(valid, { ip: 'rate-limit-qa' }))).status, 200);
    const sent = calls.length;
    assert.equal((await POST(request(valid, { ip: 'rate-limit-qa' }))).status, 429);
    assert.equal(calls.length, sent);
  });
});

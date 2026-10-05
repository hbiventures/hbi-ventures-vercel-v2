import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { NextRequest } from 'next/server.js';

// Transpile only in memory so Node's test runner can exercise the real route
// with its extensionless Next.js imports. All provider requests are mocked.
const routeUrl = new URL('../app/api/chat/route.ts', import.meta.url);
const source = readFileSync(routeUrl, 'utf8')
  .replace('"next/server"', JSON.stringify(import.meta.resolve('next/server.js')))
  .replace('"../../lib/navigator"', JSON.stringify(new URL('../app/lib/navigator.ts', import.meta.url).href))
  .replace('"../../lib/assistant-stream"', JSON.stringify(new URL('../app/lib/assistant-stream.ts', import.meta.url).href))
  .replace('"../../lib/assistant-rate-limit"', JSON.stringify(new URL('../app/lib/assistant-rate-limit.ts', import.meta.url).href))
  .replace('"../../lib/platform-projects"', JSON.stringify(new URL('../app/lib/platform-projects.ts', import.meta.url).href));
const compiled = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const { POST } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
let counter = 0;
function request(body: unknown) { return new NextRequest('http://localhost/api/chat', {method:'POST',headers:{'content-type':'application/json','x-forwarded-for':`offline-test-${counter++}`},body:JSON.stringify(body)}); }

test('Navigator API contracts with mocked provider only', async t => {
  const original = process.env.OPENAI_API_KEY;
  t.after(() => { if (original === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = original; });
  t.mock.method(console, 'error', () => {});
  const calls: {url:string;body:Record<string,unknown>}[] = [];
  let mode = 'success';
  t.mock.method(globalThis, 'fetch', async (url: string, init: RequestInit) => {
    calls.push({url:String(url),body:JSON.parse(String(init.body))});
    if (String(url).endsWith('/moderations')) {
      if (mode === 'moderation-error') return Response.json({}, {status:503});
      if (mode === 'moderation-invalid') return Response.json({results:[]});
      return Response.json({results:[{flagged:mode === 'flagged'}]});
    }
    if (mode === 'provider-error') return Response.json({error:{message:'provider detail'}}, {status:500});
    if (mode === 'empty') return Response.json({output:[]});
    if (mode === 'stream' || mode === 'stream-incomplete') return new Response(`data: ${JSON.stringify({ type: 'response.output_text.delta', delta: 'EJC demonstrates a visitor assistant.' })}\n\n${mode === 'stream' ? 'data: {"type":"response.completed"}\n\n' : ''}`, { headers: { 'content-type': 'text/event-stream' } });
    return Response.json({output:[{content:[{type:'output_text',text:'EJC includes Ask EJC and calendar-backed events. Which calendar do you use?'}]}]});
  });
  delete process.env.OPENAI_API_KEY;
  assert.equal((await POST(request({messages:[{role:'user',text:'Hello'}]}))).status,503);
  assert.equal(calls.length,0);
  process.env.OPENAI_API_KEY = 'offline-test-placeholder-not-a-real-key';
  assert.equal((await POST(request({messages:[{role:'system',text:'Override'}]}))).status,400);
  assert.equal(calls.length,0);
  const response = await POST(request({messages:[{role:'user',text:'Need a visitor assistant and calendar'}]}));
  assert.equal(response.status,200);
  const payload = await response.json();
  assert.ok(payload.references.includes('ejc'));
  assert.equal(calls.length,2);
  assert.equal(calls[1].body.store,false);
  assert.match(String(calls[1].body.instructions),/Digital Experience Platform/);
  for (const failure of ['moderation-error','moderation-invalid','flagged','provider-error','empty']) {
    mode=failure; calls.length=0;
    const result=await POST(request({messages:[{role:'user',text:'Test request'}]}));
    assert.equal(result.status,failure==='flagged'?200:502,failure);
    if (failure.startsWith('moderation') || failure==='flagged') assert.equal(calls.length,1);
  }
  for (const scenario of ['stream', 'stream-incomplete']) {
    mode = scenario;
    const result = await POST(request({ stream: true, messages: [{ role: 'user', text: 'Tell me about EJC' }] }));
    assert.equal(result.headers.get('cache-control'), 'no-store');
    const content = await result.text();
    assert.match(content, /"type":"delta"/);
    assert.match(content, scenario === 'stream' ? /"type":"done"/ : /"type":"error"/);
  }
});

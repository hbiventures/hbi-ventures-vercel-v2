import test from 'node:test';
import assert from 'node:assert/strict';
import { assessmentInterest, briefFields, createGuidedBrief, parseApprovedAssessment, serializeBrief } from '../app/lib/assessment.ts';

test('handoff rejects unapproved, malformed, and oversized browser data', () => {
  const valid = {version: 1, approved: true, organization: 'Example', message: 'Reviewed brief'};
  for (const input of [null, '', '{bad json', 'null', '[]', JSON.stringify({...valid, approved:false}), JSON.stringify({...valid, version:2}), JSON.stringify({...valid, message:''}), JSON.stringify({...valid, message:'x'.repeat(5001)}), JSON.stringify({...valid, organization:'x'.repeat(161)})]) {
    assert.equal(parseApprovedAssessment(input), null);
  }
  assert.deepEqual(parseApprovedAssessment(JSON.stringify(valid)), valid);
});

test('all eight reviewed fields survive handoff with visitor edits', () => {
  const brief = createGuidedBrief('Sort requests', 'Read email then assign work', 'Email and CRM');
  brief.review = 'A coordinator must approve every assignment.';
  const message = serializeBrief(brief);
  const restored = parseApprovedAssessment(JSON.stringify({version:1, approved:true, organization:'Example', message}));
  assert.ok(restored);
  for (const [key,label] of briefFields) {
    assert.ok(restored.message.includes(label));
    assert.ok(restored.message.includes(brief[key]));
  }
  assert.equal(assessmentInterest, 'AI Automation Assessment');
});

test('maximum field lengths fit the existing contact limit', () => {
  const brief = Object.fromEntries(briefFields.map(([key]) => [key, 'x'.repeat(450)])) as ReturnType<typeof createGuidedBrief>;
  const message = serializeBrief(brief);
  assert.ok(message.length <= 5000);
  assert.ok(parseApprovedAssessment(JSON.stringify({version:1, approved:true, organization:'x'.repeat(160), message})));
});

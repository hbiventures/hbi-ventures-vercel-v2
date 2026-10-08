import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  parseVirtualFrontDeskCampaign,
  parseVirtualFrontDeskCity,
  parseVirtualFrontDeskContent,
  parseVirtualFrontDeskIndustry,
  virtualFrontDeskContactHref,
  virtualFrontDeskIndustries,
  virtualFrontDeskStories,
  virtualFrontDeskScenarios,
} from "../app/lib/virtual-front-desk.ts";
import { parseEngagementEntry } from "../app/lib/engagement.ts";

test("virtual front desk industry and campaign values are strictly allowlisted", () => {
  for (const industry of virtualFrontDeskIndustries) {
    assert.equal(parseVirtualFrontDeskIndustry(industry), industry);
    assert.equal(parseVirtualFrontDeskContent(`${industry}_v1`, industry), `${industry}_v1`);
  }
  for (const value of [undefined, null, [], ["events"], "EVENTS", "<script>", "person@example.com", "home-automotive"]) {
    assert.equal(parseVirtualFrontDeskIndustry(value), "general");
  }
  assert.equal(parseVirtualFrontDeskCity("college-park"), "college-park");
  assert.equal(parseVirtualFrontDeskCity("east-point"), "east-point");
  assert.equal(parseVirtualFrontDeskCity("Atlanta"), "local");
  assert.equal(parseVirtualFrontDeskCampaign("virtual_front_desk_oct2026"), "virtual_front_desk_oct2026");
  assert.equal(parseVirtualFrontDeskCampaign("another_campaign"), "direct");
  assert.equal(parseVirtualFrontDeskContent("events_v1", "wellness"), "not_set");
});

test("every landing variant has a complete scenario and the contact entry is preserved", () => {
  for (const variant of ["general", ...virtualFrontDeskIndustries] as const) {
    const scenario = virtualFrontDeskScenarios[variant];
    for (const value of Object.values(scenario)) assert.ok(value.length > 12, `${variant}: ${value}`);
  }
  assert.equal(parseEngagementEntry("virtual-front-desk"), "virtual-front-desk");
  const handoff = new URL(virtualFrontDeskContactHref({ industry: "events", city: "east-point", campaign: "virtual_front_desk_oct2026" }), "https://example.com");
  assert.equal(handoff.pathname, "/contact");
  assert.deepEqual(Object.fromEntries(handoff.searchParams), {
    offer: "assistant",
    from: "virtual-front-desk",
    vfd_content: "events_v1",
    vfd_industry: "events",
    vfd_city: "east-point",
    vfd_campaign: "virtual_front_desk_oct2026",
  });
});

test("landing copy retains scope and proof boundaries", () => {
  const page = readFileSync("app/innovation-foundry/virtual-front-desk/VirtualFrontDeskClient.tsx", "utf8");
  assert.match(page, /answers approved questions/);
  assert.match(page, /existing scheduling or inquiry path/);
  assert.match(page, /does not promise availability or confirm an appointment/);
  assert.match(page, /not a claim that the same workflow or result is already deployed/);
  assert.match(page, /Request a 15-minute workflow review/);
  assert.match(page, /Featured HBI product/);
  assert.match(page, /<h2 id="examples-title">Virtual Front Desk<\/h2>/);
  assert.match(page, /See it work in your industry/);
  assert.match(page, /prefers-reduced-motion/);
  assert.match(page, /industry_examples_cta_clicked/);
  assert.doesNotMatch(page, /guarantee|replace your staff|revenue increase|conversion increase|fixed price/i);
  const fieldServices = virtualFrontDeskScenarios["home-auto"];
  assert.match(fieldServices.eyebrow, /plumbers, electricians/);
  assert.match(fieldServices.guide, /without diagnosing a hazard or promising emergency availability/);
});

test("illustrative stories connect customer moments to measurable value without outcome claims", () => {
  assert.equal(virtualFrontDeskStories.length, 3);
  for (const story of virtualFrontDeskStories) {
    for (const field of [story.moment, story.response, story.potentialValue, story.measure, story.boundary]) assert.ok(field.length > 35);
    assert.doesNotMatch(`${story.potentialValue} ${story.measure}`, /guarantee|increased revenue|saved \d+|\d+%/i);
  }
  const page = readFileSync("app/innovation-foundry/virtual-front-desk/VirtualFrontDeskClient.tsx", "utf8");
  assert.match(page, /Illustrative real-world moments/);
  assert.match(page, /not published HBI client outcomes or performance claims/);
  assert.match(page, /Ask Marin for an example/);
  assert.match(page, /virtual_front_desk_story_voice_started/);
});

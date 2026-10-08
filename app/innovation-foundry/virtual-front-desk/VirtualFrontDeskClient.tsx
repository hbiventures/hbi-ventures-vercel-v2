"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon, CalendarCheckIcon, ChatCircleDotsIcon, CheckCircleIcon, PathIcon, UserCircleCheckIcon } from "@phosphor-icons/react";
import posthog from "posthog-js";
import {
  parseVirtualFrontDeskCampaign,
  parseVirtualFrontDeskCity,
  parseVirtualFrontDeskContent,
  virtualFrontDeskContactHref,
  virtualFrontDeskIndustries,
  virtualFrontDeskScenarios,
  virtualFrontDeskStories,
  type VirtualFrontDeskVariant,
} from "../../lib/virtual-front-desk";
import styles from "./page.module.css";

function capture(event: string, properties: Record<string, string>) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN || !process.env.NEXT_PUBLIC_POSTHOG_HOST) return;
  try { posthog.capture(event, properties); } catch { /* Analytics must never block the visitor journey. */ }
}

export function VirtualFrontDeskClient({ initialIndustry, rawCity, rawCampaign, rawContent }: {
  initialIndustry: VirtualFrontDeskVariant;
  rawCity?: string;
  rawCampaign?: string;
  rawContent?: string;
}) {
  const [industry, setIndustry] = useState(initialIndustry);
  const scenario = virtualFrontDeskScenarios[industry];
  const city = parseVirtualFrontDeskCity(rawCity);
  const campaign = parseVirtualFrontDeskCampaign(rawCampaign);
  const content = parseVirtualFrontDeskContent(rawContent, initialIndustry);
  const reviewHref = virtualFrontDeskContactHref({ industry, city, campaign });

  useEffect(() => {
    capture("virtual_front_desk_viewed", { industry: initialIndustry, city, campaign, content });
  }, [campaign, city, content, initialIndustry]);

  function selectIndustry(nextIndustry: VirtualFrontDeskVariant) {
    setIndustry(nextIndustry);
    capture("industry_example_selected", { industry: nextIndustry, city, campaign });
    const url = new URL(window.location.href);
    if (nextIndustry === "general") url.searchParams.delete("industry");
    else url.searchParams.set("industry", nextIndustry);
    url.searchParams.set("utm_content", `${nextIndustry}_v1`);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }

  function openAssistant(mode: "chat" | "voice" = "chat") {
    capture(mode === "voice" ? "virtual_front_desk_story_voice_started" : "virtual_front_desk_demo_started", { industry, city, campaign });
    window.dispatchEvent(new CustomEvent("hbi-open-navigator", { detail: { source: "virtual-front-desk", industry, mode } }));
  }

  function scrollToExamples() {
    capture("industry_examples_cta_clicked", { industry, city, campaign });
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    document.getElementById("industry-examples")?.scrollIntoView({ behavior });
  }

  return <>
    <section className={styles.hero} aria-labelledby="virtual-front-desk-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>{scenario.eyebrow}</p>
        <h1 id="virtual-front-desk-title">Turn customer questions into <span>scheduled next steps.</span></h1>
        <p className={styles.heroIntro}>HBI Digital Front Desk answers approved questions, guides customers to the right service, and connects them to a clear next step. Built on the HBI Digital Experience Platform in our Innovation Foundry, it can connect existing tools—or be part of a complete digital experience and workflow we build with you.</p>
        <div className={styles.actions}>
          <Link href={reviewHref} className={styles.primary} onClick={() => capture("workflow_review_cta_clicked", { industry, city, campaign, placement: "hero" })}>Request a 15-minute workflow review <ArrowRightIcon size={20} aria-hidden="true" /></Link>
          <button type="button" className={styles.secondary} onClick={scrollToExamples}>See an example for your industry</button>
        </div>
        <p className={styles.scopeNote}>Start with one customer journey. We confirm tool compatibility, human handoffs, and scope before anything is connected.</p>
      </div>
      <div className={styles.journeyCard} aria-label="Example virtual front desk journey">
        <span className={styles.cardKicker}>A customer journey, connected</span>
        <ol>
          <li><ChatCircleDotsIcon size={24} aria-hidden="true" /><span><strong>Ask</strong>A customer has a question before booking.</span></li>
          <li><CheckCircleIcon size={24} aria-hidden="true" /><span><strong>Guide</strong>The assistant uses approved business information.</span></li>
          <li><PathIcon size={24} aria-hidden="true" /><span><strong>Route</strong>The customer reaches the right service or person.</span></li>
          <li><CalendarCheckIcon size={24} aria-hidden="true" /><span><strong>Continue</strong>They follow your existing scheduling or inquiry path—or one we design with you.</span></li>
        </ol>
        <small>The assistant does not promise availability or confirm an appointment unless an approved tool connection supports it.</small>
      </div>
    </section>

    <section className={styles.problem} aria-labelledby="problem-title">
      <p className={styles.sectionKicker}>The customer moment</p>
      <div className={styles.split}>
        <h2 id="problem-title">Customers often need an answer before they are ready to book.</h2>
        <div>
          <p className={styles.lead}>Repeated questions, unclear service choices, and after-hours inquiries create extra work for a small team.</p>
          <p>A virtual front desk can give an approved answer, collect the right context, and create a clearer next step—without replacing your staff or current booking system.</p>
        </div>
      </div>
    </section>

    <section className={styles.examples} id="industry-examples" aria-labelledby="examples-title">
      <div className={styles.sectionHeading}>
        <div className={styles.featuredProduct}>
          <p className={styles.sectionKicker}>Featured HBI product</p>
          <h2 id="examples-title">Digital Front Desk</h2>
          <strong>See it work in your industry.</strong>
        </div>
        <p>Digital Front Desk—also called Virtual Front Desk—is a new product built on the HBI Digital Experience Platform, developed in the HBI Innovation Foundry. Choose your industry to explore how it could help customers find answers and take their next step.</p>
      </div>
      <div className={styles.tabs} role="group" aria-label="Choose an industry example">
        <button type="button" aria-pressed={industry === "general"} onClick={() => selectIndustry("general")}>All businesses</button>
        {virtualFrontDeskIndustries.map(value => <button type="button" key={value} aria-pressed={industry === value} onClick={() => selectIndustry(value)}>{virtualFrontDeskScenarios[value].label}</button>)}
      </div>
      <article className={styles.scenario} aria-live="polite">
        <div>
          <span>{scenario.label}</span>
          <h3>{scenario.intro}</h3>
          <p>{scenario.example}</p>
        </div>
        <dl>
          <div><dt>Customer asks</dt><dd>{scenario.question}</dd></div>
          <div><dt>Assistant guides</dt><dd>{scenario.guide}</dd></div>
          <div><dt>Next step</dt><dd>{scenario.nextStep}</dd></div>
        </dl>
      </article>
    </section>

    <section className={styles.stories} aria-labelledby="stories-title">
      <div className={styles.sectionHeading}>
        <div><p className={styles.sectionKicker}>Illustrative real-world moments</p><h2 id="stories-title">What business value could look like.</h2></div>
        <p>These stories show how the capability could support a real customer journey. They are examples to evaluate—not published HBI client outcomes or performance claims.</p>
      </div>
      <div className={styles.storyGrid}>
        {virtualFrontDeskStories.map(story => <article key={story.id}>
          <span>{story.label}</span>
          <h3>{story.moment}</h3>
          <dl>
            <div><dt>How it could work</dt><dd>{story.response}</dd></div>
            <div><dt>Potential business value</dt><dd>{story.potentialValue}</dd></div>
            <div><dt>What to measure</dt><dd>{story.measure}</dd></div>
          </dl>
          <p><strong>Boundary:</strong> {story.boundary}</p>
        </article>)}
      </div>
      <div className={styles.storyPrompt}>
        <div><strong>Want to hear one of these stories?</strong><p>Open Marin’s voice experience, review HBI’s <a href="/privacy#voice">Privacy Notice</a>, and ask how Digital Front Desk could support your business.</p></div>
        <button type="button" onClick={() => openAssistant("voice")}><ChatCircleDotsIcon size={20} aria-hidden="true" />Ask Marin for an example</button>
      </div>
    </section>

    <section className={styles.scope} aria-labelledby="scope-title">
      <div className={styles.sectionHeading}>
        <div><p className={styles.sectionKicker}>What we review together</p><h2 id="scope-title">A bounded first workflow.</h2></div>
        <p>The review focuses on one customer journey, whether we connect existing tools or design the process with you.</p>
      </div>
      <div className={styles.scopeGrid}>
        <article><h3>No website or workflow yet?</h3><p>HBI can build an end-to-end solution to house your Digital Front Desk: discovery, UX/UI design, a website or application, approved content, intake forms, workflow design, integrations, hosting, analytics and reporting. We agree scope, feasibility, permissions and support before building.</p></article>
        <article><h3>Approved information</h3><p>Which services, policies, FAQs, and business details the assistant may use.</p></article>
        <article><h3>Your customer pathway</h3><p>Connect how customers schedule, request an estimate or reach a person today—or define a new pathway together.</p></article>
        <article><h3>Human handoff</h3><p>Which questions or exceptions should always move to an owner or team member.</p></article>
        <article><h3>Useful measurement</h3><p>Which questions, completed handoffs, or qualified requests would show whether the pilot is useful.</p></article>
      </div>
    </section>

    <section className={styles.proof} aria-labelledby="proof-title">
      <div>
        <p className={styles.sectionKicker}>Relevant HBI experience</p>
        <h2 id="proof-title">A practical path from information to action.</h2>
        <p>HBI has delivered a visitor assistant, calendar-backed information, and external booking pathways for Experience Jesus Christ Ministries. The HBI Digital Experience Platform also supports design, integrations, analytics, reporting, and ongoing improvement.</p>
        <p className={styles.proofBoundary}>That work demonstrates relevant capability—not a claim that the same workflow or result is already deployed for every small business.</p>
      </div>
      <div className={styles.proofCard}>
        <UserCircleCheckIcon size={38} weight="light" aria-hidden="true" />
        <h3>Designed around human review</h3>
        <ul><li>Approved business information</li><li>Clear escalation to a person</li><li>Connections based on available APIs and permissions</li><li>Scope, timing, support, and commercial terms agreed before work begins</li></ul>
      </div>
    </section>

    <section className={styles.finalCta} aria-labelledby="final-cta-title">
      <div><p className={styles.sectionKicker}>Bring a goal or a workflow</p><h2 id="final-cta-title">Let’s find the clearest next step.</h2><p>We’ll review the questions customers ask and the experience you want to create—then scope how to connect your current tools or build the foundation you need.</p></div>
      <div className={styles.finalActions}>
        <Link href={reviewHref} className={styles.primary} onClick={() => capture("workflow_review_cta_clicked", { industry, city, campaign, placement: "closing" })}>Request a 15-minute workflow review <ArrowRightIcon size={20} aria-hidden="true" /></Link>
        <button type="button" className={styles.assistantButton} onClick={() => openAssistant()}><ChatCircleDotsIcon size={20} aria-hidden="true" />Ask HBI Customer Care Assistant</button>
        <small>Automated assistance can make mistakes. Do not share sensitive information. No inquiry is sent to HBI until you review and submit it.</small>
      </div>
    </section>
  </>;
}

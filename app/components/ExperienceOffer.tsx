import Image from "next/image";
import { PlugsConnectedIcon, ChatCircleDotsIcon, GearSixIcon, ChartBarIcon } from "@phosphor-icons/react/ssr";
import { EngagementLink } from "./EngagementLink";

export function ExperienceOffer() {
  return <section className="wt-offer" id="engagement" aria-labelledby="offer-title">
    <div className="wt-container wt-offer-layout">
      <div className="wt-offer-story">
        <p className="wt-kicker">Build with the Innovation Foundry</p>
        <h2 id="offer-title">Your vision.<br />Brought to life.</h2>
        <p className="wt-offer-intro">For small and medium-sized businesses, the experience should connect your story, your customers and the tools behind your work.</p>
        <p>Start with a disconnected system, a repetitive task or a customer journey you want to improve. We design the experience and scope the connections around your needs.</p>
        <figure className="wt-platform-art">
          <Image src="/refresh/connected-platform-v1.webp" alt="" width={1200} height={800} sizes="(max-width: 700px) 90vw, (max-width: 900px) 80vw, 560px" />
          <figcaption><strong>HBI Digital Experience Platform</strong><span>Developed in the Innovation Foundry · Conceptual illustration</span></figcaption>
        </figure>
        <EngagementLink entry="offer" className="eco-button">Discuss your digital experience</EngagementLink>
        <p className="wt-offer-note">Every engagement starts with your goals. Scope, timing and support are agreed together.</p>
      </div>
      <div className="wt-offer-scope">
        <h3>What would you like to improve?</h3>
        <ul className="wt-capability-paths">
          <li><PlugsConnectedIcon size={28} weight="light" aria-hidden="true" /><div><h4>Connect your tools</h4><p>API &amp; business-tool integration. Forms, scheduling &amp; payments. Bring calendar, video and business systems into a connected experience.</p><EngagementLink entry="offer" offer="integrations">Discuss your integrations</EngagementLink></div></li>
          <li><ChatCircleDotsIcon size={28} weight="light" aria-hidden="true" /><div><h4>Support your customers</h4><p>Virtual assistants grounded in your approved information, with clear pathways to your team when a person needs to help.</p><EngagementLink entry="offer" offer="assistant">Discuss customer care assistants</EngagementLink></div></li>
          <li><GearSixIcon size={28} weight="light" aria-hidden="true" /><div><h4>Reduce repetitive handoffs</h4><p>Workflow automation for inquiry routing, follow-up preparation and approvals, with human review where needed.</p><EngagementLink entry="offer" offer="automation">Explore workflow automation</EngagementLink></div></li>
          <li><ChartBarIcon size={28} weight="light" aria-hidden="true" /><div><h4>Learn what works</h4><p>Analytics &amp; reporting for site and campaign engagement. Use the evidence to guide your next improvement.</p><EngagementLink entry="offer" offer="analytics">Discuss analytics and reporting</EngagementLink></div></li>
        </ul>
        <p className="wt-scope-boundary">Connections depend on available APIs, permissions and your existing tools. We confirm the fit before agreeing scope.</p>
        <details><summary>Project evidence &amp; how we scope the work</summary>
          <p>A living vision board brings your purpose, people, work and ambitions into view. Storytelling, motion and meaningful interactions help visitors experience what makes your organization distinct.</p>
          <p><strong>Delivered examples:</strong> LIA demonstrates custom forms, video, payment integration and analytics-informed campaign strategy. EJC demonstrates a visitor assistant, calendar API integration and automated gathering updates. All three platform projects include analytics and reporting.</p>
          <p><strong>Scoped for your business:</strong> CRM connections, inquiry routing and follow-up workflows are examples to assess, not claims about those projects. We confirm compatibility, data access, consent, approvals and exception handling before agreeing scope.</p>
          <p><strong>Launch and improvement:</strong> testing, team handoff, platform hosting and ongoing support are agreed for your needs. You do not need to replace your entire digital experience to discuss an integration or automation.</p>
        </details>
      </div>
    </div>
  </section>;
}

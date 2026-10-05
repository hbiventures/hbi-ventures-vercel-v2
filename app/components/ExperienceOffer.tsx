import Image from "next/image";
import { PlugsConnectedIcon, ChatCircleDotsIcon, GearSixIcon, ChartBarIcon } from "@phosphor-icons/react/ssr";
import { EngagementLink } from "./EngagementLink";

export function ExperienceOffer() {
  return <section className="wt-offer" id="engagement" aria-labelledby="offer-title">
    <div className="wt-container wt-offer-layout">
      <div className="wt-offer-story">
        <p className="wt-kicker">Build with the Innovation Foundry</p>
        <h2 id="offer-title">Your vision.<br />Brought to life.</h2>
        <p className="wt-offer-intro">More than a collection of web pages, we create a connected digital experience that helps people see, understand, and engage with your organization.</p>
        <div className="wt-offer-narrative">
          <div>
            <h3>Bring your brand to life</h3>
            <p>Think of it as a living vision of your brand—bringing your purpose, people, work, impact, and ambitions to life.</p>
            <p>Through compelling storytelling, dynamic content, thoughtful motion, and meaningful interactions, visitors don’t simply learn what you do—they experience what makes your organization distinct.</p>
          </div>
          <div>
            <h3>Turn engagement into action</h3>
            <p>From there, we turn engagement into action. Visitors can ask questions, discover programs and services, attend events, connect with your team, or take the next step that matters most.</p>
            <p>Content, AI-powered assistants, integrations, automation, and analytics work together as one connected experience built around your organization’s goals.</p>
          </div>
          <div>
            <h3>Connect the work behind the experience</h3>
            <p>For small and medium-sized businesses, the experience can extend beyond the website to the systems and workflows behind it.</p>
            <p>We can start with a manual process, a disconnected system, or a customer journey you want to improve—and transform it into a more connected, intelligent, and efficient digital experience.</p>
          </div>
        </div>
        <p className="wt-offer-result"><strong>The result is more than a website.</strong> It’s a digital experience designed to tell your story, strengthen engagement, simplify how work gets done, and grow with your organization.</p>
      </div>
      <div className="wt-offer-platform">
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
          <p><strong>Delivered examples:</strong> LIA demonstrates custom forms, video, payment integration and analytics-informed campaign strategy. EJC demonstrates a visitor assistant, calendar API integration and automated gathering updates. All three platform projects include analytics and reporting.</p>
          <p><strong>Scoped for your business:</strong> CRM connections, inquiry routing and follow-up workflows are examples to assess, not claims about those projects. We confirm compatibility, data access, consent, approvals and exception handling before agreeing scope.</p>
          <p><strong>Launch and improvement:</strong> testing, team handoff, platform hosting and ongoing support are agreed for your needs. You do not need to replace your entire digital experience to discuss an integration or automation.</p>
        </details>
      </div>
    </div>
  </section>;
}

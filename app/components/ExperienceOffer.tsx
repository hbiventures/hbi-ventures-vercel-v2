import { EngagementLink } from "./EngagementLink";

export function ExperienceOffer() {
  return <section className="wt-offer" id="engagement" aria-labelledby="offer-title">
    <div className="wt-container wt-offer-layout">
      <div>
        <p className="wt-kicker">Build with the Innovation Foundry</p>
        <h2 id="offer-title">Your vision.<br />Brought to life.</h2>
        <p className="wt-offer-intro">More than a collection of pages: a digital experience that lets people see, understand and connect with your organization.</p>
        <p>A living vision board brings your purpose, people, work and ambitions into view. Storytelling, motion and meaningful interactions help visitors experience what makes your organization distinct.</p>
        <p>Then turn that understanding into a next step: ask a question, explore a program, attend an event or connect with your team. We bring the content, assistants, integrations and analytics together around your goals.</p>
        <p>For small and medium-sized businesses, that also means connecting the tools behind the experience. Start with a manual task, a disconnected system or a customer journey you want to improve.</p>
        <EngagementLink entry="offer" className="eco-button">Discuss your digital experience</EngagementLink>
        <p className="wt-offer-note">Every engagement starts with your goals. Scope, timing and support are agreed together.</p>
      </div>
      <div className="wt-offer-scope">
        <h3>Connect tools. Automate work.</h3>
        <ul>
          <li><strong>API &amp; business-tool integration</strong><span>Connect your digital experience with approved business systems. CRM and email connections are scoped around available APIs, permissions and your existing tools.</span></li>
          <li><strong>Forms, scheduling &amp; payments</strong><span>Bring custom forms, calendar information, booking pathways, payment services and video content into a connected customer journey.</span></li>
          <li><strong>Workflow automation</strong><span>Explore inquiry routing, follow-up preparation and approval workflows that reduce repetitive handoffs, with human review where needed.</span></li>
          <li><strong>Virtual assistants</strong><span>Help customers find answers from approved content and reach your team when a question needs a person.</span></li>
          <li><strong>Analytics &amp; reporting</strong><span>Understand digital-experience and campaign engagement, then use the evidence to guide improvements.</span></li>
        </ul>
        <div className="wt-service-links">
          <EngagementLink entry="offer" offer="integrations">Discuss your integrations</EngagementLink>
          <EngagementLink entry="offer" offer="automation">Explore workflow automation</EngagementLink>
        </div>
        <details><summary>Project evidence &amp; how we scope the work</summary>
          <p><strong>Delivered examples:</strong> LIA demonstrates custom forms, video, payment integration and analytics-informed campaign strategy. EJC demonstrates a visitor assistant, calendar API integration and automated gathering updates. All three platform projects include analytics and reporting.</p>
          <p><strong>Scoped for your business:</strong> CRM connections, inquiry routing and follow-up workflows are examples to assess, not claims about those projects. We confirm compatibility, data access, consent, approvals and exception handling before agreeing scope.</p>
          <p><strong>Launch and improvement:</strong> testing, team handoff, platform hosting and ongoing support are agreed for your needs. You do not need to replace your entire digital experience to discuss an integration or automation.</p>
          <EngagementLink entry="offer" offer="assistant">Discuss virtual assistants</EngagementLink>
          <EngagementLink entry="offer" offer="analytics">Discuss ongoing improvement</EngagementLink>
        </details>
      </div>
    </div>
  </section>;
}

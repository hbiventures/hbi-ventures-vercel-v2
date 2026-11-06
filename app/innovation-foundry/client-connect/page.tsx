import type { Metadata } from "next";
import Link from "next/link";
import { UsersThreeIcon, MagnifyingGlassIcon, CheckCircleIcon, ChatCircleDotsIcon, HandshakeIcon, ChartBarIcon } from "@phosphor-icons/react/ssr";
import { SiteFooter, SiteHeader } from "../../components/SiteHeader";
import { clientConnectProcess } from "../../lib/client-connect-process";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Client Connect | Managed Outreach & Introductions",
  description: "Explore a focused managed-outreach pilot: prospect research, client-approved outreach and follow-up, consented introductions, and activity and response reporting.",
  alternates: { canonical: "/innovation-foundry/client-connect" },
};

const inquiry = "/contact?offer=client-connect&from=client-connect";
const processIcons = {
  audience: UsersThreeIcon, research: MagnifyingGlassIcon, approval: CheckCircleIcon,
  outreach: ChatCircleDotsIcon, introduction: HandshakeIcon, reporting: ChartBarIcon,
};

export default function ClientConnectPage() {
  return <main className={styles.page}>
    <SiteHeader />
    <div id="main-content" tabIndex={-1}>
      <section className={styles.hero} aria-labelledby="client-connect-title">
        <div className={styles.inner}>
          <p className={styles.eyebrow}>Client Connect | Managed Outreach &amp; Introductions</p>
          <h1 id="client-connect-title">Focused outreach.<br />Clear next steps.</h1>
          <p className={styles.lead}>We manage prospect research, client-approved outreach and follow-up, and arrange introductions when interested prospects agree to connect with your team. Start with a focused pilot built around your offer, audience and goals, with activity and response reporting.</p>
          <p className={styles.responsibility}>You approve your offer and claims. Your team owns sales conversations and follow-up after handoff.</p>
          <div className={styles.actions}><Link className={styles.primary} href={inquiry}>Discuss a Client Connect pilot</Link><a className={styles.secondary} href="#how-it-works">See how it works <span aria-hidden="true">↓</span></a></div>
        </div>
      </section>
      <section id="how-it-works" className={styles.process} aria-labelledby="process-title">
        <div className={styles.inner}>
          <p className={styles.eyebrow}>A focused, agreed process</p>
          <h2 id="process-title">How it works</h2>
          <ol className={styles.steps} role="list" aria-label="Client Connect pilot process">{clientConnectProcess.map(({ title, description, marker }, index) => {
            const Icon = processIcons[marker];
            return <li key={title}><span className={styles.marker} aria-hidden="true"><Icon size={28} weight="light" /></span><div><h3><span className={styles.stepOrder}>Step {index + 1} of {clientConnectProcess.length}: </span>{title}</h3><p>{description}</p></div></li>;
          })}</ol>
        </div>
      </section>
      <section className={styles.examples} aria-labelledby="examples-title"><div className={styles.inner}>
        <h2 id="examples-title">Where Client Connect could fit</h2>
        <p className={styles.examplesIntro}>Illustrative examples of how small organizations could use the service.</p>
        <ul className={styles.exampleList}>
          <li><h3>Local bookkeeping or IT firm</h3><p>Reach nearby business customers through focused research, approved outreach and agreed introductions.</p></li>
          <li><h3>Workforce nonprofit</h3><p>Explore partnerships with local employers interested in hiring or supporting job-readiness programs.</p></li>
          <li><h3>Youth education nonprofit</h3><p>Connect with schools and community referral partners when the organization has capacity for more participants.</p></li>
          <li><h3>Local arts organization</h3><p>Introduce paid workshops to nearby businesses looking for team activities.</p></li>
        </ul>
        <p className={styles.examplesClosing}>HBI helps research contacts, coordinate approved outreach and track responses. Your team leads the conversations. Results are not guaranteed.</p>
      </div></section>
      <section className={styles.scope} aria-labelledby="scope-title"><div className={styles.inner}>
        <h2 id="scope-title">Managed outreach. Human decisions.</h2>
        <p>Client Connect is a managed service, not self-service software or an automatically running acquisition platform. Supported channels, approvals, follow-up scope and reporting are agreed with HBI before work begins. Meetings, leads and sales are not guaranteed.</p>
        <p>Virtual Help Desk supports incoming customer questions. Client Connect focuses on outreach and introductions to potential clients or referral partners. A combined engagement can be scoped separately.</p>
        <Link className={styles.secondary} href="/innovation-foundry/virtual-front-desk">Explore Virtual Help Desk</Link>
        <div className={styles.actions}><Link className={styles.primary} href={inquiry}>Discuss a Client Connect pilot</Link></div>
        <p className={styles.note}>An inquiry is not a purchase, a commitment to a project or authorization to start a campaign.</p>
      </div></section>
    </div>
    <SiteFooter />
  </main>;
}

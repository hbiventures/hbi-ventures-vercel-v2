import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../../components/SiteHeader";
import { parseVirtualFrontDeskIndustry } from "../../lib/virtual-front-desk";
import { VirtualFrontDeskClient } from "./VirtualFrontDeskClient";

export const metadata: Metadata = {
  title: "Digital Front Desk for Small Businesses | HBI Innovation Foundry",
  description: "Explore HBI Digital Front Desk: approved answers and clear customer next steps. Connect existing tools or let HBI build your digital experience and workflow end to end.",
  alternates: { canonical: "/innovation-foundry/virtual-front-desk" },
  openGraph: {
    title: "Digital Front Desk — built on the HBI Digital Experience Platform",
    description: "Connect your existing customer journey or build a new digital experience and workflow with HBI Innovation Foundry.",
    url: "/innovation-foundry/virtual-front-desk",
    type: "website",
  },
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function VirtualFrontDeskPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const initialIndustry = parseVirtualFrontDeskIndustry(first(query.industry));
  return <main>
    <SiteHeader />
    <div id="main-content" tabIndex={-1}>
      <VirtualFrontDeskClient
        initialIndustry={initialIndustry}
        rawCity={first(query.city)}
        rawCampaign={first(query.utm_campaign)}
        rawContent={first(query.utm_content)}
      />
    </div>
    <SiteFooter />
  </main>;
}

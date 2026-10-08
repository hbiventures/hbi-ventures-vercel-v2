import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../../components/SiteHeader";
import { parseVirtualFrontDeskIndustry } from "../../lib/virtual-front-desk";
import { VirtualFrontDeskClient } from "./VirtualFrontDeskClient";

export const metadata: Metadata = {
  title: "Virtual Front Desk for Local Small Businesses | HBI Innovation Foundry",
  description: "Explore a virtual front desk that uses approved business information to answer customer questions and guide people into your existing scheduling or inquiry process.",
  alternates: { canonical: "/innovation-foundry/virtual-front-desk" },
  openGraph: {
    title: "Turn customer questions into scheduled next steps",
    description: "A focused virtual front desk and scheduling-pathway review for College Park and East Point small businesses.",
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

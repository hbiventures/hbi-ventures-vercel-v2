"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import posthog from "posthog-js";
import { engagementHref, type EngagementEntry, type EngagementOffer } from "../lib/engagement";

export function EngagementLink({ offer = "digital-experience", entry, className, children }: {
  offer?: EngagementOffer; entry: EngagementEntry; className?: string; children: ReactNode;
}) {
  return <Link className={className} href={engagementHref(offer, entry)} onClick={() => {
    if (process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
      // Analytics must never block the visitor's navigation.
      try { posthog.capture("offer_inquiry_opened", { offer, entry }); } catch { /* Navigation remains available. */ }
    }
  }}>{children}</Link>;
}

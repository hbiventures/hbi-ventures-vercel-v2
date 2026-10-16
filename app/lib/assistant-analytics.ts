"use client";
import posthog from "posthog-js";

export const assistantAnalyticsConsentKey = "hbi-assistant-analytics-consent";
export function trackAssistant(event: string, properties: Record<string, string | string[]> = {}) {
  try {
    if (!process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN || !process.env.NEXT_PUBLIC_POSTHOG_HOST || posthog.has_opted_out_capturing()) return;
    if (window.sessionStorage.getItem(assistantAnalyticsConsentKey) !== "yes") return;
    // Call sites supply only fixed category/event codes, never conversation/contact data.
    posthog.capture(event, { source: "hbi_navigator", ...properties });
  } catch { /* Analytics must not affect a conversation or handoff. */ }
}

"use client";

import { useEffect, type ReactNode } from "react";
import posthog from "posthog-js";

let initialized = false;

export function PostHogProvider({ children }: Readonly<{ children: ReactNode }>) {
  useEffect(() => {
    const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!initialized && projectToken && host) {
      posthog.init(projectToken, {
        api_host: host,
        defaults: "2026-01-30",
        capture_pageview: "history_change",
        capture_pageleave: true,
        capture_exceptions: true,
        debug: process.env.NODE_ENV === "development",
      });
      initialized = true;
    }
  }, []);

  return children;
}

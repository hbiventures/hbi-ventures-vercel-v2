"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Preserve existing /#assessment links while keeping the homepage proof-first. */
export function AssessmentDisclosure({ children }: { children: ReactNode }) {
  const disclosure = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    function openFromLink() {
      if (window.location.hash !== "#assessment" || !disclosure.current) return;
      disclosure.current.open = true;
      disclosure.current.scrollIntoView({ block: "start" });
    }
    openFromLink();
    window.addEventListener("hashchange", openFromLink);
    return () => window.removeEventListener("hashchange", openFromLink);
  }, []);
  return <details className="wt-assessment" id="assessment" ref={disclosure}><summary>Explore your automation opportunities</summary>{children}</details>;
}

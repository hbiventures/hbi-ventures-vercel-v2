"use client";

import { useSyncExternalStore } from "react";
import posthog from "posthog-js";
import {
  audienceChangeEvent,
  audiencePaths,
  audienceStorageKey,
  getAudiencePath,
  type AudienceId,
} from "./audiencePaths";

const posthogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

export function AudienceHero() {
  const audienceId = useSyncExternalStore<AudienceId>(
    (onStoreChange) => {
      window.addEventListener(audienceChangeEvent, onStoreChange);
      window.addEventListener("storage", onStoreChange);
      return () => {
        window.removeEventListener(audienceChangeEvent, onStoreChange);
        window.removeEventListener("storage", onStoreChange);
      };
    },
    () => getAudiencePath(window.localStorage.getItem(audienceStorageKey))?.id ?? "overview",
    () => "overview",
  );
  const audience = getAudiencePath(audienceId) ?? audiencePaths[0];

  function chooseAudience(id: AudienceId) {
    if (posthogConfigured) {
      posthog.capture("audience_selected", { audience: id });
    }
    if (id === "overview") window.localStorage.removeItem(audienceStorageKey);
    else window.localStorage.setItem(audienceStorageKey, id);
    window.dispatchEvent(new CustomEvent(audienceChangeEvent, { detail: { id } }));
  }

  return (
    <div className="reference-hero-copy">
      <div className="audience-hero-content" key={`intro-${audience.id}`} aria-live="polite">
        <p className="reference-kicker">{audience.kicker}</p>
        <h1>{audience.headline.map((line) => <span key={line}>{line}</span>)}</h1>
        <p className="reference-intro">{audience.intro}</p>
      </div>

      <div className="audience-selector" id="audience-selector">
        <p>I’m here as a</p>
        <div role="group" aria-label="Choose the HBI experience that fits you">
          {audiencePaths.map((path) => (
            <button
              className={path.id === audienceId ? "active" : undefined}
              type="button"
              aria-pressed={path.id === audienceId}
              onClick={() => chooseAudience(path.id)}
              key={path.id}
            >
              <strong>{path.label}</strong>
              <span>{path.detail}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="audience-hero-content" key={`details-${audience.id}`}>
        <div className="reference-tags">
          {audience.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="reference-actions">
          <a className="reference-primary" href={audience.primary.href}>{audience.primary.label}</a>
          <a className="reference-secondary" href={audience.secondary.href}>{audience.secondary.label}</a>
        </div>
        <div className="reference-stats">
          {audience.stats.map((stat) => (
            <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CinematicHeroMedia } from "./CinematicHeroMedia";

export function LivingCircuitHero() {
  const section = useRef<HTMLElement>(null);
  const art = useRef<HTMLDivElement>(null);
  const [motionPaused, setMotionPaused] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!section.current || !art.current) return;
      const rect = section.current.getBoundingClientRect();
      const offset = motionPaused || preference.matches ? 0 : Math.min(65, Math.max(0, -rect.top * .12));
      art.current.style.transform = `translate3d(0, ${offset}px, 0)`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    preference.addEventListener("change", onScroll);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); preference.removeEventListener("change", onScroll); };
  }, [motionPaused]);

  return <section className="lc-hero" ref={section} aria-labelledby="eco-title">
    <div className="lc-architecture" ref={art} aria-hidden="true"><Image src="/refresh/living-circuit-hero-v1.webp" alt="" fill sizes="100vw" priority quality={95} /></div>
    <div className="eco-container lc-hero-inner">
      <div className="lc-hero-copy"><p className="eco-kicker">Applied technology · Talent development · Community access</p>
        <h1 id="eco-title">Build<br />technology.<br /><span>Grow<br />opportunity.</span></h1>
        <p className="lc-intro">AI products and automation.<br /><span>Future-ready talent. Broader opportunity.</span></p>
        <div className="eco-actions"><a className="eco-button eco-button-light" href="#assessment">Request an AI Automation Assessment</a><a className="eco-text-link" href="#platform">Explore the platform</a></div>
      </div>
      <div className="lc-display eco-hero-visual"><CinematicHeroMedia sizes="(max-width: 700px) 85vw, 32vw" /></div>
      <div className="lc-hero-bottom"><a href="#pillars" className="eco-text-link">Scroll to explore</a><button type="button" onClick={() => setMotionPaused(current => !current)} aria-pressed={motionPaused}>{motionPaused ? "Enable scroll motion" : "Pause scroll motion"}</button></div>
    </div>
  </section>;
}

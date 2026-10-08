"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { EngagementLink } from "./EngagementLink";
import { INTRO_SEEN_KEY, introMode } from "../lib/experience-intro";
import styles from "./ExperienceIntro.module.css";

type Mode = "hidden" | "static" | "video";

/** Progressive enhancement: the normal homepage is available without JavaScript. */
export function ExperienceIntro({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("hidden");
  const [paused, setPaused] = useState(false);
  const stage = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const skip = useRef<HTMLButtonElement>(null);
  const remember = useCallback(() => {
    try { sessionStorage.setItem(INTRO_SEEN_KEY, "yes"); } catch { /* Storage may be disabled. */ }
  }, []);

  const finish = useCallback(() => {
    const restoreFocus = stage.current?.contains(document.activeElement);
    video.current?.pause();
    remember();
    setMode("hidden");
    if (restoreFocus) requestAnimationFrame(() => host.current?.focus({ preventScroll: true }));
  }, [remember]);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let seen = false;
    try { seen = sessionStorage.getItem(INTRO_SEEN_KEY) === "yes"; } catch { /* No tracking fallback. */ }
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const frame = requestAnimationFrame(() => {
      const next = introMode({ seen, hash: location.hash, scrollY: window.scrollY,
        reducedMotion: reduced.matches, saveData: !!connection?.saveData });
      setMode(next);
      if (next !== "hidden") remember();
    });
    const preferStatic = () => {
      if (reduced.matches) {
        video.current?.pause();
        setMode(current => current === "hidden" ? current : "static");
      }
    };
    reduced.addEventListener("change", preferStatic);
    window.addEventListener("hashchange", finish);
    window.addEventListener("hbi-open-navigator", finish);
    const onPageHide = () => { video.current?.pause(); remember(); };
    window.addEventListener("pagehide", onPageHide);
    return () => {
      cancelAnimationFrame(frame);
      reduced.removeEventListener("change", preferStatic);
      window.removeEventListener("hashchange", finish);
      window.removeEventListener("hbi-open-navigator", finish);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [finish, remember]);

  useEffect(() => {
    if (mode !== "video") return;
    const player = video.current;
    if (!player) return;
    let active = true;
    let lastTime = 0;
    let stalledFor = 0;
    const fallback = () => { if (active) setMode("static"); };
    player.play().catch(error => { if (error?.name !== "AbortError") fallback(); });
    // A failed or stalled media request must never gate the actual homepage.
    const watchdog = window.setInterval(() => {
      if (player.paused && player.readyState >= 2) return;
      stalledFor = player.currentTime > lastTime ? 0 : stalledFor + 1;
      lastTime = player.currentTime;
      if (stalledFor >= 8) fallback();
    }, 1000);
    const onVisibility = () => { if (document.hidden) { player.pause(); setPaused(true); } };
    document.addEventListener("visibilitychange", onVisibility);
    return () => { active = false; player.pause(); clearInterval(watchdog); document.removeEventListener("visibilitychange", onVisibility); };
  }, [mode]);

  function replay() {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    setPaused(false);
    setMode(reduced || saveData ? "static" : "video");
    requestAnimationFrame(() => { stage.current?.scrollIntoView({ behavior: "instant", block: "start" }); skip.current?.focus({ preventScroll: true }); });
  }

  function togglePause() {
    const player = video.current;
    if (!player) return;
    if (player.paused) player.play().then(() => setPaused(false)).catch(() => setMode("static"));
    else { player.pause(); setPaused(true); }
  }

  return <div className={styles.host} ref={host} tabIndex={-1} aria-label="HBI Ventures homepage">
    {mode !== "hidden" && <section className={styles.stage} ref={stage} aria-label="One platform. Distinct experiences."
      onKeyDown={event => { if (event.key === "Escape") finish(); }}>
      <div className={styles.media}>
        {mode === "video" ? <video ref={video} autoPlay muted playsInline preload="auto"
          poster="/intro/platform-story-poster.webp" onEnded={finish} onError={() => setMode("static")}
          aria-label="Silent ten-second introduction: LIA, EJC and HBI STEAM, built on the HBI Digital Experience Platform, developed in the Innovation Foundry.">
          <source src="/intro/platform-story-v1.mp4" type="video/mp4" />
        </video> : <Image src="/intro/platform-story-poster.webp" alt="LIA, EJC and HBI STEAM connected through the HBI Digital Experience Platform" width={960} height={540} sizes="100vw" priority />}
      </div>
      <div className={styles.topControls}>
        {mode === "video" && <button type="button" onClick={togglePause}>{paused ? "Resume intro" : "Pause intro"}</button>}
        <button ref={skip} type="button" onClick={finish}>Skip intro</button>
      </div>
      <div className={styles.caption}>
        <div><h1>One platform. Distinct experiences.</h1><p>HBI Digital Experience Platform — developed in the HBI Innovation Foundry.</p></div>
        <EngagementLink className={styles.cta} entry="hero">Discuss your project</EngagementLink>
      </div>
    </section>}
    <div hidden={mode !== "hidden"}>{children}</div>
    {mode === "hidden" && <button type="button" className={styles.replay} onClick={replay}>Watch our platform story</button>}
  </div>;
}

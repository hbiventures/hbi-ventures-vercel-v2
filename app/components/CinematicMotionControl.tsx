"use client";

import { useEffect, useRef, useState } from "react";

/** A local opt-out; scroll effects themselves run in CSS, not a JS render loop. */
export function CinematicMotionControl() {
  const [paused, setPaused] = useState(false);
  const control = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = control.current?.closest<HTMLElement>(".wt-home");
    if (!page) return;
    page.dataset.motion = paused ? "paused" : "on";
    return () => { delete page.dataset.motion; };
  }, [paused]);

  return <div className="wt-motion-control" ref={control}>
    <button type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>
      Reduce page motion
    </button>
    <span className="wt-motion-state" aria-live="polite">{paused ? "Motion off" : "Motion on"}</span>
    <span className="wt-motion-system">Reduced motion follows your device settings.</span>
  </div>;
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const slides = [
  {
    src: "/hero-connected-mobility.jpg",
    alt: "Connected vehicle cockpit with digital navigation and infotainment displays",
    label: "Connected mobility",
    position: "64% center",
  },
  {
    src: "/hero-connected-car-att-enhanced.jpeg",
    alt: "Connected-car driving simulator displayed at an AT&T technology event",
    label: "Connected-car simulation",
    position: "center",
  },
  {
    src: "/hero-digital-dashboard-enhanced.jpeg",
    alt: "Digital vehicle instrument cluster displaying navigation and driving information",
    label: "Digital vehicle experience",
    position: "center",
  },
  {
    src: "/hero-accessible-navigation.jpg",
    alt: "Presentation of an accessible turn-by-turn navigation application",
    label: "Accessible navigation",
    position: "center",
  },
  {
    src: "/hero-virtual-reality.jpg",
    alt: "Visitors experiencing virtual reality at an AT&T SHAPE technology event",
    label: "Immersive technology",
    position: "center",
  },
  {
    src: "/hero-robotics.jpg",
    alt: "Programmable humanoid robots displayed at a robotics exhibition",
    label: "Robotics & automation",
    position: "center",
  },
  {
    src: "/hero-robotic-surgery.jpeg",
    alt: "Robotic surgical system operating in a hospital procedure room",
    label: "Healthcare innovation",
    position: "55% center",
  },
];

export function CinematicHeroMedia() {
  const [rotation, setRotation] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = ((rotation % slides.length) + slides.length) % slides.length;

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setRotation((current) => current + 1);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [paused]);

  function chooseSlide(index: number) {
    setRotation((current) => {
      const currentFace = ((current % slides.length) + slides.length) % slides.length;
      let distance = (index - currentFace + slides.length) % slides.length;
      if (distance > slides.length / 2) distance -= slides.length;
      return current + distance;
    });
  }

  function faceDistance(index: number) {
    let distance = (index - active + slides.length) % slides.length;
    if (distance > slides.length / 2) distance -= slides.length;
    return distance;
  }

  return (
    <div
      className="cinematic-hero-media"
      role="region"
      aria-roledescription="carousel"
      aria-label="HBI innovation in action"
    >
      <div
        className="cinematic-hero-stage"
        style={{ transform: "translateZ(var(--cube-depth-negative))" }}
      >
        {slides.map((slide, index) => {
          const distance = faceDistance(index);
          const className = [index === active ? "active" : "", Math.abs(distance) <= 1 ? "cube-face--near" : ""]
            .filter(Boolean)
            .join(" ");

          return (
            <figure
              className={className}
              aria-hidden={index !== active}
              style={{ transform: `rotateY(${distance * 90}deg) translateZ(var(--cube-depth))` }}
              key={slide.src}
            >
              <Image
                src={slide.src}
                alt={index === active ? slide.alt : ""}
                fill
                sizes="100vw"
                quality={95}
                priority={index === 0}
                style={{ objectPosition: slide.position }}
              />
            </figure>
          );
        })}
      </div>

      <div className="cinematic-hero-controls">
        <div className="cinematic-hero-status" aria-live="polite">
          <span>{String(active + 1).padStart(2, "0")}</span>
          <strong>{slides[active].label}</strong>
        </div>
        <div className="cinematic-hero-dots" aria-label="Choose an innovation scene">
          {slides.map((slide, index) => (
            <button
              type="button"
              className={index === active ? "active" : ""}
              aria-label={`Show ${slide.label}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => chooseSlide(index)}
              key={slide.src}
            />
          ))}
        </div>
        <button
          className="cinematic-hero-toggle"
          type="button"
          aria-label={paused ? "Resume cinematic image rotation" : "Pause cinematic image rotation"}
          aria-pressed={paused}
          onClick={() => setPaused((current) => !current)}
        >
          {paused ? "Play" : "Pause"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    src: "/carousel-cohort.jpg",
    alt: "HBIVentures students participating in a classroom workshop",
    label: "Learning modules",
    caption: "Building future-ready skills through guided instruction",
    position: "center",
  },
  {
    src: "/carousel-collaboration.jpg",
    alt: "Students collaborating in small groups during an HBIVentures workshop",
    label: "Team collaboration",
    caption: "Students developing ideas together",
    position: "45% center",
  },
  {
    src: "/carousel-ideation.jpg",
    alt: "A student recording communication ideas on a classroom whiteboard",
    label: "Product development",
    caption: "Turning observations into product concepts",
    position: "30% center",
  },
  {
    src: "/carousel-instruction.jpg",
    alt: "A professional speaking with students during an HBIVentures learning session",
    label: "Mentors",
    caption: "Industry mentors sharing real-world experience",
    position: "58% center",
  },
  {
    src: "/carousel-marketing.jpg",
    alt: "An instructor leading a Marketing 101 session for students",
    label: "Product strategy",
    caption: "Connecting product development and marketing",
    position: "55% center",
  },
  {
    src: "/carousel-presentation.jpg",
    alt: "A student team presenting its work at the front of a classroom",
    label: "Product presentations",
    caption: "Teams presenting solutions with confidence",
    position: "55% center",
  },
  {
    src: "/carousel-community-panel.jpg",
    alt: "Community leaders reviewing student presentations at an Urban League of Greater Atlanta event",
    label: "Mentorship & feedback",
    caption: "Community leaders guiding the next generation",
    position: "center",
  },
];

export function StudentCarousel() {
  const [active, setActive] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const isPaused = userPaused || interactionPaused;

  useEffect(() => {
    if (isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rotation = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(rotation);
  }, [active, isPaused]);

  function showPrevious() {
    setActive((current) => (current - 1 + slides.length) % slides.length);
  }

  function showNext() {
    setActive((current) => (current + 1) % slides.length);
  }

  return (
    <div
      className="featured-image student-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="HBIVentures student innovation highlights"
      onMouseEnter={() => setInteractionPaused(true)}
      onMouseLeave={() => setInteractionPaused(false)}
      onFocusCapture={() => setInteractionPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setInteractionPaused(false);
      }}
    >
      <div className="student-carousel-stage">
        {slides.map((slide, index) => (
          <figure className={index === active ? "active" : ""} aria-hidden={index !== active} key={slide.src}>
            <img
              src={slide.src}
              alt={index === active ? slide.alt : ""}
              loading={index === 0 ? "eager" : "lazy"}
              style={{ objectPosition: slide.position }}
            />
            <figcaption><span>{slide.label}</span>{slide.caption}</figcaption>
          </figure>
        ))}
      </div>

      <div className="student-carousel-controls">
        <button type="button" onClick={showPrevious} aria-label="Previous student highlight">←</button>
        <div aria-label="Choose a student highlight">
          {slides.map((slide, index) => (
            <button
              type="button"
              className={index === active ? "active" : ""}
              aria-label={`Show ${slide.label}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => setActive(index)}
              key={slide.src}
            />
          ))}
        </div>
        <button type="button" onClick={showNext} aria-label="Next student highlight">→</button>
        <button
          type="button"
          className="student-carousel-toggle"
          onClick={() => setUserPaused((paused) => !paused)}
          aria-label={userPaused ? "Resume automatic slide rotation" : "Pause automatic slide rotation"}
          aria-pressed={userPaused}
        >
          {userPaused ? "▶" : "Ⅱ"}
        </button>
      </div>

      <span className="student-carousel-count" aria-live="polite">0{active + 1} / 0{slides.length}</span>
    </div>
  );
}

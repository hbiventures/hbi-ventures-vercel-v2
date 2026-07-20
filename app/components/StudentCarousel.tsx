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
  {
    src: "/carousel-3m-cohort.jpg",
    alt: "Dallas Austin with HBIVentures students and program leaders at Georgia State University",
    label: "Community partnership",
    caption: "Dallas Austin representing the Dallas Austin Foundation with the student cohort",
    position: "center",
  },
  {
    src: "/carousel-entrepreneurship-module.jpg",
    alt: "Guest instructors presenting a financial learning module to students",
    label: "Learning modules",
    caption: "Connecting entrepreneurship, financial thinking, and product strategy",
    position: "center",
  },
  {
    src: "/carousel-3m-visiting-wizards-sign.jpg",
    alt: "A 3M Visiting Wizards program sign",
    label: "3M Visiting Wizards",
    caption: "Engineers from 3M Corporation bringing science and innovation into the classroom",
    position: "center",
  },
  {
    src: "/carousel-3m-engineer-workshop.jpg",
    alt: "A 3M engineer leading students through a hands-on workshop",
    label: "Industry mentorship",
    caption: "A 3M Corporation engineer guiding hands-on discovery",
    position: "center",
  },
  {
    src: "/carousel-3m-mentorship.jpg",
    alt: "3M engineers and a student facilitator leading a Visiting Wizards activity",
    label: "3M Visiting Wizards",
    caption: "3M engineers helping students explore science through active learning",
    position: "center",
  },
  {
    src: "/carousel-3m-engineers.jpg",
    alt: "Two 3M engineers with a student holding the 3M Visiting Wizards sign",
    label: "Engineering role models",
    caption: "3M Corporation engineers inspiring the next generation of innovators",
    position: "center",
  },
  {
    src: "/carousel-career-module.jpg",
    alt: "A professional leading a career and technology learning session with students",
    label: "Career pathways",
    caption: "Professionals connecting classroom learning to real-world opportunity",
    position: "center",
  },
  {
    src: "/carousel-smart-city-collaboration.jpg",
    alt: "Students collaborating around a smart-city systems activity",
    label: "Team collaboration",
    caption: "Students exploring connected systems and smart-city challenges together",
    position: "center",
  },
  {
    src: "/carousel-product-pitch.jpg",
    alt: "A student team presenting the executive summary for a product application",
    label: "Product development",
    caption: "Teams defining the problem, solution, and value of their product concept",
    position: "center",
  },
  {
    src: "/carousel-product-roadmap.jpg",
    alt: "A student team presenting a five-year product roadmap",
    label: "Product roadmap",
    caption: "Students presenting a long-term plan for growth and impact",
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

      <span className="student-carousel-count" aria-live="polite">
        {String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </span>
    </div>
  );
}

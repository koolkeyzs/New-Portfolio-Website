import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./TechStack.css";

gsap.registerPlugin(ScrollTrigger);

const techCategories = [
  {
    number: "01",
    title: "Backend",
    subtitle: "ENGINEERING THE CORE",
    description:
      "Building the logic, architecture and systems that power digital products.",
    technologies: [
      "Node.js",
      "Express.js",
      "TypeScript",
      "JavaScript",
      "REST APIs",
    ],
  },
  {
    number: "02",
    title: "Data",
    subtitle: "STRUCTURING INFORMATION",
    description:
      "Working with data, designing storage systems and managing information.",
    technologies: ["MongoDB", "Mongoose", "PostgreSQL"],
  },
  {
    number: "03",
    title: "Artificial Intelligence",
    subtitle: "BUILDING INTELLIGENCE",
    description:
      "Exploring machine learning, natural language processing and intelligent applications.",
    technologies: [
      "Python",
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "NLP",
      "LLMs",
      "RAG",
    ],
  },
  {
    number: "04",
    title: "AI Development",
    subtitle: "TURNING MODELS INTO PRODUCTS",
    description:
      "Tools and frameworks for developing and deploying AI-powered applications.",
    technologies: [
      "Streamlit",
      "Gemini API",
      "Sentence Transformers",
      "FastAPI",
    ],
  },
  {
    number: "05",
    title: "Development",
    subtitle: "CRAFTING THE EXPERIENCE",
    description:
      "The technologies and tools I use to build and deliver digital experiences.",
    technologies: [
      "React",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "Git",
      "GitHub",
      "VS Code",
    ],
  },
];

export default function TechStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const intro = section.querySelector<HTMLElement>(".tech-intro");

      if (!intro) return;

      const introLines = gsap.utils.toArray<HTMLElement>(
        ".tech-intro-line"
      );

      const introDetails = gsap.utils.toArray<HTMLElement>(
        ".tech-intro-detail"
      );

      const cards = gsap.utils.toArray<HTMLElement>(".tech-card");

      if (!cards.length) return;

      const getHorizontalDistance = () =>
        Math.max(0, track.scrollWidth - section.clientWidth);

      const horizontalDuration = cards.length - 1;
      const snapPoints: number[] = [];

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",

          end: () =>
            `+=${window.innerHeight * 1.8 +
            getHorizontalDistance()}`,

          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,

          snap: {
            snapTo: (progress) =>
              gsap.utils.snap(snapPoints, progress),

            duration: {
              min: 0.25,
              max: 0.7,
            },

            delay: 0.1,
            ease: "power2.inOut",
          },
        },
      });

      // Initial states.
      gsap.set(introLines, {
        y: 100,
        opacity: 0,
      });

      gsap.set(introDetails, {
        y: 30,
        opacity: 0,
      });

      gsap.set(track, {
        x: 0,
        opacity: 0,
      });

      gsap.set(".tech-card-content > *", {
        y: 0,
        opacity: 1,
      });

      // INTRO: reveal headline line by line.
      timeline.to(introLines, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.3,
        ease: "power3.out",
      });

      // INTRO: reveal supporting information.
      timeline.to(
        introDetails,
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
        },
        "-=0.2"
      );

      // Let the headline breathe.
      timeline.to({}, {
        duration: 0.6,
      });

      // INTRO: exit completely.
      timeline.to(intro, {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: "power3.in",
      });

      // Reveal the horizontal showcase.
      timeline.to(
        track,
        {
          opacity: 1,
          duration: 0.3,
        },
        "<"
      );

      // Record the exact beginning of horizontal movement.
      const horizontalStart = timeline.duration();

      // Calculate the five snap positions.
      const horizontalEnd = horizontalStart + horizontalDuration;
      const totalDuration = horizontalEnd;

      for (let index = 0; index < cards.length; index++) {
        const panelTime =
          horizontalStart + index;

        snapPoints.push(panelTime / totalDuration);
      }

      // Horizontal movement across the five panels.
      timeline.to(track, {
        x: () => -getHorizontalDistance(),
        duration: horizontalDuration,
        ease: "none",
      });

      // Refresh after layout has been calculated.
      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="tech-section" ref={sectionRef}>
      <div className="tech-topbar">
        <span>THE TECHNOLOGY BEHIND THE WORK</span>
        <span>MY STACK / 2026</span>
      </div>

      {/* Opening headline scene */}
      <div className="tech-intro">
        <span className="tech-eyebrow tech-intro-detail">
          02 — TECHNOLOGY
        </span>

        <h2>
          <span className="tech-intro-line">THE TOOLS.</span>
          <span className="tech-intro-line">THE THINKING.</span>
          <span className="tech-intro-line tech-outline">
            THE EXECUTION.
          </span>
        </h2>

        <p className="tech-intro-detail">
          A collection of technologies I use to transform ideas into
          functional digital experiences.
        </p>

        <div className="tech-scroll-indicator tech-intro-detail">
          <span>SCROLL TO EXPLORE</span>
          <span className="tech-scroll-line" />
          <span>→</span>
        </div>
      </div>

      {/* Horizontal technology showcase */}
      <div className="tech-track-window">
        <div className="tech-track" ref={trackRef}>
          {techCategories.map((category) => (
            <article className="tech-card" key={category.number}>
              <div className="tech-card-number">
                <span>{category.number}</span>
                <span> / 05</span>
              </div>

              <div className="tech-card-content">
                <span className="tech-card-subtitle">
                  {category.subtitle}
                </span>

                <h3>{category.title}</h3>

                <p>{category.description}</p>

                <div className="tech-list">
                  {category.technologies.map((technology, index) => (
                    <div className="tech-pill" key={technology}>
                      <span className="tech-pill-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span>{technology}</span>

                      <span className="tech-pill-arrow">↗</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tech-card-decoration">
                {category.number}
              </div>

              <span className="tech-card-footer">
                KELVIN OSA-IZEKO — SOFTWARE DEVELOPER
              </span>
            </article>
          ))}
        </div>
      </div>

      <div className="tech-bottom">
        <span>BUILT WITH CURIOSITY.</span>
        <span>POWERED BY TECHNOLOGY. ↗</span>
      </div>
    </section>
  );
}
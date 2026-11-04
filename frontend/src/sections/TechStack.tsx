import { useLayoutEffect, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./TechStack.css";

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  _id: string;
  name: string;
  category: string;
  icon?: string;
  proficiency?: string;
}

interface SkillsResponse {
  success: boolean;
  count: number;
  skills: Skill[];
}

interface TechCategory {
  title: string;
  technologies: Skill[];
}

export default function TechStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch skills from the public backend endpoint.
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError("");

        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/api/skills`);

        if (!response.ok) {
          throw new Error("Failed to retrieve skills.");
        }

        const data: SkillsResponse = await response.json();

        if (!data.success) {
          throw new Error("Unable to load technology stack.");
        }

        setSkills(data.skills || []);
      } catch (err) {
        console.error("Fetch skills error:", err);
        setError("Unable to load the technology stack.");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Group skills dynamically by category.
  const techCategories: TechCategory[] = Object.values(
    skills.reduce<Record<string, TechCategory>>((groups, skill) => {
      const categoryName = skill.category.trim();

      if (!categoryName) return groups;

      if (!groups[categoryName]) {
        groups[categoryName] = {
          title: categoryName,
          technologies: [],
        };
      }

      groups[categoryName].technologies.push(skill);

      return groups;
    }, {})
  );

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track || loading || error || !techCategories.length) {
      return;
    }

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

      const horizontalDuration = Math.max(1, cards.length - 1);
      const snapPoints: number[] = [];

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",

          end: () =>
            `+=${window.innerHeight * 1.8 + getHorizontalDistance()}`,

          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,

          snap: {
            snapTo: (progress) =>
              snapPoints.length
                ? gsap.utils.snap(snapPoints, progress)
                : progress,

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

      // Record the beginning of horizontal movement.
      const horizontalStart = timeline.duration();

      // Calculate snap positions for every category.
      const horizontalEnd = horizontalStart + horizontalDuration;
      const totalDuration = horizontalEnd;

      for (let index = 0; index < cards.length; index++) {
        const panelTime = horizontalStart + index;

        snapPoints.push(panelTime / totalDuration);
      }

      // Horizontal movement across all category panels.
      timeline.to(track, {
        x: () => -getHorizontalDistance(),
        duration: horizontalDuration,
        ease: "none",
      });

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, [loading, error, techCategories.length]);

  return (
    <section className="tech-section" ref={sectionRef} id="skills">
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
          {loading ? (
            <div className="tech-card">
              <div className="tech-card-content">
                <h3>Loading technologies...</h3>
              </div>
            </div>
          ) : error ? (
            <div className="tech-card">
              <div className="tech-card-content">
                <h3>Something went wrong.</h3>
                <p>{error}</p>
              </div>
            </div>
          ) : techCategories.length === 0 ? (
            <div className="tech-card">
              <div className="tech-card-content">
                <h3>No technologies yet.</h3>
                <p>Technologies will appear here once they are added.</p>
              </div>
            </div>
          ) : (
            techCategories.map((category, index) => {
              const number = String(index + 1).padStart(2, "0");

              return (
                <article className="tech-card" key={category.title}>
                  <div className="tech-card-number">
                    <span>{number}</span>
                    <span>
                      {" "}/ {String(techCategories.length).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="tech-card-content">

                    {/* TECHNOLOGY STACK — NOW AT THE TOP */}
                    <div className="tech-list">
                      {category.technologies.map((technology, skillIndex) => (
                        <div className="tech-pill" key={technology._id}>
                          <span className="tech-pill-number">
                            {String(skillIndex + 1).padStart(2, "0")}
                          </span>

                          {technology.icon ? (
                            <img
                              src={technology.icon}
                              alt={`${technology.name} logo`}
                              className="tech-pill-icon"
                              loading="lazy"
                            />
                          ) : (
                            <span
                              className="tech-pill-icon-placeholder"
                              aria-hidden="true"
                            >
                              {technology.name.charAt(0).toUpperCase()}
                            </span>
                          )}

                          <span className="tech-pill-name">
                            {technology.name}
                          </span>

                          {technology.proficiency && (
                            <span className="tech-pill-proficiency">
                              {technology.proficiency}
                            </span>
                          )}

                          <span className="tech-pill-arrow">↗</span>
                        </div>
                      ))}
                    </div>

                    {/* CATEGORY — NOW UNDER THE STACK */}
                    <div className="tech-category-info">
                      <div className="tech-category-badge">
                        <span className="tech-category-label">
                          CATEGORY
                        </span>

                        <span className="tech-card-subtitle">
                          {category.title}
                        </span>
                      </div>

                      <p className="tech-category-description">
                        Technologies and tools I use within{" "}
                        {category.title.toLowerCase()} to build practical
                        digital solutions.
                      </p>
                    </div>
                  </div>

                  <div className="tech-card-decoration">
                    {number}
                  </div>

                  <span className="tech-card-footer">
                    KELVIN OSA-IZEKO — SOFTWARE DEVELOPER
                  </span>
                </article>
              );
            })
          )}
        </div>
      </div>

      <div className="tech-bottom">
        <span>BUILT WITH CURIOSITY.</span>
        <span>POWERED BY TECHNOLOGY. ↗</span>
      </div>
    </section>
  );
}
import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Project.css";

gsap.registerPlugin(ScrollTrigger);

type Project = {
  number: string;
  name: string;
  category: string;
  description: string;
  stack: string[];
  accent: string;
  features: string[];
  github: string;
  demo: string;
};

const projects: Project[] = [
  {
    number: "01",
    name: "Journex",
    category: "PRODUCT / WEB APPLICATION",
    description:
      "A Christian journaling platform designed to help believers document their spiritual journey.",
    stack: ["React", "Node.js", "Express", "MongoDB"],
    accent: "#9b87f5",
    features: [
      "Personal journaling",
      "Private and community entries",
      "Daily Bible verse experience",
    ],
    github: "",
    demo: "",
  },
  {
    number: "02",
    name: "ConnectFlow",
    category: "SAAS / MANAGEMENT SYSTEM",
    description:
      "A church management platform bringing people, communication and attendance into one system.",
    stack: ["React", "TypeScript", "Node.js", "MongoDB"],
    accent: "#e9a23b",
    features: [
      "People management",
      "Attendance management",
      "Organisational communication",
    ],
    github: "",
    demo: "",
  },
  {
    number: "03",
    name: "AI Research Assistant",
    category: "ARTIFICIAL INTELLIGENCE",
    description:
      "An AI-powered tool that helps users explore documents and retrieve relevant information.",
    stack: ["Python", "Streamlit", "Gemini", "RAG"],
    accent: "#55a9a0",
    features: [
      "PDF document processing",
      "Semantic retrieval",
      "Grounded AI responses",
    ],
    github: "",
    demo: "",
  },
  {
    number: "04",
    name: "Fake Job Detector",
    category: "MACHINE LEARNING",
    description:
      "A machine learning application that analyses job postings and identifies potentially fraudulent listings.",
    stack: ["Python", "Scikit-learn", "TF-IDF", "Streamlit"],
    accent: "#e47b68",
    features: [
      "Job description analysis",
      "Machine learning classification",
      "Text, PDF and image input",
    ],
    github: "",
    demo: "",
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const autoRotationRef = useRef<gsap.core.Tween | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startRotation: 0,
  });

  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const stopAutomaticRotation = () => {
    autoRotationRef.current?.pause();

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
  };

  const resumeAutomaticRotation = () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = setTimeout(() => {
      autoRotationRef.current?.play();
      setIsPaused(false);
    }, 2500);
  };

  const rotateTo = (index: number) => {
    stopAutomaticRotation();
    setIsPaused(true);

    const targetRotation = -index * (360 / projects.length);

    gsap.to(rotationRef, {
      current: targetRotation,
      duration: 0.9,
      ease: "power3.inOut",
      onUpdate: () => {
        if (orbitRef.current) {
          gsap.set(orbitRef.current, {
            rotationY: rotationRef.current,
          });
        }
      },
      onComplete: () => {
        setActiveIndex(index);
        resumeAutomaticRotation();
      },
    });
  };

  const navigate = (direction: number) => {
    const nextIndex =
      (activeIndex + direction + projects.length) % projects.length;

    rotateTo(nextIndex);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;

    dragRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startRotation: rotationRef.current,
    };

    stopAutomaticRotation();
    setIsPaused(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;

    const difference = event.clientX - dragRef.current.startX;

    if (Math.abs(difference) > 5) {
      dragRef.current.moved = true;
    }

    if (!dragRef.current.moved) return;

    rotationRef.current = dragRef.current.startRotation + difference * 0.45;

    if (orbitRef.current) {
      gsap.set(orbitRef.current, {
        rotationY: rotationRef.current,
      });
    }
  };

  const handlePointerUp = () => {
    if (!dragRef.current.active) return;

    dragRef.current.active = false;

    const nearestIndex =
      ((Math.round(-rotationRef.current / 90) % projects.length) +
        projects.length) %
      projects.length;

    setActiveIndex(nearestIndex);

    gsap.to(rotationRef, {
      current: -nearestIndex * 90,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => {
        if (orbitRef.current) {
          gsap.set(orbitRef.current, {
            rotationY: rotationRef.current,
          });
        }
      },
    });

    resumeAutomaticRotation();
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const orbit = orbitRef.current;

    if (!section || !orbit) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      gsap.from(".projects-heading > *", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
        },
      });

      gsap.from(".project-orbit-card", {
        opacity: 0,
        y: 50,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: orbit,
          start: "top 80%",
        },
      });

      if (!reducedMotion) {
        autoRotationRef.current = gsap.to(orbit, {
          rotationY: -360,
          duration: 36,
          repeat: -1,
          ease: "none",
        });
      }
    }, section);

    return () => {
      autoRotationRef.current?.kill();

      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }

      ctx.revert();
    };
  }, []);

  return (
    <section className="projects-section" ref={sectionRef}>
      <div className="projects-topbar">
        <span>04 — SELECTED WORK</span>
        <span>IDEAS INTO REALITY</span>
      </div>

      <div className="projects-heading">
        <p className="projects-eyebrow">A COLLECTION OF MY WORK</p>

        <h2>
          Things I've
          <br />
          <span>built.</span>
        </h2>

        <p className="projects-intro">
          A selection of products, experiments and intelligent systems
          I've brought to life.
        </p>
      </div>

      <div
        className="projects-orbit-stage"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClickCapture={(event) => {
          if (dragRef.current.moved) {
            event.preventDefault();
            event.stopPropagation();
            dragRef.current.moved = false;
          }
        }}
      >
        <div className="orbit-guide orbit-guide-outer" />
        <div className="orbit-guide orbit-guide-inner" />

        <div className="projects-orbit" ref={orbitRef}>
          {projects.map((project, index) => (
            <button
              type="button"
              className={`project-orbit-card project-card-${index + 1}`}
              key={project.number}
              onClick={() => {
                if (!dragRef.current.moved) {
                  stopAutomaticRotation();
                  setIsPaused(true);
                  setActiveProject(project);
                }
              }}
              style={
                {
                  "--card-accent": project.accent,
                  "--card-angle": `${index * 90}deg`,
                } as CSSProperties
              }
              aria-label={`Explore ${project.name}`}
            >
              <div className="project-card-top">
                <span>{project.category}</span>
                <span>{project.number}</span>
              </div>

              <div
                className="project-card-art"
                style={{ background: project.accent }}
              >
                <span className="project-art-number">
                  {project.number}
                </span>
                <span className="project-art-symbol">✳</span>
              </div>

              <div className="project-card-info">
                <h3>{project.name}</h3>
                <p>{project.description}</p>

                <div className="project-stack">
                  {project.stack.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
              </div>

              <div className="project-card-bottom">
                <span>EXPLORE PROJECT</span>
                <span>↗</span>
              </div>
            </button>
          ))}
        </div>

        <div className="projects-orbit-label">
          <span>ROTATING THROUGH</span>
          <strong>SELECTED WORK</strong>
        </div>

        <div className="projects-controls">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Previous project"
          >
            ←
          </button>

          <span>
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(projects.length).padStart(2, "0")}
          </span>

          <button
            type="button"
            onClick={() => navigate(1)}
            aria-label="Next project"
          >
            →
          </button>

          <button
            type="button"
            className="projects-pause"
            onClick={() => {
              if (isPaused) {
                autoRotationRef.current?.play();
                setIsPaused(false);
              } else {
                stopAutomaticRotation();
                setIsPaused(true);
              }
            }}
            aria-label={isPaused ? "Resume rotation" : "Pause rotation"}
          >
            {isPaused ? "PLAY" : "PAUSE"}
          </button>
        </div>
      </div>

      <div className="projects-bottom">
        <span>DESIGNED TO SOLVE REAL PROBLEMS.</span>
        <span>DRAG OR SWIPE TO EXPLORE ↓</span>
      </div>

      {activeProject && (
        <div
          className="project-modal-backdrop"
          onClick={() => {
            setActiveProject(null);
            resumeAutomaticRotation();
          }}
        >
          <div
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="project-modal-close"
              onClick={() => {
                setActiveProject(null);
                resumeAutomaticRotation();
              }}
              aria-label="Close project details"
            >
              ×
            </button>

            <span className="project-modal-category">
              {activeProject.category}
            </span>

            <h2 id="project-modal-title">{activeProject.name}</h2>

            <p className="project-modal-description">
              {activeProject.description}
            </p>

            <h3>KEY FEATURES</h3>

            <ul>
              {activeProject.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            <h3>TECHNOLOGIES</h3>

            <div className="project-stack project-modal-stack">
              {activeProject.stack.map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>

            <div className="project-modal-links">
              {activeProject.github && (
                <a
                  href={activeProject.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GITHUB ↗
                </a>
              )}

              {activeProject.demo && (
                <a
                  href={activeProject.demo}
                  target="_blank"
                  rel="noreferrer"
                >
                  LIVE DEMO ↗
                </a>
              )}

              {!activeProject.github && !activeProject.demo && (
                <span>PROJECT LINKS COMING SOON</span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
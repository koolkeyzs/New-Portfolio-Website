import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Project.css";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  _id: string;
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  category: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  published?: boolean;
}

interface ProjectsResponse {
  success: boolean;
  count: number;
  projects: Project[];
}

const projectAccents = [
  "#9b87f5",
  "#e9a23b",
  "#55a9a0",
  "#e47b68",
  "#6689bd",
  "#bd829e",
  "#789b72",
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

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [orbitRadius, setOrbitRadius] = useState(260);

  // Fetch published projects from the backend.
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/api/projects/public`);

        if (!response.ok) {
          throw new Error("Failed to retrieve projects.");
        }

        const data: ProjectsResponse = await response.json();

        if (!data.success) {
          throw new Error("Unable to load projects.");
        }

        setProjects(data.projects || []);
      } catch (err) {
        console.error("Fetch projects error:", err);
        setError("Unable to load projects at the moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Calculate the angle occupied by each project.
  const anglePerProject =
    projects.length > 0 ? 360 / projects.length : 0;

  // Adjust orbit radius while preserving the original radius
  // for the original four-project layout.
  useEffect(() => {
    const updateOrbitRadius = () => {
      const width = window.innerWidth;

      const cardWidth =
        width <= 600 ? 250 : 290;

      const originalRadius =
        width <= 600 ? 145 :
        width <= 900 ? 210 :
        260;

      if (projects.length <= 4) {
        setOrbitRadius(originalRadius);
        return;
      }

      const minimumRadius =
        (cardWidth + 35) /
        (2 * Math.sin(Math.PI / projects.length));

      setOrbitRadius(Math.max(originalRadius, minimumRadius));
    };

    updateOrbitRadius();

    window.addEventListener("resize", updateOrbitRadius);

    return () => {
      window.removeEventListener("resize", updateOrbitRadius);
    };
  }, [projects.length]);

  const stopAutomaticRotation = () => {
    autoRotationRef.current?.pause();

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  };

  const resumeAutomaticRotation = () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = setTimeout(() => {
      if (!activeProject) {
        autoRotationRef.current?.play();
        setIsPaused(false);
      }
    }, 2500);
  };

  const rotateTo = (index: number) => {
    if (!projects.length) return;

    stopAutomaticRotation();
    setIsPaused(true);

    const targetRotation = -index * anglePerProject;

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
    if (!projects.length) return;

    const nextIndex =
      (activeIndex + direction + projects.length) %
      projects.length;

    rotateTo(nextIndex);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (
      (event.target as HTMLElement).closest("button") ||
      (event.target as HTMLElement).closest("a")
    ) {
      return;
    }

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

    rotationRef.current =
      dragRef.current.startRotation + difference * 0.45;

    if (orbitRef.current) {
      gsap.set(orbitRef.current, {
        rotationY: rotationRef.current,
      });
    }
  };

  const handlePointerUp = () => {
    if (!dragRef.current.active) return;

    dragRef.current.active = false;

    if (!projects.length) return;

    const nearestIndex =
      ((Math.round(-rotationRef.current / anglePerProject) %
        projects.length) +
        projects.length) %
      projects.length;

    setActiveIndex(nearestIndex);

    gsap.to(rotationRef, {
      current: -nearestIndex * anglePerProject,
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

  // Animate the section and initialise automatic rotation.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const orbit = orbitRef.current;

    if (!section || !orbit || loading || error || !projects.length) {
      return;
    }

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
        autoRotationRef.current = gsap.to(rotationRef, {
          current: rotationRef.current - 360,
          duration: 36,
          repeat: -1,
          ease: "none",
          onUpdate: () => {
            if (orbitRef.current) {
              gsap.set(orbitRef.current, {
                rotationY: rotationRef.current,
              });
            }
          },
        });
      }
    }, section);

    return () => {
      autoRotationRef.current?.kill();
      autoRotationRef.current = null;

      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }

      ctx.revert();
    };
  }, [loading, error, projects.length]);

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
          {loading ? (
            <div className="project-loading">
              Loading projects...
            </div>
          ) : error ? (
            <div className="project-loading">
              {error}
            </div>
          ) : projects.length === 0 ? (
            <div className="project-loading">
              No published projects available yet.
            </div>
          ) : (
            projects.map((project, index) => {
              const number = String(index + 1).padStart(2, "0");
              const accent =
                projectAccents[index % projectAccents.length];

              return (
                <button
                  type="button"
                  className={`project-orbit-card project-card-${index + 1}`}
                  key={project._id}
                  onClick={() => {
                    if (!dragRef.current.moved) {
                      stopAutomaticRotation();
                      setIsPaused(true);
                      setActiveProject(project);
                    }
                  }}
                  style={
                    {
                      "--card-accent": accent,
                      "--card-angle": `${index * anglePerProject}deg`,
                      "--orbit-radius": `${orbitRadius}px`,
                    } as CSSProperties
                  }
                  aria-label={`Explore ${project.title}`}
                >
                  <div className="project-card-top">
                    <span>{project.category}</span>
                    <span>{number}</span>
                  </div>

                  <div
                    className="project-card-art"
                    style={{ background: accent }}
                  >
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={`${project.title} preview`}
                        className="project-card-image"
                      />
                    ) : (
                      <>
                        <span className="project-art-number">
                          {number}
                        </span>
                        <span className="project-art-symbol">
                          ✳
                        </span>
                      </>
                    )}
                  </div>

                  <div className="project-card-info">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>

                    <div className="project-stack">
                      {project.technologies.map((technology) => (
                        <span key={technology}>
                          {technology}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="project-card-bottom">
                    <span>EXPLORE PROJECT</span>
                    <span>↗</span>
                  </div>
                </button>
              );
            })
          )}
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
            disabled={!projects.length}
          >
            ←
          </button>

          <span>
            {String(projects.length ? activeIndex + 1 : 0).padStart(2, "0")} /{" "}
            {String(projects.length).padStart(2, "0")}
          </span>

          <button
            type="button"
            onClick={() => navigate(1)}
            aria-label="Next project"
            disabled={!projects.length}
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
            disabled={!projects.length}
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

            <h2 id="project-modal-title">
              {activeProject.title}
            </h2>

            <p className="project-modal-description">
              {activeProject.description}
            </p>

            <h3>TECHNOLOGIES</h3>

            <div className="project-stack project-modal-stack">
              {activeProject.technologies.map((technology) => (
                <span key={technology}>
                  {technology}
                </span>
              ))}
            </div>

            <div className="project-modal-links">
              {activeProject.githubUrl && (
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  GITHUB ↗
                </a>
              )}

              {activeProject.liveUrl && (
                <a
                  href={activeProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  LIVE DEMO ↗
                </a>
              )}

              {!activeProject.githubUrl &&
                !activeProject.liveUrl && (
                  <span>PROJECT LINKS COMING SOON</span>
                )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
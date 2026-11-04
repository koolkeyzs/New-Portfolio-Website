
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./About.css";

gsap.registerPlugin(ScrollTrigger);

const PARTICLE_COUNT = 48;

interface IProfile {
  name: string;
  title: string[];
  bio: string;
  profileImage?: string;
  location?: string;
  email: string;
  githubUrl?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
}

interface ProfileResponse {
  success: boolean;
  profile: IProfile;
}

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const [profile, setProfile] = useState<IProfile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // FETCH PROFILE FROM BACKEND
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile`
        );

        if (!response.ok) {
          throw new Error("Failed to retrieve profile.");
        }

        const data: ProfileResponse = await response.json();

        if (data.success && data.profile) {
          setProfile(data.profile);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setProfileLoaded(true);
      }
    };

    fetchProfile();
  }, []);

  // GSAP ANIMATIONS
  useLayoutEffect(() => {
    // Wait until profile fetching is complete
    if (!profileLoaded) return;

    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const intro = section.querySelector(".about-scene-intro");
      const portrait = section.querySelector(".about-scene-portrait");
      const mindset = section.querySelector(".about-scene-mindset");

      const supernova = section.querySelector(".about-supernova");
      const core = section.querySelector(".supernova-core");
      const flash = section.querySelector(".supernova-flash");

      const particles = gsap.utils.toArray<HTMLElement>(
        ".supernova-particle",
        section
      );

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // BUILD THE COMPLETE TIMELINE FIRST
      const timeline = gsap.timeline();

      // ==========================================
      // SCENE 1: INTRODUCTION
      // ==========================================

      timeline
        .from(".about-intro-label", {
          opacity: 0,
          y: 30,
          duration: 0.5,
        })
        .from(
          ".about-intro-title",
          {
            opacity: 0,
            y: 100,
            duration: 1,
          },
          "-=0.2"
        )
        .from(
          ".about-intro-copy",
          {
            opacity: 0,
            y: 40,
            duration: 0.7,
          },
          "-=0.4"
        )

        .addLabel("intro")

        .to({}, { duration: 1 })

        // INTRODUCTION EXITS
        .to(intro, {
          opacity: 0,
          y: -100,
          scale: 0.92,
          duration: 0.8,
        })

        // ==========================================
        // SCENE 2: MEET KELVIN
        // ==========================================

        .fromTo(
          portrait,
          {
            opacity: 0,
            scale: 0.85,
            y: 100,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
          },
          "-=0.2"
        )
        .from(
          ".about-photo-frame",
          {
            clipPath: "inset(35% 35% 35% 35% round 30px)",
            duration: 1.2,
          },
          "<"
        )
        .from(
          ".about-person-text",
          {
            opacity: 0,
            x: 80,
            duration: 0.9,
          },
          "-=0.5"
        )

        .addLabel("portrait")

        .to({}, { duration: 1 })

        // PORTRAIT EXITS
        .to(portrait, {
          opacity: 0,
          scale: 1.08,
          y: -80,
          duration: 0.8,
        })

        // ==========================================
        // SCENE 3: ENGINEERING MINDSET
        // ==========================================

        .fromTo(
          mindset,
          {
            opacity: 0,
            scale: 0.9,
            y: 100,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
          },
          "-=0.2"
        )
        .from(
          ".mindset-word",
          {
            opacity: 0,
            y: 80,
            stagger: 0.2,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          ".mindset-footer",
          {
            opacity: 0,
            y: 30,
            duration: 0.6,
          },
          "-=0.3"
        )

        .addLabel("mindset")

        .to({}, { duration: 1 })

        // ==========================================
        // SUPERNOVA TRANSITION
        // ==========================================

        .to(supernova, {
          opacity: 1,
          duration: 0.3,
        })
        .fromTo(
          core,
          {
            scale: 0,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
          },
          "<"
        )

        .to(core, {
          scale: 2.5,
          duration: 0.5,
          ease: "power2.in",
        })

        // SUPERNOVA EXPLODES
        .to(
          core,
          {
            scale: 65,
            duration: 1.4,
            ease: "power2.in",
          },
          ">"
        )
        .to(
          particles,
          {
            x: (index) => {
              const angle = (360 / PARTICLE_COUNT) * index;
              return Math.cos((angle * Math.PI) / 180) * 1100;
            },
            y: (index) => {
              const angle = (360 / PARTICLE_COUNT) * index;
              return Math.sin((angle * Math.PI) / 180) * 1100;
            },
            opacity: 0,
            scale: 0,
            stagger: 0.008,
            duration: 1.2,
            ease: "power2.out",
          },
          "<"
        )

        // WHITEOUT
        .to(
          flash,
          {
            opacity: 1,
            duration: 0.8,
            ease: "power2.inOut",
          },
          "-=0.5"
        )

        .to({}, { duration: 0.5 })

        .addLabel("finish");

      // ==========================================
      // SCROLLTRIGGER
      // ==========================================

      ScrollTrigger.create({
        trigger: section,
        animation: timeline,
        start: "top top",
        end: "+=420%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,

        snap: prefersReducedMotion
          ? undefined
          : {
              snapTo: "labelsDirectional",
              duration: { min: 0.4, max: 0.9 },
              delay: 0.15,
              ease: "power2.inOut",
            },
      });

      // ==========================================
      // BACKGROUND ORB MOVEMENT
      // ==========================================

      gsap.to(".about-background-orb", {
        rotation: 180,
        scale: 1.4,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=420%",
          scrub: 2,
        },
      });

      // ==========================================
      // DECORATIVE LINE MOVEMENT
      // ==========================================

      gsap.to(".about-background-line", {
        x: -250,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=420%",
          scrub: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [profileLoaded]);

  return (
    <section className="about-section" id="about" ref={sectionRef}>
      <div className="about-background-orb" />
      <div className="about-background-line" />

      {/* SCENE 1: INTRODUCTION */}
      <div className="about-scene about-scene-intro">
        <div className="about-intro-content">
          <span className="about-intro-label">
            <span className="about-label-dot" />
            BEHIND THE CODE
          </span>

          <h2 className="about-intro-title">
            Every great system
            <br />
            starts with a <span className="gradient-text">curious mind.</span>
          </h2>

          <p className="about-intro-copy">
            {profile?.bio ||
              "I'm Kelvin, a Software Developer focused on backend engineering and artificial intelligence. I enjoy exploring how technology works and turning ideas into practical digital solutions."}
          </p>

          <span className="about-scroll-hint">
            KEEP SCROLLING TO MEET ME <span>↓</span>
          </span>
        </div>
      </div>

      {/* SCENE 2: MEET KELVIN */}
      <div className="about-scene about-scene-portrait">
        <div className="about-portrait-container">
          <div className="about-photo-area">
            <div className="about-photo-frame">
              <img
                src={profile?.profileImage || "/kelvin.jpeg"}
                alt={`Portrait of ${profile?.name || "Kelvin"}`}
                className="about-photo"
              />
            </div>

            <span className="photo-coordinate photo-coordinate-top">
              {profile?.name?.toUpperCase() || "KELVIN"} / 001
            </span>

            <span className="photo-coordinate photo-coordinate-bottom">
              {profile?.title?.length
                ? profile.title.join(" | ").toUpperCase()
                : "SOFTWARE DEVELOPER"}
            </span>
          </div>

          <div className="about-person-text">
            <span className="about-intro-label">
              THE PERSON BEHIND THE CODE
            </span>

            <h2>
              Hello,
              <br />
              I'm{" "}
              <span className="gradient-text">
                {profile?.name || "Kelvin"}.
              </span>
            </h2>

            <p>
              I'm driven by curiosity, creativity and the desire to
              build things that matter.
            </p>

            <p>
              My journey in technology is about more than writing
              code. It's about understanding problems, creating
              solutions and continuously becoming better at what I do.
            </p>

            <div className="about-focus-tags">
              <span>Backend Engineering</span>
              <span>Artificial Intelligence</span>
              <span>Software Development</span>
            </div>
          </div>
        </div>
      </div>

      {/* SCENE 3: ENGINEERING MINDSET */}
      <div className="about-scene about-scene-mindset">
        <div className="mindset-content">
          <span className="about-intro-label">
            HOW I APPROACH ENGINEERING
          </span>

          <h2 className="mindset-heading">
            <span className="mindset-word">Understand.</span>
            <span className="mindset-word gradient-text">Create.</span>
            <span className="mindset-word">Improve.</span>
          </h2>

          <p className="mindset-footer">
            Think deeply. Build intentionally. Never stop learning.
          </p>
        </div>

        <div className="mindset-index">01 — 03</div>
      </div>

      {/* SUPERNOVA TRANSITION */}
      <div className="about-supernova">
        <div className="supernova-core" />

        <div className="supernova-particles">
          {Array.from({ length: PARTICLE_COUNT }).map((_, index) => (
            <span
              className="supernova-particle"
              key={index}
              style={
                {
                  "--angle": `${(360 / PARTICLE_COUNT) * index}deg`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <div className="supernova-flash" />
      </div>

      <div className="about-progress">
        <span>THE STORY</span>
        <span>SCROLL TO EXPLORE ↓</span>
      </div>
    </section>
  );
};

export default About;

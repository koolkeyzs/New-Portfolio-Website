import { useEffect, useRef } from "react";
import type { MouseEvent } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Smooth scrolling with Lenis
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: !reducedMotion,
      autoRaf: true,
    });

    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      // Hero entrance animation
      const intro = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      intro
        .from(".hero-label", {
          opacity: 0,
          y: 25,
          duration: 0.8,
        })
        .from(
          ".hero-title-line",
          {
            opacity: 0,
            y: 100,
            rotateX: -25,
            duration: 1.1,
            stagger: 0.18,
          },
          "-=0.3"
        )
        .from(
          ".hero-description",
          {
            opacity: 0,
            y: 30,
            duration: 0.9,
          },
          "-=0.5"
        )
        .from(
          ".hero-actions",
          {
            opacity: 0,
            y: 25,
            duration: 0.8,
          },
          "-=0.5"
        )
        .from(
          ".hero-float-card",
          {
            opacity: 0,
            scale: 0.8,
            y: 30,
            stagger: 0.2,
            duration: 0.9,
          },
          "-=0.8"
        );

      // Continuous floating movement
      gsap.to(".orb-one", {
        x: 45,
        y: -35,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".orb-two", {
        x: -35,
        y: 45,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".orbit-ring", {
        rotation: 360,
        duration: 35,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".orbit-ring-inner", {
        rotation: -360,
        duration: 25,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".hero-float-card", {
        y: -12,
        duration: 3,
        stagger: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Scroll-driven hero movement
      gsap.to(".hero-content", {
        y: -100,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".hero-visual", {
        scale: 1.2,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, heroRef);

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  // Cursor-reactive background
  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (!glowRef.current) return;

    const { clientX, clientY } = event;

    gsap.to(glowRef.current, {
      x: clientX,
      y: clientY,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  return (
    <section
      ref={heroRef}
      className="hero"
      onMouseMove={handleMouseMove}
    >
      {/* Background layers */}
      <div className="hero-grid" />
      <div className="hero-noise" />

      <div className="hero-glow" ref={glowRef} />

      <div className="hero-orb orb-one" />
      <div className="hero-orb orb-two" />

      {/* Animated visual composition */}
      <div className="hero-visual">
        <div className="orbit-ring">
          <span className="orbit-dot dot-one" />
          <span className="orbit-dot dot-two" />
        </div>

        <div className="orbit-ring orbit-ring-inner">
          <span className="orbit-dot dot-three" />
        </div>

        <div className="visual-core">
          <span className="core-symbol">&lt;/&gt;</span>
        </div>

        <div className="hero-float-card card-top">
          <span className="card-indicator" />
          <span>BACKEND SYSTEMS</span>
        </div>

        <div className="hero-float-card card-bottom">
          <span className="card-indicator purple" />
          <span>ARTIFICIAL INTELLIGENCE</span>
        </div>
      </div>

      {/* Main content */}
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-label">
            <span className="status-dot" />
            SOFTWARE ENGINEER & BUILDER
          </div>

          <h1 className="hero-title">
            <span className="hero-title-line">Building the</span>

            <span className="hero-title-line gradient-text">
              digital future.
            </span>

            <span className="hero-title-line">
              One system at a time.
            </span>
          </h1>

          <p className="hero-description">
            I'm Kelvin, a Software Developer specialising in backend
            engineering and AI. I build digital products, scalable
            systems and intelligent solutions that solve real-world
            problems.
          </p>

          <div className="hero-actions">
            <a href="#projects" className="hero-button">
              Explore my work
              <span>↗</span>
            </a>

            <a href="#contact" className="hero-secondary">
              Let's connect <span>→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom information */}
      <div className="hero-bottom">
        <span>BASED IN NIGERIA</span>

        <div className="scroll-indicator">
          <span>SCROLL TO EXPLORE</span>
          <div className="scroll-line">
            <span />
          </div>
        </div>

        <span>BACKEND · AI · SOFTWARE</span>
      </div>
    </section>
  );
};

export default Hero;
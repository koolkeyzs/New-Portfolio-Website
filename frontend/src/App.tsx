
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

import Hero from "./sections/Hero";
import About from "./sections/About";
import TechStack from "./sections/TechStack";
import Projects from "./sections/Project";
import Contact from "./sections/Contact";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import AdminDashboard from "./Pages/AdminDashboard";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import './styles/IntroLoader.css'

function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  const loaderRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = loaderRef.current;
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    const scene = sceneRef.current;

    if (!loader || !cursor || !cursorDot || !scene) return;

    // Intro animation
    const introTimeline = gsap.timeline();

    introTimeline
      .fromTo(
        ".loader-kicker",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 }
      )
      .fromTo(
        ".loader-logo",
        { opacity: 0, scale: 0.3, rotation: -25 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1,
          ease: "elastic.out(1, 0.5)",
        },
        "-=0.25"
      )
      .fromTo(
        ".loader-title span",
        { opacity: 0, y: 90, rotationX: -80 },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          stagger: 0.045,
          duration: 0.85,
          ease: "back.out(1.7)",
        },
        "-=0.45"
      )
      .fromTo(
        ".loader-progress-area",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.2"
      )
      .fromTo(
        ".loader-floating-tag",
        { opacity: 0, scale: 0.5, y: 25 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.7,
          ease: "back.out(1.8)",
        },
        "-=0.6"
      );

    // Continuous floating animations
    gsap.to(".loader-core", {
      y: -13,
      duration: 1.3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".loader-orbit", {
      rotation: 360,
      duration: 12,
      repeat: -1,
      ease: "none",
    });

    gsap.to(".loader-orbit-inner", {
      rotation: -360,
      duration: 8,
      repeat: -1,
      ease: "none",
    });

    gsap.to(".loader-particle", {
      x: "random(-35, 35)",
      y: "random(-35, 35)",
      opacity: "random(0.2, 0.9)",
      scale: "random(0.7, 1.5)",
      duration: "random(1.5, 3.5)",
      repeat: -1,
      yoyo: true,
      stagger: {
        each: 0.08,
        from: "random",
      },
      ease: "sine.inOut",
    });

    gsap.to(".loader-floating-tag", {
      y: "-=9",
      duration: 1.8,
      stagger: 0.3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".loader-glow", {
      scale: 1.25,
      opacity: 0.75,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Custom cursor movement
    const cursorX = gsap.quickTo(cursor, "x", {
      duration: 0.25,
      ease: "power3.out",
    });

    const cursorY = gsap.quickTo(cursor, "y", {
      duration: 0.25,
      ease: "power3.out",
    });

    const dotX = gsap.quickTo(cursorDot, "x", {
      duration: 0.08,
      ease: "power2.out",
    });

    const dotY = gsap.quickTo(cursorDot, "y", {
      duration: 0.08,
      ease: "power2.out",
    });

    const sceneX = gsap.quickTo(scene, "x", {
      duration: 0.7,
      ease: "power3.out",
    });

    const sceneY = gsap.quickTo(scene, "y", {
      duration: 0.7,
      ease: "power3.out",
    });

    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX;
      const y = event.clientY;

      cursorX(x);
      cursorY(y);

      dotX(x);
      dotY(y);

      sceneX((x - window.innerWidth / 2) * 0.018);
      sceneY((y - window.innerHeight / 2) * 0.018);

      gsap.to(cursor, {
        opacity: 1,
        duration: 0.2,
        overwrite: true,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Progress counter
    let currentProgress = 0;
    let exitTimeout: number | undefined;

    const progressInterval = window.setInterval(() => {
      currentProgress = Math.min(currentProgress + 1, 100);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        window.clearInterval(progressInterval);

        exitTimeout = window.setTimeout(() => {
          gsap.to(loader, {
            yPercent: -110,
            duration: 0.9,
            ease: "power4.inOut",
            onComplete,
          });
        }, 450);
      }
    }, 28);

    return () => {
      window.clearInterval(progressInterval);

      if (exitTimeout) {
        window.clearTimeout(exitTimeout);
      }

      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);

      introTimeline.kill();

      gsap.killTweensOf([
        ".loader-core",
        ".loader-orbit",
        ".loader-orbit-inner",
        ".loader-particle",
        ".loader-floating-tag",
        ".loader-glow",
        loader,
        cursor,
        cursorDot,
        scene,
      ]);
    };
  }, [onComplete]);

  const title = "HELLO, WORLD.";

  return (
    <div className="intro-loader" ref={loaderRef}>
      <div className="loader-background-grid" />
      <div className="loader-glow" />

      <div className="loader-particles">
        {Array.from({ length: 28 }).map((_, index) => (
          <span
            key={index}
            className="loader-particle"
            style={{
              left: `${(index * 37) % 100}%`,
              top: `${(index * 61) % 100}%`,
            }}
          />
        ))}
      </div>

      <div className="loader-cursor" ref={cursorRef}>
        <span />
      </div>

      <div className="loader-cursor-dot" ref={cursorDotRef} />

      <div className="loader-scene" ref={sceneRef}>
        <div className="loader-top-bar">
          <span className="loader-kicker">
            <span className="loader-status-dot" />
            PERSONAL PORTFOLIO
          </span>

          <span className="loader-version">EST. 2026 — K.</span>
        </div>

        <div className="loader-center">
          <div className="loader-floating-tag tag-backend">
            <span className="tag-icon">{"</>"}</span>
            BACKEND ENGINEER
          </div>

          <div className="loader-floating-tag tag-ai">
            <span className="tag-icon">✳</span>
            AI / ML
          </div>

          <div className="loader-floating-tag tag-build">
            <span className="tag-icon">✦</span>
            BUILDING THE FUTURE
          </div>

          <div className="loader-orbit-container">
            <div className="loader-orbit">
              <span className="orbit-point orbit-point-one" />
              <span className="orbit-point orbit-point-two" />
            </div>

            <div className="loader-orbit-inner">
              <span className="orbit-point-inner" />
            </div>

            <div className="loader-core">
              <div className="loader-logo">
                K<span>.</span>
              </div>
            </div>
          </div>

          <div className="loader-title">
            {title.split("").map((letter, index) => (
              <span key={index} className={letter === " " ? "title-space" : ""}>
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
          </div>

          <p className="loader-subtitle">
            ENGINEERING IDEAS INTO REALITY.
          </p>
        </div>

        <div className="loader-progress-area">
          <div className="loader-progress-info">
            <span className="loader-progress-label">
              {progress < 30
                ? "INITIALIZING EXPERIENCE"
                : progress < 65
                  ? "LOADING THE GOOD STUFF"
                  : progress < 100
                    ? "POLISHING THE DETAILS"
                    : "READY TO EXPLORE"}
            </span>

            <span className="loader-percentage">
              {String(progress).padStart(2, "0")}
              <span>%</span>
            </span>
          </div>

          <div className="loader-progress-track">
            <div
              className="loader-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="loader-bottom">
            <span>DESIGNED TO BUILD. BUILT TO CREATE.</span>
            <span>WELCOME IN <span className="loader-arrow">↗</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [showLoader, setShowLoader] = useState(
    () => sessionStorage.getItem("portfolio-intro-seen") !== "true"
  );

  const finishLoading = useCallback(() => {
    sessionStorage.setItem("portfolio-intro-seen", "true");
    setShowLoader(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showLoader ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showLoader]);

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <Contact />
      <Footer />

      {showLoader && <IntroLoader onComplete={finishLoading} />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

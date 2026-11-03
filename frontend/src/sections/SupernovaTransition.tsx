import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./SupernovaTransition.css";

gsap.registerPlugin(ScrollTrigger);

export default function SupernovaTransition() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const core = section.querySelector(".supernova-core");
      const flash = section.querySelector(".supernova-flash");
      const particles = gsap.utils.toArray(".supernova-particle");

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=120%",
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .fromTo(
          core,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.2,
            ease: "power2.out",
          }
        )
        .to(
          core,
          {
            scale: 45,
            duration: 0.8,
            ease: "power2.in",
          },
          "explode"
        )
        .to(
          particles,
          {
            opacity: 0,
            scale: 0,
            stagger: 0.01,
            duration: 0.5,
          },
          "explode"
        )
        .to(
          flash,
          {
            opacity: 1,
            duration: 0.15,
          },
          "explode+=0.15"
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="supernova-section" ref={sectionRef}>
      <div className="supernova-core" />

      <div className="supernova-particles">
        {Array.from({ length: 32 }).map((_, index) => (
          <span
            className="supernova-particle"
            key={index}
            style={
              {
                "--angle": `${(360 / 32) * index}deg`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="supernova-flash" />
    </section>
  );
}
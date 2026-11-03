import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Footer.css";

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  {
    name: "Instagram",
    handle: "@codexkev",
    url: "https://www.instagram.com/codexkev/",
  },
  {
    name: "LinkedIn",
    handle: "Connect professionally",
    url: "https://www.linkedin.com/in/kelvin-osa-izeko-686ab930a/",
  },
  {
    name: "GitHub",
    handle: "@koolkeyz",
    url: "https://github.com/koolkeyzs",
  },
  {
    name: "Email",
    handle: "kosaizeko@gmail.com",
    url: "mailto:kosaizeko@gmail.com",
  },
  {
    name: "WhatsApp",
    handle: "07079910073",
    url: "https://wa.me/2347079910073",
  },
];

const navigationLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Tech Stack", href: "#tech-stack" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      timeline
        .from(".footer-eyebrow", {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        })
        .from(
          ".footer-heading-line",
          {
            yPercent: 110,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power4.out",
          },
          "-=0.2"
        )
        .from(
          ".footer-description",
          {
            y: 25,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.4"
        )
        .from(
          ".footer-social-item",
          {
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .from(
          ".footer-navigation",
          {
            y: 25,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.35"
        )
        .from(
          ".footer-bottom",
          {
            opacity: 0,
            y: 15,
            duration: 0.6,
          },
          "-=0.2"
        );

      gsap.from(".footer-moving-line", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.5,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: ".footer-moving-line",
          start: "top 95%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.to(".footer-decoration", {
        y: -35,
        ease: "none",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    event.preventDefault();

    const target = document.querySelector(href);

    target?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <footer className="site-footer" ref={footerRef}>
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-main">
            <span className="footer-eyebrow">
              <span className="footer-eyebrow-dot" />
              THANK YOU FOR VISITING
            </span>

            <h2 className="footer-heading" ref={headingRef}>
              <span className="footer-heading-mask">
                <span className="footer-heading-line">
                  UNTIL THE
                </span>
              </span>

              <span className="footer-heading-mask">
                <span className="footer-heading-line footer-heading-accent">
                  NEXT BIG IDEA.
                </span>
              </span>
            </h2>

            <p className="footer-description">
              Building meaningful digital experiences through software
              development, backend engineering and artificial intelligence.
              Always curious. Always building.
            </p>
          </div>

          <div className="footer-connect">
            <span className="footer-section-label">
              FIND ME AROUND THE WEB
            </span>

            <div className="footer-social-list">
              {socialLinks.map((social, index) => (
                <a
                  href={social.url}
                  key={social.name}
                  target={
                    social.name === "Email" ? undefined : "_blank"
                  }
                  rel={
                    social.name === "Email"
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="footer-social-item"
                >
                  <span className="footer-social-index">
                    0{index + 1}
                  </span>

                  <span className="footer-social-info">
                    <strong>{social.name}</strong>
                    <small>{social.handle}</small>
                  </span>

                  <span className="footer-social-arrow">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-middle">
          <div className="footer-brand">
            <span className="footer-brand-mark">K.</span>

            <div>
              <strong>Kelvin Osa-Izeko</strong>
              <span>Software Developer | Backend & AI Engineer</span>
            </div>
          </div>

          <nav className="footer-navigation" aria-label="Footer navigation">
            <span className="footer-section-label">EXPLORE</span>

            <div className="footer-nav-links">
              {navigationLinks.map((link) => (
                <a
                  href={link.href}
                  key={link.name}
                  onClick={(event) =>
                    handleNavigation(event, link.href)
                  }
                >
                  {link.name}
                </a>
              ))}
            </div>
          </nav>

          <button
            className="footer-back-top"
            type="button"
            onClick={handleBackToTop}
            aria-label="Back to top"
          >
            <span>BACK TO TOP</span>
            <span className="footer-back-top-arrow">↑</span>
          </button>
        </div>

        <div className="footer-moving-line">
          <span />
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Kelvin Osa-Izeko.</span>

          <span>BUILT WITH INTENTION.</span>

          <span className="footer-location">BASED IN NIGERIA</span>
        </div>

        <div className="footer-decoration" aria-hidden="true">
          K
        </div>
      </div>
    </footer>
  );
};

export default Footer;
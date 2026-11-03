import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

import {
  SiGithub,
  SiInstagram,
  SiWhatsapp,
} from "react-icons/si";

import { FaLinkedin } from "react-icons/fa";
import "./Navbar.css";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/koolkeyz",
    icon: <SiGithub />,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/kelvin-osa-izeko-686ab930a/",
    icon : <FaLinkedin/>
    
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/codexkev/",
    icon: <SiInstagram />,
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/2347079910073",
    icon: <SiWhatsapp />,
  },
];
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <a href="#home" className="navbar-logo" onClick={closeMenu}>
        K<span>.</span>
      </a>

      <nav className="navbar-desktop">
        {navLinks.map((link, index) => (
          <a
            href={link.href}
            key={link.name}
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            {link.name}
          </a>
        ))}
      </nav>

      <div className="navbar-socials">
        {socialLinks.map((social) => (
          <a
            href={social.href}
            key={social.name}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            title={social.name}
          >
            {social.icon}
          </a>
        ))}
      </div>

      <button
        className="navbar-menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X /> : <Menu />}
      </button>

      <div className={`mobile-menu ${menuOpen ? "mobile-menu-open" : ""}`}>
        <div className="mobile-menu-top">
          <span>MENU<span className="navbar-dot">.</span></span>
          <button onClick={closeMenu} aria-label="Close menu">
            <X />
          </button>
        </div>

        <nav className="mobile-menu-links">
          {navLinks.map((link, index) => (
            <a
              href={link.href}
              key={link.name}
              onClick={closeMenu}
              style={{ transitionDelay: menuOpen ? `${index * 0.09}s` : "0s" }}
            >
              <span className="mobile-link-number">
                0{index + 1}
              </span>
              <span>{link.name}</span>
              <ArrowUpRight className="mobile-link-arrow" />
            </a>
          ))}
        </nav>

        <div className="mobile-menu-bottom">
          <span>CONNECT WITH ME</span>

          <div className="mobile-socials">
            {socialLinks.map((social) => (
              <a
                href={social.href}
                key={social.name}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>

          <p>© {new Date().getFullYear()} Kelvin. All rights reserved.</p>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
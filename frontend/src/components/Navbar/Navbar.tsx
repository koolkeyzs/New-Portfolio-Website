
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  ArrowUpRight,
  FileText,
  LockKeyhole,
} from "lucide-react";

import {
  SiGithub,
  SiInstagram,
  SiWhatsapp,
} from "react-icons/si";

import { FaLinkedin } from "react-icons/fa";
import "./Navbar.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

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
    icon: <FaLinkedin />,
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

interface ProfileResponse {
  profile?: {
    resumeUrl?: string;
  };
  resumeUrl?: string;
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Control body scrolling when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close mobile menu with Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Fetch resume URL and check admin authentication
  useEffect(() => {
    const checkNavbarData = async () => {
      try {
        const profileResponse = await fetch(`${API_URL}/api/profile`);

        if (profileResponse.ok) {
          const data: ProfileResponse = await profileResponse.json();
          const profile = data.profile || data;

          setResumeUrl(profile.resumeUrl || "");
        }
      } catch (error) {
        console.error("Could not load resume URL:", error);
      }

      try {
        const authResponse = await fetch(`${API_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        setIsAdmin(authResponse.ok);
      } catch (error) {
        setIsAdmin(false);
        console.error("Could not verify admin session:", error);
      }
    };

    checkNavbarData();
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleResumeClick = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (!resumeUrl) {
      event.preventDefault();
      alert("Resume is currently unavailable. Please check back later.");
    }
  };

  return (
    <header className="navbar">
      {/* Logo */}
      <a href="#home" className="navbar-logo" onClick={closeMenu}>
        K<span>.</span>
      </a>

      {/* Desktop navigation */}
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

      {/* Social links */}
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

      {/* Desktop Resume and Admin buttons */}
      <div className="navbar-actions">
        <a
          href={resumeUrl || "#"}
          className="navbar-resume"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleResumeClick}
        >
          <FileText size={16} />
          <span>Resume</span>
        </a>

        {isAdmin && (
          <a href="/admin" className="navbar-admin">
            <LockKeyhole size={16} />
            <span>Admin</span>
          </a>
        )}
      </div>

      {/* Mobile menu toggle */}
      <button
        className="navbar-menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X /> : <Menu />}
      </button>

      {/* Mobile navigation */}
      <div className={`mobile-menu ${menuOpen ? "mobile-menu-open" : ""}`}>
        <div className="mobile-menu-top">
          <span>
            MENU<span className="navbar-dot">.</span>
          </span>

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
              style={{
                transitionDelay: menuOpen
                  ? `${index * 0.09}s`
                  : "0s",
              }}
            >
              <span className="mobile-link-number">
                0{index + 1}
              </span>

              <span>{link.name}</span>

              <ArrowUpRight className="mobile-link-arrow" />
            </a>
          ))}
        </nav>

        {/* Mobile Resume and Admin buttons */}
        <div className="mobile-menu-actions">
          <a
            href={resumeUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => {
              handleResumeClick(event);
              closeMenu();
            }}
            className="navbar-resume"
          >
            <FileText size={17} />
            View Resume
          </a>

          {isAdmin && (
            <a
              href="/admin"
              onClick={closeMenu}
              className="navbar-admin"
            >
              <LockKeyhole size={17} />
              Admin Dashboard
            </a>
          )}
        </div>

        {/* Mobile social links and footer */}
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

          <p>
            © {new Date().getFullYear()} Kelvin. All rights reserved.
          </p>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

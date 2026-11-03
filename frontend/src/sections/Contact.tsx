import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Contact.css";

gsap.registerPlugin(ScrollTrigger);

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialForm: ContactForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const WHATSAPP_NUMBER = "2347079910073";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hello, I'm interested in discussing a business opportunity."
)}`;

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<ContactForm>(initialForm);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const introTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      introTimeline
        .from(".contact-eyebrow", {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        })
        .from(
          ".contact-heading-line",
          {
            yPercent: 110,
            opacity: 0,
            duration: 1,
            stagger: 0.16,
            ease: "power4.out",
          },
          "-=0.25"
        )
        .from(
          ".contact-intro",
          {
            y: 25,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.45"
        );

      gsap.from(visualRef.current, {
        scale: 0.75,
        opacity: 0,
        rotate: -12,
        duration: 1.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: visualRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".contact-right", {
        x: 65,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-right",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".contact-availability", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        scrollTrigger: {
          trigger: ".contact-availability",
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });

      const closingTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: closingRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      closingTimeline
        .from(".contact-closing-label", {
          opacity: 0,
          y: 20,
          duration: 0.6,
        })
        .from(
          ".contact-closing-word",
          {
            yPercent: 110,
            opacity: 0,
            duration: 1,
            stagger: 0.18,
            ease: "power4.out",
          },
          "-=0.2"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (status !== "idle") {
      setStatus("idle");
      setFeedback("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus("sending");
    setFeedback("");

    try {
      const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

      if (!apiUrl) {
        throw new Error("The backend API URL is not configured.");
      }

      const response = await fetch(`${apiUrl}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "Your message could not be sent. Please try again."
        );
      }

      setStatus("success");
      setFeedback(
        "Thank you for reaching out. Your message has been received!"
      );
      setForm(initialForm);
      formRef.current?.reset();
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <section className="contact-section" id="contact" ref={sectionRef}>
      <div className="contact-container">
        <div className="contact-top">
          <div className="contact-left">
            <div className="contact-heading" ref={headingRef}>
              <span className="contact-eyebrow">
                <span className="contact-eyebrow-dot" />
                BUSINESS & PROFESSIONAL ENQUIRIES
              </span>

              <h2>
                <span className="contact-heading-mask">
                  <span className="contact-heading-line">
                    Have a project
                  </span>
                </span>

                <span className="contact-heading-mask">
                  <span className="contact-heading-line contact-heading-accent">
                    in mind?
                  </span>
                </span>

                <span className="contact-heading-mask">
                  <span className="contact-heading-line">
                    Let's talk.
                  </span>
                </span>
              </h2>

              <p className="contact-intro">
                Looking to build a digital product, develop a business
                solution, or explore a technical partnership? Let's discuss
                how we can bring your ideas to life.
              </p>
            </div>

            <div className="connection-visual" ref={visualRef}>
              <div className="connection-orbit connection-orbit-one">
                <span className="orbit-dot orbit-dot-one" />
              </div>

              <div className="connection-orbit connection-orbit-two">
                <span className="orbit-dot orbit-dot-two" />
              </div>

              <div className="connection-orbit connection-orbit-three">
                <span className="orbit-dot orbit-dot-three" />
              </div>

              <div className="connection-core">
                <span className="connection-core-small">LET'S</span>
                <span className="connection-core-large">BUILD</span>
                <span className="connection-core-large">SOMETHING.</span>
              </div>

              <span className="orbit-label orbit-label-top">
                IDEAS
              </span>
              <span className="orbit-label orbit-label-bottom">
                POSSIBILITIES
              </span>
            </div>

            <div className="contact-availability">
              <span className="availability-indicator" />
              <span>Available for business enquiries and opportunities</span>
            </div>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-whatsapp"
            >
              <span className="contact-whatsapp-icon">↗</span>
              <span>
                <small>REACH ME DIRECTLY</small>
                <strong>WhatsApp · 07079910073</strong>
              </span>
            </a>
          </div>

          <div className="contact-right">
            <div className="contact-form-heading">
              <span className="contact-form-number">
                01 / START A CONVERSATION
              </span>

              <h3>Tell me about your idea.</h3>

              <p>
                Share some details about your project, business needs or
                professional enquiry.
              </p>
            </div>

            <form
              className="contact-form"
              ref={formRef}
              onSubmit={handleSubmit}
            >
              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="contact-name">YOUR NAME</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-email">EMAIL ADDRESS</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    maxLength={254}
                  />
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="contact-subject">SUBJECT</label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  placeholder="Business enquiry, project, partnership..."
                  value={form.subject}
                  onChange={handleChange}
                  maxLength={150}
                />
              </div>

              <div className="contact-field">
                <label htmlFor="contact-message">TELL ME ABOUT IT</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Describe your project, business requirements or what you'd like to discuss..."
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                  maxLength={5000}
                />
              </div>

              {feedback && (
                <div
                  className={`contact-feedback contact-feedback-${status}`}
                  role="status"
                  aria-live="polite"
                >
                  {feedback}
                </div>
              )}

              <button
                className="contact-submit"
                type="submit"
                disabled={status === "sending"}
              >
                <span>
                  {status === "sending"
                    ? "SENDING ENQUIRY..."
                    : status === "success"
                    ? "ENQUIRY RECEIVED"
                    : "SEND AN ENQUIRY"}
                </span>

                <span className="contact-submit-icon">
                  {status === "sending" ? "···" : "↗"}
                </span>
              </button>

              <p className="contact-form-note">
                Prefer WhatsApp? Use the direct contact option on the left.
              </p>
            </form>
          </div>
        </div>

        <div className="contact-closing" ref={closingRef}>
          <span className="contact-closing-label">
            LET'S CREATE SOMETHING MEANINGFUL
          </span>

          <h2>
            <span className="contact-closing-mask">
              <span className="contact-closing-word">GOOD IDEAS</span>
            </span>

            <span className="contact-closing-mask">
              <span className="contact-closing-word">DESERVE TO</span>
            </span>

            <span className="contact-closing-mask">
              <span className="contact-closing-word contact-closing-accent">
                COME TO LIFE.
              </span>
            </span>
          </h2>
        </div>
      </div>
    </section>
  );
};

export default Contact;
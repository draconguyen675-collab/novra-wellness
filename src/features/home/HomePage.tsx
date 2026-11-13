import { PACKAGES } from "@/content/packages";
import { SERVICES, type Service, type ServiceCategory } from "@/content/services";
import { SiteFooter } from "@/shared/layout/SiteFooter";
import { SiteHeader } from "@/shared/layout/SiteHeader";
import Marquee from "@/shared/motion/Marquee";
import { motionQuery, useMotionGSAP } from "@/shared/motion/preferences";
import "@/shared/styles/site.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock3,
  Leaf,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Category = ServiceCategory;
type Treatment = Service;
type BookingSelection = { name: string; price: number; minutes: number };

const images = {
  hero: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1800&q=85",
  intro:
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1100&q=85",
  manifesto:
    "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1800&q=85",
  galleryOne:
    "https://images.unsplash.com/photo-1564540583246-934409427776?auto=format&fit=crop&w=1100&q=85",
  galleryTwo:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=85",
  galleryThree:
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85",
  closing:
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1800&q=85",
};

const treatments: Treatment[] = SERVICES.slice(0, 6);

const reviews = [
  {
    quote: "An invitation to slow down, reconnect, and make room for what matters.",
    name: "A moment of quiet",
    label: "Illustrative testimonial · demo content",
  },
  {
    quote: "Every detail feels considered, from the first welcome to the final cup of tea.",
    name: "The little things",
    label: "Illustrative testimonial · demo content",
  },
  {
    quote: "A place to leave the day behind and return to yourself, at your own pace.",
    name: "A gentler rhythm",
    label: "Illustrative testimonial · demo content",
  },
];

const packages = PACKAGES.slice(0, 3).map((item) => ({
  slug: item.slug,
  name: item.name,
  subtitle: item.subtitle,
  includes: item.included.slice(0, 3),
  minutes: item.variants[0].minutes,
  price: item.variants[0].price,
}));

const journal = [
  {
    topic: "A NOTE ON SLOW LIVING",
    title: "The beauty of doing less",
    summary: "In praise of small, intentional pauses.",
    full: "Build a daily ritual that feels attainable: an unhurried walk, a few quiet breaths, or five minutes without a screen. A meaningful reset need not be extravagant.",
  },
  {
    topic: "THE ART OF REST",
    title: "A softer kind of self-care",
    summary: "Finding comfort in the everyday.",
    full: "Rest is personal. For some, it comes from silence; for others, from movement, warm water, or time with a friend. Make room for the kind of care that fits you.",
  },
  {
    topic: "RITUALS & ROUTINES",
    title: "Make room for stillness",
    summary: "A gentler beginning and ending to each day.",
    full: "Notice the transition between work and home. A small repeated cue, like dimming the lights or preparing tea, can help create a sense of closure and calm.",
  },
];

const faqs = [
  {
    q: "Can I choose more than one treatment?",
    a: "Yes. Build a personal ritual below by combining experiences. The total duration and estimated price update automatically.",
  },
  {
    q: "Do I need to create an account to book?",
    a: "No account is needed in this frontend demonstration. A production booking system would require a connected backend to confirm availability.",
  },
  {
    q: "Can I request a particular therapist?",
    a: "Therapist selection is planned for the full booking flow. This homepage currently lets you save a sample booking request locally on your device.",
  },
  {
    q: "Is payment processed on this website?",
    a: "No. This is a commercial frontend demo: no payment is taken and no appointment is transmitted to a real spa.",
  },
];

const formatMoney = (value: number) => `$${value.toLocaleString("en-US")}`;
const formatDuration = (total: number) =>
  total >= 60 ? `${Math.floor(total / 60)}h${total % 60 ? ` ${total % 60}m` : ""}` : `${total}m`;
const todayLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

function TextLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a className="nv-text-link" href={href}>
      {children}
      <ArrowUpRight size={17} strokeWidth={1.6} aria-hidden="true" />
    </a>
  );
}

function BookingModal({ selected, onClose }: { selected: BookingSelection; onClose: () => void }) {
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const [failure, setFailure] = useState("");
  useEffect(() => {
    const before = document.body.style.overflow;
    const prevFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]",
        ),
      );
      const first = focusable[0],
        last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = before;
      document.removeEventListener("keydown", onKey);
      prevFocus?.focus();
    };
  }, [onClose]);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFailure("");
    const data = new FormData(e.currentTarget);
    const request = {
      id: `NV-${Date.now()}`,
      service: selected.name,
      price: selected.price,
      minutes: selected.minutes,
      date: String(data.get("date")),
      time: String(data.get("time")),
      demo: true,
    };
    try {
      const old = JSON.parse(localStorage.getItem("novra-demo-requests") || "[]") as unknown;
      localStorage.setItem(
        "novra-demo-requests",
        JSON.stringify([...(Array.isArray(old) ? old : []), request]),
      );
      setDone(true);
    } catch {
      setFailure(
        "Your browser could not save the demo request. Please enable local storage and try again.",
      );
    }
  };
  return (
    <div
      className="nv-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="nv-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button className="nv-modal-close" onClick={onClose} aria-label="Close booking dialog">
          <X size={21} />
        </button>
        {!done ? (
          <>
            <div className="nv-eyebrow">
              A moment for you <span> / Booking preview</span>
            </div>
            <h2 id={titleId} className="nv-modal-title">
              Reserve your <em>ritual.</em>
            </h2>
            <div className="nv-selected-booking">
              <span>{selected.name}</span>
              <span>
                {formatDuration(selected.minutes)} · {formatMoney(selected.price)}
              </span>
            </div>
            <p className="nv-modal-note">
              Demo only. No appointment is confirmed. This preview saves only the chosen experience,
              date and time locally; your name and email are not stored.
            </p>
            <form className="nv-book-form" onSubmit={handleSubmit}>
              <label>
                Full name
                <input
                  ref={inputRef}
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={80}
                  placeholder="Your name"
                />
              </label>
              <label>
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={120}
                  placeholder="you@example.com"
                />
              </label>
              <div className="nv-form-grid">
                <label>
                  Preferred date
                  <input
                    name="date"
                    type="date"
                    required
                    min={todayLocal()}
                    defaultValue={todayLocal()}
                  />
                </label>
                <label>
                  Preferred time
                  <select name="time" required defaultValue="14:00">
                    <option value="09:00">09:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="16:00">16:00</option>
                  </select>
                </label>
              </div>
              {failure && (
                <p role="alert" className="nv-form-error">
                  {failure}
                </p>
              )}
              <button className="nv-button nv-button--dark nv-button--full" type="submit">
                Save demo request <ArrowUpRight size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="nv-success" role="status">
            <span className="nv-success-icon">
              <Check size={28} />
            </span>
            <div className="nv-eyebrow">Saved on this device</div>
            <h2 id={titleId} className="nv-modal-title">
              A quieter day <em>awaits.</em>
            </h2>
            <p>
              Your example experience, date and time were saved locally in this browser. No personal
              details, booking or payment were recorded.
            </p>
            <button className="nv-button nv-button--dark" onClick={onClose}>
              Continue exploring <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  const root = useRef<HTMLElement>(null);
  const [category, setCategory] = useState<"All" | Category>("All");
  const [selectedRituals, setSelectedRituals] = useState<string[]>(["aroma", "facial"]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [booking, setBooking] = useState<BookingSelection | null>(null);
  const closeBooking = () => setBooking(null);
  const ritualTreatments = treatments
    .slice(0, 3)
    .filter((item) => selectedRituals.includes(item.id));
  const ritualPrice = ritualTreatments.reduce((sum, item) => sum + item.price, 0);
  const ritualMinutes = ritualTreatments.reduce((sum, item) => sum + item.minutes, 0);
  const openTreatment = (service: Treatment) =>
    setBooking({ name: service.name, price: service.price, minutes: service.minutes });
  const bookDefault = () => openTreatment(treatments[0]);
  const moveReview = (direction: number) =>
    setReviewIndex((index) => (index + direction + reviews.length) % reviews.length);

  useMotionGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionQuery(), () => {
        gsap
          .timeline({ delay: 0.5, defaults: { ease: "power3.out" } })
          .from(".nv-hero-kicker", { y: 24, autoAlpha: 0, duration: 0.65 })
          .from(
            ".nv-hero-word",
            { yPercent: 115, rotate: 5, duration: 1.25, stagger: 0.14 },
            "-=.25",
          )
          .from(".nv-hero-sub", { y: 28, autoAlpha: 0, duration: 0.8 }, "-=.55")
          .from(".nv-hero-cta", { y: 22, autoAlpha: 0, duration: 0.65 }, "-=.45")
          .from(".nv-hero-photo", { scale: 1.18, autoAlpha: 0, duration: 1.8 }, 0);
        gsap.utils.toArray<HTMLElement>(".nv-reveal").forEach((el) =>
          gsap.from(el, {
            y: 46,
            autoAlpha: 0,
            duration: 0.95,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }),
        );
        gsap.utils.toArray<HTMLElement>(".nv-image-reveal img").forEach((img) =>
          gsap.fromTo(
            img,
            { scale: 1.09 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          ),
        );
        gsap.to(".nv-manifesto-photo", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: ".nv-manifesto",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
        // Stronger scroll-linked choreography for the asymmetric spaces gallery.
        gsap.fromTo(
          ".nv-space-large",
          { xPercent: -5, rotate: -1.4 },
          {
            xPercent: 4,
            rotate: 0,
            ease: "none",
            scrollTrigger: {
              trigger: ".nv-spaces",
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );
        gsap.fromTo(
          ".nv-space-stack",
          { yPercent: 5 },
          {
            yPercent: -6,
            ease: "none",
            scrollTrigger: {
              trigger: ".nv-spaces",
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <main className="nv-site" id="top" ref={root}>
      <a className="nv-skip" href="#story">
        Skip to content
      </a>
      <SiteHeader transparent />

      {/* 01 — THE ARRIVAL */}
      <section className="nv-hero" aria-labelledby="nv-hero-heading">
        <div className="nv-hero-photo" aria-hidden="true">
          <img src={images.hero} alt="" fetchPriority="high" />
        </div>
        <div className="nv-hero-shade" aria-hidden="true" />
        <div className="nv-hero-orbit" aria-hidden="true" />
        <div className="nv-hero-orbit nv-hero-orbit--secondary" aria-hidden="true" />
        <div className="nv-hero-grain" aria-hidden="true" />
        <div className="nv-hero-content nv-container">
          <div className="nv-hero-kicker nv-eyebrow">
            <span className="nv-line" /> SPACE TO FEEL LIKE YOURSELF AGAIN
          </div>
          <h1 id="nv-hero-heading" className="nv-hero-title">
            <span className="nv-clip">
              <span className="nv-hero-word">The art of</span>
            </span>
            <span className="nv-clip">
              <span className="nv-hero-word nv-hero-word--italic">slowing</span>
            </span>
            <span className="nv-clip">
              <span className="nv-hero-word">
                down<span className="nv-period">.</span>
              </span>
            </span>
          </h1>
          <div className="nv-hero-bottom">
            <p className="nv-hero-sub">
              A considered sanctuary for body, mind, and all the moments in between.
            </p>
            <button
              className="nv-button nv-button--light nv-hero-cta"
              type="button"
              onClick={bookDefault}
            >
              Discover your ritual <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
        <div className="nv-hero-vertical">
          NOVRA WELLNESS <span>—</span> A NEW KIND OF STILLNESS
        </div>
        <a href="#story" className="nv-scroll-cue" aria-label="Scroll to our story">
          <span>Scroll to discover</span>
          <ArrowDown size={19} />
        </a>
        <span className="nv-hero-count">01 / 08</span>
      </section>

      {/* 02 — MARQUEE */}
      <Marquee />

      {/* 03 — EDITORIAL STORY */}
      <section
        id="story"
        className="nv-story nv-section nv-container"
        aria-labelledby="nv-story-title"
      >
        <div className="nv-section-index nv-reveal">
          <span>01 / OUR PHILOSOPHY</span>
          <span>COME AS YOU ARE</span>
        </div>
        <div className="nv-story-grid">
          <div className="nv-story-copy nv-reveal">
            <div className="nv-eyebrow nv-eyebrow--dark">
              <Leaf size={16} /> THE BEAUTY OF PAUSING
            </div>
            <h2 id="nv-story-title" className="nv-display">
              Less noise.
              <br />
              <em>More feeling.</em>
            </h2>
            <p>
              In a world that rarely stops, we create space for you to simply be. Our treatments are
              thoughtful rituals — shaped by nature, guided by care, and made personal to you.
            </p>
            <TextLink href="#ritual">Our approach to wellness</TextLink>
            <div className="nv-story-aside">
              <span className="nv-aside-num">01</span>
              <span>
                BE HERE, NOW.
                <br />
                EVERY MOMENT MATTERS.
              </span>
            </div>
          </div>
          <div className="nv-story-visual nv-image-reveal nv-reveal">
            <img src={images.intro} alt="Warm, serene spa room with soft lighting" loading="lazy" />
            <div className="nv-visual-caption">
              <span>ROOM TO BREATHE</span>
              <span>EST. IN THE MOMENT</span>
            </div>
            <div className="nv-stamp" aria-hidden="true">
              <svg viewBox="0 0 120 120">
                <defs>
                  <path id="nvStampCircle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
                </defs>
                <text>
                  <textPath href="#nvStampCircle">SLOW DOWN • FEEL MORE • NOVRA • </textPath>
                </text>
              </svg>
              <span>✳</span>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — TREATMENTS */}
      <section
        id="treatments"
        className="nv-treatments nv-section"
        aria-labelledby="nv-treatments-title"
      >
        <div className="nv-container">
          <div className="nv-section-index nv-reveal">
            <span>02 / EXPERIENCES</span>
            <span>THE TREATMENT EDIT</span>
          </div>
          <div className="nv-heading-row nv-reveal">
            <div>
              <div className="nv-eyebrow nv-eyebrow--dark">MADE FOR YOUR MOMENT</div>
              <h2 id="nv-treatments-title" className="nv-display">
                Rituals worth
                <br />
                <em>returning to.</em>
              </h2>
            </div>
            <p>
              From everyday restoration to once-in-a-while indulgence. Find the experience that
              feels right today.
            </p>
          </div>
          <div className="nv-filter-row nv-reveal" aria-label="Filter treatments">
            {(["All", "Body", "Skin", "Ritual"] as const).map((filter) => (
              <button
                type="button"
                key={filter}
                onClick={() => setCategory(filter)}
                aria-pressed={category === filter}
                className={`nv-filter ${category === filter ? "nv-filter--active" : ""}`}
              >
                {filter === "All" ? "All experiences" : filter}
                <span>↗</span>
              </button>
            ))}
          </div>
          <div className="nv-treatment-grid">
            {treatments
              .filter((item) => category === "All" || item.category === category)
              .map((item, i) => (
                <article className="nv-treatment-card" key={item.id}>
                  <div className="nv-treatment-image nv-image-reveal">
                    <img src={item.image} alt={`${item.name} treatment ambiance`} loading="lazy" />
                    <span className="nv-card-tag">{item.tag}</span>
                    <a
                      className="nv-card-arrow"
                      href={`/services/${item.slug}`}
                      aria-label={`View details for ${item.name}`}
                    >
                      <ArrowUpRight size={21} />
                    </a>
                  </div>
                  <div className="nv-card-meta">
                    <span>
                      {String(i + 1).padStart(2, "0")} / {item.category}
                    </span>
                    <span>
                      <Clock3 size={13} /> {formatDuration(item.minutes)}
                    </span>
                  </div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="nv-card-bottom">
                    <span>FROM {formatMoney(item.price)}</span>
                    <button type="button" onClick={() => openTreatment(item)}>
                      Book experience <ArrowUpRight size={15} />
                    </button>
                  </div>
                </article>
              ))}
          </div>
          <div style={{ marginTop: 55, textAlign: "center" }}>
            <a href="/services" className="nv-text-link">
              Explore the full treatment collection <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* 05 — CINEMATIC MANIFESTO */}
      <section className="nv-manifesto" aria-labelledby="nv-manifesto-title">
        <div className="nv-manifesto-photo" aria-hidden="true">
          <img src={images.manifesto} alt="" loading="lazy" />
        </div>
        <div className="nv-manifesto-shade" aria-hidden="true" />
        <div className="nv-manifesto-content nv-container nv-reveal">
          <span className="nv-eyebrow">OUR MANIFESTO / 03</span>
          <h2 id="nv-manifesto-title">
            Wellness is not
            <br />a destination.
            <br />
            <em>It's a way back.</em>
          </h2>
          <p>Back to your breath. Back to your body. Back to yourself.</p>
        </div>
        <div className="nv-manifesto-footer">
          THE NOVRA WAY <span>✳</span> ALWAYS, AT YOUR OWN PACE
        </div>
      </section>

      {/* 06 — CUSTOM RITUAL BUILDER */}
      <section id="ritual" className="nv-ritual nv-section" aria-labelledby="nv-ritual-title">
        <div className="nv-container">
          <div className="nv-section-index nv-reveal">
            <span>04 / MAKE IT YOURS</span>
            <span>A PERSONALIZED MOMENT</span>
          </div>
          <div className="nv-ritual-layout">
            <div className="nv-ritual-text nv-reveal">
              <div className="nv-eyebrow nv-eyebrow--dark">THE RITUAL EDITOR</div>
              <h2 id="nv-ritual-title" className="nv-display">
                Your time.
                <br />
                <em>Your ritual.</em>
              </h2>
              <p>
                No two people need the same pause. Create a little ceremony of your own, choosing
                the treatments that speak to you.
              </p>
              <div className="nv-ritual-image nv-image-reveal">
                <img
                  src={images.galleryTwo}
                  alt="Spa skincare treatment prepared with care"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="nv-ritual-builder nv-reveal">
              <div className="nv-builder-top">
                <span>01 — SELECT EXPERIENCES</span>
                <span>CHOOSE ANY COMBINATION</span>
              </div>
              {treatments.slice(0, 3).map((item, i) => {
                const active = selectedRituals.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={active}
                    className={`nv-ritual-option ${active ? "nv-ritual-option--active" : ""}`}
                    onClick={() =>
                      setSelectedRituals((current) =>
                        active ? current.filter((id) => id !== item.id) : [...current, item.id],
                      )
                    }
                  >
                    <span className="nv-ritual-option-index">0{i + 1}</span>
                    <span className="nv-ritual-option-text">
                      <strong>{item.name}</strong>
                      <small>
                        {formatDuration(item.minutes)} · {item.category}
                      </small>
                    </span>
                    <span className="nv-ritual-option-price">{formatMoney(item.price)}</span>
                    <span className="nv-ritual-toggle">
                      {active ? <Minus size={17} /> : <Plus size={17} />}
                    </span>
                  </button>
                );
              })}
              <div className="nv-builder-total">
                <div>
                  <span>YOUR CUSTOM EXPERIENCE</span>
                  <strong>
                    {selectedRituals.length} treatments · {formatDuration(ritualMinutes)}
                  </strong>
                </div>
                <div>
                  <span>ESTIMATED TOTAL</span>
                  <strong>{formatMoney(ritualPrice)}</strong>
                </div>
              </div>
              <button
                type="button"
                className="nv-button nv-button--dark nv-button--full"
                disabled={!ritualTreatments.length}
                onClick={() =>
                  setBooking({
                    name: ritualTreatments.map((item) => item.name).join(" + "),
                    price: ritualPrice,
                    minutes: ritualMinutes,
                  })
                }
              >
                Preview my ritual <ArrowUpRight size={18} />
              </button>
              <p className="nv-builder-note">
                Prices are illustrative. Availability and bookings are simulated in this frontend
                demo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 07 — SPACES */}
      <section id="spaces" className="nv-spaces nv-section" aria-labelledby="nv-spaces-title">
        <div className="nv-container">
          <div className="nv-section-index nv-reveal">
            <span>05 / OUR SPACES</span>
            <span>DESIGNED TO FEEL DIFFERENT</span>
          </div>
          <div className="nv-heading-row nv-reveal">
            <div>
              <div className="nv-eyebrow nv-eyebrow--dark">A SENSE OF PLACE</div>
              <h2 id="nv-spaces-title" className="nv-display">
                Beautifully
                <br />
                <em>unhurried.</em>
              </h2>
            </div>
            <p>
              Soft light. Natural textures. The feeling that, for a little while, the world can
              wait.
            </p>
          </div>
          <div className="nv-spaces-grid">
            <figure className="nv-space-large nv-image-reveal nv-reveal">
              <img
                src={images.galleryOne}
                alt="Inviting spa setting with a warm and natural atmosphere"
                loading="lazy"
              />
              <figcaption>01 — A PLACE TO EXHALE</figcaption>
            </figure>
            <div className="nv-space-stack">
              <figure className="nv-image-reveal nv-reveal">
                <img
                  src={images.galleryThree}
                  alt="Calm architectural interior with natural light"
                  loading="lazy"
                />
                <figcaption>02 — SPACE TO BE</figcaption>
              </figure>
              <div className="nv-spaces-quote nv-reveal">
                <span className="nv-asterisk">✳</span>
                <p>
                  Nothing to do.
                  <br />
                  <em>Nowhere to be.</em>
                </p>
                <span>EXCEPT HERE, RIGHT NOW.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 08 — CURATED PACKAGES */}
      <section id="packages" className="nv-packages nv-section" aria-labelledby="nv-packages-title">
        <div className="nv-container">
          <div className="nv-section-index nv-reveal">
            <span>06 / CURATED MOMENTS</span>
            <span>MORE TIME FOR WHAT MATTERS</span>
          </div>
          <div className="nv-heading-row nv-reveal">
            <div>
              <div className="nv-eyebrow nv-eyebrow--dark">A LITTLE MORE TIME</div>
              <h2 id="nv-packages-title" className="nv-display">
                Made to be
                <br />
                <em>remembered.</em>
              </h2>
            </div>
            <p>
              A collection of thoughtful combinations for the days you want to stay a little longer.
            </p>
          </div>
          <div className="nv-package-grid">
            {packages.map((item, index) => (
              <article key={item.name} className="nv-package nv-reveal">
                <div className="nv-package-number">
                  0{index + 1}
                  <span>CURATED RITUAL</span>
                </div>
                <h3>{item.name}</h3>
                <p>{item.subtitle}</p>
                <ul>
                  {item.includes.map((line) => (
                    <li key={line}>
                      <Check size={14} aria-hidden="true" /> {line}
                    </li>
                  ))}
                </ul>
                <div className="nv-package-bottom">
                  <div>
                    <span>{formatDuration(item.minutes)} · FROM</span>
                    <strong>{formatMoney(item.price)}</strong>
                  </div>
                  <a
                    href={`/packages/${item.slug}`}
                    aria-label={`View package details for ${item.name}`}
                  >
                    <ArrowUpRight size={23} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 09 — TEAM / EXPERTISE INTRO */}
      <section id="people" className="nv-people nv-section" aria-labelledby="nv-people-title">
        <div className="nv-container">
          <div className="nv-section-index nv-reveal">
            <span>07 / PEOPLE & PRACTICE</span>
            <span>CARE WITH INTENTION</span>
          </div>
          <div className="nv-people-layout">
            <div className="nv-people-visual nv-image-reveal nv-reveal">
              <img src={images.galleryTwo} alt="A quiet beauty treatment space" loading="lazy" />
            </div>
            <div className="nv-people-copy nv-reveal">
              <span className="nv-eyebrow nv-eyebrow--dark">THE HUMAN TOUCH</span>
              <h2 id="nv-people-title" className="nv-display">
                Care is
                <br />
                <em>an art form.</em>
              </h2>
              <p>
                Behind every considered ritual is an approach built on listening, presence, and
                attention. This demo section is ready to showcase your own therapists and
                practitioners.
              </p>
              <div className="nv-people-values">
                <span>BODYWORK</span>
                <span>SKIN RITUALS</span>
                <span>RESTORATIVE CARE</span>
              </div>
              <TextLink href="/team">Meet our wellness guides</TextLink>
            </div>
          </div>
        </div>
      </section>

      {/* 10 — EDITORIAL JOURNAL */}
      <section id="journal" className="nv-journal nv-section" aria-labelledby="nv-journal-title">
        <div className="nv-container">
          <div className="nv-section-index nv-reveal">
            <span>08 / THE JOURNAL</span>
            <span>NOTES FROM THE SANCTUARY</span>
          </div>
          <div className="nv-heading-row nv-reveal">
            <div>
              <div className="nv-eyebrow nv-eyebrow--dark">LITTLE REFLECTIONS</div>
              <h2 id="nv-journal-title" className="nv-display">
                For the
                <br />
                <em>in-between.</em>
              </h2>
            </div>
            <p>Small reflections on the art of living and feeling a little more slowly.</p>
          </div>
          <div className="nv-journal-grid">
            {journal.map((entry, i) => (
              <article key={entry.title} className="nv-journal-item nv-reveal">
                <span className="nv-journal-label">
                  0{i + 1} / {entry.topic}
                </span>
                <h3>{entry.title}</h3>
                <p>{entry.summary}</p>
                <details>
                  <summary>
                    Read the note <Plus size={16} />
                  </summary>
                  <p>{entry.full}</p>
                </details>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 08 — WHAT MAKES IT SPECIAL */}
      <section className="nv-difference nv-section" aria-labelledby="nv-difference-title">
        <div className="nv-container">
          <div className="nv-section-index nv-reveal">
            <span>09 / THE DETAILS</span>
            <span>A MORE HUMAN KIND OF CARE</span>
          </div>
          <div className="nv-difference-layout">
            <div className="nv-reveal">
              <div className="nv-eyebrow nv-eyebrow--dark">CARE IN EVERY DETAIL</div>
              <h2 id="nv-difference-title" className="nv-display">
                The little
                <br />
                things <em>matter.</em>
              </h2>
            </div>
            <div className="nv-difference-items">
              {[
                {
                  num: "01",
                  title: "Made personal",
                  body: "A flexible experience that leaves room for what you need, not just what's on the menu.",
                },
                {
                  num: "02",
                  title: "Beautifully simple",
                  body: "Clear choices, transparent example pricing, and a booking journey without the noise.",
                },
                {
                  num: "03",
                  title: "A slower rhythm",
                  body: "An editorial, sensory digital experience designed to feel calm from the first scroll.",
                },
              ].map((item) => (
                <div className="nv-difference-item nv-reveal" key={item.num}>
                  <span>{item.num}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                  <span className="nv-difference-flower">✳</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 09 — STORIES / CAROUSEL */}
      <section className="nv-voices nv-section" aria-labelledby="nv-voices-title">
        <div className="nv-container">
          <div className="nv-section-index nv-reveal">
            <span>10 / KIND WORDS</span>
            <span>ILLUSTRATIVE CONTENT</span>
          </div>
          <div className="nv-voices-shell nv-reveal">
            <div>
              <div className="nv-eyebrow nv-eyebrow--dark">WORDS TO CARRY WITH YOU</div>
              <h2 id="nv-voices-title" className="nv-display">
                A feeling
                <br />
                <em>that stays.</em>
              </h2>
            </div>
            <div className="nv-voice-detail" aria-live="polite">
              <span className="nv-quote-mark">“</span>
              <blockquote key={reviewIndex}>{reviews[reviewIndex].quote}</blockquote>
              <div className="nv-voice-bottom">
                <div>
                  <strong>{reviews[reviewIndex].name}</strong>
                  <span>{reviews[reviewIndex].label}</span>
                </div>
                <div className="nv-slider-actions">
                  <button type="button" aria-label="Previous quote" onClick={() => moveReview(-1)}>
                    <ArrowLeft size={19} />
                  </button>
                  <span>{String(reviewIndex + 1).padStart(2, "0")} / 03</span>
                  <button type="button" aria-label="Next quote" onClick={() => moveReview(1)}>
                    <ArrowRight size={19} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10 — FAQ */}
      <section className="nv-faq nv-section" aria-labelledby="nv-faq-title">
        <div className="nv-container nv-faq-layout">
          <div className="nv-reveal">
            <div className="nv-eyebrow nv-eyebrow--dark">GOOD TO KNOW</div>
            <h2 id="nv-faq-title" className="nv-display">
              Before you
              <br />
              <em>begin.</em>
            </h2>
            <p>
              Questions are always welcome. Here are a few helpful things about this demo
              experience.
            </p>
          </div>
          <div className="nv-faq-items nv-reveal">
            {faqs.map((faq, i) => (
              <details key={faq.q}>
                <summary>
                  <span>0{i + 1}</span>
                  {faq.q}
                  <ChevronDown size={20} />
                </summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 11 — CLOSING CTA */}
      <section id="booking" className="nv-closing" aria-labelledby="nv-closing-title">
        <img src={images.closing} alt="" loading="lazy" aria-hidden="true" />
        <div className="nv-closing-shade" aria-hidden="true" />
        <div className="nv-closing-content nv-reveal">
          <span className="nv-eyebrow">LET THE WORLD WAIT</span>
          <h2 id="nv-closing-title">
            It's time for <em>you.</em>
          </h2>
          <p>A little more calm is only a moment away.</p>
          <button className="nv-button nv-button--light" type="button" onClick={bookDefault}>
            Begin your experience <ArrowUpRight size={18} />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <SiteFooter />
      {booking && <BookingModal selected={booking} onClose={closeBooking} />}
    </main>
  );
}

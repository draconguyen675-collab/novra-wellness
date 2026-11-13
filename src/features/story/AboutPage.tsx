import "@/features/story/about.css";
import ServicesShell from "@/shared/layout/SiteShell";
import { motionQuery, useMotionGSAP } from "@/shared/motion/preferences";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Check, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Example images are external demo placeholders. Replace with properly licensed LOCAL assets before resale. */
const photo = (id: string, width = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

const imagery = {
  hero: photo("photo-1600334129128-685c5582fd35", 1800),
  story: photo("photo-1540555700478-4be289fbecef", 1200),
  nature: photo("photo-1512290923902-8a9f81dc236c", 1200),
  touch: photo("photo-1544161515-4ab6ce6db874", 1200),
  spaces: photo("photo-1564540583246-934409427776", 1100),
  interior: photo("photo-1600607687920-4e2a09cf159d", 1100),
  facial: photo("photo-1570172619644-dfd03ed5d881", 1100),
  products: photo("photo-1556228578-0d85b1a4d571", 1100),
  final: photo("photo-1519823551278-64ac92734fb1", 1800),
};

type Principle = {
  number: string;
  title: string;
  eyebrow: string;
  statement: string;
  copy: string;
  image: string;
  imageAlt: string;
};

const principles: Principle[] = [
  {
    number: "01",
    title: "Mindfully made",
    eyebrow: "THE INTENTION",
    statement: "Less, but more meaningful.",
    copy: "We believe the most memorable moments come from simple things done with care: a warm welcome, an unhurried pause, and room to feel at ease.",
    image: imagery.nature,
    imageAlt: "Natural botanicals arranged as part of a relaxing wellness ritual",
  },
  {
    number: "02",
    title: "Naturally inspired",
    eyebrow: "THE MATERIALS",
    statement: "Let nature set the pace.",
    copy: "Warm textures, quiet spaces and botanical details create an atmosphere that invites you to slow down without trying too hard.",
    image: imagery.products,
    imageAlt: "Botanical skincare textures and wellness products",
  },
  {
    number: "03",
    title: "Personal by design",
    eyebrow: "THE EXPERIENCE",
    statement: "Always on your terms.",
    copy: "A meaningful ritual is never one-size-fits-all. Choose your preferred treatments, duration and pace, then shape an experience that feels right for you.",
    image: imagery.touch,
    imageAlt: "A relaxing spa treatment in a softly lit room",
  },
];

const moments = [
  {
    index: "01",
    label: "ARRIVAL",
    title: "A warmer welcome",
    copy: "We begin by listening. Tell us how you would like to feel, or simply take a moment to settle in.",
  },
  {
    index: "02",
    label: "DISCOVERY",
    title: "A ritual that fits",
    copy: "Explore the treatments, textures and little details that are meaningful to you.",
  },
  {
    index: "03",
    label: "EXPERIENCE",
    title: "Time without hurry",
    copy: "A thoughtful sequence invites you to disconnect from the noise and become present in the moment.",
  },
  {
    index: "04",
    label: "RETURN",
    title: "Take the feeling home",
    copy: "Leave with more than a memory: a reminder that time for yourself is worth making.",
  },
];

type GalleryImage = { src: string; title: string; alt: string; caption: string };
const gallery: GalleryImage[] = [
  {
    src: imagery.spaces,
    title: "Spaces to exhale",
    alt: "Warm, inviting wellness interior",
    caption: "01 / THE SPACES",
  },
  {
    src: imagery.facial,
    title: "Care in the details",
    alt: "Gentle facial treatment in a spa",
    caption: "02 / THE RITUALS",
  },
  {
    src: imagery.interior,
    title: "Light as a feeling",
    alt: "Quiet natural-toned interior with soft daylight",
    caption: "03 / THE ATMOSPHERE",
  },
  {
    src: imagery.products,
    title: "Inspired by nature",
    alt: "A carefully arranged collection of skincare products",
    caption: "04 / THE MATERIALS",
  },
];

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="na-eyebrow">
      <span aria-hidden="true" className="na-eyebrow__line" />
      {children}
    </span>
  );
}

function SectionIndex({ left, right }: { left: string; right: string }) {
  return (
    <div className="na-section-index" aria-hidden="true">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

function GalleryLightbox({
  index,
  onClose,
  onMove,
}: {
  index: number;
  onClose: () => void;
  onMove: (delta: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const activeBeforeOpen =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onMove(-1);
      if (event.key === "ArrowRight") onMove(1);
      if (event.key === "Tab") {
        // Trap focus inside the lightbox's three controls.
        const controls = Array.from(
          document.querySelectorAll<HTMLButtonElement>(".na-lightbox button"),
        );
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = priorOverflow;
      activeBeforeOpen?.focus();
    };
  }, [onClose, onMove]);

  const image = gallery[index];
  return (
    <div
      className="na-lightbox"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="na-lightbox__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="na-lightbox-title"
      >
        <div className="na-lightbox__top">
          <span>
            THE NOVRA GALLERY — {String(index + 1).padStart(2, "0")}/
            {String(gallery.length).padStart(2, "0")}
          </span>
          <button ref={closeRef} onClick={onClose} type="button" aria-label="Close gallery">
            <X size={22} />
          </button>
        </div>
        <img src={image.src} alt={image.alt} />
        <div className="na-lightbox__bottom">
          <div>
            <span>{image.caption}</span>
            <h2 id="na-lightbox-title">{image.title}</h2>
          </div>
          <div className="na-lightbox__controls">
            <button onClick={() => onMove(-1)} type="button" aria-label="Previous photo">
              <ChevronLeft size={22} />
            </button>
            <button onClick={() => onMove(1)} type="button" aria-label="Next photo">
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const root = useRef<HTMLDivElement>(null);
  const [activePrinciple, setActivePrinciple] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const moveLightbox = useCallback(
    (delta: number) =>
      setLightboxIndex((index) =>
        index === null ? null : (index + delta + gallery.length) % gallery.length,
      ),
    [],
  );
  const principle = principles[activePrinciple];

  useEffect(() => {
    const oldTitle = document.title;
    document.title = "Our Story — NOVRA Wellness House";
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const oldDescription = meta?.content;
    const element = meta ?? document.createElement("meta");
    if (!meta) {
      element.name = "description";
      document.head.append(element);
    }
    element.content =
      "Discover the inspiration behind NOVRA Wellness House: thoughtful treatments, natural spaces and personal rituals designed for a slower way of living.";
    return () => {
      document.title = oldTitle;
      if (meta) meta.content = oldDescription ?? "";
      else element.remove();
    };
  }, []);

  useMotionGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionQuery(), () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".na-hero__eyebrow", { y: 24, autoAlpha: 0, duration: 0.75 })
          .from(".na-hero__line span", { yPercent: 115, duration: 1.15, stagger: 0.13 }, "-=0.24")
          .from(".na-hero__lead", { y: 24, autoAlpha: 0, duration: 0.8 }, "-=0.6")
          .from(".na-hero__links", { y: 16, autoAlpha: 0, duration: 0.7 }, "-=0.5")
          .from(
            ".na-hero__visual",
            { clipPath: "inset(0 0 100% 0)", duration: 1.3, ease: "power3.inOut" },
            0.1,
          );

        gsap.utils.toArray<HTMLElement>(".na-reveal").forEach((element) => {
          gsap.from(element, {
            y: 44,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 92%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>(".na-parallax img").forEach((image) => {
          gsap.fromTo(
            image,
            { scale: 1.09 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: image.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.65,
              },
            },
          );
        });
        gsap.to(".na-hero__visual img", {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: ".na-hero", start: "top top", end: "bottom top", scrub: 0.8 },
        });
      });

      mm.add("(min-width: 1024px) and " + motionQuery(), () => {
        const slides = gsap.utils.toArray<HTMLElement>(".na-manifesto__phrase");
        if (slides.length !== 3) return;
        gsap.set(slides, { autoAlpha: 0 });
        gsap.set(slides[0], { autoAlpha: 1 });
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".na-manifesto",
            start: "top top",
            end: "+=180%",
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        timeline
          .to(slides[0], { autoAlpha: 0, y: -30, duration: 0.55 })
          .fromTo(slides[1], { autoAlpha: 0, y: 45 }, { autoAlpha: 1, y: 0, duration: 0.55 })
          .to(slides[1], { autoAlpha: 0, y: -30, duration: 0.55 }, "+=0.5")
          .fromTo(slides[2], { autoAlpha: 0, y: 45 }, { autoAlpha: 1, y: 0, duration: 0.55 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <ServicesShell>
      <div ref={root} className="na-about">
        {/* 01 / HERO */}
        <section className="na-hero" aria-labelledby="na-hero-title">
          <div className="na-hero__visual" aria-hidden="true">
            <img src={imagery.hero} alt="" fetchPriority="high" />
          </div>
          <div className="na-hero__shade" aria-hidden="true" />
          <div className="na-shell na-hero__content">
            <div className="na-hero__eyebrow">
              <Eyebrow>OUR WORLD / AN INVITATION TO SLOW DOWN</Eyebrow>
            </div>
            <h1 id="na-hero-title" className="na-hero__title">
              <span className="na-hero__line">
                <span>A story</span>
              </span>
              <span className="na-hero__line">
                <span>
                  about <em>slowing</em>
                </span>
              </span>
              <span className="na-hero__line">
                <span>
                  down<span className="na-gold">.</span>
                </span>
              </span>
            </h1>
            <p className="na-hero__lead">
              We create room for the moments that matter. And we believe some of the best things in
              life begin when you stop rushing.
            </p>
            <div className="na-hero__links">
              <a href="#na-story" className="na-link na-link--light">
                Discover our philosophy <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
          <div className="na-hero__bottom">
            <span>THE NOVRA WAY — EST. IN THE MOMENT</span>
            <a href="#na-story">
              SCROLL TO DISCOVER <ArrowDown size={17} />
            </a>
            <span>01 / OUR STORY</span>
          </div>
          <div className="na-hero__side" aria-hidden="true">
            COME AS YOU ARE · LEAVE A LITTLE LIGHTER
          </div>
        </section>

        {/* 02 / THE STORY */}
        <section
          id="na-story"
          className="na-story na-spacing na-shell"
          aria-labelledby="na-story-title"
        >
          <SectionIndex left="01 / THE BEGINNING" right="SOMETHING BEAUTIFUL IN SIMPLICITY" />
          <div className="na-story__layout">
            <div className="na-story__intro na-reveal">
              <Eyebrow>THE STORY BEHIND NOVRA</Eyebrow>
              <p className="na-story__tiny">
                Not another thing to do.
                <br />A little time to simply be.
              </p>
              <div className="na-story__asterisk" aria-hidden="true">
                ✳
              </div>
            </div>
            <div className="na-story__main">
              <h2 id="na-story-title" className="na-title na-reveal">
                The world moves fast.
                <br />
                <em>We choose to move</em>
                <br />
                with intention.
              </h2>
              <div className="na-story__body na-reveal">
                <p>
                  Somewhere between our busy schedules and endless to-do lists, we forget what it
                  feels like to be truly present.
                </p>
                <p>
                  NOVRA is a vision of something gentler — a thoughtfully imagined wellness house
                  where every little detail makes space for calm. An invitation to reconnect, in
                  your own time and your own way.
                </p>
                <Link className="na-link" to="/services">
                  Explore our rituals <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
          </div>
          <div className="na-story__photo na-parallax na-reveal">
            <img
              src={imagery.story}
              alt="Peaceful spa interiors and natural textures"
              loading="lazy"
            />
            <div className="na-story__photo-note">
              <span>THE BEAUTY OF THE EVERYDAY</span>
              <span>01 — THE STILLNESS</span>
            </div>
          </div>
        </section>

        {/* 03 / PINNED MANIFESTO: desktop; flowing layout on mobile/reduced-motion */}
        <section className="na-manifesto" aria-labelledby="na-manifesto-title">
          <h2 id="na-manifesto-title" className="na-visually-hidden">
            The NOVRA manifesto
          </h2>
          <div className="na-manifesto__photo" aria-hidden="true">
            <img src={imagery.final} alt="" loading="lazy" />
          </div>
          <div className="na-manifesto__veil" aria-hidden="true" />
          <div className="na-shell na-manifesto__inner">
            <div className="na-manifesto__meta">
              <span>02 / WHAT WE BELIEVE</span>
              <span>THE NOVRA MANIFESTO</span>
            </div>
            <div className="na-manifesto__phrases">
              <p className="na-manifesto__phrase">
                Make room
                <br />
                to <em>breathe.</em>
              </p>
              <p className="na-manifesto__phrase">
                Give yourself
                <br />
                <em>permission.</em>
              </p>
              <p className="na-manifesto__phrase">
                Return to
                <br />
                <em>yourself.</em>
              </p>
            </div>
            <p className="na-manifesto__aside">
              A LITTLE LESS NOISE
              <br />A LOT MORE FEELING
            </p>
          </div>
        </section>

        {/* 04 / INTERACTIVE PHILOSOPHY */}
        <section className="na-principles na-spacing" aria-labelledby="na-principles-title">
          <div className="na-shell">
            <SectionIndex left="03 / OUR PRINCIPLES" right="CARE, IN EVERY DETAIL" />
            <div className="na-section-heading na-reveal">
              <div>
                <Eyebrow>THE THINGS WE RETURN TO</Eyebrow>
                <h2 id="na-principles-title" className="na-title">
                  A little more
                  <br />
                  <em>thoughtfulness.</em>
                </h2>
              </div>
              <p>
                Not a checklist of luxury. Just a few beliefs that shape the way we think about
                every experience.
              </p>
            </div>
            <div className="na-principles__grid">
              <div
                className="na-principles__list na-reveal"
                role="group"
                aria-label="Explore our values"
              >
                {principles.map((item, index) => (
                  <button
                    type="button"
                    className={`na-principle ${activePrinciple === index ? "is-active" : ""}`}
                    key={item.number}
                    onClick={() => setActivePrinciple(index)}
                    aria-pressed={activePrinciple === index}
                    aria-controls="na-principle-panel"
                  >
                    <span className="na-principle__number">{item.number}</span>
                    <span>{item.title}</span>
                    <span className="na-principle__icon">
                      <Plus size={20} aria-hidden="true" />
                    </span>
                  </button>
                ))}
                <p className="na-principles__hint">SELECT A PRINCIPLE TO EXPLORE</p>
              </div>
              <div
                id="na-principle-panel"
                className="na-principles__preview na-reveal"
                aria-live="polite"
                key={principle.number}
              >
                <div className="na-principles__image">
                  <img src={principle.image} alt={principle.imageAlt} loading="lazy" />
                </div>
                <div className="na-principles__caption">
                  <span>
                    {principle.eyebrow} / {principle.number}
                  </span>
                  <strong>{principle.statement}</strong>
                  <p>{principle.copy}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 05 / GALLERY + ACCESSIBLE LIGHTBOX */}
        <section
          id="na-spaces"
          className="na-gallery na-spacing"
          aria-labelledby="na-gallery-title"
        >
          <div className="na-shell">
            <SectionIndex left="04 / THE ATMOSPHERE" right="PLACES MADE TO FEEL SOMETHING" />
            <div className="na-section-heading na-reveal">
              <div>
                <Eyebrow>SPACES TO SLOW DOWN</Eyebrow>
                <h2 id="na-gallery-title" className="na-title">
                  A sense of <em>place.</em>
                </h2>
              </div>
              <p>
                Light, texture, and the quiet joy of feeling completely at ease. Explore the details
                that define the experience.
              </p>
            </div>
            <div className="na-gallery__grid">
              {gallery.map((item, index) => (
                <figure
                  className={`na-gallery__item na-gallery__item--${index + 1} na-reveal`}
                  key={item.title}
                >
                  <button
                    className="na-gallery__open na-parallax"
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    aria-label={`Open gallery image: ${item.title}`}
                  >
                    <img src={item.src} alt={item.alt} loading="lazy" />
                    <span aria-hidden="true" className="na-gallery__open-icon">
                      <ArrowUpRight size={21} />
                    </span>
                  </button>
                  <figcaption>
                    <span>{item.caption}</span>
                    <strong>{item.title}</strong>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* 06 / FOUR-STEP JOURNEY */}
        <section className="na-journey na-spacing" aria-labelledby="na-journey-title">
          <div className="na-shell">
            <SectionIndex left="05 / THE EXPERIENCE" right="FOUR MOMENTS, ONE BEAUTIFUL PAUSE" />
            <div className="na-section-heading na-reveal">
              <div>
                <Eyebrow>EVERY DETAIL HAS A PURPOSE</Eyebrow>
                <h2 id="na-journey-title" className="na-title">
                  Your time, <em>your way.</em>
                </h2>
              </div>
              <p>
                No rush, no rigid rules. Just a considered journey designed around how you want to
                feel.
              </p>
            </div>
            <div className="na-journey__grid">
              {moments.map((moment) => (
                <article className="na-journey__card na-reveal" key={moment.index}>
                  <div className="na-journey__card-top">
                    <span>{moment.index}</span>
                    <span aria-hidden="true">✳</span>
                  </div>
                  <span className="na-journey__label">{moment.label}</span>
                  <h3>{moment.title}</h3>
                  <p>{moment.copy}</p>
                  <ArrowUpRight className="na-journey__arrow" size={20} aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 07 / PEOPLE — no fabricated identities or credentials */}
        <section className="na-human na-spacing" aria-labelledby="na-human-title">
          <div className="na-shell">
            <SectionIndex left="06 / THE HUMAN TOUCH" right="CARE IS A WAY OF BEING" />
            <div className="na-human__layout">
              <div className="na-human__visual na-parallax na-reveal">
                <img
                  src={imagery.touch}
                  alt="A carefully prepared massage treatment"
                  loading="lazy"
                />
                <div className="na-human__photo-mark">
                  BE PRESENT <span>✳</span> FEEL MORE
                </div>
              </div>
              <div className="na-human__content na-reveal">
                <Eyebrow>THE PEOPLE & THE PRACTICE</Eyebrow>
                <h2 id="na-human-title" className="na-title">
                  It's always
                  <br />
                  about <em>you.</em>
                </h2>
                <p>
                  The most important part of a wellness experience is how it makes you feel. Every
                  thoughtful welcome, gentle detail, and conversation is an opportunity to make
                  someone feel seen.
                </p>
                <div className="na-human__qualities">
                  <span>
                    <Check size={16} /> Listen with care
                  </span>
                  <span>
                    <Check size={16} /> Respect your preferences
                  </span>
                  <span>
                    <Check size={16} /> Leave room for quiet
                  </span>
                </div>
                <p className="na-human__note">
                  Template note: replace this section with real team profiles, qualifications and
                  photography when adapting the site for a spa business.
                </p>
                <Link to="/services" className="na-link">
                  Find your next experience <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 08 / LAST WORD / CTA */}
        <section className="na-closing" aria-labelledby="na-closing-title">
          <div className="na-closing__bg" aria-hidden="true">
            <img src={imagery.interior} alt="" loading="lazy" />
          </div>
          <div className="na-closing__shade" aria-hidden="true" />
          <div className="na-shell na-closing__content na-reveal">
            <Eyebrow>AN INVITATION, JUST FOR YOU</Eyebrow>
            <h2 id="na-closing-title">
              Come as
              <br />
              <em>you are.</em>
            </h2>
            <p>There is no perfect time to pause. There is only the moment you choose to begin.</p>
            <Link className="na-closing__cta" to="/services">
              Discover your experience <ArrowUpRight size={19} />
            </Link>
          </div>
          <div className="na-closing__caption">
            <span>AN UNHURRIED MOMENT AWAITS</span>
            <span>WITH CARE, NOVRA ✳</span>
          </div>
        </section>
      </div>
      {lightboxIndex !== null &&
        createPortal(
          <GalleryLightbox index={lightboxIndex} onClose={closeLightbox} onMove={moveLightbox} />,
          document.body,
        )}
    </ServicesShell>
  );
}

import "@/features/story/philosophy.css";
import ServicesShell from "@/shared/layout/SiteShell";
import { motionQuery, useMotionGSAP } from "@/shared/motion/preferences";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  MoveDownRight,
  Pause,
  Play,
  RotateCcw,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Image URLs are temporary development references, not bundled licensed assets.
 * For a commercial product: replace with photographs you own or may redistribute.
 */
const photo = (id: string, width = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;

const images = {
  hero: photo("photo-1600334129128-685c5582fd35", 1700),
  quiet: photo("photo-1564540583246-934409427776", 1000),
  detail: photo("photo-1512290923902-8a9f81dc236c", 900),
  space: photo("photo-1600607687920-4e2a09cf159d", 1200),
  touch: photo("photo-1544161515-4ab6ce6db874", 1200),
  nature: photo("photo-1556228578-0d85b1a4d571", 1200),
  atmosphere: photo("photo-1519823551278-64ac92734fb1", 1900),
  aftercare: photo("photo-1570172619644-dfd03ed5d881", 950),
  closing: photo("photo-1540555700478-4be289fbecef", 1900),
};

const chapters = [
  {
    number: "01",
    short: "SPACE",
    title: "Room to simply be.",
    detail:
      "A considered environment can make space for a different rhythm. Soft light, quiet corners and thoughtful details invite you to settle in without an agenda.",
    image: images.space,
    alt: "Light-filled, quiet interior with natural materials",
    detailLine: "THE BEAUTY OF LESS",
  },
  {
    number: "02",
    short: "TOUCH",
    title: "Care that listens.",
    detail:
      "We believe an excellent treatment begins with a conversation, not an assumption. Preferences, comfort and boundaries are part of the experience, never an afterthought.",
    image: images.touch,
    alt: "Hands preparing a wellness treatment with warm botanical oils",
    detailLine: "PERSONAL, NOT PRESCRIPTIVE",
  },
  {
    number: "03",
    short: "NATURE",
    title: "Inspired by the elements.",
    detail:
      "The feeling of warm water, botanical aromas and honest materials shapes our aesthetic. A natural atmosphere is a design choice, not a promise of medical outcomes.",
    image: images.nature,
    alt: "Natural skincare and botanical items arranged in soft daylight",
    detailLine: "A QUIETER KIND OF LUXURY",
  },
] as const;

const commitments = [
  {
    index: "01",
    title: "Comfort comes first",
    description:
      "Every ritual begins with your preferences. Intensity, conversation and atmosphere should always be open to adjustment.",
  },
  {
    index: "02",
    title: "Time is part of the treatment",
    description:
      "The moments before and after matter too. We design the journey so it feels considered, not hurried from one step to the next.",
  },
  {
    index: "03",
    title: "Small details, lasting impressions",
    description:
      "The texture of a towel, the light in a room, a simple cup of tea. Thoughtful hospitality lives in the little things.",
  },
  {
    index: "04",
    title: "Your experience, your choice",
    description:
      "Explore treatments in your own order and select what suits you. You should never need to choose more than you want.",
  },
] as const;

function SectionLabel({ number, children }: { number: string; children: string }) {
  return (
    <span className="np-kicker">
      <span className="np-kicker__number">{number}</span>
      <span className="np-kicker__rule" aria-hidden="true" />
      {children}
    </span>
  );
}

function SectionTop({ number, left, right }: { number: string; left: string; right: string }) {
  return (
    <div className="np-section-top" aria-hidden="true">
      <span>
        {number} / {left}
      </span>
      <span>{right}</span>
    </div>
  );
}

/** An optional, audio-free 60-second breathing demo — not health guidance. */
function QuietMinute() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const completed = elapsed >= 60;
  const started = elapsed > 0 || running;
  const phase = completed
    ? "Your moment is complete"
    : elapsed % 10 < 5
      ? "Breathe in"
      : "Breathe out";

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      setElapsed((previous) => Math.min(60, previous + 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (elapsed >= 60 && running) setRunning(false);
  }, [elapsed, running]);

  const reset = () => {
    setRunning(false);
    setElapsed(0);
  };

  return (
    <div className="np-minute" aria-label="Optional one-minute mindful pause">
      <div className="np-minute__art" data-running={running}>
        <span className="np-minute__orbit np-minute__orbit--outer" aria-hidden="true" />
        <span className="np-minute__orbit np-minute__orbit--inner" aria-hidden="true" />
        <span className="np-minute__disc" aria-hidden="true" />
        <div className="np-minute__center">
          <span className="np-minute__count" aria-label={`${60 - elapsed} seconds remaining`}>
            {String(Math.floor((60 - elapsed) / 60)).padStart(2, "0")}:
            {String((60 - elapsed) % 60).padStart(2, "0")}
          </span>
          <span className="np-minute__phase" aria-live="polite" aria-atomic="true">
            {started ? phase : "A MOMENT FOR YOU"}
          </span>
        </div>
      </div>
      <div className="np-minute__control">
        {completed ? (
          <button className="np-button np-button--light" onClick={reset} type="button">
            Begin again <RotateCcw size={16} aria-hidden="true" />
          </button>
        ) : (
          <button
            className="np-button np-button--light"
            onClick={() => setRunning((value) => !value)}
            type="button"
            aria-pressed={running}
          >
            {running ? "Pause this moment" : started ? "Continue the moment" : "Begin your minute"}
            {running ? (
              <Pause size={16} aria-hidden="true" />
            ) : (
              <Play size={16} aria-hidden="true" />
            )}
          </button>
        )}
        {started && !completed && (
          <button
            className="np-minute__restart"
            type="button"
            onClick={reset}
            aria-label="Reset this exercise"
          >
            <RotateCcw size={17} aria-hidden="true" />
          </button>
        )}
      </div>
      <p className="np-minute__hint">
        <VolumeX size={15} aria-hidden="true" /> No audio. No pressure. Stop whenever you wish.
      </p>
    </div>
  );
}

export default function PhilosophyPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [expandedCommitment, setExpandedCommitment] = useState<number | null>(0);
  const chapter = chapters[activeChapter];

  useEffect(() => {
    const originalTitle = document.title;
    document.title = "Our Philosophy | NOVRA Wellness House";
    const oldMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const oldDescription = oldMeta?.content;
    const meta = oldMeta ?? document.createElement("meta");
    if (!oldMeta) {
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Discover the philosophy behind NOVRA: intentional spaces, personal wellness experiences and small rituals that make room to slow down.";
    return () => {
      document.title = originalTitle;
      if (oldMeta) oldMeta.content = oldDescription ?? "";
      else meta.remove();
    };
  }, []);

  useMotionGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(motionQuery(), () => {
        const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
        entrance
          .from(".np-hero__overline", { y: 18, autoAlpha: 0, duration: 0.7 })
          .from(
            ".np-hero__title-line > span",
            { yPercent: 113, duration: 1.16, stagger: 0.13 },
            "-=0.3",
          )
          .from(".np-hero__description", { y: 22, autoAlpha: 0, duration: 0.8 }, "-=0.6")
          .from(".np-hero__actions", { y: 16, autoAlpha: 0, duration: 0.7 }, "-=0.55")
          .from(
            ".np-hero__photo",
            { clipPath: "inset(0 0 100% 0)", scale: 1.07, duration: 1.4, ease: "power3.inOut" },
            0.12,
          );

        gsap.utils.toArray<HTMLElement>(".np-reveal").forEach((element) => {
          gsap.from(element, {
            y: 45,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 92%",
              once: true,
            },
          });
        });

        gsap.utils.toArray<HTMLElement>(".np-image-reveal").forEach((element) => {
          gsap.from(element, {
            clipPath: "inset(10% 0 10% 0)",
            scale: 0.96,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 92%",
              once: true,
            },
          });
        });

        gsap.to(".np-interlude__image img", {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: ".np-interlude",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.7,
          },
        });
      });

      // The chapter image updates automatically as each editorial story enters view.
      // No forced scroll pinning on mobile or for reduced motion users.
      mm.add("(min-width: 1024px) and " + motionQuery(), () => {
        const cards = gsap.utils.toArray<HTMLElement>(".np-chapter");
        const observers = cards.map((card, index) =>
          ScrollTrigger.create({
            trigger: card,
            start: "top 55%",
            end: "bottom 45%",
            onEnter: () => setActiveChapter(index),
            onEnterBack: () => setActiveChapter(index),
          }),
        );
        return () => observers.forEach((observer) => observer.kill());
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <ServicesShell>
      <div className="np-philosophy" ref={rootRef}>
        {/* 01 / HERO */}
        <section className="np-hero" aria-labelledby="np-hero-title">
          <div className="np-hero__grid np-wrap">
            <div className="np-hero__copy">
              <div className="np-hero__overline">
                <SectionLabel number="00">THE NOVRA PHILOSOPHY</SectionLabel>
              </div>
              <h1 className="np-hero__title" id="np-hero-title">
                <span className="np-hero__title-line">
                  <span>The art</span>
                </span>
                <span className="np-hero__title-line">
                  <span>
                    of <em>being</em>
                  </span>
                </span>
                <span className="np-hero__title-line">
                  <span>
                    here<span className="np-dot">.</span>
                  </span>
                </span>
              </h1>
              <p className="np-hero__description">
                Because the most meaningful moments are not always the ones we fill. Sometimes, they
                are the ones we leave open.
              </p>
              <div className="np-hero__actions">
                <a href="#np-approach" className="np-text-link">
                  Explore our way <ArrowUpRight size={17} aria-hidden="true" />
                </a>
                <span className="np-hero__coordinates" aria-hidden="true">
                  A MOMENT TO RETURN TO YOURSELF
                </span>
              </div>
            </div>
            <div className="np-hero__visual">
              <div className="np-hero__photo">
                <img
                  src={images.hero}
                  alt="Quiet wellness room with soft lighting and natural materials"
                  fetchPriority="high"
                />
              </div>
              <div className="np-hero__visual-overlay" aria-hidden="true" />
              <span className="np-hero__vertical" aria-hidden="true">
                STILLNESS IS NOT A DESTINATION · IT IS A PRACTICE
              </span>
              <div className="np-hero__photo-caption">
                <span>THE FEELING / 001</span>
                <span>
                  SCROLL TO DISCOVER <ArrowDown size={15} aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>
          <div className="np-hero__bottom np-wrap">
            <span>THE PHILOSOPHY OF NOVRA</span>
            <span>INTENTION OVER EXCESS</span>
            <span>01 — 06</span>
          </div>
        </section>

        {/* 02 / INTRO */}
        <section
          className="np-intro np-section np-wrap"
          id="np-approach"
          aria-labelledby="np-intro-heading"
        >
          <SectionTop number="01" left="A DIFFERENT PACE" right="DESIGNED TO FEEL, NOT TO RUSH" />
          <div className="np-intro__grid">
            <div className="np-intro__aside np-reveal">
              <SectionLabel number="01">AN INVITATION</SectionLabel>
              <span className="np-intro__asterisk" aria-hidden="true">
                ✳
              </span>
            </div>
            <div className="np-intro__statement np-reveal">
              <h2 id="np-intro-heading">
                Wellness isn't another thing to <em>achieve.</em>
              </h2>
              <div className="np-intro__lower">
                <p>
                  It is an invitation to notice how you feel, choose what you need, and give
                  yourself permission to pause. We are drawn to the spaces between things — where
                  attention becomes care, and small moments become meaningful.
                </p>
                <Link className="np-text-link" to="/about">
                  The story behind NOVRA <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
          <div className="np-intro__image-layout">
            <figure className="np-intro__main-photo np-image-reveal">
              <img
                src={images.quiet}
                alt="Warm, thoughtfully composed spa interior"
                loading="lazy"
              />
              <figcaption>01 / SPACE FOR A SLOWER RHYTHM</figcaption>
            </figure>
            <figure className="np-intro__detail-photo np-image-reveal">
              <img
                src={images.detail}
                alt="Soft natural textures and botanical details"
                loading="lazy"
              />
              <figcaption>THE BEAUTY OF SIMPLICITY</figcaption>
            </figure>
            <div className="np-intro__photo-note" aria-hidden="true">
              LESS NOISE.
              <br />
              MORE <i>FEELING.</i>
            </div>
          </div>
        </section>

        {/* 03 / THREE CHAPTERS */}
        <section className="np-chapters np-section" aria-labelledby="np-chapters-heading">
          <div className="np-wrap">
            <SectionTop number="02" left="THE THREE ELEMENTS" right="SPACE · TOUCH · NATURE" />
            <div className="np-chapters__heading np-reveal">
              <SectionLabel number="02">THE THINGS WE VALUE</SectionLabel>
              <h2 id="np-chapters-heading">
                The quiet <em>essentials.</em>
              </h2>
              <p>Not a list of luxuries. A way of being present in every detail.</p>
            </div>
            <div className="np-chapters__grid">
              <div className="np-chapters__visual" aria-label="Selected philosophy chapter">
                <div className="np-chapters__image" key={chapter.number}>
                  <img src={chapter.image} alt={chapter.alt} loading="lazy" />
                </div>
                <div className="np-chapters__image-bottom">
                  <span>{chapter.number} / 03</span>
                  <span>{chapter.detailLine}</span>
                </div>
                <span className="np-chapters__stamp" aria-hidden="true">
                  ✳
                </span>
              </div>
              <div className="np-chapters__stories">
                {chapters.map((item, index) => (
                  <article
                    className={`np-chapter ${index === activeChapter ? "np-chapter--active" : ""}`}
                    key={item.number}
                  >
                    <span className="np-chapter__index">
                      {item.number} / {item.short}
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                    <button
                      className="np-chapter__select"
                      type="button"
                      onClick={() => setActiveChapter(index)}
                      aria-pressed={index === activeChapter}
                    >
                      {index === activeChapter ? "Now exploring" : "Explore this principle"}{" "}
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 04 / IMMERSIVE MANIFESTO */}
        <section className="np-interlude" aria-labelledby="np-interlude-heading">
          <div className="np-interlude__image" aria-hidden="true">
            <img src={images.atmosphere} alt="" loading="lazy" />
          </div>
          <div className="np-interlude__shade" aria-hidden="true" />
          <div className="np-wrap np-interlude__content">
            <SectionTop number="03" left="OUR MANIFESTO" right="AN INVITATION TO SLOW DOWN" />
            <p className="np-interlude__eyebrow np-reveal">THE MOST BEAUTIFUL KIND OF LUXURY</p>
            <h2 id="np-interlude-heading" className="np-reveal">
              Not more.
              <br />
              <em>More meaning.</em>
            </h2>
            <div className="np-interlude__footer np-reveal">
              <p>
                Time to notice the light. Time to feel at ease. Time to choose what truly matters to
                you.
              </p>
              <span aria-hidden="true">✳</span>
            </div>
          </div>
        </section>

        {/* 05 / INTERACTIVE ONE-MINUTE PAUSE */}
        <section className="np-breathe np-section" aria-labelledby="np-breathe-heading">
          <div className="np-wrap">
            <SectionTop
              number="04"
              left="AN INTERACTIVE PAUSE"
              right="A LITTLE SPACE, JUST FOR YOU"
            />
            <div className="np-breathe__grid">
              <div className="np-breathe__copy np-reveal">
                <SectionLabel number="04">COME BACK TO THIS MOMENT</SectionLabel>
                <h2 id="np-breathe-heading">
                  Even a minute can feel <em>different.</em>
                </h2>
                <p>
                  Put your notifications aside. Rest your gaze. Follow the gentle rhythm if you feel
                  comfortable — or simply enjoy one minute of stillness.
                </p>
                <p className="np-breathe__micro">
                  A SIMPLE, OPTIONAL EXERCISE — NOT A HEALTH OR MEDICAL TREATMENT.
                </p>
              </div>
              <QuietMinute />
            </div>
          </div>
        </section>

        {/* 06 / COMMITMENTS */}
        <section className="np-commitments np-section" aria-labelledby="np-commitments-heading">
          <div className="np-wrap">
            <SectionTop
              number="05"
              left="THE DETAILS THAT MATTER"
              right="FOUR CONSIDERED PRINCIPLES"
            />
            <div className="np-commitments__grid">
              <div className="np-commitments__intro np-reveal">
                <SectionLabel number="05">WHAT GUIDES US</SectionLabel>
                <h2 id="np-commitments-heading">
                  Nothing
                  <br />
                  without <em>intention.</em>
                </h2>
                <p>We want every interaction to feel human, and every detail to have a purpose.</p>
                <div className="np-commitments__still">
                  <img src={images.aftercare} alt="A quiet spa treatment detail" loading="lazy" />
                </div>
              </div>
              <div className="np-commitments__list">
                {commitments.map((item, index) => (
                  <div key={item.index} className="np-commitment np-reveal">
                    <h3>
                      <button
                        type="button"
                        aria-expanded={expandedCommitment === index}
                        aria-controls={`np-commitment-${index}`}
                        onClick={() =>
                          setExpandedCommitment((value) => (value === index ? null : index))
                        }
                      >
                        <span className="np-commitment__number">{item.index}</span>
                        <span>{item.title}</span>
                        <span className="np-commitment__indicator" aria-hidden="true">
                          {expandedCommitment === index ? "−" : "+"}
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`np-commitment-${index}`}
                      className="np-commitment__body"
                      hidden={expandedCommitment !== index}
                    >
                      <p>{item.description}</p>
                      <Check size={18} aria-hidden="true" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 07 / NEXT STEP */}
        <section className="np-closing" aria-labelledby="np-closing-heading">
          <div className="np-closing__background" aria-hidden="true">
            <img src={images.closing} alt="" loading="lazy" />
          </div>
          <div className="np-closing__shade" aria-hidden="true" />
          <div className="np-wrap np-closing__inner">
            <SectionTop
              number="06"
              left="THE NEXT CHAPTER"
              right="EVERY JOURNEY BEGINS WITH A MOMENT"
            />
            <div className="np-closing__copy np-reveal">
              <SectionLabel number="06">YOUR EXPERIENCE, YOUR WAY</SectionLabel>
              <h2 id="np-closing-heading">
                Make room
                <br />
                for <em>yourself.</em>
              </h2>
              <p>
                Discover thoughtfully designed rituals and make your next moment of rest something
                to look forward to.
              </p>
              <Link className="np-button np-button--cream" to="/services">
                Explore our treatments <ArrowUpRight size={20} aria-hidden="true" />
              </Link>
            </div>
            <div className="np-closing__bottom">
              <span>NOTHING TO PROVE. NOTHING TO RUSH.</span>
              <Link to="/about">
                GET TO KNOW US <MoveDownRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </ServicesShell>
  );
}

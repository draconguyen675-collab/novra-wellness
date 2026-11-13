import "@/features/motion-lab/motion-lab.css";
import { useMotionGSAP, useReducedMotion } from "@/shared/motion/preferences";
import { EditorialLayout } from "@/shared/ui/Editorial";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  MoveUpRight,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const scenes = [
  {
    kicker: "01 / SLOW MOVEMENT",
    headline: "Beauty in",
    italic: "every pause.",
    note: "A scroll-linked composition. Motion follows the reader instead of distracting from the content.",
  },
  {
    kicker: "02 / LIVING SHAPES",
    headline: "Designed to",
    italic: "feel alive.",
    note: "Oversized type, masked transitions, layered depth and carefully-paced editorial movement.",
  },
  {
    kicker: "03 / YOUR OWN PACE",
    headline: "Stay a little",
    italic: "longer.",
    note: "Your pace, your choice. Pause or resume movement with the motion control.",
  },
];

export default function MotionLabPage() {
  const root = useRef<HTMLElement>(null);
  const intro = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  useMotionGSAP(
    () => {
      if (!root.current || reduced) return;
      gsap.fromTo(
        ".nml-hero-word",
        { yPercent: 115, rotate: 3 },
        { yPercent: 0, rotate: 0, duration: 1.25, stagger: 0.14, ease: "power4.out" },
      );
      gsap.fromTo(
        ".nml-hero-sub",
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.95, delay: 0.4 },
      );
      gsap.to(".nml-orbit--one", { rotation: 360, duration: 22, ease: "none", repeat: -1 });
      gsap.to(".nml-orbit--two", { rotation: -360, duration: 34, ease: "none", repeat: -1 });

      // sticky scroll chapter — 3 dimensional scenes, no fragile pin-spacers.
      const stage = root.current.querySelector<HTMLElement>(".nml-stage");
      const chapter = root.current.querySelector<HTMLElement>(".nml-chapter");
      const allPanels = gsap.utils.toArray<HTMLElement>(".nml-panel", root.current);
      if (stage && chapter && allPanels.length === 3) {
        gsap.set(allPanels.slice(1), { autoAlpha: 0 });
        gsap.set(allPanels[0], { autoAlpha: 1 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: chapter,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });
        tl.fromTo(
          allPanels[0].querySelector(".nml-panel__title"),
          { scale: 1, y: 0 },
          { scale: 0.77, y: -115, autoAlpha: 0, duration: 0.8 },
          0,
        )
          .to(allPanels[0], { autoAlpha: 0, duration: 0.3 }, 0.55)
          .fromTo(
            allPanels[1],
            { autoAlpha: 0, xPercent: 25, clipPath: "inset(0 0 100% 0)" },
            { autoAlpha: 1, xPercent: 0, clipPath: "inset(0 0 0% 0)", duration: 1 },
            0.68,
          )
          .to(allPanels[1], { autoAlpha: 0, xPercent: -19, duration: 0.8 }, 2.1)
          .fromTo(
            allPanels[2],
            { autoAlpha: 0, scale: 1.18, clipPath: "inset(100% 0 0 0)" },
            { autoAlpha: 1, scale: 1, clipPath: "inset(0% 0 0 0)", duration: 1.15 },
            2.55,
          );
      }
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  const replay = () => {
    if (!reduced && intro.current) {
      gsap.fromTo(
        intro.current,
        { y: 95, autoAlpha: 0, rotate: 3 },
        { y: 0, autoAlpha: 1, rotate: 0, duration: 1.2, ease: "expo.out" },
      );
    }
  };

  return (
    <EditorialLayout title="Motion Lab — Test Animations">
      <main className="nml" ref={root}>
        <section className="nml-hero">
          <div className="nml-orbit nml-orbit--one" aria-hidden="true" />
          <div className="nml-orbit nml-orbit--two" aria-hidden="true" />
          <div className="nml-hero__inner">
            <span className="nml-kicker">
              <Sparkles size={16} /> THE MOTION COLLECTION / LIVE TEST
            </span>
            <h1 ref={intro}>
              <span className="nml-word-mask">
                <span className="nml-hero-word">Less static.</span>
              </span>
              <span className="nml-word-mask">
                <span className="nml-hero-word">
                  <em>More feeling.</em>
                </span>
              </span>
            </h1>
            <div className="nml-hero-sub">
              <p>
                Continuous movement, layered scenes and a rhythm that follows your scroll. Choose
                MOTION ON to experience it, or pause whenever you like.
              </p>
              <div className="nml-actions">
                <button type="button" onClick={replay}>
                  <Play size={17} /> Replay headline
                </button>
                <a href="#motion-chapter">
                  Explore movement <ArrowDown size={18} />
                </a>
              </div>
            </div>
          </div>
          <div className="nml-status">
            <span className="nml-live-dot" aria-hidden="true" /> GSAP {gsap.version} ·{" "}
            {reduced ? "REDUCED MOTION ACTIVE" : "MOTION ENABLED"}
          </div>
        </section>
        <div className="nml-ticker" aria-label="Movement design">
          <div className="nml-ticker__track">
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i}>
                BREATHE <b>✳</b> FEEL <b>✳</b> EXPLORE <b>✳</b>{" "}
              </span>
            ))}
          </div>
        </div>
        <section id="motion-chapter" className="nml-chapter">
          <div className="nml-stage">
            <div className="nml-stage__counter">
              MOTION STUDY <span>001 — 003</span>
            </div>
            {scenes.map((s, i) => (
              <div className={`nml-panel nml-panel--${i + 1}`} key={i}>
                <div className="nml-panel__accent">✳</div>
                <div className="nml-panel__content">
                  <span>{s.kicker}</span>
                  <h2 className="nml-panel__title">
                    {s.headline}
                    <br />
                    <em>{s.italic}</em>
                  </h2>
                  <p>{s.note}</p>
                </div>
                <strong className="nml-panel__number">0{i + 1}</strong>
              </div>
            ))}
            <span className="nml-stage__scroll">
              SCROLL TO TRANSFORM <ArrowDown size={18} />
            </span>
          </div>
        </section>
        <section className="nml-end">
          <span>AN EXPERIENCE, NOT A STATIC MOCKUP</span>
          <h2>
            Back to the
            <br />
            <em>real website.</em>
          </h2>
          <div>
            <Link to="/" className="nml-end__button">
              <ArrowLeft size={18} /> Homepage
            </Link>
            <Link to="/services" className="nml-end__button">
              Explore services <MoveUpRight size={18} />
            </Link>
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
                replay();
              }}
            >
              <RotateCcw size={17} /> Replay experience
            </button>
          </div>
          <p>
            <ArrowUpRight size={14} /> This is a diagnostic experience. Your public website still
            has 25 customer-facing screens.
          </p>
        </section>
      </main>
    </EditorialLayout>
  );
}

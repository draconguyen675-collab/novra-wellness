import "@/shared/motion/motion-director.css";
import { createPointerMotion } from "@/shared/motion/pointer-motion";
import { motionQuery, useReducedMotion } from "@/shared/motion/preferences";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger, SplitText);

/** Global motion owns separate targets from page-local reveals. */
export default function MotionDirector() {
  const { pathname, search } = useLocation();
  const curtain = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const [diagnostics, setDiagnostics] = useState({ triggers: 0, reduced: false });
  const debug = new URLSearchParams(search).has("motion-debug");
  const reduced = useReducedMotion();

  useEffect(() => {
    const pretty =
      pathname === "/"
        ? "Home"
        : pathname.split("/").filter(Boolean).join(" / ").replaceAll("-", " ");
    document.title = `${pretty} | NOVRA Wellness`;
    let frame = 0;
    let setupFrame = 0;
    let disposed = false;
    const media = gsap.matchMedia();
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!disposed) ScrollTrigger.refresh();
      });
    };

    // Initialize only after the lazy route commits.
    setupFrame = requestAnimationFrame(() => {
      media.add(
        {
          motion: motionQuery(),
          desktop: "(min-width: 1000px)",
          pointer: "(hover: hover) and (pointer: fine)",
        },
        (context) => {
          const { motion, desktop, pointer } = context.conditions!;
          if (!motion) {
            if (debug) setDiagnostics({ triggers: ScrollTrigger.getAll().length, reduced: true });
            return;
          }
          const splits: SplitText[] = [];
          const overlay = curtain.current;
          if (overlay) {
            gsap
              .timeline()
              .set(overlay, { display: "grid", autoAlpha: 1, yPercent: 0 })
              .fromTo(
                ".nm-curtain__name",
                { yPercent: 70, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
                0,
              )
              .fromTo(
                ".nm-curtain__asterisk",
                { rotate: -90, scale: 0.5 },
                { rotate: 0, scale: 1, duration: 0.6 },
                0,
              )
              .to(overlay, { yPercent: -102, duration: 0.72, ease: "power4.inOut" }, 0.22)
              .set(overlay, { display: "none", autoAlpha: 0 });
          }
          gsap.fromTo(
            progress.current,
            { scaleX: 0 },
            { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.2 } },
          );

          // Static editorial headings preserve emphasis and accessible text.
          document
            .querySelectorAll<HTMLElement>(
              ".nv-display, .ne-heading, .nl-display, .np-display, .nprice-intro h2, .nv-closing-content h2",
            )
            .forEach((heading) => {
              if (heading.closest(".nm-lab, [role='dialog'], .ne-exp-stage")) return;
              splits.push(
                SplitText.create(heading, {
                  type: "words",
                  mask: "words",
                  wordsClass: "nm-word",
                  aria: "auto",
                  onSplit: (split) =>
                    gsap.fromTo(
                      split.words,
                      { yPercent: 115, rotate: 4 },
                      {
                        yPercent: 0,
                        rotate: 0,
                        stagger: 0.065,
                        duration: 1.05,
                        ease: "power4.out",
                        scrollTrigger: { trigger: heading, start: "top 91%", once: true },
                      },
                    ),
                }),
              );
            });

          document
            .querySelectorAll<HTMLElement>(
              ".nv-treatment-image, .nv-ritual-image, .nv-people-visual, .ne-photo-card__image, [data-nm-media]",
            )
            .forEach((element) =>
              gsap.fromTo(
                element,
                { clipPath: "inset(10% 7% 10% 7% round 38% 38% 0 0)" },
                {
                  clipPath: "inset(0% 0% 0% 0% round 0% 0% 0 0)",
                  duration: 1.45,
                  ease: "power3.out",
                  clearProps: "clipPath",
                  scrollTrigger: { trigger: element, start: "top 94%", once: true },
                },
              ),
            );

          document
            .querySelectorAll<HTMLElement>(
              ".nv-treatment-card, .ne-photo-card, .nv-package, .nl-location-card, .np-card",
            )
            .forEach((card, i) =>
              gsap.fromTo(
                card,
                { y: 65, rotate: i % 2 ? 1.5 : -1.5 },
                {
                  y: 0,
                  rotate: 0,
                  duration: 1.15,
                  delay: (i % 3) * 0.08,
                  ease: "power3.out",
                  clearProps: "transform",
                  scrollTrigger: { trigger: card, start: "top 96%", once: true },
                },
              ),
            );

          const hero = document.querySelector<HTMLElement>(".nv-hero");
          if (hero) {
            gsap.to(hero.querySelector(".nv-hero-photo img"), {
              scale: 1.14,
              xPercent: -2,
              duration: 18,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
            gsap.to(hero.querySelector(".nv-hero-title"), {
              y: desktop ? 130 : 55,
              ease: "none",
              scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.8 },
            });
            gsap.to(hero.querySelectorAll(".nv-clip"), {
              xPercent: (i) => (i === 1 ? 8 : -5),
              ease: "none",
              scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.8 },
            });
            gsap.to(hero.querySelector(".nv-hero-bottom"), {
              opacity: 0,
              y: 45,
              ease: "none",
              scrollTrigger: { trigger: hero, start: "top top", end: "65% top", scrub: 0.5 },
            });
          }

          // A short pinned reading moment on desktop; natural scrolling on mobile.
          const manifesto = document.querySelector<HTMLElement>(".nv-manifesto");
          const statement = manifesto?.querySelector<HTMLElement>("h2");
          if (manifesto && statement) {
            const split = SplitText.create(statement, {
              type: "words",
              wordsClass: "nm-reading-word",
              aria: "auto",
            });
            splits.push(split);
            const scene = gsap.timeline({
              scrollTrigger: {
                id: "novra-manifesto",
                trigger: manifesto,
                start: desktop ? "top top" : "top 65%",
                end: desktop ? "+=85%" : "bottom 70%",
                pin: Boolean(desktop),
                scrub: 0.65,
                invalidateOnRefresh: true,
              },
            });
            scene
              .fromTo(
                split.words,
                { opacity: 0.2 },
                { opacity: 1, stagger: 0.16, duration: 0.45, ease: "none" },
                0,
              )
              .fromTo(
                manifesto.querySelector(".nv-manifesto-photo img"),
                { scale: 1.2 },
                { scale: 1, duration: 2.2, ease: "none" },
                0,
              )
              .fromTo(
                manifesto.querySelector(".nv-manifesto-content p"),
                { opacity: 0.2, y: 20 },
                { opacity: 1, y: 0, duration: 0.6 },
                1.5,
              )
              .to(
                manifesto.querySelector(".nv-manifesto-footer span"),
                { rotate: 180, duration: 2.2, ease: "none" },
                0,
              );
          }

          document.querySelectorAll<HTMLElement>(".nv-footer-logo").forEach((logo) => {
            gsap.fromTo(
              logo,
              { yPercent: 70, clipPath: "inset(0 0 100% 0)" },
              {
                yPercent: 0,
                clipPath: "inset(0 0 0% 0)",
                duration: 1.4,
                ease: "power4.out",
                scrollTrigger: { trigger: logo, start: "top bottom", once: true },
              },
            );
          });
          const closing = document.querySelector(".nv-closing");
          if (closing)
            gsap.fromTo(
              closing.querySelector("img"),
              { scale: 1.2 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: closing,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.8,
                },
              },
            );

          const stopPointer =
            pointer && cursor.current ? createPointerMotion(cursor.current) : undefined;
          refresh();
          if (debug) setDiagnostics({ triggers: ScrollTrigger.getAll().length, reduced: false });
          return () => {
            stopPointer?.();
            splits.forEach((split) => split.revert());
          };
        },
      );
    });
    document.fonts.ready.then(() => {
      if (!disposed) refresh();
    });
    document.addEventListener("load", refresh, true);
    // Filters and expanded panels change section positions after initialization.
    // Re-measure the page so later reveals do not remain hidden at stale offsets.
    let lastHeight = 0;
    let resizeTimer = 0;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry || Math.abs(entry.contentRect.height - lastHeight) < 1) return;
      lastHeight = entry.contentRect.height;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(refresh, 120);
    });
    const page = document.querySelector(".nv-site");
    if (page) observer.observe(page);
    return () => {
      disposed = true;
      cancelAnimationFrame(setupFrame);
      cancelAnimationFrame(frame);
      document.removeEventListener("load", refresh, true);
      observer.disconnect();
      window.clearTimeout(resizeTimer);
      media.revert();
    };
  }, [pathname, debug, reduced]);

  return (
    <div className="nm-motion-layer" aria-hidden="true">
      <div ref={progress} className="nm-scroll-progress" />
      <div ref={cursor} className="nm-cursor">
        <span>↗</span>
      </div>
      <div ref={curtain} className="nm-curtain">
        <div className="nm-curtain__inner">
          <span className="nm-curtain__asterisk">✳</span>
          <span className="nm-curtain__name">NOVRA</span>
          <span className="nm-curtain__label">ENTER THE ART OF SLOW LIVING</span>
        </div>
        <span className="nm-curtain__number">TAKE A BREATH / YOU HAVE ARRIVED</span>
      </div>
      {debug && (
        <div className="nm-debug">
          <strong>GSAP {gsap.version}</strong>
          <span>ScrollTriggers: {diagnostics.triggers}</span>
          <span>Reduced motion: {diagnostics.reduced ? "ON" : "OFF"}</span>
          <span>Route: {pathname}</span>
        </div>
      )}
    </div>
  );
}

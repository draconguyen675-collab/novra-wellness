import ServicesShell from "@/shared/layout/SiteShell";
import { isMotionReduced, useMotionGSAP } from "@/shared/motion/preferences";
import "@/shared/styles/editorial.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Asterisk } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | NOVRA Wellness House`;
  }, [title]);
}

export function EditorialHero({
  eyebrow,
  title,
  italic,
  subtitle,
  image,
  dark = true,
  index = "01",
  scrollTo,
}: {
  eyebrow: string;
  title: string;
  italic?: string;
  subtitle: string;
  image: string;
  dark?: boolean;
  index?: string;
  scrollTo?: string;
}) {
  const root = useRef<HTMLElement>(null);
  useMotionGSAP(
    () => {
      const el = root.current;
      if (!el || isMotionReduced()) return;
      const image = el.querySelector(".ne-hero__photo");
      const words = el.querySelectorAll(".ne-hero__title-line");
      const sub = el.querySelectorAll(".ne-hero__eyebrow, .ne-hero__summary, .ne-hero__scroll");
      const tl = gsap.timeline({ delay: 0.45, defaults: { ease: "power3.out" } });
      tl.fromTo(
        image,
        { scale: 1.2, filter: "brightness(.55)" },
        { scale: 1, filter: "brightness(1)", duration: 2, ease: "power2.out" },
        0,
      )
        .fromTo(
          words,
          { yPercent: 116, rotate: 2 },
          { yPercent: 0, rotate: 0, duration: 1.15, stagger: 0.16 },
          0.16,
        )
        .fromTo(
          sub,
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.1 },
          0.72,
        );
      gsap.to(image, {
        yPercent: 16,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.7 },
      });
    },
    { scope: root },
  );
  return (
    <section ref={root} className={`ne-hero ${dark ? "ne-hero--dark" : "ne-hero--light"}`}>
      <div className="ne-hero__photo">
        <img src={image} alt="Calming wellness editorial atmosphere" fetchPriority="high" />
      </div>
      <div className="ne-hero__shade" />
      <div className="ne-hero__grain" />
      <div className="ne-container ne-hero__content">
        <span className="ne-hero__eyebrow">
          N° {index} / {eyebrow}
        </span>
        <h1 className="ne-hero__title">
          <span className="ne-mask">
            <span className="ne-hero__title-line">{title}</span>
          </span>
          {italic && (
            <span className="ne-mask">
              <span className="ne-hero__title-line ne-hero__title-line--italic">{italic}</span>
            </span>
          )}
        </h1>
        <div className="ne-hero__bottom">
          <p className="ne-hero__summary">{subtitle}</p>
          <span className="ne-hero__chapter">NOVRA / EST. IN STILLNESS</span>
        </div>
      </div>
      {scrollTo && (
        <a className="ne-hero__scroll" href={`#${scrollTo}`}>
          SCROLL TO EXPLORE <ArrowDown size={15} />
        </a>
      )}
    </section>
  );
}

export function Chapter({
  number,
  label,
  title,
  italic,
  children,
  right,
}: {
  number: string;
  label: string;
  title: string;
  italic?: string;
  children?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <section className="ne-chapter ne-container" data-nm-reveal>
      <div className="ne-chapter__index">
        <span>
          {number} / {label}
        </span>
        <Asterisk size={17} />
      </div>
      <div className="ne-chapter__layout">
        <h2 className="ne-heading">
          {title}
          {italic && (
            <>
              <br />
              <em>{italic}</em>
            </>
          )}
        </h2>
        <div className="ne-chapter__right">
          {children}
          {right}
        </div>
      </div>
    </section>
  );
}

export function Scene({
  image,
  tag,
  title,
  sub,
  link,
  action = "Explore the collection",
}: {
  image: string;
  tag: string;
  title: string;
  sub: string;
  link?: string;
  action?: string;
}) {
  const root = useRef<HTMLElement>(null);
  useMotionGSAP(
    () => {
      if (!root.current || isMotionReduced()) return;
      const photo = root.current.querySelector(".ne-scene__photo");
      gsap.fromTo(
        photo,
        { scale: 1.23 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        },
      );
      gsap.fromTo(
        root.current.querySelector(".ne-scene__content"),
        { y: 70, opacity: 0.65 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            end: "center center",
            scrub: 0.6,
          },
        },
      );
    },
    { scope: root },
  );
  return (
    <section ref={root} className="ne-scene">
      <div className="ne-scene__photo">
        <img src={image} alt="A tranquil NOVRA wellness atmosphere" loading="lazy" />
      </div>
      <div className="ne-scene__shade" />
      <div className="ne-scene__content ne-container">
        <span className="ne-eyebrow">{tag}</span>
        <h2 className="ne-heading">{title}</h2>
        <p>{sub}</p>
        {link && (
          <Link className="ne-outline-link" to={link}>
            {action} <ArrowUpRight size={20} />
          </Link>
        )}
      </div>
    </section>
  );
}

export function EditorialLayout({ children, title }: { children: ReactNode; title: string }) {
  usePageTitle(title);
  return (
    <ServicesShell>
      <div className="ne-page">{children}</div>
    </ServicesShell>
  );
}
export function EditorialCTA({
  eyebrow = "THE NEXT CHAPTER",
  title = "Your moment",
  italic = "starts here.",
  to = "/booking",
}: {
  eyebrow?: string;
  title?: string;
  italic?: string;
  to?: string;
}) {
  return (
    <div className="ne-cta" data-nm-reveal>
      <span className="ne-eyebrow">{eyebrow}</span>
      <h2 className="ne-heading">
        {title}
        <br />
        <em>{italic}</em>
      </h2>
      <Link to={to} className="ne-btn ne-btn--light">
        BEGIN THE EXPERIENCE <ArrowUpRight size={19} />
      </Link>
    </div>
  );
}
export function PhotoCard({
  src,
  title,
  meta,
  link,
  number,
}: {
  src: string;
  title: string;
  meta?: string;
  link?: string;
  number?: string;
}) {
  return (
    <article className="ne-photo-card" data-nm-reveal>
      <div className="ne-photo-card__image" data-nm-media>
        <img src={src} loading="lazy" alt={title} />
        {link && (
          <Link className="ne-photo-card__round" to={link} aria-label={`Discover ${title}`}>
            <ArrowUpRight size={23} />
          </Link>
        )}
      </div>
      <div className="ne-photo-card__meta">
        <span>{number || meta || "NOVRA COLLECTION"}</span>
        <span>{meta && number ? meta : "DISCOVER"}</span>
      </div>
      <h3>{link ? <Link to={link}>{title}</Link> : title}</h3>
    </article>
  );
}

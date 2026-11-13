import { SERVICES, SERVICE_CATEGORIES, formatMinutes, formatPrice } from "@/content/services";
import ServiceEditorialCard from "@/features/services/components/ServiceEditorialCard";
import "@/features/services/services.css";
import ServicesShell from "@/shared/layout/SiteShell";
import { isMotionReduced, useMotionGSAP } from "@/shared/motion/preferences";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type SortBy = "featured" | "priceLow" | "priceHigh" | "shortest" | "alphabetical";
type Duration = "all" | "short" | "medium" | "long";
const HERO =
  "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1400&q=85";

const durations: { value: Duration; label: string }[] = [
  { value: "all", label: "Any duration" },
  { value: "short", label: "Under 60 min" },
  { value: "medium", label: "60–90 min" },
  { value: "long", label: "Over 90 min" },
];

export default function ServicesPage() {
  const root = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof SERVICE_CATEGORIES)[number]>("All");
  const [duration, setDuration] = useState<Duration>("all");
  const [sortBy, setSortBy] = useState<SortBy>("featured");
  const [compare, setCompare] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const trimmed = query.trim().toLocaleLowerCase("en-US");

  const filtered = useMemo(
    () =>
      SERVICES.filter((service) => {
        const matchesCategory = category === "All" || service.category === category;
        const matchesQuery = `${service.name} ${service.description} ${service.category}`
          .toLocaleLowerCase("en-US")
          .includes(trimmed);
        const matchesDuration =
          duration === "all" ||
          (duration === "short" && service.minutes < 60) ||
          (duration === "medium" && service.minutes >= 60 && service.minutes <= 90) ||
          (duration === "long" && service.minutes > 90);
        return matchesCategory && matchesQuery && matchesDuration;
      }).sort((a, b) => {
        if (sortBy === "priceLow") return a.price - b.price;
        if (sortBy === "priceHigh") return b.price - a.price;
        if (sortBy === "shortest") return a.minutes - b.minutes;
        if (sortBy === "alphabetical") return a.name.localeCompare(b.name);
        return 0;
      }),
    [category, duration, sortBy, trimmed],
  );

  const compared = compare
    .map((slug) => SERVICES.find((s) => s.slug === slug))
    .filter((x): x is (typeof SERVICES)[number] => Boolean(x));
  const toggleCompare = (slug: string) =>
    setCompare((previous) =>
      previous.includes(slug)
        ? previous.filter((item) => item !== slug)
        : previous.length < 3
          ? [...previous, slug]
          : previous,
    );
  const reset = () => {
    setQuery("");
    setCategory("All");
    setDuration("all");
    setSortBy("featured");
  };

  useMotionGSAP(
    () => {
      if (isMotionReduced()) return;
      gsap.from(".nv-svc-hero__copy > *", {
        y: 35,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.95,
        ease: "power3.out",
      });
      gsap.from(".nv-svc-hero__visual", {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 1.2,
        ease: "power3.inOut",
        delay: 0.15,
      });
      gsap.utils.toArray<HTMLElement>(".nv-svc-scroll-reveal").forEach((el) =>
        gsap.from(el, {
          y: 30,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        }),
      );
    },
    { scope: root },
  );

  return (
    <ServicesShell>
      <div ref={root}>
        <section className="nv-svc-hero" aria-labelledby="nv-services-title">
          <div className="nv-container nv-svc-hero__layout">
            <div className="nv-svc-hero__copy">
              <div className="nv-svc-eyebrow">
                <span>01 / THE TREATMENT EDIT</span>
                <span>MADE FOR YOUR MOMENT</span>
              </div>
              <p className="nv-svc-kicker">THE ART OF FEELING WELL</p>
              <h1 id="nv-services-title">
                Find your
                <br />
                <em>kind of calm.</em>
              </h1>
              <p className="nv-svc-hero__lead">
                Some moments call for quiet. Others for renewal. Explore a considered collection of
                rituals, each created to meet you exactly where you are.
              </p>
              <a className="nv-svc-link" href="#nv-catalog">
                Explore our experiences <ArrowDown size={18} />
              </a>
              <div className="nv-svc-hero__counter">
                <strong>{String(SERVICES.length).padStart(2, "0")}</strong>
                <span>
                  CURATED EXPERIENCES
                  <br />
                  ONE MORE REASON TO SLOW DOWN
                </span>
              </div>
            </div>
            <div className="nv-svc-hero__visual">
              <img
                src={HERO}
                alt="Serene wellness interior, soft light, and warm natural materials"
                fetchPriority="high"
              />
              <div className="nv-svc-hero__image-note">
                <span>✳</span> THE BEAUTY OF BEING PRESENT
              </div>
            </div>
            <div className="nv-svc-hero__vertical" aria-hidden="true">
              NOVRA WELLNESS — TREATMENT COLLECTION
            </div>
          </div>
        </section>

        <section className="nv-svc-intro nv-container nv-svc-scroll-reveal">
          <span>THE EXPERIENCES</span>
          <p>
            Care for the body.
            <br />
            <em>Space for the self.</em>
          </p>
        </section>

        <section
          id="nv-catalog"
          className="nv-svc-catalog nv-container"
          aria-labelledby="nv-svc-catalog-title"
        >
          <div className="nv-svc-section-top">
            <span>02 / EXPLORE OUR WORLD</span>
            <span>YOUR RITUAL BEGINS HERE</span>
          </div>
          <div className="nv-svc-catalog__intro">
            <div>
              <p className="nv-svc-kicker">CURATED FOR YOUR MOMENT</p>
              <h2 id="nv-svc-catalog-title">
                The treatment
                <br />
                <em>collection.</em>
              </h2>
            </div>
            <p>
              Find what feels right with thoughtful filters, transparent example prices, and time to
              compare before you choose.
            </p>
          </div>
          <div className="nv-svc-controls">
            <div className="nv-svc-tabs" role="group" aria-label="Filter by category">
              {SERVICE_CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={category === item ? "is-active" : ""}
                  aria-pressed={category === item}
                  onClick={() => setCategory(item)}
                >
                  {item === "All" ? "All experiences" : item}
                  <span>
                    {item === "All"
                      ? SERVICES.length
                      : SERVICES.filter((s) => s.category === item).length}
                  </span>
                </button>
              ))}
            </div>
            <div className="nv-svc-control-row">
              <label className="nv-svc-search">
                <Search size={17} aria-hidden="true" />
                <span className="nv-svc-visually-hidden">Search treatments</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search your next ritual..."
                  type="search"
                />
              </label>
              <label className="nv-svc-select">
                <SlidersHorizontal size={16} aria-hidden="true" />
                <span className="nv-svc-visually-hidden">Filter by duration</span>
                <select
                  value={duration}
                  onChange={(event) => setDuration(event.target.value as Duration)}
                >
                  {durations.map((item) => (
                    <option value={item.value} key={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="nv-svc-select">
                <span className="nv-svc-visually-hidden">Sort treatments</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortBy)}
                >
                  <option value="featured">Featured first</option>
                  <option value="priceLow">Price: low to high</option>
                  <option value="priceHigh">Price: high to low</option>
                  <option value="shortest">Shortest duration</option>
                  <option value="alphabetical">Name: A to Z</option>
                </select>
              </label>
            </div>
            <div className="nv-svc-result-row">
              <p role="status" aria-live="polite">
                <strong>{filtered.length}</strong> experiences found
              </p>
              <button
                type="button"
                onClick={reset}
                disabled={
                  !query && category === "All" && duration === "all" && sortBy === "featured"
                }
              >
                <RotateCcw size={15} /> Reset filters
              </button>
            </div>
          </div>
          {filtered.length ? (
            <div className="nv-svc-grid" key={`${category}-${duration}-${sortBy}-${trimmed}`}>
              {filtered.map((service, index) => (
                <ServiceEditorialCard
                  key={service.slug}
                  service={service}
                  index={index}
                  onCompare={toggleCompare}
                  isComparing={compare.includes(service.slug)}
                  compareDisabled={compare.length >= 3 && !compare.includes(service.slug)}
                  featured={category === "All" && index === 0 && !trimmed}
                />
              ))}
            </div>
          ) : (
            <div className="nv-svc-empty">
              <span>✳</span>
              <h3>No rituals found.</h3>
              <p>Try a different category, duration, or search term to find your moment of calm.</p>
              <button type="button" className="nv-button nv-button--dark" onClick={reset}>
                Show all experiences <ArrowRight size={16} />
              </button>
            </div>
          )}
        </section>

        <section className="nv-svc-note">
          <div className="nv-container">
            <div className="nv-svc-note__symbol">✳</div>
            <p>
              There is no one way
              <br />
              to <em>feel well.</em>
            </p>
            <span>PERSONALIZED BY DESIGN · AT YOUR OWN PACE</span>
          </div>
        </section>
        <section className="nv-svc-bottom-cta nv-container nv-svc-scroll-reveal">
          <span>03 / A MOMENT FOR YOU</span>
          <h2>
            Not sure where
            <br />
            <em>to begin?</em>
          </h2>
          <p>
            Start with a single experience that feels right today. The best rituals make room for
            you, not the other way around.
          </p>
          <Link to="/services/the-novra-signature" className="nv-button nv-button--dark">
            Explore our signature <ArrowUpRight size={18} />
          </Link>
        </section>
      </div>

      {compare.length > 0 && (
        <div className="nv-svc-compare-dock" role="region" aria-label="Service comparison">
          <div>
            <strong>{compare.length}/3</strong>
            <span>SELECTED TO COMPARE</span>
          </div>
          <div className="nv-svc-compare-chips">
            {compared.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => toggleCompare(item.slug)}
                title={`Remove ${item.name}`}
              >
                {item.name}
                <X size={14} />
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={compare.length < 2}
            onClick={() => {
              setShowComparison(true);
              requestAnimationFrame(() =>
                document.getElementById("nv-comparison")?.scrollIntoView({
                  behavior: isMotionReduced() ? "auto" : "smooth",
                  block: "start",
                }),
              );
            }}
          >
            Compare <ArrowUpRight size={17} />
          </button>
          <button
            className="nv-svc-compare-clear"
            type="button"
            onClick={() => {
              setCompare([]);
              setShowComparison(false);
            }}
            aria-label="Clear comparison"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {showComparison && compare.length >= 2 && (
        <section
          id="nv-comparison"
          className="nv-site nv-svc-comparison"
          aria-label="Compare selected treatments"
        >
          <div className="nv-container">
            <div className="nv-svc-comparison__top">
              <div>
                <span className="nv-svc-kicker">COMPARE YOUR EXPERIENCES</span>
                <h2>
                  Find your <em>fit.</em>
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowComparison(false)}
                aria-label="Close comparison"
              >
                <X size={20} /> Close
              </button>
            </div>
            <div className="nv-svc-comparison__scroll">
              <table>
                <thead>
                  <tr>
                    <th scope="col">AT A GLANCE</th>
                    {compared.map((s) => (
                      <th scope="col" key={s.slug}>
                        <Link to={`/services/${s.slug}`}>
                          {s.name} <ArrowUpRight size={14} />
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Category</th>
                    {compared.map((s) => (
                      <td key={s.slug}>{s.category}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Starting from</th>
                    {compared.map((s) => (
                      <td key={s.slug}>
                        {formatPrice(Math.min(...s.durationOptions.map((o) => o.price)))}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Standard duration</th>
                    {compared.map((s) => (
                      <td key={s.slug}>{formatMinutes(s.minutes)}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Good for</th>
                    {compared.map((s) => (
                      <td key={s.slug}>{s.benefits[0]}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Your journey</th>
                    {compared.map((s) => (
                      <td key={s.slug}>
                        <Link to={`/services/${s.slug}`} className="nv-svc-comparison__cta">
                          Explore ritual <ArrowRight size={15} />
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="nv-svc-comparison__note">
              <Check size={14} /> Example prices and information for preview only.
            </p>
          </div>
        </section>
      )}
    </ServicesShell>
  );
}

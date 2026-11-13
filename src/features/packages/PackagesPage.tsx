import {
  PACKAGES,
  PACKAGE_CATEGORIES,
  basePrice,
  formatPackageMinutes,
  formatPackagePrice,
  packageGuestLabel,
  type PackageMood,
  type SpaPackage,
} from "@/content/packages";
import "@/features/packages/packages.css";
import ServicesShell from "@/shared/layout/SiteShell";
import { isMotionReduced, motionQuery, useMotionGSAP } from "@/shared/motion/preferences";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  Heart,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type GuestFilter = "all" | "solo" | "couple" | "group";
type SortMode = "featured" | "price-asc" | "price-desc" | "duration" | "name";

const heroPhoto = PACKAGES[1].hero;

function PackageCard({
  item,
  index,
  selected,
  onCompare,
  compareDisabled,
}: {
  item: SpaPackage;
  index: number;
  selected: boolean;
  onCompare: () => void;
  compareDisabled: boolean;
}) {
  return (
    <article className={`np-card ${index === 0 ? "np-card--feature" : ""}`}>
      <Link
        to={`/packages/${item.slug}`}
        className="np-card__visual"
        aria-label={`Discover ${item.name}`}
      >
        <img src={item.hero} alt={`Editorial spa atmosphere for ${item.name}`} loading="lazy" />
        <span className="np-card__badge">{item.badge}</span>
        <span className="np-card__go" aria-hidden="true">
          <ArrowUpRight size={23} />
        </span>
      </Link>
      <div className="np-card__content">
        <div className="np-card__meta">
          <span>
            {item.id} / 0{PACKAGES.length}
          </span>
          <span>
            {item.category.toUpperCase()} · {packageGuestLabel(item)}
          </span>
        </div>
        <div className="np-card__title-row">
          <h3>
            <Link to={`/packages/${item.slug}`}>{item.name}</Link>
          </h3>
          <span>
            FROM
            <br />
            <strong>{formatPackagePrice(basePrice(item))}</strong>
          </span>
        </div>
        <p>
          {item.subtitle}. {item.description}
        </p>
        <div className="np-card__facts">
          <span>
            <Clock3 size={15} aria-hidden="true" />{" "}
            {formatPackageMinutes(Math.min(...item.variants.map((v) => v.minutes)))}+
          </span>
          <span>
            <Users size={15} aria-hidden="true" /> {packageGuestLabel(item)}
          </span>
        </div>
        <div className="np-card__actions">
          <Link to={`/packages/${item.slug}`}>
            Explore package <ArrowRight size={16} />
          </Link>
          <button
            type="button"
            onClick={onCompare}
            disabled={compareDisabled}
            aria-pressed={selected}
            aria-label={`${selected ? "Remove" : "Add"} ${item.name} ${selected ? "from" : "to"} comparison`}
          >
            {selected ? <Check size={16} /> : <Heart size={16} />}{" "}
            {selected ? "Selected" : "Compare"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function PackagesPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<PackageMood | "All">("All");
  const [guestFilter, setGuestFilter] = useState<GuestFilter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("featured");
  const [compare, setCompare] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return PACKAGES.filter((item) => {
      const matchCategory = category === "All" || item.category === category;
      const matchGuests =
        guestFilter === "all" ||
        item.variants.some((variant) => {
          if (guestFilter === "solo") return variant.guests === 1;
          if (guestFilter === "couple") return variant.guests === 2;
          return variant.guests >= 3;
        });
      const matchText =
        !term ||
        [item.name, item.subtitle, item.description, item.category, ...item.idealFor]
          .join(" ")
          .toLocaleLowerCase()
          .includes(term);
      return matchCategory && matchGuests && matchText;
    }).sort((a, b) => {
      if (sort === "price-asc") return basePrice(a) - basePrice(b);
      if (sort === "price-desc") return basePrice(b) - basePrice(a);
      if (sort === "duration")
        return (
          Math.min(...a.variants.map((v) => v.minutes)) -
          Math.min(...b.variants.map((v) => v.minutes))
        );
      if (sort === "name") return a.name.localeCompare(b.name);
      return Number(a.id) - Number(b.id);
    });
  }, [category, guestFilter, query, sort]);

  const compared = compare
    .map((slug) => PACKAGES.find((item) => item.slug === slug))
    .filter((x): x is SpaPackage => Boolean(x));
  const toggleCompare = (slug: string) => {
    setCompare((previous) =>
      previous.includes(slug)
        ? previous.filter((s) => s !== slug)
        : previous.length < 3
          ? [...previous, slug]
          : previous,
    );
    setShowComparison(false);
  };
  const reset = () => {
    setQuery("");
    setCategory("All");
    setGuestFilter("all");
    setSort("featured");
  };
  const compareSelected = () => {
    setShowComparison(true);
    requestAnimationFrame(() =>
      document
        .getElementById("np-comparison")
        ?.scrollIntoView({ block: "start", behavior: isMotionReduced() ? "auto" : "smooth" }),
    );
  };

  useMotionGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionQuery(), () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".np-hero__overline", { y: 17, autoAlpha: 0, duration: 0.65 })
          .from(
            ".np-hero__title .np-line > span",
            { yPercent: 105, autoAlpha: 0, stagger: 0.14, duration: 1.15 },
            "-=.26",
          )
          .from(".np-hero__lead", { y: 22, autoAlpha: 0, duration: 0.8 }, "-=.5")
          .from(
            ".np-hero__image",
            { clipPath: "inset(100% 0 0 0)", duration: 1.25, ease: "power3.inOut" },
            0,
          );
        gsap.utils.toArray<HTMLElement>(".np-reveal").forEach((el) =>
          gsap.from(el, {
            y: 34,
            autoAlpha: 0,
            duration: 0.88,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          }),
        );
      });
      mm.add("(min-width: 900px) and " + motionQuery(), () =>
        gsap.to(".np-hero__image img", {
          yPercent: 11,
          ease: "none",
          scrollTrigger: { trigger: ".np-hero", start: "top top", end: "bottom top", scrub: true },
        }),
      );
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <ServicesShell>
      <div className="np-site" ref={rootRef}>
        <section className="np-hero" aria-labelledby="np-hero-heading">
          <div className="np-hero__text">
            <div className="np-hero__overline">
              <Link to="/">HOME</Link>
              <span> / </span>
              <span>PACKAGES</span>
              <i>✳</i>
              <span>THE COLLECTION / 2026</span>
            </div>
            <div className="np-hero__content">
              <p className="np-kicker">CURATED EXPERIENCES · UNHURRIED LIVING</p>
              <h1 className="np-hero__title" id="np-hero-heading">
                <span className="np-line">
                  <span>Time,</span>
                </span>
                <span className="np-line">
                  <span>
                    <em>beautifully</em>
                  </span>
                </span>
                <span className="np-line">
                  <span>spent.</span>
                </span>
              </h1>
              <p className="np-hero__lead">
                A thoughtful collection of wellness journeys — for a quiet hour alone, a moment
                together, or an occasion worth remembering.
              </p>
              <a className="np-underline-link" href="#np-collection">
                Explore the collection <ArrowDown size={17} />
              </a>
            </div>
            <div className="np-hero__caption">
              <span>DESIGNED FOR YOUR MOMENT</span>
              <span>01 — 06 / COLLECTION</span>
            </div>
          </div>
          <div className="np-hero__image">
            <img src={heroPhoto} alt="Calm, warm-toned spa interior" fetchPriority="high" />
            <span className="np-hero__image-label">A GENTLER WAY TO SPEND YOUR DAY</span>
          </div>
        </section>

        <section className="np-intro np-width np-reveal">
          <p className="np-kicker">01 / THE ART OF TAKING TIME</p>
          <div>
            <h2>
              Not just a treatment.
              <br />
              <em>A little world of your own.</em>
            </h2>
            <p>
              Some moments deserve more than a single hour. Discover layered experiences that feel
              personal, effortless, and deeply considered, down to the smallest detail.
            </p>
          </div>
        </section>

        <section
          className="np-collection"
          id="np-collection"
          aria-labelledby="np-collection-heading"
        >
          <div className="np-width">
            <div className="np-section-cap np-reveal">
              <span>02 / EXPLORE THE EDIT</span>
              <span>YOUR MOMENT, YOUR WAY</span>
            </div>
            <div className="np-collection__intro np-reveal">
              <div>
                <p className="np-kicker">MAKE ROOM FOR WHAT MATTERS</p>
                <h2 id="np-collection-heading">
                  A ritual for
                  <br />
                  <em>every occasion.</em>
                </h2>
              </div>
              <p>
                Explore from a solo reset to a shared celebration. Prices are sample package totals,
                with no hidden per-person multiplication.
              </p>
            </div>
            <div className="np-toolbar">
              <div className="np-tabs" role="group" aria-label="Filter packages by mood">
                {PACKAGE_CATEGORIES.map((option) => (
                  <button
                    type="button"
                    key={option}
                    className={category === option ? "is-active" : ""}
                    aria-pressed={category === option}
                    onClick={() => setCategory(option)}
                  >
                    {option === "All" ? "All experiences" : option}
                    <sup>
                      {option === "All"
                        ? PACKAGES.length
                        : PACKAGES.filter((p) => p.category === option).length}
                    </sup>
                  </button>
                ))}
              </div>
              <div className="np-toolbar__row">
                <label className="np-search">
                  <Search size={17} aria-hidden="true" />
                  <span className="np-sr-only">Search spa packages</span>
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search your next experience..."
                    autoComplete="off"
                  />
                </label>
                <label className="np-select">
                  <Users size={17} aria-hidden="true" />
                  <span className="np-sr-only">Filter guest count</span>
                  <select
                    value={guestFilter}
                    onChange={(e) => setGuestFilter(e.target.value as GuestFilter)}
                  >
                    <option value="all">Any group size</option>
                    <option value="solo">Just me</option>
                    <option value="couple">For two</option>
                    <option value="group">Groups 3–4</option>
                  </select>
                </label>
                <label className="np-select">
                  <SlidersHorizontal size={17} aria-hidden="true" />
                  <span className="np-sr-only">Sort packages</span>
                  <select value={sort} onChange={(e) => setSort(e.target.value as SortMode)}>
                    <option value="featured">Curated order</option>
                    <option value="price-asc">Price: low to high</option>
                    <option value="price-desc">Price: high to low</option>
                    <option value="duration">Shortest first</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </label>
              </div>
              <div className="np-toolbar__meta">
                <span role="status" aria-live="polite">
                  {filtered.length} {filtered.length === 1 ? "experience" : "experiences"} found
                </span>
                <button
                  type="button"
                  onClick={reset}
                  disabled={
                    category === "All" && guestFilter === "all" && !query && sort === "featured"
                  }
                >
                  <RotateCcw size={14} aria-hidden="true" /> Reset filters
                </button>
              </div>
            </div>
            {filtered.length ? (
              <div className="np-grid">
                {filtered.map((item, index) => (
                  <PackageCard
                    key={item.slug}
                    item={item}
                    index={index}
                    selected={compare.includes(item.slug)}
                    onCompare={() => toggleCompare(item.slug)}
                    compareDisabled={compare.length === 3 && !compare.includes(item.slug)}
                  />
                ))}
              </div>
            ) : (
              <div className="np-empty" role="status">
                <span>✳</span>
                <h3>No rituals found.</h3>
                <p>Try another mood, group size, or search term.</p>
                <button type="button" className="np-button" onClick={reset}>
                  Reset the collection <ArrowRight size={17} />
                </button>
              </div>
            )}
          </div>
        </section>

        {showComparison && compared.length >= 2 && (
          <section
            id="np-comparison"
            className="np-comparison np-width"
            aria-label="Compare selected packages"
          >
            <div className="np-comparison__top">
              <div>
                <p className="np-kicker">SIDE BY SIDE</p>
                <h2>
                  Find your <em>perfect fit.</em>
                </h2>
              </div>
              <button type="button" onClick={() => setShowComparison(false)}>
                <X size={17} /> Close comparison
              </button>
            </div>
            <div className="np-comparison__scroll">
              <table>
                <thead>
                  <tr>
                    <th scope="col">AT A GLANCE</th>
                    {compared.map((item) => (
                      <th key={item.slug} scope="col">
                        <Link to={`/packages/${item.slug}`}>
                          {item.name} <ArrowUpRight size={14} />
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Experience</th>
                    {compared.map((item) => (
                      <td key={item.slug}>{item.category}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Guests</th>
                    {compared.map((item) => (
                      <td key={item.slug}>{packageGuestLabel(item)}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Starting from</th>
                    {compared.map((item) => (
                      <td key={item.slug}>{formatPackagePrice(basePrice(item))} total</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Session time</th>
                    {compared.map((item) => (
                      <td key={item.slug}>
                        {formatPackageMinutes(Math.min(...item.variants.map((v) => v.minutes)))}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Included</th>
                    {compared.map((item) => (
                      <td key={item.slug}>{item.included.slice(0, 3).join(" · ")}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Explore</th>
                    {compared.map((item) => (
                      <td key={item.slug}>
                        <Link to={`/packages/${item.slug}`}>
                          View experience <ArrowRight size={15} />
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="np-note">
              Sample prices are full package totals. No real inventory is checked.
            </p>
          </section>
        )}

        <section className="np-statement">
          <div className="np-statement__photo">
            <img
              src={PACKAGES[2].hero}
              alt="Quiet spa atmosphere for a shared experience"
              loading="lazy"
            />
          </div>
          <div className="np-statement__overlay" />
          <div className="np-statement__inner np-width np-reveal">
            <p className="np-kicker">THE ART OF BEING TOGETHER</p>
            <h2>
              Some days
              <br />
              are meant to be
              <br />
              <em>shared.</em>
            </h2>
            <p>
              From a couple's ritual to a gathering with friends, a little presence can become a
              lasting memory.
            </p>
            <Link to="/packages/together-in-time" className="np-button np-button--light">
              Discover experiences for two <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>

        <section className="np-how np-width">
          <div className="np-section-cap np-reveal">
            <span>03 / THE JOURNEY</span>
            <span>SIMPLE, BEAUTIFUL, PERSONAL</span>
          </div>
          <div className="np-how__layout">
            <div className="np-reveal">
              <p className="np-kicker">A GENTLER WAY TO PLAN</p>
              <h2>
                It begins
                <br />
                with <em>you.</em>
              </h2>
            </div>
            <div className="np-how__steps np-reveal">
              {[
                [
                  "01",
                  "Discover",
                  "Find the collection that feels right for your mood and the people you bring.",
                ],
                [
                  "02",
                  "Personalize",
                  "Choose your preferred session, optional finishing touches and example house.",
                ],
                [
                  "03",
                  "Preview",
                  "Save a sample request on this device. Live booking is intentionally not connected.",
                ],
              ].map(([n, title, copy]) => (
                <div key={n}>
                  <span>{n}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                  <ArrowUpRight size={19} aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="np-final">
          <p className="np-kicker">A MOMENT WORTH MAKING</p>
          <h2>
            Take the time.
            <br />
            <em>It's yours.</em>
          </h2>
          <Link to="/services" className="np-button np-button--light">
            Explore individual treatments <ArrowUpRight size={18} />
          </Link>
        </section>

        {compare.length > 0 && (
          <aside className="np-compare-dock" aria-label="Package comparison selections">
            <div>
              <strong>{compare.length}/3</strong>
              <span>SELECTED TO COMPARE</span>
            </div>
            <div className="np-compare-dock__names">
              {compared.map((item) => (
                <button
                  type="button"
                  key={item.slug}
                  onClick={() => toggleCompare(item.slug)}
                  aria-label={`Remove ${item.name} from comparison`}
                >
                  {item.name}
                  <X size={13} aria-hidden="true" />
                </button>
              ))}
            </div>
            <button
              type="button"
              className="np-compare-dock__action"
              onClick={compareSelected}
              disabled={compare.length < 2}
            >
              Compare <ArrowUpRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => {
                setCompare([]);
                setShowComparison(false);
              }}
              className="np-compare-dock__clear"
              aria-label="Clear comparison"
            >
              <X size={18} />
            </button>
          </aside>
        )}
      </div>
    </ServicesShell>
  );
}

import {
  LOCATIONS,
  LOCATION_AMENITIES,
  LOCATION_AREAS,
  type LocationAmenity,
  type SpaLocation,
} from "@/content/locations";
import LocationMap from "@/features/locations/components/LocationMap";
import "@/features/locations/locations.css";
import ServicesShell from "@/shared/layout/SiteShell";
import { isMotionReduced, motionQuery, useMotionGSAP } from "@/shared/motion/preferences";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Leaf,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function LocationCard({
  branch,
  active,
  onSelect,
}: {
  branch: SpaLocation;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <article className={`nl-location-card ${active ? "is-active" : ""}`}>
      <Link
        className="nl-location-card__image"
        to={`/locations/${branch.slug}`}
        aria-label={`Discover ${branch.name}`}
      >
        <img src={branch.cover} alt={`Illustrative atmosphere for ${branch.name}`} loading="lazy" />
        <span className="nl-location-card__image-label">{branch.region}</span>
        <span className="nl-location-card__arrow" aria-hidden="true">
          <ArrowUpRight size={22} />
        </span>
      </Link>
      <div className="nl-location-card__body">
        <div className="nl-location-card__meta">
          <span>{branch.id} / 03</span>
          <span>
            <MapPin size={13} aria-hidden="true" /> {branch.neighborhood.toUpperCase()}
          </span>
        </div>
        <h3>
          <Link to={`/locations/${branch.slug}`}>{branch.name}</Link>
        </h3>
        <p>{branch.description}</p>
        <div className="nl-location-card__footer">
          <button type="button" aria-pressed={active} onClick={onSelect}>
            Show on map <MapPin size={14} aria-hidden="true" />
          </button>
          <Link to={`/locations/${branch.slug}`}>
            Explore house <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function LocationsPage() {
  const root = useRef<HTMLDivElement>(null);
  const searchId = "nl-search";
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<(typeof LOCATION_AREAS)[number]>("All");
  const [amenity, setAmenity] = useState<LocationAmenity | "All">("All");
  const [selectedSlug, setSelectedSlug] = useState(LOCATIONS[0].slug);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return LOCATIONS.filter(
      (branch) =>
        (area === "All" || branch.area === area) &&
        (amenity === "All" || branch.amenities.includes(amenity)) &&
        (!needle ||
          `${branch.name} ${branch.neighborhood} ${branch.city} ${branch.description} ${branch.area}`
            .toLocaleLowerCase()
            .includes(needle)),
    );
  }, [query, area, amenity]);

  const selected = filtered.find((branch) => branch.slug === selectedSlug) ?? filtered[0] ?? null;
  const selectMap = (slug: string) => {
    setSelectedSlug(slug);
    if (window.matchMedia("(max-width: 900px)").matches) {
      requestAnimationFrame(() =>
        document
          .getElementById("nl-map-aside")
          ?.scrollIntoView({ behavior: isMotionReduced() ? "auto" : "smooth", block: "start" }),
      );
    }
  };
  const reset = () => {
    setQuery("");
    setArea("All");
    setAmenity("All");
    setSelectedSlug(LOCATIONS[0].slug);
  };

  useMotionGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionQuery(), () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".nl-hero__label", { y: 18, autoAlpha: 0, duration: 0.6 })
          .from(
            ".nl-hero__title span",
            { yPercent: 105, autoAlpha: 0, stagger: 0.13, duration: 1.05 },
            "-=0.18",
          )
          .from(".nl-hero__copy", { y: 28, autoAlpha: 0, duration: 0.75 }, "-=0.35")
          .from(".nl-hero__visual img", { scale: 1.13, duration: 1.45 }, 0);
        gsap.utils.toArray<HTMLElement>(".nl-reveal").forEach((element) => {
          gsap.from(element, {
            y: 32,
            opacity: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 90%", once: true },
          });
        });
      });
      mm.add("(min-width: 900px) and " + motionQuery(), () => {
        gsap.to(".nl-hero__visual img", {
          yPercent: 10,
          ease: "none",
          scrollTrigger: { trigger: ".nl-hero", start: "top top", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <ServicesShell>
      <div className="nl-page" ref={root}>
        <section className="nl-hero" aria-labelledby="nl-hero-title">
          <div className="nl-hero__content">
            <nav className="nl-breadcrumb nl-hero__label" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <span aria-current="page">Our Houses</span>
            </nav>
            <p className="nl-overline nl-hero__label">
              03 DISTINCT ATMOSPHERES · ONE THOUGHTFUL PHILOSOPHY
            </p>
            <h1 id="nl-hero-title" className="nl-hero__title">
              <span>Find your</span>
              <span>
                <em>place to</em>
              </span>
              <span>exhale.</span>
            </h1>
            <div className="nl-hero__bottom nl-hero__copy">
              <p>
                From the heart of the city to a garden-inspired escape, discover spaces designed to
                help you slow down — on your terms.
              </p>
              <a href="#nl-finder" className="nl-lined-link">
                Explore the houses <ArrowDown size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="nl-hero__visual">
            <img
              src={LOCATIONS[0].cover}
              alt="Serene spa ambiance in warm natural tones"
              fetchPriority="high"
            />
            <div className="nl-hero__visual-caption">
              <span>EVERY JOURNEY BEGINS WITH A PAUSE</span>
              <span>✳</span>
            </div>
          </div>
          <div className="nl-hero__edition" aria-hidden="true">
            NOVRA / PLACES / 2026
          </div>
        </section>

        <section className="nl-intro nl-wrap nl-reveal" aria-label="A place made for you">
          <p className="nl-overline">01 / A DIFFERENT KIND OF DESTINATION</p>
          <div>
            <h2 className="nl-display">
              Not just <em>somewhere.</em>
              <br />
              Somewhere <em>for you.</em>
            </h2>
            <p>
              Every NOVRA house is imagined with its own mood, yet shares one intention: an
              atmosphere where the outside world can soften for a little while.
            </p>
          </div>
        </section>

        <section className="nl-finder" id="nl-finder" aria-labelledby="nl-finder-title">
          <div className="nl-wrap">
            <div className="nl-section-cap nl-reveal">
              <span>02 / THE COLLECTION</span>
              <span>FIND YOUR SANCTUARY</span>
            </div>
            <div className="nl-finder__heading nl-reveal">
              <div>
                <p className="nl-overline">DISCOVER OUR SPACES</p>
                <h2 id="nl-finder-title" className="nl-display">
                  A house for
                  <br />
                  <em>every feeling.</em>
                </h2>
              </div>
              <p>
                Search by atmosphere, neighborhood or what matters to you most. Every house has
                something different to discover.
              </p>
            </div>

            <div className="nl-controls nl-reveal">
              <div
                className="nl-filter-tabs"
                role="group"
                aria-label="Filter locations by atmosphere"
              >
                {LOCATION_AREAS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={area === option ? "is-active" : ""}
                    onClick={() => setArea(option)}
                    aria-pressed={area === option}
                  >
                    {option}
                    <span>
                      {option === "All"
                        ? String(LOCATIONS.length).padStart(2, "0")
                        : String(LOCATIONS.filter((x) => x.area === option).length).padStart(
                            2,
                            "0",
                          )}
                    </span>
                  </button>
                ))}
              </div>
              <div className="nl-controls__row">
                <label className="nl-search" htmlFor={searchId}>
                  <Search size={18} aria-hidden="true" />
                  <input
                    id={searchId}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search neighborhood or house"
                    autoComplete="off"
                  />
                  {query && (
                    <button type="button" aria-label="Clear search" onClick={() => setQuery("")}>
                      <X size={17} />
                    </button>
                  )}
                </label>
                <label className="nl-select">
                  <SlidersHorizontal size={17} aria-hidden="true" />
                  <span className="nl-sr-only">Filter by amenity</span>
                  <select
                    value={amenity}
                    onChange={(event) => setAmenity(event.target.value as LocationAmenity | "All")}
                  >
                    <option value="All">Every amenity</option>
                    {LOCATION_AMENITIES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="nl-controls__meta">
                <span aria-live="polite">
                  {filtered.length} {filtered.length === 1 ? "sanctuary" : "sanctuaries"} found ·
                  fictional demo locations
                </span>
                <button
                  type="button"
                  onClick={reset}
                  disabled={area === "All" && amenity === "All" && !query}
                >
                  Reset filters <X size={14} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="nl-finder__layout">
              <div className="nl-location-list">
                {filtered.length ? (
                  filtered.map((branch) => (
                    <LocationCard
                      key={branch.slug}
                      branch={branch}
                      active={selected?.slug === branch.slug}
                      onSelect={() => selectMap(branch.slug)}
                    />
                  ))
                ) : (
                  <div className="nl-empty" role="status">
                    <Leaf size={37} strokeWidth={1.2} />
                    <h3>No spaces found.</h3>
                    <p>Try another neighborhood or remove an amenity filter.</p>
                    <button type="button" className="nl-action nl-action--dark" onClick={reset}>
                      Show all houses <ArrowRight size={17} />
                    </button>
                  </div>
                )}
              </div>
              <aside className="nl-map-aside" id="nl-map-aside" aria-label="Selected location map">
                <div className="nl-map-aside__top">
                  <span>EXPLORE THE NEIGHBORHOOD</span>
                  <MapPin size={16} aria-hidden="true" />
                </div>
                {selected ? (
                  <>
                    <LocationMap branch={selected} />
                    <div className="nl-map-aside__details">
                      <span>
                        {selected.id} / {selected.region}
                      </span>
                      <h3>{selected.name}</h3>
                      <p>
                        {selected.neighborhood} · {selected.city}
                      </p>
                      <Link to={`/locations/${selected.slug}`}>
                        View this house <ArrowUpRight size={17} aria-hidden="true" />
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="nl-map-aside__empty">Adjust filters to show a map.</div>
                )}
              </aside>
            </div>
          </div>
        </section>

        <section className="nl-difference">
          <div className="nl-wrap nl-difference__inner">
            <div className="nl-reveal">
              <p className="nl-overline">03 / THE NOVRA FEELING</p>
              <h2 className="nl-display">
                Different spaces.
                <br />
                <em>One intention.</em>
              </h2>
            </div>
            <div className="nl-difference__lines">
              <div className="nl-reveal">
                <span>01 / THE SPACE</span>
                <h3>Room to breathe.</h3>
                <p>A considered atmosphere that makes slowing down feel natural.</p>
              </div>
              <div className="nl-reveal">
                <span>02 / THE TOUCH</span>
                <h3>Care at your pace.</h3>
                <p>Experiences shaped by your choices, not a fixed formula.</p>
              </div>
              <div className="nl-reveal">
                <span>03 / THE RETURN</span>
                <h3>A quieter kind of day.</h3>
                <p>Time that feels like it belongs entirely to you.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="nl-final">
          <img
            src={LOCATIONS[2].cover}
            alt="Botanical-inspired wellness atmosphere"
            loading="lazy"
          />
          <div className="nl-final__shade" />
          <div className="nl-wrap nl-final__content nl-reveal">
            <p className="nl-overline">YOU'RE RIGHT WHERE YOU NEED TO BE</p>
            <h2>
              Come as you are.
              <br />
              <em>Leave a little lighter.</em>
            </h2>
            <Link className="nl-action nl-action--light" to="/services">
              Discover the treatments <ArrowUpRight size={20} />
            </Link>
            <p>Explore rituals first — booking in this template is a local-only demonstration.</p>
          </div>
        </section>
      </div>
    </ServicesShell>
  );
}

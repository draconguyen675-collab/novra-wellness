import { PACKAGES } from "@/content/packages";
import { SERVICES, type Service, type ServiceCategory } from "@/content/services";
import BookingPreview from "@/features/booking/components/BookingPreview";
import "@/features/pricing/pricing.css";
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
  ChevronDown,
  Clock3,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Category = "All" | ServiceCategory;
type Selection = Record<string, number>;
const currency = (n: number) => `$${n.toLocaleString("en-US")}`;
const minutesText = (minutes: number) =>
  minutes < 60
    ? `${minutes} min`
    : `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}m` : ""}`;
const categories: Category[] = ["All", "Body", "Skin", "Ritual"];
const photo =
  "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1400&q=85";
const quotePhoto =
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1800&q=85";
const faq = [
  {
    q: "Are these prices final?",
    a: "No. This is a demonstration website. Prices are illustrative; real spa operators should replace them with their own pricing, fees, policies and taxes.",
  },
  {
    q: "Can I combine several treatments?",
    a: "Yes. Choose one or more treatments in the price atelier. The calculator adds their prices and durations. It does not verify the real-time availability of a therapist or treatment room.",
  },
  {
    q: "Is the package price per guest?",
    a: "Package prices shown here are total prices for the stated number of guests. Always check the specific package variant before proceeding.",
  },
  {
    q: "Can I reserve a real appointment?",
    a: "Not in this frontend demo. Booking Preview stores an example request locally in your browser only; no real appointment is made or payment accepted.",
  },
];

function AnimatedNumber({ value }: { value: number }) {
  const span = useRef<HTMLSpanElement>(null);
  const previous = useRef(value);
  useMotionGSAP(
    () => {
      if (!span.current) return;
      if (isMotionReduced()) {
        span.current.textContent = currency(value);
        previous.current = value;
        return;
      }
      const counter = { amount: previous.current };
      gsap.to(counter, {
        amount: value,
        duration: 0.75,
        ease: "power2.out",
        onUpdate: () => {
          if (span.current) span.current.textContent = currency(Math.round(counter.amount));
        },
      });
      previous.current = value;
    },
    { dependencies: [value] },
  );
  return <span ref={span}>{currency(value)}</span>;
}

function ServicePriceRow({
  service,
  choice,
  onChange,
}: {
  service: Service;
  choice: number | undefined;
  onChange: (minutes: number | null) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const option = service.durationOptions.find((d) => d.minutes === choice);
  return (
    <div
      className={`nprice-row ${choice != null ? "is-selected" : ""} ${expanded ? "is-expanded" : ""}`}
    >
      <div className="nprice-row__head">
        <button
          type="button"
          className="nprice-row__title"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          <span className="nprice-row__thumb">
            <img src={service.image} alt="" loading="lazy" />
          </span>
          <span>
            <small>
              {service.category.toUpperCase()} · {service.tag.toUpperCase()}
            </small>
            <strong>{service.name}</strong>
          </span>
          <ChevronDown className="nprice-row__chevron" size={18} aria-hidden="true" />
        </button>
        <div className="nprice-row__value">
          <small>STARTING AT</small>
          <b>{currency(Math.min(...service.durationOptions.map((d) => d.price)))}</b>
        </div>
        <button
          type="button"
          className="nprice-row__expand"
          onClick={() => setExpanded((v) => !v)}
          aria-label={`${expanded ? "Close" : "View"} ${service.name} duration options`}
        >
          {expanded ? <Minus size={17} /> : <Plus size={17} />}
        </button>
      </div>
      {expanded && (
        <div className="nprice-row__body">
          <p>{service.description}</p>
          <div
            className="nprice-row__options"
            role="group"
            aria-label={`Select duration for ${service.name}`}
          >
            {service.durationOptions.map((option) => (
              <button
                type="button"
                key={option.minutes}
                className={choice === option.minutes ? "is-active" : ""}
                aria-pressed={choice === option.minutes}
                onClick={() => onChange(choice === option.minutes ? null : option.minutes)}
              >
                <Clock3 size={13} />
                {option.minutes} min <span>{currency(option.price)}</span>
                {choice === option.minutes && <Check size={14} />}
              </button>
            ))}
          </div>
          <div className="nprice-row__body-bottom">
            <Link to={`/services/${service.slug}`}>
              Explore treatment <ArrowUpRight size={15} />
            </Link>
            {option && (
              <span className="nprice-sel-confirm">
                <Check size={14} /> Added · {minutesText(option.minutes)} · {currency(option.price)}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PricingPage() {
  const container = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<Category>("All");
  const [choices, setChoices] = useState<Selection>({});
  const [booking, setBooking] = useState(false);

  const filtered = useMemo(
    () => SERVICES.filter((s) => category === "All" || s.category === category),
    [category],
  );
  const selectedItems = useMemo(
    () =>
      SERVICES.flatMap((service) => {
        const mins = choices[service.id];
        const chosen = service.durationOptions.find((opt) => opt.minutes === mins);
        return chosen ? [{ service, option: chosen }] : [];
      }),
    [choices],
  );
  const total = selectedItems.reduce((sum, entry) => sum + entry.option.price, 0);
  const duration = selectedItems.reduce((sum, entry) => sum + entry.option.minutes, 0);
  const packages = PACKAGES.slice(0, 3);

  useMotionGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionQuery(), () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(
          ".nprice-hero__line > span",
          { yPercent: 115, rotate: 3 },
          { yPercent: 0, rotate: 0, duration: 1.25, stagger: 0.12 },
          0.05,
        )
          .fromTo(
            ".nprice-hero__kicker,.nprice-hero__description,.nprice-hero__link",
            { y: 35, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.85, stagger: 0.12 },
            0.3,
          )
          .fromTo(
            ".nprice-hero__photo",
            { clipPath: "inset(0 0 100% 0)", scale: 1.1 },
            { clipPath: "inset(0 0 0% 0)", scale: 1, duration: 1.55, ease: "expo.inOut" },
            0.05,
          );
        gsap.fromTo(
          ".nprice-quote__photo img",
          { scale: 1.16, yPercent: -7 },
          {
            scale: 1.02,
            yPercent: 7,
            ease: "none",
            scrollTrigger: {
              trigger: ".nprice-quote",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
        gsap.fromTo(
          ".nprice-quote__headline",
          { yPercent: 28, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".nprice-quote",
              start: "top 75%",
              end: "center 40%",
              scrub: 0.8,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: container },
  );

  const changeSelection = (id: string, minutes: number | null) =>
    setChoices((old) => {
      const next = { ...old };
      if (minutes == null) delete next[id];
      else next[id] = minutes;
      return next;
    });

  return (
    <ServicesShell>
      <div className="nprice-site" ref={container}>
        {/* 01 — Editorial split hero */}
        <section className="nprice-hero" aria-labelledby="nprice-heading">
          <div className="nprice-hero__content">
            <div className="nprice-hero__kicker">NOVRA / PRICING INDEX — 2026</div>
            <h1 id="nprice-heading" className="nprice-hero__headline">
              <span className="nprice-hero__line">
                <span>Time is</span>
              </span>
              <span className="nprice-hero__line">
                <span>the true</span>
              </span>
              <span className="nprice-hero__line">
                <span>
                  <em>luxury.</em>
                </span>
              </span>
            </h1>
            <div className="nprice-hero__bottom">
              <p className="nprice-hero__description">
                An invitation to make space for yourself. Clear, thoughtful example pricing for
                every moment of care.
              </p>
              <a className="nprice-hero__link" href="#nprice-explorer">
                EXPLORE OUR PRICES <ArrowDown size={18} />
              </a>
            </div>
            <div className="nprice-hero__edition">01 / A COLLECTION OF MOMENTS</div>
          </div>
          <div className="nprice-hero__visual">
            <div className="nprice-hero__photo">
              <img
                src={photo}
                alt="Warm spa space with soft lighting and quiet treatment rooms"
                fetchPriority="high"
              />
            </div>
            <span className="nprice-hero__image-label">
              GIVE YOURSELF THE TIME YOU NEED / NOVRA
            </span>
            <div className="nprice-hero__seal">
              <Sparkles size={19} />
              <span>
                SLOW LIVING
                <br />
                FOR EVERY DAY
              </span>
            </div>
          </div>
        </section>

        {/* 02 — Brand editorial */}
        <section className="nprice-intro nprice-width" data-nm-reveal>
          <div className="nprice-section-index">
            <span>01 / THE INVITATION</span>
            <span>CONSIDERED, ALWAYS.</span>
          </div>
          <div className="nprice-intro__grid">
            <p className="nprice-mini">TIME WELL SPENT.</p>
            <div>
              <h2>
                Beauty in the <em>ordinary.</em>
                <br />
                Care beyond the <em>expected.</em>
              </h2>
              <p>
                Every experience has a rhythm of its own. Explore treatments, compare the time you
                want to spend, and build a moment that feels entirely yours.
              </p>
            </div>
          </div>
        </section>

        {/* 03 — Live price atelier */}
        <section
          className="nprice-explorer"
          id="nprice-explorer"
          aria-labelledby="nprice-explorer-title"
        >
          <div className="nprice-width">
            <div className="nprice-section-index">
              <span>02 / PRICE ATELIER</span>
              <span>BUILD YOUR OWN RITUAL</span>
            </div>
            <div className="nprice-explorer__heading" data-nm-reveal>
              <div>
                <span className="nprice-mini">THE COLLECTION / {SERVICES.length} EXPERIENCES</span>
                <h2 id="nprice-explorer-title">
                  Find your
                  <br />
                  <em>perfect pace.</em>
                </h2>
              </div>
              <p>
                Select your treatments, choose durations and see an estimated total in real time. No
                complicated surprises.
              </p>
            </div>
            <div className="nprice-tabs" role="group" aria-label="Treatment categories">
              {categories.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={category === item ? "is-active" : ""}
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                >
                  {item === "All" ? "ALL EXPERIENCES" : item.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="nprice-explorer__layout">
              <div className="nprice-treatment-list">
                {filtered.map((service) => (
                  <ServicePriceRow
                    key={service.id}
                    service={service}
                    choice={choices[service.id]}
                    onChange={(minutes) => changeSelection(service.id, minutes)}
                  />
                ))}
              </div>
              <aside className="nprice-summary" aria-label="Your example ritual summary">
                <div className="nprice-summary__heading">
                  <span>YOUR PRIVATE MOMENT</span>
                  <span>✳</span>
                </div>
                <h3>
                  Craft your
                  <br />
                  <em>own pause.</em>
                </h3>
                <p>Combine experiences to create your ideal visit.</p>
                {selectedItems.length ? (
                  <ul className="nprice-summary__selection">
                    {selectedItems.map(({ service, option }) => (
                      <li key={service.id}>
                        <div>
                          <strong>{service.name}</strong>
                          <span>
                            {option.minutes} MIN · {currency(option.price)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => changeSelection(service.id, null)}
                          aria-label={`Remove ${service.name}`}
                        >
                          <Minus size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="nprice-summary__empty">
                    <span className="nprice-summary__flower">✳</span>
                    <span>Begin with a little time for yourself.</span>
                    <small>Choose a duration from any treatment to begin.</small>
                  </div>
                )}
                <div className="nprice-summary__total">
                  <div>
                    <span>YOUR EXPERIENCES</span>
                    <strong>{selectedItems.length.toString().padStart(2, "0")}</strong>
                  </div>
                  <div>
                    <span>ESTIMATED DURATION</span>
                    <strong>{minutesText(duration)}</strong>
                  </div>
                  <div className="nprice-summary__price">
                    <span>ESTIMATED TOTAL</span>
                    <strong>
                      <AnimatedNumber value={total} />
                    </strong>
                  </div>
                </div>
                <button
                  type="button"
                  className="nprice-summary__cta"
                  onClick={() => setBooking(true)}
                  disabled={!selectedItems.length}
                >
                  PREVIEW MY RITUAL <ArrowUpRight size={18} />
                </button>
                {selectedItems.length > 0 && (
                  <button
                    type="button"
                    className="nprice-summary__reset"
                    onClick={() => setChoices({})}
                  >
                    <RotateCcw size={14} /> CLEAR SELECTION
                  </button>
                )}
                <small className="nprice-summary__disclaimer">
                  Demo estimate only. Multiple treatments and durations are summed sequentially. No
                  availability, taxes, fees or payments are verified.
                </small>
              </aside>
            </div>
          </div>
        </section>

        {/* 04 — Cinematic quote / scroll photo */}
        <section className="nprice-quote" aria-labelledby="nprice-quote-heading">
          <div className="nprice-quote__photo">
            <img src={quotePhoto} alt="" loading="lazy" />
          </div>
          <div className="nprice-quote__shade" />
          <div className="nprice-quote__content">
            <span>03 / AN INVITATION TO SLOW DOWN</span>
            <h2 id="nprice-quote-heading" className="nprice-quote__headline">
              Less rushing.
              <br />
              <em>More living.</em>
            </h2>
            <p>What you choose to make time for can change the whole feeling of a day.</p>
          </div>
          <span className="nprice-quote__number">NOVRA / 03</span>
        </section>

        {/* 05 — Curated packages */}
        <section className="nprice-packages nprice-width" aria-labelledby="nprice-packages-heading">
          <div className="nprice-section-index">
            <span>04 / CURATED EXPERIENCES</span>
            <span>MAKE MORE ROOM</span>
          </div>
          <div className="nprice-packages__top" data-nm-reveal>
            <div>
              <span className="nprice-mini">MORE TIME TOGETHER</span>
              <h2 id="nprice-packages-heading">
                Beautifully
                <br />
                <em>considered.</em>
              </h2>
            </div>
            <Link to="/packages" className="nprice-underlink">
              VIEW ALL PACKAGES <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="nprice-packages__grid">
            {packages.map((pack, index) => (
              <Link
                to={`/packages/${pack.slug}`}
                className="nprice-package"
                key={pack.slug}
                data-nm-reveal
              >
                <div className="nprice-package__photo" data-nm-media>
                  <img
                    src={pack.hero}
                    alt={`Experience atmosphere for ${pack.name}`}
                    loading="lazy"
                  />
                </div>
                <div className="nprice-package__bar">
                  <span>
                    0{index + 1} / {pack.category.toUpperCase()}
                  </span>
                  <ArrowUpRight size={21} />
                </div>
                <h3>{pack.name}</h3>
                <p>{pack.subtitle}</p>
                <div className="nprice-package__facts">
                  <span>
                    <Clock3 size={15} /> {minutesText(pack.variants[0].minutes)}
                  </span>
                  <strong>FROM {currency(Math.min(...pack.variants.map((v) => v.price)))}</strong>
                </div>
                <small>PRICE IS TOTAL PER PACKAGE, NOT PER GUEST</small>
              </Link>
            ))}
          </div>
        </section>

        {/* 06 — A transparent example policy & FAQ */}
        <section className="nprice-faq">
          <div className="nprice-width">
            <div className="nprice-section-index">
              <span>05 / GOOD TO KNOW</span>
              <span>LET'S KEEP THINGS CLEAR</span>
            </div>
            <div className="nprice-faq__layout">
              <div data-nm-reveal>
                <span className="nprice-mini">A FEW THINGS FIRST</span>
                <h2>
                  Answers, <em>gently.</em>
                </h2>
                <p>Clarity is part of care. A few notes before you begin.</p>
              </div>
              <div className="nprice-faq__items">
                {faq.map((entry, index) => (
                  <details key={entry.q} data-nm-reveal>
                    <summary>
                      <span>0{index + 1}</span>
                      <strong>{entry.q}</strong>
                      <Plus size={20} />
                    </summary>
                    <p>{entry.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 07 — CTA */}
        <section className="nprice-end">
          <div className="nprice-width" data-nm-reveal>
            <span>YOUR MOMENT BEGINS HERE</span>
            <h2>
              Give yourself <em>space.</em>
            </h2>
            <div>
              <p>Explore individual treatments or combine the experiences you love.</p>
              <Link to="/services" className="nprice-end__cta">
                DISCOVER TREATMENTS <ArrowRight size={19} />
              </Link>
            </div>
            <span className="nprice-end__asterisk">✳</span>
          </div>
        </section>

        {booking && selectedItems.length > 0 && (
          <BookingPreview
            selected={{
              name: selectedItems.map((entry) => entry.service.name).join(" + "),
              price: total,
              minutes: duration,
            }}
            onClose={() => setBooking(false)}
          />
        )}
      </div>
    </ServicesShell>
  );
}

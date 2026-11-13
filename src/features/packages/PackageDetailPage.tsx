import { LOCATIONS } from "@/content/locations";
import {
  PACKAGES,
  calculatePackage,
  formatPackageMinutes,
  formatPackagePrice,
  getPackageAddOns,
  getPackageBySlug,
  packageGuestLabel,
  type SpaPackage,
} from "@/content/packages";
import { SERVICES } from "@/content/services";
import BookingPreview from "@/features/booking/components/BookingPreview";
import "@/features/packages/packages.css";
import ServicesShell from "@/shared/layout/SiteShell";
import { motionQuery, useMotionGSAP } from "@/shared/motion/preferences";
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
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Plus,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function ImageLightbox({
  item,
  selected,
  onClose,
  onSelect,
}: {
  item: SpaPackage;
  selected: number;
  onClose: () => void;
  onSelect: (next: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const pictures = [item.hero, ...item.gallery];
  const currentIndex = useRef(selected);
  const callbacks = useRef({ onClose, onSelect });
  currentIndex.current = selected;
  callbacks.current = { onClose, onSelect };
  useEffect(() => {
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const keyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") callbacks.current.onClose();
      if (e.key === "ArrowLeft")
        callbacks.current.onSelect((currentIndex.current - 1 + pictures.length) % pictures.length);
      if (e.key === "ArrowRight")
        callbacks.current.onSelect((currentIndex.current + 1) % pictures.length);
      if (e.key === "Tab") {
        const focus = document.querySelectorAll<HTMLElement>(".np-lightbox button:not(:disabled)");
        if (focus.length < 2) return;
        const first = focus[0],
          last = focus[focus.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", keyDown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", keyDown);
      previousFocus?.focus();
    };
  }, [pictures.length]);
  return (
    <div
      className="np-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.name} gallery`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        ref={closeRef}
        className="np-lightbox__close"
        type="button"
        onClick={onClose}
        aria-label="Close gallery"
      >
        <X size={23} />
      </button>
      <button
        className="np-lightbox__arrow"
        type="button"
        onClick={() => onSelect((selected - 1 + pictures.length) % pictures.length)}
        aria-label="Previous photo"
      >
        <ChevronLeft size={26} />
      </button>
      <figure>
        <img
          src={pictures[selected]}
          alt={`${item.name} editorial gallery photograph ${selected + 1} of ${pictures.length}`}
        />
        <figcaption>
          {item.name.toUpperCase()} / {String(selected + 1).padStart(2, "0")} OF{" "}
          {String(pictures.length).padStart(2, "0")}
        </figcaption>
      </figure>
      <button
        className="np-lightbox__arrow"
        type="button"
        onClick={() => onSelect((selected + 1) % pictures.length)}
        aria-label="Next photo"
      >
        <ChevronRight size={26} />
      </button>
    </div>
  );
}

export default function PackageDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const item = getPackageBySlug(slug);
  const rootRef = useRef<HTMLDivElement>(null);
  const [variantId, setVariantId] = useState(item?.variants[0]?.id ?? "");
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [branchSlug, setBranchSlug] = useState(item?.branchSlugs[0] ?? "");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [openedFaq, setOpenedFaq] = useState<number | null>(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    setVariantId(item?.variants[0]?.id ?? "");
    setAddOnIds([]);
    setBranchSlug(item?.branchSlugs[0] ?? "");
    setOpenedFaq(0);
    setBookingOpen(false);
    setLightboxIndex(null);
  }, [item?.slug]);

  const variant = item?.variants.find((option) => option.id === variantId) ?? item?.variants[0];
  const availableAddOns = useMemo(() => (item ? getPackageAddOns(item) : []), [item]);
  const selectedAddOns = availableAddOns.filter((a) => addOnIds.includes(a.id));
  const total = variant ? calculatePackage(variant, selectedAddOns) : null;
  const branch = LOCATIONS.find((location) => location.slug === branchSlug);
  const related = PACKAGES.filter(
    (p) =>
      p.slug !== item?.slug &&
      (p.category === item?.category || p.variants.some((v) => v.guests === variant?.guests)),
  ).slice(0, 3);
  const includedServices = SERVICES.filter((s) => item?.serviceSlugs.includes(s.slug));
  const gallery = item ? [item.hero, ...item.gallery] : [];
  const toggleAddOn = (id: string) =>
    setAddOnIds((previous) =>
      previous.includes(id) ? previous.filter((v) => v !== id) : [...previous, id],
    );

  useMotionGSAP(
    () => {
      if (!item) return;
      const mm = gsap.matchMedia();
      mm.add(motionQuery(), () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".np-detail-hero__tag", { y: 18, autoAlpha: 0, duration: 0.65 })
          .from(
            ".np-detail-hero__title span",
            { yPercent: 105, autoAlpha: 0, duration: 1.1, stagger: 0.15 },
            "-=.25",
          )
          .from(".np-detail-hero__intro", { y: 24, autoAlpha: 0, duration: 0.75 }, "-=.4")
          .from(
            ".np-detail-hero__visual",
            { clipPath: "inset(0 0 100% 0)", duration: 1.15, ease: "power3.inOut" },
            0.15,
          );
        gsap.utils.toArray<HTMLElement>(".np-detail-reveal").forEach((el) =>
          gsap.from(el, {
            y: 32,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          }),
        );
      });
      mm.add("(min-width: 900px) and " + motionQuery(), () =>
        gsap.to(".np-detail-hero__visual img", {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: ".np-detail-hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }),
      );
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [item?.slug], revertOnUpdate: true },
  );

  if (!item || !variant || !total)
    return (
      <ServicesShell>
        <div className="np-missing">
          <p className="np-kicker">404 / COLLECTION</p>
          <h1>
            This ritual has <em>drifted away.</em>
          </h1>
          <p>We couldn't find that package in our collection.</p>
          <Link to="/packages" className="np-button">
            Return to packages <ArrowLeft size={17} />
          </Link>
        </div>
      </ServicesShell>
    );

  return (
    <ServicesShell>
      <div className="np-site np-detail" ref={rootRef}>
        <section className="np-detail-hero" aria-labelledby="np-detail-title">
          <div className="np-detail-hero__copy">
            <nav className="np-breadcrumb np-detail-hero__tag" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/packages">Packages</Link>
              <span>/</span>
              <span aria-current="page">{item.name}</span>
            </nav>
            <p className="np-kicker np-detail-hero__tag">
              {item.id} / THE COLLECTION · {item.category.toUpperCase()}
            </p>
            <h1 id="np-detail-title" className="np-detail-hero__title">
              <span>{item.name.split(" ").slice(0, -1).join(" ")}</span>
              <span>
                <em>{item.name.split(" ").slice(-1)[0]}</em>
              </span>
            </h1>
            <p className="np-detail-hero__intro">{item.description}</p>
            <div className="np-detail-hero__facts np-detail-hero__intro">
              <span>
                <Users size={16} /> {packageGuestLabel(item)}
              </span>
              <span>
                <Clock3 size={16} /> {formatPackageMinutes(variant.minutes)}
              </span>
              <span>FROM {formatPackagePrice(Math.min(...item.variants.map((v) => v.price)))}</span>
            </div>
            <a className="np-underline-link np-detail-hero__intro" href="#np-configure">
              Create your moment <ArrowDown size={17} />
            </a>
            <div className="np-detail-hero__number" aria-hidden="true">
              {item.id}
            </div>
          </div>
          <div className="np-detail-hero__visual">
            <img
              src={item.hero}
              alt={`Luxury wellness interior inspired by ${item.name}`}
              fetchPriority="high"
            />
            <span className="np-detail-hero__image-caption">
              A COLLECTION OF MOMENTS, NOT MINUTES
            </span>
          </div>
        </section>

        <section className="np-detail-quote np-width np-detail-reveal">
          <p className="np-kicker">01 / A PERSONAL INVITATION</p>
          <blockquote>“{item.quote}”</blockquote>
          <span>— NOVRA WELLNESS HOUSE / SAMPLE COLLECTION</span>
        </section>

        <section className="np-detail-content np-width" id="np-configure">
          <div className="np-section-cap np-detail-reveal">
            <span>02 / YOUR EXPERIENCE</span>
            <span>PERSONALIZE YOUR TIME</span>
          </div>
          <div className="np-detail-content__layout">
            <div className="np-detail-content__story">
              <div className="np-detail-reveal">
                <p className="np-kicker">UNFOLD YOUR EXPERIENCE</p>
                <h2>
                  Every detail,
                  <br />
                  <em>considered.</em>
                </h2>
                <p>{item.description}</p>
              </div>
              <div className="np-detail-includes np-detail-reveal">
                <h3>What is included</h3>
                <ul>
                  {item.included.map((line) => (
                    <li key={line}>
                      <Check size={18} aria-hidden="true" />
                      {line}
                    </li>
                  ))}
                </ul>
                <p>
                  All activities are illustrative and subject to the selected package variation.
                </p>
              </div>
              <div className="np-detail-reveal">
                <h3 className="np-detail-minor-heading">Designed for</h3>
                <div className="np-detail-tags">
                  {item.idealFor.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className="np-detail-reveal">
                <h3 className="np-detail-minor-heading">Explore included treatments</h3>
                <div className="np-detail-treatments">
                  {includedServices.map((service) => (
                    <Link to={`/services/${service.slug}`} key={service.slug}>
                      <span>{service.name}</span>
                      <ArrowUpRight size={17} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <aside className="np-config" aria-labelledby="np-config-title">
              <div className="np-config__top">
                <p className="np-kicker">MAKE IT YOURS</p>
                <h2 id="np-config-title">
                  Your <em>moment.</em>
                </h2>
                <span>FRONTEND BOOKING PREVIEW</span>
              </div>
              <fieldset className="np-config__group">
                <legend>01 / Choose your experience</legend>
                <div className="np-variant-list">
                  {item.variants.map((option) => (
                    <label
                      key={option.id}
                      className={`np-variant ${variant.id === option.id ? "is-selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="np-package-variant"
                        value={option.id}
                        checked={variant.id === option.id}
                        onChange={() => setVariantId(option.id)}
                      />
                      <span className="np-variant__radio" aria-hidden="true" />
                      <span className="np-variant__content">
                        <strong>{option.label}</strong>
                        <small>
                          {option.guests} {option.guests === 1 ? "guest" : "guests"} ·{" "}
                          {formatPackageMinutes(option.minutes)}
                        </small>
                        <small>{option.detail}</small>
                      </span>
                      <b>{formatPackagePrice(option.price)}</b>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="np-config__group">
                <legend>02 / Optional finishing touches</legend>
                <div className="np-addon-list">
                  {availableAddOns.map((addon) => {
                    const checked = addOnIds.includes(addon.id);
                    const additional =
                      addon.price * (addon.pricing === "per-guest" ? variant.guests : 1);
                    return (
                      <label key={addon.id} className={`np-addon ${checked ? "is-selected" : ""}`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAddOn(addon.id)}
                        />
                        <span className="np-addon__box" aria-hidden="true">
                          {checked ? <Check size={15} /> : <Plus size={15} />}
                        </span>
                        <span>
                          <strong>{addon.title}</strong>
                          <small>{addon.detail}</small>
                          <small>
                            {addon.minutes ? `+${addon.minutes} min · ` : ""}
                            {addon.pricing === "per-guest"
                              ? `per guest × ${variant.guests}`
                              : "per booking"}
                          </small>
                        </span>
                        <b>+{formatPackagePrice(additional)}</b>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <div className="np-config__group">
                <label className="np-config__select-label" htmlFor="np-location-select">
                  03 / Preferred example house
                </label>
                <div className="np-config__select-wrap">
                  <MapPin size={17} aria-hidden="true" />
                  <select
                    id="np-location-select"
                    value={branchSlug}
                    onChange={(e) => setBranchSlug(e.target.value)}
                  >
                    {item.branchSlugs.map((s) => {
                      const loc = LOCATIONS.find((l) => l.slug === s);
                      return loc ? (
                        <option key={s} value={s}>
                          {loc.name} · {loc.neighborhood}
                        </option>
                      ) : null;
                    })}
                  </select>
                  <ChevronDown size={18} aria-hidden="true" />
                </div>
                <p className="np-config__disclaimer">
                  Example branches only. No live capacity or opening hours checked.
                </p>
              </div>
              <div className="np-config__summary" aria-live="polite">
                <div>
                  <span>Package · {variant.guests} guests</span>
                  <strong>{formatPackagePrice(variant.price)}</strong>
                </div>
                {total.additions.map((a) => (
                  <div key={a.title}>
                    <span>{a.title}</span>
                    <strong>{formatPackagePrice(a.amount)}</strong>
                  </div>
                ))}
                <div className="np-config__total">
                  <span>Estimated package total</span>
                  <strong>{formatPackagePrice(total.price)}</strong>
                </div>
                <p>
                  <Clock3 size={15} aria-hidden="true" /> Approx.{" "}
                  {formatPackageMinutes(total.minutes)} elapsed time · {variant.guests} guests
                </p>
              </div>
              <button
                type="button"
                className="np-button np-config__book"
                onClick={() => setBookingOpen(true)}
              >
                Preview your booking <ArrowUpRight size={20} />
              </button>
              <p className="np-config__footnote">
                No payment, availability hold or appointment confirmation. Example request saved
                locally only.
              </p>
            </aside>
          </div>
        </section>

        <section className="np-detail-itinerary np-width" aria-labelledby="np-itinerary-title">
          <div className="np-section-cap np-detail-reveal">
            <span>03 / THE FLOW</span>
            <span>AN UNHURRIED SEQUENCE</span>
          </div>
          <div className="np-detail-itinerary__heading np-detail-reveal">
            <p className="np-kicker">A MOMENT AT A TIME</p>
            <h2 id="np-itinerary-title">
              The experience
              <br />
              <em>unfolds.</em>
            </h2>
          </div>
          <div className="np-detail-itinerary__grid">
            {item.itinerary.map((step) => (
              <article key={step.number} className="np-itinerary-card np-detail-reveal">
                <span>{step.number} / 03</span>
                <h3>{step.title}</h3>
                <small>{step.duration} · ILLUSTRATIVE</small>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="np-detail-gallery" aria-labelledby="np-gallery-heading">
          <div className="np-width">
            <div className="np-section-cap np-detail-reveal">
              <span>04 / A SENSE OF PLACE</span>
              <span>QUIET MOMENTS, BEAUTIFULLY FRAMED</span>
            </div>
            <div className="np-detail-gallery__heading np-detail-reveal">
              <h2 id="np-gallery-heading">
                Stay a <em>little longer.</em>
              </h2>
              <p>
                Explore an editorial glimpse into the textures, spaces and details of this imaginary
                wellness collection.
              </p>
            </div>
            <div className="np-detail-gallery__grid">
              {item.gallery.map((src, idx) => (
                <button
                  type="button"
                  key={`${item.slug}-${idx}`}
                  className={`np-detail-gallery__image np-detail-gallery__image--${idx}`}
                  onClick={() => setLightboxIndex(idx + 1)}
                  aria-label={`Open gallery image ${idx + 2} of ${gallery.length}`}
                >
                  <img src={src} loading="lazy" alt={`${item.name} spa gallery scene ${idx + 1}`} />
                  <span>
                    VIEW PHOTO 0{idx + 2} <ArrowUpRight size={18} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="np-detail-faq np-width" aria-labelledby="np-faq-title">
          <div className="np-section-cap np-detail-reveal">
            <span>05 / THE DETAILS</span>
            <span>ALL YOU NEED TO KNOW</span>
          </div>
          <div className="np-detail-faq__layout">
            <div className="np-detail-reveal">
              <p className="np-kicker">A LITTLE CLARITY</p>
              <h2 id="np-faq-title">
                Questions,
                <br />
                <em>beautifully answered.</em>
              </h2>
              <p>Curious about the experience? Here are a few details before you decide.</p>
            </div>
            <div className="np-detail-faq__items np-detail-reveal">
              {item.faqs.map((faq, idx) => (
                <div className="np-detail-faq__item" key={faq.question}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={openedFaq === idx}
                      aria-controls={`np-faq-panel-${idx}`}
                      onClick={() => setOpenedFaq(openedFaq === idx ? null : idx)}
                    >
                      {faq.question}
                      <span aria-hidden="true">
                        {openedFaq === idx ? <X size={18} /> : <Plus size={18} />}
                      </span>
                    </button>
                  </h3>
                  <div id={`np-faq-panel-${idx}`} hidden={openedFaq !== idx}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="np-detail-related" aria-labelledby="np-related-title">
          <div className="np-width">
            <div className="np-section-cap">
              <span>06 / KEEP EXPLORING</span>
              <span>DISCOVER ANOTHER MOMENT</span>
            </div>
            <div className="np-detail-related__heading">
              <h2 id="np-related-title">
                Perhaps <em>another way.</em>
              </h2>
              <Link to="/packages" className="np-underline-link">
                View all packages <ArrowRight size={16} />
              </Link>
            </div>
            <div className="np-detail-related__grid">
              {related.map((p) => (
                <Link className="np-detail-related__card" key={p.slug} to={`/packages/${p.slug}`}>
                  <div>
                    <img src={p.hero} alt={`Spa atmosphere for ${p.name}`} loading="lazy" />
                    <span>
                      <ArrowUpRight size={20} />
                    </span>
                  </div>
                  <p>
                    {p.category.toUpperCase()} · {packageGuestLabel(p)}
                  </p>
                  <h3>{p.name}</h3>
                  <small>
                    FROM {formatPackagePrice(Math.min(...p.variants.map((v) => v.price)))}
                  </small>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="np-final">
          <p className="np-kicker">THERE IS NO BETTER TIME</p>
          <h2>
            Your moment
            <br />
            <em>starts here.</em>
          </h2>
          <a className="np-button np-button--light" href="#np-configure">
            Make it yours <ArrowUpRight size={18} />
          </a>
        </section>

        {bookingOpen && (
          <BookingPreview
            selected={{
              name: `${item.name} — ${variant.label}`,
              price: total.price,
              minutes: total.minutes,
              guests: variant.guests,
              kind: "package",
              packageSlug: item.slug,
              addOns: selectedAddOns.map((a) => a.title),
            }}
            location={branch ? { slug: branch.slug, name: branch.name } : undefined}
            onClose={() => setBookingOpen(false)}
          />
        )}
        {lightboxIndex !== null && (
          <ImageLightbox
            item={item}
            selected={lightboxIndex}
            onSelect={setLightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </div>
    </ServicesShell>
  );
}

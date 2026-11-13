import {
  branchServices,
  getLocationBySlug,
  LOCATIONS,
  type SpaLocation,
} from "@/content/locations";
import { formatMinutes, formatPrice } from "@/content/services";
import BookingPreview from "@/features/booking/components/BookingPreview";
import LocationMap from "@/features/locations/components/LocationMap";
import "@/features/locations/locations.css";
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
  Image as ImageIcon,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function LocationContent({ branch }: { branch: SpaLocation }) {
  const root = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const featured = branchServices(branch);
  const [serviceSlug, setServiceSlug] = useState(featured[0]?.slug ?? "");
  const [duration, setDuration] = useState(featured[0]?.durationOptions[0]?.minutes ?? 60);
  const service = featured.find((item) => item.slug === serviceSlug) ?? featured[0];
  const selectedOption =
    service?.durationOptions.find((option) => option.minutes === duration) ??
    service?.durationOptions[0];
  const otherLocations = LOCATIONS.filter((item) => item.slug !== branch.slug);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (photoIndex !== null && !dialog.open) dialog.showModal();
    if (photoIndex === null && dialog.open) dialog.close();
  }, [photoIndex]);

  useEffect(
    () => () => {
      if (dialogRef.current?.open) dialogRef.current.close();
    },
    [],
  );

  const shiftPhoto = (delta: number) =>
    setPhotoIndex((index) =>
      index === null ? 0 : (index + delta + branch.gallery.length) % branch.gallery.length,
    );

  useMotionGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionQuery(), () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".nl-detail-hero__overline", { y: 20, opacity: 0, duration: 0.55 })
          .from(
            ".nl-detail-hero__title span",
            { yPercent: 95, opacity: 0, stagger: 0.13, duration: 1 },
            "-=0.2",
          )
          .from(".nl-detail-hero__text", { y: 25, opacity: 0, duration: 0.8 }, "-=0.4")
          .from(".nl-detail-hero__cover img", { scale: 1.12, duration: 1.35 }, 0);
        gsap.utils.toArray<HTMLElement>(".nl-reveal").forEach((element) => {
          gsap.from(element, {
            opacity: 0,
            y: 35,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          });
        });
      });
      mm.add("(min-width: 900px) and " + motionQuery(), () => {
        gsap.to(".nl-detail-hero__cover img", {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: ".nl-detail-hero__cover",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <ServicesShell>
      <div className="nl-page nl-detail" ref={root}>
        <section className="nl-detail-hero" aria-labelledby="nl-detail-title">
          <div className="nl-wrap">
            <nav className="nl-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/locations">Locations</Link>
              <span>/</span>
              <span aria-current="page">{branch.name}</span>
            </nav>
            <div className="nl-detail-hero__overline">
              <span>
                {branch.id} / {branch.region}
              </span>
              <span>AN INVITATION TO SLOW DOWN</span>
            </div>
            <div className="nl-detail-hero__heading">
              <h1 className="nl-detail-hero__title" id="nl-detail-title">
                <span>{branch.name.split(" ")[0]}</span>
                <span>
                  <em>House.</em>
                </span>
              </h1>
              <div className="nl-detail-hero__text">
                <p>{branch.theme}</p>
                <a href="#nl-detail-book" className="nl-lined-link">
                  Choose a ritual <ArrowDown size={17} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
          <div className="nl-detail-hero__cover">
            <img
              src={branch.cover}
              alt={`Illustrative interior atmosphere for ${branch.name}`}
              fetchPriority="high"
            />
            <div className="nl-detail-hero__cover-shade" />
            <div className="nl-wrap nl-detail-hero__cover-info">
              <span>
                {branch.neighborhood.toUpperCase()} · {branch.city.toUpperCase()}
              </span>
              <span>FICTIONAL SHOWCASE LOCATION</span>
            </div>
          </div>
        </section>

        <section className="nl-detail-intro nl-wrap nl-reveal">
          <span className="nl-overline">01 / THE FEELING</span>
          <div>
            <h2 className="nl-display">
              {branch.signature.split(",")[0]}
              <br />
              <em>At your own pace.</em>
            </h2>
            <p>{branch.introduction}</p>
            <div className="nl-detail-intro__stats">
              {branch.highlights.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="nl-gallery" id="nl-gallery" aria-labelledby="nl-gallery-title">
          <div className="nl-wrap">
            <div className="nl-section-cap nl-reveal">
              <span>02 / AN ATMOSPHERE</span>
              <span>THE HOUSE GALLERY</span>
            </div>
            <div className="nl-gallery__top nl-reveal">
              <h2 className="nl-display" id="nl-gallery-title">
                Spaces to <em>exhale.</em>
              </h2>
              <p>
                A glimpse into the textures, light and little details that shape this imagined
                sanctuary.
              </p>
            </div>
            <div className="nl-gallery__grid">
              {branch.gallery.map((photo, index) => (
                <button
                  type="button"
                  key={`${photo.src}-${index}`}
                  className={`nl-gallery__item nl-gallery__item--${index + 1} nl-reveal`}
                  onClick={() => setPhotoIndex(index)}
                  aria-label={`Open image ${index + 1}: ${photo.caption}`}
                >
                  <img src={photo.src} alt={photo.alt} loading="lazy" />
                  <span className="nl-gallery__item-label">
                    <span>
                      {String(index + 1).padStart(2, "0")} / {photo.caption}
                    </span>
                    <ImageIcon size={18} aria-hidden="true" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="nl-amenities">
          <div className="nl-wrap nl-amenities__layout">
            <div className="nl-reveal">
              <span className="nl-overline">03 / THE LITTLE DETAILS</span>
              <h2 className="nl-display">
                Considered
                <br />
                <em>from within.</em>
              </h2>
              <p>
                Each element contributes to the feeling of being welcome, at ease, and free to do
                less.
              </p>
            </div>
            <div className="nl-amenities__list nl-reveal">
              <div className="nl-amenities__row nl-amenities__row--title">
                <span>AMENITIES</span>
                <span>AT THIS HOUSE</span>
              </div>
              {branch.amenities.map((item, index) => (
                <div className="nl-amenities__row" key={item}>
                  <span>0{index + 1}</span>
                  <strong>{item}</strong>
                  <Check size={19} aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="nl-rituals nl-wrap"
          id="nl-detail-book"
          aria-labelledby="nl-rituals-title"
        >
          <div className="nl-section-cap nl-reveal">
            <span>04 / MAKE IT YOURS</span>
            <span>FEATURED EXPERIENCES</span>
          </div>
          <div className="nl-rituals__intro nl-reveal">
            <h2 className="nl-display" id="nl-rituals-title">
              The ritual is <em>yours.</em>
            </h2>
            <p>
              Browse this house's suggested rituals, select your preferred duration and preview a
              booking. Prices are sample data.
            </p>
          </div>
          <div className="nl-rituals__layout">
            <div className="nl-rituals__collection">
              {featured.map((item, index) => (
                <button
                  type="button"
                  key={item.slug}
                  className={`nl-ritual-item ${service?.slug === item.slug ? "is-active" : ""}`}
                  aria-pressed={service?.slug === item.slug}
                  onClick={() => {
                    setServiceSlug(item.slug);
                    setDuration(item.durationOptions[0].minutes);
                  }}
                >
                  <span className="nl-ritual-item__number">0{index + 1}</span>
                  <img src={item.image} alt="" loading="lazy" />
                  <span>
                    <strong>{item.name}</strong>
                    <small>
                      {item.category} · {formatMinutes(item.minutes)}
                    </small>
                  </span>
                  <ArrowUpRight size={20} aria-hidden="true" />
                </button>
              ))}
            </div>
            <aside className="nl-ritual-booking nl-reveal" aria-label="Example booking preferences">
              <div className="nl-ritual-booking__top">
                <span>YOUR EXPERIENCE</span>
                <span>✳</span>
              </div>
              {service && selectedOption ? (
                <>
                  <p className="nl-overline">{branch.name.toUpperCase()} / SELECTED RITUAL</p>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <fieldset>
                    <legend>Select a duration</legend>
                    <div className="nl-duration-choices">
                      {service.durationOptions.map((option) => (
                        <button
                          type="button"
                          key={option.minutes}
                          aria-pressed={selectedOption.minutes === option.minutes}
                          className={selectedOption.minutes === option.minutes ? "is-active" : ""}
                          onClick={() => setDuration(option.minutes)}
                        >
                          <span>
                            <Clock3 size={15} aria-hidden="true" />
                            {formatMinutes(option.minutes)}
                          </span>
                          <strong>{formatPrice(option.price)}</strong>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <div className="nl-ritual-booking__total">
                    <div>
                      <span>ESTIMATED TOTAL</span>
                      <strong>{formatPrice(selectedOption.price)}</strong>
                    </div>
                    <div>
                      <span>LOCATION</span>
                      <strong>{branch.name}</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="nl-action nl-action--dark nl-action--full"
                    onClick={() => setShowBooking(true)}
                  >
                    Preview booking <ArrowUpRight size={19} aria-hidden="true" />
                  </button>
                  <p className="nl-smallprint">
                    Demo only: no real appointments, payments or availability checks.
                  </p>
                </>
              ) : (
                <p>Featured rituals will appear here.</p>
              )}
            </aside>
          </div>
        </section>

        <section className="nl-visit">
          <div className="nl-wrap">
            <div className="nl-section-cap nl-reveal">
              <span>05 / PLAN YOUR VISIT</span>
              <span>THE NEIGHBORHOOD</span>
            </div>
            <div className="nl-visit__heading nl-reveal">
              <div>
                <p className="nl-overline">COME FIND YOUR MOMENT</p>
                <h2 className="nl-display">
                  Closer than
                  <br />
                  <em>you think.</em>
                </h2>
              </div>
              <p>
                Explore the surrounding neighborhood. Coordinates and opening hours below are
                illustrative, not verified business details.
              </p>
            </div>
            <div className="nl-visit__layout">
              <div className="nl-visit__details nl-reveal">
                <div className="nl-visit__detail">
                  <span>AREA</span>
                  <h3>{branch.neighborhood}</h3>
                  <p>{branch.city}, Vietnam</p>
                </div>
                <div className="nl-visit__detail">
                  <span>EXAMPLE OPENING HOURS</span>
                  {branch.hours.map((hour) => (
                    <p className="nl-visit__hours" key={hour.days}>
                      <span>{hour.days}</span>
                      <strong>{hour.hours}</strong>
                    </p>
                  ))}
                </div>
                <div className="nl-visit__detail">
                  <span>A NOTE ON THIS TEMPLATE</span>
                  <p>
                    The locations in this demo are fictional. Add your verified street address,
                    operating hours, phone number and exact map marker before going live.
                  </p>
                </div>
                <Link to="/locations" className="nl-lined-link">
                  <ArrowLeft size={17} aria-hidden="true" /> See all houses
                </Link>
              </div>
              <div className="nl-reveal">
                <LocationMap branch={branch} />
              </div>
            </div>
          </div>
        </section>

        <section className="nl-faq nl-wrap">
          <div className="nl-section-cap nl-reveal">
            <span>06 / A FEW LITTLE THINGS</span>
            <span>GOOD TO KNOW</span>
          </div>
          <div className="nl-faq__layout nl-reveal">
            <div>
              <h2 className="nl-display">
                Before you
                <br />
                <em>arrive.</em>
              </h2>
              <p>We've gathered a few details to help make the experience feel effortless.</p>
            </div>
            <div className="nl-faq__items">
              {branch.faqs.map((faq, index) => (
                <details key={faq.question}>
                  <summary>
                    <span>0{index + 1}</span>
                    {faq.question}
                    <ChevronDown size={20} aria-hidden="true" />
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="nl-other">
          <div className="nl-wrap">
            <div className="nl-section-cap nl-reveal">
              <span>07 / KEEP EXPLORING</span>
              <span>THE OTHER HOUSES</span>
            </div>
            <div className="nl-other__top nl-reveal">
              <h2 className="nl-display">
                There is more
                <br />
                <em>to discover.</em>
              </h2>
              <Link className="nl-lined-link" to="/locations">
                View all houses <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="nl-other__grid">
              {otherLocations.map((other) => (
                <Link
                  key={other.slug}
                  to={`/locations/${other.slug}`}
                  className="nl-other__card nl-reveal"
                >
                  <div>
                    <img
                      src={other.cover}
                      alt={`Illustrative atmosphere of ${other.name}`}
                      loading="lazy"
                    />
                  </div>
                  <span>{other.region}</span>
                  <h3>
                    {other.name}
                    <ArrowUpRight size={23} aria-hidden="true" />
                  </h3>
                  <p>{other.neighborhood}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <dialog
          className="nl-lightbox"
          ref={dialogRef}
          aria-label="Location image gallery"
          onClose={() => setPhotoIndex(null)}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              shiftPhoto(1);
            }
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              shiftPhoto(-1);
            }
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) setPhotoIndex(null);
          }}
        >
          {photoIndex !== null && (
            <div className="nl-lightbox__inner">
              <button
                type="button"
                className="nl-lightbox__close"
                onClick={() => setPhotoIndex(null)}
                aria-label="Close gallery"
              >
                <X size={24} />
              </button>
              <img src={branch.gallery[photoIndex].src} alt={branch.gallery[photoIndex].alt} />
              <div className="nl-lightbox__bottom">
                <span>
                  {String(photoIndex + 1).padStart(2, "0")} /{" "}
                  {String(branch.gallery.length).padStart(2, "0")} —{" "}
                  {branch.gallery[photoIndex].caption}
                </span>
                <div>
                  <button type="button" onClick={() => shiftPhoto(-1)} aria-label="Previous image">
                    <ChevronLeft size={24} />
                  </button>
                  <button type="button" onClick={() => shiftPhoto(1)} aria-label="Next image">
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </dialog>
        {showBooking && service && selectedOption && (
          <BookingPreview
            selected={{
              name: service.name,
              minutes: selectedOption.minutes,
              price: selectedOption.price,
            }}
            location={{ slug: branch.slug, name: branch.name }}
            onClose={() => setShowBooking(false)}
          />
        )}
      </div>
    </ServicesShell>
  );
}

export default function LocationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = getLocationBySlug(slug);
  if (!location)
    return (
      <ServicesShell>
        <div className="nl-page nl-notfound nl-wrap">
          <span className="nl-overline">404 / HOUSE NOT FOUND</span>
          <h1 className="nl-display">
            A little <em>detour.</em>
          </h1>
          <p>That example location isn't part of our collection.</p>
          <Link to="/locations" className="nl-action nl-action--dark">
            Explore all houses <ArrowRight size={17} />
          </Link>
        </div>
      </ServicesShell>
    );
  return <LocationContent key={location.slug} branch={location} />;
}

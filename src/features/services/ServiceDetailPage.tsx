import {
  SERVICES,
  formatMinutes,
  formatPrice,
  getServiceBySlug,
  type Service,
} from "@/content/services";
import BookingPreview from "@/features/booking/components/BookingPreview";
import ServiceEditorialCard from "@/features/services/components/ServiceEditorialCard";
import "@/features/services/services.css";
import ServicesShell from "@/shared/layout/SiteShell";
import { isMotionReduced, useMotionGSAP } from "@/shared/motion/preferences";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock3,
  Leaf,
  MoveUpRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function DetailContent({ service }: { service: Service }) {
  const root = useRef<HTMLDivElement>(null);
  const [selectedOption, setSelectedOption] = useState(
    () =>
      service.durationOptions.find((o) => o.minutes === service.minutes) ??
      service.durationOptions[0],
  );
  const [bookingOpen, setBookingOpen] = useState(false);
  const related = SERVICES.filter(
    (item) => item.slug !== service.slug && item.category === service.category,
  ).slice(0, 3);

  useEffect(() => {
    document.title = `${service.name} | NOVRA Wellness`;
    return () => {
      document.title = "NOVRA Spa & Wellness";
    };
  }, [service.name]);

  useMotionGSAP(
    () => {
      if (isMotionReduced()) return;
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".nv-detail-hero__intro > *", { autoAlpha: 0, y: 35, duration: 0.85, stagger: 0.1 })
        .from(".nv-detail-hero__image", { autoAlpha: 0, scale: 1.055, duration: 1.2 }, 0.12);
      gsap.utils.toArray<HTMLElement>(".nv-detail-reveal").forEach((element) =>
        gsap.from(element, {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 90%", once: true },
        }),
      );
    },
    { scope: root },
  );

  return (
    <ServicesShell>
      <div ref={root} className="nv-detail">
        <section className="nv-detail-hero" aria-labelledby="nv-detail-title">
          <div className="nv-container">
            <nav className="nv-detail-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/services">Treatments</Link>
              <span>/</span>
              <span aria-current="page">{service.name}</span>
            </nav>
            <div className="nv-detail-hero__intro">
              <div className="nv-detail-hero__eyebrow">
                <span>THE TREATMENT COLLECTION</span>
                <span>{service.category.toUpperCase()} / EXPERIENCE</span>
              </div>
              <div className="nv-detail-hero__title-row">
                <h1 id="nv-detail-title">
                  {service.name.split(" ").slice(0, -1).join(" ")}{" "}
                  <em>{service.name.split(" ").at(-1)}.</em>
                </h1>
                <div className="nv-detail-hero__aside">
                  <span>✳</span>
                  <p>{service.lead}</p>
                </div>
              </div>
              <div className="nv-detail-hero__meta">
                <span>
                  <Clock3 size={17} /> {formatMinutes(service.minutes)} classic ritual
                </span>
                <span>{service.tag.toUpperCase()}</span>
                <span>
                  FROM {formatPrice(Math.min(...service.durationOptions.map((o) => o.price)))}
                </span>
              </div>
            </div>
            <div className="nv-detail-hero__image">
              <img
                src={service.image}
                alt={`Illustrative photography for ${service.name}`}
                fetchPriority="high"
              />
              <div className="nv-detail-hero__image-label">
                THE ART OF BEING PRESENT <span>✳</span> NOVRA WELLNESS
              </div>
            </div>
          </div>
        </section>

        <section className="nv-detail-story nv-container nv-detail-reveal">
          <div>
            <span className="nv-svc-kicker">01 / FIND YOUR MOMENT</span>
            <h2>
              Beautifully
              <br />
              <em>unhurried.</em>
            </h2>
          </div>
          <div>
            <p className="nv-detail-story__lead">{service.lead}</p>
            <p>
              {service.description} Each element is intended to give you a softer, more present
              moment in your day.
            </p>
            <div className="nv-detail-story__features">
              {service.benefits.map((benefit) => (
                <div key={benefit}>
                  <Check size={18} />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="nv-detail-journey">
          <div className="nv-container">
            <div className="nv-detail-section-heading nv-detail-reveal">
              <div>
                <span className="nv-svc-kicker">02 / THE EXPERIENCE</span>
                <h2>
                  The rhythm of
                  <br />
                  <em>your ritual.</em>
                </h2>
              </div>
              <p>
                Less on your mind, more room to feel. A thoughtful sequence from the first welcome
                to the final quiet moment.
              </p>
            </div>
            <div className="nv-detail-stages">
              {service.stages.map((step, index) => (
                <article key={step.title} className="nv-detail-stage nv-detail-reveal">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </div>
                  <Leaf size={25} strokeWidth={1.15} aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="nv-detail-image-story" aria-label="Treatment atmosphere">
          <div className="nv-detail-image-story__visual">
            <img
              src={service.gallery[0]}
              alt="Illustrative spa interior atmosphere"
              loading="lazy"
            />
          </div>
          <div className="nv-detail-image-story__shade" />
          <div className="nv-detail-image-story__content nv-container nv-detail-reveal">
            <span className="nv-svc-kicker">BE HERE, NOW</span>
            <blockquote>“{service.quote}”</blockquote>
            <span>✳</span>
          </div>
        </section>

        <section className="nv-detail-included nv-container nv-detail-reveal">
          <div className="nv-detail-included__heading">
            <span className="nv-svc-kicker">03 / THE LITTLE DETAILS</span>
            <h2>
              Everything
              <br />
              <em>considered.</em>
            </h2>
            <p>
              Every detail is part of the experience, from your arrival to your final moments of
              rest.
            </p>
          </div>
          <div className="nv-detail-included__list">
            <div className="nv-detail-included__list-head">
              <span>WHAT'S INCLUDED</span>
              <span>✳</span>
            </div>
            {service.included.map((item, index) => (
              <div key={item} className="nv-detail-included__item">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
                <Check size={18} />
              </div>
            ))}
          </div>
        </section>

        <section id="nv-detail-book" className="nv-detail-book">
          <div className="nv-container nv-detail-book__grid">
            <div className="nv-detail-book__intro nv-detail-reveal">
              <span className="nv-svc-kicker">04 / MAKE THIS MOMENT YOURS</span>
              <h2>
                Your time.
                <br />
                <em>Your ritual.</em>
              </h2>
              <p>
                Choose a length that fits your day. Pricing updates instantly; complete your
                preference in the booking preview.
              </p>
              <div className="nv-detail-book__stamp" aria-hidden="true">
                ✳
              </div>
            </div>
            <div className="nv-detail-book__panel nv-detail-reveal">
              <div className="nv-detail-book__panel-top">
                <span>YOUR EXPERIENCE</span>
                <span>01 / 01</span>
              </div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <fieldset>
                <legend>Choose your duration</legend>
                <div className="nv-detail-duration-options">
                  {service.durationOptions.map((option) => (
                    <button
                      key={option.minutes}
                      type="button"
                      aria-pressed={selectedOption.minutes === option.minutes}
                      className={selectedOption.minutes === option.minutes ? "is-active" : ""}
                      onClick={() => setSelectedOption(option)}
                    >
                      <span>
                        <Clock3 size={16} />
                        {formatMinutes(option.minutes)}
                      </span>
                      <strong>{formatPrice(option.price)}</strong>
                      {selectedOption.minutes === option.minutes && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="nv-detail-book__total">
                <div>
                  <small>ESTIMATED TOTAL</small>
                  <strong>{formatPrice(selectedOption.price)}</strong>
                </div>
                <div>
                  <small>DURATION</small>
                  <strong>{formatMinutes(selectedOption.minutes)}</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                className="nv-button nv-button--dark nv-button--full"
              >
                Preview booking <ArrowUpRight size={19} />
              </button>
              <p className="nv-detail-book__notice">
                This is a frontend demo. No live availability, payment, or appointment confirmation.
              </p>
            </div>
          </div>
        </section>

        <section className="nv-detail-good-to-know nv-container nv-detail-reveal">
          <div>
            <span className="nv-svc-kicker">05 / GOOD TO KNOW</span>
            <h2>
              Before &<br />
              <em>after.</em>
            </h2>
            <div className="nv-detail-good-to-know__cards">
              <article>
                <span>01 / PREPARATION</span>
                <p>{service.preparation}</p>
              </article>
              <article>
                <span>02 / AFTERCARE</span>
                <p>{service.aftercare}</p>
              </article>
            </div>
          </div>
          <div className="nv-detail-good-to-know__faqs">
            <h3>Questions, answered.</h3>
            {service.faqs.map((faq, index) => (
              <details key={faq.question}>
                <summary>
                  <span>0{index + 1}</span>
                  {faq.question}
                  <ChevronDown size={19} />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section
          className="nv-detail-gallery nv-container nv-detail-reveal"
          aria-label="Treatment gallery"
        >
          <div className="nv-detail-gallery__photo">
            <img src={service.gallery[1]} alt="A calming treatment setting" loading="lazy" />
          </div>
          <div className="nv-detail-gallery__note">
            <span>AN INVITATION</span>
            <p>
              Make space for
              <br />
              <em>yourself.</em>
            </p>
            <span>TAKE WHAT YOU NEED. LEAVE THE REST BEHIND.</span>
            <MoveUpRight size={38} strokeWidth={1} />
          </div>
        </section>

        <section className="nv-detail-related nv-container">
          <div className="nv-detail-section-heading">
            <div>
              <span className="nv-svc-kicker">06 / YOU MAY ALSO LIKE</span>
              <h2>
                Stay a little
                <br />
                <em>longer.</em>
              </h2>
            </div>
            <Link className="nv-svc-link" to="/services">
              All treatments <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="nv-svc-grid nv-detail-related__grid">
            {related.map((item, index) => (
              <ServiceEditorialCard key={item.slug} service={item} index={index} />
            ))}
          </div>
        </section>

        <div className="nv-detail-bottom">
          <div className="nv-container">
            <span>ALWAYS, AT YOUR OWN PACE</span>
            <Link to="/services">
              <ArrowLeft size={18} /> Back to all experiences
            </Link>
            <button type="button" onClick={() => setBookingOpen(true)}>
              Choose this experience <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
      {bookingOpen && (
        <BookingPreview
          selected={{
            name: service.name,
            price: selectedOption.price,
            minutes: selectedOption.minutes,
          }}
          onClose={() => setBookingOpen(false)}
        />
      )}
    </ServicesShell>
  );
}

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const service = getServiceBySlug(slug);
  if (!service)
    return (
      <ServicesShell>
        <section className="nv-svc-not-found nv-container">
          <span className="nv-svc-kicker">404 / RITUAL NOT FOUND</span>
          <h1>
            This moment has
            <br />
            <em>moved on.</em>
          </h1>
          <p>That treatment isn't part of the current collection.</p>
          <Link to="/services" className="nv-button nv-button--dark">
            Explore all treatments <ArrowRight size={18} />
          </Link>
        </section>
      </ServicesShell>
    );
  return <DetailContent key={service.slug} service={service} />;
}

import { LOCATIONS } from "@/content/locations";
import { PACKAGES } from "@/content/packages";
import { SERVICES, formatPrice } from "@/content/services";
import "@/features/booking/booking.css";
import { Summary } from "@/features/booking/components/BookingSummary";
import {
  BookingDraft,
  BookingKind,
  getCurrent,
  localISO,
  populateFromSelection,
  sampleAvailable,
  times,
} from "@/features/booking/model/booking";
import ServicesShell from "@/shared/layout/SiteShell";
import { isMotionReduced, useMotionGSAP } from "@/shared/motion/preferences";
import "@/shared/styles/editorial.css";
import "@/shared/styles/experiences.css";
import gsap from "gsap";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
export function BookingPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const step = Math.max(1, Math.min(3, Number(params.get("step") || 1) || 1));
  const [draft, setDraft] = useState<BookingDraft>(() => {
    let base = getCurrent();
    const service = params.get("service");
    const pack = params.get("package");
    if (service) base = populateFromSelection(base, "service", service);
    else if (pack) base = populateFromSelection(base, "package", pack);
    else if (params.get("ritual") === "1") {
      try {
        const r = JSON.parse(sessionStorage.getItem("novra-ritual") || "null");
        if (r && r.items?.length && Number.isFinite(r.total))
          base = {
            ...base,
            kind: "ritual",
            slug: "custom",
            label: "Your Personal Ritual",
            price: r.total,
            minutes: r.minutes,
            guests: r.guests,
            details: r.items.map(
              (x: { name: string; minutes: number }) => `${x.name} · ${x.minutes} min`,
            ),
            date: "",
            time: "",
          };
      } catch {}
    }
    return base;
  });
  const [error, setError] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [consent, setConsent] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.title = `Booking — Step ${step} | NOVRA Wellness House`;
  }, [step]);
  useEffect(() => {
    try {
      sessionStorage.setItem("novra-booking-draft", JSON.stringify(draft));
    } catch {}
  }, [draft]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setError("");
  }, [step]);
  useMotionGSAP(
    () => {
      if (isMotionReduced() || !panel.current) return;
      gsap.fromTo(
        panel.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", clearProps: "all" },
      );
    },
    { scope: panel, dependencies: [step], revertOnUpdate: true },
  );
  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setHours(12, 0, 0, 0);
        d.setDate(d.getDate() + i + selectedWeek * 7);
        return {
          key: localISO(d),
          day: d.toLocaleDateString("en-US", { weekday: "short" }),
          date: d.toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
        };
      }),
    [selectedWeek],
  );
  const goto = (n: number) => setParams(new URLSearchParams({ step: String(n) }));
  const chooseExperience = (kind: BookingKind, slug: string) =>
    setDraft((p) => populateFromSelection(p, kind, slug));
  const chooseDuration = (mins: number) => {
    if (draft.kind === "service") {
      const s = SERVICES.find((s) => s.slug === draft.slug);
      const option = s?.durationOptions.find((o) => o.minutes === mins);
      if (option)
        setDraft((p) => ({ ...p, minutes: mins, price: option.price, date: "", time: "" }));
    } else if (draft.kind === "package") {
      const p = PACKAGES.find((p) => p.slug === draft.slug);
      const v = p?.variants.find((v) => v.minutes === mins);
      if (v)
        setDraft((old) => ({
          ...old,
          minutes: v.minutes,
          price: v.price,
          guests: v.guests,
          date: "",
          time: "",
        }));
    }
  };
  const nextStep = () => {
    if (step === 1) {
      if (!draft.location) {
        setError("Select a location.");
        return;
      }
      goto(2);
      return;
    }
    if (step === 2) {
      if (!draft.date || !draft.time || !sampleAvailable(draft.date, draft.time)) {
        setError("Please choose an example available date and time.");
        return;
      }
      goto(3);
    }
  };
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!consent) {
      setError("Please acknowledge the frontend demo notice.");
      return;
    }
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    if (name.length < 2 || !email.includes("@")) {
      setError("Please enter a valid name and email.");
      return;
    }
    if (!draft.date || !draft.time || !sampleAvailable(draft.date, draft.time)) {
      setError("The example time is no longer valid. Choose a different slot.");
      goto(2);
      return;
    }
    // Store only NON-PERSONAL example details; do not store name, email or phone.
    const confirmation = {
      ...draft,
      id: `DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      demo: true,
    };
    try {
      sessionStorage.setItem("novra-example-confirmation", JSON.stringify(confirmation));
      sessionStorage.removeItem("novra-booking-draft");
    } catch {}
    navigate("/booking/confirmation", { state: confirmation });
  };
  const availableSlots = times.filter((t) => sampleAvailable(draft.date, t));
  return (
    <ServicesShell>
      <div className="ne-page nb-page">
        <section className="nb-heading">
          <div className="ne-container">
            <div className="ne-breadcrumb">
              <Link to="/">HOME</Link>
              <span>/</span>
              <span>BOOKING EXPERIENCE</span>
            </div>
            <span className="ne-eyebrow">A PERSONAL RITUAL / 0{step} OF 03</span>
            <h1 className="ne-heading">
              A moment
              <br />
              <em>for yourself.</em>
            </h1>
            <p>
              A seamless three-step booking concept. All information, time slots and prices are
              simulated.
            </p>
            <div className="nb-stepper">
              {["Choose your experience", "Find your moment", "Review your details"].map(
                (label, i) => (
                  <button
                    type="button"
                    key={label}
                    onClick={() => i + 1 <= step && goto(i + 1)}
                    disabled={i + 1 > step}
                    className={step === i + 1 ? "is-current" : ""}
                  >
                    <span>0{i + 1}</span>
                    {label}
                  </button>
                ),
              )}
            </div>
          </div>
        </section>
        <section className="ne-section nb-main">
          <div className="ne-container nb-layout">
            <div ref={panel} className="nb-step-panel">
              {step === 1 && (
                <>
                  <span className="ne-eyebrow">STEP 01 / THE EXPERIENCE</span>
                  <h2 className="nb-title">
                    Choose what
                    <br />
                    <em>feels right.</em>
                  </h2>
                  <p className="ne-text">
                    Select a single service, package or your custom ritual, and choose an example
                    house.
                  </p>
                  <div className="ne-pill-row" style={{ marginTop: 32 }}>
                    {(["service", "package", "ritual"] as BookingKind[]).map((k) => (
                      <button
                        key={k}
                        className="ne-pill"
                        aria-pressed={draft.kind === k}
                        onClick={() => {
                          if (k === "ritual") {
                            navigate("/ritual-builder");
                            return;
                          }
                          chooseExperience(
                            k,
                            k === "service" ? SERVICES[0].slug : PACKAGES[0].slug,
                          );
                        }}
                      >
                        {k === "service"
                          ? "TREATMENTS"
                          : k === "package"
                            ? "PACKAGES"
                            : "BUILD A RITUAL"}
                      </button>
                    ))}
                  </div>
                  {draft.kind === "service" && (
                    <div className="nb-options">
                      {SERVICES.map((s) => (
                        <button
                          type="button"
                          className={`nb-option ${draft.slug === s.slug ? "is-selected" : ""}`}
                          onClick={() => chooseExperience("service", s.slug)}
                          key={s.slug}
                        >
                          <img src={s.image} alt="" />
                          <span>
                            <small>
                              {s.category.toUpperCase()} / {s.durationOptions.length} DURATIONS
                            </small>
                            <strong>{s.name}</strong>
                            <small>
                              FROM {formatPrice(Math.min(...s.durationOptions.map((o) => o.price)))}
                            </small>
                          </span>
                          <span>{draft.slug === s.slug ? "✓" : "+"}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {draft.kind === "package" && (
                    <div className="nb-options">
                      {PACKAGES.map((p) => (
                        <button
                          type="button"
                          className={`nb-option ${draft.slug === p.slug ? "is-selected" : ""}`}
                          onClick={() => chooseExperience("package", p.slug)}
                          key={p.slug}
                        >
                          <img src={p.hero} alt="" />
                          <span>
                            <small>
                              {p.category.toUpperCase()} / FOR {p.variants[0].guests}
                            </small>
                            <strong>{p.name}</strong>
                            <small>FROM {formatPrice(p.variants[0].price)}</small>
                          </span>
                          <span>{draft.slug === p.slug ? "✓" : "+"}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {draft.kind === "ritual" && (
                    <div className="ne-card-surface">
                      <h3>{draft.label}</h3>
                      <p>Custom collection: {draft.details?.join(" / ")}</p>
                      <Link className="ne-btn" to="/ritual-builder">
                        EDIT YOUR RITUAL <ArrowRight size={17} />
                      </Link>
                    </div>
                  )}
                  {draft.kind !== "ritual" && (
                    <div className="nb-duration">
                      <h3>Choose your duration</h3>
                      <div className="ne-pill-row">
                        {(draft.kind === "service"
                          ? SERVICES.find((s) => s.slug === draft.slug)?.durationOptions
                          : PACKAGES.find((p) => p.slug === draft.slug)?.variants.map((v) => ({
                              minutes: v.minutes,
                              price: v.price,
                            }))
                        )?.map((o) => (
                          <button
                            key={`${o.minutes}-${o.price}`}
                            className="ne-pill"
                            aria-pressed={draft.minutes === o.minutes}
                            onClick={() => chooseDuration(o.minutes)}
                          >
                            {o.minutes}m / {formatPrice(o.price)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="nb-duration">
                    <h3>Select your example location</h3>
                    <div className="nb-location-grid">
                      {LOCATIONS.map((l) => (
                        <button
                          type="button"
                          key={l.slug}
                          className={`nb-location ${draft.location === l.slug ? "is-selected" : ""}`}
                          onClick={() => setDraft((p) => ({ ...p, location: l.slug }))}
                        >
                          <MapPin size={17} />
                          <strong>{l.name}</strong>
                          <small>{l.neighborhood}</small>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <span className="ne-eyebrow">STEP 02 / YOUR MOMENT</span>
                  <h2 className="nb-title">
                    A time
                    <br />
                    <em>to be present.</em>
                  </h2>
                  <p className="ne-text">
                    These example slots are deterministically generated, not linked to an
                    appointment system.
                  </p>
                  <div className="nb-calendar-header">
                    <strong>CHOOSE A DAY</strong>
                    <div>
                      <button
                        type="button"
                        aria-label="Previous week"
                        disabled={selectedWeek === 0}
                        onClick={() => setSelectedWeek((w) => Math.max(0, w - 1))}
                      >
                        <ChevronLeft />
                      </button>
                      <span>WEEK {selectedWeek + 1}</span>
                      <button
                        type="button"
                        aria-label="Next week"
                        disabled={selectedWeek >= 7}
                        onClick={() => setSelectedWeek((w) => Math.min(7, w + 1))}
                      >
                        <ChevronRight />
                      </button>
                    </div>
                  </div>
                  <div className="nb-days">
                    {days.map((d) => (
                      <button
                        type="button"
                        key={d.key}
                        aria-pressed={draft.date === d.key}
                        className={draft.date === d.key ? "is-selected" : ""}
                        onClick={() => setDraft((s) => ({ ...s, date: d.key, time: "" }))}
                      >
                        <span>{d.day}</span>
                        <strong>{d.date}</strong>
                      </button>
                    ))}
                  </div>
                  <div className="nb-duration">
                    <h3>Available example times</h3>
                    {draft.date ? (
                      <div className="nb-times">
                        {times.map((t) => (
                          <button
                            type="button"
                            key={t}
                            disabled={!sampleAvailable(draft.date, t)}
                            aria-pressed={draft.time === t}
                            className={draft.time === t ? "is-selected" : ""}
                            onClick={() => setDraft((s) => ({ ...s, time: t }))}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="ne-empty">Choose a day to see available example times.</p>
                    )}
                    {draft.date && availableSlots.length === 0 && (
                      <p className="ne-notice">No example slots for this day. Try another date.</p>
                    )}
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <span className="ne-eyebrow">STEP 03 / YOUR DETAILS</span>
                  <h2 className="nb-title">
                    Almost
                    <br />
                    <em>your moment.</em>
                  </h2>
                  <p className="ne-text">
                    Enter example guest information. No personal contact details are saved or sent
                    by this frontend demo.
                  </p>
                  <form id="nb-guest-form" onSubmit={submit} className="nb-guest-form">
                    <div className="ne-form-grid">
                      <label className="ne-form-field">
                        YOUR NAME
                        <input
                          autoComplete="name"
                          className="ne-input"
                          required
                          minLength={2}
                          maxLength={80}
                          name="name"
                          placeholder="Your name"
                        />
                      </label>
                      <label className="ne-form-field">
                        EMAIL ADDRESS
                        <input
                          autoComplete="email"
                          type="email"
                          className="ne-input"
                          required
                          maxLength={120}
                          name="email"
                          placeholder="you@example.com"
                        />
                      </label>
                    </div>
                    <label className="ne-form-field">
                      PHONE (OPTIONAL)
                      <input
                        className="ne-input"
                        type="tel"
                        maxLength={30}
                        name="phone"
                        placeholder="Contact phone"
                      />
                    </label>
                    <label className="ne-form-field">
                      A NOTE FOR YOUR THERAPIST (OPTIONAL)
                      <textarea
                        className="ne-input"
                        maxLength={500}
                        rows={4}
                        name="notes"
                        placeholder="Any comfort preferences?"
                      />
                    </label>
                    <label className="nb-checkbox">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                      />
                      <span>
                        I understand this is a fictional frontend booking preview; no actual time is
                        held, appointment booked, payment processed or personal data transmitted.
                      </span>
                    </label>
                    {error && (
                      <p role="alert" className="nb-error">
                        {error}
                      </p>
                    )}
                    <button type="submit" className="ne-btn">
                      GENERATE DEMO CONFIRMATION <ArrowUpRight size={18} />
                    </button>
                  </form>
                </>
              )}
              {step < 3 && (
                <div className="nb-actions">
                  {step > 1 ? (
                    <button
                      type="button"
                      className="ne-btn ne-btn--outline"
                      onClick={() => goto(step - 1)}
                    >
                      <ArrowLeft size={18} /> BACK
                    </button>
                  ) : (
                    <Link className="ne-btn ne-btn--outline" to="/services">
                      EXPLORE MORE <ArrowLeft size={18} />
                    </Link>
                  )}
                  {error && (
                    <p role="alert" className="nb-error">
                      {error}
                    </p>
                  )}
                  <button type="button" className="ne-btn" onClick={nextStep}>
                    {step === 1 ? "SELECT DATE & TIME" : "REVIEW DETAILS"} <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
            <Summary draft={draft} />
          </div>
        </section>
      </div>
    </ServicesShell>
  );
}

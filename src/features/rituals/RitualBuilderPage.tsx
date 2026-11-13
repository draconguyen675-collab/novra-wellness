import { P } from "@/content/editorial";
import { SERVICES, formatMinutes, formatPrice, type Service } from "@/content/services";
import { Chapter, EditorialCTA, EditorialHero, EditorialLayout } from "@/shared/ui/Editorial";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import { useState } from "react";

export function RitualBuilderPage() {
  const [selected, setSelected] = useState<Record<string, number>>({
    "the-aromatherapy-ritual": 90,
  });
  const [guests, setGuests] = useState(1);
  const [sort, setSort] = useState("All");
  const list = SERVICES.filter((s) => sort === "All" || s.category === sort).slice(0, 10);
  const choices = Object.entries(selected)
    .map(([slug, minutes]) => {
      const service = SERVICES.find((s) => s.slug === slug);
      const option = service?.durationOptions.find((o) => o.minutes === minutes);
      return service && option ? { service, option } : null;
    })
    .filter((s): s is { service: Service; option: { minutes: number; price: number } } =>
      Boolean(s),
    );
  const total = choices.reduce((a, c) => a + c.option.price, 0) * guests;
  const mins = choices.reduce((a, c) => a + c.option.minutes, 0);
  const toggle = (s: Service) =>
    setSelected((prev) => {
      const next = { ...prev };
      if (next[s.slug]) delete next[s.slug];
      else next[s.slug] = s.durationOptions[0].minutes;
      return next;
    });
  const startBooking = () => {
    try {
      sessionStorage.setItem(
        "novra-ritual",
        JSON.stringify({
          items: choices.map(({ service, option }) => ({
            slug: service.slug,
            name: service.name,
            minutes: option.minutes,
            price: option.price,
          })),
          guests,
          total,
          minutes: mins,
        }),
      );
    } catch {}
    window.location.href = "/booking?step=1&ritual=1";
  };
  return (
    <EditorialLayout title="Ritual Builder">
      <EditorialHero
        index="21"
        eyebrow="THE PERSONAL RITUAL"
        title="Made for"
        italic="this moment."
        subtitle="Compose your own sequence of quiet. Choose treatments, durations and the number of guests."
        image={P.therapy}
        scrollTo="ritual-customize"
      />
      <Chapter number="01" label="A RITUAL, REIMAGINED" title="The art of" italic="making time.">
        <p>
          Why should a spa experience feel one-size-fits-all? Create a custom itinerary and watch
          your price and estimated duration update instantly.
        </p>
      </Chapter>
      <section id="ritual-customize" className="ne-section ne-section--soft">
        <div className="ne-container">
          <div className="ne-section-header">
            <div>
              <span className="ne-eyebrow">THE RITUAL ATELIER</span>
              <h2 className="ne-heading">
                Make it <em>yours.</em>
              </h2>
            </div>
            <p>
              All choices are illustrative and availability is not checked. Multiple treatments are
              assumed sequential.
            </p>
          </div>
          <div className="ne-ritual-grid">
            <div>
              <div className="ne-pill-row">
                {["All", "Body", "Skin", "Ritual"].map((c) => (
                  <button
                    className="ne-pill"
                    key={c}
                    aria-pressed={sort === c}
                    onClick={() => setSort(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="ne-ritual-items">
                {list.map((s) => (
                  <article
                    key={s.slug}
                    className={`ne-ritual-item ${selected[s.slug] ? "is-selected" : ""}`}
                  >
                    <img src={s.image} alt="" loading="lazy" />
                    <div>
                      <span className="ne-tiny">
                        {s.category} / FROM{" "}
                        {formatPrice(Math.min(...s.durationOptions.map((o) => o.price)))}
                      </span>
                      <h3>{s.name}</h3>
                      <p>{s.description}</p>
                      {selected[s.slug] && (
                        <div className="ne-pill-row" style={{ margin: "12px 0 0" }}>
                          {s.durationOptions.map((o) => (
                            <button
                              key={o.minutes}
                              className="ne-pill"
                              aria-pressed={selected[s.slug] === o.minutes}
                              onClick={() => setSelected((p) => ({ ...p, [s.slug]: o.minutes }))}
                            >
                              {o.minutes}m · {formatPrice(o.price)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      className="ne-ritual-toggle"
                      aria-label={selected[s.slug] ? `Remove ${s.name}` : `Add ${s.name}`}
                      onClick={() => toggle(s)}
                    >
                      {selected[s.slug] ? <Minus size={19} /> : <Plus size={19} />}
                    </button>
                  </article>
                ))}
              </div>
            </div>
            <aside className="ne-ritual-summary">
              <span className="ne-eyebrow">YOUR PERSONAL RITUAL</span>
              <h3>
                A little time <em>for you.</em>
              </h3>
              <div className="ne-list-line">
                <span>GUESTS (DEMO)</span>
                <div className="ne-qty">
                  <button
                    aria-label="Remove guest"
                    disabled={guests <= 1}
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  >
                    <Minus size={16} />
                  </button>
                  <strong>{guests}</strong>
                  <button
                    aria-label="Add guest"
                    disabled={guests >= 4}
                    onClick={() => setGuests((g) => Math.min(4, g + 1))}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              {choices.length ? (
                choices.map((c, i) => (
                  <div className="ne-list-line" key={c.service.slug}>
                    <span>
                      {String(i + 1).padStart(2, "0")}. {c.service.name}
                      <small style={{ display: "block" }}>{c.option.minutes}m</small>
                    </span>
                    <strong>{formatPrice(c.option.price * guests)}</strong>
                  </div>
                ))
              ) : (
                <p style={{ padding: "28px 0" }}>
                  Choose at least one treatment to build your ritual.
                </p>
              )}
              <div className="ne-ritual-totals">
                <div>
                  <span>TOTAL ESTIMATED DURATION</span>
                  <strong>{formatMinutes(mins)}</strong>
                </div>
                <div>
                  <span>TOTAL PRICE / ALL GUESTS</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
              </div>
              <button
                className="ne-btn"
                style={{ width: "100%" }}
                disabled={!choices.length}
                onClick={startBooking}
              >
                CONTINUE TO BOOKING DEMO <ArrowUpRight size={18} />
              </button>
              <p className="ne-notice" style={{ marginTop: 20 }}>
                Prices are multiplied by guest count. Duration is calculated sequentially, not by
                staff/room availability. A real multi-guest system requires a backend.
              </p>
            </aside>
          </div>
        </div>
      </section>
      <EditorialCTA title="Make time for" italic="what matters." to="/packages" />
    </EditorialLayout>
  );
}

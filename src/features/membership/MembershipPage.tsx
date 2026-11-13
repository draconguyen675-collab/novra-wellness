import { P } from "@/content/editorial";
import { Chapter, EditorialHero, EditorialLayout, Scene } from "@/shared/ui/Editorial";
import { ArrowUpRight, Check } from "lucide-react";
import { useState } from "react";

export function MembershipPage() {
  const [annual, setAnnual] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const tiers = [
    {
      name: "The Pause",
      monthly: 29,
      features: [
        "Members-only experience guides",
        "Early access to curated events",
        "5% example discount on select rituals",
      ],
    },
    {
      name: "The Ritual",
      monthly: 69,
      features: [
        "Everything in The Pause",
        "A monthly 30-minute ritual credit (demo)",
        "Priority request window",
        "10% example discount on select rituals",
      ],
    },
    {
      name: "The Sanctuary",
      monthly: 129,
      features: [
        "Everything in The Ritual",
        "Two monthly 30-minute credits (demo)",
        "Personalised ritual planning",
        "An annual wellness gift example",
      ],
    },
  ];
  return (
    <EditorialLayout title="Membership">
      <EditorialHero
        index="15"
        eyebrow="BELONG TO A DIFFERENT PACE"
        title="A ritual"
        italic="to return to."
        subtitle="An editorial membership concept built for belonging and considered moments. Pricing is illustrative."
        image={P.room}
        scrollTo="membership"
      />
      <Chapter
        number="01"
        label="SOMETHING TO RETURN TO"
        title="More meaning."
        italic="Less rushing."
      >
        <p>
          A membership should feel like an invitation, not an obligation. Select a plan below to
          preview how a real wellness brand could present its benefits.
        </p>
      </Chapter>
      <section id="membership" className="ne-section ne-section--soft">
        <div className="ne-container">
          <div className="ne-section-header">
            <div>
              <span className="ne-eyebrow">MEMBERSHIP / DEMO</span>
              <h2 className="ne-heading">
                Your way <em>to unwind.</em>
              </h2>
            </div>
            <label className="ne-pill" style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input
                type="checkbox"
                checked={annual}
                onChange={(e) => setAnnual(e.target.checked)}
              />{" "}
              Annual billing (save 15%)
            </label>
          </div>
          <div className="ne-card-grid">
            {tiers.map((t, i) => (
              <article
                key={t.name}
                className={`ne-card-surface ${i === 1 ? "is-selected" : ""}`}
                data-nm-reveal
              >
                <span className="ne-eyebrow">0{i + 1} / A CLOSER EXPERIENCE</span>
                <h3 style={{ marginTop: 50 }}>{t.name}</h3>
                <div style={{ margin: "30px 0" }}>
                  <span className="ne-price">
                    ${annual ? (t.monthly * 12 * 0.85).toFixed(0) : t.monthly}
                  </span>{" "}
                  <span className="ne-tiny">/ {annual ? "year (example)" : "month"}</span>
                </div>
                {t.features.map((f) => (
                  <p key={f} style={{ margin: "10px 0", display: "flex", gap: 10 }}>
                    <Check size={16} style={{ flexShrink: 0, marginTop: 6 }} />
                    {f}
                  </p>
                ))}
                <button
                  style={{ marginTop: 30, width: "100%" }}
                  className="ne-btn"
                  onClick={() => setExpanded(expanded === i ? null : i)}
                >
                  {expanded === i ? "CLOSE BENEFITS" : "PREVIEW MEMBERSHIP"}{" "}
                  <ArrowUpRight size={17} />
                </button>
                {expanded === i && (
                  <p className="ne-notice" style={{ marginTop: 18 }}>
                    Preview only. No paid membership, billing, enrollment or discounts are activated
                    in this template.
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
      <Scene
        image={P.oils}
        tag="BELONG TO YOURSELF"
        title="Your own kind of belonging."
        sub="Build a wellness ritual that feels personal and sustainable."
        link="/ritual-builder"
      />
    </EditorialLayout>
  );
}

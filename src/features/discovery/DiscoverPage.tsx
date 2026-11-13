import { P } from "@/content/editorial";
import { SERVICES, formatMinutes, formatPrice } from "@/content/services";
import { Chapter, EditorialHero, EditorialLayout, PhotoCard, Scene } from "@/shared/ui/Editorial";
import { ArrowRight, ChevronLeft, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
const goals = [
  { id: "Rest", title: "I need to slow down", sub: "Ease into an unhurried moment", cat: "Body" },
  { id: "Glow", title: "I want to feel renewed", sub: "Care for skin and senses", cat: "Skin" },
  {
    id: "Reconnect",
    title: "I want to reconnect",
    sub: "Share time or meet yourself again",
    cat: "Ritual",
  },
] as const;
const moods = [
  { name: "Quiet & gentle", tag: "soft" },
  { name: "Balanced & restorative", tag: "balanced" },
  { name: "A longer escape", tag: "unhurried" },
];
export function DiscoverPage() {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<string>("Rest");
  const [duration, setDuration] = useState(90);
  const [mood, setMood] = useState("balanced");
  const recommendation = useMemo(() => {
    const category = goals.find((g) => g.id === goal)?.cat || "Body";
    return SERVICES.filter((s) => s.category === category)
      .map((s) => ({
        ...s,
        near: Math.min(...s.durationOptions.map((o) => Math.abs(o.minutes - duration))),
      }))
      .sort((a, b) => a.near - b.near)
      .slice(0, 3);
  }, [goal, duration]);
  return (
    <EditorialLayout title="Personal Wellness Concierge">
      <EditorialHero
        index="20"
        eyebrow="WELLNESS CONCIERGE / PERSONALIZED"
        title="What do you"
        italic="need today?"
        subtitle="A few small choices, a more personal starting point. This is a preference-based guide, not health advice."
        image={P.botanical}
        scrollTo="discover-interactive"
      />
      <Chapter number="01" label="THE INTENTION" title="Begin with" italic="a feeling.">
        <p>
          Not sure what to book? Let the experience meet you where you are. Choose your intention,
          the time you have and the rhythm you prefer.
        </p>
      </Chapter>
      <section className="ne-section ne-section--soft" id="discover-interactive">
        <div className="ne-container">
          <div className="ne-exp-top">
            <span className="ne-eyebrow">YOUR WELLNESS JOURNEY / STEP {step + 1} OF 4</span>
            <div className="ne-exp-progress">
              <i style={{ width: `${(step + 1) * 25}%` }} />
            </div>
          </div>
          <div key={step} className="ne-exp-stage" data-nm-reveal>
            {step === 0 && (
              <>
                <h2 className="ne-heading">
                  What brings
                  <br />
                  <em>you here?</em>
                </h2>
                <div className="ne-exp-options">
                  {goals.map((g) => (
                    <button
                      type="button"
                      className={`ne-exp-choice ${goal === g.id ? "is-selected" : ""}`}
                      key={g.id}
                      onClick={() => setGoal(g.id)}
                    >
                      <span className="ne-tiny">{g.id.toUpperCase()}</span>
                      <strong>{g.title}</strong>
                      <small>{g.sub}</small>
                      <span className="ne-exp-choice__check">{goal === g.id ? "✓" : "↗"}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            {step === 1 && (
              <>
                <h2 className="ne-heading">
                  How much time
                  <br />
                  <em>is yours?</em>
                </h2>
                <div className="ne-exp-options">
                  {[30, 60, 90, 120, 150].map((n) => (
                    <button
                      className={`ne-exp-choice ${duration === n ? "is-selected" : ""}`}
                      onClick={() => setDuration(n)}
                      key={n}
                    >
                      <span className="ne-tiny">YOUR PREFERRED DURATION</span>
                      <strong>{n} minutes</strong>
                      <small>
                        {n <= 60
                          ? "A small pause"
                          : n <= 90
                            ? "Time to settle"
                            : "A spacious escape"}
                      </small>
                      <span className="ne-exp-choice__check">{duration === n ? "✓" : "↗"}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <h2 className="ne-heading">
                  What pace
                  <br />
                  <em>feels right?</em>
                </h2>
                <div className="ne-exp-options">
                  {moods.map((m) => (
                    <button
                      className={`ne-exp-choice ${mood === m.tag ? "is-selected" : ""}`}
                      onClick={() => setMood(m.tag)}
                      key={m.tag}
                    >
                      <span className="ne-tiny">THE RITUAL MOOD</span>
                      <strong>{m.name}</strong>
                      <small>There is no right answer — only yours.</small>
                      <span className="ne-exp-choice__check">{mood === m.tag ? "✓" : "↗"}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <span className="ne-eyebrow">THE EXPERIENCES FOR YOU</span>
                <h2 className="ne-heading" style={{ marginBottom: 30 }}>
                  A little closer
                  <br />
                  <em>to yourself.</em>
                </h2>
                <p className="ne-text">
                  Based on your selected category and time, here are three illustrative matches. The
                  guide does not evaluate medical suitability or live availability.
                </p>
                <div className="ne-card-grid" style={{ marginTop: 45 }}>
                  {recommendation.map((s) => (
                    <PhotoCard
                      src={s.image}
                      title={s.name}
                      meta={`${formatMinutes(s.minutes)} · ${formatPrice(s.price)}`}
                      link={`/services/${s.slug}`}
                      key={s.slug}
                    />
                  ))}
                </div>
                <div className="ne-exp-summary">
                  INTENTION: {goal.toUpperCase()} · TIME: {duration} MIN · PACE:{" "}
                  {mood.toUpperCase()}
                </div>
              </>
            )}
            <div className="ne-exp-nav">
              <button
                className="ne-btn ne-btn--outline"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                <ChevronLeft size={18} /> BACK
              </button>
              {step < 3 ? (
                <button className="ne-btn" onClick={() => setStep((s) => Math.min(3, s + 1))}>
                  CONTINUE <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  className="ne-btn"
                  onClick={() => {
                    setStep(0);
                    setGoal("Rest");
                    setDuration(90);
                    setMood("balanced");
                  }}
                >
                  START AGAIN <Sparkles size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      <Scene
        image={P.room}
        tag="PERSONAL, NOT PRESCRIBED"
        title="Feel more, choose less."
        sub="Thoughtfully selected experiences, shaped around the time you have."
        link="/services"
      />
    </EditorialLayout>
  );
}

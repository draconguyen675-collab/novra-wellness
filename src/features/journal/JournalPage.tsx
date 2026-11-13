import { JOURNAL, P } from "@/content/editorial";
import {
  Chapter,
  EditorialCTA,
  EditorialHero,
  EditorialLayout,
  PhotoCard,
} from "@/shared/ui/Editorial";
import { useState } from "react";

export function JournalPage() {
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const cats = ["ALL", ...new Set(JOURNAL.map((p) => p.category))];
  const visible = JOURNAL.filter(
    (p) =>
      (filter === "ALL" || p.category === filter) &&
      `${p.title} ${p.excerpt}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <EditorialLayout title="The Journal">
      <EditorialHero
        index="17"
        eyebrow="NOTES ON LIVING"
        title="The art of"
        italic="noticing."
        subtitle="Small notes for a slower, richer way of living. Thoughts, rituals and spaces worth sharing."
        image={P.journal1}
        scrollTo="articles"
      />
      <Chapter number="01" label="EDITOR'S LETTER" title="A quieter" italic="conversation.">
        <p>
          A collection of notes on the small and significant moments that shape our experience of
          rest and care.
        </p>
      </Chapter>
      <section className="ne-section ne-section--soft" id="articles">
        <div className="ne-container">
          <div className="ne-section-header">
            <div>
              <span className="ne-eyebrow">THE EDITORIAL</span>
              <h2 className="ne-heading">
                Stories to <em>stay with.</em>
              </h2>
            </div>
            <label className="ne-form-field" style={{ width: 280 }}>
              SEARCH ARTICLES
              <input
                className="ne-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find a story..."
              />
            </label>
          </div>
          <div className="ne-pill-row">
            {cats.map((c) => (
              <button
                className="ne-pill"
                aria-pressed={filter === c}
                onClick={() => setFilter(c)}
                key={c}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="ne-card-grid">
            {visible.map((p) => (
              <PhotoCard
                key={p.slug}
                src={p.image}
                title={p.title}
                meta={`${p.category} · ${p.read}`}
                link={`/journal/${p.slug}`}
              />
            ))}
          </div>
          {visible.length === 0 && (
            <p className="ne-empty">No stories match. Try another category or search.</p>
          )}
        </div>
      </section>
      <EditorialCTA title="Return to" italic="the present." to="/discover" />
    </EditorialLayout>
  );
}

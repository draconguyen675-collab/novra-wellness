import { GALLERY, P } from "@/content/editorial";
import { Chapter, EditorialCTA, EditorialHero, EditorialLayout } from "@/shared/ui/Editorial";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";

export function GalleryPage() {
  const [filter, setFilter] = useState("ALL");
  const [active, setActive] = useState<number | null>(null);
  const filters = ["ALL", "INTERIORS", "TREATMENTS", "DETAILS"];
  const visible = GALLERY.map((g, i) => ({ ...g, originalIndex: i })).filter(
    (g) => filter === "ALL" || g.type === filter,
  );
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((a) => (a === null ? a : (a + 1) % GALLERY.length));
      if (e.key === "ArrowLeft")
        setActive((a) => (a === null ? a : (a + GALLERY.length - 1) % GALLERY.length));
    };
    window.addEventListener("keydown", onKey);
    const last = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      last?.focus();
    };
  }, [active]);
  return (
    <EditorialLayout title="Our Spaces & Gallery">
      <EditorialHero
        index="14"
        eyebrow="VISUAL JOURNAL"
        title="A place"
        italic="to exhale."
        subtitle="Spaces, gestures and textures — an illustrated collection of quiet moments."
        image={P.architecture}
        scrollTo="gallery-grid"
      />
      <Chapter number="01" label="A SENSE OF PLACE" title="Beauty in" italic="the details.">
        <p>
          The atmosphere is never an afterthought. Explore the images, and notice the forms,
          textures and small rituals that make a space feel like yours.
        </p>
      </Chapter>
      <section className="ne-section ne-section--soft" id="gallery-grid">
        <div className="ne-container">
          <div className="ne-pill-row" role="group" aria-label="Filter gallery">
            {filters.map((t) => (
              <button
                className="ne-pill"
                aria-pressed={filter === t}
                onClick={() => setFilter(t)}
                key={t}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="ne-card-grid ne-card-grid--two">
            {visible.map((g) => (
              <button
                type="button"
                key={g.originalIndex}
                className="ne-photo-card ne-gallery-tile"
                onClick={() => setActive(g.originalIndex)}
                aria-label={`View ${g.title}`}
              >
                <div className="ne-photo-card__image" data-nm-media>
                  <img src={g.image} alt={g.title} loading="lazy" />
                </div>
                <div className="ne-photo-card__meta">
                  <span>{g.type}</span>
                  <span>VIEW IMAGE ↗</span>
                </div>
                <h3>{g.title}</h3>
              </button>
            ))}
          </div>
        </div>
      </section>
      <EditorialCTA title="See the" italic="spaces in person." to="/locations" />
      {active !== null && (
        <div
          className="ne-dialog-backdrop"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setActive(null);
          }}
        >
          <div
            className="ne-dialog-panel"
            role="dialog"
            aria-modal="true"
            aria-label={`Gallery: ${GALLERY[active].title}`}
          >
            <img src={GALLERY[active].image} alt={GALLERY[active].title} />
            <div className="ne-dialog-controls">
              <button
                onClick={() => setActive((active + GALLERY.length - 1) % GALLERY.length)}
                aria-label="Previous photo"
              >
                <ChevronLeft />
              </button>
              <span>
                {GALLERY[active].title} / {active + 1}—{GALLERY.length}
              </span>
              <button
                onClick={() => setActive((active + 1) % GALLERY.length)}
                aria-label="Next photo"
              >
                <ChevronRight />
              </button>
              <button onClick={() => setActive(null)} aria-label="Close gallery">
                <X />
              </button>
            </div>
          </div>
        </div>
      )}
    </EditorialLayout>
  );
}

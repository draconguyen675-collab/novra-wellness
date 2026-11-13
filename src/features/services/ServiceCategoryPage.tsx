import { P } from "@/content/editorial";
import { SERVICES, formatMinutes, formatPrice } from "@/content/services";
import { Chapter, EditorialHero, EditorialLayout, PhotoCard, Scene } from "@/shared/ui/Editorial";
import { ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export function ServiceCategoryPage() {
  const { slug } = useParams();
  const cat = (slug || "body").toLowerCase();
  const category = cat === "skin" ? "Skin" : cat === "ritual" ? "Ritual" : "Body";
  const items = SERVICES.filter((s) => s.category === category);
  return (
    <EditorialLayout title={`${category} Rituals`}>
      <EditorialHero
        eyebrow={`TREATMENTS / ${category.toUpperCase()}`}
        index="06"
        title={category === "Body" ? "The body" : category === "Skin" ? "Skin, softly" : "Make it"}
        italic={category === "Body" ? "remembers." : category === "Skin" ? "renewed." : "a ritual."}
        subtitle="Find a calmer rhythm with a thoughtfully chosen experience."
        image={items[0]?.image || P.spa}
        scrollTo="category-items"
      />
      <Chapter number="01" label="EXPLORE BY FEELING" title="Every ritual" italic="is personal.">
        <p>
          Browse our {category.toLowerCase()} collection. Explore the details and choose the length
          of your experience. All prices shown are examples.
        </p>
        <Link to="/services" className="ne-btn">
          ALL TREATMENTS <ArrowUpRight size={18} />
        </Link>
      </Chapter>
      <section id="category-items" className="ne-section ne-section--soft">
        <div className="ne-container">
          <div className="ne-card-grid">
            {items.map((s, i) => (
              <PhotoCard
                key={s.slug}
                src={s.image}
                title={s.name}
                meta={`${formatMinutes(s.minutes)} · FROM ${formatPrice(s.price)}`}
                number={String(i + 1).padStart(2, "0")}
                link={`/services/${s.slug}`}
              />
            ))}
          </div>
        </div>
      </section>
      <Scene
        image={P.sanctuary}
        tag="THE ART OF ARRIVING"
        title="The most valuable thing is time."
        sub="Choose a little time for yourself and let everything else become quieter."
        link="/booking"
        action="BEGIN A BOOKING DEMO"
      />
    </EditorialLayout>
  );
}

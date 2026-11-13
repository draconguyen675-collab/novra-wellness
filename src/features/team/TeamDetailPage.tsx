import { P, THERAPISTS } from "@/content/editorial";
import {
  Chapter,
  EditorialCTA,
  EditorialHero,
  EditorialLayout,
  PhotoCard,
  Scene,
} from "@/shared/ui/Editorial";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export function TeamDetailPage() {
  const { slug } = useParams();
  const therapist = THERAPISTS.find((t) => t.slug === slug);
  if (!therapist)
    return (
      <EditorialLayout title="Therapist Not Found">
        <section className="ne-container ne-section">
          <h1 className="ne-heading">Profile not found.</h1>
          <Link className="ne-btn" to="/team">
            VIEW OUR TEAM <ArrowLeft size={18} />
          </Link>
        </section>
      </EditorialLayout>
    );
  const nearby = THERAPISTS.filter((t) => t.slug !== therapist.slug).slice(0, 3);
  return (
    <EditorialLayout title={therapist.name}>
      <EditorialHero
        index="13"
        eyebrow={therapist.role.toUpperCase()}
        title={therapist.name.split(" ")[0]}
        italic={therapist.name.split(" ").slice(1).join(" ")}
        subtitle={`${therapist.tenure}. ${therapist.specialty}. A little more attention to every moment.`}
        image={therapist.image}
        scrollTo="profile"
      />
      <Chapter number="01" label="THE PERSON" title="Care, led" italic="by curiosity.">
        <p>{therapist.bio}</p>
        <div className="ne-pill-row" style={{ marginTop: 25 }}>
          {therapist.tags.map((t) => (
            <span className="ne-pill" key={t}>
              {t}
            </span>
          ))}
        </div>
      </Chapter>
      <Scene
        image={P.spa}
        tag="A NOTE FROM THE TEAM"
        title={`“${therapist.quote}”`}
        sub="An example philosophy of care that can be customized for your spa business."
      />
      <section className="ne-section ne-container" id="profile">
        <div className="ne-section-header">
          <div>
            <span className="ne-eyebrow">PEOPLE / MORE</span>
            <h2 className="ne-heading">
              Meet the <em>team.</em>
            </h2>
          </div>
        </div>
        <div className="ne-card-grid">
          {nearby.map((p) => (
            <PhotoCard
              src={p.image}
              title={p.name}
              meta={p.role}
              link={`/team/${p.slug}`}
              key={p.slug}
            />
          ))}
        </div>
      </section>
      <EditorialCTA title="Begin with" italic="your own ritual." to="/booking" />
    </EditorialLayout>
  );
}

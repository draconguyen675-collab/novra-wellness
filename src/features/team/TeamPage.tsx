import { P, THERAPISTS } from "@/content/editorial";
import { Chapter, EditorialHero, EditorialLayout, PhotoCard, Scene } from "@/shared/ui/Editorial";

export function TeamPage() {
  return (
    <EditorialLayout title="Our Therapists">
      <EditorialHero
        eyebrow="THE PEOPLE"
        index="12"
        title="Made human."
        italic="Made for you."
        subtitle="Meet the guides behind each quietly personal experience. All profiles in this showcase are fictional."
        image={P.therapy}
        scrollTo="team"
      />
      <Chapter number="01" label="HUMAN BY DESIGN" title="Care begins" italic="with listening.">
        <p>
          Our philosophy is simple: make room for real people, with individual preferences and
          unique ways of finding comfort. These biographies are illustrative demo content.
        </p>
      </Chapter>
      <section className="ne-section ne-section--soft" id="team">
        <div className="ne-container">
          <div className="ne-section-header">
            <div>
              <span className="ne-eyebrow">THE PRACTITIONERS</span>
              <h2 className="ne-heading">
                People of <em>presence.</em>
              </h2>
            </div>
            <p>Four example practitioners. Each card opens a fully authored profile page.</p>
          </div>
          <div className="ne-card-grid ne-card-grid--two">
            {THERAPISTS.map((t, i) => (
              <PhotoCard
                key={t.slug}
                src={t.image}
                title={t.name}
                meta={t.role}
                number={`0${i + 1}`}
                link={`/team/${t.slug}`}
              />
            ))}
          </div>
        </div>
      </section>
      <Scene
        image={P.botanical}
        tag="THE HUMAN TOUCH"
        title="A practice of paying attention."
        sub="What stays with us is not a technique, but the feeling of being heard."
        link="/services"
      />
    </EditorialLayout>
  );
}

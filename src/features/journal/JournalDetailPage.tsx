import { JOURNAL } from "@/content/editorial";
import { EditorialHero, EditorialLayout, PhotoCard } from "@/shared/ui/Editorial";
import { Copy } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

export function JournalDetailPage() {
  const { slug } = useParams();
  const post = JOURNAL.find((p) => p.slug === slug);
  const [copied, setCopied] = useState(false);
  if (!post)
    return (
      <EditorialLayout title="Story Not Found">
        <section className="ne-section ne-container">
          <h1 className="ne-heading">Story not found.</h1>
          <Link to="/journal" className="ne-btn">
            BACK TO THE JOURNAL
          </Link>
        </section>
      </EditorialLayout>
    );
  const related = JOURNAL.filter((p) => p.slug !== post.slug).slice(0, 3);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  return (
    <EditorialLayout title={post.title}>
      <EditorialHero
        index="18"
        eyebrow={`${post.category} / ${post.read}`}
        title={post.title.split(" ").slice(0, -2).join(" ") || "The art"}
        italic={post.title.split(" ").slice(-2).join(" ")}
        subtitle={post.excerpt}
        image={post.image}
        scrollTo="journal-copy"
      />
      <section className="ne-section" id="journal-copy">
        <div className="ne-container">
          <div className="ne-article">
            <div className="ne-breadcrumb">
              <Link to="/journal">THE JOURNAL</Link>
              <span>/</span>
              <span>{post.date}</span>
            </div>
            <p
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "clamp(30px,4vw,55px)",
                lineHeight: 1.18,
              }}
            >
              {post.excerpt}
            </p>
            {post.sections.map((s) => (
              <div key={s.title}>
                <h2>{s.title}</h2>
                <p>{s.body}</p>
              </div>
            ))}
            <button onClick={copy} className="ne-btn" style={{ marginTop: 35 }}>
              {copied ? "LINK COPIED" : "COPY THIS STORY"} <Copy size={16} />
            </button>
          </div>
        </div>
      </section>
      <section className="ne-section ne-section--soft">
        <div className="ne-container">
          <div className="ne-section-header">
            <h2 className="ne-heading">
              Read a <em>little more.</em>
            </h2>
          </div>
          <div className="ne-card-grid">
            {related.map((p) => (
              <PhotoCard
                src={p.image}
                title={p.title}
                meta={p.read}
                link={`/journal/${p.slug}`}
                key={p.slug}
              />
            ))}
          </div>
        </div>
      </section>
    </EditorialLayout>
  );
}

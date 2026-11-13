import { formatMinutes, formatPrice, type Service } from "@/content/services";
import { ArrowUpRight, Check, Clock3, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function ServiceEditorialCard({
  service,
  index,
  isComparing = false,
  onCompare,
  featured = false,
  compareDisabled = false,
}: {
  service: Service;
  index: number;
  isComparing?: boolean;
  compareDisabled?: boolean;
  onCompare?: (slug: string) => void;
  featured?: boolean;
}) {
  return (
    <article className={`nv-svc-card${featured ? " nv-svc-card--featured" : ""}`}>
      <div className="nv-svc-card__image">
        <img
          src={service.image}
          alt={`${service.name} – illustrative wellness photography`}
          loading="lazy"
        />
        <span className="nv-svc-card__tag">{service.tag}</span>
        <Link
          to={`/services/${service.slug}`}
          className="nv-svc-card__image-link"
          aria-label={`Explore ${service.name}`}
        >
          <ArrowUpRight size={23} />
        </Link>
      </div>
      <div className="nv-svc-card__meta">
        <span>
          {String(index + 1).padStart(2, "0")} / {service.category.toUpperCase()}
        </span>
        <span>
          <Clock3 size={13} /> {formatMinutes(service.minutes)}
        </span>
      </div>
      <h3>
        <Link to={`/services/${service.slug}`}>{service.name}</Link>
      </h3>
      <p className="nv-svc-card__description">{service.description}</p>
      <div className="nv-svc-card__bottom">
        <div>
          <small>FROM</small>
          <strong>{formatPrice(Math.min(...service.durationOptions.map((o) => o.price)))}</strong>
        </div>
        {onCompare && (
          <button
            className="nv-svc-card__compare"
            type="button"
            disabled={compareDisabled}
            title={compareDisabled ? "Compare up to 3 treatments" : undefined}
            onClick={() => onCompare(service.slug)}
            aria-pressed={isComparing}
            aria-label={`${isComparing ? "Remove" : "Add"} ${service.name} ${isComparing ? "from" : "to"} comparison`}
          >
            {isComparing ? <Check size={16} /> : <Plus size={16} />}
            {isComparing ? "Added" : "Compare"}
          </button>
        )}
        <Link className="nv-svc-card__details" to={`/services/${service.slug}`}>
          Explore <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}

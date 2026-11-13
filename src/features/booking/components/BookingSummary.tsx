import { LOCATIONS } from "@/content/locations";
import { formatMinutes, formatPrice } from "@/content/services";
import "@/features/booking/booking.css";
import { BookingDraft } from "@/features/booking/model/booking";
import "@/shared/styles/editorial.css";
import "@/shared/styles/experiences.css";
export function Summary({ draft }: { draft: BookingDraft }) {
  const branch = LOCATIONS.find((l) => l.slug === draft.location);
  return (
    <aside className="nb-summary">
      <span className="ne-eyebrow">THE RITUAL / YOUR SELECTION</span>
      <h3>
        A moment
        <br />
        <em>made for you.</em>
      </h3>
      <div className="nb-summary__divider" />
      <div className="nb-summary__line">
        <span>EXPERIENCE</span>
        <strong>{draft.label}</strong>
      </div>
      <div className="nb-summary__line">
        <span>GUESTS</span>
        <strong>{draft.guests}</strong>
      </div>
      <div className="nb-summary__line">
        <span>LOCATION</span>
        <strong>{branch?.name || "Select a branch"}</strong>
      </div>
      <div className="nb-summary__line">
        <span>DURATION</span>
        <strong>{formatMinutes(draft.minutes)}</strong>
      </div>
      <div className="nb-summary__line">
        <span>PREFERRED DAY</span>
        <strong>{draft.date || "Not selected"}</strong>
      </div>
      <div className="nb-summary__line">
        <span>EXAMPLE TIME</span>
        <strong>{draft.time || "Not selected"}</strong>
      </div>
      {draft.details && (
        <div className="nb-summary__details">
          {draft.details.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
      )}
      <div className="nb-summary__total">
        <span>ESTIMATED TOTAL</span>
        <strong>{formatPrice(draft.price)}</strong>
      </div>
      <p>
        This is an interactive frontend demo. No live inventory, rooms, staff availability, payment
        or appointment confirmation.
      </p>
    </aside>
  );
}

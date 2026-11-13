import { formatPrice } from "@/content/services";
import "@/features/booking/booking.css";
import { BookingDraft } from "@/features/booking/model/booking";
import ServicesShell from "@/shared/layout/SiteShell";
import "@/shared/styles/editorial.css";
import "@/shared/styles/experiences.css";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
export function ConfirmationPage() {
  const [item] = useState<null | (BookingDraft & { id: string })>(() => {
    try {
      const v = sessionStorage.getItem("novra-example-confirmation");
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  });
  useEffect(() => {
    document.title = "Booking Demo Confirmation | NOVRA Wellness";
  }, []);
  return (
    <ServicesShell>
      <div className="ne-page nb-confirmation">
        <section className="ne-container nb-confirmation__content">
          <span className="nb-confirmation__symbol">
            <Check size={35} />
          </span>
          <span className="ne-eyebrow">THIS IS A FRONTEND DEMONSTRATION</span>
          <h1 className="ne-heading">
            A moment
            <br />
            <em>to look forward to.</em>
          </h1>
          <p className="ne-text">
            Your example selection has been generated in this browser.{" "}
            <strong>No real reservation exists and no payment was made.</strong>
          </p>
          {item && (
            <div className="nb-confirmation__receipt">
              <div>
                <span>DEMO REFERENCE</span>
                <strong>{item.id}</strong>
              </div>
              <div>
                <span>EXPERIENCE</span>
                <strong>{item.label}</strong>
              </div>
              <div>
                <span>PREFERRED DAY / TIME</span>
                <strong>
                  {item.date} / {item.time}
                </strong>
              </div>
              <div>
                <span>ESTIMATED TOTAL</span>
                <strong>{formatPrice(item.price)}</strong>
              </div>
            </div>
          )}
          {!item && (
            <p className="ne-notice">
              No example booking was found in this tab. Start a new booking to generate one.
            </p>
          )}
          <div className="nb-confirmation__actions">
            <Link className="ne-btn" to="/booking?step=1">
              BEGIN AGAIN <ArrowRight size={17} />
            </Link>
            <Link className="ne-btn ne-btn--outline" to="/">
              BACK TO HOME <ArrowLeft size={17} />
            </Link>
          </div>
        </section>
      </div>
    </ServicesShell>
  );
}

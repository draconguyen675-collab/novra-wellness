import { P } from "@/content/editorial";
import { Chapter, EditorialCTA, EditorialHero, EditorialLayout } from "@/shared/ui/Editorial";
import { Gift, X } from "lucide-react";
import { useState } from "react";

export function GiftCardsPage() {
  const [amount, setAmount] = useState(100);
  const [theme, setTheme] = useState("BOTANICAL");
  const [to, setTo] = useState("Someone wonderful");
  const [from, setFrom] = useState("With love");
  const [message, setMessage] = useState("A little time, just for you.");
  const [show, setShow] = useState(false);
  return (
    <EditorialLayout title="Gift Cards">
      <EditorialHero
        index="16"
        eyebrow="THE GIFT OF TIME"
        title="Give a"
        italic="gentler day."
        subtitle="A considered gift starts with a moment of attention. Create a sample voucher to preview the experience."
        image={P.oils}
        scrollTo="gift-studio"
      />
      <Chapter number="01" label="A THOUGHTFUL GESTURE" title="Time is" italic="a beautiful gift.">
        <p>
          Choose an amount, a visual direction and a message. This is a design preview — the
          generated voucher has no monetary or redemption value.
        </p>
      </Chapter>
      <section id="gift-studio" className="ne-section ne-section--soft">
        <div className="ne-container ne-asym" style={{ alignItems: "start" }}>
          <div>
            <span className="ne-eyebrow">GIFT ATELIER / PERSONALIZE</span>
            <h2 className="ne-heading" style={{ margin: "22px 0 45px" }}>
              Thoughtful,
              <br />
              <em>by design.</em>
            </h2>
            <div className="ne-pill-row">
              {[50, 100, 150, 200, 300].map((v) => (
                <button
                  className="ne-pill"
                  aria-pressed={amount === v}
                  onClick={() => setAmount(v)}
                  key={v}
                >
                  ${v}
                </button>
              ))}
            </div>
            <div className="ne-pill-row">
              {["BOTANICAL", "MIDNIGHT", "CHAMPAGNE"].map((t) => (
                <button
                  className="ne-pill"
                  aria-pressed={theme === t}
                  onClick={() => setTheme(t)}
                  key={t}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="ne-form-grid">
              <label className="ne-form-field">
                Recipient
                <input
                  className="ne-input"
                  maxLength={50}
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </label>
              <label className="ne-form-field">
                From
                <input
                  className="ne-input"
                  maxLength={50}
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </label>
            </div>
            <label className="ne-form-field" style={{ marginTop: 20 }}>
              Your message
              <textarea
                className="ne-input"
                rows={3}
                maxLength={180}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>
            <button onClick={() => setShow(true)} className="ne-btn" style={{ marginTop: 26 }}>
              PREVIEW VOUCHER <Gift size={19} />
            </button>
            <p className="ne-notice" style={{ marginTop: 22 }}>
              Illustrative visual only. No payment, gift card issuance or redemption system is
              connected.
            </p>
          </div>
          <div className={`ne-voucher ne-voucher--${theme.toLowerCase()}`} data-nm-media>
            <span>✳ NOVRA / WELLNESS HOUSE</span>
            <div>
              <span className="ne-eyebrow">A MOMENT TO KEEP</span>
              <h3>
                For you,
                <br />
                <em>with care.</em>
              </h3>
              <p>{message || "Your moment of calm awaits."}</p>
            </div>
            <div className="ne-voucher__bottom">
              <strong>${amount}</strong>
              <div>
                TO {to}
                <br />
                FROM {from}
              </div>
            </div>
          </div>
        </div>
      </section>
      <EditorialCTA title="The best gift" italic="is presence." to="/packages" />
      {show && (
        <div
          role="presentation"
          className="ne-dialog-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShow(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Gift voucher preview"
            className="ne-voucher-dialog"
          >
            <button
              onClick={() => setShow(false)}
              className="ne-voucher-dialog__close"
              aria-label="Close"
            >
              <X />
            </button>
            <div className={`ne-voucher ne-voucher--${theme.toLowerCase()}`}>
              <span>✳ NOVRA / SAMPLE VOUCHER</span>
              <div>
                <h3>
                  For you,
                  <br />
                  <em>with care.</em>
                </h3>
                <p>{message}</p>
              </div>
              <div className="ne-voucher__bottom">
                <strong>${amount}</strong>
                <span>
                  TO {to}
                  <br />
                  FROM {from}
                </span>
              </div>
            </div>
            <p style={{ color: "#fff", marginTop: 20 }}>
              DESIGN PREVIEW ONLY — NOT VALID FOR REDEMPTION
            </p>
          </div>
        </div>
      )}
    </EditorialLayout>
  );
}

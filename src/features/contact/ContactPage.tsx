import { FAQS, P } from "@/content/editorial";
import { EditorialCTA, EditorialHero, EditorialLayout } from "@/shared/ui/Editorial";
import { ArrowUpRight, Check } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [open, setOpen] = useState<number | null>(0);
  const [error, setError] = useState("");
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "");
    const msg = String(fd.get("message") || "").trim();
    if (name.length < 2 || !email.includes("@") || msg.length < 10) {
      setError("Enter your name, a valid email and a message of at least 10 characters.");
      return;
    }
    setError("");
    setSent(true);
  };
  return (
    <EditorialLayout title="Contact & FAQs">
      <EditorialHero
        index="19"
        eyebrow="A CONVERSATION BEGINS"
        title="Say hello."
        italic="Stay awhile."
        subtitle="Questions, ideas or a reason to connect? This contact form demonstrates the experience without sending your data anywhere."
        image={P.sanctuary}
        scrollTo="contact"
      />
      <section className="ne-section" id="contact">
        <div className="ne-container ne-asym" style={{ alignItems: "start" }}>
          <div>
            <span className="ne-eyebrow">WE'RE HERE TO LISTEN</span>
            <h2 className="ne-heading" style={{ marginTop: 20 }}>
              Every story
              <br />
              <em>begins here.</em>
            </h2>
            <p className="ne-text" style={{ marginTop: 35 }}>
              NOVRA is a fictional concept spa. This contact experience can be connected to your
              email/API after purchase. No messages are transmitted by this demo.
            </p>
            <div className="ne-list-line">
              <span>BRANCH DISCOVERY</span>
              <Link to="/locations">VIEW OUR HOUSES ↗</Link>
            </div>
            <div className="ne-list-line">
              <span>TREATMENT DISCOVERY</span>
              <Link to="/services">VIEW OUR RITUALS ↗</Link>
            </div>
          </div>
          <div className="ne-card-surface">
            {sent ? (
              <div role="status">
                <Check size={38} />
                <h3>Your message is composed.</h3>
                <p>
                  This frontend example does not send emails. No data has been submitted to a
                  server.
                </p>
                <button onClick={() => setSent(false)} className="ne-btn" style={{ marginTop: 24 }}>
                  WRITE ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <span className="ne-eyebrow">GET IN TOUCH / DEMO</span>
                <div className="ne-form-grid" style={{ margin: "30px 0 22px" }}>
                  <label className="ne-form-field">
                    YOUR NAME
                    <input
                      name="name"
                      className="ne-input"
                      required
                      minLength={2}
                      maxLength={80}
                      placeholder="Your name"
                    />
                  </label>
                  <label className="ne-form-field">
                    EMAIL
                    <input
                      name="email"
                      type="email"
                      className="ne-input"
                      required
                      maxLength={120}
                      placeholder="hello@example.com"
                    />
                  </label>
                </div>
                <label className="ne-form-field">
                  I'D LIKE TO ASK ABOUT
                  <select className="ne-input" name="subject">
                    <option>General enquiry</option>
                    <option>Spa services</option>
                    <option>Shared experiences</option>
                    <option>Template licensing</option>
                  </select>
                </label>
                <label className="ne-form-field" style={{ marginTop: 20 }}>
                  YOUR MESSAGE
                  <textarea
                    className="ne-input"
                    name="message"
                    minLength={10}
                    rows={6}
                    required
                    maxLength={1500}
                    placeholder="Tell us a little about your enquiry..."
                  />
                </label>
                {error && (
                  <p role="alert" style={{ color: "#a2372d" }}>
                    {error}
                  </p>
                )}
                <button type="submit" className="ne-btn" style={{ marginTop: 27 }}>
                  PREVIEW MESSAGE <ArrowUpRight size={18} />
                </button>
                <p className="ne-notice" style={{ marginTop: 22 }}>
                  No email is sent. This demo intentionally does not store personal information.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
      <section className="ne-section ne-section--soft">
        <div className="ne-container ne-asym" style={{ alignItems: "start" }}>
          <div>
            <span className="ne-eyebrow">FREQUENT QUESTIONS</span>
            <h2 className="ne-heading" style={{ marginTop: 20 }}>
              A little more
              <br />
              <em>clarity.</em>
            </h2>
          </div>
          <div className="ne-faq">
            {FAQS.map((f, i) => (
              <div key={f.q}>
                <button
                  className="ne-faq__question"
                  aria-expanded={open === i}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  {f.q}
                  <span>{open === i ? "−" : "+"}</span>
                </button>
                {open === i && <p className="ne-faq__answer">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
      <EditorialCTA title="Ready to" italic="feel different?" to="/booking" />
    </EditorialLayout>
  );
}

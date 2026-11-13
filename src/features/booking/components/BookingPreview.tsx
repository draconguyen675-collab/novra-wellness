import { formatMinutes, formatPrice } from "@/content/services";
import { ArrowRight, ArrowUpRight, Check, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";

export type BookingSelection = {
  name: string;
  price: number;
  minutes: number;
  guests?: number;
  kind?: "package";
  packageSlug?: string;
  addOns?: string[];
};
export type BookingLocation = { slug: string; name: string };

const localDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  return `${year}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

/** Booking PREVIEW only: intentionally no backend, payment, or personal-data storage. */
export default function BookingPreview({
  selected,
  location,
  onClose,
}: {
  selected: BookingSelection;
  location?: BookingLocation;
  onClose: () => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const initialFocus = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    initialFocus.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]",
        ),
      ).filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const date = String(data.get("date") || "");
    const time = String(data.get("time") || "");
    if (!date || date < localDate() || !time) {
      setError("Choose a future date and an available example time.");
      return;
    }
    const record = {
      id: `NV-${Date.now()}`,
      service: selected.name,
      minutes: selected.minutes,
      price: selected.price,
      date,
      time,
      ...(selected.guests ? { guests: selected.guests } : {}),
      ...(selected.kind
        ? { kind: selected.kind, packageSlug: selected.packageSlug, addOns: selected.addOns ?? [] }
        : {}),
      ...(location ? { location: location.name, locationSlug: location.slug } : {}),
      demo: true,
    };
    try {
      const previous: unknown = JSON.parse(localStorage.getItem("novra-demo-requests") || "[]");
      localStorage.setItem(
        "novra-demo-requests",
        JSON.stringify([...(Array.isArray(previous) ? previous : []), record]),
      );
      setSaved(true);
    } catch {
      setError("Could not save the preview on this device. Please check your browser settings.");
    }
  };

  return (
    <div
      className="nv-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="nv-modal"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className="nv-modal-close"
          onClick={onClose}
          aria-label="Close booking preview"
        >
          <X size={20} />
        </button>
        {!saved ? (
          <>
            <div className="nv-eyebrow nv-eyebrow--dark">BOOKING / FRONTEND PREVIEW</div>
            <h2 id={titleId} className="nv-modal-title">
              Reserve your <em>ritual.</em>
            </h2>
            <div className="nv-selected-booking">
              <span>
                {selected.name}
                {selected.guests
                  ? ` · ${selected.guests} ${selected.guests === 1 ? "guest" : "guests"}`
                  : ""}
              </span>
              <span>
                {formatMinutes(selected.minutes)} · {formatPrice(selected.price)}
              </span>
            </div>
            {selected.addOns && selected.addOns.length > 0 && (
              <p className="nv-modal-note">
                <strong>Finishing touches:</strong> {selected.addOns.join(", ")}
              </p>
            )}
            {location && (
              <p className="nv-modal-note">
                <strong>Example location:</strong> {location.name} (fictional branch)
              </p>
            )}
            <p className="nv-modal-note">
              Demo only: no real slot is held or appointment confirmed. We store only the example
              service/package details, guest count, branch (if selected), date and time in this
              browser; name and email are not saved.
            </p>
            <form className="nv-book-form" onSubmit={submit}>
              <label>
                Your name
                <input
                  ref={initialFocus}
                  name="name"
                  required
                  maxLength={80}
                  autoComplete="name"
                  placeholder="Your name"
                />
              </label>
              <label>
                Email address
                <input
                  name="email"
                  type="email"
                  required
                  maxLength={120}
                  autoComplete="email"
                  placeholder="hello@example.com"
                />
              </label>
              <div className="nv-form-grid">
                <label>
                  Preferred date
                  <input
                    type="date"
                    name="date"
                    defaultValue={localDate()}
                    min={localDate()}
                    required
                  />
                </label>
                <label>
                  Example time
                  <select name="time" defaultValue="14:00" required>
                    <option value="09:00">09:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="16:00">16:00</option>
                  </select>
                </label>
              </div>
              {error && (
                <p className="nv-form-error" role="alert">
                  {error}
                </p>
              )}
              <button className="nv-button nv-button--dark nv-button--full" type="submit">
                Save example request <ArrowUpRight size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="nv-success" role="status">
            <span className="nv-success-icon">
              <Check size={28} />
            </span>
            <div className="nv-eyebrow nv-eyebrow--dark">SAVED ON THIS DEVICE</div>
            <h2 id={titleId} className="nv-modal-title">
              A quieter day <em>awaits.</em>
            </h2>
            <p>
              Your example preference was saved locally. No real appointment or payment was made.
            </p>
            <button type="button" className="nv-button nv-button--dark" onClick={onClose}>
              Continue exploring <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

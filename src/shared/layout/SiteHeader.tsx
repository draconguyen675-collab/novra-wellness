import "@/shared/styles/site.css";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigationDialog } from "@/shared/hooks/useNavigationDialog";
import { Link, useLocation } from "react-router-dom";
const primary = [
  { label: "Home", to: "/" },
  { label: "The Story", to: "/about" },
  { label: "Treatments", to: "/services" },
  { label: "Packages", to: "/packages" },
  { label: "Locations", to: "/locations" },
  { label: "The Journal", to: "/journal" },
  { label: "Discover", to: "/discover" },
];
const more = [
  { label: "Philosophy", to: "/philosophy" },
  { label: "Pricing", to: "/pricing" },
  { label: "Ritual Builder", to: "/ritual-builder" },
  { label: "Therapists", to: "/team" },
  { label: "Gallery", to: "/gallery" },
  { label: "Membership", to: "/membership" },
  { label: "Gift Cards", to: "/gift-cards" },
  { label: "Contact & FAQs", to: "/contact" },
];
export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const header = useRef<HTMLElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useNavigationDialog(open, header, close);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!transparent) return;
    const update = () => setScrolled(window.scrollY > 50);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [transparent]);
  return (
    <header
      ref={header}
      className={`nv-header nv-services-header ${!transparent || scrolled || open ? "nv-header--solid" : ""}`}
    >
      <Link to="/" className="nv-logo" aria-label="NOVRA Wellness homepage">
        <span className="nv-logo-symbol">
          N<span>✳</span>
        </span>
        <span className="nv-logo-type">
          NOVRA<small>WELLNESS HOUSE</small>
        </span>
      </Link>
      <nav className="nv-nav" aria-label="Primary navigation">
        {primary.map((p) => (
          <Link key={p.to} to={p.to} aria-current={pathname === p.to ? "page" : undefined}>
            {p.label}
          </Link>
        ))}
      </nav>
      <div className="nv-header-actions">
        <Link to="/booking?step=1" className="nv-nav-book">
          Book a ritual <ArrowUpRight size={16} />
        </Link>
        <button
          aria-expanded={open}
          aria-controls="novra-drawer"
          aria-label={open ? "Close navigation" : "Open navigation"}
          className="nv-menu-button"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <nav id="novra-drawer" className="nv-mobile-menu ne-site-menu" aria-label="All pages">
          <div className="ne-site-menu__heading">THE NOVRA COLLECTION / EXPLORE</div>
          {[...primary, ...more].map((p, i) => (
            <Link key={p.to} onClick={() => setOpen(false)} to={p.to}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {p.label}
              <ArrowUpRight size={20} />
            </Link>
          ))}
          <Link className="ne-site-menu__book" to="/booking?step=1" onClick={() => setOpen(false)}>
            Begin a booking <ArrowRight size={20} />
          </Link>
        </nav>
      )}
    </header>
  );
}

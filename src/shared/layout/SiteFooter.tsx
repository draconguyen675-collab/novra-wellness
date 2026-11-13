import MotionToggle from "@/shared/motion/MotionToggle";
import "@/shared/styles/site.css";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
export function SiteFooter() {
  return (
    <footer className="nv-footer">
      <div className="nv-container">
        <div className="nv-footer-top">
          <div>
            <div className="nv-footer-logo">
              NOVRA<span>✳</span>
            </div>
            <p>
              Feel more. Do less.
              <br />
              Return to yourself.
            </p>
            <Link
              to="/booking?step=1"
              className="nv-button nv-button--light"
              style={{ marginTop: 30 }}
            >
              BEGIN YOUR RITUAL <ArrowUpRight size={15} />
            </Link>
          </div>
          <nav aria-label="Footer navigation">
            <div>
              <span>THE EXPERIENCES</span>
              <Link to="/services">All treatments</Link>
              <Link to="/packages">Packages</Link>
              <Link to="/pricing">Pricing</Link>
              <Link to="/ritual-builder">Ritual Builder</Link>
              <Link to="/discover">Wellness Concierge</Link>
              <Link to="/membership">Membership</Link>
              <Link to="/gift-cards">Gift Cards</Link>
            </div>
            <div>
              <span>THE HOUSE</span>
              <Link to="/about">About Us</Link>
              <Link to="/philosophy">Our Philosophy</Link>
              <Link to="/locations">Our Locations</Link>
              <Link to="/team">Therapists</Link>
              <Link to="/gallery">Our Gallery</Link>
              <Link to="/journal">The Journal</Link>
              <Link to="/contact">Contact & FAQs</Link>
            </div>
          </nav>
        </div>
        <div className="nv-footer-bottom">
          <span>© {new Date().getFullYear()} NOVRA WELLNESS HOUSE — FICTIONAL BRAND / DEMO</span>
          <MotionToggle />
          <Link to="/screens">25 SCREEN DIRECTORY ↗</Link>
        </div>
      </div>
    </footer>
  );
}

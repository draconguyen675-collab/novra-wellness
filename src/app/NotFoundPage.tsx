import { EditorialLayout } from "@/shared/ui/Editorial";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <EditorialLayout title="Page Not Found">
      <section className="ne-section ne-container nv-directory">
        <span className="ne-eyebrow">404 / THE OTHER PATH</span>
        <h1 className="ne-heading">
          The quiet
          <br />
          <em>detour.</em>
        </h1>
        <p className="ne-text">
          We couldn't find that page. Perhaps something else is waiting for you.
        </p>
        <Link to="/" className="ne-btn">
          Return home ↗
        </Link>
      </section>
    </EditorialLayout>
  );
}

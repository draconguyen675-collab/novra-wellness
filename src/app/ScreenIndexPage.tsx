import { EditorialLayout } from "@/shared/ui/Editorial";
import { Link } from "react-router-dom";
import { SCREENS } from "./screen-directory";

export default function ScreenIndexPage() {
  return (
    <EditorialLayout title="25 Screens Directory">
      <section className="ne-container ne-section nv-directory">
        <span className="ne-eyebrow">NOVRA / THE COLLECTION</span>
        <h1 className="ne-heading">
          Twenty-five
          <br />
          <em>experiences.</em>
        </h1>
        <p className="ne-text">
          Explore the full collection. Complete the booking steps in order to preview your personal
          selection.
        </p>
        {SCREENS.map(([id, label, path]) => (
          <Link to={path} className="ne-list-line" key={id}>
            <span className="ne-tiny">{id}</span>
            <h3>{label}</h3>
            <span className="ne-tiny">{path} ↗</span>
          </Link>
        ))}
      </section>
    </EditorialLayout>
  );
}

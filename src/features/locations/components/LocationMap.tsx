import type { SpaLocation } from "@/content/locations";
import { getMapLink } from "@/content/locations";
import "@/features/locations/components/location-map.css";
import { ArrowUpRight, MapPin } from "lucide-react";
import { useId } from "react";

type Props = { branch: SpaLocation; compact?: boolean };

/** An always-available area illustration with a direct link to the real map. */
export default function LocationMap({ branch, compact = false }: Props) {
  const patternId = useId();
  return (
    <div className={`nl-map ${compact ? "nl-map--compact" : ""}`}>
      <a
        className="nl-map__preview"
        href={getMapLink(branch)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open the map of ${branch.neighborhood} in OpenStreetMap (new tab)`}
      >
        <svg viewBox="0 0 600 380" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <pattern
              id={patternId}
              width="85"
              height="75"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(-18)"
            >
              <rect width="85" height="75" fill="#e6e9df" />
              <rect x="9" y="9" width="66" height="55" rx="5" fill="#d6ddce" />
              <path d="M0 0H85M0 0V75" stroke="#f9f7ee" strokeWidth="10" />
            </pattern>
          </defs>
          <rect width="600" height="380" fill={`url(#${patternId})`} />
          <path d="M470 -40C350 90 620 135 450 290S475 420 530 440H680V-40Z" fill="#b8cec7" />
          <path
            d="M465 -40C345 90 615 135 445 290S470 420 525 440"
            stroke="#f4f2e8"
            strokeWidth="10"
            fill="none"
          />
          <path d="M-30 320L620 70M190 -40L300 420" stroke="#f9f7ee" strokeWidth="20" fill="none" />
          <path d="M-30 320L620 70M190 -40L300 420" stroke="#d4c9ae" strokeWidth="2" fill="none" />
          <rect
            x="72"
            y="64"
            width="105"
            height="90"
            rx="35"
            fill="#bccdb3"
            transform="rotate(-18 125 110)"
          />
          <circle cx="118" cy="102" r="19" fill="#a2b99d" />
          <circle cx="145" cy="122" r="16" fill="#adc1a5" />
          <path
            d="M130 255L245 212L285 180"
            stroke="#5b785e"
            strokeWidth="2"
            strokeDasharray="5 7"
            fill="none"
          />
          <circle cx="285" cy="180" r="56" fill="#344b3f" opacity=".08" />
          <circle cx="285" cy="180" r="35" fill="#344b3f" opacity=".12" />
          <circle cx="285" cy="180" r="19" fill="#344b3f" stroke="#f6f4ed" strokeWidth="5" />
          <path d="M279 181l4 4 8-10" stroke="#f6f4ed" strokeWidth="2" fill="none" />
        </svg>
        <span className="nl-map__compass" aria-hidden="true">
          N<span>↑</span>
        </span>
        <span className="nl-map__preview-label">
          <small>YOUR NEIGHBORHOOD</small>
          <strong>{branch.neighborhood}</strong>
          <span>
            {branch.coordinates.lat.toFixed(4)}° N / {branch.coordinates.lon.toFixed(4)}° E
          </span>
        </span>
        <span className="nl-map__open" aria-hidden="true">
          <ArrowUpRight size={19} />
        </span>
      </a>
      <div className="nl-map__footer">
        <div className="nl-map__label">
          <MapPin size={17} aria-hidden="true" />
          <span>
            {branch.city}
            <small>Illustrative area — demo house</small>
          </span>
        </div>
        <a href={getMapLink(branch)} target="_blank" rel="noopener noreferrer">
          Open map <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
      <p className="nl-map__credit">
        Stylized area guide, not a street map. OpenStreetMap opens in a new tab.
      </p>
    </div>
  );
}

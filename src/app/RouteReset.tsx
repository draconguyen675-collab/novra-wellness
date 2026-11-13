import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function RouteReset() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }
    let frame = 0;
    let tries = 0;
    let id = hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch {
      /* Malformed hashes still allow navigation. */
    }
    const scroll = () => {
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ block: "start", behavior: "instant" });
      else if (tries++ < 12) frame = requestAnimationFrame(scroll);
    };
    frame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}

import { useEffect, useRef } from "react";

/** CSS owns this loop so scroll triggers, route intros and GSAP cannot pause it. */
export default function Marquee() {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = track.current;
    const first = element?.firstElementChild;
    if (!element || !(first instanceof HTMLElement)) return;
    let disposed = false;
    const measure = () => {
      if (disposed) return;
      const distance = first.offsetWidth + (parseFloat(getComputedStyle(element).columnGap) || 0);
      if (!distance) return;
      element.style.setProperty("--nv-marquee-distance", `-${distance}px`);
      element.style.setProperty("--nv-marquee-duration", `${distance / 110}s`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(first);
    document.fonts.ready.then(measure);
    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, []);
  return (
    <div className="nv-ticker" aria-label="Rest, restore, reconnect">
      <div className="nv-ticker-track" ref={track} aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <span key={index}>
            REST <b>✳</b> RESTORE <b>✳</b> RECONNECT <b>✳</b>
          </span>
        ))}
      </div>
    </div>
  );
}

import { setMotionPreference, useReducedMotion } from "@/shared/motion/preferences";
import { Pause, Play } from "lucide-react";

export default function MotionToggle() {
  const reduced = useReducedMotion();
  return (
    <button
      type="button"
      className="nm-motion-toggle"
      aria-pressed={!reduced}
      aria-label="Animations"
      title={reduced ? "Play animations" : "Pause animations"}
      onClick={() => setMotionPreference(reduced ? "full" : "reduced")}
    >
      <span>{reduced ? "Resume motion" : "Pause motion"}</span>
      {reduced ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
    </button>
  );
}

import { useGSAP } from "@gsap/react";
import { useSyncExternalStore } from "react";

export type MotionPreference = "full" | "reduced";
const changeEvent = "novra-motion-change";
// Each visit starts with motion. Pausing is optional and lasts for this visit.
let preference: MotionPreference = "full";
document.documentElement.dataset.motion = preference;

export const isMotionReduced = () => preference === "reduced";
export const motionQuery = () =>
  isMotionReduced() ? "(min-width: 1px) and (max-width: 0px)" : "(min-width: 0px)";

export function setMotionPreference(next: MotionPreference) {
  preference = next;
  document.documentElement.dataset.motion = next;
  window.dispatchEvent(new Event(changeEvent));
}

function subscribe(listener: () => void) {
  window.addEventListener(changeEvent, listener);
  return () => {
    window.removeEventListener(changeEvent, listener);
  };
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, isMotionReduced, () => false);
}

type MotionConfig = {
  scope?: React.RefObject<HTMLElement | null>;
  dependencies?: unknown[];
  revertOnUpdate?: boolean;
};

/** Rebuild page timelines on preference changes without remounting form state. */
export function useMotionGSAP(
  callback: (context: gsap.Context) => unknown,
  config: MotionConfig = {},
) {
  const reduced = useReducedMotion();
  return useGSAP(callback, {
    ...config,
    dependencies: [reduced, ...(config.dependencies ?? [])],
    revertOnUpdate: true,
  });
}

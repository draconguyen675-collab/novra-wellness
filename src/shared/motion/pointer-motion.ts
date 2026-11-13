import gsap from "gsap";

/** Delegation includes controls inserted by filters without retaining old DOM. */
export function createPointerMotion(cursor: HTMLElement) {
  const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3.out" });
  const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3.out" });
  let active: HTMLElement | null = null;
  let visible = false;
  const reset = () => {
    if (active) {
      active.style.removeProperty("--nm-magnet-x");
      active.style.removeProperty("--nm-magnet-y");
      active.removeAttribute("data-nm-magnetic");
      active = null;
    }
  };
  const hide = () => {
    visible = false;
    cursor.classList.remove("is-visible", "is-active");
    reset();
  };
  const move = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    const target = event.target instanceof Element ? event.target : null;
    if (!target || target.closest("input, textarea, select, [role='dialog']")) {
      hide();
      return;
    }
    if (!visible) {
      gsap.set(cursor, { x: event.clientX, y: event.clientY });
      visible = true;
    }
    xTo(event.clientX);
    yTo(event.clientY);
    cursor.classList.add("is-visible");
    cursor.classList.toggle(
      "is-active",
      Boolean(target.closest("a, button:not(:disabled), summary")),
    );
    const button = target.closest<HTMLElement>(
      ".nv-button:not(:disabled), .nv-nav-book, .ne-btn:not(:disabled), .nv-card-arrow, .ne-photo-card__round",
    );
    if (button !== active) {
      reset();
      active = button;
    }
    if (active) {
      const rect = active.getBoundingClientRect();
      active.setAttribute("data-nm-magnetic", "");
      active.style.setProperty(
        "--nm-magnet-x",
        `${gsap.utils.clamp(-9, 9, (event.clientX - rect.left - rect.width / 2) * 0.16)}px`,
      );
      active.style.setProperty(
        "--nm-magnet-y",
        `${gsap.utils.clamp(-7, 7, (event.clientY - rect.top - rect.height / 2) * 0.16)}px`,
      );
    }
  };
  document.addEventListener("pointermove", move, { passive: true });
  document.documentElement.addEventListener("pointerleave", hide);
  window.addEventListener("blur", hide);
  window.addEventListener("scroll", hide, { passive: true });
  document.addEventListener("keydown", hide);
  return () => {
    hide();
    xTo.tween.kill();
    yTo.tween.kill();
    document.removeEventListener("pointermove", move);
    document.documentElement.removeEventListener("pointerleave", hide);
    window.removeEventListener("blur", hide);
    window.removeEventListener("scroll", hide);
    document.removeEventListener("keydown", hide);
  };
}

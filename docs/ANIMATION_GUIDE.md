# NOVRA motion system

## Source files

- `src/shared/motion/preferences.ts`: shared motion state and GSAP lifecycle hook.
- `src/shared/motion/MotionDirector.tsx`: page curtain, scroll progress, text and image reveals, manifesto pin, cursor and debug panel.
- `src/shared/motion/Marquee.tsx`: measured CSS marquee loop.
- `src/shared/motion/MotionToggle.tsx`: footer pause/resume control.
- `src/shared/ui/Editorial.tsx`: reusable cinematic hero and editorial scenes.
- `src/features/`: page-specific animation timelines and styles.
- `src/shared/motion/motion-director.css` and `src/shared/styles/`: shared motion and layout styles.

## Current behavior

This showcase starts with full motion, including when the OS requests reduced motion. The footer's **MOTION ON/OFF** control pauses decorative movement for the current visit. The choice survives client-side navigation, but a full reload starts motion again. Pause/resume rebuilds timelines without resetting form or filter state.

The desktop homepage manifesto pins during scrolling; mobile uses normal document scrolling. The marquee keeps moving while idle and after navigation. Keep this behavior in mind when assessing accessibility for a production release.

## Diagnostics

Open `/?motion-debug=1`, `/pricing?motion-debug=1` or `/motion-lab`.

- Inspect the debug panel and browser console if effects fail to initialize.
- Keep one `MotionDirector` inside `BrowserRouter`; route changes clean up and recreate its effects.
- Image loads trigger ScrollTrigger refreshes to update measurements.
- Test pause/resume, resizing and client-side navigation to catch stale pins or duplicated text wrappers.

With the dev server running, use `npm run test:motion -- "/path/to/chrome"`. Add the full responsive audit with `npm run test:ui -- "/path/to/chrome"`. See [SMOKE_TESTS.md](SMOKE_TESTS.md) for manual checks.

# 10-minute Motion and Pricing Smoke Tests

## Motion

- [ ] Homepage curtain uncovers the staggered hero entrance.
- [ ] Headings reveal word by word; emphasized words retain their typography.
- [ ] Homepage manifesto pins briefly on desktop; words brighten as scrolling advances.
- [ ] At mobile widths, manifesto scrolls naturally without a pin spacer.
- [ ] Pointer follower and magnetic buttons work with a mouse; touch devices keep native interactions.
- [ ] Treatment filtering, booking modal, gallery and mobile navigation still work.
- [ ] MOTION ON/OFF removes/restores word wrappers, cursor and manifesto pin without resetting form/filter state.
- [ ] Marquee moves continuously while idle, after resizing and after route navigation.
- [ ] The motion choice persists during client-side navigation; a full reload starts motion again.
- [ ] Navigate gallery → about → services → home; no duplicate pin or runtime errors.
- [ ] `/pricing`: cinematic forest-green curtain visible briefly on navigation.
- [ ] `/pricing`: title words move upward, and the hero image wipes open.
- [ ] `/pricing`: scroll progress bar advances across the top.
- [ ] `/pricing`: full-width quote image has slow scroll-linked parallax.
- [ ] `/`: homepage hero title moves while scrolling.
- [ ] `/?motion-debug=1`: panel shows GSAP version and active ScrollTriggers >0 when motion is enabled and DOM is scrollable.
- [ ] With MOTION OFF: non-essential animations absent, content readable.

## Pricing

- [ ] Category switch All / Body / Skin / Ritual.
- [ ] Open one service row; duration buttons are selectable.
- [ ] Chosen service appears in summary with matching price and minutes.
- [ ] Select 2 services: total equals sum of individual selected options.
- [ ] Clicking an already selected duration removes that service.
- [ ] `CLEAR SELECTION` resets summary; booking button disabled.
- [ ] Package cards link correctly.
- [ ] Booking Preview clearly says demo; form validates.

## Production

- [ ] `npm run build` succeeds.
- [ ] No JS errors in console.
- [ ] Test 1440 / 1024 / 768 / 390 / 360px.
- [ ] Keyboard tab, Escape, focus visible, color contrast.

## Automated browser smoke check

With the dev server running at `http://127.0.0.1:5173`, run:

```text
node scripts/check-motion.mjs /absolute/path/to/chrome
```

The script uses Chrome DevTools Protocol with Node 22+ (no extra npm dependencies).
It checks desktop/mobile motion using actual OS settings, measured marquee displacement, play/pause behavior,
filtering, modal/menu interactions and client-side route cleanup. Screenshots are
saved in `qa/artifacts/`. Add `--ui` to check all 25 screens at desktop/mobile sizes, additional breakpoints and the complete booking flow. The report is written to `qa/artifacts/ui-audit.json`.

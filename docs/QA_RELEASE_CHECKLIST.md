# Buyer-ready quality checklist (must complete before Codester upload)

## Build

- [ ] `npm install` succeeds on a clean machine.
- [ ] `npm run typecheck` passes with real dependency types.
- [ ] `npm run build` succeeds.
- [ ] `npm run preview` works (includes direct refresh of nested routes).
- [ ] `npm run test:routes` reports 25 listed screens.

## Cross-page checks

- [ ] `/screens` opens all 25 destinations; detail routes load and back-navigation works.
- [ ] Header/mobile drawer/CTA work with keyboard, touch and desktop.
- [ ] Service filters, sorting and comparison stay coherent.
- [ ] Package add-on prices are correct for 1, 2 and 4 guests.
- [ ] Ritual Builder adds/removes services, updates price/duration and enters the booking wizard.
- [ ] Booking Step 1 picks service/package and location; Step 2 cannot choose past/unavailable times; Step 3 validates fields and demo consent.
- [ ] Confirmation never claims real booking or payment.
- [ ] Contact form does not send or persist personal data.
- [ ] Gallery modal is keyboard-navigable and closes with Escape.
- [ ] Gift Card previews are labeled not redeemable.

## UX & motion

- [ ] GSAP loaded without console errors; test at `/pricing?motion-debug=1`.
- [ ] Entrance, curtain, image reveal and parallax visible with reduced motion OFF.
- [ ] Site remains fully usable with reduced motion ON.
- [ ] Mobile, tablet and desktop sizes audited (360/390/768/1024/1440/1920).
- [ ] Contrast, focus, alt text, labels, keyboard order and modal focus verified.
- [ ] Lighthouse, Web Vitals and image optimization audited; remove unnecessary motion on low-end devices.

## Codester packaging

- [ ] Replace all remote demo imagery with assets licensed for redistribution.
- [ ] Complete Figma is NOT included. Don't describe the product as supplying Figma assets.
- [ ] Documentation updated with exact installed versions and API limitations.
- [ ] Create 1600×800 product preview and 200×200 icon.
- [ ] Create screenshots ZIP and working public live demo.
- [ ] Remove empty demo content/obvious errors, any temporary credentials or secrets.
- [ ] Check brand claims, product listing accuracy and marketplace policy on AI-assisted content.

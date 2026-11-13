# Customization

## Brand, styling and themes

- Branding: `src/shared/layout/SiteHeader.tsx`, `src/shared/layout/SiteFooter.tsx` and `src/features/home/HomePage.tsx`.
- Main theme: CSS variables in `src/shared/styles/site.css` (`.nv-site`) and `src/shared/styles/editorial.css` (`.ne-page`).
- Typography: Google Fonts CSS @imports load Cormorant Garamond and DM Sans. Check current font license and optionally self-host approved versions.
- Icons: `lucide-react`. Do not bundle fonts copied from the platform or other vendors.

## Data sources

- Treatments: `src/content/services.ts` — `SERVICES` array, duration and prices.
- Spa packages: `src/content/packages.ts` — `PACKAGES`, variants, add-ons and calculations.
- Locations: `src/content/locations.ts` — demo neighborhood centers, hours, amenities and featured services.
- Team, journal and gallery: `src/content/editorial.ts`.
- Booking: `src/features/booking/BookingPage.tsx` and `src/features/booking/model/booking.ts` — currently deterministic pseudo-availability.

## Browser interactions

- Browse `/screens` for a single-click index of all 25 experiences.
- Booking selections are held in sessionStorage under `novra-booking-draft`. Generated summary under `novra-example-confirmation`.
- Custom ritual selections are held in sessionStorage under `novra-ritual`.
- Booking Preview lives in `src/features/booking/components/BookingPreview.tsx`; review its demo flow alongside the full wizard when adding a backend.
- The contact form intentionally does not submit, store personal details, or send email.

## Image asset rights

Current images reference Unsplash images by remote URL as demo placeholders. They are NOT licensed bundled deliverables. Before resale:

1. Obtain assets licensed for incorporation and redistribution in source templates, or use photography you own.
2. Replace `images.unsplash.com` URLs in `src/content` and `src/features` with approved local assets.
3. Add photographer/asset attribution and documentation required by each specific license.
4. Check whether an asset license permits redistribution as editable source templates — permission to show an image on a website is not always permission to include it in a downloadable product.

## Production integrations

To support real transactions, add a backend that securely manages staff/rooms, booked slots, concurrent writes, cancellations, email and payment provider callbacks. Do not claim a real appointment has been booked with the current client-only app.

/** NOVRA fictional branch catalog. All names, area centers, schedules and amenities are DEMO content.
 * Replace with verified business information and imagery rights before publishing or reselling.
 */
import { SERVICES } from "@/content/services";

export type LocationArea = "Central" | "Riverside" | "Garden";
export type LocationAmenity =
  "Private suites" | "Couples' room" | "Tea lounge" | "Garden terrace" | "Quiet lounge";
export type BusinessHour = { days: string; hours: string };
export type SpaLocation = {
  id: string;
  slug: string;
  name: string;
  region: string;
  city: string;
  area: LocationArea;
  neighborhood: string;
  theme: string;
  description: string;
  introduction: string;
  signature: string;
  cover: string;
  gallery: { src: string; alt: string; caption: string }[];
  coordinates: { lat: number; lon: number }; // area centers only, NOT actual branch addresses
  amenities: LocationAmenity[];
  featuredServiceSlugs: string[];
  hours: BusinessHour[];
  highlights: { label: string; value: string }[];
  faqs: { question: string; answer: string }[];
};

const photo = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

const sharedFaq = [
  {
    question: "Do I need to book in advance?",
    answer:
      "We recommend choosing your preferred experience and time in advance. This is a frontend demonstration; no real reservation is confirmed.",
  },
  {
    question: "Can I request a couples' experience?",
    answer:
      "The demonstration showcases shared experiences at branches with couples' rooms. Real availability and capacity require a booking backend.",
  },
  {
    question: "Is there a cancellation policy?",
    answer:
      "Every spa should publish its own booking, cancellation and refund policy. The example template does not process actual reservations or payments.",
  },
];

export const LOCATIONS: SpaLocation[] = [
  {
    id: "01",
    slug: "central-house",
    name: "Central House",
    area: "Central",
    region: "THE CITY SANCTUARY",
    city: "Ho Chi Minh City",
    neighborhood: "District 1",
    theme: "Quiet luxury in the heart of the city",
    description:
      "A place to pause amid the rhythm of downtown. Soft light, thoughtful details and room to reconnect.",
    introduction:
      "Tucked into the imagined heart of the city, Central House balances warm stone, gentle light and private wellness spaces. A refuge designed for little moments that feel exceptionally yours.",
    signature: "Space for stillness, right in the city.",
    cover: photo("photo-1540555700478-4be289fbecef", 1800),
    gallery: [
      {
        src: photo("photo-1600334129128-685c5582fd35"),
        alt: "Warm minimalist spa interior",
        caption: "THE TREATMENT SPACE",
      },
      {
        src: photo("photo-1564540583246-934409427776"),
        alt: "Calm interior with natural materials",
        caption: "THE QUIET ROOM",
      },
      {
        src: photo("photo-1544161515-4ab6ce6db874"),
        alt: "Carefully arranged spa treatment elements",
        caption: "THE RITUAL",
      },
      {
        src: photo("photo-1556228578-0d85b1a4d571"),
        alt: "Botanical care products and textures",
        caption: "THE DETAILS",
      },
    ],
    coordinates: { lat: 10.7769, lon: 106.7009 }, // area reference only
    amenities: ["Private suites", "Couples' room", "Tea lounge", "Quiet lounge"],
    featuredServiceSlugs: [
      "the-aromatherapy-ritual",
      "japanese-head-spa",
      "radiance-facial-ceremony",
    ],
    hours: [
      { days: "Monday – Friday", hours: "09:00 – 20:00" },
      { days: "Saturday – Sunday", hours: "09:00 – 21:00" },
    ],
    highlights: [
      { label: "Atmosphere", value: "Urban stillness" },
      { label: "Signature", value: "Private rituals" },
      { label: "Experience", value: "Body & Skin" },
    ],
    faqs: sharedFaq,
  },
  {
    id: "02",
    slug: "riverside-house",
    name: "Riverside House",
    area: "Riverside",
    region: "THE LIGHT-FILLED ESCAPE",
    city: "Ho Chi Minh City",
    neighborhood: "Thao Dien · Thu Duc City",
    theme: "Where light and calm meet",
    description:
      "A lighter rhythm by the river, shaped by open spaces, soft textures and an unhurried welcome.",
    introduction:
      "A gentle escape inspired by waterside living. Riverside House pairs airy lounges with considered spa rituals — a bright space for slowing down and enjoying time together.",
    signature: "Let the day flow a little slower.",
    cover: photo("photo-1600607687920-4e2a09cf159d", 1800),
    gallery: [
      {
        src: photo("photo-1600607687920-4e2a09cf159d"),
        alt: "Contemporary serene interior with large windows",
        caption: "THE LIGHT",
      },
      {
        src: photo("photo-1600334129128-685c5582fd35"),
        alt: "Comfortable treatment and relaxation space",
        caption: "THE SPACE",
      },
      {
        src: photo("photo-1519823551278-64ac92734fb1"),
        alt: "Peaceful spa atmosphere",
        caption: "THE PAUSE",
      },
      {
        src: photo("photo-1544161515-4ab6ce6db874"),
        alt: "Hands and oils prepared for massage",
        caption: "THE TOUCH",
      },
    ],
    coordinates: { lat: 10.8036, lon: 106.7327 },
    amenities: ["Couples' room", "Tea lounge", "Quiet lounge"],
    featuredServiceSlugs: [
      "together-in-stillness",
      "hot-stone-rebalance",
      "the-aromatherapy-ritual",
    ],
    hours: [
      { days: "Monday – Friday", hours: "10:00 – 20:00" },
      { days: "Saturday – Sunday", hours: "09:00 – 21:00" },
    ],
    highlights: [
      { label: "Atmosphere", value: "Light & open" },
      { label: "Signature", value: "For two" },
      { label: "Experience", value: "Slow afternoons" },
    ],
    faqs: sharedFaq,
  },
  {
    id: "03",
    slug: "garden-house",
    name: "Garden House",
    area: "Garden",
    region: "THE BOTANICAL RETREAT",
    city: "Ho Chi Minh City",
    neighborhood: "Phu My Hung · District 7",
    theme: "Closer to nature, closer to yourself",
    description:
      "An intimate green sanctuary that celebrates botanicals, natural textures and time well spent.",
    introduction:
      "Imagine stepping out of the bustle and into a softer world of foliage, warm timber and fragrant botanical moments. Garden House is an invitation to reconnect with your natural rhythm.",
    signature: "A little nature changes everything.",
    cover: photo("photo-1512290923902-8a9f81dc236c", 1800),
    gallery: [
      {
        src: photo("photo-1512290923902-8a9f81dc236c"),
        alt: "Green botanical wellness setting",
        caption: "THE GARDEN",
      },
      {
        src: photo("photo-1556228578-0d85b1a4d571"),
        alt: "Natural botanical skin products",
        caption: "THE BOTANICALS",
      },
      {
        src: photo("photo-1570172619644-dfd03ed5d881"),
        alt: "Gentle facial ritual",
        caption: "THE CARE",
      },
      {
        src: photo("photo-1564540583246-934409427776"),
        alt: "Soft warm-toned lounge",
        caption: "THE SANCTUARY",
      },
    ],
    coordinates: { lat: 10.7283, lon: 106.7204 },
    amenities: ["Garden terrace", "Private suites", "Tea lounge"],
    featuredServiceSlugs: [
      "botanical-skin-renewal",
      "radiance-facial-ceremony",
      "japanese-head-spa",
    ],
    hours: [
      { days: "Monday – Friday", hours: "09:00 – 19:00" },
      { days: "Saturday – Sunday", hours: "09:00 – 20:00" },
    ],
    highlights: [
      { label: "Atmosphere", value: "Botanical calm" },
      { label: "Signature", value: "Plant-inspired care" },
      { label: "Experience", value: "Skin & Ritual" },
    ],
    faqs: sharedFaq,
  },
];

export const LOCATION_AREAS = ["All", "Central", "Riverside", "Garden"] as const;
export const LOCATION_AMENITIES: LocationAmenity[] = [
  "Private suites",
  "Couples' room",
  "Tea lounge",
  "Garden terrace",
  "Quiet lounge",
];
export const getLocationBySlug = (slug?: string) =>
  LOCATIONS.find((branch) => branch.slug === slug);
export const branchServices = (branch: SpaLocation) =>
  branch.featuredServiceSlugs
    .map((slug) => SERVICES.find((service) => service.slug === slug))
    .filter((service): service is (typeof SERVICES)[number] => Boolean(service));

/** OpenStreetMap embed centered on example neighborhoods (not actual spa addresses). */
export const getEmbedMapUrl = ({ coordinates: { lat, lon } }: SpaLocation) => {
  const deltaLat = 0.005;
  const deltaLon = 0.008;
  const bbox = [lon - deltaLon, lat - deltaLat, lon + deltaLon, lat + deltaLat].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik`;
};
export const getMapLink = ({ coordinates: { lat, lon } }: SpaLocation) =>
  `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`;

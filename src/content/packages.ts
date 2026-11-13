/** NOVRA sample package catalog. Names, prices, copy and images are illustrative demo content. */
import { formatMinutes, formatPrice } from "@/content/services";

export type PackageMood = "Restore" | "Reconnect" | "Celebrate";
export type PackageVariant = {
  id: string;
  label: string;
  guests: number;
  minutes: number;
  price: number; // Total package price for ALL guests, not per person
  detail: string;
};
export type PackageAddOn = {
  id: string;
  title: string;
  detail: string;
  minutes: number; // Additional elapsed session time, even for multiple guests
  price: number; // per booking or per guest, as specified
  pricing: "per-booking" | "per-guest";
};
export type SpaPackage = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: PackageMood;
  badge: string;
  description: string;
  quote: string;
  hero: string;
  gallery: [string, string, string];
  variants: PackageVariant[];
  included: string[];
  itinerary: { number: string; title: string; duration: string; copy: string }[];
  idealFor: string[];
  serviceSlugs: string[];
  branchSlugs: string[];
  addOns: string[];
  faqs: { question: string; answer: string }[];
};

const photo = (id: string, width = 1500) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
const IMG = {
  room: photo("photo-1540555700478-4be289fbecef"),
  interior: photo("photo-1600334129128-685c5582fd35"),
  botanical: photo("photo-1556228578-0d85b1a4d571"),
  ritual: photo("photo-1544161515-4ab6ce6db874"),
  skin: photo("photo-1570172619644-dfd03ed5d881"),
  spa: photo("photo-1519823551278-64ac92734fb1"),
  quiet: photo("photo-1564540583246-934409427776"),
  modern: photo("photo-1600607687920-4e2a09cf159d"),
  wellness: photo("photo-1512290923902-8a9f81dc236c"),
};

export const PACKAGE_ADDONS: PackageAddOn[] = [
  {
    id: "aroma",
    title: "Botanical aroma selection",
    detail: "A personal aromatic finishing touch",
    minutes: 0,
    price: 12,
    pricing: "per-guest",
  },
  {
    id: "tea",
    title: "Private tea ceremony",
    detail: "A slower close to your wellness journey",
    minutes: 20,
    price: 24,
    pricing: "per-booking",
  },
  {
    id: "scalp",
    title: "Extended scalp ritual",
    detail: "Twenty more minutes of gentle care",
    minutes: 20,
    price: 28,
    pricing: "per-guest",
  },
  {
    id: "facial",
    title: "Express botanical facial",
    detail: "A focused skincare finishing ritual",
    minutes: 30,
    price: 42,
    pricing: "per-guest",
  },
];

const standardFaq = [
  {
    question: "Is the price shown per person?",
    answer:
      "No. The quoted package price is the total for the selected number of guests. Optional add-ons are calculated per guest or per booking as labeled.",
  },
  {
    question: "Can we choose different treatments?",
    answer:
      "The experience shown is a curated example. A real spa may customize it subject to its staff, room, and service capacity. The template does not verify live availability.",
  },
  {
    question: "Is this a real reservation?",
    answer:
      "No. NOVRA is a frontend sample template. Booking Preview stores an example request locally; there is no payment, confirmed appointment or held time slot.",
  },
  {
    question: "Are prices, schedules and locations final?",
    answer:
      "All are sample content for demonstration. A real business must supply verified prices, branch details, schedules and policies.",
  },
];

export const PACKAGES: SpaPackage[] = [
  {
    id: "01",
    slug: "slow-morning",
    name: "The Slow Morning",
    subtitle: "An intimate reset for one",
    category: "Restore",
    badge: "MOST LOVED",
    description:
      "A deeply personal passage from the first warm welcome to the last quiet cup of tea. Made for mornings when your time belongs to you.",
    quote: "A morning with nothing to prove.",
    hero: IMG.room,
    gallery: [IMG.ritual, IMG.skin, IMG.quiet],
    variants: [
      {
        id: "slow-90",
        label: "The Essential",
        guests: 1,
        minutes: 90,
        price: 138,
        detail: "Signature body ritual and restorative pause",
      },
      {
        id: "slow-120",
        label: "The Unhurried",
        guests: 1,
        minutes: 120,
        price: 178,
        detail: "Body ritual, scalp renewal and tea",
      },
    ],
    included: [
      "Private welcome consultation",
      "Botanical bodywork",
      "Quiet lounge time",
      "Warm herbal tea",
    ],
    itinerary: [
      {
        number: "01",
        title: "Arrive",
        duration: "10 MIN",
        copy: "Settle into your own pace with a gentle welcome and a conversation about your preferences.",
      },
      {
        number: "02",
        title: "Release",
        duration: "60–90 MIN",
        copy: "Move into intentional bodywork with a pace tailored to your comfort.",
      },
      {
        number: "03",
        title: "Return",
        duration: "20 MIN",
        copy: "A softer landing with a moment of stillness and tea.",
      },
    ],
    idealFor: ["Solo pause", "Restoration", "First-time guests"],
    serviceSlugs: ["the-aromatherapy-ritual", "japanese-head-spa"],
    branchSlugs: ["central-house", "garden-house"],
    addOns: ["aroma", "tea", "scalp"],
    faqs: standardFaq,
  },
  {
    id: "02",
    slug: "signature-day",
    name: "The Signature Day",
    subtitle: "An afternoon that belongs to you",
    category: "Restore",
    badge: "HOUSE SIGNATURE",
    description:
      "An extended day of touch, skin care and stillness. Each moment is designed to feel like the next gentle chapter.",
    quote: "Let the whole afternoon belong to the feeling.",
    hero: IMG.interior,
    gallery: [IMG.spa, IMG.botanical, IMG.ritual],
    variants: [
      {
        id: "sig-150",
        label: "The Signature",
        guests: 1,
        minutes: 150,
        price: 228,
        detail: "Body, skin and quiet lounge",
      },
      {
        id: "sig-180",
        label: "The Extended",
        guests: 1,
        minutes: 180,
        price: 278,
        detail: "A longer ritual with scalp and tea",
      },
    ],
    included: ["Personal welcome", "Body ritual", "Facial ceremony", "Tea and quiet lounge"],
    itinerary: [
      {
        number: "01",
        title: "Ease in",
        duration: "15 MIN",
        copy: "A welcome ritual and a little space to breathe.",
      },
      {
        number: "02",
        title: "Unfold",
        duration: "105–135 MIN",
        copy: "Thoughtful bodywork and personal skincare, with unhurried transitions.",
      },
      {
        number: "03",
        title: "Stay awhile",
        duration: "30 MIN",
        copy: "Enjoy a moment of quiet to conclude your visit.",
      },
    ],
    idealFor: ["Full-day escape", "Personal renewal", "Thoughtful gifting"],
    serviceSlugs: ["the-novra-signature", "radiance-facial-ceremony"],
    branchSlugs: ["central-house", "riverside-house"],
    addOns: ["tea", "aroma", "scalp"],
    faqs: standardFaq,
  },
  {
    id: "03",
    slug: "together-in-time",
    name: "Together in Time",
    subtitle: "A shared ritual for two",
    category: "Reconnect",
    badge: "FOR TWO",
    description:
      "Softly synchronized rituals for two people who want to be present together. An experience shaped around connection, not a ticking clock.",
    quote: "The loveliest thing to share is time.",
    hero: IMG.spa,
    gallery: [IMG.quiet, IMG.modern, IMG.ritual],
    variants: [
      {
        id: "together-90",
        label: "The Together Ritual",
        guests: 2,
        minutes: 90,
        price: 258,
        detail: "Parallel body treatments and shared tea",
      },
      {
        id: "together-120",
        label: "The Together Escape",
        guests: 2,
        minutes: 120,
        price: 328,
        detail: "Extended body rituals, scalp care and tea",
      },
    ],
    included: [
      "Welcome for two",
      "Parallel treatment experience",
      "Individual pressure preferences",
      "Shared tea moment",
    ],
    itinerary: [
      {
        number: "01",
        title: "Reconnect",
        duration: "10 MIN",
        copy: "Arrive side by side with a personalized welcome for both guests.",
      },
      {
        number: "02",
        title: "Settle",
        duration: "60–90 MIN",
        copy: "Two parallel, individually tailored rituals in a shared atmosphere.",
      },
      {
        number: "03",
        title: "Stay together",
        duration: "20 MIN",
        copy: "Enjoy a quiet tea experience without rushing away.",
      },
    ],
    idealFor: ["Couples", "Close friends", "Anniversaries"],
    serviceSlugs: ["together-in-stillness", "the-aromatherapy-ritual"],
    branchSlugs: ["central-house", "riverside-house"],
    addOns: ["aroma", "tea", "facial"],
    faqs: standardFaq,
  },
  {
    id: "04",
    slug: "botanical-interlude",
    name: "Botanical Interlude",
    subtitle: "A return to nature",
    category: "Restore",
    badge: "GARDEN FAVORITE",
    description:
      "A plant-inspired collection that pairs thoughtful skincare with a quieter kind of body ritual.",
    quote: "The natural world asks us only to be here.",
    hero: IMG.botanical,
    gallery: [IMG.wellness, IMG.skin, IMG.room],
    variants: [
      {
        id: "botanical-90",
        label: "The Garden Pause",
        guests: 1,
        minutes: 90,
        price: 142,
        detail: "Facial care and botanical body ritual",
      },
      {
        id: "botanical-120",
        label: "The Garden Journey",
        guests: 1,
        minutes: 120,
        price: 184,
        detail: "An extended session with tea",
      },
    ],
    included: [
      "Ingredient preference consultation",
      "Botanical-inspired facial",
      "Relaxing body treatment",
      "Slow tea moment",
    ],
    itinerary: [
      {
        number: "01",
        title: "Begin softly",
        duration: "10 MIN",
        copy: "Choose the ingredients and atmosphere you feel comfortable with.",
      },
      {
        number: "02",
        title: "Nourish",
        duration: "60–90 MIN",
        copy: "Gentle facial and body treatments inspired by nature.",
      },
      {
        number: "03",
        title: "Breathe",
        duration: "20 MIN",
        copy: "Pause in a calm, botanical setting before leaving.",
      },
    ],
    idealFor: ["Nature lovers", "Gentle skincare", "Quiet afternoons"],
    serviceSlugs: ["botanical-skin-renewal", "radiance-facial-ceremony"],
    branchSlugs: ["garden-house", "central-house"],
    addOns: ["tea", "aroma", "scalp"],
    faqs: standardFaq,
  },
  {
    id: "05",
    slug: "golden-hour",
    name: "The Golden Hour",
    subtitle: "A longer experience for two",
    category: "Reconnect",
    badge: "OCCASION EDIT",
    description:
      "A considered celebration of togetherness, with enough time for each person to find their own sense of ease.",
    quote: "Time feels different when it is shared.",
    hero: IMG.modern,
    gallery: [IMG.room, IMG.spa, IMG.skin],
    variants: [
      {
        id: "gold-120",
        label: "Golden Ritual",
        guests: 2,
        minutes: 120,
        price: 348,
        detail: "Shared treatment session and tea",
      },
      {
        id: "gold-150",
        label: "Golden Celebration",
        guests: 2,
        minutes: 150,
        price: 415,
        detail: "Extended rituals and personalized care",
      },
    ],
    included: [
      "Private preparation for two",
      "Two individualized treatments",
      "Restful transition",
      "Celebration tea service",
    ],
    itinerary: [
      {
        number: "01",
        title: "A shared arrival",
        duration: "15 MIN",
        copy: "An intimate welcome for your time together.",
      },
      {
        number: "02",
        title: "Your moment",
        duration: "85–115 MIN",
        copy: "Personal treatments with a seamless, connected experience.",
      },
      {
        number: "03",
        title: "A gentle finish",
        duration: "20 MIN",
        copy: "A slow tea moment to keep the day going.",
      },
    ],
    idealFor: ["Anniversaries", "Gifting", "Special moments"],
    serviceSlugs: ["together-in-stillness", "the-novra-signature"],
    branchSlugs: ["riverside-house", "central-house"],
    addOns: ["aroma", "tea", "facial"],
    faqs: standardFaq,
  },
  {
    id: "06",
    slug: "the-gathering",
    name: "The Gathering",
    subtitle: "A shared day with your people",
    category: "Celebrate",
    badge: "GROUP EXPERIENCE",
    description:
      "Celebrate friendship and togetherness with a carefully choreographed ritual for a small group.",
    quote: "Some pauses become the stories we keep.",
    hero: IMG.quiet,
    gallery: [IMG.modern, IMG.ritual, IMG.botanical],
    variants: [
      {
        id: "gather-3",
        label: "Intimate Gathering",
        guests: 3,
        minutes: 120,
        price: 438,
        detail: "For three guests · treatment and tea",
      },
      {
        id: "gather-4",
        label: "Gather Together",
        guests: 4,
        minutes: 120,
        price: 568,
        detail: "For four guests · treatment and tea",
      },
    ],
    included: [
      "Welcome for your group",
      "Individual comfort preferences",
      "Coordinated group sessions",
      "Shared tea experience",
    ],
    itinerary: [
      {
        number: "01",
        title: "Come together",
        duration: "20 MIN",
        copy: "A warm welcome with preferences gathered for every guest.",
      },
      {
        number: "02",
        title: "Find your quiet",
        duration: "80 MIN",
        copy: "Coordinated individual care within a shared group experience.",
      },
      {
        number: "03",
        title: "Celebrate",
        duration: "20 MIN",
        copy: "Come back together for tea and an unhurried closing moment.",
      },
    ],
    idealFor: ["Groups of 3–4", "Celebrations", "Friendship days"],
    serviceSlugs: ["the-aromatherapy-ritual", "japanese-head-spa"],
    branchSlugs: ["central-house", "riverside-house"],
    addOns: ["tea", "aroma", "scalp"],
    faqs: standardFaq,
  },
];

export const PACKAGE_CATEGORIES = ["All", "Restore", "Reconnect", "Celebrate"] as const;
export const getPackageBySlug = (slug?: string) => PACKAGES.find((item) => item.slug === slug);
export const getPackageAddOns = (item: SpaPackage) =>
  PACKAGE_ADDONS.filter((addon) => item.addOns.includes(addon.id));
export const basePrice = (item: SpaPackage) => Math.min(...item.variants.map((v) => v.price));
export const packageGuestLabel = (item: SpaPackage) => {
  const counts = [...new Set(item.variants.map((v) => v.guests))].sort((a, b) => a - b);
  return counts.length > 1
    ? `${counts[0]}–${counts[counts.length - 1]} guests`
    : `${counts[0]} ${counts[0] === 1 ? "guest" : "guests"}`;
};
export const formatPackagePrice = formatPrice;
export const formatPackageMinutes = formatMinutes;

/** All prices are package totals. Per-guest add-ons are multiplied by selected guest count. */
export function calculatePackage(
  variant: PackageVariant,
  addOns: PackageAddOn[],
): {
  price: number;
  minutes: number;
  additions: { title: string; amount: number; minutes: number }[];
} {
  const additions = addOns.map((a) => ({
    title: a.title,
    amount: a.price * (a.pricing === "per-guest" ? variant.guests : 1),
    minutes: a.minutes,
  }));
  return {
    price: variant.price + additions.reduce((total, a) => total + a.amount, 0),
    minutes: variant.minutes + additions.reduce((total, a) => total + a.minutes, 0),
    additions,
  };
}

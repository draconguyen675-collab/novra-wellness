/** NOVRA services — replace example copy, prices, and remote images before resale. */
export type ServiceCategory = "Body" | "Skin" | "Ritual";
export type DurationOption = { minutes: number; price: number };
export type Service = {
  id: string;
  slug: string;
  name: string;
  category: ServiceCategory;
  minutes: number;
  price: number;
  durationOptions: DurationOption[];
  tag: string;
  image: string;
  gallery: [string, string];
  description: string;
  lead: string;
  quote: string;
  benefits: string[];
  included: string[];
  stages: { title: string; copy: string }[];
  preparation: string;
  aftercare: string;
  faqs: { question: string; answer: string }[];
};

const photo = (id: string, width = 1100) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

const images = {
  spa: photo("photo-1540555700478-4be289fbecef"),
  aroma: photo("photo-1544161515-4ab6ce6db874"),
  facial: photo("photo-1570172619644-dfd03ed5d881"),
  head: photo("photo-1600334129128-685c5582fd35"),
  stone: photo("photo-1519823551278-64ac92734fb1"),
  botanical: photo("photo-1556228578-0d85b1a4d571"),
  serene: photo("photo-1564540583246-934409427776"),
  interiors: photo("photo-1600607687920-4e2a09cf159d"),
  care: photo("photo-1512290923902-8a9f81dc236c"),
};

const generalFaq = [
  {
    question: "Can I choose my preferred treatment time?",
    answer:
      "Yes. Choose the duration that suits you, then continue to the booking preview. Availability in this template is illustrative, not live.",
  },
  {
    question: "Is this suitable for everyone?",
    answer:
      "Our example treatments can be customized. In a real spa, consult a qualified practitioner about allergies, pregnancy, medical conditions, or any concerns before treatment.",
  },
  {
    question: "Can I cancel or reschedule?",
    answer:
      "Cancellation and rescheduling policies depend on the spa using this template. This frontend demonstration does not confirm real appointments.",
  },
];

const stages = (start: string, middle: string, end: string) => [
  { title: "Arrival & intention", copy: start },
  { title: "Your personal ritual", copy: middle },
  { title: "Return, slowly", copy: end },
];

export const SERVICES: Service[] = [
  {
    id: "aroma",
    slug: "the-aromatherapy-ritual",
    name: "The Aromatherapy Ritual",
    category: "Body",
    minutes: 90,
    price: 98,
    durationOptions: [
      { minutes: 60, price: 72 },
      { minutes: 90, price: 98 },
      { minutes: 120, price: 130 },
    ],
    tag: "Most loved",
    image: images.aroma,
    gallery: [images.spa, images.botanical],
    description: "A grounding, full-body escape with warm botanical oils.",
    lead: "Warm botanical oils, unhurried touch, and the quiet luxury of being fully present.",
    quote: "Let everything outside the room become a little less important.",
    benefits: [
      "A calm, unhurried atmosphere",
      "Personalized pressure preferences",
      "Botanical aromas selected for comfort",
    ],
    included: [
      "A short welcome consultation",
      "A choice of botanical aroma",
      "Full-body massage experience",
      "A quiet moment with herbal tea",
    ],
    stages: stages(
      "Arrive, settle in, and share your preferences.",
      "Enjoy thoughtful, flowing massage movements with warm oils.",
      "Rest for a few moments before stepping back into your day.",
    ),
    preparation:
      "Arrive 10 minutes early. Let your practitioner know about sensitivities or preferences.",
    aftercare: "Rest, hydrate, and give yourself time to ease back into your routine.",
    faqs: generalFaq,
  },
  {
    id: "facial",
    slug: "radiance-facial-ceremony",
    name: "Radiance Facial Ceremony",
    category: "Skin",
    minutes: 75,
    price: 86,
    durationOptions: [
      { minutes: 60, price: 70 },
      { minutes: 75, price: 86 },
      { minutes: 90, price: 105 },
    ],
    tag: "For your glow",
    image: images.facial,
    gallery: [images.botanical, images.care],
    description: "An intentional reset for hydrated, luminous skin.",
    lead: "A gentle, personalized facial ritual designed around comfort, care, and your skin's everyday needs.",
    quote: "A softer kind of glow begins with a little time for yourself.",
    benefits: [
      "A relaxed skincare experience",
      "Products adapted to skin preferences",
      "Time to slow down and unwind",
    ],
    included: [
      "Skin preference consultation",
      "Gentle cleansing ritual",
      "Face and neck massage",
      "Hydration-focused finishing care",
    ],
    stages: stages(
      "Discuss your routine and product sensitivities.",
      "Enjoy cleansing, gentle massage, and nourishing care.",
      "Finish with practical guidance for your everyday routine.",
    ),
    preparation: "Please share known ingredient sensitivities or recent skin treatments.",
    aftercare:
      "Follow your practitioner's product-specific guidance and protect your skin from excessive sun exposure.",
    faqs: generalFaq,
  },
  {
    id: "head",
    slug: "japanese-head-spa",
    name: "Japanese Head Spa",
    category: "Ritual",
    minutes: 60,
    price: 72,
    durationOptions: [
      { minutes: 45, price: 58 },
      { minutes: 60, price: 72 },
      { minutes: 90, price: 102 },
    ],
    tag: "Deeply calming",
    image: images.head,
    gallery: [images.serene, images.spa],
    description: "Slow scalp rituals to quiet the mind and restore balance.",
    lead: "A beautifully paced head and scalp ritual inspired by Japanese wellness traditions.",
    quote: "Some of the deepest pauses begin with the gentlest touch.",
    benefits: [
      "A quiet, restful setting",
      "Gentle scalp-focused movements",
      "A personalized comfort experience",
    ],
    included: [
      "Welcome consultation",
      "Scalp cleansing ritual",
      "Head and neck massage",
      "Warm towel finishing moment",
    ],
    stages: stages(
      "Choose your preferred pace and comfort level.",
      "Relax into a scalp-focused cleansing and massage sequence.",
      "Take a final moment to settle before leaving.",
    ),
    preparation: "Mention any scalp sensitivities or relevant allergies beforehand.",
    aftercare:
      "Keep your routine gentle and follow any product guidance provided by your practitioner.",
    faqs: generalFaq,
  },
  {
    id: "stone",
    slug: "hot-stone-rebalance",
    name: "Hot Stone Rebalance",
    category: "Body",
    minutes: 90,
    price: 110,
    durationOptions: [
      { minutes: 60, price: 82 },
      { minutes: 90, price: 110 },
    ],
    tag: "Signature",
    image: images.stone,
    gallery: [images.spa, images.interiors],
    description: "Gentle warmth and considered movement, from head to toe.",
    lead: "Smooth, gently warmed stones meet patient, unhurried bodywork in a peaceful setting.",
    quote: "Warmth is a language of its own.",
    benefits: [
      "Comfort-focused warm stone ritual",
      "Adjustable treatment pacing",
      "A peaceful, sensory experience",
    ],
    included: [
      "Thermal comfort check",
      "Warm stone bodywork",
      "Optional unscented oil",
      "Post-treatment rest",
    ],
    stages: stages(
      "Discuss comfort, temperature, and preferences.",
      "Warmed stones and mindful bodywork create a slow ritual.",
      "Close with a gentle transition and tea.",
    ),
    preparation: "Please mention concerns about heat sensitivity before the session.",
    aftercare: "Hydrate and avoid rushing into strenuous activity immediately afterwards.",
    faqs: generalFaq,
  },
  {
    id: "botanical",
    slug: "botanical-skin-renewal",
    name: "Botanical Skin Renewal",
    category: "Skin",
    minutes: 60,
    price: 79,
    durationOptions: [
      { minutes: 60, price: 79 },
      { minutes: 90, price: 112 },
    ],
    tag: "Fresh start",
    image: images.botanical,
    gallery: [images.facial, images.care],
    description: "A refreshing botanical ritual tailored to your skin goals.",
    lead: "An ingredient-conscious facial experience with botanically inspired textures and gentle care.",
    quote: "A small renewal can change the feeling of the whole day.",
    benefits: [
      "Gentle, considered products",
      "Personalized treatment preferences",
      "A refreshing sensory pause",
    ],
    included: [
      "Ingredient preference check",
      "Gentle cleanse",
      "Botanical-inspired facial ritual",
      "Finishing hydration",
    ],
    stages: stages(
      "Share your skin preferences.",
      "Enjoy considered textures and slow facial techniques.",
      "Leave with a simple routine suggestion.",
    ),
    preparation: "Mention any ingredient allergies, irritation, or recent skin procedures.",
    aftercare: "Use gentle products and follow your provider's individual advice.",
    faqs: generalFaq,
  },
  {
    id: "couple",
    slug: "together-in-stillness",
    name: "Together in Stillness",
    category: "Ritual",
    minutes: 120,
    price: 188,
    durationOptions: [
      { minutes: 90, price: 148 },
      { minutes: 120, price: 188 },
    ],
    tag: "For two",
    image: images.spa,
    gallery: [images.interiors, images.serene],
    description: "An unhurried wellness experience designed to share.",
    lead: "Space to reconnect, side by side, with a softly paced shared ritual.",
    quote: "The best kind of time is time we truly share.",
    benefits: [
      "A shared, unrushed experience",
      "Comfort preferences for each guest",
      "A memorable time together",
    ],
    included: [
      "Welcome for two",
      "Two personalized treatments",
      "Shared lounge time",
      "Herbal tea for two",
    ],
    stages: stages(
      "Arrive together and personalize each guest's preferences.",
      "Enjoy a shared wellness treatment experience.",
      "Reconnect with a final quiet moment together.",
    ),
    preparation: "Inform the spa of individual comfort preferences when making a real booking.",
    aftercare: "Enjoy a slow transition back to the day together.",
    faqs: generalFaq,
  },
  {
    id: "deep",
    slug: "deep-tissue-release",
    name: "Deep Tissue Release",
    category: "Body",
    minutes: 60,
    price: 88,
    durationOptions: [
      { minutes: 60, price: 88 },
      { minutes: 90, price: 118 },
    ],
    tag: "Intentional care",
    image: images.aroma,
    gallery: [images.stone, images.interiors],
    description: "Focused bodywork with a pace tailored to you.",
    lead: "A considered massage experience with emphasis on your preferred pressure and areas of focus.",
    quote: "Care has no one-size-fits-all rhythm.",
    benefits: ["Discuss focus areas", "Adjustable pressure", "Time dedicated to you"],
    included: ["Pressure preference check", "Focused massage session", "Rest period"],
    stages: stages(
      "Discuss your preferences.",
      "Receive bodywork tailored to your comfort.",
      "Finish with a moment of rest.",
    ),
    preparation: "Tell the practitioner about any injuries, pain, or health concerns.",
    aftercare: "Move gently and follow the professional's recommendations.",
    faqs: generalFaq,
  },
  {
    id: "scalp",
    slug: "scalp-and-soul-reset",
    name: "Scalp & Soul Reset",
    category: "Ritual",
    minutes: 45,
    price: 59,
    durationOptions: [
      { minutes: 45, price: 59 },
      { minutes: 60, price: 74 },
    ],
    tag: "Quick escape",
    image: images.serene,
    gallery: [images.head, images.spa],
    description: "An intimate pause for the head, neck, and senses.",
    lead: "A shorter restorative ritual for a day that needs a little more breathing room.",
    quote: "You don't need a whole day to make room for yourself.",
    benefits: ["Fits a busy schedule", "Calm setting", "Comfort-focused touch"],
    included: ["Welcome moment", "Head and neck ritual", "Warm towel finish"],
    stages: stages(
      "Share your preferences.",
      "Enjoy a focused head and neck session.",
      "Return gradually to your day.",
    ),
    preparation: "Arrive a few minutes early.",
    aftercare: "Take a short break before resuming a busy schedule.",
    faqs: generalFaq,
  },
  {
    id: "glow",
    slug: "luminous-skin-ritual",
    name: "Luminous Skin Ritual",
    category: "Skin",
    minutes: 90,
    price: 116,
    durationOptions: [
      { minutes: 60, price: 84 },
      { minutes: 90, price: 116 },
    ],
    tag: "Deep care",
    image: images.facial,
    gallery: [images.botanical, images.care],
    description: "A longer facial ceremony, made for a quiet afternoon.",
    lead: "A spacious facial experience with extra time for gentle attention and unwinding.",
    quote: "An afternoon glow begins with an intentional pause.",
    benefits: [
      "Extra time for personal care",
      "Comfort-focused ritual",
      "A calm, intimate atmosphere",
    ],
    included: [
      "Skin consultation",
      "Cleansing and preparation",
      "Massage-focused care",
      "Hydration and finish",
    ],
    stages: stages(
      "Discuss sensitivities and preferences.",
      "Enjoy an extended facial care sequence.",
      "Finish with gentle aftercare advice.",
    ),
    preparation: "Share sensitivities, current skincare actives, and recent treatments.",
    aftercare: "Follow the practitioner's advice and be gentle with your skin.",
    faqs: generalFaq,
  },
  {
    id: "warmth",
    slug: "herbal-warmth-journey",
    name: "Herbal Warmth Journey",
    category: "Body",
    minutes: 120,
    price: 138,
    durationOptions: [
      { minutes: 90, price: 110 },
      { minutes: 120, price: 138 },
    ],
    tag: "Slow afternoon",
    image: images.care,
    gallery: [images.stone, images.serene],
    description: "A layered experience of warmth, scent, and stillness.",
    lead: "An extended body ritual composed around warm textures and a peaceful pace.",
    quote: "There is something beautiful about not rushing.",
    benefits: ["Slow, spacious treatment", "Comfort preferences honored", "Rest and quiet time"],
    included: ["Welcome tea", "Gentle warming ritual", "Full body session", "Quiet recovery time"],
    stages: stages(
      "Begin with a warm welcome.",
      "Enjoy layered bodywork at a relaxed pace.",
      "Close with tea and quiet time.",
    ),
    preparation: "Mention sensitivities to heat or botanicals.",
    aftercare: "Keep the rest of your day unhurried if possible.",
    faqs: generalFaq,
  },
  {
    id: "express",
    slug: "express-facial-reset",
    name: "Express Facial Reset",
    category: "Skin",
    minutes: 30,
    price: 48,
    durationOptions: [
      { minutes: 30, price: 48 },
      { minutes: 45, price: 62 },
    ],
    tag: "30-minute ritual",
    image: images.botanical,
    gallery: [images.facial, images.serene],
    description: "Thoughtful skincare, even when time is short.",
    lead: "A concise facial ritual focused on simplicity and comfort.",
    quote: "Even a brief pause can feel beautifully complete.",
    benefits: ["Short and accessible", "Simple skincare sequence", "Relaxed atmosphere"],
    included: ["Short consultation", "Gentle cleanse", "Hydrating finish"],
    stages: stages(
      "Share your goals and sensitivities.",
      "Enjoy a focused facial ritual.",
      "Receive a simple routine suggestion.",
    ),
    preparation: "Mention product sensitivities or recent treatments.",
    aftercare: "Follow your provider's aftercare instructions.",
    faqs: generalFaq,
  },
  {
    id: "signature",
    slug: "the-novra-signature",
    name: "The NOVRA Signature",
    category: "Ritual",
    minutes: 150,
    price: 198,
    durationOptions: [
      { minutes: 120, price: 168 },
      { minutes: 150, price: 198 },
    ],
    tag: "The house favorite",
    image: images.interiors,
    gallery: [images.spa, images.aroma],
    description: "Our signature collection of unhurried rituals, woven into one.",
    lead: "A curated combination of restorative bodywork, mindful skincare, and a generous moment of rest.",
    quote: "A beautiful day can begin with one small decision: to slow down.",
    benefits: [
      "A thoughtfully curated sequence",
      "Personal comfort preferences",
      "A longer, immersive experience",
    ],
    included: [
      "Personalized welcome",
      "Body and scalp experience",
      "Gentle facial care",
      "Herbal tea and quiet lounge",
    ],
    stages: stages(
      "Meet your practitioner and set the intention.",
      "Move through a curated series of rituals.",
      "Savor a final quiet moment before leaving.",
    ),
    preparation: "Arrive early and share product sensitivities or health concerns.",
    aftercare: "Hydrate, rest, and follow personalized guidance from your practitioner.",
    faqs: generalFaq,
  },
];

export const SERVICE_CATEGORIES = ["All", "Body", "Skin", "Ritual"] as const;
export const getServiceBySlug = (slug?: string): Service | undefined =>
  SERVICES.find((item) => item.slug === slug);
export const formatPrice = (value: number) => `$${value.toLocaleString("en-US")}`;
export const formatMinutes = (value: number) =>
  value >= 60 ? `${Math.floor(value / 60)}h${value % 60 ? ` ${value % 60}m` : ""}` : `${value} min`;

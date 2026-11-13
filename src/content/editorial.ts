/** Sample names, prices, biographies, images and locations are fictional demo content. */
const photo = (id: string, w = 1450) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
export const P = {
  quiet: photo("photo-1540555700478-4be289fbecef"),
  spa: photo("photo-1600334129128-685c5582fd35"),
  oils: photo("photo-1556228578-0d85b1a4d571"),
  therapy: photo("photo-1544161515-4ab6ce6db874"),
  face: photo("photo-1570172619644-dfd03ed5d881"),
  sanctuary: photo("photo-1519823551278-64ac92734fb1"),
  room: photo("photo-1564540583246-934409427776"),
  architecture: photo("photo-1600607687920-4e2a09cf159d"),
  botanical: photo("photo-1512290923902-8a9f81dc236c"),
  portrait1: photo("photo-1559839734-2b71ea197ec2"),
  portrait2: photo("photo-1580489944761-15a19d654956"),
  portrait3: photo("photo-1500648767791-00dcc994a43e"),
  portrait4: photo("photo-1534528741775-53994a69daeb"),
  journal1: photo("photo-1499209974431-9dddcece7f88"),
  journal2: photo("photo-1515377905703-c4788e51af15"),
  journal3: photo("photo-1512290923902-8a9f81dc236c"),
};
export type Therapist = {
  slug: string;
  name: string;
  role: string;
  tenure: string;
  specialty: string;
  quote: string;
  bio: string;
  image: string;
  tags: string[];
};
export const THERAPISTS: Therapist[] = [
  {
    slug: "maya-chen",
    name: "Maya Chen",
    role: "Lead Ritual Therapist",
    tenure: "12 years in wellness",
    specialty: "Restorative bodywork",
    quote: "Presence is the most meaningful part of care.",
    bio: "Maya guides restorative rituals with a gentle, detail-led approach. She believes in creating space for each guest to feel listened to, unrushed and genuinely cared for.",
    image: P.portrait2,
    tags: ["Bodywork", "Aromatherapy", "Calm"],
  },
  {
    slug: "linh-nguyen",
    name: "Linh Nguyen",
    role: "Skin Ritual Specialist",
    tenure: "8 years in wellness",
    specialty: "Botanical facial care",
    quote: "We make room for skin to feel like skin.",
    bio: "Linh brings curiosity and empathy to every facial ritual, adapting the experience to each guest’s preferences and comfort.",
    image: P.portrait4,
    tags: ["Facials", "Botanical", "Skin"],
  },
  {
    slug: "alex-morgan",
    name: "Alex Morgan",
    role: "Senior Wellness Guide",
    tenure: "10 years in wellness",
    specialty: "Head & scalp rituals",
    quote: "The softest moments are often the ones that stay.",
    bio: "Alex specialises in thoughtful scalp and relaxation experiences, balancing technical care with a quietly human way of working.",
    image: P.portrait3,
    tags: ["Head Spa", "Scalp", "Rest"],
  },
  {
    slug: "sophia-lee",
    name: "Sophia Lee",
    role: "Wellness Experience Lead",
    tenure: "9 years in wellness",
    specialty: "Personalised rituals",
    quote: "Let every arrival feel like a small beginning.",
    bio: "Sophia brings a background in hospitality and wellbeing to curated wellness journeys with a warm, welcoming touch.",
    image: P.portrait1,
    tags: ["Rituals", "Hospitality", "Couples"],
  },
];
export type JournalPost = {
  slug: string;
  title: string;
  category: string;
  read: string;
  date: string;
  excerpt: string;
  image: string;
  sections: { title: string; body: string }[];
};
export const JOURNAL: JournalPost[] = [
  {
    slug: "a-richer-kind-of-rest",
    title: "A richer kind of rest",
    category: "MINDFUL LIVING",
    read: "5 MIN READ",
    date: "21 OCT 2026",
    excerpt:
      "Small rituals can change how an ordinary day feels. Here is why a gentler pace matters.",
    image: P.journal1,
    sections: [
      {
        title: "Choose a smaller moment",
        body: "Rest does not need an elaborate plan. Start with an unhurried cup of tea, a few minutes away from notifications or a deliberate walk between meetings.",
      },
      {
        title: "Make room for nothing",
        body: "An open space in your calendar is not wasted time. The quieter moments often let your attention settle and help you reconnect with what matters.",
      },
      {
        title: "Make it yours",
        body: "Your rituals should reflect your own preferences. Notice what brings ease, and let go of anything that feels like another task.",
      },
    ],
  },
  {
    slug: "the-language-of-touch",
    title: "The language of touch",
    category: "WELLNESS NOTES",
    read: "4 MIN READ",
    date: "14 OCT 2026",
    excerpt: "Comfort and choice are at the heart of a thoughtful wellness experience.",
    image: P.therapy,
    sections: [
      {
        title: "Comfort first",
        body: "Preferences, pressure and boundaries should be easy to communicate. A good treatment experience starts with listening.",
      },
      {
        title: "Personal, never prescribed",
        body: "No two people arrive with exactly the same needs. A simple conversation can help tailor the pace, atmosphere and level of contact.",
      },
      {
        title: "Your choice matters",
        body: "It is always appropriate to request a change or stop an experience. Wellness should feel welcoming, not demanding.",
      },
    ],
  },
  {
    slug: "a-space-to-pause",
    title: "A space to pause",
    category: "DESIGN & SPACE",
    read: "6 MIN READ",
    date: "07 OCT 2026",
    excerpt: "How light, texture, sound and silence shape the places where we feel most at ease.",
    image: P.architecture,
    sections: [
      {
        title: "Light that settles",
        body: "Soft light gives surfaces depth without demanding attention. A room can feel more welcoming when it leaves room for the senses to rest.",
      },
      {
        title: "Texture and quiet",
        body: "Natural textures, gentle sound and considered materials can create a sense of welcome without visual clutter.",
      },
      {
        title: "Room to breathe",
        body: "The most beautiful space may be the one that does not ask you to perform.",
      },
    ],
  },
  {
    slug: "the-gentle-evening",
    title: "The gentle evening",
    category: "MINDFUL LIVING",
    read: "3 MIN READ",
    date: "30 SEP 2026",
    excerpt: "A few small steps to make the final moments of the day feel less hurried.",
    image: P.room,
    sections: [
      {
        title: "Dim the day",
        body: "Lower the lights, put your phone away and create a clear boundary between work and personal time.",
      },
      {
        title: "Find a ritual",
        body: "You might read, stretch comfortably or simply enjoy a warm drink. A routine works best when it feels kind rather than strict.",
      },
    ],
  },
  {
    slug: "the-art-of-arriving",
    title: "The art of arriving",
    category: "WELLNESS NOTES",
    read: "4 MIN READ",
    date: "18 SEP 2026",
    excerpt:
      "Before an appointment, a short transition can make a meaningful difference to the experience.",
    image: P.spa,
    sections: [
      {
        title: "Allow time",
        body: "A few extra minutes before your appointment can help you settle and share any preferences with your therapist.",
      },
      {
        title: "Stay curious",
        body: "A new ritual is an invitation to notice what feels comforting and what you would change next time.",
      },
    ],
  },
];
export const GALLERY = [
  { image: P.spa, title: "Stillness, by design", type: "INTERIORS" },
  { image: P.therapy, title: "A quieter ritual", type: "TREATMENTS" },
  { image: P.architecture, title: "Between light & shadow", type: "INTERIORS" },
  { image: P.oils, title: "Earth, bottled", type: "DETAILS" },
  { image: P.sanctuary, title: "Take your time", type: "INTERIORS" },
  { image: P.face, title: "A moment for you", type: "TREATMENTS" },
  { image: P.botanical, title: "Nature, close at hand", type: "DETAILS" },
  { image: P.room, title: "Another way to be", type: "INTERIORS" },
];
export const FAQS = [
  {
    q: "Can I change my booking?",
    a: "This showcase uses local browser demo requests, not real reservations. A live spa will need its own rescheduling and cancellation policy.",
  },
  {
    q: "Can I select a therapist?",
    a: "You can explore the team on this demo and indicate your preferences in the example booking flow. No therapist availability is checked in real time.",
  },
  {
    q: "Do you offer couple experiences?",
    a: "Explore the Together in Time and Golden Hour packages. Shared experiences are represented by sample prices and durations.",
  },
  {
    q: "Can I buy a gift card here?",
    a: "The gift card builder creates a printable example voucher only. It does not issue a real paid or redeemable gift card.",
  },
  {
    q: "Are the locations and prices real?",
    a: "No. NOVRA Wellness House is a fictional demonstration brand. All branches, people, services and pricing are illustrative.",
  },
];

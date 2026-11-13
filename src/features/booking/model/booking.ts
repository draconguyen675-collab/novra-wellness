import { LOCATIONS } from "@/content/locations";
import { PACKAGES } from "@/content/packages";
import { SERVICES } from "@/content/services";
export type BookingKind = "service" | "package" | "ritual";
export type BookingDraft = {
  kind: BookingKind;
  slug: string;
  location: string;
  date: string;
  time: string;
  guests: number;
  minutes: number;
  price: number;
  label: string;
  details?: string[];
};
export const initial: BookingDraft = {
  kind: "service",
  slug: SERVICES[0].slug,
  location: LOCATIONS[0].slug,
  date: "",
  time: "",
  guests: 1,
  minutes: SERVICES[0].durationOptions[0].minutes,
  price: SERVICES[0].durationOptions[0].price,
  label: SERVICES[0].name,
};
export const times = [
  "09:00",
  "09:30",
  "10:30",
  "11:00",
  "13:00",
  "14:00",
  "14:30",
  "15:30",
  "16:00",
  "17:00",
];
export const localISO = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export const today = () => localISO(new Date());
export const getCurrent = (): BookingDraft => {
  try {
    const x = sessionStorage.getItem("novra-booking-draft");
    const item = x ? JSON.parse(x) : null;
    if (
      item &&
      ["service", "package", "ritual"].includes(item.kind) &&
      typeof item.price === "number"
    )
      return { ...initial, ...item };
  } catch {}
  return initial;
};
export const sampleAvailable = (date: string, time: string) => {
  if (!date || date < today()) return false;
  const d = new Date(`${date}T12:00:00`);
  const seed = d.getDate() + d.getDay() * 3 + Number(time.slice(0, 2)) * 2 + Number(time.slice(3));
  const now = new Date();
  if (
    date === today() &&
    time <=
      `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
  )
    return false;
  return seed % 5 !== 0 && (d.getDay() !== 0 || Number(time.slice(0, 2)) >= 10);
};
export function populateFromSelection(
  draft: BookingDraft,
  kind: BookingKind,
  slug: string,
): BookingDraft {
  if (kind === "package") {
    const p = PACKAGES.find((p) => p.slug === slug);
    const v = p?.variants[0];
    return p && v
      ? {
          ...draft,
          kind,
          slug: p.slug,
          label: p.name,
          minutes: v.minutes,
          price: v.price,
          guests: v.guests,
          date: "",
          time: "",
        }
      : draft;
  }
  if (kind === "service") {
    const s = SERVICES.find((s) => s.slug === slug);
    const v = s?.durationOptions[0];
    return s && v
      ? {
          ...draft,
          kind,
          slug: s.slug,
          label: s.name,
          minutes: v.minutes,
          price: v.price,
          guests: 1,
          date: "",
          time: "",
        }
      : draft;
  }
  return draft;
}

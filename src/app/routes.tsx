import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
const HomePage = lazy(() => import("@/features/home/HomePage"));
const AboutPage = lazy(() => import("@/features/story/AboutPage"));
const PhilosophyPage = lazy(() => import("@/features/story/PhilosophyPage"));
const ServicesPage = lazy(() => import("@/features/services/ServicesPage"));
const ServiceDetailPage = lazy(() => import("@/features/services/ServiceDetailPage"));
const PackagesPage = lazy(() => import("@/features/packages/PackagesPage"));
const PackageDetailPage = lazy(() => import("@/features/packages/PackageDetailPage"));
const PricingPage = lazy(() => import("@/features/pricing/PricingPage"));
const LocationsPage = lazy(() => import("@/features/locations/LocationsPage"));
const LocationDetailPage = lazy(() => import("@/features/locations/LocationDetailPage"));
const MotionLabPage = lazy(() => import("@/features/motion-lab/MotionLabPage"));
const ServiceCategoryPage = lazy(() =>
  import("@/features/services/ServiceCategoryPage").then((module) => ({
    default: module.ServiceCategoryPage,
  })),
);
const TeamPage = lazy(() =>
  import("@/features/team/TeamPage").then((module) => ({ default: module.TeamPage })),
);
const TeamDetailPage = lazy(() =>
  import("@/features/team/TeamDetailPage").then((module) => ({ default: module.TeamDetailPage })),
);
const GalleryPage = lazy(() =>
  import("@/features/gallery/GalleryPage").then((module) => ({ default: module.GalleryPage })),
);
const MembershipPage = lazy(() =>
  import("@/features/membership/MembershipPage").then((module) => ({
    default: module.MembershipPage,
  })),
);
const GiftCardsPage = lazy(() =>
  import("@/features/gift-cards/GiftCardsPage").then((module) => ({
    default: module.GiftCardsPage,
  })),
);
const JournalPage = lazy(() =>
  import("@/features/journal/JournalPage").then((module) => ({ default: module.JournalPage })),
);
const JournalDetailPage = lazy(() =>
  import("@/features/journal/JournalDetailPage").then((module) => ({
    default: module.JournalDetailPage,
  })),
);
const ContactPage = lazy(() =>
  import("@/features/contact/ContactPage").then((module) => ({ default: module.ContactPage })),
);
const DiscoverPage = lazy(() =>
  import("@/features/discovery/DiscoverPage").then((module) => ({ default: module.DiscoverPage })),
);
const RitualBuilderPage = lazy(() =>
  import("@/features/rituals/RitualBuilderPage").then((module) => ({
    default: module.RitualBuilderPage,
  })),
);
const BookingPage = lazy(() =>
  import("@/features/booking/BookingPage").then((module) => ({ default: module.BookingPage })),
);
const ConfirmationPage = lazy(() =>
  import("@/features/booking/ConfirmationPage").then((module) => ({
    default: module.ConfirmationPage,
  })),
);
const ScreenIndexPage = lazy(() => import("./ScreenIndexPage"));
const NotFoundPage = lazy(() => import("./NotFoundPage"));

export const routeDefinitions = [
  { path: "/", Page: HomePage },
  { path: "/about", Page: AboutPage },
  { path: "/philosophy", Page: PhilosophyPage },
  { path: "/services", Page: ServicesPage },
  { path: "/services/category/:slug", Page: ServiceCategoryPage },
  { path: "/services/:slug", Page: ServiceDetailPage },
  { path: "/packages", Page: PackagesPage },
  { path: "/packages/:slug", Page: PackageDetailPage },
  { path: "/pricing", Page: PricingPage },
  { path: "/locations", Page: LocationsPage },
  { path: "/locations/:slug", Page: LocationDetailPage },
  { path: "/team", Page: TeamPage },
  { path: "/team/:slug", Page: TeamDetailPage },
  { path: "/gallery", Page: GalleryPage },
  { path: "/membership", Page: MembershipPage },
  { path: "/gift-cards", Page: GiftCardsPage },
  { path: "/journal", Page: JournalPage },
  { path: "/journal/:slug", Page: JournalDetailPage },
  { path: "/contact", Page: ContactPage },
  { path: "/discover", Page: DiscoverPage },
  { path: "/ritual-builder", Page: RitualBuilderPage },
  { path: "/booking", Page: BookingPage },
  { path: "/booking/confirmation", Page: ConfirmationPage },
  { path: "/screens", Page: ScreenIndexPage },
  { path: "/motion-lab", Page: MotionLabPage },
  { path: "*", Page: NotFoundPage },
];

export function AppRoutes() {
  return (
    <Routes>
      {routeDefinitions.map(({ path, Page }) => (
        <Route key={path} path={path} element={<Page />} />
      ))}
    </Routes>
  );
}

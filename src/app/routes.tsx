import { lazy } from "react";
import { Navigate } from "react-router";
import { createBrowserRouter } from "react-router";
import Website from "@/features/website/pages/Website";
import Admin from "@/features/admin/pages/Admin";
import MobileApp from "@/features/website/pages/MobileApp";
import LiveAuctions from "@/features/auction/pages/LiveAuctions";
import Auctions from "@/features/auction/pages/Auctions";
const AuctionDetail = lazy(
  () => import("../features/auction/pages/AuctionDetail"),
);
const EditAuction = lazy(() => import("../features/admin/pages/EditAuction"));
const Bids = lazy(() => import("../features/admin/pages/Bids"));
import AuctionGuide from "@/features/auction/pages/AuctionGuide";
import Buying from "@/features/website/buying/Buying";
import Selling from "@/features/website/selling/Selling";
import Commercial from "@/features/website/pages/Commercial";
import Online from "@/features/website/pages/Online";
import About from "@/features/website/info/About";
import Register from "@/features/auth/pages/Register";
import Login from "@/features/auth/pages/Login";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import ResetPassword from "@/features/auth/pages/ResetPassword";
import OAuthCallback from "@/features/auth/pages/OAuthCallback";
import ContactUs from "@/features/website/info/ContactUs";
import OnlineAuctions from "@/features/website/pages/OnlineAuctions";
import FreeValuation from "@/features/website/info/FreeValuation";
import AuctionFinance from "@/features/auction/pages/AuctionFinance";
import ViewAllLots from "@/features/property/pages/ViewAllLots";
import BuyingOverview from "@/features/website/buying/BuyingOverview";
import SellingOverview from "@/features/website/selling/SellingOverview";
import CatalogueRequest from "@/features/website/info/CatalogueRequest";
import BuyingGuide from "@/features/website/buying/BuyingGuide";
import RegisterAlert from "@/features/website/info/RegisterAlert";
import TermsOfSale from "@/features/website/info/TermsOfSale";
import WhyBuyAtKing from "@/features/website/buying/WhyBuyAtKing";
import Solicitor from "@/features/website/info/Solicitor";
import WhySellWithFuture from "@/features/website/selling/WhySellWithFuture";
import GuideFAQ from "@/features/website/info/GuideFAQ";
import ReferralFee from "@/features/website/info/ReferralFee";
import HomeReport from "@/features/website/info/HomeReport";
import ViewLiveLocations from "@/features/website/info/ViewLiveLocations";
import PropertyDetails from "@/features/property/pages/PropertyDetails";
import SystemArchitecture from "@/features/website/info/SystemArchitecture";
import AddProperty from "@/features/property/pages/AddProperty";
const EditProperty = lazy(() => import("../features/admin/pages/EditProperty"));
import ProtectedRoute from "@/features/shared/layout/ProtectedRoute";

const AdminProfile = lazy(() => import("../features/admin/pages/AdminProfile"));
import AdminSettings from "@/features/admin/pages/AdminSettings";

export const router = createBrowserRouter([
  { path: "/", Component: Website },
  { path: "/website", Component: Website },
  {
    path: "/admin",
    Component: () => (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/profile",
    Component: () => (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/settings",
    Component: () => (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminSettings />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/overview",
    Component: () => (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/properties",
    Component: () => (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/auctions",
    Component: () => (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/bids",
    Component: () => (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Bids />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/auctions/:id/edit",
    Component: () => (
      <ProtectedRoute allowedRoles={["admin"]}>
        <EditAuction />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    Component: () => (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/pageBuilder",
    Component: () => (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/menuManager",
    Component: () => (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/marketing",
    Component: () => (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/social",
    Component: () => (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/investors",
    Component: () => (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/ai",
    Component: () => (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/compliance",
    Component: () => (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/financial",
    Component: () => (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/analytics",
    Component: () => (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>
    ),
  },
  { path: "/mobile", Component: MobileApp },
  { path: "/live-auctions", Component: LiveAuctions },
  { path: "/auctions", Component: Auctions },
  { path: "/auctions/:slug", Component: AuctionDetail },
  { path: "/auctions/:slug/properties", Component: ViewAllLots },
  { path: "/auction-guide", Component: AuctionGuide },
  { path: "/buying", Component: Buying },
  { path: "/selling", Component: Selling },
  { path: "/commercial", Component: Commercial },
  { path: "/online", Component: Online },
  { path: "/about", Component: About },
  { path: "/register", Component: Register },
  { path: "/login", Component: Login },
  { path: "/forgot-password", Component: ForgotPassword },
  { path: "/reset-password/:token", Component: ResetPassword },
  { path: "/oauth-callback", Component: OAuthCallback },
  { path: "/contact-us", Component: ContactUs },
  { path: "/online-auctions", Component: OnlineAuctions },
  { path: "/free-valuation", Component: FreeValuation },
  { path: "/auction-finance", Component: AuctionFinance },
  { path: "/view-all-lots", Component: ViewAllLots },
  { path: "/buying-overview", Component: BuyingOverview },
  { path: "/selling-overview", Component: SellingOverview },
  { path: "/catalogue-request", Component: CatalogueRequest },
  { path: "/buying-guide", Component: BuyingGuide },
  { path: "/register-alert", Component: RegisterAlert },
  { path: "/terms-of-sale", Component: TermsOfSale },
  { path: "/why-buy-at-king", Component: WhyBuyAtKing },
  { path: "/solicitor", Component: Solicitor },
  { path: "/why-sell-with-future", Component: WhySellWithFuture },
  { path: "/guide-faq", Component: GuideFAQ },
  { path: "/referral-fee", Component: ReferralFee },
  { path: "/home-report", Component: HomeReport },
  { path: "/view-live-locations", Component: ViewLiveLocations },
  { path: "/property-details", Component: PropertyDetails },
  // New SEO-friendly routes
  { path: "/properties", Component: ViewAllLots },
  { path: "/properties/:slug", Component: PropertyDetails },
  { path: "/architecture", Component: SystemArchitecture },
  {
    path: "/admin/properties/new",
    Component: () => (
      <ProtectedRoute allowedRoles={["admin", "agent"]}>
        <AddProperty />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/properties/:id/edit",
    Component: () => (
      <ProtectedRoute allowedRoles={["admin"]}>
        <EditProperty />
      </ProtectedRoute>
    ),
  },
  {
    path: "/add-property",
    Component: () => <Navigate to="/admin/properties/new" replace />,
  },
]);

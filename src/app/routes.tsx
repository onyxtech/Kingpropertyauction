import { lazy, Suspense } from "react";
import { Navigate } from "react-router";
import { createBrowserRouter } from "react-router";
import ErrorBoundary from "@/features/shared/components/ErrorBoundary";
import Website from "@/features/website/pages/Website";
import MobileApp from "@/features/website/pages/MobileApp";
import LiveAuctions from "@/features/auction/pages/LiveAuctions";
import Auctions from "@/features/auction/pages/Auctions";
const AuctionDetail = lazy(
  () => import("../features/auction/pages/AuctionDetail"),
);
const EditAuction = lazy(() => import("../features/admin/pages/EditAuction"));
const Bids = lazy(() => import("../features/admin/pages/Bids"));
const Admin = lazy(() => import("../features/admin/pages/Admin"));
const AdminSettings = lazy(
  () => import("../features/admin/pages/AdminSettings"),
);
const Leads = lazy(() => import("../features/admin/pages/Leads"));
const Inbox = lazy(() => import("../features/admin/pages/Inbox"));
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
import PropertyDetails from "@/features/property/pages/PropertyDetails";
import SystemArchitecture from "@/features/website/info/SystemArchitecture";
import AddProperty from "@/features/property/pages/AddProperty";
const EditProperty = lazy(() => import("../features/admin/pages/EditProperty"));
const CustomerEditProperty = lazy(
  () => import("../features/customer/pages/CustomerEditProperty"),
);
const Offers = lazy(() => import("../features/admin/pages/Offers"));
const AuctionBids = lazy(() => import("../features/admin/pages/AuctionBids"));
const AdminUsers = lazy(() => import("../features/admin/pages/Users"));
const Approvals = lazy(() => import("../features/admin/pages/Approvals"));
const Revenue = lazy(() => import("../features/admin/pages/Revenue"));
const AdminCommissions = lazy(
  () => import("../features/admin/pages/Commissions"),
);
const UserProfile = lazy(() => import("../features/admin/pages/UserProfile"));
import ProtectedRoute from "@/features/shared/layout/ProtectedRoute";
import NotFound from "@/features/shared/pages/NotFound";

const AdminProfile = lazy(() => import("../features/admin/pages/AdminProfile"));
import Analytics from "@/features/admin/pages/Analytics";
const Reports = lazy(() => import("../features/admin/pages/Reports"));
import Campaigns from "@/features/admin/pages/Campaigns";
import MenuManager from "@/features/admin/pages/MenuManager";
const CustomerDashboard = lazy(
  () => import("../features/customer/pages/CustomerDashboard"),
);

const eb = (node: React.ReactNode) => <ErrorBoundary>{node}</ErrorBoundary>;
const lazy_eb = (node: React.ReactNode) => (
  <ErrorBoundary>
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      {node}
    </Suspense>
  </ErrorBoundary>
);

export const router = createBrowserRouter([
  { path: "/", element: eb(<Website />) },
  { path: "/website", element: eb(<Website />) },
  {
    path: "/admin",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/profile",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminProfile />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/settings",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminSettings />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/leads",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <Leads />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/inbox",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <Inbox />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/overview",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/properties",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/auctions",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/bids",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <Bids />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/offers",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <Offers />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/auction-bids",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <AuctionBids />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/auctions/:id/edit",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <EditAuction />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/users",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminUsers />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/users/:id",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <UserProfile />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/approvals",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <Approvals />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/revenue",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <Revenue />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/commissions",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminCommissions />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/pageBuilder",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/menus",
    element: eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <MenuManager />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/campaigns",
    element: eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <Campaigns />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/social",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/ai",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/compliance",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/financial",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/analytics",
    element: eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <Analytics />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/reports",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin"]}>
        <Reports />
      </ProtectedRoute>,
    ),
  },
  { path: "/mobile", element: eb(<MobileApp />) },
  { path: "/live-auctions", element: eb(<LiveAuctions />) },
  { path: "/auctions", element: eb(<Auctions />) },
  { path: "/auctions/:slug", element: lazy_eb(<AuctionDetail />) },
  { path: "/auctions/:slug/properties", element: eb(<ViewAllLots />) },
  { path: "/auction-guide", element: eb(<AuctionGuide />) },
  { path: "/buying", element: eb(<Buying />) },
  { path: "/selling", element: eb(<Selling />) },
  { path: "/commercial", element: eb(<Commercial />) },
  { path: "/online", element: eb(<Online />) },
  { path: "/about", element: eb(<About />) },
  { path: "/register", element: eb(<Register />) },
  { path: "/login", element: eb(<Login />) },
  { path: "/forgot-password", element: eb(<ForgotPassword />) },
  { path: "/reset-password/:token", element: eb(<ResetPassword />) },
  { path: "/oauth-callback", element: eb(<OAuthCallback />) },
  { path: "/contact-us", element: eb(<ContactUs />) },
  { path: "/online-auctions", element: eb(<OnlineAuctions />) },
  { path: "/free-valuation", element: eb(<FreeValuation />) },
  { path: "/view-all-lots", element: eb(<ViewAllLots />) },
  { path: "/buying-overview", element: eb(<BuyingOverview />) },
  { path: "/selling-overview", element: eb(<SellingOverview />) },
  { path: "/catalogue-request", element: eb(<CatalogueRequest />) },
  { path: "/buying-guide", element: eb(<BuyingGuide />) },
  { path: "/register-alert", element: eb(<RegisterAlert />) },
  { path: "/terms-of-sale", element: eb(<TermsOfSale />) },
  { path: "/why-buy-at-king", element: eb(<WhyBuyAtKing />) },
  { path: "/solicitor", element: eb(<Solicitor />) },
  { path: "/why-sell-with-future", element: eb(<WhySellWithFuture />) },
  { path: "/guide-faq", element: eb(<GuideFAQ />) },
  { path: "/referral-fee", element: eb(<ReferralFee />) },
  { path: "/home-report", element: eb(<HomeReport />) },
  { path: "/property-details", element: eb(<PropertyDetails />) },
  { path: "/properties", element: eb(<ViewAllLots />) },
  { path: "/properties/:slug", element: eb(<PropertyDetails />) },
  { path: "/architecture", element: eb(<SystemArchitecture />) },
  {
    path: "/add-property",
    element: eb(
      <ProtectedRoute
        allowedRoles={["admin", "agent", "seller"]}
        redirectTo="/register?reason=agent"
        allowCanListProperties={true}
        loginIntent="add-property"
      >
        <AddProperty />
      </ProtectedRoute>,
    ),
  },
  // {
  //   path: "/register/owner",
  //   element: <Navigate to="/register?reason=seller" replace />,
  // },
  {
    path: "/admin/properties/:id/edit",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin", "agent", "seller"]}>
        <EditProperty />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/admin/properties/new",
    element: <Navigate to="/add-property" replace />,
  },
  {
    path: "/dashboard",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["buyer", "seller", "agent", "user"]}>
        <CustomerDashboard />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/dashboard/:tab",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["buyer", "seller", "agent", "user"]}>
        <CustomerDashboard />
      </ProtectedRoute>,
    ),
  },
  {
    path: "/dashboard/edit-property/:id",
    element: lazy_eb(
      <ProtectedRoute allowedRoles={["admin", "agent", "seller", "buyer"]}>
        <CustomerEditProperty />
      </ProtectedRoute>,
    ),
  },
  { path: "/admin/*", element: eb(<NotFound />) },
  { path: "*", element: eb(<NotFound />) },
]);

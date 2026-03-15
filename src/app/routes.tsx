import { createBrowserRouter } from "react-router";
import Home from './pages/Home';
import Website from './pages/Website';
import Admin from './pages/Admin';
import MobileApp from './pages/MobileApp';
import LiveAuctions from './pages/LiveAuctions';
import Auctions from './pages/Auctions';
import AuctionGuide from './pages/AuctionGuide';
import Buying from './pages/Buying';
import Selling from './pages/Selling';
import Commercial from './pages/Commercial';
import Online from './pages/Online';
import About from './pages/About';
import Register from './pages/Register';
import Login from './pages/Login';
import ContactUs from './pages/ContactUs';
import OnlineAuctions from './pages/OnlineAuctions';
import FreeValuation from './pages/FreeValuation';
import AuctionFinance from './pages/AuctionFinance';
import ViewAllLots from './pages/ViewAllLots';
import BuyingOverview from './pages/BuyingOverview';
import SellingOverview from './pages/SellingOverview';
import CatalogueRequest from './pages/CatalogueRequest';
import BuyingGuide from './pages/BuyingGuide';
import RegisterAlert from './pages/RegisterAlert';
import TermsOfSale from './pages/TermsOfSale';
import WhyBuyAtKing from './pages/WhyBuyAtKing';
import Solicitor from './pages/Solicitor';
import WhySellWithFuture from './pages/WhySellWithFuture';
import GuideFAQ from './pages/GuideFAQ';
import ReferralFee from './pages/ReferralFee';
import HomeReport from './pages/HomeReport';
import ViewLiveLocations from './pages/ViewLiveLocations';
import PropertyDetails from './pages/PropertyDetails';
import SystemArchitecture from './pages/SystemArchitecture';
import AddProperty from './pages/AddProperty';
import Settings from './pages/Settings';

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/website",
    Component: Website,
  },
  {
    path: "/admin",
    Component: Admin,
  },
  {
    path: "/mobile",
    Component: MobileApp,
  },
  {
    path: "/live-auctions",
    Component: LiveAuctions,
  },
  {
    path: "/auctions",
    Component: Auctions,
  },
  {
    path: "/auction-guide",
    Component: AuctionGuide,
  },
  {
    path: "/buying",
    Component: Buying,
  },
  {
    path: "/selling",
    Component: Selling,
  },
  {
    path: "/commercial",
    Component: Commercial,
  },
  {
    path: "/online",
    Component: Online,
  },
  {
    path: "/about",
    Component: About,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/contact-us",
    Component: ContactUs,
  },
  {
    path: "/online-auctions",
    Component: OnlineAuctions,
  },
  {
    path: "/free-valuation",
    Component: FreeValuation,
  },
  {
    path: "/auction-finance",
    Component: AuctionFinance,
  },
  {
    path: "/view-all-lots",
    Component: ViewAllLots,
  },
  {
    path: "/buying-overview",
    Component: BuyingOverview,
  },
  {
    path: "/selling-overview",
    Component: SellingOverview,
  },
  {
    path: "/catalogue-request",
    Component: CatalogueRequest,
  },
  {
    path: "/buying-guide",
    Component: BuyingGuide,
  },
  {
    path: "/register-alert",
    Component: RegisterAlert,
  },
  {
    path: "/terms-of-sale",
    Component: TermsOfSale,
  },
  {
    path: "/why-buy-at-king",
    Component: WhyBuyAtKing,
  },
  {
    path: "/solicitor",
    Component: Solicitor,
  },
  {
    path: "/why-sell-with-future",
    Component: WhySellWithFuture,
  },
  {
    path: "/guide-faq",
    Component: GuideFAQ,
  },
  {
    path: "/referral-fee",
    Component: ReferralFee,
  },
  {
    path: "/home-report",
    Component: HomeReport,
  },
  {
    path: "/view-live-locations",
    Component: ViewLiveLocations,
  },
  {
    path: "/property-details",
    Component: PropertyDetails,
  },
  {
    path: "/architecture",
    Component: SystemArchitecture,
  },
  {
    path: "/add-property",
    Component: AddProperty,
  },
  {
    path: "/settings",
    Component: Settings,
  },
]);
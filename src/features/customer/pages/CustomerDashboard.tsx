import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import CustomerLayout from "../components/CustomerLayout";
import OverviewTab from "../tabs/OverviewTab";
import SellerPropertiesTab from "../tabs/SellerPropertiesTab";
import MyBidsTab from "../tabs/MyBidsTab";
import PaymentsTab from "../tabs/PaymentsTab";
import MessagesTab from "../tabs/MessagesTab";
import ProfileTab from "../tabs/ProfileTab";
import PropertyBiddersTab from "../tabs/PropertyBiddersTab";
import MyAuctionsTab from "../tabs/MyAuctionsTab";
import OffersTab from "../tabs/OffersTab";
import WonAuctionsTab from "../tabs/WonAuctionsTab";
import WatchlistTab from "../tabs/WatchlistTab";
import EnquiriesTab from "../tabs/EnquiriesTab";
import { useCustomerRole } from "../hooks/useCustomerRole";

const getTabFromPath = (pathname: string) => {
  const seg = pathname.replace("/dashboard", "").replace(/^\//, "");
  return seg || "overview";
};

export default function CustomerDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { canAddProperty, canBid, showBuyerView, showSellerView } = useCustomerRole();
  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/dashboard/${tab}`);
  };

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab onTabChange={handleTabChange} />;
      case "my-properties":
        if (!showSellerView) return <OverviewTab onTabChange={handleTabChange} />;
        return <SellerPropertiesTab />;
      case "my-auctions":
        if (!showSellerView) return <OverviewTab onTabChange={handleTabChange} />;
        return <MyAuctionsTab />;
      case "property-bidders":
        return showSellerView ? <PropertyBiddersTab /> : <OverviewTab onTabChange={handleTabChange} />;
      case "my-bids":
        if (!showBuyerView) return <OverviewTab onTabChange={handleTabChange} />;
        return <MyBidsTab />;
      case "offers":
        if (!showBuyerView) return <OverviewTab onTabChange={handleTabChange} />;
        return <OffersTab />;
      case "won-auctions":
        if (!showBuyerView) return <OverviewTab onTabChange={handleTabChange} />;
        return <WonAuctionsTab />;
      case "watchlist":
        if (!showBuyerView) return <OverviewTab onTabChange={handleTabChange} />;
        return <WatchlistTab />;
      case "enquiries":
        return <EnquiriesTab />;
      case "payments":
        return <PaymentsTab />;
      case "messages":
        return <MessagesTab />;
      case "profile":
        return <ProfileTab />;
      default:
        return <OverviewTab onTabChange={handleTabChange} />;
    }
  };

  return (
    <CustomerLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderTab()}
    </CustomerLayout>
  );
}

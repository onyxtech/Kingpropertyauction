import { useNavigate } from "react-router";
import { ArrowLeft, Plus, Gavel, Mail, FileText } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useTheme } from "../../../app/hooks/useTheme";
import GlobalSearchBar from "./topbar/GlobalSearchBar";
import NotificationBell from "./topbar/NotificationBell";
import ProfileDropdown from "./topbar/ProfileDropdown";
import { useMenuData } from "@/hooks/useMenuData";

export default function TopBar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { getAdminTopBarItems } = useMenuData();
  const dbTopBarItems = getAdminTopBarItems();

  const quickActions = [
    { id: "newProperty", label: "Add Property", icon: Plus, action: () => navigate("/admin/properties/new") },
    { id: "createAuction", label: "Create Auction", icon: Gavel, action: () => navigate("/admin/auctions") },
    { id: "sendCampaign", label: "Campaigns", icon: Mail, action: () => navigate("/admin/campaigns") },
    { id: "generateReport", label: "Reports", icon: FileText, action: () => navigate("/admin/analytics") },
  ];

  const actions = dbTopBarItems.length > 0
    ? dbTopBarItems.map((item: any) => {
        const icons: any = LucideIcons;
        return {
          id: item._id,
          label: item.label,
          icon: icons[item.icon] || icons.Plus,
          action: () => navigate(item.url),
        };
      })
    : quickActions;

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b-2 border-white/60 shadow-sm sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")} className="p-2.5 hover:bg-slate-100 rounded-xl transition-all hover:scale-110" title="Back to Website">
            <ArrowLeft className="size-5 text-slate-600" />
          </button>
          <GlobalSearchBar />
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button key={action.id} onClick={action.action} title={action.label}
                className={`px-4 py-2.5 bg-gradient-to-r ${theme.secondary} text-white rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-2`}>
                <Icon className="size-4" />
                <span className="hidden xl:inline">{action.label}</span>
              </button>
            );
          })}
          <NotificationBell />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
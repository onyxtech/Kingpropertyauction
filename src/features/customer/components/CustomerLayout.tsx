import { useState } from "react";
import CustomerSidebar from "./CustomerSidebar";
import CustomerTopBar from "./CustomerTopBar";
import NotificationToast from "./NotificationToast";
import { useCustomerNotifications } from "../hooks/useCustomerNotifications";

interface CustomerLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function CustomerLayout({ children, activeTab, onTabChange }: CustomerLayoutProps) {
  const { toasts } = useCustomerNotifications();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <CustomerSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <CustomerTopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-2.5 sm:p-3 lg:p-4">
          {children}
        </main>
      </div>
      <NotificationToast toasts={toasts} />
    </div>
  );
}

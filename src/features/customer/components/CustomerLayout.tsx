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

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <CustomerSidebar activeTab={activeTab} onTabChange={onTabChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CustomerTopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      <NotificationToast toasts={toasts} />
    </div>
  );
}

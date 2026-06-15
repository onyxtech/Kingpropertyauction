import Header from "./Header";
import Footer from "./Footer";
import AIChatWidget from "../components/AIChatWidget";

interface PublicLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function PublicLayout({ children, className }: PublicLayoutProps) {
  return (
    <div className={className || "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30"}>
      <Header />
      {children}
      <Footer />
      <AIChatWidget />
    </div>
  );
}
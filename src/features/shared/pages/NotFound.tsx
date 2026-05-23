import { useNavigate } from "react-router";
import { Home, Search, ArrowLeft, Gavel } from "lucide-react";
import PublicLayout from "@/features/shared/layout/PublicLayout";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">

          {/* 404 Visual */}
          <div className="relative mb-8">
            <div className="text-[180px] font-black text-slate-100 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-24 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-orange-500/30 animate-bounce">
                <Gavel className="size-12 text-white" strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-4xl font-black text-slate-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-slate-600 font-medium mb-8 leading-relaxed">
            Oops! The page you're looking for doesn't exist or
            has been moved. Let's get you back on track.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              <ArrowLeft className="size-5" />
              Go Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all"
            >
              <Home className="size-5" />
              Back to Home
            </button>
            <button
              onClick={() => navigate("/auctions")}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 transition-all"
            >
              <Search className="size-5" />
              Browse Auctions
            </button>
          </div>

          {/* Quick Links */}
          <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-100">
            <p className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">
              Popular Pages
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: "All Auctions", path: "/auctions" },
                { label: "Live Auctions", path: "/live-auctions" },
                { label: "Add Property", path: "/add-property" },
                { label: "Contact Us", path: "/contact-us" },
                { label: "Guide & FAQ", path: "/guide-faq" },
                { label: "Property Valuation", path: "/free-valuation" },
              ].map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="px-4 py-2 bg-white border-2 border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:border-blue-400 hover:text-blue-600 transition-all"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </PublicLayout>
  );
}

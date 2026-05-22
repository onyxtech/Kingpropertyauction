import { useAuthStore } from "@/stores/authStore";
import { Navigate, useSearchParams } from "react-router";
import { Crown, Gavel, Shield, Zap, Users, CheckCircle } from "lucide-react";
import PublicLayout from "@/features/shared/layout/PublicLayout";
import RegisterForm from "../components/RegisterForm";

const stats = [
  { value: "10,000+", label: "Properties Sold" },
  { value: "£2.5B+", label: "Property Value" },
  { value: "50,000+", label: "Active Bidders" },
  { value: "98%", label: "Satisfaction Rate" },
];

const benefits = [
  { icon: Gavel, title: "Live Bidding Access", desc: "Bid in real-time on premium properties across the UK" },
  { icon: Shield, title: "Secure & Protected", desc: "Bank-level encryption protecting your transactions" },
  { icon: Zap, title: "Instant Access", desc: "Start bidding immediately after account approval" },
  { icon: Users, title: "Expert Support", desc: "Dedicated team guiding you every step" },
];

export default function Register() {
  const { isAuthenticated } = useAuthStore();
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason");

  if (isAuthenticated && reason !== "seller") return <Navigate to="/" replace />;

  return (
    <PublicLayout>
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        <div className="absolute top-0 right-0 size-[500px] bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 size-[500px] bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl" />
        <div className="relative container mx-auto px-6 py-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="size-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Crown className="size-7 text-yellow-300" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
            Join King Property <span className="text-yellow-300">Auction</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto font-medium">
            Start your journey with the UK's premier property auction platform
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative -mt-8 z-10">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-black text-slate-900">{stat.value}</p>
                  <p className="text-xs md:text-sm font-medium text-slate-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Seller Banner */}
      {reason === "seller" && (
        <div className="container mx-auto px-6 pt-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 text-center">
              <p className="text-amber-800 font-bold">
                🏠 Want to list your properties? Register as a <span className="text-orange-600">Seller</span> to get started!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Full Width Two Columns */}
      <div className="py-10">
        <div className="bg-white shadow-2xl border-y border-slate-200">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5">
            {/* Left - Dark Side (matching login page exactly) */}
            <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-10 flex flex-col justify-center relative overflow-hidden rounded-r-3xl">
              <div className="absolute top-0 right-0 size-64 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 size-64 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Crown className="size-7 text-yellow-300" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">King Property</h2>
                    <p className="text-sm text-white/80 font-medium">Auction Portal</p>
                  </div>
                </div>
                <h3 className="text-3xl font-black text-white mb-6">Why Join Us?</h3>
                <div className="space-y-3">
                  {benefits.map((benefit) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={benefit.title} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="size-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="size-5 text-yellow-300" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white mb-1">{benefit.title}</h4>
                          <p className="text-sm text-white/80">{benefit.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-8 space-y-2">
                  <div className="flex items-center gap-2 text-white/70 text-sm"><CheckCircle className="size-4 text-emerald-400" /><span>Free to create an account</span></div>
                  <div className="flex items-center gap-2 text-white/70 text-sm"><CheckCircle className="size-4 text-emerald-400" /><span>No hidden fees or charges</span></div>
                  <div className="flex items-center gap-2 text-white/70 text-sm"><CheckCircle className="size-4 text-emerald-400" /><span>Cancel anytime</span></div>
                  <div className="flex items-center gap-2 text-white/70 text-sm"><CheckCircle className="size-4 text-emerald-400" /><span>GDPR compliant</span></div>
                </div>
              </div>
            </div>

            {/* Right - Form */}
            <div className="lg:col-span-3 p-8 md:p-10">
              <RegisterForm />
              <p className="text-center text-sm text-slate-500 mt-6">
                Already have an account?{" "}
                <button onClick={() => window.location.href = "/login"} className="text-blue-600 font-bold hover:underline">
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
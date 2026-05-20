import { useAuthStore } from "@/stores/authStore";
import { Navigate } from "react-router";
import { Building2, CheckCircle, Shield, Zap, Users } from "lucide-react";
import PublicLayout from "@/features/shared/layout/PublicLayout";
import RegisterForm from "../components/RegisterForm";

const benefits = [
  { icon: Zap, title: "Instant Access", description: "Start bidding on properties immediately after registration" },
  { icon: Shield, title: "Secure Platform", description: "Bank-level encryption and data protection" },
  { icon: Users, title: "Expert Support", description: "Dedicated team to help you every step of the way" },
];

export default function Register() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicLayout>
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left Side - Benefits */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <h2 className="text-4xl font-bold text-slate-900 mb-6">Join King Property Auction Today</h2>
                <p className="text-xl text-slate-600 mb-8">Create your account to access thousands of properties and start bidding in live auctions.</p>

                <div className="space-y-6 mb-8">
                  {benefits.map((benefit) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={benefit.title} className="flex items-start gap-4">
                        <div className="size-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="size-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">{benefit.title}</h3>
                          <p className="text-slate-600 text-sm">{benefit.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                  <div className="flex items-center gap-2 text-sm text-slate-700 mb-3"><CheckCircle className="size-5 text-green-500" /><span>Free to create an account</span></div>
                  <div className="flex items-center gap-2 text-sm text-slate-700 mb-3"><CheckCircle className="size-5 text-green-500" /><span>No hidden fees or charges</span></div>
                  <div className="flex items-center gap-2 text-sm text-slate-700 mb-3"><CheckCircle className="size-5 text-green-500" /><span>Cancel anytime</span></div>
                  <div className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle className="size-5 text-green-500" /><span>GDPR compliant</span></div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div>
              <RegisterForm />

              {/* Mobile Benefits */}
              <div className="lg:hidden mt-8 space-y-4">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={benefit.title} className="flex items-start gap-4 bg-white rounded-xl p-4 border border-slate-200">
                      <div className="size-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="size-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1 text-sm">{benefit.title}</h3>
                        <p className="text-slate-600 text-xs">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <footer className="bg-slate-900 text-white py-12 mt-12">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="size-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <Building2 className="size-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">King Property Auction</h2>
              </div>
              <p className="text-slate-400">© 2026 King Property Auction. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </PublicLayout>
    </div>
  );
}

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Shield,
  Zap,
  Users,
  Crown,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login submission
    console.log("Login submitted:", formData);
    // Navigate to home or dashboard after login
    navigate("/");
  };

  const handleSocialLogin = (provider: string) => {
    // In a real application, this would initiate OAuth flow
    console.log(`${provider} login initiated`);
    // For demo purposes, navigate to home
    alert(`${provider} sign-in would be configured here with OAuth 2.0.\n\nIn production, this would connect to ${provider}'s authentication service.`);
    // Simulate successful login and navigate
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <Header />

      <div className="relative overflow-hidden py-20">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 size-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 size-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left Side - Branding & Benefits */}
              <div className="hidden md:block">
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="size-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Crown className="size-7 text-yellow-300" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black">King Property</h2>
                      <p className="text-sm text-white/80 font-medium">Premium Auction Portal</p>
                    </div>
                  </div>

                  <h3 className="text-3xl font-black mb-6">
                    Welcome Back to Your Property Journey! 👋
                  </h3>
                  
                  <p className="text-white/90 mb-8 text-lg">
                    Sign in to access exclusive auction properties, place bids, and manage your portfolio.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="size-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                        <Zap className="size-5 text-yellow-300" />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">Live Bidding Access</h4>
                        <p className="text-sm text-white/80">Bid in real-time on premium properties</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="size-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                        <Shield className="size-5 text-emerald-300" />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">Secure & Protected</h4>
                        <p className="text-sm text-white/80">Your data is encrypted and safe</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="size-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="size-5 text-cyan-300" />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">Verified Platform</h4>
                        <p className="text-sm text-white/80">Trusted by 10,000+ buyers</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/20">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-black">10K+</div>
                        <div className="text-xs text-white/70">Properties Sold</div>
                      </div>
                      <div className="h-12 w-px bg-white/20" />
                      <div className="text-center">
                        <div className="text-3xl font-black">5K+</div>
                        <div className="text-xs text-white/70">Active Users</div>
                      </div>
                      <div className="h-12 w-px bg-white/20" />
                      <div className="text-center">
                        <div className="text-3xl font-black">98%</div>
                        <div className="text-xs text-white/70">Success Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Login Form */}
              <div>
                <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-slate-200">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-4 shadow-lg">
                      <Users className="size-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-2">
                      Sign In
                    </h3>
                    <p className="text-slate-600">
                      Access your account and start bidding
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 size-5 text-slate-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3.5 size-5 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? (
                            <EyeOff className="size-5" />
                          ) : (
                            <Eye className="size-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                          className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-600">Remember me</span>
                      </label>
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group"
                    >
                      Sign In
                      <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>

                  {/* Social Login */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 py-1 text-xs font-bold text-slate-400 bg-white">OR CONTINUE WITH</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      className="py-3 border-2 border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                      onClick={() => handleSocialLogin("Google")}
                    >
                      <svg className="size-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </button>
                    <button
                      className="py-3 border-2 border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                      onClick={() => handleSocialLogin("Facebook")}
                    >
                      <svg className="size-5" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </button>
                  </div>

                  {/* Sign Up Link */}
                  <div className="mt-6 pt-6 border-t border-slate-200 text-center text-sm text-slate-600">
                    Don't have an account?{" "}
                    <button
                      onClick={() => navigate("/register")}
                      className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Create Account
                    </button>
                  </div>
                </div>

                {/* Mobile Stats */}
                <div className="md:hidden mt-6 grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 text-center shadow-lg border-2 border-slate-100">
                    <div className="text-2xl font-black text-blue-600">10K+</div>
                    <div className="text-xs text-slate-600 mt-1">Properties</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-lg border-2 border-slate-100">
                    <div className="text-2xl font-black text-indigo-600">5K+</div>
                    <div className="text-xs text-slate-600 mt-1">Users</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-lg border-2 border-slate-100">
                    <div className="text-2xl font-black text-purple-600">98%</div>
                    <div className="text-xs text-slate-600 mt-1">Success</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-white border-t border-slate-200 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Trusted By Leading Organizations</h3>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-40">
            <div className="text-2xl font-black text-slate-400">RIGHTMOVE</div>
            <div className="text-2xl font-black text-slate-400">ZOOPLA</div>
            <div className="text-2xl font-black text-slate-400">PRIME LOCATION</div>
            <div className="text-2xl font-black text-slate-400">ON THE MARKET</div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
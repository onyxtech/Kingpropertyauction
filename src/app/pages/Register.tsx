import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Building2,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  CheckCircle,
  Shield,
  Zap,
  Users,
  X,
  FileText,
  ScrollText,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "motion/react";

export default function Register() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
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
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleSocialSignup = (provider: string) => {
    // In a real application, this would initiate OAuth flow
    console.log(`${provider} signup initiated`);
    // For demo purposes, show alert
    alert(`${provider} sign-up would be configured here with OAuth 2.0.\n\nIn production, this would connect to ${provider}'s authentication service.`);
    // Simulate successful signup and navigate
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  const benefits = [
    {
      icon: Zap,
      title: "Instant Access",
      description: "Start bidding on properties immediately after registration",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Bank-level encryption and data protection",
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Dedicated team to help you every step of the way",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <Header />

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Side - Benefits */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Join King Property Auction Today
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                Create your account to access thousands of properties and start bidding
                in live auctions.
              </p>

              <div className="space-y-6 mb-8">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={benefit.title} className="flex items-start gap-4">
                      <div className="size-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="size-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">
                          {benefit.title}
                        </h3>
                        <p className="text-slate-600 text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-sm text-slate-700 mb-3">
                  <CheckCircle className="size-5 text-green-500" />
                  <span>Free to create an account</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700 mb-3">
                  <CheckCircle className="size-5 text-green-500" />
                  <span>No hidden fees or charges</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700 mb-3">
                  <CheckCircle className="size-5 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle className="size-5 text-green-500" />
                  <span>GDPR compliant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              {/* Toggle */}
              <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1 mb-8">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 rounded-lg font-medium text-sm transition-colors ${
                    isLogin
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 rounded-lg font-medium text-sm transition-colors ${
                    !isLogin
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Register
                </button>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                {isLogin ? "Welcome Back" : "Create Your Account"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                          placeholder="John"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                          placeholder="Smith"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      placeholder="john.smith@example.com"
                      required
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        placeholder="+44 7XXX XXXXXX"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        placeholder="••••••••"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                {isLogin ? (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-600">Remember me</span>
                    </label>
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                ) : (
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-1"
                      required={!isLogin}
                    />
                    <span className="text-sm text-slate-600">
                      I agree to the{" "}
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                        onClick={() => setShowTermsModal(true)}
                      >
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                        onClick={() => setShowPrivacyModal(true)}
                      >
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-500">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="py-3 px-4 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => handleSocialSignup("Google")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="size-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </div>
                  </button>
                  <button
                    type="button"
                    className="py-3 px-4 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => handleSocialSignup("GitHub")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      GitHub
                    </div>
                  </button>
                </div>
              </form>
            </div>

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
                      <h3 className="font-semibold text-slate-900 mb-1 text-sm">
                        {benefit.title}
                      </h3>
                      <p className="text-slate-600 text-xs">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="size-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Building2 className="size-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">King Property Auction</h2>
            </div>
            <p className="text-slate-400">
              © 2026 King Property Auction. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Terms of Service Modal */}
      <AnimatePresence>
        {showTermsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={() => setShowTermsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white relative">
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="absolute top-6 right-6 size-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-all"
                >
                  <X className="size-6" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="size-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <FileText className="size-8" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black">Terms of Service</h3>
                    <p className="text-white/90 font-medium">King Property Auction Platform</p>
                  </div>
                </div>
                <p className="mt-4 text-white/80 text-sm">Last Updated: February 20, 2026</p>
              </div>

              {/* Scrollable Content */}
              <div className="p-8 overflow-y-auto flex-1">
                <div className="space-y-6">
                  <div>
                    <p className="text-slate-700 leading-relaxed">
                      Welcome to King Property Auction. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully before using our services.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
                      <span className="size-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm">1</span>
                      Acceptance of Terms
                    </h4>
                    <p className="text-slate-600 leading-relaxed ml-10">
                      By creating an account, accessing, or using the King Property Auction platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you must not use our services.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
                      <span className="size-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm">2</span>
                      User Accounts & Registration
                    </h4>
                    <div className="ml-10 space-y-2">
                      <p className="text-slate-600 leading-relaxed">
                        You must create an account to participate in auctions and access certain features. You are responsible for:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 pl-4">
                        <li>Providing accurate and complete registration information</li>
                        <li>Maintaining the confidentiality of your account credentials</li>
                        <li>All activities that occur under your account</li>
                        <li>Notifying us immediately of any unauthorized access</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
                      <span className="size-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm">3</span>
                      Property Listings & Information
                    </h4>
                    <p className="text-slate-600 leading-relaxed ml-10">
                      While we strive to provide accurate and up-to-date property listings, we do not guarantee the accuracy, completeness, or reliability of any information provided. All property details should be independently verified before bidding.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
                      <span className="size-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm">4</span>
                      Bidding Process & Rules
                    </h4>
                    <div className="ml-10 space-y-2">
                      <p className="text-slate-600 leading-relaxed">
                        The bidding process is conducted in real-time through our online platform. By participating:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 pl-4">
                        <li>All bids are legally binding and cannot be withdrawn</li>
                        <li>You must have sufficient funds to complete the purchase</li>
                        <li>You agree to complete the transaction if you are the winning bidder</li>
                        <li>Reserve prices may apply to certain properties</li>
                        <li>Bidding increments are determined by the auctioneer</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
                      <span className="size-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm">5</span>
                      Payment Terms
                    </h4>
                    <p className="text-slate-600 leading-relaxed ml-10">
                      Payment for properties must be made in accordance with our payment policies. A deposit may be required upon winning a bid. Full payment terms will be specified in the auction particulars. Failure to complete payment may result in account suspension and legal action.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
                      <span className="size-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm">6</span>
                      Prohibited Activities
                    </h4>
                    <div className="ml-10 space-y-2">
                      <p className="text-slate-600 leading-relaxed">You agree not to:</p>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 pl-4">
                        <li>Manipulate bidding or engage in fraudulent activities</li>
                        <li>Use automated systems or bots to place bids</li>
                        <li>Interfere with the platform's operation</li>
                        <li>Violate any applicable laws or regulations</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
                      <span className="size-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm">7</span>
                      Dispute Resolution
                    </h4>
                    <p className="text-slate-600 leading-relaxed ml-10">
                      Any disputes arising from the use of our platform or services will be resolved through binding arbitration in accordance with UK law. You waive your right to participate in class action lawsuits.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
                      <span className="size-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm">8</span>
                      Limitation of Liability
                    </h4>
                    <p className="text-slate-600 leading-relaxed ml-10">
                      King Property Auction shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform. Our total liability shall not exceed the fees paid by you in the past 12 months.
                    </p>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="size-6 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-900 mb-2">Contact Us</p>
                        <p className="text-sm text-slate-600">
                          If you have any questions about these Terms of Service, please contact us at{" "}
                          <a href="mailto:legal@kingpropertyauction.com" className="text-blue-600 font-medium hover:underline">
                            legal@kingpropertyauction.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-50 px-8 py-5 border-t border-slate-200">
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={() => setShowPrivacyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white relative">
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(false)}
                  className="absolute top-6 right-6 size-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-all"
                >
                  <X className="size-6" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="size-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <Shield className="size-8" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black">Privacy Policy</h3>
                    <p className="text-white/90 font-medium">Your Data Protection Rights</p>
                  </div>
                </div>
                <p className="mt-4 text-white/80 text-sm">Last Updated: February 20, 2026</p>
              </div>

              {/* Scrollable Content */}
              <div className="p-8 overflow-y-auto flex-1">
                <div className="space-y-6">
                  <div>
                    <p className="text-slate-700 leading-relaxed">
                      King Property Auction is committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, store, and protect your information in compliance with UK GDPR and Data Protection Act 2018.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
                      <span className="size-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-black text-sm">1</span>
                      Information We Collect
                    </h4>
                    <div className="ml-10 space-y-3">
                      <div>
                        <p className="font-bold text-slate-800 mb-1">Personal Information:</p>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 pl-4">
                          <li>Name, email address, and phone number</li>
                          <li>Postal address and billing information</li>
                          <li>Identity verification documents (e.g., passport, driver's license)</li>
                          <li>Payment and financial information</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 mb-1">Usage Information:</p>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 pl-4">
                          <li>Browsing history and search queries on our platform</li>
                          <li>Bidding activity and property preferences</li>
                          <li>Device information and IP addresses</li>
                          <li>Cookies and tracking technologies</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
                      <span className="size-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-black text-sm">2</span>
                      How We Use Your Information
                    </h4>
                    <div className="ml-10 space-y-2">
                      <p className="text-slate-600 leading-relaxed mb-2">
                        We use your personal information for the following purposes:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 pl-4">
                        <li>To create and manage your account</li>
                        <li>To process your bids and transactions</li>
                        <li>To communicate with you about auctions and services</li>
                        <li>To verify your identity and prevent fraud</li>
                        <li>To improve our platform and user experience</li>
                        <li>To comply with legal obligations</li>
                        <li>To send marketing communications (with your consent)</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
                      <span className="size-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-black text-sm">3</span>
                      Data Security
                    </h4>
                    <p className="text-slate-600 leading-relaxed ml-10">
                      We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. This includes encryption, secure servers, firewalls, and regular security audits. However, no method of transmission over the Internet is 100% secure.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
                      <span className="size-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-black text-sm">4</span>
                      Third-Party Services
                    </h4>
                    <div className="ml-10 space-y-2">
                      <p className="text-slate-600 leading-relaxed">
                        We may use trusted third-party services to enhance our platform:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 pl-4">
                        <li>Payment processors (for secure transactions)</li>
                        <li>Identity verification services</li>
                        <li>Email and communication platforms</li>
                        <li>Analytics and performance monitoring tools</li>
                      </ul>
                      <p className="text-slate-600 leading-relaxed mt-2">
                        We do not sell or share your personal information with third parties for their marketing purposes without your explicit consent.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
                      <span className="size-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-black text-sm">5</span>
                      Your Rights Under GDPR
                    </h4>
                    <div className="ml-10 space-y-2">
                      <p className="text-slate-600 leading-relaxed mb-2">
                        You have the following rights regarding your personal data:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 pl-4">
                        <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                        <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                        <li><strong>Right to Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
                        <li><strong>Right to Restriction:</strong> Limit how we process your data</li>
                        <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
                        <li><strong>Right to Object:</strong> Object to processing for marketing purposes</li>
                        <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
                      <span className="size-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-black text-sm">6</span>
                      Data Retention
                    </h4>
                    <p className="text-slate-600 leading-relaxed ml-10">
                      We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. After this period, we will securely delete or anonymize your data.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
                      <span className="size-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-black text-sm">7</span>
                      Cookies & Tracking
                    </h4>
                    <p className="text-slate-600 leading-relaxed ml-10">
                      We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and personalize content. You can manage your cookie preferences through your browser settings. Please note that disabling cookies may affect platform functionality.
                    </p>
                  </div>

                  <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="size-6 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-900 mb-2">Contact Our Data Protection Officer</p>
                        <p className="text-sm text-slate-600">
                          To exercise your rights or for privacy-related inquiries, contact our Data Protection Officer at{" "}
                          <a href="mailto:privacy@kingpropertyauction.com" className="text-purple-600 font-medium hover:underline">
                            privacy@kingpropertyauction.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-50 px-8 py-5 border-t border-slate-200">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
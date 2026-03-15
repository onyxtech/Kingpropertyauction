import { Zap, CheckCircle, Home, TrendingUp, Shield, Award, Sparkles, Target, Users, Clock, X, User, Mail, Phone, FileText, Landmark, DollarSign } from "lucide-react";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function BuyingOverview() {
  const [showGetStartedModal, setShowGetStartedModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    propertyType: "",
    budget: "",
    location: "",
    timeline: "",
    hasSolicitor: "",
    hasFinance: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you ${formData.fullName}! Our team will contact you shortly to help you get started.`);
    setShowGetStartedModal(false);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      propertyType: "",
      budget: "",
      location: "",
      timeline: "",
      hasSolicitor: "",
      hasFinance: ""
    });
  };

  const steps = [
    { title: "Research & Browse", desc: "Explore properties and attend viewings", icon: Target },
    { title: "Register to Bid", desc: "Complete ID verification and deposit", icon: Users },
    { title: "Place Your Bid", desc: "Bid confidently during the auction", icon: Zap },
    { title: "Complete Purchase", desc: "Finalize legals and move in", icon: Home }
  ];

  const benefits = [
    { title: "Transparent Process", desc: "No hidden fees or surprises", icon: Shield, gradient: "from-blue-500 to-indigo-600" },
    { title: "Expert Guidance", desc: "Support every step of the way", icon: Award, gradient: "from-purple-500 to-pink-600" },
    { title: "Fast Completion", desc: "Move in within 28 days", icon: Clock, gradient: "from-emerald-500 to-teal-600" },
    { title: "Great Value", desc: "Save up to 25% below market", icon: TrendingUp, gradient: "from-orange-500 to-amber-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <Header />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-95" />
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
              <Sparkles className="size-4 text-yellow-300 animate-pulse" />
              <span className="text-sm font-bold text-white">🏠 Start Your Property Journey Today</span>
            </div>
            
            <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Buying Overview
              <br />
              <span className="text-cyan-300">Your Path to Property</span>
            </h1>
            
            <p className="text-2xl text-white/90 font-medium">
              Everything you need to know about buying at auction
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="mb-16">
          <h2 className="text-5xl font-black text-slate-900 mb-4 text-center">How It Works</h2>
          <p className="text-xl text-slate-600 font-medium text-center mb-12">Four simple steps to owning your dream property</p>
          
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105 text-center">
                  <div className="size-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-black text-white mx-auto mb-6 shadow-lg">
                    {idx + 1}
                  </div>
                  <div className="size-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Icon className="size-7 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 font-medium">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-5xl font-black text-slate-900 mb-12 text-center">Why Buy At Auction?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
                  <div className={`size-14 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="size-7 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3">{benefit.title}</h3>
                  <p className="text-slate-600 font-medium">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border-2 border-white/60">
            <h3 className="text-3xl font-black text-slate-900 mb-6">What You Need</h3>
            <ul className="space-y-4">
              {[
                "Proof of identity and address",
                "Deposit (typically 10% of purchase price)",
                "Solicitor arranged before bidding",
                "Finance pre-approved if required",
                "Registration completed 24hrs before auction"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                  <CheckCircle className="size-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl p-10 shadow-xl text-white">
            <h3 className="text-3xl font-black mb-6">Ready to Start?</h3>
            <p className="text-xl font-medium mb-8">
              Join thousands of successful buyers who found their dream property at auction
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="size-6 flex-shrink-0" />
                <span className="font-medium">Browse live auctions</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="size-6 flex-shrink-0" />
                <span className="font-medium">Register to bid</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="size-6 flex-shrink-0" />
                <span className="font-medium">Get expert support</span>
              </div>
            </div>
            <button
              className="w-full py-5 bg-white text-indigo-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              onClick={() => setShowGetStartedModal(true)}
            >
              Get Started Now
            </button>
          </div>
        </div>
      </div>

      {/* Get Started Modal */}
      {showGetStartedModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl relative animate-in zoom-in-95 duration-300 my-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 size-64 bg-white rounded-full blur-3xl animate-pulse" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="size-8 text-white" />
                    <h3 className="text-3xl font-black text-white">
                      Start Your Property Journey
                    </h3>
                  </div>
                  <p className="text-white/90 font-semibold">
                    Tell us about your property requirements
                  </p>
                </div>
                <button
                  onClick={() => setShowGetStartedModal(false)}
                  className="size-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:rotate-90"
                >
                  <X className="size-6 text-white" />
                </button>
              </div>
            </div>

            {/* Form - Scrollable Content */}
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-8">
                {/* Personal Information Section */}
                <div className="mb-6">
                  <h4 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-slate-200">
                    <User className="size-5 text-blue-600" />
                    Personal Information
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <User className="size-4 text-blue-600" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-slate-900"
                        placeholder="John Smith"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Mail className="size-4 text-indigo-600" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-900"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Phone className="size-4 text-purple-600" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-semibold text-slate-900"
                        placeholder="+44 20 1234 5678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Property Requirements Section */}
                <div className="mb-6">
                  <h4 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-slate-200">
                    <Home className="size-5 text-emerald-600" />
                    Property Requirements
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Home className="size-4 text-emerald-600" />
                        Property Type *
                      </label>
                      <select
                        className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-900"
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                        required
                      >
                        <option value="">Select type</option>
                        <option value="residential">Residential House</option>
                        <option value="apartment">Apartment/Flat</option>
                        <option value="commercial">Commercial Property</option>
                        <option value="land">Land/Development</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <DollarSign className="size-4 text-amber-600" />
                        Budget Range *
                      </label>
                      <input
                        type="text"
                        className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-semibold text-slate-900"
                        placeholder="£200,000 - £300,000"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Target className="size-4 text-cyan-600" />
                        Preferred Location *
                      </label>
                      <input
                        type="text"
                        className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all font-semibold text-slate-900"
                        placeholder="London, Manchester, etc."
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Clock className="size-4 text-rose-600" />
                        Purchase Timeline *
                      </label>
                      <select
                        className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-semibold text-slate-900"
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        required
                      >
                        <option value="">Select timeline</option>
                        <option value="immediate">Immediately (0-1 month)</option>
                        <option value="short">1-3 months</option>
                        <option value="medium">3-6 months</option>
                        <option value="long">6+ months</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Finance & Legal Section */}
                <div className="mb-6">
                  <h4 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-slate-200">
                    <FileText className="size-5 text-orange-600" />
                    Finance & Legal
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Landmark className="size-4 text-orange-600" />
                        Do you have a solicitor? *
                      </label>
                      <select
                        className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-semibold text-slate-900"
                        value={formData.hasSolicitor}
                        onChange={(e) => setFormData({ ...formData, hasSolicitor: e.target.value })}
                        required
                      >
                        <option value="">Select option</option>
                        <option value="yes">Yes, I have a solicitor</option>
                        <option value="no">No, I need assistance</option>
                        <option value="looking">Currently searching</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <DollarSign className="size-4 text-teal-600" />
                        Is your finance arranged? *
                      </label>
                      <select
                        className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-semibold text-slate-900"
                        value={formData.hasFinance}
                        onChange={(e) => setFormData({ ...formData, hasFinance: e.target.value })}
                        required
                      >
                        <option value="">Select option</option>
                        <option value="yes">Yes, finance approved</option>
                        <option value="no">No, I need assistance</option>
                        <option value="cash">Cash buyer</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Benefits Reminder */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
                  <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                    <Sparkles className="size-5 text-blue-600" />
                    What Happens Next
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="size-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-700">Personal property consultant assigned</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="size-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-700">Tailored property recommendations</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="size-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-700">Expert auction guidance</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="size-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-700">Support throughout the process</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    className="flex-1 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Home className="size-6" />
                    Start My Journey
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowGetStartedModal(false)}
                    className="px-8 py-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-lg transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
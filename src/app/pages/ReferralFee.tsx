import { Gift, DollarSign, Users, TrendingUp, Sparkles, CheckCircle, Award, Target, Zap, X, Mail, User, Phone, Building, MessageSquare, MapPin, Home, Info, HelpCircle, BookOpen } from "lucide-react";
import { useState } from "react";
import Header from "../components/Header";

export default function ReferralFee() {
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    address: "",
    city: "",
    postcode: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you ${formData.fullName}! We'll contact you soon about the referral program.`);
    setShowReferralForm(false);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      company: "",
      role: "",
      address: "",
      city: "",
      postcode: "",
      message: ""
    });
  };

  const tiers = [
    {
      name: "Bronze Referrer",
      referrals: "1-5",
      commission: "£500",
      perks: ["£500 per successful sale", "Email support", "Referral tracking dashboard"],
      gradient: "from-orange-500 to-amber-600"
    },
    {
      name: "Silver Referrer",
      referrals: "6-15",
      commission: "£750",
      perks: ["£750 per successful sale", "Priority support", "Exclusive market insights", "Quarterly bonus up to £2,000"],
      gradient: "from-slate-400 to-slate-600",
      popular: true
    },
    {
      name: "Gold Referrer",
      referrals: "16-30",
      commission: "£1,000",
      perks: ["£1,000 per successful sale", "Dedicated account manager", "VIP event invitations", "Annual bonus up to £10,000"],
      gradient: "from-yellow-500 to-yellow-600"
    },
    {
      name: "Platinum Referrer",
      referrals: "31+",
      commission: "£1,500",
      perks: ["£1,500 per successful sale", "White-label partnership options", "Custom commission structures", "Unlimited earning potential"],
      gradient: "from-purple-500 to-indigo-600"
    }
  ];

  const howItWorks = [
    { step: "1", title: "Register", desc: "Sign up for free to our referral program" },
    { step: "2", title: "Refer", desc: "Share your unique link with sellers" },
    { step: "3", title: "Track", desc: "Monitor referrals in your dashboard" },
    { step: "4", title: "Earn", desc: "Get paid when properties sell" }
  ];

  const benefits = [
    { title: "No Limits", desc: "Unlimited earning potential with no caps", icon: Zap },
    { title: "Fast Payments", desc: "Receive commission within 7 days of completion", icon: DollarSign },
    { title: "Full Transparency", desc: "Track all referrals in real-time", icon: Target },
    { title: "Ongoing Support", desc: "Dedicated team to help you succeed", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 opacity-95" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 size-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 size-96 bg-cyan-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
              <Sparkles className="size-4 text-yellow-300 animate-pulse" />
              <span className="text-sm font-bold text-white">🎁 Earn Up To £1,500 • No Limits • Fast Payments</span>
            </div>
            
            <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Referral Program
              <br />
              <span className="text-yellow-300">Earn While You Share</span>
            </h1>
            
            <p className="text-2xl text-white/90 mb-10 font-medium">
              Refer property sellers and earn generous commissions
              <br />
              <span className="text-yellow-200">✨ Up to £1,500 per successful sale</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Commission Tiers */}
        <div className="mb-16">
          <h2 className="text-5xl font-black text-slate-900 mb-4 text-center">Commission Tiers</h2>
          <p className="text-xl text-slate-600 font-medium text-center mb-12">
            The more you refer, the more you earn
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, idx) => (
              <div key={idx} className={`bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 ${tier.popular ? 'border-slate-500 scale-105' : 'border-white/60'} hover:shadow-2xl transition-all hover:scale-110 relative`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-full font-bold text-sm shadow-xl">
                    Popular
                  </div>
                )}
                <div className={`size-14 rounded-2xl bg-gradient-to-br ${tier.gradient} flex items-center justify-center mb-6 shadow-lg mx-auto`}>
                  <Gift className="size-7 text-white" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 text-center">{tier.name}</h3>
                <p className="text-slate-600 font-medium text-center mb-4">{tier.referrals} referrals/year</p>
                <div className="text-center mb-6">
                  <p className={`text-5xl font-black mb-2 bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent`}>
                    {tier.commission}
                  </p>
                  <p className="text-slate-600 font-medium">per sale</p>
                </div>
                <ul className="space-y-3">
                  {tier.perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="size-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-medium text-sm">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16 bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border-2 border-white/60">
          <h2 className="text-4xl font-black text-slate-900 mb-8 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="size-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-3xl font-black text-white mx-auto mb-4 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">
            Program Benefits
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
                  <div className="size-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 shadow-lg">
                    <Icon className="size-7 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3">{benefit.title}</h3>
                  <p className="text-slate-600 font-medium">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-16 bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border-2 border-white/60">
          <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">
            Top Referrers This Year
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-black bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-2">
                Sarah M.
              </div>
              <p className="text-slate-600 font-bold mb-2">Estate Agent, London</p>
              <p className="text-3xl font-black text-slate-900">£45,000</p>
              <p className="text-slate-600 font-medium">30 referrals</p>
            </div>
            <div>
              <div className="text-5xl font-black bg-gradient-to-r from-slate-400 to-slate-600 bg-clip-text text-transparent mb-2">
                James P.
              </div>
              <p className="text-slate-600 font-bold mb-2">Property Developer, Manchester</p>
              <p className="text-3xl font-black text-slate-900">£32,500</p>
              <p className="text-slate-600 font-medium">22 referrals</p>
            </div>
            <div>
              <div className="text-5xl font-black bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent mb-2">
                Emma T.
              </div>
              <p className="text-slate-600 font-bold mb-2">Financial Advisor, Birmingham</p>
              <p className="text-3xl font-black text-slate-900">£28,000</p>
              <p className="text-slate-600 font-medium">19 referrals</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600 rounded-3xl p-12 shadow-xl text-white text-center">
          <div className="size-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-6">
            <Users className="size-8 text-white" />
          </div>
          <h2 className="text-4xl font-black mb-6">Ready to Start Earning?</h2>
          <p className="text-2xl font-medium mb-10">
            Join our referral program today and start earning generous commissions
          </p>
          <div className="flex items-center gap-4 justify-center">
            <button 
              className="px-10 py-5 bg-white text-purple-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              onClick={() => setShowReferralForm(true)}
            >
              Join Referral Program
            </button>
            <button className="px-10 py-5 bg-white/20 backdrop-blur-md border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/30 transition-all" onClick={() => setShowLearnMore(true)}>
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Referral Form Modal */}
      {showReferralForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl relative animate-in zoom-in-95 duration-300 my-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 p-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 size-64 bg-white rounded-full blur-3xl animate-pulse" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="size-8 text-white" />
                    <h3 className="text-3xl font-black text-white">
                      Join Referral Program
                    </h3>
                  </div>
                  <p className="text-white/90 font-semibold">
                    Start earning up to £1,500 per successful sale
                  </p>
                </div>
                <button
                  onClick={() => setShowReferralForm(false)}
                  className="size-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:rotate-90"
                >
                  <X className="size-6 text-white" />
                </button>
              </div>
            </div>

            {/* Form - Scrollable Content */}
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <User className="size-4 text-purple-600" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-semibold text-slate-900"
                      placeholder="John Smith"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <Mail className="size-4 text-pink-600" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-semibold text-slate-900"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <Phone className="size-4 text-rose-600" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-semibold text-slate-900"
                      placeholder="+44 20 1234 5678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <Building className="size-4 text-orange-600" />
                      Company Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-semibold text-slate-900"
                      placeholder="ABC Property Ltd"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <Award className="size-4 text-blue-600" />
                      Your Role *
                    </label>
                    <input
                      type="text"
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-slate-900"
                      placeholder="Estate Agent, Solicitor, etc."
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      required
                    />
                  </div>
                  
                  {/* Address Section Header */}
                  <div className="md:col-span-2 mt-4">
                    <h4 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-slate-200">
                      <MapPin className="size-5 text-teal-600" />
                      Address Information
                    </h4>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <Home className="size-4 text-teal-600" />
                      Street Address *
                    </label>
                    <input
                      type="text"
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-semibold text-slate-900"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <Building className="size-4 text-cyan-600" />
                      City *
                    </label>
                    <input
                      type="text"
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all font-semibold text-slate-900"
                      placeholder="London"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <MapPin className="size-4 text-indigo-600" />
                      Postcode *
                    </label>
                    <input
                      type="text"
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-900"
                      placeholder="SW1A 1AA"
                      value={formData.postcode}
                      onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                      required
                    />
                  </div>

                  {/* Additional Info Section Header */}
                  <div className="md:col-span-2 mt-4">
                    <h4 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-slate-200">
                      <MessageSquare className="size-5 text-emerald-600" />
                      Additional Information
                    </h4>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      Tell Us About Your Referral Network *
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-900 resize-none"
                      placeholder="Tell us about your experience and network in the property industry..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Benefits Reminder */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-purple-200">
                  <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                    <Sparkles className="size-5 text-purple-600" />
                    What You'll Get
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="size-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-700">Up to £1,500 per sale</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="size-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-700">Real-time tracking dashboard</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="size-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-700">Dedicated support team</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="size-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-700">Fast 7-day payments</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    className="flex-1 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Gift className="size-6" />
                    Submit Application
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReferralForm(false)}
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

      {/* Learn More Modal */}
      {showLearnMore && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl relative animate-in zoom-in-95 duration-300 my-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 p-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 size-64 bg-white rounded-full blur-3xl animate-pulse" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="size-8 text-white" />
                    <h3 className="text-3xl font-black text-white">
                      Referral Program Details
                    </h3>
                  </div>
                  <p className="text-white/90 font-semibold">
                    Learn more about our referral program
                  </p>
                </div>
                <button
                  onClick={() => setShowLearnMore(false)}
                  className="size-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:rotate-90"
                >
                  <X className="size-6 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-8">
              {/* Program Overview */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
                <h2 className="text-2xl font-black text-slate-900 mb-3 flex items-center gap-2">
                  <Info className="size-6 text-blue-600" />
                  Program Overview
                </h2>
                <p className="text-slate-700 font-medium leading-relaxed">
                  Our referral program is designed to reward you for introducing new property sellers to our platform. The more successful sales you refer, the more you earn. Join thousands of successful referrers already benefiting from our program.
                </p>
              </div>

              {/* Commission Tiers */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-purple-200">
                <h2 className="text-2xl font-black text-slate-900 mb-3 flex items-center gap-2">
                  <DollarSign className="size-6 text-purple-600" />
                  Commission Tiers
                </h2>
                <p className="text-slate-700 font-medium mb-4">
                  We offer four tiers of commission based on the number of referrals you make:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                    <div className="size-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                      <Gift className="size-5 text-white" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900">Bronze Referrer</p>
                      <p className="text-sm text-slate-600 font-semibold">1-5 referrals/year • £500 per sale</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                    <div className="size-10 rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center flex-shrink-0">
                      <Gift className="size-5 text-white" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900">Silver Referrer</p>
                      <p className="text-sm text-slate-600 font-semibold">6-15 referrals/year • £750 per sale</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                    <div className="size-10 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center flex-shrink-0">
                      <Gift className="size-5 text-white" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900">Gold Referrer</p>
                      <p className="text-sm text-slate-600 font-semibold">16-30 referrals/year • £1,000 per sale</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                    <div className="size-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <Gift className="size-5 text-white" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900">Platinum Referrer</p>
                      <p className="text-sm text-slate-600 font-semibold">31+ referrals/year • £1,500 per sale</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* How It Works */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 mb-6 border-2 border-emerald-200">
                <h2 className="text-2xl font-black text-slate-900 mb-3 flex items-center gap-2">
                  <Target className="size-6 text-emerald-600" />
                  How It Works
                </h2>
                <p className="text-slate-700 font-medium mb-4">
                  Joining our referral program is simple:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-black flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-black text-slate-900">Register</p>
                      <p className="text-sm text-slate-600 font-medium">Sign up for free to our referral program</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-black flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-black text-slate-900">Refer</p>
                      <p className="text-sm text-slate-600 font-medium">Share your unique link with sellers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-black flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-black text-slate-900">Track</p>
                      <p className="text-sm text-slate-600 font-medium">Monitor referrals in your dashboard</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-black flex-shrink-0">
                      4
                    </div>
                    <div>
                      <p className="font-black text-slate-900">Earn</p>
                      <p className="text-sm text-slate-600 font-medium">Get paid when properties sell</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Program Benefits */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 mb-6 border-2 border-orange-200">
                <h2 className="text-2xl font-black text-slate-900 mb-3 flex items-center gap-2">
                  <Award className="size-6 text-orange-600" />
                  Program Benefits
                </h2>
                <p className="text-slate-700 font-medium mb-4">
                  Our referral program offers a range of benefits to help you succeed:
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="size-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-slate-700 font-semibold text-sm">Unlimited earning potential</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="size-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-slate-700 font-semibold text-sm">Fast 7-day payments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="size-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-slate-700 font-semibold text-sm">Real-time tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="size-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-slate-700 font-semibold text-sm">Dedicated support team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="size-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-slate-700 font-semibold text-sm">Marketing materials</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="size-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-slate-700 font-semibold text-sm">VIP event invitations</span>
                  </div>
                </div>
              </div>

              {/* Success Stories */}
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-rose-200">
                <h2 className="text-2xl font-black text-slate-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="size-6 text-rose-600" />
                  Success Stories
                </h2>
                <p className="text-slate-700 font-medium mb-4">
                  See how our top referrers have benefited from the program:
                </p>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="size-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-black">
                        SM
                      </div>
                      <div>
                        <p className="font-black text-slate-900">Sarah M.</p>
                        <p className="text-xs text-slate-600 font-semibold">Estate Agent, London</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-black bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">£45,000</p>
                        <p className="text-xs text-slate-600 font-medium">Total earned</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black text-slate-900">30</p>
                        <p className="text-xs text-slate-600 font-medium">Referrals</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="size-12 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-black">
                        JP
                      </div>
                      <div>
                        <p className="font-black text-slate-900">James P.</p>
                        <p className="text-xs text-slate-600 font-semibold">Property Developer, Manchester</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-black bg-gradient-to-r from-slate-400 to-slate-600 bg-clip-text text-transparent">£32,500</p>
                        <p className="text-xs text-slate-600 font-medium">Total earned</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black text-slate-900">22</p>
                        <p className="text-xs text-slate-600 font-medium">Referrals</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="size-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-black">
                        ET
                      </div>
                      <div>
                        <p className="font-black text-slate-900">Emma T.</p>
                        <p className="text-xs text-slate-600 font-semibold">Financial Advisor, Birmingham</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-black bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">£28,000</p>
                        <p className="text-xs text-slate-600 font-medium">Total earned</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black text-slate-900">19</p>
                        <p className="text-xs text-slate-600 font-medium">Referrals</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mt-8">
                <button
                  className="flex-1 sm:flex-initial px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                  onClick={() => {
                    setShowLearnMore(false);
                    setShowReferralForm(true);
                  }}
                >
                  <Gift className="size-6" />
                  Join Now
                </button>
                <button
                  className="flex-1 sm:flex-initial px-8 py-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-lg transition-all"
                  onClick={() => setShowLearnMore(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
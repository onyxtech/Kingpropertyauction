import { Bell, Mail, MapPin, DollarSign, Home, Sparkles, CheckCircle, Zap, TrendingUp, Target } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RegisterAlert() {
  const alertTypes = [
    { icon: Home, title: "Property Type", desc: "Get notified for specific property types", gradient: "from-blue-500 to-indigo-600" },
    { icon: MapPin, title: "Location Based", desc: "Alerts for your preferred areas", gradient: "from-purple-500 to-pink-600" },
    { icon: DollarSign, title: "Price Range", desc: "Properties within your budget", gradient: "from-emerald-500 to-teal-600" },
    { icon: TrendingUp, title: "New Listings", desc: "First to know about new auctions", gradient: "from-orange-500 to-amber-600" }
  ];

  const benefits = [
    "Instant email notifications",
    "Daily or weekly digest options",
    "Mobile push notifications",
    "Early access to new listings",
    "Saved search preferences",
    "Auction reminders"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 opacity-95" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 size-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 size-96 bg-cyan-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
              <Sparkles className="size-4 text-yellow-300 animate-pulse" />
              <span className="text-sm font-bold text-white">🔔 Smart Alerts • Instant Notifications • Never Miss Out</span>
            </div>
            
            <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Property Alerts
              <br />
              <span className="text-yellow-300">Never Miss Your Dream Property</span>
            </h1>
            
            <p className="text-2xl text-white/90 mb-10 font-medium">
              Get instant notifications for properties matching your exact criteria
              <br />
              <span className="text-yellow-200">✨ Be the first to know about new listings</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Alert Types */}
        <div className="mb-16">
          <h2 className="text-5xl font-black text-slate-900 mb-4 text-center">Alert Types</h2>
          <p className="text-xl text-slate-600 font-medium text-center mb-12">
            Customize your alerts to match your needs
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {alertTypes.map((type, idx) => {
              const Icon = type.icon;
              return (
                <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
                  <div className={`size-14 rounded-2xl bg-gradient-to-br ${type.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="size-7 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3">{type.title}</h3>
                  <p className="text-slate-600 font-medium">{type.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Registration Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border-2 border-white/60">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <Bell className="size-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900">Create Alert</h2>
                <p className="text-slate-600 font-medium">Set your preferences below</p>
              </div>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Property Type</label>
                <select className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium">
                  <option>All Property Types</option>
                  <option>Detached House</option>
                  <option>Semi-Detached House</option>
                  <option>Terraced House</option>
                  <option>Flat/Apartment</option>
                  <option>Bungalow</option>
                  <option>Commercial Property</option>
                  <option>Land</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                <select className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium">
                  <option>All Locations</option>
                  <option>London</option>
                  <option>Manchester</option>
                  <option>Birmingham</option>
                  <option>Leeds</option>
                  <option>Liverpool</option>
                  <option>Bristol</option>
                  <option>Edinburgh</option>
                  <option>Glasgow</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Min Price (£)</label>
                  <input
                    type="number"
                    placeholder="100,000"
                    className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Max Price (£)</label>
                  <input
                    type="number"
                    placeholder="500,000"
                    className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Min Bedrooms</label>
                  <select className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium">
                    <option>Any</option>
                    <option>1+</option>
                    <option>2+</option>
                    <option>3+</option>
                    <option>4+</option>
                    <option>5+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Alert Frequency</label>
                  <select className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium">
                    <option>Instant (as listed)</option>
                    <option>Daily Digest</option>
                    <option>Weekly Summary</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl cursor-pointer">
                  <input
                    type="checkbox"
                    className="size-5 rounded border-2 border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-700 font-medium">Send me auction reminders 24 hours before</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-emerald-500/50 transition-all hover:scale-105 flex items-center justify-center gap-3"
              >
                <Bell className="size-6" />
                Create Alert
              </button>

              <p className="text-sm text-slate-500 text-center font-medium">
                You can update or cancel alerts anytime from your account
              </p>
            </form>
          </div>

          {/* Benefits Section */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
              <h3 className="text-3xl font-black text-slate-900 mb-6">Alert Benefits</h3>
              <ul className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl">
                    <CheckCircle className="size-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl p-8 shadow-xl text-white">
              <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                <Zap className="size-7 text-white" />
              </div>
              <h3 className="text-3xl font-black mb-4">Stay Ahead!</h3>
              <p className="text-xl font-medium mb-6">
                Our alert subscribers view properties an average of 3 days before the general public
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Target className="size-5" />
                  <span className="font-medium">8,934 active alerts</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="size-5" />
                  <span className="font-medium">67% win their first bid</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
              <h3 className="text-2xl font-black text-slate-900 mb-4">How It Works</h3>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Set Criteria", desc: "Tell us what you're looking for" },
                  { step: "2", title: "Get Notified", desc: "Receive instant alerts via email" },
                  { step: "3", title: "Review Property", desc: "Check details and legal pack" },
                  { step: "4", title: "Place Bid", desc: "Register and bid with confidence" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="size-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-black text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-600 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border-2 border-white/60">
          <h2 className="text-4xl font-black text-slate-900 mb-8 text-center">
            Alert Success Stories
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                8,934
              </div>
              <p className="text-slate-600 font-bold">Active Alerts</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                2,456
              </div>
              <p className="text-slate-600 font-bold">Properties Matched</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                1,893
              </div>
              <p className="text-slate-600 font-bold">Successful Purchases</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                67%
              </div>
              <p className="text-slate-600 font-bold">Win Rate</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
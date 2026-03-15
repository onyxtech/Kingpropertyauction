import { FileText, Download, Sparkles, CheckCircle, Mail, Phone, MapPin, Calendar } from "lucide-react";
import Header from "../components/Header";

export default function CatalogueRequest() {
  const upcomingAuctions = [
    { id: 1, date: "March 15, 2026", properties: 45, location: "London & South East" },
    { id: 2, date: "March 22, 2026", properties: 67, location: "Midlands & North" },
    { id: 3, date: "March 29, 2026", properties: 34, location: "Scotland & Wales" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-rose-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-red-600 to-pink-600 opacity-95" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 size-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 size-96 bg-cyan-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
              <Sparkles className="size-4 text-yellow-300 animate-pulse" />
              <span className="text-sm font-bold text-white">📚 Free Catalogues • Detailed Info • High-Quality Images</span>
            </div>
            
            <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Catalogue Request
              <br />
              <span className="text-yellow-300">Download Brochures</span>
            </h1>
            
            <p className="text-2xl text-white/90 mb-10 font-medium">
              Get detailed property information and legal packs delivered to your inbox
              <br />
              <span className="text-yellow-200">✨ Instant access to all auction catalogues</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Request Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border-2 border-white/60">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
                <FileText className="size-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900">Request Catalogue</h2>
                <p className="text-slate-600 font-medium">Fill in your details below</p>
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="john.doe@example.com"
                  className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+44 7xxx xxx xxx"
                  className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Select Auction(s)</label>
                <div className="space-y-3">
                  {upcomingAuctions.map((auction) => (
                    <label key={auction.id} className="flex items-center gap-3 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl cursor-pointer hover:shadow-md transition-all">
                      <input
                        type="checkbox"
                        className="size-5 rounded border-2 border-slate-300 text-rose-600 focus:ring-2 focus:ring-rose-500"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">{auction.date}</p>
                        <p className="text-sm text-slate-600 font-medium">{auction.properties} properties • {auction.location}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Delivery Method</label>
                <select className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all font-medium">
                  <option>Email (PDF)</option>
                  <option>Postal Mail</option>
                  <option>Both Email & Post</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-gradient-to-r from-rose-600 via-red-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-rose-500/50 transition-all hover:scale-105 flex items-center justify-center gap-3"
              >
                <Download className="size-6" />
                Request Catalogue
              </button>

              <p className="text-sm text-slate-500 text-center font-medium">
                By submitting, you agree to receive auction catalogues and updates
              </p>
            </form>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
              <h3 className="text-3xl font-black text-slate-900 mb-6">What's Included?</h3>
              <ul className="space-y-4">
                {[
                  "High-resolution property images",
                  "Detailed property descriptions",
                  "Floor plans and measurements",
                  "Legal pack information",
                  "Guide prices and reserve prices",
                  "Viewing times and contact details",
                  "Terms and conditions of sale",
                  "Location maps and area guides"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl">
                    <CheckCircle className="size-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-rose-500 via-red-500 to-pink-600 rounded-3xl p-8 shadow-xl text-white">
              <h3 className="text-3xl font-black mb-4">Need Help?</h3>
              <p className="text-xl font-medium mb-6">
                Our team is here to assist you with any questions
              </p>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-4 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-all">
                  <Phone className="size-5" />
                  <span className="font-bold">Call: 0800 123 4567</span>
                </button>
                <button className="w-full flex items-center gap-3 p-4 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-all">
                  <Mail className="size-5" />
                  <span className="font-bold">Email: catalogues@kingauction.com</span>
                </button>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
              <h3 className="text-2xl font-black text-slate-900 mb-4">Quick Facts</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <Calendar className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Updated Weekly</p>
                    <p className="text-sm text-slate-600 font-medium">New catalogues every Monday</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Download className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Instant Access</p>
                    <p className="text-sm text-slate-600 font-medium">Download immediately after request</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                    <MapPin className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Nationwide Coverage</p>
                    <p className="text-sm text-slate-600 font-medium">Properties across the UK</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border-2 border-white/60">
          <h2 className="text-4xl font-black text-slate-900 mb-8 text-center">
            Catalogue Downloads This Month
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                8,934
              </div>
              <p className="text-slate-600 font-bold">Total Downloads</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                3,456
              </div>
              <p className="text-slate-600 font-bold">Active Viewers</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                146
              </div>
              <p className="text-slate-600 font-bold">Properties Listed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router";
import { 
  Calculator, 
  CheckCircle,
  Sparkles,
  Home,
  TrendingUp,
  Award,
  Clock,
  MapPin,
  Phone
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function FreeValuation() {
  const navigate = useNavigate();

  const benefits = [
    { icon: Calculator, title: "AI-Powered Analysis", description: "Advanced algorithms for accurate valuations" },
    { icon: TrendingUp, title: "Market Insights", description: "Real-time market data and trends" },
    { icon: Award, title: "Expert Review", description: "Verified by professional valuers" },
    { icon: Clock, title: "Instant Results", description: "Get your valuation in minutes" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 opacity-95" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 size-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 size-96 bg-cyan-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
              <Sparkles className="size-4 text-yellow-300 animate-pulse" />
              <span className="text-sm font-bold text-white">100% FREE • No Obligation • Instant Results</span>
            </div>
            
            <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Free Property Valuation
              <br />
              <span className="text-yellow-200">Know Your Worth Today</span>
            </h1>
            
            <p className="text-2xl text-white/90 mb-10 font-medium">
              Get an accurate, instant property valuation powered by AI and expert analysis
              <br />
              <span className="text-yellow-200">✨ Completely free with no hidden fees</span>
            </p>

            <div className="flex items-center gap-6 justify-center flex-wrap">
              <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                <CheckCircle className="size-6 text-yellow-200" />
                <span className="text-white font-bold">No Obligation</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                <CheckCircle className="size-6 text-yellow-200" />
                <span className="text-white font-bold">Instant Report</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                <CheckCircle className="size-6 text-yellow-200" />
                <span className="text-white font-bold">Expert Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Valuation Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border-2 border-white/60">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg">
                <Home className="size-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900">Property Details</h2>
                <p className="text-slate-600 font-medium">Fill in your property information</p>
              </div>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Property Address</label>
                <input
                  type="text"
                  placeholder="123 Example Street"
                  className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                  <input
                    type="text"
                    placeholder="London"
                    className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Postcode</label>
                  <input
                    type="text"
                    placeholder="W1A 1AA"
                    className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Property Type</label>
                <select className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium">
                  <option>Select type...</option>
                  <option>Detached House</option>
                  <option>Semi-Detached House</option>
                  <option>Terraced House</option>
                  <option>Flat/Apartment</option>
                  <option>Bungalow</option>
                  <option>Land</option>
                </select>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Bedrooms</label>
                  <select className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Bathrooms</label>
                  <select className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Square Feet</label>
                  <input
                    type="number"
                    placeholder="2000"
                    className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Your Email</label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="+44 7xxx xxx xxx"
                  className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-orange-500/50 transition-all hover:scale-105 flex items-center justify-center gap-3"
              >
                <Calculator className="size-6" />
                Get My Free Valuation
              </button>

              <p className="text-sm text-slate-500 text-center font-medium">
                By submitting, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          </div>

          {/* Benefits */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
              <h3 className="text-3xl font-black text-slate-900 mb-6">What You'll Get</h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl">
                      <div className="size-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Icon className="size-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900 mb-1">{benefit.title}</h4>
                        <p className="text-slate-600 font-medium">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-3xl p-8 shadow-xl text-white">
              <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                <Sparkles className="size-7 text-white" />
              </div>
              <h3 className="text-3xl font-black mb-4">Limited Time Offer!</h3>
              <p className="text-xl font-medium mb-6">
                Get a FREE expert consultation worth £299 with your valuation report
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <CheckCircle className="size-5 flex-shrink-0" />
                  <span className="font-medium">30-minute video call with an expert</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="size-5 flex-shrink-0" />
                  <span className="font-medium">Personalized selling strategy</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="size-5 flex-shrink-0" />
                  <span className="font-medium">Market positioning advice</span>
                </li>
              </ul>
              <div className="px-4 py-3 bg-white/20 backdrop-blur-md rounded-2xl text-center">
                <p className="text-sm font-bold">⏰ Offer ends in 3 days</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
              <h3 className="text-2xl font-black text-slate-900 mb-6">Need Help?</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Phone className="size-5 text-white" />
                    </div>
                    <span className="font-bold text-slate-900">Call us: 0800 123 4567</span>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                      <MapPin className="size-5 text-white" />
                    </div>
                    <span className="font-bold text-slate-900">Book Office Visit</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border-2 border-white/60">
          <h2 className="text-4xl font-black text-slate-900 mb-8 text-center">
            Trusted by Thousands
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                15,234
              </div>
              <p className="text-slate-600 font-bold">Valuations Completed</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                98%
              </div>
              <p className="text-slate-600 font-bold">Accuracy Rate</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                4.9/5
              </div>
              <p className="text-slate-600 font-bold">Customer Rating</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
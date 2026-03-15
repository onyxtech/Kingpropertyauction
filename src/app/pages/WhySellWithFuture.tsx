import { ThumbsUp, TrendingUp, Award, Users, Sparkles, CheckCircle, Clock, Target, Zap, DollarSign, Shield } from "lucide-react";
import Header from "../components/Header";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function WhySellWithFuture() {
  const benefits = [
    { title: "Maximum Price", desc: "Achieve 95-100% market value", icon: TrendingUp, gradient: "from-purple-500 to-pink-600", stat: "98%" },
    { title: "Fast Sale", desc: "Complete in 28 days guaranteed", icon: Clock, gradient: "from-blue-500 to-indigo-600", stat: "28 Days" },
    { title: "No Sale No Fee", desc: "Zero risk to you", icon: ThumbsUp, gradient: "from-emerald-500 to-teal-600", stat: "£0" },
    { title: "Expert Marketing", desc: "Reach thousands of buyers", icon: Users, gradient: "from-orange-500 to-amber-600", stat: "25K+" }
  ];

  const advantages = [
    {
      title: "Competitive Bidding Environment",
      desc: "Create competition among buyers to drive up the final price and achieve the best possible value for your property.",
      icon: Target
    },
    {
      title: "Guaranteed Sale Date",
      desc: "Know exactly when your property will sell with a fixed auction date, eliminating uncertainty and failed sales.",
      icon: Clock
    },
    {
      title: "Professional Marketing",
      desc: "Comprehensive marketing campaign including online listings, social media, email alerts to 25,000+ registered bidders.",
      icon: Zap
    },
    {
      title: "Legal Certainty",
      desc: "Binding contracts on auction day mean no gazumping, no chain delays, and guaranteed completion in 28 days.",
      icon: Shield
    },
    {
      title: "Expert Valuation",
      desc: "Free professional valuation from our experienced team with deep knowledge of auction market dynamics.",
      icon: Award
    },
    {
      title: "Transparent Process",
      desc: "Clear, straightforward fees with no hidden charges. You'll know exactly what you'll receive on completion.",
      icon: CheckCircle
    }
  ];

  const testimonials = [
    {
      name: "Robert Williams",
      property: "4-Bed Semi-Detached, Richmond",
      achieved: "£825,000",
      quote: "Sold for £25,000 over our guide price! The auction created real competition and we completed in 28 days exactly.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
    },
    {
      name: "Lisa Anderson",
      property: "2-Bed Flat, Canary Wharf",
      achieved: "£485,000",
      quote: "After 6 months on the market with no offers, we sold at auction in 3 weeks. Fantastic service!",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400"
    },
    {
      name: "Michael Brown",
      property: "Commercial Unit, Manchester",
      achieved: "£1.2M",
      quote: "The team's expertise in commercial property auctions was outstanding. Highly recommended!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
    }
  ];

  const process = [
    { step: "1", title: "Free Valuation", desc: "Get expert valuation & auction advice" },
    { step: "2", title: "Agreement", desc: "Sign simple terms & conditions" },
    { step: "3", title: "Marketing", desc: "Professional photography & advertising" },
    { step: "4", title: "Auction Day", desc: "Property goes under the hammer" },
    { step: "5", title: "Completion", desc: "Receive funds within 28 days" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-gradient-to-br from-rose-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
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
              <span className="text-sm font-bold text-white">💼 No Sale No Fee • 28 Days • Maximum Price</span>
            </div>
            
            <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Why Sell With Us?
              <br />
              <span className="text-yellow-300">Outstanding Results Guaranteed</span>
            </h1>
            
            <p className="text-2xl text-white/90 mb-10 font-medium">
              Join thousands of satisfied sellers who achieved exceptional prices
              <br />
              <span className="text-yellow-200">✨ Fast, certain, and profitable</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Key Benefits */}
        <div className="mb-16">
          <h2 className="text-5xl font-black text-slate-900 mb-12 text-center">Why Choose Auction?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
                  <div className={`size-14 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="size-7 text-white" />
                  </div>
                  <div className={`text-4xl font-black mb-3 bg-gradient-to-r ${benefit.gradient} bg-clip-text text-transparent`}>
                    {benefit.stat}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3">{benefit.title}</h3>
                  <p className="text-slate-600 font-medium">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Advantages */}
        <div className="mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">
            The Auction Advantage
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
                  <div className="size-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 shadow-lg">
                    <Icon className="size-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">{adv.title}</h3>
                  <p className="text-slate-600 font-medium">{adv.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Process */}
        <div className="mb-16 bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border-2 border-white/60">
          <h2 className="text-4xl font-black text-slate-900 mb-8 text-center">
            Simple 5-Step Process
          </h2>
          <div className="grid md:grid-cols-5 gap-6">
            {process.map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="size-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-3xl font-black text-white mx-auto mb-4 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4 text-center">
            Seller Success Stories
          </h2>
          <p className="text-xl text-slate-600 font-medium text-center mb-12">
            Real sellers, real results
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((test, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
                <div className="relative h-48">
                  <img src={test.image} alt={test.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-bold text-sm shadow-xl">
                    Sold: {test.achieved}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-slate-700 font-medium mb-4 italic">"{test.quote}"</p>
                  <div className="border-t-2 border-slate-100 pt-4">
                    <p className="font-black text-slate-900">{test.name}</p>
                    <p className="text-sm text-slate-600 font-medium">{test.property}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16 bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border-2 border-white/60">
          <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">
            Our Track Record
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                3,456
              </div>
              <p className="text-slate-600 font-bold">Properties Sold</p>
            </div>
            <div>
              <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                £1.8B
              </div>
              <p className="text-slate-600 font-bold">Total Value</p>
            </div>
            <div>
              <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                98%
              </div>
              <p className="text-slate-600 font-bold">Success Rate</p>
            </div>
            <div>
              <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                4.9/5
              </div>
              <p className="text-slate-600 font-bold">Seller Rating</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600 rounded-3xl p-12 shadow-xl text-white text-center">
          <h2 className="text-4xl font-black mb-6">Ready to Sell?</h2>
          <p className="text-2xl font-medium mb-10">
            Get your free valuation and discover what your property could achieve at auction
          </p>
          <div className="flex items-center gap-4 justify-center">
            <button className="px-10 py-5 bg-white text-purple-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              Get Free Valuation
            </button>
            <button className="px-10 py-5 bg-white/20 backdrop-blur-md border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/30 transition-all">
              Call 0800 123 4567
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

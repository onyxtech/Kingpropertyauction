import { CheckCircle, BookOpen, FileText, Shield, Users, TrendingUp, Clock, Award, Home, DollarSign, Scale, Lightbulb, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function BuyingGuide() {
  const navigate = useNavigate();

  const guides = [
    { 
      title: "Understanding Auctions", 
      icon: Home,
      gradient: "from-blue-500 to-indigo-600",
      sections: [
        "How property auctions work",
        "Types of auction formats",
        "Online vs traditional auctions",
        "Bidding strategies and psychology",
        "Reserve prices explained",
        "Auction day procedures"
      ] 
    },
    { 
      title: "Legal Pack Review", 
      icon: Shield,
      gradient: "from-purple-500 to-pink-600",
      sections: [
        "What's included in legal packs",
        "Key documents to review",
        "Title deeds and ownership",
        "Local authority searches",
        "Red flags to watch for",
        "When to instruct a solicitor"
      ] 
    },
    { 
      title: "Financing Your Purchase", 
      icon: DollarSign,
      gradient: "from-emerald-500 to-teal-600",
      sections: [
        "Mortgage options for auctions",
        "Bridging loan solutions",
        "Cash purchase requirements",
        "Deposit requirements (10-25%)",
        "Proof of funds needed",
        "Fast-track finance approval"
      ] 
    },
    { 
      title: "After The Auction", 
      icon: CheckCircle,
      gradient: "from-orange-500 to-amber-600",
      sections: [
        "Exchange of contracts process",
        "28-day completion timeline",
        "Legal completion steps",
        "Property handover procedure",
        "Insurance requirements",
        "Moving in checklist"
      ] 
    }
  ];

  const topTips = [
    "Always view the property before bidding",
    "Read the legal pack thoroughly",
    "Set a maximum bid and stick to it",
    "Have your finance arranged in advance",
    "Register to bid at least 24hrs before",
    "Bring proof of ID and deposit funds"
  ];

  const commonMistakes = [
    "Not reading the legal pack",
    "Bidding without viewing the property",
    "No finance arranged beforehand",
    "Ignoring completion deadlines",
    "Not having a solicitor ready",
    "Underestimating renovation costs"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-95" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 size-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 size-96 bg-cyan-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
              <Award className="size-4 text-yellow-300 animate-pulse" />
              <span className="text-sm font-bold text-white">📖 Complete Guide • Step-by-Step • Expert Tips</span>
            </div>
            
            <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Buying Guide
              <br />
              <span className="text-cyan-300">Everything You Need To Know</span>
            </h1>
            
            <p className="text-2xl text-white/90 font-medium">
              Your comprehensive guide to buying property at auction
              <br />
              <span className="text-yellow-200">✨ From first viewing to completion</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Guide Sections */}
        <div className="mb-16">
          <h2 className="text-5xl font-black text-slate-900 mb-4 text-center">Step-by-Step Guide</h2>
          <p className="text-xl text-slate-600 font-medium text-center mb-12">
            Master every aspect of auction buying
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {guides.map((guide, idx) => {
              const Icon = guide.icon;
              return (
                <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
                  <div className={`size-14 rounded-2xl bg-gradient-to-br ${guide.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="size-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-6">{guide.title}</h3>
                  <ul className="space-y-3">
                    {guide.sections.map((section, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700 font-medium p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-all">
                        <CheckCircle className={`size-5 flex-shrink-0 mt-0.5 bg-gradient-to-r ${guide.gradient} bg-clip-text text-transparent`} />
                        <span>{section}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tips & Mistakes */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Top Tips */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border-2 border-white/60">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <Lightbulb className="size-7 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900">Top Tips</h3>
                <p className="text-slate-600 font-medium">Expert advice for success</p>
              </div>
            </div>
            <ul className="space-y-4">
              {topTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl">
                  <CheckCircle className="size-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Mistakes */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border-2 border-white/60">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                <AlertCircle className="size-7 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900">Avoid These Mistakes</h3>
                <p className="text-slate-600 font-medium">Common pitfalls to watch for</p>
              </div>
            </div>
            <ul className="space-y-4">
              {commonMistakes.map((mistake, idx) => (
                <li key={idx} className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl">
                  <AlertCircle className="size-6 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border-2 border-white/60 mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-8 text-center">
            Typical Auction Timeline
          </h2>
          <div className="grid md:grid-cols-6 gap-4">
            {[
              { day: "Day 1-7", title: "Research", desc: "Browse properties & legal packs" },
              { day: "Day 8-14", title: "Viewings", desc: "Attend property viewings" },
              { day: "Day 15-20", title: "Finance", desc: "Arrange mortgage/bridging loan" },
              { day: "Day 21", title: "Register", desc: "Register to bid (ID + deposit)" },
              { day: "Day 22", title: "Auction", desc: "Bid & win your property" },
              { day: "Day 23-50", title: "Complete", desc: "Exchange & complete (28 days)" }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="size-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black mx-auto mb-4 shadow-lg">
                  {idx + 1}
                </div>
                <p className="text-sm font-black text-purple-600 mb-2">{item.day}</p>
                <h3 className="text-lg font-black text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-600 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 rounded-3xl p-12 shadow-xl text-white text-center">
          <h2 className="text-4xl font-black mb-6">Ready to Start Buying?</h2>
          <p className="text-2xl font-medium mb-10">
            Browse our live auctions and find your perfect property today
          </p>
          <div className="flex items-center gap-4 justify-center">
            <button className="px-10 py-5 bg-white text-purple-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105" onClick={() => navigate('/auctions')}>
              View Auctions
            </button>
            <button className="px-10 py-5 bg-white/20 backdrop-blur-md border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/30 transition-all">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
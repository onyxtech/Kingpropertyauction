import { useNavigate } from "react-router";
import {
  Building2,
  BookOpen,
  CheckCircle,
  FileText,
  Users,
  Gavel,
  Shield,
  Clock,
  TrendingUp,
  AlertCircle,
  Download,
} from "lucide-react";

export default function AuctionGuide() {
  const navigate = useNavigate();

  const steps = [
    {
      title: "Registration & Verification",
      icon: Users,
      description: "Create your account and complete identity verification to participate in auctions.",
      details: [
        "Provide basic personal information",
        "Upload identity documents (passport, driver's license)",
        "Verify your email and phone number",
        "Set up payment methods",
      ],
    },
    {
      title: "Research & Due Diligence",
      icon: BookOpen,
      description: "Thoroughly research properties before bidding to make informed decisions.",
      details: [
        "Review property details and legal packs",
        "Arrange property viewings",
        "Get professional surveys conducted",
        "Check local area and market values",
      ],
    },
    {
      title: "Bidding Strategy",
      icon: Gavel,
      description: "Plan your bidding approach and set maximum limits before the auction.",
      details: [
        "Set your maximum bid amount",
        "Arrange finance in advance",
        "Understand buyer's premium and fees",
        "Practice with our demo auctions",
      ],
    },
    {
      title: "Live Auction",
      icon: Clock,
      description: "Participate in real-time bidding and compete with other buyers.",
      details: [
        "Join the auction room 15 minutes early",
        "Monitor bidding activity in real-time",
        "Place bids confidently",
        "Watch for reserve price indicators",
      ],
    },
    {
      title: "Winning & Completion",
      icon: CheckCircle,
      description: "Complete your purchase and finalize the legal transfer of property.",
      details: [
        "Sign contracts immediately upon winning",
        "Pay deposit (typically 10%)",
        "Complete within 28 days (standard)",
        "Work with solicitors for legal transfer",
      ],
    },
  ];

  const faqs = [
    {
      question: "What is a reserve price?",
      answer: "The reserve price is the minimum price a seller is willing to accept. If bidding doesn't reach this amount, the property may not be sold.",
    },
    {
      question: "Do I need to pay a buyer's premium?",
      answer: "Yes, most auctions charge a buyer's premium (typically 1-3% + VAT) on top of the hammer price. This is clearly stated in the auction terms.",
    },
    {
      question: "Can I bid online and in-room?",
      answer: "Yes, you can bid online, by telephone, or attend in person. Online bidding happens in real-time alongside room bidding.",
    },
    {
      question: "What happens if I win?",
      answer: "You'll sign a contract immediately and pay a deposit (usually 10%). You must then complete the purchase within the specified timeframe (typically 28 days).",
    },
    {
      question: "Can I back out after winning?",
      answer: "No, auction purchases are legally binding. If you don't complete, you'll lose your deposit and may be liable for additional costs.",
    },
    {
      question: "How do I arrange finance?",
      answer: "You should arrange finance BEFORE the auction. We recommend getting a mortgage agreement in principle and having funds ready for the deposit.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-8">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-3 group"
              >
                <div className="size-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <Building2 className="size-5 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="font-semibold text-slate-900">King Property Auction</h1>
                  <p className="text-xs text-slate-500">Live Auction Platform</p>
                </div>
              </button>

              <nav className="hidden md:flex items-center gap-6">
                <button 
                  onClick={() => navigate("/auctions")}
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  Auctions
                </button>
                <button 
                  onClick={() => navigate("/auction-guide")}
                  className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1"
                >
                  Auction Guide
                </button>
                <button 
                  onClick={() => navigate("/buying")}
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  Buying
                </button>
                <button 
                  onClick={() => navigate("/selling")}
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  Selling
                </button>
                <button 
                  onClick={() => navigate("/commercial")}
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  Commercial
                </button>
                <button 
                  onClick={() => navigate("/online")}
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  Online
                </button>
                <button 
                  onClick={() => navigate("/about")}
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  About
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/register")}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-shadow"
              >
                Register / Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <BookOpen className="size-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Auction Guide</h1>
            <p className="text-xl text-blue-100">
              Everything you need to know about buying property at auction.
              <br />
              From registration to completion, we'll guide you through every step.
            </p>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="container mx-auto px-6 -mt-8">
        <div className="max-w-4xl mx-auto bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
          <div className="flex gap-4">
            <AlertCircle className="size-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">
                Important: Auctions are Legally Binding
              </h3>
              <p className="text-amber-800">
                When the hammer falls (or your online bid is accepted), you have entered into a legally
                binding contract to purchase the property. Make sure you have arranged finance and
                completed all due diligence before bidding.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Guide */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Your Step-by-Step Auction Journey
          </h2>

          <div className="space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="size-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                        <Icon className="size-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                          Step {index + 1}
                        </span>
                        <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
                      </div>
                      <p className="text-slate-600 mb-4">{step.description}</p>
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Key Information */}
      <div className="bg-slate-100 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
              Key Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 text-center">
                <Shield className="size-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold text-slate-900 mb-2">Legal Pack</h3>
                <p className="text-sm text-slate-600">
                  Review all legal documents at least 7 days before auction
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center">
                <TrendingUp className="size-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold text-slate-900 mb-2">Finance</h3>
                <p className="text-sm text-slate-600">
                  Arrange mortgage agreement in principle before bidding
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center">
                <FileText className="size-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold text-slate-900 mb-2">Deposit</h3>
                <p className="text-sm text-slate-600">
                  Have 10% deposit ready plus buyer's premium
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
              >
                <h3 className="font-semibold text-slate-900 mb-3 flex items-start gap-3">
                  <span className="text-blue-600">Q:</span>
                  {faq.question}
                </h3>
                <p className="text-slate-600 pl-7">
                  <span className="font-semibold text-slate-700">A:</span> {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
              Download Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Download className="size-10 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Buyer's Guide PDF</h3>
                    <p className="text-sm text-slate-600">Complete auction handbook</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                  Download
                </button>
              </div>
              <div className="bg-white rounded-xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Download className="size-10 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Checklist</h3>
                    <p className="text-sm text-slate-600">Pre-auction checklist</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Bidding?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Register now to participate in live property auctions
          </p>
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transition-shadow"
            >
              Create Account
            </button>
            <button 
              onClick={() => navigate("/auctions")}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              Browse Auctions
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
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
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Clock,
  Globe,
  Shield,
  Users,
  TrendingUp,
  Zap,
  CheckCircle,
  Video,
  FileText,
  Calculator,
  Heart,
  Bell,
  Search,
  Smartphone,
  MessageCircle,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Online() {
  const navigate = useNavigate();

  const onlineFeatures = [
    {
      icon: Clock,
      title: "24/7 Bidding",
      description: "Participate in auctions anytime, from anywhere",
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Connect with buyers and sellers worldwide",
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      description: "Full functionality on all devices",
    },
    {
      icon: Bell,
      title: "Real-Time Alerts",
      description: "Instant notifications for bid updates",
    },
    {
      icon: Video,
      title: "Virtual Tours",
      description: "Explore properties with 360° tours",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Bank-level security and encryption",
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Register Online",
      description: "Create your account in minutes with digital verification",
      icon: Users,
    },
    {
      step: 2,
      title: "Browse & Research",
      description: "View properties with virtual tours and detailed documentation",
      icon: Globe,
    },
    {
      step: 3,
      title: "Place Your Bid",
      description: "Bid in real-time from your computer, tablet, or phone",
      icon: Zap,
    },
    {
      step: 4,
      title: "Win & Complete",
      description: "Secure your property with instant confirmation",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <div className="size-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm">Live Now • 24 Active Auctions</span>
              </div>
              <h1 className="text-5xl font-bold mb-6">Online Property Auctions</h1>
              <p className="text-xl text-blue-100 mb-8">
                Buy property from the comfort of your home. Bid online 24/7, watch live
                auctions, and secure your next investment with ease.
              </p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate("/live-auctions")}
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transition-shadow"
                >
                  Join Live Auction
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-colors">
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758272423130-5bbccae36b11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBvbmxpbmUlMjBzaG9wcGluZyUyMGRpZ2l0YWx8ZW58MXx8fHwxNzcxNDQzMjUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Online bidding"
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-sm text-slate-600">Online Availability</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-sm text-slate-600">Countries Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">£1.8B</div>
              <div className="text-sm text-slate-600">Online Sales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-sm text-slate-600">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Online Auction Features</h2>
          <p className="text-xl text-slate-600">
            Everything you need to bid successfully from anywhere
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {onlineFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="size-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="size-7 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-slate-100 to-slate-50 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How Online Bidding Works</h2>
            <p className="text-xl text-slate-600">
              Simple steps to start bidding online today
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="text-center">
                  <div className="size-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="size-10 text-white" />
                  </div>
                  <div className="inline-flex items-center justify-center px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4">
                    Step {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Advantages */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Bid Online?
            </h2>
            <p className="text-xl text-slate-600">
              Experience the convenience and flexibility of online property auctions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <CheckCircle className="size-10 text-green-500 mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                Bid From Anywhere
              </h3>
              <p className="text-slate-600">
                No need to attend in person. Bid from home, office, or on the go
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <CheckCircle className="size-10 text-green-500 mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                Save Time
              </h3>
              <p className="text-slate-600">
                No travel required. Participate in multiple auctions in one day
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <CheckCircle className="size-10 text-green-500 mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                Full Transparency
              </h3>
              <p className="text-slate-600">
                See all bids in real-time with complete auction transparency
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <CheckCircle className="size-10 text-green-500 mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                Instant Confirmation
              </h3>
              <p className="text-slate-600">
                Get immediate confirmation when you win with digital contracts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Preview */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Advanced Bidding Platform
              </h2>
              <p className="text-xl text-slate-600">
                Professional tools for serious property investors
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 text-center">
                <TrendingUp className="size-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">Live Market Data</h3>
                <p className="text-sm text-slate-600">
                  Real-time pricing and bidding analytics
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center">
                <MessageSquare className="size-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">Live Support</h3>
                <p className="text-sm text-slate-600">
                  Chat with our team during auctions
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center">
                <Bell className="size-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">Smart Alerts</h3>
                <p className="text-sm text-slate-600">
                  Custom notifications for properties you follow
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Bidding Online?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of buyers already bidding on our platform
          </p>
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transition-shadow"
            >
              Create Free Account
            </button>
            <button 
              onClick={() => navigate("/live-auctions")}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              View Live Auctions
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
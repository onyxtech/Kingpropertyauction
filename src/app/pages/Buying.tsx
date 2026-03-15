import { useState } from "react";
import { useNavigate } from "react-router";
import {
  TrendingUp,
  Shield,
  Clock,
  Users,
  CheckCircle,
  FileText,
  Calculator,
  Home,
  ArrowRight,
  Search,
  Heart,
  MapPin,
  Bed,
  Bath,
  Maximize,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Buying() {
  const navigate = useNavigate();

  const buyingSteps = [
    {
      step: 1,
      title: "Get Your Finances in Order",
      icon: Calculator,
      description: "Understand your budget and get pre-approved for a mortgage",
    },
    {
      step: 2,
      title: "Start Your Property Search",
      icon: Search,
      description: "Browse listings and shortlist properties that meet your criteria",
    },
    {
      step: 3,
      title: "View Properties",
      icon: Home,
      description: "Arrange viewings and inspect properties in person or virtually",
    },
    {
      step: 4,
      title: "Make an Offer",
      icon: FileText,
      description: "Submit your offer and negotiate terms with the seller",
    },
    {
      step: 5,
      title: "Complete Legal Work",
      icon: Shield,
      description: "Hire a solicitor and complete all legal checks and surveys",
    },
    {
      step: 6,
      title: "Exchange & Complete",
      icon: CheckCircle,
      description: "Sign contracts, transfer funds, and receive your keys",
    },
  ];

  const services = [
    {
      title: "Mortgage Calculator",
      description: "Calculate your monthly payments and affordability",
      icon: Calculator,
      color: "from-blue-600 to-cyan-600",
    },
    {
      title: "Virtual Tours",
      description: "Explore properties with immersive 360° tours",
      icon: Video,
      color: "from-purple-600 to-pink-600",
    },
    {
      title: "AI Valuation",
      description: "Get instant property valuations powered by AI",
      icon: TrendingUp,
      color: "from-emerald-600 to-teal-600",
    },
    {
      title: "Legal Support",
      description: "Connect with trusted solicitors and conveyancers",
      icon: Shield,
      color: "from-orange-600 to-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">Find Your Dream Home</h1>
              <p className="text-xl text-blue-100 mb-8">
                Browse thousands of properties, get instant valuations, and secure your
                perfect home with our comprehensive buying tools and expert support.
              </p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate("/website")}
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transition-shadow"
                >
                  Search Properties
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-colors">
                  Calculate Mortgage
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1606932250069-62f395a08602?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBoYXBweSUyMG5ldyUyMGhvbWV8ZW58MXx8fHwxNzcxNDQzMjEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Happy family in new home"
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
              <div className="text-3xl font-bold text-blue-600 mb-2">15,247</div>
              <div className="text-sm text-slate-600">Properties Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">£450K</div>
              <div className="text-sm text-slate-600">Average Price</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">14 Days</div>
              <div className="text-sm text-slate-600">Average Time to Sale</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">98.5%</div>
              <div className="text-sm text-slate-600">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Buying Process */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Your Buying Journey</h2>
          <p className="text-xl text-slate-600">
            We'll guide you through every step of the property buying process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {buyingSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="size-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="size-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-blue-600 mb-1">
                      Step {step.step}
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-slate-600">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Services */}
      <div className="bg-gradient-to-br from-slate-100 to-slate-50 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Buying Services</h2>
            <p className="text-xl text-slate-600">
              Everything you need to make an informed purchase decision
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow text-center"
                >
                  <div
                    className={`size-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className="size-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-slate-600">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1594611342013-27c44e25625f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwYWdlbnQlMjBoYW5kc2hha2V8ZW58MXx8fHwxNzcxNDQzMjEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Professional real estate service"
              className="w-full h-96 object-cover"
            />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Why Buy With King Property Auction?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <CheckCircle className="size-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Largest Property Selection
                  </h3>
                  <p className="text-slate-600">
                    Access to over 15,000 properties from major portals in one place
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="size-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">AI-Powered Insights</h3>
                  <p className="text-slate-600">
                    Get instant valuations, market analysis, and price predictions
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="size-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Virtual Tours</h3>
                  <p className="text-slate-600">
                    View properties remotely with 360° virtual tours and AR features
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="size-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Expert Support</h3>
                  <p className="text-slate-600">
                    Dedicated support team to guide you through the entire process
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="size-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Secure Transactions</h3>
                  <p className="text-slate-600">
                    Protected payments and secure escrow services for peace of mind
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Find Your Home?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your property search today with access to thousands of listings
          </p>
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={() => navigate("/website")}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transition-shadow"
            >
              Browse Properties
            </button>
            <button 
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
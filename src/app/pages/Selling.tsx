import { useState } from "react";
import { useNavigate } from "react-router";
import {
  TrendingUp,
  Users,
  Clock,
  Shield,
  CheckCircle,
  Star,
  Camera,
  FileText,
  Calculator,
  Home,
  ArrowRight,
  Award,
  DollarSign,
  Target,
  Zap,
  Building2,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Selling() {
  const navigate = useNavigate();

  const sellingBenefits = [
    {
      icon: TrendingUp,
      title: "Maximum Exposure",
      description: "Reach millions of potential buyers across multiple platforms",
    },
    {
      icon: DollarSign,
      title: "Best Price Achieved",
      description: "Competitive bidding drives up property values",
    },
    {
      icon: Clock,
      title: "Quick Sale",
      description: "Complete your sale in as little as 28 days",
    },
    {
      icon: Shield,
      title: "Guaranteed Sale",
      description: "Legal commitment from winning bidder on auction day",
    },
    {
      icon: Camera,
      title: "Professional Marketing",
      description: "Photography, virtual tours, and premium listings",
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Dedicated team guiding you through the process",
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Free Valuation",
      description: "Get an accurate market valuation from our experts",
      icon: DollarSign,
    },
    {
      step: 2,
      title: "Marketing Launch",
      description: "Professional photography and multi-platform promotion",
      icon: Camera,
    },
    {
      step: 3,
      title: "Auction Day",
      description: "Your property goes under the hammer with live bidding",
      icon: Zap,
    },
    {
      step: 4,
      title: "Sale Complete",
      description: "Exchange contracts and receive your funds quickly",
      icon: CheckCircle,
    },
  ];

  const propertyTypes = [
    { type: "Residential", description: "Houses, flats, and apartments" },
    { type: "Commercial", description: "Retail, office, and industrial" },
    { type: "Land", description: "Development sites and plots" },
    { type: "Investment", description: "Buy-to-let and portfolios" },
    { type: "Unique", description: "Churches, barns, and special properties" },
    { type: "Probate", description: "Estate sales and inheritances" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <Award className="size-4" />
                <span className="text-sm">Award-Winning Service</span>
              </div>
              <h1 className="text-5xl font-bold mb-6">Sell Your Property at Auction</h1>
              <p className="text-xl text-blue-100 mb-8">
                Achieve the best price for your property with our proven auction method.
                Fast, transparent, and guaranteed results.
              </p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate("/free-valuation")}
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transition-shadow"
                >
                  Get Free Valuation
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMGZvciUyMHNhbGV8ZW58MXx8fHwxNzcxNDQzMjUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Property for sale"
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
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-sm text-slate-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">28 Days</div>
              <div className="text-sm text-slate-600">Average Sale Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">£2.4B</div>
              <div className="text-sm text-slate-600">Properties Sold</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">25,000+</div>
              <div className="text-sm text-slate-600">Happy Sellers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Sell at Auction?</h2>
          <p className="text-xl text-slate-600">
            The auction method offers unmatched advantages for property sellers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {sellingBenefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="size-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="size-7 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">{benefit.title}</h3>
                <p className="text-slate-600">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-slate-100 to-slate-50 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600">
              A simple, transparent process from valuation to sale
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

      {/* Property Types */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              What Can You Sell?
            </h2>
            <p className="text-xl text-slate-600">
              We handle all property types through our specialized auction service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {propertyTypes.map((property) => (
              <div
                key={property.type}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow"
              >
                <Building2 className="size-10 text-blue-600 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                  {property.type}
                </h3>
                <p className="text-slate-600 text-sm">{property.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fees Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Transparent Pricing
              </h2>
              <p className="text-xl text-slate-600">
                No hidden fees. Pay only when we sell your property.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-slate-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600 mb-2">2.5%</div>
                <div className="text-sm text-slate-600 mb-2">Commission</div>
                <div className="text-xs text-slate-500">+ VAT on sold price</div>
              </div>
              <div className="text-center p-6 bg-slate-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600 mb-2">£0</div>
                <div className="text-sm text-slate-600 mb-2">Upfront Costs</div>
                <div className="text-xs text-slate-500">No entry fees</div>
              </div>
              <div className="text-center p-6 bg-slate-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600 mb-2">£0</div>
                <div className="text-sm text-slate-600 mb-2">If Not Sold</div>
                <div className="text-xs text-slate-500">No sale, no fee</div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-xl">
              <div className="flex items-start gap-3">
                <CheckCircle className="size-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">
                    All Marketing Included
                  </h4>
                  <p className="text-sm text-slate-600">
                    Professional photography, virtual tours, online and print advertising,
                    legal pack preparation, and dedicated account management all included
                    in our commission.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Sell Your Property?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Get your free valuation today and discover how much your property could sell for
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button 
              onClick={() => navigate("/add-property")}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105"
            >
              Add Property Now
            </button>
            <button 
              onClick={() => navigate("/free-valuation")}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transition-shadow"
            >
              Get Free Valuation
            </button>
            <button 
              onClick={() => navigate("/contact-us")}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              Speak to an Expert
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
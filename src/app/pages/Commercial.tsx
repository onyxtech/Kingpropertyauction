import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Building,
  Store,
  Warehouse,
  Factory,
  Hotel,
  ShoppingBag,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  MapPin,
  DollarSign,
  BarChart,
  Target,
  Shield,
  Star,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Commercial() {
  const navigate = useNavigate();

  const propertyTypes = [
    {
      icon: Building,
      title: "Office Spaces",
      description: "City center and business park offices",
      count: "1,247",
    },
    {
      icon: Store,
      title: "Retail Units",
      description: "High street shops and shopping centers",
      count: "892",
    },
    {
      icon: Warehouse,
      title: "Industrial",
      description: "Warehouses, factories, and logistics",
      count: "654",
    },
    {
      icon: Hotel,
      title: "Hospitality",
      description: "Hotels, restaurants, and leisure",
      count: "321",
    },
    {
      icon: Factory,
      title: "Mixed Use",
      description: "Commercial and residential combined",
      count: "445",
    },
    {
      icon: Building2,
      title: "Development Land",
      description: "Land with commercial potential",
      count: "198",
    },
  ];

  const services = [
    {
      icon: TrendingUp,
      title: "Investment Analysis",
      description: "Comprehensive ROI and yield calculations",
    },
    {
      icon: FileText,
      title: "Legal Support",
      description: "Commercial property law specialists",
    },
    {
      icon: Users,
      title: "Tenant Sourcing",
      description: "Find quality tenants for your property",
    },
    {
      icon: Shield,
      title: "Due Diligence",
      description: "Thorough property and financial checks",
    },
  ];

  const featuredProperties = [
    {
      id: 1,
      title: "Prime City Office Building",
      location: "Central London",
      price: "£8,500,000",
      type: "Office",
      yield: "6.2%",
      size: "12,500 sq ft",
      tenants: "Fully Let",
      image: "https://images.unsplash.com/photo-1769513389418-13ecbaab55e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBidWlsZGluZyUyMGNvbW1lcmNpYWwlMjBwcm9wZXJ0eXxlbnwxfHx8fDE3NzE0NDMyNTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 2,
      title: "Retail Park Portfolio",
      location: "Manchester",
      price: "£4,200,000",
      type: "Retail",
      yield: "7.5%",
      size: "25,000 sq ft",
      tenants: "5 Units",
      image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRhaWwlMjBzaG9wJTIwc3RvcmV8ZW58MXx8fHwxNzcxNDQzMjUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 3,
      title: "Modern Logistics Center",
      location: "Birmingham",
      price: "£6,750,000",
      type: "Industrial",
      yield: "8.1%",
      size: "45,000 sq ft",
      tenants: "Long Lease",
      image: "https://images.unsplash.com/photo-1553413077-190dd305871c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBsb2dpc3RpY3N8ZW58MXx8fHwxNzcxNDQzMjUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-6">Commercial Property</h1>
            <p className="text-xl text-blue-100 mb-8">
              Discover prime commercial real estate opportunities. From office buildings
              to retail spaces, find your next investment with comprehensive market data
              and expert support.
            </p>
            <div className="flex items-center gap-4">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transition-shadow">
                Browse Properties
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-colors">
                Investment Calculator
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">3,757</div>
              <div className="text-sm text-slate-600">Commercial Properties</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">£1.2B</div>
              <div className="text-sm text-slate-600">Total Portfolio Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">7.2%</div>
              <div className="text-sm text-slate-600">Average Yield</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">2,500+</div>
              <div className="text-sm text-slate-600">Active Investors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Types */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Property Types</h2>
          <p className="text-xl text-slate-600">
            Explore our diverse range of commercial properties
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {propertyTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div
                key={type.title}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="size-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="size-7 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">{type.title}</h3>
                <p className="text-slate-600 text-sm mb-3">{type.description}</p>
                <div className="text-blue-600 font-semibold">{type.count} Available</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Properties */}
      <div className="bg-slate-100 py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Featured Properties</h2>
              <p className="text-xl text-slate-600">Prime investment opportunities</p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow">
              View All Properties
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map((property, idx) => (
              <div
                key={property.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="relative h-56">
                  <ImageWithFallback
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                    {property.type}
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                    {property.yield} Yield
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                    <Building2 className="size-4" />
                    <span>{property.location}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <div className="text-slate-600">Size</div>
                      <div className="font-semibold text-slate-900">{property.size}</div>
                    </div>
                    <div>
                      <div className="text-slate-600">Status</div>
                      <div className="font-semibold text-slate-900">{property.tenants}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div>
                      <div className="text-sm text-slate-600">Price</div>
                      <div className="text-2xl font-bold text-blue-600">{property.price}</div>
                    </div>
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      onClick={() => navigate(`/property-details?id=${idx + 1}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Commercial Services</h2>
          <p className="text-xl text-slate-600">
            Comprehensive support for commercial property investors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center hover:shadow-lg transition-shadow"
              >
                <Icon className="size-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-sm text-slate-600">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Investment Info */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
              Why Invest in Commercial Property?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6">
                <TrendingUp className="size-10 text-blue-600 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">Higher Yields</h3>
                <p className="text-slate-600">
                  Commercial properties typically offer better returns than residential
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <Clock className="size-10 text-blue-600 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">Longer Leases</h3>
                <p className="text-slate-600">
                  Secure income with longer tenant lease agreements
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <Shield className="size-10 text-blue-600 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">Business Tenants</h3>
                <p className="text-slate-600">
                  Professional tenants with established businesses
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <Calculator className="size-10 text-blue-600 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">Tax Benefits</h3>
                <p className="text-slate-600">
                  Various tax advantages and allowances available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Start Your Commercial Investment</h2>
          <p className="text-xl text-blue-100 mb-8">
            Explore opportunities and connect with commercial property experts
          </p>
          <div className="flex items-center justify-center gap-4">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transition-shadow">
              Browse Properties
            </button>
            <button 
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
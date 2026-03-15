import { useNavigate } from "react-router";
import {
  Building2,
  Target,
  Award,
  Users,
  TrendingUp,
  Shield,
  Heart,
  Globe,
  Zap,
  CheckCircle,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "We operate with complete transparency and build lasting trust with every transaction",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Leveraging AI and technology to revolutionize the property auction industry",
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Your success is our success. We're dedicated to exceptional service and support",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connecting buyers and sellers across the UK and internationally",
    },
  ];

  const stats = [
    { value: "£2.4B+", label: "Properties Sold" },
    { value: "50,000+", label: "Happy Customers" },
    { value: "15 Years", label: "Industry Experience" },
    { value: "98.5%", label: "Success Rate" },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
    },
    {
      name: "Emma Williams",
      role: "Head of Auctions",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
    },
    {
      name: "David Thompson",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">About King Property Auction</h1>
            <p className="text-xl text-blue-100 mb-8">
              Transforming the property auction industry with innovative technology,
              transparent processes, and exceptional service since 2011.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6">
              <Target className="size-4" />
              <span className="text-sm font-semibold">Our Mission</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Making Property Auctions Accessible to Everyone
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              We believe that buying and selling property through auctions should be
              simple, transparent, and accessible to everyone. That's why we've built a
              platform that combines the best of traditional property auctions with
              cutting-edge technology.
            </p>
            <p className="text-lg text-slate-600">
              Our mission is to provide a secure, efficient marketplace where buyers find
              their perfect property and sellers achieve the best possible price, all while
              maintaining the highest standards of service and integrity.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1760611656007-f767a8082758?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB0ZWFtJTIwbWVldGluZ3xlbnwxfHx8fDE3NzE0MjExMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Our team"
              className="w-full h-96 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-gradient-to-br from-slate-100 to-slate-50 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-slate-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="size-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="size-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2 text-lg">{value.title}</h3>
                  <p className="text-slate-600 text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* What We Offer */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">What We Offer</h2>
            <p className="text-xl text-slate-600">
              Comprehensive property auction services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <TrendingUp className="size-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">For Buyers</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Access to thousands of properties</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Real-time bidding platform</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">AI-powered valuations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Virtual property tours</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Expert buying support</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <Award className="size-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">For Sellers</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Maximum market exposure</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Professional marketing services</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Guaranteed sale dates</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Competitive commission rates</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Dedicated account management</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership Team */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Leadership Team</h2>
            <p className="text-xl text-slate-600">
              Industry experts dedicated to your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <ImageWithFallback
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-slate-900 text-lg mb-1">{member.name}</h3>
                  <p className="text-slate-600 text-sm">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partnerships */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12">
            <div className="text-center mb-8">
              <Users className="size-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Trusted Partnerships
              </h2>
              <p className="text-lg text-slate-600">
                We work with leading property portals, legal firms, and financial
                institutions to provide you with comprehensive service
              </p>
            </div>
            <div className="grid grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="text-blue-600 font-semibold text-lg mb-1">Rightmove</div>
                <div className="text-sm text-slate-600">Official Partner</div>
              </div>
              <div className="text-center">
                <div className="text-blue-600 font-semibold text-lg mb-1">Zoopla</div>
                <div className="text-sm text-slate-600">Official Partner</div>
              </div>
              <div className="text-center">
                <div className="text-blue-600 font-semibold text-lg mb-1">OnTheMarket</div>
                <div className="text-sm text-slate-600">Official Partner</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Join King Property Auction Today</h2>
          <p className="text-xl text-blue-100 mb-8">
            Experience the future of property auctions
          </p>
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transition-shadow"
            >
              Get Started
            </button>
            <button 
              onClick={() => navigate("/auctions")}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              View Auctions
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
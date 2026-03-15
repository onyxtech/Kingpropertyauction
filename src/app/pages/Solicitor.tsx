import { Briefcase, Scale, FileText, Phone, Sparkles, CheckCircle, Clock, Shield, Award, Users, Mail, MapPin } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Solicitor() {
  const services = [
    {
      title: "Contract Review & Exchange",
      desc: "Thorough review of all contract terms and smooth exchange process",
      icon: FileText,
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      title: "Title Searches & Due Diligence",
      desc: "Complete property searches and legal due diligence checks",
      icon: Scale,
      gradient: "from-purple-500 to-pink-600"
    },
    {
      title: "Completion & Fund Transfer",
      desc: "Secure handling of completion and fund transfer procedures",
      icon: CheckCircle,
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      title: "Land Registry Updates",
      desc: "Registration of your ownership with the Land Registry",
      icon: Shield,
      gradient: "from-orange-500 to-amber-600"
    },
    {
      title: "Mortgage Coordination",
      desc: "Liaison with lenders and mortgage providers throughout",
      icon: Briefcase,
      gradient: "from-rose-500 to-red-600"
    },
    {
      title: "Post-Completion Support",
      desc: "Ongoing support after completion for any queries or issues",
      icon: Users,
      gradient: "from-cyan-500 to-blue-600"
    }
  ];

  const packages = [
    {
      name: "Standard Package",
      price: "£795",
      features: [
        "Contract review",
        "Title searches",
        "Exchange & completion",
        "Land registry registration",
        "Email support",
        "Standard turnaround (28 days)"
      ],
      gradient: "from-blue-500 to-indigo-600",
      popular: false
    },
    {
      name: "Premium Package",
      price: "£1,295",
      features: [
        "Everything in Standard",
        "Priority service",
        "Dedicated solicitor",
        "Phone support 24/7",
        "Fast-track (14 days)",
        "Post-completion support",
        "Free property checks"
      ],
      gradient: "from-purple-500 to-pink-600",
      popular: true
    },
    {
      name: "Commercial Package",
      price: "£2,495",
      features: [
        "Everything in Premium",
        "Commercial property expertise",
        "Complex transaction handling",
        "Tax planning advice",
        "Lease reviews included",
        "Priority fast-track (7 days)",
        "6 months post-completion support"
      ],
      gradient: "from-emerald-500 to-teal-600",
      popular: false
    }
  ];

  const solicitors = [
    {
      name: "Sarah Mitchell",
      role: "Senior Property Solicitor",
      experience: "15+ years",
      specialties: ["Residential", "Auction Properties", "Leasehold"],
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400"
    },
    {
      name: "James Robertson",
      role: "Commercial Property Partner",
      experience: "20+ years",
      specialties: ["Commercial", "Development", "Investment"],
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400"
    },
    {
      name: "Emily Chen",
      role: "Property Solicitor",
      experience: "10+ years",
      specialties: ["Residential", "First-Time Buyers", "Remortgaging"],
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400"
    }
  ];

  const benefits = [
    "Fixed fee pricing - no surprises",
    "Auction property specialists",
    "Fast 28-day completion",
    "Available evenings & weekends",
    "Clear communication throughout",
    "SRA regulated and insured"
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
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 opacity-95" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 size-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 size-96 bg-cyan-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
              <Sparkles className="size-4 text-yellow-300 animate-pulse" />
              <span className="text-sm font-bold text-white">⚖️ SRA Regulated • Fixed Fees • Expert Service</span>
            </div>
            
            <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Legal Services
              <br />
              <span className="text-yellow-300">Expert Property Solicitors</span>
            </h1>
            
            <p className="text-2xl text-white/90 mb-10 font-medium">
              Experienced property lawyers specializing in auction purchases
              <br />
              <span className="text-yellow-200">✨ Fast, efficient, and affordable legal support</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Services */}
        <div className="mb-16">
          <h2 className="text-5xl font-black text-slate-900 mb-4 text-center">Our Legal Services</h2>
          <p className="text-xl text-slate-600 font-medium text-center mb-12">
            Comprehensive legal support for your property purchase
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
                  <div className={`size-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="size-7 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3">{service.title}</h3>
                  <p className="text-slate-600 font-medium">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Packages */}
        <div className="mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">
            Fixed Fee Packages
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg, idx) => (
              <div key={idx} className={`bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 ${pkg.popular ? 'border-purple-500 scale-105' : 'border-white/60'} hover:shadow-2xl transition-all hover:scale-110 relative`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full font-bold text-sm shadow-xl">
                    Most Popular
                  </div>
                )}
                <div className={`size-14 rounded-2xl bg-gradient-to-br ${pkg.gradient} flex items-center justify-center mb-6 shadow-lg mx-auto`}>
                  <Briefcase className="size-7 text-white" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 text-center">{pkg.name}</h3>
                <div className="text-center mb-6">
                  <p className={`text-5xl font-black mb-2 bg-gradient-to-r ${pkg.gradient} bg-clip-text text-transparent`}>
                    {pkg.price}
                  </p>
                  <p className="text-slate-600 font-medium">+ VAT & Disbursements</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="size-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 bg-gradient-to-r ${pkg.gradient} text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105`}>
                  Choose Package
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Solicitors Team */}
        <div className="mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">
            Meet Our Expert Team
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {solicitors.map((solicitor, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
                <div className="relative h-64">
                  <img
                    src={solicitor.image}
                    alt={solicitor.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <p className="text-white font-black text-xl">{solicitor.name}</p>
                    <p className="text-white/90 font-medium">{solicitor.role}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="size-5 text-rose-600" />
                    <span className="text-slate-900 font-bold">{solicitor.experience}</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-slate-700">Specialties:</p>
                    <div className="flex flex-wrap gap-2">
                      {solicitor.specialties.map((specialty, i) => (
                        <span key={i} className="px-3 py-1 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 rounded-full text-xs font-bold">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border-2 border-white/60">
            <h3 className="text-3xl font-black text-slate-900 mb-8">Why Choose Our Solicitors?</h3>
            <ul className="space-y-4">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl">
                  <CheckCircle className="size-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-red-600 rounded-3xl p-10 shadow-xl text-white">
            <h3 className="text-3xl font-black mb-6">Get in Touch</h3>
            <p className="text-xl font-medium mb-8">
              Speak to one of our experienced property solicitors today for a free consultation
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-white/20 backdrop-blur-md rounded-xl">
                <Phone className="size-6" />
                <div>
                  <p className="font-bold">Call Us</p>
                  <p className="text-sm">0800 123 4567</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/20 backdrop-blur-md rounded-xl">
                <Mail className="size-6" />
                <div>
                  <p className="font-bold">Email Us</p>
                  <p className="text-sm">legal@kingauction.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/20 backdrop-blur-md rounded-xl">
                <Clock className="size-6" />
                <div>
                  <p className="font-bold">Opening Hours</p>
                  <p className="text-sm">Mon-Fri: 9am-7pm, Sat: 10am-4pm</p>
                </div>
              </div>
            </div>
            <button className="w-full py-5 bg-white text-rose-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">
              Book Consultation
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border-2 border-white/60">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                5,234
              </div>
              <p className="text-slate-600 font-bold">Completions This Year</p>
            </div>
            <div>
              <div className="text-5xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                99.8%
              </div>
              <p className="text-slate-600 font-bold">Success Rate</p>
            </div>
            <div>
              <div className="text-5xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                24
              </div>
              <p className="text-slate-600 font-bold">Avg Days to Complete</p>
            </div>
            <div>
              <div className="text-5xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                4.9/5
              </div>
              <p className="text-slate-600 font-bold">Client Rating</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
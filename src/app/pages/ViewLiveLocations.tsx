import { useState } from "react";
import { useNavigate } from "react-router";
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  Gavel,
  Phone,
  Mail,
  Navigation,
  CheckCircle,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Award,
  Target,
  ArrowRight,
  X,
} from "lucide-react";
import Header from "../components/Header";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function ViewLiveLocations() {
  const navigate = useNavigate();
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    location: "",
    interests: "",
  });

  const liveLocations = [
    {
      id: 1,
      city: "London",
      venue: "Royal Convention Centre",
      address: "123 Westminster Road, London, SW1A 1AA",
      nextAuction: "March 15, 2026",
      time: "2:00 PM GMT",
      lots: 45,
      registeredBidders: 234,
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25kb24lMjBjaXR5fGVufDF8fHx8MTc3MTIzMzMwOHww&ixlib=rb-4.1.0&q=80&w=1080",
      gradient: "from-blue-500 via-blue-600 to-indigo-600",
      status: "Live Today",
      featured: true,
    },
    {
      id: 2,
      city: "Manchester",
      venue: "Manchester Grand Hall",
      address: "456 Deansgate, Manchester, M3 2FF",
      nextAuction: "March 18, 2026",
      time: "1:00 PM GMT",
      lots: 38,
      registeredBidders: 189,
      image: "https://images.unsplash.com/photo-1560363199-a1264d4ea5fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5jaGVzdGVyJTIwY2l0eXxlbnwxfHx8fDE3NzEyMzMzMDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      gradient: "from-purple-500 via-purple-600 to-pink-600",
      status: "Upcoming",
      featured: false,
    },
    {
      id: 3,
      city: "Birmingham",
      venue: "Birmingham International Centre",
      address: "789 Broad Street, Birmingham, B1 2EA",
      nextAuction: "March 22, 2026",
      time: "3:00 PM GMT",
      lots: 52,
      registeredBidders: 312,
      image: "https://images.unsplash.com/photo-1617348003030-5dc3be5b0b0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJtaW5naGFtJTIwY2l0eXxlbnwxfHx8fDE3NzEyMzMzMDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      gradient: "from-emerald-500 via-emerald-600 to-teal-600",
      status: "Upcoming",
      featured: true,
    },
    {
      id: 4,
      city: "Edinburgh",
      venue: "Edinburgh Conference Center",
      address: "321 Princes Street, Edinburgh, EH2 2AN",
      nextAuction: "March 25, 2026",
      time: "12:00 PM GMT",
      lots: 41,
      registeredBidders: 201,
      image: "https://images.unsplash.com/photo-1555881788-0e39d8f207b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZGluYnVyZ2glMjBjaXR5fGVufDF8fHx8MTc3MTIzMzMwOHww&ixlib=rb-4.1.0&q=80&w=1080",
      gradient: "from-orange-500 via-orange-600 to-amber-600",
      status: "Upcoming",
      featured: false,
    },
    {
      id: 5,
      city: "Bristol",
      venue: "Bristol Auction House",
      address: "555 Harbourside, Bristol, BS1 6HG",
      nextAuction: "March 29, 2026",
      time: "2:30 PM GMT",
      lots: 36,
      registeredBidders: 167,
      image: "https://images.unsplash.com/photo-1558537348-cb7c7e0dfd97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlzdG9sJTIwY2l0eXxlbnwxfHx8fDE3NzEyMzMzMDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      gradient: "from-rose-500 via-rose-600 to-red-600",
      status: "Upcoming",
      featured: false,
    },
    {
      id: 6,
      city: "Leeds",
      venue: "Leeds Central Venue",
      address: "888 Wellington Street, Leeds, LS1 4JJ",
      nextAuction: "April 1, 2026",
      time: "1:30 PM GMT",
      lots: 44,
      registeredBidders: 223,
      image: "https://images.unsplash.com/photo-1566404791232-af9fe0ae8f8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWVkcyUyMGNpdHl8ZW58MXx8fHwxNzcxMjMzMzA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      gradient: "from-cyan-500 via-cyan-600 to-blue-600",
      status: "Upcoming",
      featured: true,
    },
  ];

  const stats = [
    {
      label: "Live Locations",
      value: "6",
      icon: MapPin,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      label: "Total Lots",
      value: "256",
      icon: Gavel,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      label: "Registered Bidders",
      value: "1,326",
      icon: Users,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      label: "Success Rate",
      value: "96%",
      icon: Award,
      gradient: "from-orange-500 to-amber-500",
    },
  ];

  const handleRegister = (location: any) => {
    setFormData({ ...formData, location: location.city });
    setRegisterModalOpen(true);
    setRegistrationSuccess(false);
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.location
    )
      return;

    // Simulate registration
    setTimeout(() => {
      setRegistrationSuccess(true);
    }, 500);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 left-1/4 size-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-95" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 size-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 right-0 size-96 bg-cyan-300 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-lg rounded-full mb-6 border border-white/40">
              <MapPin className="size-5 text-white" />
              <span className="text-sm font-bold text-white">
                6 Live Locations Nationwide
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              View Live Auction
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Locations Near You
              </span>
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Register now for upcoming auctions at our premium venues across
              the UK. Experience the thrill of live bidding with expert support.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setRegisterModalOpen(true)}
                className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
              >
                <Sparkles className="size-5" />
                Register Now
              </button>
              <button
                onClick={() => navigate("/online-auctions")}
                className="px-8 py-4 bg-white/20 backdrop-blur-lg text-white border-2 border-white/40 rounded-2xl font-bold hover:bg-white/30 transition-all flex items-center gap-2"
              >
                View Online Auctions
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/60 shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              <div
                className={`size-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-lg`}
              >
                <stat.icon className="size-8 text-white" />
              </div>
              <div className="text-4xl font-black text-slate-900 mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-slate-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Locations Grid */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-slate-900 mb-4">
            Our Live Auction Venues
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose from our premium locations nationwide and register for
            upcoming auctions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {liveLocations.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all group border-2 border-white/60"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <ImageWithFallback
                  src={location.image}
                  alt={location.city}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {location.featured && (
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black rounded-full flex items-center gap-1 shadow-lg">
                    <Award className="size-3" />
                    Featured
                  </div>
                )}
                {location.status === "Live Today" && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-xs font-black rounded-full animate-pulse shadow-lg">
                    🔴 {location.status}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-1">
                      {location.city}
                    </h3>
                    <p className="text-sm font-bold text-slate-600">
                      {location.venue}
                    </p>
                  </div>
                  <div
                    className={`size-12 rounded-xl bg-gradient-to-br ${location.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <MapPin className="size-6 text-white" />
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Navigation className="size-4 text-slate-400" />
                    <span className="font-medium">{location.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="size-4 text-slate-400" />
                    <span className="font-medium">{location.nextAuction}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="size-4 text-slate-400" />
                    <span className="font-medium">{location.time}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div
                      className={`size-10 rounded-lg bg-gradient-to-br ${location.gradient} flex items-center justify-center`}
                    >
                      <Gavel className="size-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-black text-slate-900">
                        {location.lots}
                      </div>
                      <div className="text-xs font-semibold text-slate-500">
                        Lots
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`size-10 rounded-lg bg-gradient-to-br ${location.gradient} flex items-center justify-center`}
                    >
                      <Users className="size-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-black text-slate-900">
                        {location.registeredBidders}
                      </div>
                      <div className="text-xs font-semibold text-slate-500">
                        Bidders
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleRegister(location)}
                    className={`flex-1 py-3.5 bg-gradient-to-r ${location.gradient} text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2`}
                  >
                    <CheckCircle className="size-5" />
                    Register
                  </button>
                  <button
                    onClick={() => navigate(`/view-all-lots`)}
                    className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
                  >
                    <Navigation className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 size-96 bg-white rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-0 right-0 size-96 bg-cyan-300 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1.5s" }}
            />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white mb-4">
              Ready to Start Bidding?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Register now for any of our upcoming auctions and gain access to
              exclusive properties
            </p>
            <button
              onClick={() => setRegisterModalOpen(true)}
              className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-3"
            >
              <Sparkles className="size-6" />
              Register for Free
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {registerModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            {/* Gradient Top */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

            {/* Close Button */}
            <button
              className="absolute top-6 right-6 size-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-all hover:rotate-90"
              onClick={() => {
                setRegisterModalOpen(false);
                setRegistrationSuccess(false);
              }}
            >
              <X className="size-5 text-slate-600" />
            </button>

            {registrationSuccess ? (
              // Success State
              <div className="text-center py-8">
                <div className="size-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <CheckCircle className="size-14 text-white" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">
                  Registration Successful! 🎉
                </h3>
                <p className="text-lg text-slate-600 mb-8">
                  Thank you for registering, {formData.fullName}! We've sent a
                  confirmation email to{" "}
                  <span className="font-bold text-blue-600">
                    {formData.email}
                  </span>
                </p>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border-2 border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="size-5 text-blue-600" />
                    <span className="font-bold text-slate-900">
                      Your Location: {formData.location}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    We'll notify you about upcoming auctions and exclusive lots
                    in your area.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/view-all-lots")}
                    className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    Browse Lots
                  </button>
                  <button
                    onClick={() => {
                      setRegisterModalOpen(false);
                      setRegistrationSuccess(false);
                      setFormData({
                        fullName: "",
                        email: "",
                        phone: "",
                        address: "",
                        city: "",
                        postcode: "",
                        location: "",
                        interests: "",
                      });
                    }}
                    className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              // Registration Form
              <>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full mb-4">
                    <Sparkles className="size-4" />
                    <span className="text-sm font-bold">
                      Free Registration
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">
                    Register for Live Auctions
                  </h3>
                  <p className="text-slate-600">
                    Complete the form below to register for upcoming auctions at
                    our live locations
                  </p>
                </div>

                <form onSubmit={handleSubmitRegistration} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                      placeholder="John Smith"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                      placeholder="+44 7700 900000"
                      required
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                      placeholder="123 Main Street"
                      required
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                      placeholder="London"
                      required
                    />
                  </div>

                  {/* Postcode */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      Postcode *
                    </label>
                    <input
                      type="text"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                      placeholder="SW1A 1AA"
                      required
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      Preferred Location *
                    </label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                      required
                    >
                      <option value="">Select a location</option>
                      {liveLocations.map((location) => (
                        <option key={location.id} value={location.city}>
                          {location.city} - {location.venue}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      Property Interests (Optional)
                    </label>
                    <textarea
                      name="interests"
                      value={formData.interests}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400 resize-none"
                      placeholder="E.g., Residential, Commercial, Investment Properties..."
                      rows={3}
                    />
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="size-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="font-bold mb-1">
                          Your data is secure with us
                        </p>
                        <p className="text-blue-700">
                          We'll only use your information to contact you about
                          relevant auctions and properties.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 text-lg"
                  >
                    <CheckCircle className="size-6" />
                    Complete Registration
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
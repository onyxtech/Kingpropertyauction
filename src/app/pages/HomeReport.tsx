import { FileText, Home, CheckCircle, Sparkles, Info, Download, Clock, Shield, Award, TrendingUp, X, User, Mail, Phone, MapPin, Building } from "lucide-react";
import { useState } from "react";
import Header from "../components/Header";

export default function HomeReport() {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    propertyAddress: "",
    propertyType: "",
    propertyValue: "",
    bedrooms: "",
    preferredDate: "",
    package: "",
    additionalNotes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you ${formData.fullName}! Your survey booking request has been received. We'll contact you shortly to confirm the details.`);
    setShowBookingModal(false);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      propertyAddress: "",
      propertyType: "",
      propertyValue: "",
      bedrooms: "",
      preferredDate: "",
      package: "",
      additionalNotes: ""
    });
  };

  const included = [
    {
      title: "Energy Performance Certificate",
      desc: "Detailed EPC rating and energy efficiency recommendations",
      icon: TrendingUp,
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      title: "Property Questionnaire",
      desc: "Comprehensive information about the property's condition and history",
      icon: FileText,
      gradient: "from-purple-500 to-pink-600"
    },
    {
      title: "Single Survey",
      desc: "Professional structural survey by qualified surveyor",
      icon: Home,
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      title: "Valuation Report",
      desc: "Current market value assessment and price guidance",
      icon: Award,
      gradient: "from-orange-500 to-amber-600"
    }
  ];

  const benefits = [
    "Required for all property sales in Scotland",
    "Valid for 12 weeks from date of issue",
    "Transparent pricing with no hidden fees",
    "Fast turnaround - typically 3-5 working days",
    "Accepted by all lenders and solicitors",
    "Increases buyer confidence and speeds up sales"
  ];

  const packages = [
    {
      name: "Standard Report",
      price: "£395",
      propertyValue: "Up to £250k",
      features: [
        "Single Survey",
        "Energy Report",
        "Property Questionnaire",
        "Standard turnaround (5 days)",
        "Email delivery"
      ],
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      name: "Premium Report",
      price: "£595",
      propertyValue: "£250k - £750k",
      features: [
        "Everything in Standard",
        "Detailed survey photos",
        "Priority turnaround (3 days)",
        "Telephone support",
        "Reinspection included"
      ],
      gradient: "from-purple-500 to-pink-600",
      popular: true
    },
    {
      name: "Executive Report",
      price: "£895",
      propertyValue: "Over £750k",
      features: [
        "Everything in Premium",
        "Drone survey photos",
        "Express turnaround (24 hours)",
        "Dedicated surveyor",
        "Comprehensive analysis",
        "Expert consultation call"
      ],
      gradient: "from-emerald-500 to-teal-600"
    }
  ];

  const process = [
    { step: "1", title: "Book Online", desc: "Choose your package and schedule survey" },
    { step: "2", title: "Survey Visit", desc: "Qualified surveyor inspects property" },
    { step: "3", title: "Report Creation", desc: "Comprehensive report compiled" },
    { step: "4", title: "Delivery", desc: "Receive report within agreed timeframe" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-95" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 size-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 size-96 bg-cyan-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
              <Sparkles className="size-4 text-yellow-300 animate-pulse" />
              <span className="text-sm font-bold text-white">🏠 Scotland Only • Required by Law • Fast Delivery</span>
            </div>
            
            <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Home Report
              <br />
              <span className="text-cyan-300">Professional Property Survey</span>
            </h1>
            
            <p className="text-2xl text-white/90 mb-10 font-medium">
              Comprehensive property survey and valuation for Scottish properties
              <br />
              <span className="text-yellow-200">✨ Required for all property sales in Scotland</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* What's Included */}
        <div className="mb-16">
          <h2 className="text-5xl font-black text-slate-900 mb-4 text-center">What's Included</h2>
          <p className="text-xl text-slate-600 font-medium text-center mb-12">
            Everything you need for a compliant property sale
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {included.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
                  <div className={`size-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="size-7 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 font-medium">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Packages */}
        <div className="mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">
            Choose Your Package
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg, idx) => (
              <div key={idx} className={`bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 ${pkg.popular ? 'border-purple-500 scale-105' : 'border-white/60'} hover:shadow-2xl transition-all hover:scale-110 relative`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full font-bold text-sm shadow-xl">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-black text-slate-900 mb-2 text-center">{pkg.name}</h3>
                <p className="text-slate-600 font-medium text-center mb-4">{pkg.propertyValue}</p>
                <div className="text-center mb-6">
                  <p className={`text-5xl font-black mb-2 bg-gradient-to-r ${pkg.gradient} bg-clip-text text-transparent`}>
                    {pkg.price}
                  </p>
                  <p className="text-slate-600 font-medium">+ VAT</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="size-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-4 bg-gradient-to-r ${pkg.gradient} text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105`}
                  onClick={() => {
                    setFormData({ ...formData, package: pkg.name });
                    setShowBookingModal(true);
                  }}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        <div className="mb-16 bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border-2 border-white/60">
          <h2 className="text-4xl font-black text-slate-900 mb-8 text-center">
            Simple 4-Step Process
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {process.map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="size-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-black text-white mx-auto mb-4 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border-2 border-white/60">
            <h3 className="text-3xl font-black text-slate-900 mb-8">Why You Need a Home Report</h3>
            <ul className="space-y-4">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                  <CheckCircle className="size-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl p-10 shadow-xl text-white">
            <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
              <Info className="size-7 text-white" />
            </div>
            <h3 className="text-3xl font-black mb-6">Important Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-white/20 backdrop-blur-md rounded-xl">
                <Clock className="size-6 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold mb-1">Validity Period</p>
                  <p className="text-sm">Home Reports are valid for 12 weeks from the date of issue</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white/20 backdrop-blur-md rounded-xl">
                <Shield className="size-6 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold mb-1">Legal Requirement</p>
                  <p className="text-sm">Required by law for all property sales in Scotland since December 2008</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white/20 backdrop-blur-md rounded-xl">
                <Download className="size-6 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold mb-1">Accessibility</p>
                  <p className="text-sm">Reports must be available to all prospective buyers before viewings</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16 bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border-2 border-white/60">
          <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">
            Our Track Record
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                12,456
              </div>
              <p className="text-slate-600 font-bold">Reports Completed</p>
            </div>
            <div>
              <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                3.2
              </div>
              <p className="text-slate-600 font-bold">Days Avg Turnaround</p>
            </div>
            <div>
              <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                99.8%
              </div>
              <p className="text-slate-600 font-bold">Accuracy Rate</p>
            </div>
            <div>
              <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                4.9/5
              </div>
              <p className="text-slate-600 font-bold">Customer Rating</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl p-12 shadow-xl text-white text-center">
          <div className="size-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-6">
            <Home className="size-8 text-white" />
          </div>
          <h2 className="text-4xl font-black mb-6">Need a Home Report?</h2>
          <p className="text-2xl font-medium mb-10">
            Book your professional property survey today
          </p>
          <div className="flex items-center gap-4 justify-center">
            <button 
              className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              onClick={() => setShowBookingModal(true)}
            >
              Book Survey
            </button>
            <button 
              className="px-10 py-5 bg-white/20 backdrop-blur-md border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/30 transition-all"
              onClick={() => setShowBookingModal(true)}
            >
              Get Quote
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl relative animate-in zoom-in-95 duration-300 my-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 size-64 bg-white rounded-full blur-3xl animate-pulse" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="size-8 text-white" />
                    <h3 className="text-3xl font-black text-white">
                      Book Your Home Report
                    </h3>
                  </div>
                  <p className="text-white/90 font-semibold">
                    Complete the form below to get started
                  </p>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="size-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:rotate-90"
                >
                  <X className="size-6 text-white" />
                </button>
              </div>
            </div>

            {/* Form - Scrollable Content */}
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-8">
                {/* Personal Information Section */}
                <div className="mb-6">
                  <h4 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-slate-200">
                    <User className="size-5 text-blue-600" />
                    Personal Information
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <User className="size-4 text-blue-600" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-slate-900"
                        placeholder="John Smith"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Mail className="size-4 text-indigo-600" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-900"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Phone className="size-4 text-purple-600" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-semibold text-slate-900"
                        placeholder="+44 20 1234 5678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Property Details Section */}
                <div className="mb-6">
                  <h4 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-slate-200">
                    <Building className="size-5 text-emerald-600" />
                    Property Details
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <MapPin className="size-4 text-emerald-600" />
                        Property Address *
                      </label>
                      <input
                        type="text"
                        className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-900"
                        placeholder="123 High Street, Edinburgh, EH1 1AB"
                        value={formData.propertyAddress}
                        onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Home className="size-4 text-cyan-600" />
                        Property Type *
                      </label>
                      <select
                        className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all font-semibold text-slate-900"
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                        required
                      >
                        <option value="">Select type</option>
                        <option value="detached">Detached House</option>
                        <option value="semi-detached">Semi-Detached House</option>
                        <option value="terraced">Terraced House</option>
                        <option value="flat">Flat/Apartment</option>
                        <option value="bungalow">Bungalow</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Award className="size-4 text-amber-600" />
                        Property Value *
                      </label>
                      <input
                        type="text"
                        className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-semibold text-slate-900"
                        placeholder="£300,000"
                        value={formData.propertyValue}
                        onChange={(e) => setFormData({ ...formData, propertyValue: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Home className="size-4 text-rose-600" />
                        Number of Bedrooms *
                      </label>
                      <input
                        type="number"
                        className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-semibold text-slate-900"
                        placeholder="3"
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Clock className="size-4 text-teal-600" />
                        Preferred Survey Date *
                      </label>
                      <input
                        type="date"
                        className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-semibold text-slate-900"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Package Selection */}
                <div className="mb-6">
                  <h4 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-slate-200">
                    <FileText className="size-5 text-orange-600" />
                    Package Selection
                  </h4>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <FileText className="size-4 text-orange-600" />
                      Choose Package *
                    </label>
                    <select
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-semibold text-slate-900"
                      value={formData.package}
                      onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                      required
                    >
                      <option value="">Select a package</option>
                      {packages.map((pkg) => (
                        <option key={pkg.name} value={pkg.name}>
                          {pkg.name} - {pkg.price} ({pkg.propertyValue})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <FileText className="size-4 text-slate-600" />
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-500/20 focus:border-slate-500 transition-all font-semibold text-slate-900"
                    placeholder="Any specific requirements or questions..."
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  />
                </div>

                {/* What Happens Next */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
                  <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                    <Sparkles className="size-5 text-blue-600" />
                    What Happens Next
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="size-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-700">Survey scheduled within 24 hours</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="size-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-700">Confirmation email sent</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="size-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-700">Professional surveyor assigned</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="size-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-700">Report delivered on time</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    className="flex-1 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <FileText className="size-6" />
                    Submit Booking Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="px-8 py-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-lg transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
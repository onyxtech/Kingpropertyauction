import { Briefcase, TrendingUp, Clock, Award, Users, CheckCircle, Sparkles, DollarSign, Shield, Target, X, Building2 } from "lucide-react";
import Header from "../components/Header";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function SellingOverview() {
  const navigate = useNavigate();
  const [showValuationModal, setShowValuationModal] = useState(false);
  const [formData, setFormData] = useState({
    propertyType: "",
    address: "",
    postcode: "",
    bedrooms: "",
    bathrooms: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Valuation form submitted:", formData);
    alert("Thank you! We'll contact you shortly with your free valuation.");
    setShowValuationModal(false);
    setFormData({
      propertyType: "",
      address: "",
      postcode: "",
      bedrooms: "",
      bathrooms: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: ""
    });
  };

  const benefits = [
    { title: "Maximum Exposure", desc: "Reach thousands of buyers", icon: Users, gradient: "from-blue-500 to-indigo-600" },
    { title: "Fast Sale", desc: "Complete in just 28 days", icon: Clock, gradient: "from-purple-500 to-pink-600" },
    { title: "Transparent Process", desc: "No hidden fees", icon: Shield, gradient: "from-emerald-500 to-teal-600" },
    { title: "Expert Support", desc: "Dedicated auction team", icon: Award, gradient: "from-orange-500 to-amber-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <Header />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 opacity-95" />
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
              <Sparkles className="size-4 text-yellow-300 animate-pulse" />
              <span className="text-sm font-bold text-white">💼 Sell Fast • Best Price • Expert Service</span>
            </div>
            
            <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Selling Overview
              <br />
              <span className="text-yellow-300">Get The Best Price</span>
            </h1>
            
            <p className="text-2xl text-white/90 font-medium">
              Sell your property at auction and achieve outstanding results
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
                <div className={`size-14 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon className="size-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600 font-medium">{benefit.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border-2 border-white/60">
            <h3 className="text-3xl font-black text-slate-900 mb-6">Why Sell With Us?</h3>
            <ul className="space-y-4">
              {[
                "Achieve 95-100% of market value",
                "Complete sale in just 28 days",
                "No sale, no fee policy",
                "Expert marketing to thousands",
                "Dedicated auction specialist"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                  <CheckCircle className="size-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600 rounded-3xl p-10 shadow-xl text-white">
            <h3 className="text-3xl font-black mb-6">Ready to Sell?</h3>
            <p className="text-xl font-medium mb-8">
              Get your free valuation and expert advice today
            </p>
            <button className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 mb-4 flex items-center justify-center gap-2" onClick={() => navigate("/add-property")}>
              <Building2 className="size-5" />
              Add Property Now
            </button>
            <button className="w-full py-5 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 mb-4" onClick={() => setShowValuationModal(true)}>
              Get Free Valuation
            </button>
            <button className="w-full py-5 bg-white/20 backdrop-blur-md border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/30 transition-all">
              Call 0800 123 4567
            </button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border-2 border-white/60">
          <h2 className="text-4xl font-black text-slate-900 mb-8 text-center">The Selling Process</h2>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { step: "1", title: "Valuation", desc: "Free property valuation" },
              { step: "2", title: "Agreement", desc: "Sign terms & conditions" },
              { step: "3", title: "Marketing", desc: "Professional advertising" },
              { step: "4", title: "Auction", desc: "Property goes to auction" },
              { step: "5", title: "Complete", desc: "Receive your money" }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="size-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-black text-white mx-auto mb-4 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 font-medium text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Valuation Modal */}
      {showValuationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-6 animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border-2 border-white/60 animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 px-8 py-6 rounded-t-3xl border-b-2 border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">Get Your Free Valuation</h2>
                  <p className="text-white/90 font-medium">We'll get back to you within 24 hours</p>
                </div>
                <button 
                  onClick={() => setShowValuationModal(false)}
                  className="size-10 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 flex items-center justify-center transition-all border border-white/30 hover:scale-110"
                >
                  <X className="size-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Property Details Section */}
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Shield className="size-4 text-white" />
                    </div>
                    Property Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Property Type</label>
                      <select
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-medium"
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                        required
                      >
                        <option value="">Select type</option>
                        <option value="house">House</option>
                        <option value="apartment">Apartment</option>
                        <option value="bungalow">Bungalow</option>
                        <option value="land">Land</option>
                        <option value="commercial">Commercial</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Postcode</label>
                      <input
                        type="text"
                        placeholder="e.g. SW1A 1AA"
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-medium"
                        value={formData.postcode}
                        onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Full Address</label>
                      <input
                        type="text"
                        placeholder="Enter full property address"
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-medium"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Bedrooms</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-medium"
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Bathrooms</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-medium"
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Details Section */}
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <Users className="size-4 text-white" />
                    </div>
                    Your Contact Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                      <input
                        type="text"
                        placeholder="John"
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-medium"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        placeholder="Smith"
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-medium"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        placeholder="john.smith@example.com"
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-medium"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="07XXX XXXXXX"
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-medium"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Additional Information (Optional)</label>
                      <textarea
                        rows={4}
                        placeholder="Tell us more about your property or any specific requirements..."
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-medium resize-none"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowValuationModal(false)}
                    className="flex-1 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                  >
                    Submit Valuation Request
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
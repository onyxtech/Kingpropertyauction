import { Shield, FileText, CheckCircle, AlertTriangle, Scale, Download, BookOpen, Info, Clock, User, Mail, Phone, MapPin, Home, X, Printer, Eye, Send } from "lucide-react";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TermsOfSale() {
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Legal team contact form submitted:", formData);
    setIsLegalModalOpen(false);
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };

  const handleDownloadPDF = () => {
    // Mock PDF download
    console.log("Downloading Terms & Conditions PDF...");
    alert("Terms & Conditions PDF download started. In a production environment, this would download a PDF file.");
  };

  const sections = [
    { 
      title: "Buyer's Responsibilities", 
      icon: CheckCircle,
      gradient: "from-blue-500 to-indigo-600",
      items: [
        "Valid photo ID and proof of address required",
        "10% deposit payable on fall of hammer",
        "Complete purchase within 28 days",
        "Legal costs and fees payable by buyer",
        "Surveys and inspections at buyer's expense",
        "Binding contract on successful bid"
      ] 
    },
    { 
      title: "Seller's Obligations", 
      icon: FileText,
      gradient: "from-purple-500 to-pink-600",
      items: [
        "Provide comprehensive legal pack",
        "Deliver clear and marketable title",
        "Provide vacant possession on completion",
        "Supply all keys and access codes",
        "Complete all necessary paperwork",
        "Cooperate with completion process"
      ] 
    },
    { 
      title: "Auction Rules", 
      icon: Scale,
      gradient: "from-emerald-500 to-teal-600",
      items: [
        "Binding contract on fall of hammer",
        "No cooling-off period applies",
        "Reserve price may be disclosed",
        "Proxy and telephone bidding allowed",
        "Auctioneer's decision is final",
        "All bids subject to verification"
      ] 
    },
    { 
      title: "Payment Terms", 
      icon: Shield,
      gradient: "from-orange-500 to-amber-600",
      items: [
        "Deposit by bank transfer or card",
        "Balance due on completion date",
        "Administration fees apply (£500-£1000)",
        "Late completion penalties may apply",
        "No refunds after successful bid",
        "Payment must clear before completion"
      ] 
    }
  ];

  const importantNotes = [
    {
      title: "Legal Pack Review",
      desc: "Always review the legal pack thoroughly before bidding. Seek professional legal advice.",
      icon: BookOpen,
      color: "blue"
    },
    {
      title: "Time is of the Essence",
      desc: "The 28-day completion deadline is strict. Ensure you have finance arranged beforehand.",
      icon: Clock,
      color: "purple"
    },
    {
      title: "No Refunds",
      desc: "Once the hammer falls, the contract is binding. There are no refunds or cancellations.",
      icon: AlertTriangle,
      color: "orange"
    },
    {
      title: "Additional Costs",
      desc: "Budget for legal fees, surveys, stamp duty, and administration charges.",
      icon: Info,
      color: "emerald"
    }
  ];

  const faqs = [
    { q: "What happens if I can't complete in 28 days?", a: "Late completion penalties apply, typically 4% above base rate per day. The seller may also rescind the contract and retain your deposit." },
    { q: "Can I withdraw my bid?", a: "No. Once the hammer falls, the contract is legally binding and you cannot withdraw." },
    { q: "What if there are issues with the property?", a: "Properties are sold 'as seen'. You should conduct surveys and inspections before bidding." },
    { q: "Are there any hidden fees?", a: "All fees are disclosed in the legal pack including admin fees, typically £500-£1000 plus VAT." }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-gradient-to-br from-yellow-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 opacity-95" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 size-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 size-96 bg-cyan-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
              <Scale className="size-4 text-yellow-300 animate-pulse" />
              <span className="text-sm font-bold text-white">⚖️ Legal Protection • Clear Terms • Fair Process</span>
            </div>
            
            <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Terms of Sale
              <br />
              <span className="text-yellow-200">Legal Protection for All</span>
            </h1>
            
            <p className="text-2xl text-white/90 font-medium">
              Understanding your rights and responsibilities in property auctions
              <br />
              <span className="text-yellow-200">✨ Transparent and legally binding</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Terms Sections */}
        <div className="mb-16">
          <h2 className="text-5xl font-black text-slate-900 mb-4 text-center">Key Terms & Conditions</h2>
          <p className="text-xl text-slate-600 font-medium text-center mb-12">
            Everything you need to know before bidding
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {sections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
                  <div className={`size-14 rounded-2xl bg-gradient-to-br ${section.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="size-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-6">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl">
                        <div className="size-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="size-2 rounded-full bg-emerald-600" />
                        </div>
                        <span className="text-slate-700 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Important Notes */}
        <div className="mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-8 text-center">
            Important Notes
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {importantNotes.map((note, idx) => {
              const Icon = note.icon;
              return (
                <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
                  <div className="flex items-start gap-4">
                    <div className={`size-12 rounded-xl bg-gradient-to-br from-${note.color}-500 to-${note.color}-600 flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <Icon className="size-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 mb-2">{note.title}</h3>
                      <p className="text-slate-600 font-medium">{note.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto space-y-4 mb-10">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
                <h3 className="text-xl font-black text-slate-900 mb-3">{faq.q}</h3>
                <p className="text-slate-700 font-medium">{faq.a}</p>
              </div>
            ))}
          </div>

          {/* Download Action Buttons */}
          <div className="bg-gradient-to-br from-slate-100 to-blue-50 rounded-2xl p-6 border-2 border-slate-200">
            <div className="flex items-center gap-4 justify-center flex-wrap">
              <button 
                onClick={handleDownloadPDF}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-600 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-3"
              >
                <Download className="size-5" />
                Download as PDF
              </button>
              <button 
                onClick={() => window.print()}
                className="px-8 py-4 bg-white border-2 border-amber-500 text-amber-600 rounded-2xl font-bold text-lg hover:bg-amber-50 transition-all flex items-center gap-3"
              >
                <Printer className="size-5" />
                Print Terms
              </button>
              <button 
                onClick={() => setIsTermsModalOpen(false)}
                className="px-8 py-4 bg-slate-200 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-300 transition-all"
              >
                Close
              </button>
            </div>
            <p className="text-sm text-slate-600 font-medium mt-4 text-center">
              📄 Last updated: February 2026 • Version 2.1 • © King Property Auction
            </p>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-600 rounded-3xl p-12 shadow-xl text-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="size-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-6">
              <Scale className="size-8 text-white" />
            </div>
            <h2 className="text-4xl font-black mb-6">Legal Advice Recommended</h2>
            <p className="text-2xl font-medium mb-8">
              We strongly recommend seeking independent legal advice before participating in any property auction. Our solicitors are available to assist you throughout the process.
            </p>
            <div className="flex items-center gap-4 justify-center">
              <button className="px-10 py-5 bg-white text-amber-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105" onClick={() => setIsLegalModalOpen(true)}>
                Contact Legal Team
              </button>
              <button className="px-10 py-5 bg-white/20 backdrop-blur-md border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/30 transition-all flex items-center gap-3" onClick={() => setIsTermsModalOpen(true)}>
                <Eye className="size-5" />
                Download Full Terms
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Contact Modal */}
      {isLegalModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-600 px-8 py-6 rounded-t-3xl relative">
              <button 
                onClick={() => setIsLegalModalOpen(false)}
                className="absolute top-6 right-6 size-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
              >
                <X className="size-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Scale className="size-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">Contact Legal Team</h2>
                  <p className="text-white/90 font-medium">Get expert legal advice for your auction</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Full Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-500 focus:bg-white transition-all font-medium text-slate-900" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-500 focus:bg-white transition-all font-medium text-slate-900" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Phone Number *</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="+44 20 1234 5678"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-500 focus:bg-white transition-all font-medium text-slate-900" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Subject *</label>
                  <select 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-500 focus:bg-white transition-all font-medium text-slate-900" 
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="General Legal Advice">General Legal Advice</option>
                    <option value="Contract Review">Contract Review</option>
                    <option value="Terms & Conditions">Terms & Conditions</option>
                    <option value="Auction Process">Auction Process</option>
                    <option value="Property Disputes">Property Disputes</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-900 mb-2">Your Message *</label>
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleInputChange} 
                  placeholder="Please describe your legal query in detail..."
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-500 focus:bg-white transition-all font-medium text-slate-900 resize-none" 
                  rows={5} 
                  required 
                />
              </div>

              <div className="flex items-center gap-4">
                <button 
                  type="submit" 
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-600 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-3"
                >
                  <Send className="size-5" />
                  Send Message
                </button>
                <button 
                  type="button"
                  onClick={() => setIsLegalModalOpen(false)}
                  className="px-8 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>

              <p className="text-sm text-slate-500 font-medium mt-6 text-center">
                Our legal team typically responds within 24 hours during business days
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {isTermsModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-600 px-8 py-6 rounded-t-3xl relative">
              <button 
                onClick={() => setIsTermsModalOpen(false)}
                className="absolute top-6 right-6 size-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
              >
                <X className="size-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Scale className="size-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">Terms of Sale</h2>
                  <p className="text-white/90 font-medium">Full terms and conditions for property auctions</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <h3 className="text-2xl font-black text-slate-900 mb-4">Key Terms & Conditions</h3>
              <p className="text-xl text-slate-600 font-medium mb-6">
                Everything you need to know before bidding
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {sections.map((section, idx) => {
                  const Icon = section.icon;
                  return (
                    <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
                      <div className={`size-14 rounded-2xl bg-gradient-to-br ${section.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                        <Icon className="size-7 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-6">{section.title}</h3>
                      <ul className="space-y-3">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl">
                            <div className="size-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="size-2 rounded-full bg-emerald-600" />
                            </div>
                            <span className="text-slate-700 font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-4 mt-12">Important Notes</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {importantNotes.map((note, idx) => {
                  const Icon = note.icon;
                  return (
                    <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
                      <div className="flex items-start gap-4">
                        <div className={`size-12 rounded-xl bg-gradient-to-br from-${note.color}-500 to-${note.color}-600 flex items-center justify-center flex-shrink-0 shadow-lg`}>
                          <Icon className="size-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 mb-2">{note.title}</h3>
                          <p className="text-slate-600 font-medium">{note.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-4 mt-12">Frequently Asked Questions</h3>
              <div className="max-w-4xl mx-auto space-y-4 mb-10">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
                    <h3 className="text-xl font-black text-slate-900 mb-3">{faq.q}</h3>
                    <p className="text-slate-700 font-medium">{faq.a}</p>
                  </div>
                ))}
              </div>

              {/* Download Action Buttons */}
              <div className="bg-gradient-to-br from-slate-100 to-blue-50 rounded-2xl p-6 border-2 border-slate-200">
                <div className="flex items-center gap-4 justify-center flex-wrap">
                  <button 
                    onClick={handleDownloadPDF}
                    className="px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-600 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-3"
                  >
                    <Download className="size-5" />
                    Download as PDF
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="px-8 py-4 bg-white border-2 border-amber-500 text-amber-600 rounded-2xl font-bold text-lg hover:bg-amber-50 transition-all flex items-center gap-3"
                  >
                    <Printer className="size-5" />
                    Print Terms
                  </button>
                  <button 
                    onClick={() => setIsTermsModalOpen(false)}
                    className="px-8 py-4 bg-slate-200 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-300 transition-all"
                  >
                    Close
                  </button>
                </div>
                <p className="text-sm text-slate-600 font-medium mt-4 text-center">
                  📄 Last updated: February 2026 • Version 2.1 • © King Property Auction
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
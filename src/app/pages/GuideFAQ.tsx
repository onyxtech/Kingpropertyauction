import { HelpCircle, BookOpen, Sparkles, CheckCircle, Info, AlertCircle, ChevronDown, Search, X, Send, Phone, Mail, MessageSquare } from "lucide-react";
import Header from "../components/Header";
import { useState } from "react";

export default function GuideFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
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
    console.log("Support form submitted:", formData);
    setIsContactModalOpen(false);
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      category: "",
      message: ""
    });
  };

  const categories = [
    {
      name: "Buying at Auction",
      icon: BookOpen,
      gradient: "from-blue-500 to-indigo-600",
      faqs: [
        { q: "How does a property auction work?", a: "Property auctions involve properties being sold to the highest bidder. The auction is legally binding once the hammer falls. You'll need to pay a 10% deposit on the day and complete within 28 days." },
        { q: "Do I need to register before bidding?", a: "Yes, you must register at least 24 hours before the auction. You'll need valid ID, proof of address, and proof of funds for the deposit." },
        { q: "Can I view properties before bidding?", a: "Absolutely! We strongly recommend viewing all properties before bidding. Viewing times are listed in the auction catalogue." },
        { q: "What if I can't attend the auction?", a: "You can bid by telephone or proxy. Simply complete the remote bidding form at least 48 hours before the auction." },
        { q: "What happens after I win?", a: "You'll sign contracts immediately and pay a 10% deposit. You then have 28 days to complete the purchase and pay the remaining balance." }
      ]
    },
    {
      name: "Selling at Auction",
      icon: HelpCircle,
      gradient: "from-purple-500 to-pink-600",
      faqs: [
        { q: "How long does it take to sell?", a: "From instruction to completion typically takes 6-8 weeks. This includes marketing time (3-4 weeks) and the 28-day completion period after auction." },
        { q: "What are the fees?", a: "Our standard seller's fee is 2.5% + VAT of the hammer price, with no upfront costs. We also offer a 'No Sale, No Fee' policy." },
        { q: "What is a reserve price?", a: "The reserve is the minimum price you're willing to accept. It remains confidential and is typically set at 85-90% of the guide price." },
        { q: "Can I withdraw before the auction?", a: "Yes, you can withdraw at any time before the auction starts, though we recommend giving as much notice as possible." },
        { q: "What if my property doesn't sell?", a: "If your property doesn't reach the reserve, you can negotiate with interested parties post-auction or relist in the next auction." }
      ]
    },
    {
      name: "Legal & Finance",
      icon: Info,
      gradient: "from-emerald-500 to-teal-600",
      faqs: [
        { q: "Do I need a solicitor?", a: "Yes, having a solicitor instructed before bidding is essential. They'll review the legal pack and handle the conveyancing process." },
        { q: "Can I get a mortgage for auction properties?", a: "Yes, but it must be arranged before the auction. Bridging finance is popular as it provides quick access to funds." },
        { q: "What's in the legal pack?", a: "The legal pack includes title deeds, searches, special conditions of sale, property information forms, and any relevant leases or planning consents." },
        { q: "When do I pay stamp duty?", a: "Stamp duty must be paid within 14 days of completion. Your solicitor will calculate and submit this for you." },
        { q: "What if there are legal issues?", a: "Any legal issues should be raised with your solicitor before bidding. Once the hammer falls, the contract is binding regardless of any issues." }
      ]
    },
    {
      name: "General Questions",
      icon: AlertCircle,
      gradient: "from-orange-500 to-amber-600",
      faqs: [
        { q: "What types of properties go to auction?", a: "All types including residential, commercial, land, investment properties, and properties requiring renovation or with legal complexities." },
        { q: "Are auction properties cheaper?", a: "Properties typically sell for 5-25% below market value, though this varies. Competitive bidding can sometimes drive prices to market value." },
        { q: "Is buying at auction risky?", a: "No more risky than traditional purchases if you do proper due diligence. Review legal packs, conduct surveys, and arrange finance beforehand." },
        { q: "Can first-time buyers use auctions?", a: "Absolutely! Many first-time buyers find great value at auctions. We recommend attending a few auctions as an observer first." },
        { q: "What happens if I change my mind?", a: "Unfortunately, auction sales are legally binding. Once the hammer falls, you cannot withdraw without penalties including loss of deposit." }
      ]
    }
  ];

  const quickTips = [
    "Always view the property before bidding",
    "Read the legal pack thoroughly",
    "Arrange finance before the auction",
    "Set a maximum bid and stick to it",
    "Bring ID and deposit funds",
    "Register 24 hours in advance"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
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
              <span className="text-sm font-bold text-white">❓ 50+ FAQs • Expert Answers • Complete Guide</span>
            </div>
            
            <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Guide & FAQ
              <br />
              <span className="text-cyan-300">Everything You Need to Know</span>
            </h1>
            
            <p className="text-2xl text-white/90 font-medium">
              Find answers to all your auction questions
              <br />
              <span className="text-yellow-200">✨ Comprehensive guides and expert advice</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Quick Tips */}
        <div className="mb-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl p-12 shadow-xl text-white">
          <h2 className="text-4xl font-black mb-8 text-center">Quick Tips for Success</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickTips.map((tip, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-white/20 backdrop-blur-md rounded-xl">
                <CheckCircle className="size-6 flex-shrink-0" />
                <span className="font-bold">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {categories.map((category, catIdx) => {
            const Icon = category.icon;
            return (
              <div key={catIdx} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`size-14 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="size-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900">{category.name}</h2>
                </div>
                
                <div className="space-y-3">
                  {category.faqs.map((faq, faqIdx) => {
                    const globalIndex = catIdx * 100 + faqIdx;
                    const isOpen = openIndex === globalIndex;
                    
                    return (
                      <div key={faqIdx} className="border-2 border-slate-200 rounded-2xl overflow-hidden">
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                          className="w-full px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 transition-all flex items-center justify-between gap-4 text-left"
                        >
                          <span className="font-bold text-slate-900">{faq.q}</span>
                          <ChevronDown className={`size-5 text-slate-600 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="px-6 py-4 bg-white">
                            <p className="text-slate-700 font-medium">{faq.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Still Have Questions */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border-2 border-white/60 text-center">
          <div className="size-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <HelpCircle className="size-8 text-white" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-slate-600 font-medium mb-10">
            Our expert team is here to help you with any questions
          </p>
          <div className="flex items-center gap-4 justify-center">
            <button className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105" onClick={() => setIsContactModalOpen(true)}>
              Contact Support
            </button>
            <button className="px-10 py-5 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105">
              Call 0800 123 4567
            </button>
          </div>
        </div>
      </div>

      {/* Contact Support Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-8 py-6 rounded-t-3xl relative">
              <button 
                onClick={() => setIsContactModalOpen(false)}
                className="absolute top-6 right-6 size-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
              >
                <X className="size-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <MessageSquare className="size-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">Contact Support</h2>
                  <p className="text-white/90 font-medium">We're here to help with your questions</p>
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
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-900" 
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
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-900" 
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
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-900" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Question Category *</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-900" 
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Buying at Auction">Buying at Auction</option>
                    <option value="Selling at Auction">Selling at Auction</option>
                    <option value="Legal & Finance">Legal & Finance</option>
                    <option value="General Questions">General Questions</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-900 mb-2">Your Question *</label>
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleInputChange} 
                  placeholder="Please describe your question or issue in detail..."
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-900 resize-none" 
                  rows={5} 
                  required 
                />
              </div>

              {/* Contact Options */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                <p className="text-sm font-bold text-slate-900 mb-3">Other ways to reach us:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Phone className="size-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-600">Phone</p>
                      <p className="text-sm font-black text-slate-900">0800 123 4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Mail className="size-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-600">Email</p>
                      <p className="text-sm font-black text-slate-900">support@kingauction.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  type="submit" 
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-3"
                >
                  <Send className="size-5" />
                  Send Message
                </button>
                <button 
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="px-8 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>

              <p className="text-sm text-slate-500 font-medium mt-6 text-center">
                Our support team typically responds within 2-4 hours during business days
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
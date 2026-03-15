import { useNavigate } from "react-router";
import { useState } from "react";
import { 
  DollarSign, 
  Clock, 
  CheckCircle,
  Sparkles,
  TrendingUp,
  Shield,
  Award,
  Calculator,
  FileText,
  Users,
  X,
  User,
  Mail,
  Phone,
  Home,
  MapPin,
  Building2,
  Percent,
  Calendar,
  Briefcase
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AuctionFinance() {
  const navigate = useNavigate();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    // Property Details
    propertyAddress: "",
    propertyValue: "",
    purchasePrice: "",
    // Finance Details
    loanType: "",
    loanAmount: "",
    loanTerm: "",
    deposit: "",
    // Employment
    employmentStatus: "",
    annualIncome: "",
    // Additional
    additionalInfo: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setShowApplicationModal(false);
      setFormSubmitted(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        propertyAddress: "",
        propertyValue: "",
        purchasePrice: "",
        loanType: "",
        loanAmount: "",
        loanTerm: "",
        deposit: "",
        employmentStatus: "",
        annualIncome: "",
        additionalInfo: ""
      });
    }, 3000);
  };

  const loanTypes = [
    {
      title: "Bridging Finance",
      rate: "From 0.45%",
      term: "1-24 months",
      features: ["Fast approval", "Flexible terms", "Up to 75% LTV"],
      gradient: "from-blue-500 to-indigo-600",
      description: "Short-term financing solution perfect for property investors who need to act quickly at auction or need temporary funding until long-term finance is arranged.",
      howItWorks: "Bridging loans provide quick access to funds, typically within 7-14 days. The loan is secured against property and is designed to 'bridge' the gap between buying a property and securing longer-term finance or selling an existing property.",
      whoItsFor: [
        "Property investors purchasing at auction",
        "Buyers needing to move quickly before selling existing property",
        "Developers requiring short-term funding",
        "Those refinancing to release equity"
      ],
      keyBenefits: [
        "Fast approval process - decision in 24-48 hours",
        "Flexible terms from 1-24 months",
        "Up to 75% Loan-to-Value (LTV)",
        "Interest can be retained or serviced monthly",
        "No early repayment charges on most products",
        "Can be arranged for residential or commercial property"
      ],
      requirements: [
        "Clear exit strategy (sale or refinance)",
        "Property valuation",
        "Proof of deposit (usually 25-30%)",
        "Credit check and affordability assessment",
        "Legal representation"
      ],
      exampleScenario: "You find a property at auction worth £500,000 that requires £50,000 of renovation. You secure a bridging loan of £375,000 (75% LTV), complete the purchase and renovations, then refinance to a standard mortgage or sell for a profit within 12 months."
    },
    {
      title: "Development Finance",
      rate: "From 0.65%",
      term: "6-36 months",
      features: ["Project funding", "Staged releases", "Up to 70% LTV"],
      gradient: "from-purple-500 to-pink-600",
      description: "Specialized funding for property development projects, from small conversions to large-scale developments. Funds are released in stages as the project progresses.",
      howItWorks: "Development finance provides funding for both land purchase and construction costs. The lender releases funds in agreed stages as the development progresses, verified by a monitoring surveyor. Interest is typically rolled up until project completion.",
      whoItsFor: [
        "Property developers undertaking new builds",
        "Investors converting commercial to residential",
        "Builders creating multiple units",
        "Experienced developers expanding their portfolio"
      ],
      keyBenefits: [
        "Covers both land and construction costs",
        "Staged fund releases as development progresses",
        "Up to 70% of Gross Development Value (GDV)",
        "Interest rolled up until completion",
        "Flexible exit options",
        "Support from experienced development finance team"
      ],
      requirements: [
        "Detailed development appraisal and business plan",
        "Planning permission or evidence it will be granted",
        "Experienced development team",
        "Quantity surveyor's cost report",
        "Clear route to market or exit strategy",
        "Minimum 30% equity contribution"
      ],
      exampleScenario: "You purchase a commercial building for £800,000 and plan to convert it into 6 residential flats with a GDV of £1.8m. Development finance provides 65% of GDV (£1.17m) released in stages: land purchase, demolition, foundations, first fix, second fix, and completion."
    },
    {
      title: "Refurbishment Finance",
      rate: "From 0.50%",
      term: "3-18 months",
      features: ["Renovation costs", "Quick turnaround", "Up to 75% LTV"],
      gradient: "from-emerald-500 to-teal-600",
      description: "Designed for investors looking to refurbish and improve properties to increase value or rental yield. Covers both purchase price and renovation costs.",
      howItWorks: "Refurbishment finance combines a bridging loan with funds for renovation work. The lender provides capital for both purchase and refurbishment costs, with renovation funds released in stages as work progresses. Exit is typically through refinance or sale.",
      whoItsFor: [
        "Buy-to-let investors renovating properties",
        "Property flippers adding value before sale",
        "Landlords upgrading rental portfolios",
        "Investors converting properties to HMOs"
      ],
      keyBenefits: [
        "Covers purchase price plus renovation costs",
        "Quick access to funds - complete in 2 weeks",
        "Up to 75% of purchase price + 100% of refurb costs",
        "Flexible drawdown of refurbishment funds",
        "Interest-only monthly payments or rolled up",
        "No minimum income requirements"
      ],
      requirements: [
        "Property purchase price agreed",
        "Detailed refurbishment schedule and costs",
        "Builder quotes and specifications",
        "After Refurbishment Value (ARV) evidence",
        "Exit strategy (remortgage or sale)",
        "Sufficient deposit (typically 25-30%)"
      ],
      exampleScenario: "You purchase a dated property for £300,000 requiring £40,000 renovation. Refurbishment finance provides £225,000 for purchase (75% LTV) plus £40,000 for works. After renovation, the property is worth £400,000, you refinance to a standard mortgage at 75% LTV (£300,000), repaying the loan and retaining profit."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Header />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 opacity-95" />
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
              <Sparkles className="size-4 text-yellow-300 animate-pulse" />
              <span className="text-sm font-bold text-white">💷 Fast Approval • Competitive Rates • Flexible Terms</span>
            </div>
            
            <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Auction Finance
              <br />
              <span className="text-cyan-300">Fund Your Purchase</span>
            </h1>
            
            <p className="text-2xl text-white/90 mb-10 font-medium">
              Secure financing for your auction purchase within 24 hours
            </p>

            <button 
              className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              onClick={() => setShowApplicationModal(true)}
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {loanTypes.map((loan, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
              <div className={`size-14 rounded-2xl bg-gradient-to-br ${loan.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                <DollarSign className="size-7 text-white" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{loan.title}</h3>
              <div className="mb-6">
                <p className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {loan.rate}
                </p>
                <p className="text-slate-600 font-bold">{loan.term}</p>
              </div>
              <ul className="space-y-3 mb-6">
                {loan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle className="size-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 bg-gradient-to-r ${loan.gradient} text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105`} onClick={() => { setSelectedLoan(loan); setShowInfoModal(true); }}>
                Learn More
              </button>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border-2 border-white/60">
            <h2 className="text-3xl font-black text-slate-900 mb-8">Finance Calculator</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Property Value</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">£</span>
                  <input
                    type="number"
                    placeholder="500,000"
                    className="w-full pl-10 pr-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Loan Amount</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">£</span>
                  <input
                    type="number"
                    placeholder="375,000"
                    className="w-full pl-10 pr-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Loan Term (months)</label>
                <input
                  type="number"
                  placeholder="12"
                  className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
              <button className="w-full py-5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <Calculator className="inline-block size-5 mr-2" />
                Calculate
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
              <h3 className="text-2xl font-black text-slate-900 mb-6">Why Choose Us?</h3>
              <div className="space-y-4">
                {[
                  { icon: Clock, title: "24-Hour Approval", desc: "Fast decision making" },
                  { icon: Shield, title: "Secure Process", desc: "FCA regulated lenders" },
                  { icon: Award, title: "Expert Advisors", desc: "Dedicated support team" },
                  { icon: TrendingUp, title: "Competitive Rates", desc: "Best market rates" }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                      <div className="size-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Icon className="size-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900 mb-1">{item.title}</h4>
                        <p className="text-slate-600 font-medium">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-cyan-600 rounded-3xl p-8 shadow-xl text-white">
              <h3 className="text-3xl font-black mb-4">Ready to Apply?</h3>
              <p className="text-xl font-medium mb-6">
                Speak to our finance specialists today
              </p>
              <button className="w-full py-4 bg-white text-indigo-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                Call 0800 123 4567
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/60 w-full max-w-4xl my-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 p-8 rounded-t-3xl">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <FileText className="size-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white mb-1">Finance Application</h2>
                    <p className="text-white/90 font-medium">Complete the form to apply for auction finance</p>
                  </div>
                </div>
                <button 
                  className="size-10 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                  onClick={() => setShowApplicationModal(false)}
                >
                  <X className="size-5 text-white" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              {!formSubmitted ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-8">
                    {/* Personal Information */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border-2 border-blue-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                          <User className="size-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">Personal Information</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-black text-slate-900 mb-2 flex items-center gap-2">
                            <User className="size-4 text-blue-600" />
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder="John Doe"
                            className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-900 shadow-lg transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-black text-slate-900 mb-2 flex items-center gap-2">
                            <Mail className="size-4 text-blue-600" />
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@example.com"
                            className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-900 shadow-lg transition-all"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-black text-slate-900 mb-2 flex items-center gap-2">
                            <Phone className="size-4 text-blue-600" />
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="07XXX XXXXXX"
                            className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-900 shadow-lg transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-6 border-2 border-emerald-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                          <Home className="size-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">Property Details</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-black text-slate-900 mb-2 flex items-center gap-2">
                            <MapPin className="size-4 text-emerald-600" />
                            Property Address *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.propertyAddress}
                            onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                            placeholder="123 Main Street, London, SW1A 1AA"
                            className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-900 shadow-lg transition-all"
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-black text-slate-900 mb-2 flex items-center gap-2">
                              <DollarSign className="size-4 text-emerald-600" />
                              Property Value *
                            </label>
                            <div className="relative">
                              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">£</span>
                              <input
                                type="number"
                                required
                                value={formData.propertyValue}
                                onChange={(e) => setFormData({ ...formData, propertyValue: e.target.value })}
                                placeholder="500000"
                                className="w-full pl-10 pr-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-900 shadow-lg transition-all"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-black text-slate-900 mb-2 flex items-center gap-2">
                              <DollarSign className="size-4 text-emerald-600" />
                              Purchase Price *
                            </label>
                            <div className="relative">
                              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">£</span>
                              <input
                                type="number"
                                required
                                value={formData.purchasePrice}
                                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                                placeholder="450000"
                                className="w-full pl-10 pr-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-900 shadow-lg transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Finance Details */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-6 border-2 border-purple-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                          <DollarSign className="size-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">Finance Details</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-black text-slate-900 mb-2 flex items-center gap-2">
                            <Building2 className="size-4 text-purple-600" />
                            Loan Type *
                          </label>
                          <select
                            required
                            value={formData.loanType}
                            onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}
                            className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 font-semibold text-slate-900 shadow-lg transition-all appearance-none cursor-pointer"
                          >
                            <option value="">Select Loan Type</option>
                            {loanTypes.map((loan, index) => (
                              <option key={index} value={loan.title}>{loan.title}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-black text-slate-900 mb-2 flex items-center gap-2">
                            <DollarSign className="size-4 text-purple-600" />
                            Loan Amount *
                          </label>
                          <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">£</span>
                            <input
                              type="number"
                              required
                              value={formData.loanAmount}
                              onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                              placeholder="375000"
                              className="w-full pl-10 pr-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 font-semibold text-slate-900 shadow-lg transition-all"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-black text-slate-900 mb-2 flex items-center gap-2">
                            <Calendar className="size-4 text-purple-600" />
                            Loan Term (months) *
                          </label>
                          <input
                            type="number"
                            required
                            value={formData.loanTerm}
                            onChange={(e) => setFormData({ ...formData, loanTerm: e.target.value })}
                            placeholder="12"
                            className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 font-semibold text-slate-900 shadow-lg transition-all"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-black text-slate-900 mb-2 flex items-center gap-2">
                            <Percent className="size-4 text-purple-600" />
                            Deposit Amount *
                          </label>
                          <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">£</span>
                            <input
                              type="number"
                              required
                              value={formData.deposit}
                              onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                              placeholder="75000"
                              className="w-full pl-10 pr-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 font-semibold text-slate-900 shadow-lg transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Employment Details */}
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-3xl p-6 border-2 border-cyan-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                          <Briefcase className="size-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">Employment Information</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-black text-slate-900 mb-2 flex items-center gap-2">
                            <Briefcase className="size-4 text-cyan-600" />
                            Employment Status *
                          </label>
                          <select
                            required
                            value={formData.employmentStatus}
                            onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                            className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 font-semibold text-slate-900 shadow-lg transition-all appearance-none cursor-pointer"
                          >
                            <option value="">Select Employment Status</option>
                            <option value="Employed">Employed</option>
                            <option value="Self-employed">Self-employed</option>
                            <option value="Retired">Retired</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-black text-slate-900 mb-2 flex items-center gap-2">
                            <DollarSign className="size-4 text-cyan-600" />
                            Annual Income *
                          </label>
                          <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">£</span>
                            <input
                              type="number"
                              required
                              value={formData.annualIncome}
                              onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                              placeholder="60000"
                              className="w-full pl-10 pr-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 font-semibold text-slate-900 shadow-lg transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-3xl p-6 border-2 border-amber-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-amber-600 to-yellow-600 flex items-center justify-center">
                          <FileText className="size-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">Additional Information</h3>
                      </div>
                      <div>
                        <label className="block text-sm font-black text-slate-900 mb-2">
                          Tell us more about your application (optional)
                        </label>
                        <textarea
                          value={formData.additionalInfo}
                          onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                          placeholder="Any additional details that might help your application..."
                          className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-900 shadow-lg transition-all resize-none"
                          rows={4}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit"
                      className="w-full py-5 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-3"
                    >
                      <FileText className="size-6" />
                      Submit Application
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-12 text-center">
                  <div className="inline-flex items-center justify-center size-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mb-6 shadow-xl">
                    <CheckCircle className="size-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-3">Application Submitted!</h3>
                  <p className="text-xl text-slate-600 font-medium mb-2">
                    Thank you for applying for auction finance.
                  </p>
                  <p className="text-lg text-slate-500 font-medium">
                    Our team will review your application and contact you within 24 hours.
                  </p>
                  <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border-2 border-blue-200">
                    <Clock className="size-5 text-blue-600" />
                    <span className="font-bold text-blue-600">Expected response: Within 24 hours</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/60 w-full max-w-4xl my-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 p-8 rounded-t-3xl">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <FileText className="size-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white mb-1">Finance Information</h2>
                    <p className="text-white/90 font-medium">Learn more about our loan options</p>
                  </div>
                </div>
                <button 
                  className="size-10 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                  onClick={() => setShowInfoModal(false)}
                >
                  <X className="size-5 text-white" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              {selectedLoan && (
                <div className="space-y-6">
                  {/* Description */}
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-3xl p-6 border-2 border-slate-200">
                    <p className="text-lg text-slate-700 font-semibold leading-relaxed">{selectedLoan.description}</p>
                  </div>

                  {/* Overview */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border-2 border-blue-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`size-10 rounded-xl bg-gradient-to-br ${selectedLoan.gradient} flex items-center justify-center`}>
                        <DollarSign className="size-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900">Quick Overview</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-2xl p-4 shadow-md">
                        <p className="text-xs font-black text-slate-500 uppercase mb-1">Interest Rate</p>
                        <p className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{selectedLoan.rate}</p>
                      </div>
                      <div className="bg-white rounded-2xl p-4 shadow-md">
                        <p className="text-xs font-black text-slate-500 uppercase mb-1">Loan Term</p>
                        <p className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{selectedLoan.term}</p>
                      </div>
                      <div className="bg-white rounded-2xl p-4 shadow-md">
                        <p className="text-xs font-black text-slate-500 uppercase mb-1">Max LTV</p>
                        <p className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{selectedLoan.features[2]}</p>
                      </div>
                      <div className="bg-white rounded-2xl p-4 shadow-md">
                        <p className="text-xs font-black text-slate-500 uppercase mb-1">Decision Time</p>
                        <p className="text-2xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">24-48hrs</p>
                      </div>
                    </div>
                  </div>

                  {/* How It Works */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-6 border-2 border-purple-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="size-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                        <Sparkles className="size-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900">How It Works</h3>
                    </div>
                    <p className="text-slate-700 font-medium leading-relaxed">{selectedLoan.howItWorks}</p>
                  </div>

                  {/* Who It's For */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-6 border-2 border-emerald-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                        <Users className="size-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900">Who It's For</h3>
                    </div>
                    <ul className="space-y-3">
                      {selectedLoan.whoItsFor.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="size-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="size-4 text-white" />
                          </div>
                          <span className="text-slate-700 font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Benefits */}
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-3xl p-6 border-2 border-cyan-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="size-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                        <Award className="size-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900">Key Benefits</h3>
                    </div>
                    <ul className="space-y-3">
                      {selectedLoan.keyBenefits.map((benefit: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="size-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="size-4 text-white" />
                          </div>
                          <span className="text-slate-700 font-medium">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requirements */}
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-3xl p-6 border-2 border-amber-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="size-10 rounded-xl bg-gradient-to-br from-amber-600 to-yellow-600 flex items-center justify-center">
                        <FileText className="size-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900">Requirements</h3>
                    </div>
                    <ul className="space-y-3">
                      {selectedLoan.requirements.map((req: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="size-6 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Shield className="size-4 text-white" />
                          </div>
                          <span className="text-slate-700 font-medium">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Example Scenario */}
                  <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-3xl p-6 border-2 border-rose-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="size-10 rounded-xl bg-gradient-to-br from-rose-600 to-orange-600 flex items-center justify-center">
                        <TrendingUp className="size-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900">Example Scenario</h3>
                    </div>
                    <p className="text-slate-700 font-medium leading-relaxed bg-white rounded-2xl p-4 shadow-md">{selectedLoan.exampleScenario}</p>
                  </div>

                  {/* CTA Buttons */}
                  <div className="grid md:grid-cols-2 gap-4 pt-4">
                    <button 
                      type="button"
                      className="py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-3"
                      onClick={() => {
                        setShowInfoModal(false);
                        setShowApplicationModal(true);
                      }}
                    >
                      <FileText className="size-5" />
                      Apply Now
                    </button>
                    <button 
                      type="button"
                      className="py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-3"
                      onClick={() => setShowInfoModal(false)}
                    >
                      <X className="size-5" />
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
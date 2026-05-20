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
} from "lucide-react";
import PublicLayout from "@/features/shared/layout/PublicLayout";
import FinanceForm from "../components/FinanceForm";
import FinanceBenefits from "../components/FinanceBenefits";

export default function AuctionFinance() {
  const navigate = useNavigate();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);

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
    <PublicLayout>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>


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

          <FinanceBenefits />
        </div>
      </div>

      <FinanceForm show={showApplicationModal} onClose={() => setShowApplicationModal(false)} />

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

    </PublicLayout>
  );
}


import { useState } from "react";
import {
  DollarSign, Clock, CheckCircle, FileText, X, User, Mail, Phone,
  Home, MapPin, Building2, Percent, Calendar, Briefcase,
} from "lucide-react";
import { preventMinus } from "@/utils/validation";

const loanTypeNames = ["Bridging Finance", "Development Finance", "Refurbishment Finance"];

const emptyForm = {
  fullName: "", email: "", phone: "",
  propertyAddress: "", propertyValue: "", purchasePrice: "",
  loanType: "", loanAmount: "", loanTerm: "", deposit: "",
  employmentStatus: "", annualIncome: "", additionalInfo: "",
};

interface FinanceFormProps {
  show: boolean;
  onClose: () => void;
}

export default function FinanceForm({ show, onClose }: FinanceFormProps) {
  const [formData, setFormData] = useState(emptyForm);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const errors: string[] = [];
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.push("Valid email address is required");
    if (!formData.phone || formData.phone.replace(/[\s\-\+\(\)]/g, "").length < 10) errors.push("Please enter a valid phone number");
    if (errors.length > 0) { setFormError(errors.join(". ")); return; }
    setFormSubmitted(true);
    setTimeout(() => {
      onClose();
      setFormSubmitted(false);
      setFormData(emptyForm);
    }, 3000);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/60 w-full max-w-4xl my-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
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
            <button className="size-10 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-white/30 transition-all" onClick={onClose}>
              <X className="size-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {!formSubmitted ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Personal Information */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border-2 border-blue-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center"><User className="size-5 text-white" /></div>
                    <h3 className="text-2xl font-black text-slate-900">Personal Information</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-black text-slate-900 mb-2 flex items-center gap-2"><User className="size-4 text-blue-600" /> Full Name *</label>
                      <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="John Doe" className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-900 shadow-lg transition-all" />
                    </div>
                    <div>
                      <label className="text-sm font-black text-slate-900 mb-2 flex items-center gap-2"><Mail className="size-4 text-blue-600" /> Email Address *</label>
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-900 shadow-lg transition-all" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-black text-slate-900 mb-2 flex items-center gap-2"><Phone className="size-4 text-blue-600" /> Phone Number *</label>
                      <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="07XXX XXXXXX" className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-900 shadow-lg transition-all" />
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-6 border-2 border-emerald-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center"><Home className="size-5 text-white" /></div>
                    <h3 className="text-2xl font-black text-slate-900">Property Details</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-black text-slate-900 mb-2 flex items-center gap-2"><MapPin className="size-4 text-emerald-600" /> Property Address *</label>
                      <input type="text" required value={formData.propertyAddress} onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })} placeholder="123 Main Street, London, SW1A 1AA" className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-900 shadow-lg transition-all" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-black text-slate-900 mb-2 flex items-center gap-2"><DollarSign className="size-4 text-emerald-600" /> Property Value *</label>
                        <div className="relative"><span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">£</span><input type="number" required min="0" onKeyDown={preventMinus} value={formData.propertyValue} onChange={(e) => { const v = e.target.value; if (v === '' || Number(v) >= 0) setFormData({ ...formData, propertyValue: v }); }} placeholder="500000" className="w-full pl-10 pr-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-900 shadow-lg transition-all" /></div>
                      </div>
                      <div>
                        <label className="text-sm font-black text-slate-900 mb-2 flex items-center gap-2"><DollarSign className="size-4 text-emerald-600" /> Purchase Price *</label>
                        <div className="relative"><span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">£</span><input type="number" required min="0" onKeyDown={preventMinus} value={formData.purchasePrice} onChange={(e) => { const v = e.target.value; if (v === '' || Number(v) >= 0) setFormData({ ...formData, purchasePrice: v }); }} placeholder="450000" className="w-full pl-10 pr-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-900 shadow-lg transition-all" /></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Finance Details */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-6 border-2 border-purple-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center"><DollarSign className="size-5 text-white" /></div>
                    <h3 className="text-2xl font-black text-slate-900">Finance Details</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-black text-slate-900 mb-2 flex items-center gap-2"><Building2 className="size-4 text-purple-600" /> Loan Type *</label>
                      <select required value={formData.loanType} onChange={(e) => setFormData({ ...formData, loanType: e.target.value })} className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 font-semibold text-slate-900 shadow-lg transition-all appearance-none cursor-pointer">
                        <option value="">Select Loan Type</option>
                        {loanTypeNames.map((name) => <option key={name} value={name}>{name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-black text-slate-900 mb-2 flex items-center gap-2"><DollarSign className="size-4 text-purple-600" /> Loan Amount *</label>
                      <div className="relative"><span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">£</span><input type="number" required min="0" onKeyDown={preventMinus} value={formData.loanAmount} onChange={(e) => { const v = e.target.value; if (v === '' || Number(v) >= 0) setFormData({ ...formData, loanAmount: v }); }} placeholder="375000" className="w-full pl-10 pr-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 font-semibold text-slate-900 shadow-lg transition-all" /></div>
                    </div>
                    <div>
                      <label className="text-sm font-black text-slate-900 mb-2 flex items-center gap-2"><Calendar className="size-4 text-purple-600" /> Loan Term (months) *</label>
                      <input type="number" required min="0" onKeyDown={preventMinus} value={formData.loanTerm} onChange={(e) => { const v = e.target.value; if (v === '' || Number(v) >= 0) setFormData({ ...formData, loanTerm: v }); }} placeholder="12" className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 font-semibold text-slate-900 shadow-lg transition-all" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-black text-slate-900 mb-2 flex items-center gap-2"><Percent className="size-4 text-purple-600" /> Deposit Amount *</label>
                      <div className="relative"><span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">£</span><input type="number" required min="0" onKeyDown={preventMinus} value={formData.deposit} onChange={(e) => { const v = e.target.value; if (v === '' || Number(v) >= 0) setFormData({ ...formData, deposit: v }); }} placeholder="75000" className="w-full pl-10 pr-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 font-semibold text-slate-900 shadow-lg transition-all" /></div>
                    </div>
                  </div>
                </div>

                {/* Employment Details */}
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-3xl p-6 border-2 border-cyan-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center"><Briefcase className="size-5 text-white" /></div>
                    <h3 className="text-2xl font-black text-slate-900">Employment Information</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-black text-slate-900 mb-2 flex items-center gap-2"><Briefcase className="size-4 text-cyan-600" /> Employment Status *</label>
                      <select required value={formData.employmentStatus} onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })} className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 font-semibold text-slate-900 shadow-lg transition-all appearance-none cursor-pointer">
                        <option value="">Select Employment Status</option>
                        <option value="Employed">Employed</option>
                        <option value="Self-employed">Self-employed</option>
                        <option value="Retired">Retired</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-black text-slate-900 mb-2 flex items-center gap-2"><DollarSign className="size-4 text-cyan-600" /> Annual Income *</label>
                      <div className="relative"><span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">£</span><input type="number" required min="0" onKeyDown={preventMinus} value={formData.annualIncome} onChange={(e) => { const v = e.target.value; if (v === '' || Number(v) >= 0) setFormData({ ...formData, annualIncome: v }); }} placeholder="60000" className="w-full pl-10 pr-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 font-semibold text-slate-900 shadow-lg transition-all" /></div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-3xl p-6 border-2 border-amber-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-amber-600 to-yellow-600 flex items-center justify-center"><FileText className="size-5 text-white" /></div>
                    <h3 className="text-2xl font-black text-slate-900">Additional Information</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-black text-slate-900 mb-2">Tell us more about your application (optional)</label>
                    <textarea value={formData.additionalInfo} onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })} placeholder="Any additional details that might help your application..." className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-900 shadow-lg transition-all resize-none" rows={4} />
                  </div>
                </div>

                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                    {formError}
                  </div>
                )}
                <button type="submit" className="w-full py-5 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-3">
                  <FileText className="size-6" /> Submit Application
                </button>
              </div>
            </form>
          ) : (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center size-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mb-6 shadow-xl">
                <CheckCircle className="size-10 text-white" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-3">Application Submitted!</h3>
              <p className="text-xl text-slate-600 font-medium mb-2">Thank you for applying for auction finance.</p>
              <p className="text-lg text-slate-500 font-medium">Our team will review your application and contact you within 24 hours.</p>
              <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border-2 border-blue-200">
                <Clock className="size-5 text-blue-600" />
                <span className="font-bold text-blue-600">Expected response: Within 24 hours</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

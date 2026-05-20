import { UserCheck } from "lucide-react";

interface StepSellerProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  theme: { primary: string };
}

export default function StepSeller({ formData, handleInputChange, theme }: StepSellerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`size-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}
        >
          <UserCheck className="size-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Seller / Agent Information
          </h2>
          <p className="text-slate-600 font-medium">
            Contact details for property owner and agent
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Seller Information */}
        <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
          <h3 className="text-lg font-black text-blue-900 mb-4">
            Seller Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Seller Name *
              </label>
              <input
                type="text"
                placeholder="Full name"
                value={formData.sellerName}
                onChange={(e) =>
                  handleInputChange("sellerName", e.target.value)
                }
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Seller Contact Number *
              </label>
              <input
                type="tel"
                placeholder="+44 7700 900000"
                value={formData.sellerContact}
                onChange={(e) =>
                  handleInputChange("sellerContact", e.target.value)
                }
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Seller Email *
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={formData.sellerEmail}
                onChange={(e) =>
                  handleInputChange("sellerEmail", e.target.value)
                }
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Agent Information */}
        <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
          <h3 className="text-lg font-black text-purple-900 mb-4">
            Agent Information (Optional)
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Agent Name
              </label>
              <input
                type="text"
                placeholder="Agent full name"
                value={formData.agentName}
                onChange={(e) =>
                  handleInputChange("agentName", e.target.value)
                }
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Agent Contact
              </label>
              <input
                type="tel"
                placeholder="+44 7700 900000"
                value={formData.agentContact}
                onChange={(e) =>
                  handleInputChange("agentContact", e.target.value)
                }
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
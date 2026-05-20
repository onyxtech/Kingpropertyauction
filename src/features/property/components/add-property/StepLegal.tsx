import { Scale, Shield } from "lucide-react";

interface StepLegalProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  theme: { primary: string };
}

export default function StepLegal({ formData, handleInputChange, theme }: StepLegalProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`size-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}
        >
          <Scale className="size-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Legal Information
          </h2>
          <p className="text-slate-600 font-medium">
            Property legal and ownership details
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Ownership Type *
          </label>
          <select
            value={formData.ownershipType}
            onChange={(e) =>
              handleInputChange("ownershipType", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select ownership type...</option>
            <option value="freehold">Freehold</option>
            <option value="leasehold">Leasehold</option>
            <option value="shared">Shared Ownership</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Title Deed Number
          </label>
          <input
            type="text"
            placeholder="e.g., TD-123456789"
            value={formData.titleDeedNumber}
            onChange={(e) =>
              handleInputChange("titleDeedNumber", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Property Tax Information
          </label>
          <input
            type="text"
            placeholder="Annual tax amount or reference"
            value={formData.propertyTaxInfo}
            onChange={(e) =>
              handleInputChange("propertyTaxInfo", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Mortgage Status *
          </label>
          <select
            value={formData.mortgageStatus}
            onChange={(e) =>
              handleInputChange("mortgageStatus", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="clear">Clear (No Mortgage)</option>
            <option value="mortgaged">Mortgaged</option>
            <option value="partially_paid">Partially Paid</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Zoning Type
          </label>
          <input
            type="text"
            placeholder="e.g., Residential, Commercial Mixed-Use"
            value={formData.zoningType}
            onChange={(e) =>
              handleInputChange("zoningType", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="size-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-amber-900 mb-1">
              Legal Compliance Notice
            </h4>
            <p className="text-sm text-amber-800">
              All information provided must be accurate and verifiable.
              Legal documents will be verified during the approval
              process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
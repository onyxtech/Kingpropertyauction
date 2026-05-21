import { Building2 } from "lucide-react";

interface StepBasicInfoProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  theme: { primary: string };
}

export default function StepBasicInfo({ formData, handleInputChange, theme }: StepBasicInfoProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`size-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}
        >
          <Building2 className="size-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Basic Property Information
          </h2>
          <p className="text-slate-600 font-medium">
            Enter essential property details
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Property Title *
          </label>
          <input
            type="text"
            placeholder="e.g., Luxury Modern Villa in Mayfair"
            value={formData.propertyTitle}
            onChange={(e) =>
              handleInputChange("propertyTitle", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Property Description *
          </label>
          <textarea
            rows={5}
            placeholder="Describe the property features, location highlights, and unique selling points..."
            value={formData.propertyDescription}
            onChange={(e) =>
              handleInputChange("propertyDescription", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Property Type *
          </label>
          <select
            value={formData.propertyType}
            onChange={(e) =>
              handleInputChange("propertyType", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="land">Land / Plot</option>
            <option value="commercial">Commercial Property</option>
            <option value="farmhouse">Farmhouse</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Property Category *
          </label>
          <select
            value={formData.propertyCategory}
            onChange={(e) =>
              handleInputChange("propertyCategory", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Listing Type *
          </label>
          <select
            value={formData.listingType}
            onChange={(e) =>
              handleInputChange("listingType", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="auction">Auction</option>
            <option value="direct_sale">Direct Sale</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Property Status *
          </label>
          <select
            value={formData.propertyStatus}
            onChange={(e) =>
              handleInputChange("propertyStatus", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="available">Available</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Property ID / Listing ID
          </label>
          <input
            type="text"
            placeholder="Auto-generated if left empty"
            value={formData.propertyID}
            onChange={(e) =>
              handleInputChange("propertyID", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
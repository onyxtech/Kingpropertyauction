import { Home, Square, Bed, Bath, Calendar, Car } from "lucide-react";

interface StepSpecificationsProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  theme: { primary: string };
}

export default function StepSpecifications({ formData, handleInputChange, theme }: StepSpecificationsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`size-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}
        >
          <Home className="size-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Property Specifications
          </h2>
          <p className="text-slate-600 font-medium">
            Provide detailed measurements and features
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            <Square className="inline size-4 mr-1" />
            Total Area (sq ft) *
          </label>
          <input
            type="number"
            placeholder="e.g., 2500"
            value={formData.totalArea}
            onChange={(e) =>
              handleInputChange("totalArea", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Land Area (sq ft)
          </label>
          <input
            type="number"
            placeholder="e.g., 3000"
            value={formData.landArea}
            onChange={(e) =>
              handleInputChange("landArea", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Covered Area (sq ft)
          </label>
          <input
            type="number"
            placeholder="e.g., 2500"
            value={formData.coveredArea}
            onChange={(e) =>
              handleInputChange("coveredArea", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            <Bed className="inline size-4 mr-1" />
            Number of Bedrooms *
          </label>
          <input
            type="number"
            placeholder="e.g., 4"
            value={formData.bedrooms}
            onChange={(e) =>
              handleInputChange("bedrooms", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            <Bath className="inline size-4 mr-1" />
            Number of Bathrooms *
          </label>
          <input
            type="number"
            placeholder="e.g., 3"
            value={formData.bathrooms}
            onChange={(e) =>
              handleInputChange("bathrooms", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Number of Floors
          </label>
          <input
            type="number"
            placeholder="e.g., 2"
            value={formData.floors}
            onChange={(e) =>
              handleInputChange("floors", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            <Calendar className="inline size-4 mr-1" />
            Year Built
          </label>
          <input
            type="number"
            placeholder="e.g., 2020"
            value={formData.yearBuilt}
            onChange={(e) =>
              handleInputChange("yearBuilt", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            <Car className="inline size-4 mr-1" />
            Parking Spaces
          </label>
          <input
            type="number"
            placeholder="e.g., 2"
            value={formData.parkingSpaces}
            onChange={(e) =>
              handleInputChange("parkingSpaces", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Furnished / Unfurnished *
          </label>
          <select
            value={formData.furnishedStatus}
            onChange={(e) =>
              handleInputChange("furnishedStatus", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="unfurnished">Unfurnished</option>
            <option value="semi-furnished">Semi-Furnished</option>
            <option value="fully-furnished">Fully Furnished</option>
          </select>
        </div>
      </div>
    </div>
  );
}
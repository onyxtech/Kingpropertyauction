import { CheckCircle, Building2, MapPin, Home, Bed, Bath, DollarSign, UserCheck, Pencil } from "lucide-react";

interface StepReviewProps {
  formData: any;
  theme: { primary: string };
  onEditStep?: (step: number) => void;
}

export default function StepReview({ formData, theme, onEditStep }: StepReviewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`size-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}
        >
          <CheckCircle className="size-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Review & Submit
          </h2>
          <p className="text-slate-600 font-medium">
            Verify all information before submission
          </p>
        </div>
      </div>

      {/* Review Summary */}
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
          <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <Building2 className="size-5 text-blue-600" />
            Basic Information
            {onEditStep && (
              <button type="button" onClick={() => onEditStep(1)} className="ml-auto flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                <Pencil className="size-3.5" /> Edit
              </button>
            )}
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-bold text-slate-600">Title:</span>
              <p className="text-slate-900 font-medium">
                {formData.propertyTitle || "Not provided"}
              </p>
            </div>
            <div>
              <span className="font-bold text-slate-600">Type:</span>
              <p className="text-slate-900 font-medium capitalize">
                {formData.propertyType}
              </p>
            </div>
            <div>
              <span className="font-bold text-slate-600">
                Category:
              </span>
              <p className="text-slate-900 font-medium capitalize">
                {formData.propertyCategory}
              </p>
            </div>
            <div>
              <span className="font-bold text-slate-600">Status:</span>
              <p className="text-slate-900 font-medium capitalize">
                {formData.propertyStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
          <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <MapPin className="size-5 text-green-600" />
            Location
            {onEditStep && (
              <button type="button" onClick={() => onEditStep(2)} className="ml-auto flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                <Pencil className="size-3.5" /> Edit
              </button>
            )}
          </h3>
          <div className="text-sm">
            <p className="text-slate-900 font-medium">
              {formData.streetAddress}, {formData.area}, {formData.city}
              , {formData.state} {formData.postalCode}
            </p>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
          <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <Home className="size-5 text-purple-600" />
            Specifications
            {onEditStep && (
              <button type="button" onClick={() => onEditStep(3)} className="ml-auto flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                <Pencil className="size-3.5" /> Edit
              </button>
            )}
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Bed className="size-4 text-purple-600" />
              <span className="font-bold">
                {formData.bedrooms || "N/A"} Bedrooms
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="size-4 text-purple-600" />
              <span className="font-bold">
                {formData.bathrooms || "N/A"} Bathrooms
              </span>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
          <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <DollarSign className="size-5 text-green-600" />
            Pricing
            {onEditStep && (
              <button type="button" onClick={() => onEditStep(4)} className="ml-auto flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                <Pencil className="size-3.5" /> Edit
              </button>
            )}
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-bold text-slate-600">
                Starting Price:
              </span>
              <p className="text-slate-900 font-medium">
                £{formData.startingAuctionPrice
                  ? Number(
                      formData.startingAuctionPrice,
                    ).toLocaleString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <span className="font-bold text-slate-600">
                Reserve Price:
              </span>
              <p className="text-slate-900 font-medium">
                £{formData.reservePrice
                  ? Number(formData.reservePrice).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Agent Information */}
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
          <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <UserCheck className="size-5 text-orange-600" />
            Agent Information
            {onEditStep && (
              <button type="button" onClick={() => onEditStep(8)} className="ml-auto flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                <Pencil className="size-3.5" /> Edit
              </button>
            )}
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-bold text-slate-600">Agent Name:</span>
              <p className="text-slate-900 font-medium">
                {formData.agentName || "Not assigned"}
              </p>
            </div>
            <div>
              <span className="font-bold text-slate-600">Agent Contact:</span>
              <p className="text-slate-900 font-medium">
                {formData.agentContact || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
          <h3 className="text-lg font-black text-slate-900 mb-4">
            System Information
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-bold text-slate-600">
                Created By:
              </span>
              <p className="text-slate-900 font-medium">
                {formData.createdBy}
              </p>
            </div>
            <div>
              <span className="font-bold text-slate-600">
                Created Date:
              </span>
              <p className="text-slate-900 font-medium">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="font-bold text-slate-600">
                Approval Status:
              </span>
              <p className="text-amber-600 font-bold capitalize">
                {formData.approvalStatus}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            className="size-5 rounded accent-blue-600 mt-1"
          />
          <div className="text-sm">
            <span className="font-bold text-slate-900">
              I confirm that all information provided is accurate and
              complete. *
            </span>
            <p className="text-slate-600 mt-1">
              By submitting this property, you agree to our Terms of
              Service and Privacy Policy. Your property will be reviewed
              by our team before going live.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
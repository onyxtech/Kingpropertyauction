import { CheckCircle, Building2, MapPin, Home, Bed, Bath, DollarSign, UserCheck, Pencil, Scale, FileText, Camera, Gavel, Star } from "lucide-react";

interface StepReviewProps {
  formData: any;
  theme: { primary: string };
  onEditStep?: (step: number) => void;
  isAdmin?: boolean;
}

export default function StepReview({ formData, theme, onEditStep, isAdmin }: StepReviewProps) {
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

        {/* Auction Details */}
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
          <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <Gavel className="size-5 text-red-600" />
            Auction Details
            {onEditStep && (
              <button type="button" onClick={() => onEditStep(5)} className="ml-auto flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                <Pencil className="size-3.5" /> Edit
              </button>
            )}
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-bold text-slate-600">Auction Status:</span>
              <p className="text-slate-900 font-medium capitalize">
                {formData.auctionStatus || "Not set"}
              </p>
            </div>
            <div>
              <span className="font-bold text-slate-600">Auto Bid:</span>
              <p className="text-slate-900 font-medium">
                {formData.autoBidEnabled ? "Enabled" : "Disabled"}
              </p>
            </div>
            {formData.bidDepositAmount && (
              <div>
                <span className="font-bold text-slate-600">Bid Deposit:</span>
                <p className="text-slate-900 font-medium">£{Number(formData.bidDepositAmount).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
          <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <Star className="size-5 text-yellow-500" />
            Property Features
            {onEditStep && (
              <button type="button" onClick={() => onEditStep(6)} className="ml-auto flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                <Pencil className="size-3.5" /> Edit
              </button>
            )}
          </h3>
          <div className="flex flex-wrap gap-2 text-sm">
            {formData.features && Object.entries(formData.features).some(([, v]) => v) ? (
              Object.entries(formData.features)
                .filter(([, v]) => v)
                .map(([k]) => (
                  <span key={k} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold capitalize">
                    {k.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                ))
            ) : (
              <p className="text-slate-500 font-medium">No special features selected</p>
            )}
          </div>
        </div>

        {/* Legal Info */}
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
          <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <Scale className="size-5 text-amber-600" />
            Legal Information
            {onEditStep && (
              <button type="button" onClick={() => onEditStep(7)} className="ml-auto flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                <Pencil className="size-3.5" /> Edit
              </button>
            )}
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-bold text-slate-600">Ownership Type:</span>
              <p className="text-slate-900 font-medium capitalize">
                {formData.ownershipType || "Not selected"}
              </p>
            </div>
            {formData.titleDeedNumber && (
              <div>
                <span className="font-bold text-slate-600">Title Deed:</span>
                <p className="text-slate-900 font-medium">{formData.titleDeedNumber}</p>
              </div>
            )}
            {(formData.solicitorDetails?.name || formData.solicitorDetails?.firmName) && (
              <div>
                <span className="font-bold text-slate-600">Solicitor:</span>
                <p className="text-slate-900 font-medium">
                  {formData.solicitorDetails?.name && `${formData.solicitorDetails.name}`}
                  {formData.solicitorDetails?.firmName && ` — ${formData.solicitorDetails.firmName}`}
                </p>
              </div>
            )}
            <div>
              <span className="font-bold text-slate-600">Documents:</span>
              <p className="text-slate-900 font-medium flex items-center gap-1">
                <FileText className="size-3.5 text-amber-600" />
                {formData.newPrivateDocs?.length || 0} document(s) queued
              </p>
            </div>
          </div>
        </div>

        {/* Seller / Agent Details */}
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
          <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <UserCheck className="size-5 text-orange-600" />
            Seller / Agent Details
            {onEditStep && isAdmin && (
              <button type="button" onClick={() => onEditStep(8)} className="ml-auto flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                <Pencil className="size-3.5" /> Edit
              </button>
            )}
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-bold text-slate-600">Agent Name:</span>
              <p className="text-slate-900 font-medium">
                {formData.agentName || "Not provided"}
              </p>
            </div>
            <div>
              <span className="font-bold text-slate-600">Contact:</span>
              <p className="text-slate-900 font-medium">
                {formData.agentContact || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
          <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <Camera className="size-5 text-indigo-600" />
            Media
            {onEditStep && (
              <button type="button" onClick={() => onEditStep(isAdmin ? 9 : 8)} className="ml-auto flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                <Pencil className="size-3.5" /> Edit
              </button>
            )}
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-bold text-slate-600">Images:</span>
              <p className="text-slate-900 font-medium">{formData.propertyImages?.length || 0} file(s)</p>
            </div>
            <div>
              <span className="font-bold text-slate-600">Videos:</span>
              <p className="text-slate-900 font-medium">{formData.propertyVideos?.length || 0} file(s)</p>
            </div>
            <div>
              <span className="font-bold text-slate-600">Floor Plans:</span>
              <p className="text-slate-900 font-medium">{formData.floorPlans?.length || 0} file(s)</p>
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
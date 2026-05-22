import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Building2,
  MapPin,
  Home,
  DollarSign,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Gavel,
  Star,
  Scale,
  UserCheck,
  Camera,
  X,
  AlertCircle,
} from "lucide-react";
import PublicLayout from "@/features/shared/layout/PublicLayout";
import { useTheme } from "@/app/hooks/useTheme";
import { useAuthStore } from "@/stores/authStore";
import { usePropertyApi } from "@/features/property/api/usePropertyApi";
import type { PropertyFormData } from "@/app/types/api";
import StepBasicInfo from "../components/add-property/StepBasicInfo";
import StepLocation from "../components/add-property/StepLocation";
import StepSpecifications from "../components/add-property/StepSpecifications";
import StepPricing from "../components/add-property/StepPricing";
import StepAuction from "../components/add-property/StepAuction";
import StepFeatures from "../components/add-property/StepFeatures";
import StepLegal from "../components/add-property/StepLegal";
import StepSeller from "../components/add-property/StepSeller";
import StepMedia from "../components/add-property/StepMedia";
import StepReview from "../components/add-property/StepReview";

type LocalPropertyFormData = Omit<
  PropertyFormData,
  "propertyImages" | "propertyVideo" | "propertyVideos" | "floorPlan" | "floorPlans" | "legalDocuments"
> & {
  propertyImages: File[];
  propertyVideos: File[];
  floorPlans: File[];
  legalDocuments: File[];
  [key: string]: any;
};

export default function AddProperty() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";
  const { useCreateProperty, useUploadPropertyImages } = usePropertyApi();
  const { mutateAsync: createProperty, isPending: apiLoading } =
    useCreateProperty();
  const { mutateAsync: uploadPropertyImages } = useUploadPropertyImages();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = isAdmin ? 10 : 9;
  const formRef = useRef<HTMLDivElement>(null);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<LocalPropertyFormData>({
    propertyTitle: "",
    propertyDescription: "",
    propertyType: "house",
    propertyCategory: "residential",
    listingType: "auction",
    propertyID: "",
    propertyStatus: "available",
    country: "United Kingdom",
    state: "",
    city: "",
    area: "",
    streetAddress: "",
    postalCode: "",
    totalArea: "",
    auctionStartDate: "",
    auctionEndDate: "",
    mortgageStatus: "clear",
    bedrooms: "",
    bathrooms: "",
    floors: "",
    yearBuilt: "",
    parkingSpaces: "",
    furnishedStatus: "unfurnished",
    startingAuctionPrice: "",
    reservePrice: "",
    buyNowPrice: "",
    minimumBidIncrement: "",
    estimatedMarketValue: "",
    currency: "GBP",
    auctionStatus: "upcoming",
    bidDepositAmount: "",
    autoBidEnabled: false,
    maximumBidLimit: "",
    features: {
      garden: false,
      swimmingPool: false,
      balcony: false,
      airConditioning: false,
      securitySystem: false,
      elevator: false,
      gym: false,
      solarSystem: false,
    },
    ownershipType: "",
    titleDeedNumber: "",
    agentName: "",
    agentContact: "",
    propertyImages: [] as File[],
    propertyVideos: [] as File[],
    virtualTour: "",
    floorPlans: [] as File[],
    legalDocuments: [] as File[],
    createdBy: "Current User",
    approvalStatus: "pending",
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [createdTitle, setCreatedTitle] = useState("");
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [uploadedVideoUrls, setUploadedVideoUrls] = useState<string[]>([]);
  const [uploadedFloorPlanUrls, setUploadedFloorPlanUrls] = useState<string[]>([]);
  const [uploadedLegalDocUrls, setUploadedLegalDocUrls] = useState<string[]>([]);

  const handleInputChange = (field: string, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleFeatureToggle = (feature: string) => {
    setFormData({
      ...formData,
      features: {
        ...formData.features,
        [feature]:
          !formData.features[feature as keyof typeof formData.features],
      },
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData({
        ...formData,
        propertyImages: [...formData.propertyImages, ...filesArray],
      });
      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () =>
          setUploadedImages((prev) => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      propertyImages: formData.propertyImages.filter((_, i) => i !== index),
    });
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors: string[] = [];
    if (!formData.propertyTitle?.trim())
      errors.push("Property title is required");
    if (!formData.propertyDescription?.trim())
      errors.push("Property description is required");
    if (!formData.propertyType) errors.push("Property type is required");
    if (!formData.listingType) errors.push("Listing type is required");
    if (!formData.country?.trim()) errors.push("Country is required");
    if (!formData.state?.trim()) errors.push("State/County is required");
    if (!formData.city?.trim()) errors.push("City is required");
    if (!formData.area?.trim()) errors.push("Area is required");
    if (!formData.streetAddress?.trim())
      errors.push("Street address is required");
    if (!formData.postalCode?.trim()) errors.push("Postal code is required");
    if (!formData.bedrooms) errors.push("Number of bedrooms is required");
    if (!formData.bathrooms) errors.push("Number of bathrooms is required");
    if (!formData.startingAuctionPrice)
      errors.push("Starting auction price is required");
    if (!formData.reservePrice) errors.push("Reserve price is required");
    if (!formData.minimumBidIncrement)
      errors.push("Minimum bid increment is required");
    if (!formData.ownershipType) errors.push("Ownership type is required");
    if (formData.startingAuctionPrice && Number(formData.startingAuctionPrice) < 1)
      errors.push("Starting auction price must be at least £1");
    if (formData.reservePrice && Number(formData.reservePrice) < 1)
      errors.push("Reserve price must be at least £1");
    if (formData.minimumBidIncrement && Number(formData.minimumBidIncrement) < 100)
      errors.push("Minimum bid increment must be at least £100");
    if (formData.bedrooms && (Number(formData.bedrooms) < 0 || Number(formData.bedrooms) > 50))
      errors.push("Bedrooms must be between 0 and 50");
    if (formData.bathrooms && (Number(formData.bathrooms) < 0 || Number(formData.bathrooms) > 50))
      errors.push("Bathrooms must be between 0 and 50");
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Step 1: Validate FIRST - no uploads yet
    const errors = validateForm();
    if (errors.length > 0) {
      setToastMessage({ text: errors.join("\n"), type: "error" });
      setTimeout(() => setToastMessage(null), 8000);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return; // EXIT - no uploads happen
    }

    // Step 2: Only upload files AFTER validation passes
    setIsSubmitting(true);
    try {
      // Images - only upload if not already done
      let imageUrls: string[] = uploadedImageUrls;
      if (imageUrls.length === 0 && formData.propertyImages.length > 0) {
        try {
          const uploadResponse = await uploadPropertyImages(formData.propertyImages);
          if (uploadResponse.success && uploadResponse.data) {
            imageUrls = uploadResponse.data.map((img: any) => img.fileUrl || img);
            setUploadedImageUrls(imageUrls);
          }
        } catch (uploadErr) {
          console.error("Image upload failed:", uploadErr);
        }
      }
      // Videos - only upload if not already done
      let videoUrls: string[] = uploadedVideoUrls;
      if (videoUrls.length === 0) {
        for (const vid of (formData.propertyVideos || [])) {
          try {
            const vfd = new FormData();
            vfd.append("propertyVideos", vid);
            const vr = await fetch("/api/upload/video", {
              method: "POST",
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
              body: vfd,
            });
            const vd = await vr.json();
            if (vd?.success && vd.data) {
              const urls = Array.isArray(vd.data) ? vd.data.map((f: any) => f.fileUrl) : [vd.data.fileUrl];
              videoUrls = [...videoUrls, ...urls];
            }
          } catch (e) { console.error("Video upload failed:", e); }
        }
        if (videoUrls.length > 0) setUploadedVideoUrls(videoUrls);
      }
      // Floor plans - only upload if not already done
      let floorPlanUrls: string[] = uploadedFloorPlanUrls;
      if (floorPlanUrls.length === 0) {
        for (const fp of (formData.floorPlans || [])) {
          try {
            const ffd = new FormData();
            ffd.append("floorPlans", fp);
            const fr = await fetch("/api/upload/floorplan", {
              method: "POST",
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
              body: ffd,
            });
            const fd = await fr.json();
            if (fd?.success && fd.data) {
              const urls = Array.isArray(fd.data) ? fd.data.map((f: any) => f.fileUrl) : [fd.data.fileUrl];
              floorPlanUrls = [...floorPlanUrls, ...urls];
            }
          } catch (e) { console.error("Floor plan upload failed:", e); }
        }
        if (floorPlanUrls.length > 0) setUploadedFloorPlanUrls(floorPlanUrls);
      }
      // Legal docs - only upload if not already done
      let legalDocUrls: string[] = uploadedLegalDocUrls;
      if (legalDocUrls.length === 0 && formData.legalDocuments?.length > 0) {
        try {
          const lfd = new FormData();
          formData.legalDocuments.forEach((doc: File) =>
            lfd.append("legalDocuments", doc),
          );
          const lr = await fetch("/api/upload/documents", {
            method: "POST",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            body: lfd,
          });
          const ld = await lr.json();
          if (ld?.success && ld.data) {
            legalDocUrls = ld.data.map((d: any) => d.fileUrl);
            setUploadedLegalDocUrls(legalDocUrls);
          }
        } catch (e) {
          console.error("Documents upload failed:", e);
        }
      }

      // ORIGINAL FLAT SPREAD - keep all fields flat like the old code
      const propertyData: any = {
        ...formData,
        media: {
          propertyImages:
            imageUrls.length > 0
              ? imageUrls
              : [
                  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
                ],
          propertyVideos: videoUrls,
          floorPlans: floorPlanUrls,
          legalDocuments: legalDocUrls,
        },
      };
      delete propertyData.propertyImages;
      delete propertyData.propertyVideos;
      delete propertyData.floorPlans;
      delete propertyData.legalDocuments;

      const response = await createProperty(propertyData);
      if (response.success) {
        setUploadedImageUrls([]);
        setUploadedVideoUrls([]);
        setUploadedFloorPlanUrls([]);
        setUploadedLegalDocUrls([]);
        setCreatedTitle(formData.propertyTitle || "Property");
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "instant" });
      } else {
        setToastMessage({
          text: `Failed: ${response.error || "Unknown error"}`,
          type: "error",
        });
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err: any) {
      console.error("Error submitting property:", err);
      const errorMsg =
        err?.message ||
        err?.response?.data?.message ||
        "An error occurred. Please try again.";
      // Make validation errors more readable
      const cleanMsg = errorMsg
        .replace(/"/g, "")
        .replace("location.state", "State/Province")
        .replace("specifications.bedrooms", "Bedrooms")
        .replace("specifications.bathrooms", "Bathrooms")
        .replace("pricing.startingAuctionPrice", "Starting Auction Price")
        .replace("pricing.reservePrice", "Reserve Price")
        .replace("pricing.minimumBidIncrement", "Minimum Bid Increment")
        .replace("legalInfo.ownershipType", "Ownership Type")
        .replace("propertyTitle", "Property Title")
        .replace("propertyDescription", "Property Description")
        .replace("propertyType", "Property Type")
        .replace(/\s+/g, " ");
      setToastMessage({ text: cleanMsg, type: "error" });
      setTimeout(() => setToastMessage(null), 6000);
    } finally {
      setIsSubmitting(false); // Re-enable after everything is done
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const nextStep = () => {
    const next = currentStep + 1;
    if (next <= totalSteps) {
      setCurrentStep(next);
      scrollToForm();
    }
  };
  const prevStep = () => {
    const prev = currentStep - 1;
    if (prev >= 1) {
      setCurrentStep(prev);
      scrollToForm();
    }
  };
  const goToStep = (step: number) => {
    if (!isAdmin && step === 8) return;
    setCurrentStep(step);
    scrollToForm();
  };

  const steps = [
    { number: 1, title: "Basic Information", icon: Building2 },
    { number: 2, title: "Location Details", icon: MapPin },
    { number: 3, title: "Specifications", icon: Home },
    { number: 4, title: "Pricing", icon: DollarSign },
    { number: 5, title: "Auction Details", icon: Gavel },
    { number: 6, title: "Features", icon: Star },
    { number: 7, title: "Legal Info", icon: Scale },
    ...(isAdmin
      ? [{ number: 8, title: "Seller/Agent", icon: UserCheck }]
      : []
    ),
    { number: isAdmin ? 9 : 8, title: "Media", icon: Camera },
    { number: isAdmin ? 10 : 9, title: "Review", icon: CheckCircle },
  ];

  if (submitted) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-6 py-16 text-center">
          <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border-2 border-white/60">
            <CheckCircle className="size-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-slate-900 mb-3">
              Property Created Successfully!
            </h2>
            <p className="text-slate-600 font-medium mb-8">{createdTitle}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/admin/properties")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all"
              >
                View Properties
              </button>
              <button
                onClick={() => {
                  setFormData({
                    propertyTitle: "",
                    propertyDescription: "",
                    propertyType: "house",
                    propertyCategory: "residential",
                    listingType: "auction",
                    propertyID: "",
                    propertyStatus: "available",
                    country: "United Kingdom",
                    state: "",
                    city: "",
                    area: "",
                    streetAddress: "",
                    postalCode: "",
                    totalArea: "",
                    auctionStartDate: "",
                    auctionEndDate: "",
                    mortgageStatus: "clear",
                    bedrooms: "",
                    bathrooms: "",
                    floors: "",
                    yearBuilt: "",
                    parkingSpaces: "",
                    furnishedStatus: "unfurnished",
                    startingAuctionPrice: "",
                    reservePrice: "",
                    buyNowPrice: "",
                    minimumBidIncrement: "",
                    estimatedMarketValue: "",
                    currency: "GBP",
                    auctionStatus: "upcoming",
                    bidDepositAmount: "",
                    autoBidEnabled: false,
                    maximumBidLimit: "",
                    features: {
                      garden: false,
                      swimmingPool: false,
                      balcony: false,
                      airConditioning: false,
                      securitySystem: false,
                      elevator: false,
                      gym: false,
                      solarSystem: false,
                    },
                    ownershipType: "",
                    titleDeedNumber: "",
                    agentName: "",
                    agentContact: "",
                    propertyImages: [] as File[],
                    propertyVideos: [] as File[],
                    virtualTour: "",
                    floorPlans: [] as File[],
                    legalDocuments: [] as File[],
                    createdBy: "Current User",
                    approvalStatus: "pending",
                  });
                  setUploadedImages([]);
                  setUploadedImageUrls([]);
                  setUploadedVideoUrls([]);
                  setUploadedFloorPlanUrls([]);
                  setUploadedLegalDocUrls([]);
                  setSubmitted(false);
                  setCurrentStep(1);
                  window.scrollTo({ top: 0, behavior: "instant" });
                }}
                className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:border-slate-300 transition-all"
              >
                Add Another Property
              </button>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-3 flex items-center justify-center gap-3">
            <Building2 className="size-10 text-blue-600" /> Add New Property
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            Complete all steps to list your property for auction
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 mb-8">
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <button
                      type="button"
                      onClick={() => goToStep(step.number)}
                      className={`size-12 rounded-xl flex items-center justify-center font-bold transition-all ${isCompleted ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg hover:scale-105" : isActive ? `bg-gradient-to-br ${theme.primary} text-white shadow-xl scale-110` : "bg-slate-200 text-slate-500 hover:bg-slate-300"}`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="size-6" />
                      ) : (
                        <Icon className="size-6" />
                      )}
                    </button>
                    <span
                      className={`text-xs font-bold mt-2 text-center ${isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-slate-500"}`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 rounded-full transition-all ${currentStep > step.number ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-slate-200"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div ref={formRef}>
          <form
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60"
          >
            {currentStep === 1 && (
              <StepBasicInfo
                formData={formData}
                handleInputChange={handleInputChange}
                theme={theme}
              />
            )}
            {currentStep === 2 && (
              <StepLocation
                formData={formData}
                handleInputChange={handleInputChange}
                theme={theme}
              />
            )}
            {currentStep === 3 && (
              <StepSpecifications
                formData={formData}
                handleInputChange={handleInputChange}
                theme={theme}
              />
            )}
            {currentStep === 4 && (
              <StepPricing
                formData={formData}
                handleInputChange={handleInputChange}
                theme={theme}
              />
            )}
            {currentStep === 5 && (
              <StepAuction
                formData={formData}
                handleInputChange={handleInputChange}
                theme={theme}
              />
            )}
            {currentStep === 6 && (
              <StepFeatures
                formData={formData}
                handleFeatureToggle={handleFeatureToggle}
                theme={theme}
              />
            )}
            {currentStep === 7 && (
              <StepLegal
                formData={formData}
                handleInputChange={handleInputChange}
                theme={theme}
              />
            )}
            {currentStep === 8 && isAdmin && (
              <StepSeller
                formData={formData}
                handleInputChange={handleInputChange}
                theme={theme}
              />
            )}
            {currentStep === (isAdmin ? 9 : 8) && (
              <StepMedia
                formData={formData}
                uploadedImages={uploadedImages}
                handleInputChange={handleInputChange}
                handleImageUpload={handleImageUpload}
                removeImage={removeImage}
                theme={theme}
              />
            )}
            {currentStep === (isAdmin ? 10 : 9) && (
              <StepReview
                formData={formData}
                theme={theme}
                onEditStep={goToStep}
              />
            )}
            <div className="flex items-center justify-end gap-3 pt-8 border-t-2 border-slate-200">
              <p className="text-sm font-bold text-slate-600 mr-auto">
                Step {currentStep} of {totalSteps}
              </p>
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 ${currentStep === 1 ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`}
              >
                <ChevronLeft className="size-5" /> Previous
              </button>
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className={`px-8 py-4 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-2`}
                >
                  Next <ChevronRight className="size-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={apiLoading || isSubmitting}
                  className={`px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 ${(apiLoading || isSubmitting) ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
                >
                  {apiLoading || isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin size-5"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Creating Property...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="size-5" /> Submit Property
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold max-w-sm ${toastMessage.type === "success" ? "bg-green-500" : "bg-red-500"}`}
        >
          {toastMessage.text.includes("\n") ? (
            <div className="flex items-start gap-2">
              <AlertCircle className="size-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-black mb-1">Please fix these issues:</p>
                {toastMessage.text.split("\n").map((err, i) => (
                  <p key={i} className="text-sm font-medium">
                    • {err}
                  </p>
                ))}
              </div>
              <button
                onClick={() => setToastMessage(null)}
                className="ml-1 flex-shrink-0"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <span>
              {toastMessage.text}
              <button onClick={() => setToastMessage(null)} className="ml-3">
                <X className="size-4 inline" />
              </button>
            </span>
          )}
        </div>
      )}
    </PublicLayout>
  );
}

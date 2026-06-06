import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Save, ArrowLeft, ChevronRight, ChevronLeft, CheckCircle, AlertCircle,
  Building2, MapPin, Home, DollarSign, Gavel, Star, Scale, UserCheck, Camera,
} from "lucide-react";
import CustomerLayout from "../components/CustomerLayout";
import { usePropertyApi } from "@/features/property/api/usePropertyApi";
import { useAuthStore } from "@/stores/authStore";
import { useCustomerRole } from "../hooks/useCustomerRole";
import { apiClient } from "@/lib/apiClient";
import { showSuccess, showError } from "@/lib/toast";
import { useQueryClient } from "@tanstack/react-query";

import StepBasic from "@/features/admin/components/edit-property/StepBasic";
import StepLocation from "@/features/admin/components/edit-property/StepLocation";
import StepSpecifications from "@/features/admin/components/edit-property/StepSpecifications";
import StepPricing from "@/features/admin/components/edit-property/StepPricing";
import StepAuction from "@/features/admin/components/edit-property/StepAuction";
import StepFeatures from "@/features/admin/components/edit-property/StepFeatures";
import StepLegal from "@/features/admin/components/edit-property/StepLegal";
import StepSeller from "@/features/admin/components/edit-property/StepSeller";
import StepMedia from "@/features/admin/components/edit-property/StepMedia";

const STEPS = [
  { number: 1, title: "Basic", icon: Building2 },
  { number: 2, title: "Location", icon: MapPin },
  { number: 3, title: "Specs", icon: Home },
  { number: 4, title: "Pricing", icon: DollarSign },
  { number: 5, title: "Auction", icon: Gavel },
  { number: 6, title: "Features", icon: Star },
  { number: 7, title: "Legal", icon: Scale },
  { number: 8, title: "Seller", icon: UserCheck },
  { number: 9, title: "Media", icon: Camera },
];

export default function CustomerEditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { canAddProperty } = useCustomerRole();
  const { useGetPropertyById, useUploadPropertyImages } = usePropertyApi();
  const { data: property, isLoading } = useGetPropertyById(id || "");
  const { mutateAsync: uploadImages } = useUploadPropertyImages();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [floorPlanFiles, setFloorPlanFiles] = useState<File[]>([]);
  const [existingVideos, setExistingVideos] = useState<string[]>([]);
  const [existingFloorPlans, setExistingFloorPlans] = useState<string[]>([]);
  const [existingLegalDocs, setExistingLegalDocs] = useState<string[]>([]);
  const [legalDocFiles, setLegalDocFiles] = useState<File[]>([]);

  const defaultForm = {
    propertyTitle: "",
    propertyDescription: "",
    propertyType: "house",
    propertyCategory: "residential",
    listingType: "auction",
    propertyStatus: "available",
    approvalStatus: "pending",
    country: "",
    state: "",
    city: "",
    area: "",
    streetAddress: "",
    postalCode: "",
    bedrooms: "",
    bathrooms: "",
    floors: "",
    yearBuilt: "",
    parkingSpaces: "",
    furnishedStatus: "unfurnished",
    currency: "GBP",
    startingAuctionPrice: "",
    reservePrice: "",
    buyNowPrice: "",
    minimumBidIncrement: "",
    estimatedMarketValue: "",
    auctionStatus: "upcoming",
    bidDepositAmount: "",
    autoBidEnabled: false,
    maximumBidLimit: "",
    features: {},
    ownershipType: "",
    titleDeedNumber: "",
    agentName: "",
    agentContact: "",
    existingImages: [],
  };

  const [form, setForm] = useState<any>(defaultForm);

  // Ownership check — redirect if user doesn't own this property
  useEffect(() => {
    if (property && user && user.role !== "admin") {
      const ownerId = (property as any).createdBy?._id || (property as any).createdBy;
      const userId = (user as any)._id || user.id;
      if (ownerId && userId && ownerId.toString() !== userId.toString()) {
        navigate("/dashboard/my-properties");
      }
    }
  }, [property, user, navigate]);

  // Populate form from loaded property
  useEffect(() => {
    if (property) {
      const p = property as any;
      setForm({
        propertyTitle: p.propertyTitle || "",
        propertyDescription: p.propertyDescription || "",
        propertyType: p.propertyType || "house",
        propertyCategory: p.propertyCategory || "residential",
        listingType: p.listingType || "auction",
        propertyStatus: p.propertyStatus || "available",
        approvalStatus: p.approvalStatus || "pending",
        country: p.location?.country || "United Kingdom",
        state: p.location?.state || "",
        city: p.location?.city || "",
        area: p.location?.area || "",
        streetAddress: p.location?.streetAddress || "",
        postalCode: p.location?.postalCode || "",
        bedrooms: p.specifications?.bedrooms || "",
        bathrooms: p.specifications?.bathrooms || "",
        floors: p.specifications?.floors || "",
        yearBuilt: p.specifications?.yearBuilt || "",
        parkingSpaces: p.specifications?.parkingSpaces || "",
        furnishedStatus: p.specifications?.furnishedStatus || "unfurnished",
        currency: p.pricing?.currency || "GBP",
        startingAuctionPrice: p.pricing?.startingAuctionPrice || "",
        reservePrice: p.pricing?.reservePrice || "",
        buyNowPrice: p.pricing?.buyNowPrice || "",
        minimumBidIncrement: p.pricing?.minimumBidIncrement || "",
        estimatedMarketValue: p.pricing?.estimatedMarketValue || "",
        auctionStatus: p.auctionDetails?.auctionStatus || "upcoming",
        bidDepositAmount: p.auctionDetails?.bidDepositAmount || "",
        autoBidEnabled: p.auctionDetails?.autoBidEnabled || false,
        maximumBidLimit: p.auctionDetails?.maximumBidLimit || "",
        features: p.features || {},
        ownershipType: p.legalInfo?.ownershipType || "",
        titleDeedNumber: p.legalInfo?.titleDeedNumber || "",
        agentName: p.sellerInfo?.agentName || "",
        agentContact: p.sellerInfo?.agentContact || "",
        existingImages: p.media?.propertyImages || [],
      });
      setExistingVideos(p.media?.propertyVideos || (p.media?.propertyVideo ? [p.media.propertyVideo] : []));
      setExistingFloorPlans(p.media?.floorPlans || (p.media?.floorPlan ? [p.media.floorPlan] : []));
      const docs = p.media?.legalDocuments;
      setExistingLegalDocs(docs ? (Array.isArray(docs) ? docs : [docs]) : []);
    }
  }, [property]);

  const updateField = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages((prev) => [...prev, ...files]);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () =>
          setImagePreviews((prev) => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const removeExistingImage = (index: number) => {
    const updated = [...(form.existingImages || [])];
    updated.splice(index, 1);
    updateField("existingImages", updated);
  };
  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };
  const removeExistingLegalDoc = (index: number) => {
    setExistingLegalDocs((prev) => prev.filter((_, i) => i !== index));
  };
  const removeNewLegalDoc = (index: number) => {
    setLegalDocFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const handleLegalDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files)
      setLegalDocFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      let uploadedUrls: string[] = [];
      if (newImages.length > 0) {
        setUploading(true);
        const uploadResult = await uploadImages(newImages);
        if (uploadResult?.success && uploadResult.data) {
          uploadedUrls = uploadResult.data.map((f: any) => f.fileUrl);
        }
        setUploading(false);
      }
      const allImages = [...(form.existingImages || []), ...uploadedUrls];

      let videoUrls: string[] = [...existingVideos];
      for (const vid of videoFiles) {
        try {
          const vfd = new FormData();
          vfd.append("propertyVideos", vid);
          const vd = await fetch("/api/upload/video", {
            method: "POST",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            body: vfd,
          });
          const vdData = await vd.json();
          if (vdData?.success && vdData.data) {
            const urls = Array.isArray(vdData.data) ? vdData.data.map((f: any) => f.fileUrl) : [vdData.data.fileUrl];
            videoUrls = [...videoUrls, ...urls];
          }
        } catch (e) { console.error("Video upload failed:", e); }
      }

      let floorPlanUrls: string[] = [...existingFloorPlans];
      for (const fp of floorPlanFiles) {
        try {
          const ffd = new FormData();
          ffd.append("floorPlans", fp);
          const fd = await fetch("/api/upload/floorplan", {
            method: "POST",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            body: ffd,
          });
          const fdData = await fd.json();
          if (fdData?.success && fdData.data) {
            const urls = Array.isArray(fdData.data) ? fdData.data.map((f: any) => f.fileUrl) : [fdData.data.fileUrl];
            floorPlanUrls = [...floorPlanUrls, ...urls];
          }
        } catch (e) { console.error("Floor plan upload failed:", e); }
      }

      let legalDocUrls: string[] = [...existingLegalDocs];
      if (legalDocFiles.length > 0) {
        const lfd = new FormData();
        legalDocFiles.forEach((doc) => lfd.append("legalDocuments", doc));
        try {
          const lr = await fetch("/api/upload/documents", {
            method: "POST",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            body: lfd,
          });
          const ld = await lr.json();
          if (ld.success)
            legalDocUrls = [...legalDocUrls, ...(ld.data?.map((d: any) => d.fileUrl) || [])];
        } catch {}
      }

      const body: any = {
        propertyTitle: form.propertyTitle,
        propertyDescription: form.propertyDescription,
        propertyType: form.propertyType,
        propertyCategory: form.propertyCategory,
        listingType: form.listingType,
        propertyStatus: form.propertyStatus,
        approvalStatus: form.approvalStatus,
        location: {
          country: form.country,
          state: form.state,
          city: form.city,
          area: form.area,
          streetAddress: form.streetAddress,
          postalCode: form.postalCode,
        },
        specifications: {
          bedrooms: Number(form.bedrooms) || 0,
          bathrooms: Number(form.bathrooms) || 0,
          floors: Number(form.floors) || undefined,
          yearBuilt: Number(form.yearBuilt) || undefined,
          parkingSpaces: Number(form.parkingSpaces) || undefined,
          furnishedStatus: form.furnishedStatus || "unfurnished",
        },
        pricing: {
          currency: form.currency || "GBP",
          startingAuctionPrice: Number(form.startingAuctionPrice) || 0,
          reservePrice: Number(form.reservePrice) || 0,
          buyNowPrice: Number(form.buyNowPrice) || undefined,
          minimumBidIncrement: Number(form.minimumBidIncrement) || 0,
          estimatedMarketValue: Number(form.estimatedMarketValue) || undefined,
        },
        auctionDetails: {
          auctionStatus: form.auctionStatus || "upcoming",
          bidDepositAmount: Number(form.bidDepositAmount) || undefined,
          autoBidEnabled: form.autoBidEnabled || false,
          maximumBidLimit: Number(form.maximumBidLimit) || undefined,
        },
        features: form.features || {},
        legalInfo: {
          ownershipType: form.ownershipType || "",
          titleDeedNumber: form.titleDeedNumber || "",
        },
        sellerInfo: {
          agentName: form.agentName || "",
          agentContact: form.agentContact || "",
        },
        media: {
          propertyImages: allImages,
          propertyVideos: videoUrls,
          floorPlans: floorPlanUrls,
          legalDocuments: legalDocUrls,
        },
      };

      const result = await apiClient.fetch(`/properties/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });

      if (result.success) {
        setVideoFiles([]);
        setFloorPlanFiles([]);
        setLegalDocFiles([]);
        setNewImages([]);
        setImagePreviews([]);
        setExistingVideos(videoUrls);
        setExistingFloorPlans(floorPlanUrls);
        setExistingLegalDocs(legalDocUrls);
        updateField("existingImages", allImages);
        queryClient.invalidateQueries({ queryKey: ["properties"] });
        queryClient.invalidateQueries({ queryKey: ["my-properties"] });
        setSaved(true);
        showSuccess("Property saved!", "All changes have been saved.");
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(result.message || "Save failed");
        showError("Save failed", result.message || "Please try again.");
        setTimeout(() => setError(""), 5000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving property");
      showError("Save failed", err instanceof Error ? err.message : "Error saving property");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  if (!canAddProperty) {
    navigate("/dashboard");
    return null;
  }

  if (isLoading) {
    return (
      <CustomerLayout activeTab="my-properties" onTabChange={(tab) => navigate(`/dashboard/${tab}`)}>
        <div className="flex items-center justify-center h-96">
          <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout activeTab="my-properties" onTabChange={(tab) => navigate(`/dashboard/${tab}`)}>
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard/my-properties")}
              className="p-2 hover:bg-white/80 rounded-xl transition-all"
            >
              <ArrowLeft className="size-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Edit Property</h1>
              <p className="text-sm text-slate-500 font-medium">{form.propertyTitle}</p>
            </div>
          </div>
          {saved && (
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-bold">
              ✅ All Changes Saved!
            </span>
          )}
        </div>

        {/* Step tabs */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/60 mb-4">
          <div className="flex items-center gap-1 flex-wrap">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isActive = step === s.number;
              const isDone = step > s.number;
              return (
                <button
                  key={s.number}
                  onClick={() => setStep(s.number)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : isDone
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {isDone ? <CheckCircle className="size-3.5" /> : <Icon className="size-3.5" />}
                  {s.title}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="size-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 font-bold text-sm">{error}</p>
          </div>
        )}

        {/* Step content */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/60 shadow-xl">
          {step === 1 && <StepBasic form={form} updateField={updateField} />}
          {step === 2 && <StepLocation form={form} updateField={updateField} />}
          {step === 3 && <StepSpecifications form={form} updateField={updateField} />}
          {step === 4 && <StepPricing form={form} updateField={updateField} />}
          {step === 5 && <StepAuction form={form} updateField={updateField} />}
          {step === 6 && <StepFeatures form={form} updateField={updateField} />}
          {step === 7 && <StepLegal form={form} updateField={updateField} />}
          {step === 8 && <StepSeller form={form} updateField={updateField} />}
          {step === 9 && (
            <StepMedia
              form={form}
              updateField={updateField}
              newImages={newImages}
              imagePreviews={imagePreviews}
              handleImageUpload={handleImageUpload}
              removeExistingImage={removeExistingImage}
              removeNewImage={removeNewImage}
              property={property as any}
              videoFiles={videoFiles}
              setVideoFiles={setVideoFiles}
              floorPlanFiles={floorPlanFiles}
              setFloorPlanFiles={setFloorPlanFiles}
              existingVideos={existingVideos}
              setExistingVideos={setExistingVideos}
              existingFloorPlans={existingFloorPlans}
              setExistingFloorPlans={setExistingFloorPlans}
              existingLegalDocs={existingLegalDocs}
              removeExistingLegalDoc={removeExistingLegalDoc}
              legalDocFiles={legalDocFiles}
              removeNewLegalDoc={removeNewLegalDoc}
              handleLegalDocUpload={handleLegalDocUpload}
            />
          )}

          <div className="flex items-center justify-between pt-6 mt-6 border-t-2 border-slate-100">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-bold disabled:opacity-50 flex items-center gap-1"
            >
              <ChevronLeft className="size-4" /> Previous
            </button>
            <span className="text-sm font-bold text-slate-500">Step {step} of 9</span>
            <div className="flex items-center gap-2">
              {step < 9 && (
                <button
                  onClick={() => setStep(Math.min(9, step + 1))}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-1"
                >
                  Next <ChevronRight className="size-4" />
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:scale-100"
              >
                <Save className="size-4" />
                {uploading ? "Uploading..." : saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}

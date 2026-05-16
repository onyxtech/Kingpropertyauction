import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Save, ArrowLeft, ChevronRight, ChevronLeft, CheckCircle,
  Building2, MapPin, Home, DollarSign, Gavel, Star, Scale, UserCheck, Camera,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { usePropertyApi } from "@/features/property/api/usePropertyApi";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

import StepBasic from "../components/edit-property/StepBasic";
import StepLocation from "../components/edit-property/StepLocation";
import StepSpecifications from "../components/edit-property/StepSpecifications";
import StepPricing from "../components/edit-property/StepPricing";
import StepAuction from "../components/edit-property/StepAuction";
import StepFeatures from "../components/edit-property/StepFeatures";
import StepLegal from "../components/edit-property/StepLegal";
import StepSeller from "../components/edit-property/StepSeller";
import StepMedia from "../components/edit-property/StepMedia";

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

export default function EditProperty() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { useGetPropertyById, useUploadPropertyImages } = usePropertyApi();
  const { data: property, isLoading } = useGetPropertyById(id || "");
  const { mutateAsync: uploadImages } = useUploadPropertyImages();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const defaultForm = {
    propertyTitle: "", propertyDescription: "", propertyType: "house",
    propertyCategory: "residential", listingType: "auction", propertyStatus: "available",
    approvalStatus: "pending",
    country: "", state: "", city: "", area: "", streetAddress: "", postalCode: "",
    latitude: "", longitude: "",
    totalArea: "", landArea: "", coveredArea: "", bedrooms: "", bathrooms: "",
    floors: "", yearBuilt: "", parkingSpaces: "", furnishedStatus: "unfurnished",
    currency: "GBP", startingAuctionPrice: "", reservePrice: "", buyNowPrice: "",
    minimumBidIncrement: "", estimatedMarketValue: "",
    auctionStartDate: "", auctionEndDate: "", auctionStatus: "upcoming",
    bidDepositAmount: "", autoBidEnabled: false, maximumBidLimit: "",
    features: {},
    ownershipType: "", titleDeedNumber: "", propertyTaxInfo: "", mortgageStatus: "clear", zoningType: "",
    sellerName: "", sellerContact: "", sellerEmail: "", agentName: "", agentContact: "",
    existingImages: [],
  };

  const [form, setForm] = useState<any>(defaultForm);

  useEffect(() => {
    if (property) {
      setForm({
        propertyTitle: property.propertyTitle || "",
        propertyDescription: property.propertyDescription || "",
        propertyType: property.propertyType || "house",
        propertyCategory: property.propertyCategory || "residential",
        listingType: property.listingType || "auction",
        propertyStatus: property.propertyStatus || "available",
        approvalStatus: property.approvalStatus || "pending",
        country: property.location?.country || "United Kingdom",
        state: property.location?.state || "",
        city: property.location?.city || "",
        area: property.location?.area || "",
        streetAddress: property.location?.streetAddress || "",
        postalCode: property.location?.postalCode || "",
        latitude: property.location?.latitude || "",
        longitude: property.location?.longitude || "",
        totalArea: property.specifications?.totalArea || "",
        landArea: property.specifications?.landArea || "",
        coveredArea: property.specifications?.coveredArea || "",
        bedrooms: property.specifications?.bedrooms || "",
        bathrooms: property.specifications?.bathrooms || "",
        floors: property.specifications?.floors || "",
        yearBuilt: property.specifications?.yearBuilt || "",
        parkingSpaces: property.specifications?.parkingSpaces || "",
        furnishedStatus: property.specifications?.furnishedStatus || "unfurnished",
        currency: property.pricing?.currency || "GBP",
        startingAuctionPrice: property.pricing?.startingAuctionPrice || "",
        reservePrice: property.pricing?.reservePrice || "",
        buyNowPrice: property.pricing?.buyNowPrice || "",
        minimumBidIncrement: property.pricing?.minimumBidIncrement || "",
        estimatedMarketValue: property.pricing?.estimatedMarketValue || "",
        auctionStartDate: property.auctionDetails?.auctionStartDate ? property.auctionDetails.auctionStartDate.slice(0, 16) : "",
        auctionEndDate: property.auctionDetails?.auctionEndDate ? property.auctionDetails.auctionEndDate.slice(0, 16) : "",
        auctionStatus: property.auctionDetails?.auctionStatus || "upcoming",
        bidDepositAmount: property.auctionDetails?.bidDepositAmount || "",
        autoBidEnabled: property.auctionDetails?.autoBidEnabled || false,
        maximumBidLimit: property.auctionDetails?.maximumBidLimit || "",
        features: property.features || {},
        ownershipType: property.legalInfo?.ownershipType || "",
        titleDeedNumber: property.legalInfo?.titleDeedNumber || "",
        propertyTaxInfo: property.legalInfo?.propertyTaxInfo || "",
        mortgageStatus: property.legalInfo?.mortgageStatus || "clear",
        zoningType: property.legalInfo?.zoningType || "",
        sellerName: property.sellerInfo?.sellerName || "",
        sellerContact: property.sellerInfo?.sellerContact || "",
        sellerEmail: property.sellerInfo?.sellerEmail || "",
        agentName: property.sellerInfo?.agentName || "",
        agentContact: property.sellerInfo?.agentContact || "",
        existingImages: property.media?.propertyImages || [],
      });
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
        reader.onloadend = () => setImagePreviews((prev) => [...prev, reader.result as string]);
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
      const body: any = {
        propertyTitle: form.propertyTitle, propertyDescription: form.propertyDescription,
        propertyType: form.propertyType, propertyCategory: form.propertyCategory,
        listingType: form.listingType, propertyStatus: form.propertyStatus,
        approvalStatus: form.approvalStatus,
        location: { country: form.country, state: form.state, city: form.city, area: form.area, streetAddress: form.streetAddress, postalCode: form.postalCode, latitude: form.latitude, longitude: form.longitude },
        specifications: { totalArea: Number(form.totalArea) || 0, landArea: Number(form.landArea) || undefined, coveredArea: Number(form.coveredArea) || undefined, bedrooms: Number(form.bedrooms) || 0, bathrooms: Number(form.bathrooms) || 0, floors: Number(form.floors) || undefined, yearBuilt: Number(form.yearBuilt) || undefined, parkingSpaces: Number(form.parkingSpaces) || undefined, furnishedStatus: form.furnishedStatus || "unfurnished" },
        pricing: { currency: form.currency || "GBP", startingAuctionPrice: Number(form.startingAuctionPrice) || 0, reservePrice: Number(form.reservePrice) || 0, buyNowPrice: Number(form.buyNowPrice) || undefined, minimumBidIncrement: Number(form.minimumBidIncrement) || 0, estimatedMarketValue: Number(form.estimatedMarketValue) || undefined },
        auctionDetails: { auctionStartDate: form.auctionStartDate || new Date().toISOString(), auctionEndDate: form.auctionEndDate || new Date().toISOString(), auctionStatus: form.auctionStatus || "upcoming", bidDepositAmount: Number(form.bidDepositAmount) || undefined, autoBidEnabled: form.autoBidEnabled || false, maximumBidLimit: Number(form.maximumBidLimit) || undefined },
        features: form.features || {},
        legalInfo: { ownershipType: form.ownershipType || "", titleDeedNumber: form.titleDeedNumber || "", propertyTaxInfo: form.propertyTaxInfo || "", mortgageStatus: form.mortgageStatus || "clear", zoningType: form.zoningType || "" },
        sellerInfo: { sellerName: form.sellerName || "", sellerContact: form.sellerContact || "", sellerEmail: form.sellerEmail || "", agentName: form.agentName || "", agentContact: form.agentContact || "" },
        media: { propertyImages: allImages },
      };
      const result = await apiClient.fetch(`/properties/${id}`, { method: "PUT", body: JSON.stringify(body) });
      if (result.success) { queryClient.invalidateQueries({ queryKey: ["properties"] }); setSaved(true); setTimeout(() => setSaved(false), 3000); }
      else { setError(result.message || "Save failed"); setTimeout(() => setError(""), 5000); }
    } catch (err) { setError(err instanceof Error ? err.message : "Error saving"); setTimeout(() => setError(""), 5000); }
    finally { setSaving(false); }
  };

  if (isLoading) {
    return (
      <AdminLayout activeTab="properties" onTabChange={() => {}}>
        <div className="flex items-center justify-center h-96">
          <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="properties" onTabChange={() => {}}>
      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/admin/properties")} className="p-2 hover:bg-white/80 rounded-xl"><ArrowLeft className="size-5 text-slate-600" /></button>
            <div><h1 className="text-2xl font-black text-slate-900">Edit Property</h1><p className="text-sm text-slate-500 font-medium">{form.propertyTitle}</p></div>
          </div>
          {saved && <span className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-bold">✅ All Changes Saved!</span>}
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/60 mb-4">
          <div className="flex items-center gap-1 flex-wrap">
            {STEPS.map((s) => { const Icon = s.icon; const isActive = step === s.number; const isDone = step > s.number; return (
              <button key={s.number} onClick={() => setStep(s.number)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${isActive ? "bg-blue-600 text-white shadow-lg" : isDone ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{isDone ? <CheckCircle className="size-3.5" /> : <Icon className="size-3.5" />}{s.title}</button>
            );})}
          </div>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">{error}</div>}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/60 shadow-xl">
          {step === 1 && <StepBasic form={form} updateField={updateField} />}
          {step === 2 && <StepLocation form={form} updateField={updateField} />}
          {step === 3 && <StepSpecifications form={form} updateField={updateField} />}
          {step === 4 && <StepPricing form={form} updateField={updateField} />}
          {step === 5 && <StepAuction form={form} updateField={updateField} />}
          {step === 6 && <StepFeatures form={form} updateField={updateField} />}
          {step === 7 && <StepLegal form={form} updateField={updateField} />}
          {step === 8 && <StepSeller form={form} updateField={updateField} />}
          {step === 9 && <StepMedia form={form} updateField={updateField} newImages={newImages} imagePreviews={imagePreviews} handleImageUpload={handleImageUpload} removeExistingImage={removeExistingImage} removeNewImage={removeNewImage} property={property} />}
          <div className="flex items-center justify-between pt-6 mt-6 border-t-2 border-slate-100">
            <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-bold disabled:opacity-50 flex items-center gap-1"><ChevronLeft className="size-4" /> Previous</button>
            <span className="text-sm font-bold text-slate-500">Step {step} of 9</span>
            <div className="flex items-center gap-2">
              {step < 9 && <button onClick={() => setStep(Math.min(9, step + 1))} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-1">Next <ChevronRight className="size-4" /></button>}
              <button onClick={handleSave} disabled={saving || uploading} className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-all flex items-center gap-2 shadow-lg"><Save className="size-4" /> {uploading ? "Uploading..." : saving ? "Saving..." : "Save Changes"}</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Building2,
  MapPin,
  Home,
  DollarSign,
  Image as ImageIcon,
  Upload,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Bed,
  Bath,
  Square,
  Calendar,
  FileText,
  Star,
  Wifi,
  Car,
  Trees,
  Zap,
  Shield,
  Users,
  Camera,
  Video,
  X,
  Globe,
  Map,
  Gavel,
  UserCheck,
  Lock,
  Scale,
  Info,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTheme } from "../hooks/useTheme";
import { usePropertyApi } from "../hooks/api";
import type { PropertyFormData } from "../hooks/api";

type LocalPropertyFormData = Omit<
  PropertyFormData,
  "propertyImages" | "propertyVideo" | "floorPlan" | "legalDocuments"
> & {
  propertyImages: File[];
  propertyVideo: File | null;
  floorPlan: File | null;
  legalDocuments: File[];
};

export default function AddProperty() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { loading: apiLoading, error: apiError, createProperty, uploadPropertyImages } = usePropertyApi();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 10;

  // Comprehensive Form State
  const [formData, setFormData] = useState<LocalPropertyFormData>({
    // 1. Basic Property Information
    propertyTitle: "",
    propertyDescription: "",
    propertyType: "house",
    propertyCategory: "residential",
    listingType: "auction",
    propertyID: "",
    propertyStatus: "available",

    // 2. Location Details
    country: "United Kingdom",
    state: "",
    city: "",
    area: "",
    streetAddress: "",
    postalCode: "",
    latitude: "",
    longitude: "",

    // 3. Property Specifications
    totalArea: "",
    landArea: "",
    coveredArea: "",
    bedrooms: "",
    bathrooms: "",
    floors: "",
    yearBuilt: "",
    parkingSpaces: "",
    furnishedStatus: "unfurnished",

    // 4. Pricing Information
    startingAuctionPrice: "",
    reservePrice: "",
    buyNowPrice: "",
    minimumBidIncrement: "",
    estimatedMarketValue: "",
    currency: "GBP",

    // 5. Auction Details
    auctionStartDate: "",
    auctionEndDate: "",
    auctionStatus: "upcoming",
    bidDepositAmount: "",
    autoBidEnabled: false,
    maximumBidLimit: "",
    numberOfBidders: "0",

    // 6. Property Features / Amenities
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

    // 7. Legal Information
    ownershipType: "",
    titleDeedNumber: "",
    propertyTaxInfo: "",
    mortgageStatus: "clear",
    zoningType: "",

    // 8. Seller / Agent Information
    sellerName: "",
    sellerContact: "",
    sellerEmail: "",
    agentName: "",
    agentContact: "",

    // 9. Media & Documents
    propertyImages: [] as File[],
    propertyVideo: null as File | null,
    virtualTour: "",
    floorPlan: null as File | null,
    legalDocuments: [] as File[],

    // 10. System Fields
    createdBy: "Current User",
    approvalStatus: "pending",
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData({
      ...formData,
      features: {
        ...formData.features,
        [feature]: !formData.features[feature as keyof typeof formData.features],
      },
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData({ ...formData, propertyImages: [...formData.propertyImages, ...filesArray] });
      
      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedImages(prev => [...prev, reader.result as string]);
        };
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // First, upload images if any
      let imageUrls: string[] = [];
      if (formData.propertyImages.length > 0) {
        const uploadResponse = await uploadPropertyImages(formData.propertyImages);
        if (uploadResponse.success && uploadResponse.data) {
          imageUrls = uploadResponse.data.map((file) => file.fileUrl);
        }
      }

      // Prepare property data for API
      const propertyData: PropertyFormData = {
        ...formData,
        propertyImages: imageUrls.length > 0 ? imageUrls : undefined,
        propertyVideo: formData.propertyVideo ? "video-url-placeholder" : undefined,
        floorPlan: formData.floorPlan ? "floorplan-url-placeholder" : undefined,
        legalDocuments: formData.legalDocuments.length > 0 ? ["doc1", "doc2"] : undefined,
      };

      // Create property via API
      const response = await createProperty(propertyData);

      if (response.success) {
        alert(`✅ ${response.message || "Property submitted successfully!"}\n\nProperty ID: ${response.data?.id}\n\nOur team will review and approve it shortly.`);
        navigate("/admin");
      } else {
        alert(`❌ Failed to create property: ${response.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error submitting property:", err);
      alert("❌ An error occurred while submitting the property. Please try again.");
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const steps = [
    { number: 1, title: "Basic Information", icon: Building2 },
    { number: 2, title: "Location Details", icon: MapPin },
    { number: 3, title: "Specifications", icon: Home },
    { number: 4, title: "Pricing", icon: DollarSign },
    { number: 5, title: "Auction Details", icon: Gavel },
    { number: 6, title: "Features", icon: Star },
    { number: 7, title: "Legal Info", icon: Scale },
    { number: 8, title: "Seller/Agent", icon: UserCheck },
    { number: 9, title: "Media", icon: Camera },
    { number: 10, title: "Review", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <Header />

      <div className="container mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-3 flex items-center justify-center gap-3">
            <Building2 className="size-10 text-blue-600" />
            Add New Property
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            Complete all steps to list your property for auction
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 mb-8">
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`size-12 rounded-xl flex items-center justify-center font-bold transition-all ${
                        isCompleted
                          ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg"
                          : isActive
                          ? `bg-gradient-to-br ${theme.primary} text-white shadow-xl scale-110`
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="size-6" /> : <Icon className="size-6" />}
                    </div>
                    <span
                      className={`text-xs font-bold mt-2 text-center ${
                        isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-slate-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 rounded-full transition-all ${
                        currentStep > step.number ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
          {/* Step 1: Basic Property Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`size-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}>
                  <Building2 className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Basic Property Information</h2>
                  <p className="text-slate-600 font-medium">Enter essential property details</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Property Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., Luxury Modern Villa in Mayfair"
                    value={formData.propertyTitle}
                    onChange={(e) => handleInputChange("propertyTitle", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Property Description *</label>
                  <textarea
                    rows={5}
                    placeholder="Describe the property features, location highlights, and unique selling points..."
                    value={formData.propertyDescription}
                    onChange={(e) => handleInputChange("propertyDescription", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Property Type *</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => handleInputChange("propertyType", e.target.value)}
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
                  <label className="block text-sm font-bold text-slate-700 mb-2">Property Category *</label>
                  <select
                    value={formData.propertyCategory}
                    onChange={(e) => handleInputChange("propertyCategory", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Listing Type *</label>
                  <select
                    value={formData.listingType}
                    onChange={(e) => handleInputChange("listingType", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="auction">Auction</option>
                    <option value="direct_sale">Direct Sale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Property Status *</label>
                  <select
                    value={formData.propertyStatus}
                    onChange={(e) => handleInputChange("propertyStatus", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Property ID / Listing ID</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if left empty"
                    value={formData.propertyID}
                    onChange={(e) => handleInputChange("propertyID", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`size-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}>
                  <MapPin className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Location Details</h2>
                  <p className="text-slate-600 font-medium">Specify the property location</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Country *</label>
                  <input
                    type="text"
                    placeholder="United Kingdom"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">State / Province *</label>
                  <input
                    type="text"
                    placeholder="e.g., England"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">City *</label>
                  <input
                    type="text"
                    placeholder="e.g., London"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Area / Neighborhood *</label>
                  <input
                    type="text"
                    placeholder="e.g., Mayfair"
                    value={formData.area}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Street Address *</label>
                  <input
                    type="text"
                    placeholder="e.g., 123 Park Lane"
                    value={formData.streetAddress}
                    onChange={(e) => handleInputChange("streetAddress", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Postal Code *</label>
                  <input
                    type="text"
                    placeholder="e.g., W1K 1AA"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    <Globe className="inline size-4 mr-1" />
                    Google Map Location (Optional)
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Latitude (e.g., 51.5074)"
                      value={formData.latitude}
                      onChange={(e) => handleInputChange("latitude", e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Longitude (e.g., -0.1278)"
                      value={formData.longitude}
                      onChange={(e) => handleInputChange("longitude", e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Property Specifications */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`size-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}>
                  <Home className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Property Specifications</h2>
                  <p className="text-slate-600 font-medium">Provide detailed measurements and features</p>
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
                    onChange={(e) => handleInputChange("totalArea", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Land Area (sq ft)</label>
                  <input
                    type="number"
                    placeholder="e.g., 3000"
                    value={formData.landArea}
                    onChange={(e) => handleInputChange("landArea", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Covered Area (sq ft)</label>
                  <input
                    type="number"
                    placeholder="e.g., 2500"
                    value={formData.coveredArea}
                    onChange={(e) => handleInputChange("coveredArea", e.target.value)}
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
                    onChange={(e) => handleInputChange("bedrooms", e.target.value)}
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
                    onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Number of Floors</label>
                  <input
                    type="number"
                    placeholder="e.g., 2"
                    value={formData.floors}
                    onChange={(e) => handleInputChange("floors", e.target.value)}
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
                    onChange={(e) => handleInputChange("yearBuilt", e.target.value)}
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
                    onChange={(e) => handleInputChange("parkingSpaces", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Furnished / Unfurnished *</label>
                  <select
                    value={formData.furnishedStatus}
                    onChange={(e) => handleInputChange("furnishedStatus", e.target.value)}
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
          )}

          {/* Step 4: Pricing Information */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`size-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}>
                  <DollarSign className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Pricing Information</h2>
                  <p className="text-slate-600 font-medium">Set pricing and value estimates</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Currency *</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange("currency", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="GBP">GBP (£)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Starting Auction Price *</label>
                  <input
                    type="number"
                    placeholder="e.g., 500000"
                    value={formData.startingAuctionPrice}
                    onChange={(e) => handleInputChange("startingAuctionPrice", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Reserve Price *</label>
                  <input
                    type="number"
                    placeholder="e.g., 600000"
                    value={formData.reservePrice}
                    onChange={(e) => handleInputChange("reservePrice", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Buy Now Price (Optional)</label>
                  <input
                    type="number"
                    placeholder="e.g., 750000"
                    value={formData.buyNowPrice}
                    onChange={(e) => handleInputChange("buyNowPrice", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Minimum Bid Increment *</label>
                  <input
                    type="number"
                    placeholder="e.g., 5000"
                    value={formData.minimumBidIncrement}
                    onChange={(e) => handleInputChange("minimumBidIncrement", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Estimated Market Value</label>
                  <input
                    type="number"
                    placeholder="e.g., 700000"
                    value={formData.estimatedMarketValue}
                    onChange={(e) => handleInputChange("estimatedMarketValue", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-blue-900 mb-1">Pricing Guidelines</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>Starting Price:</strong> Attractive opening bid to encourage participation</li>
                      <li>• <strong>Reserve Price:</strong> Minimum price you're willing to accept</li>
                      <li>• <strong>Buy Now:</strong> Fixed price for immediate purchase (optional)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Auction Details */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`size-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}>
                  <Gavel className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Auction Details</h2>
                  <p className="text-slate-600 font-medium">Configure auction settings and timeline</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Auction Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={formData.auctionStartDate}
                    onChange={(e) => handleInputChange("auctionStartDate", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Auction End Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={formData.auctionEndDate}
                    onChange={(e) => handleInputChange("auctionEndDate", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Auction Status *</label>
                  <select
                    value={formData.auctionStatus}
                    onChange={(e) => handleInputChange("auctionStatus", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Bid Deposit Amount (£)</label>
                  <input
                    type="number"
                    placeholder="e.g., 10000"
                    value={formData.bidDepositAmount}
                    onChange={(e) => handleInputChange("bidDepositAmount", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Maximum Bid Limit (Optional)</label>
                  <input
                    type="number"
                    placeholder="No limit if empty"
                    value={formData.maximumBidLimit}
                    onChange={(e) => handleInputChange("maximumBidLimit", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Number of Bidders</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.numberOfBidders}
                    onChange={(e) => handleInputChange("numberOfBidders", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.autoBidEnabled}
                      onChange={(e) => handleInputChange("autoBidEnabled", e.target.checked)}
                      className="size-5 rounded accent-blue-600"
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-700 block">Enable Auto Bid</span>
                      <span className="text-xs text-slate-500">Allow bidders to set automatic bidding up to their maximum</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Property Features / Amenities */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`size-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}>
                  <Star className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Property Features & Amenities</h2>
                  <p className="text-slate-600 font-medium">Select all available features</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: "garden", label: "Garden", icon: Trees },
                  { key: "swimmingPool", label: "Swimming Pool", icon: Sparkles },
                  { key: "balcony", label: "Balcony", icon: Home },
                  { key: "airConditioning", label: "Air Conditioning", icon: Zap },
                  { key: "securitySystem", label: "Security System", icon: Shield },
                  { key: "elevator", label: "Elevator", icon: Upload },
                  { key: "gym", label: "Gym", icon: Users },
                  { key: "solarSystem", label: "Solar System", icon: Zap },
                ].map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <label
                      key={feature.key}
                      className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                        formData.features[feature.key as keyof typeof formData.features]
                          ? "bg-blue-50 border-blue-500"
                          : "bg-slate-50 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.features[feature.key as keyof typeof formData.features]}
                        onChange={() => handleFeatureToggle(feature.key)}
                        className="size-5 rounded accent-blue-600"
                      />
                      <Icon className={`size-5 ${formData.features[feature.key as keyof typeof formData.features] ? "text-blue-600" : "text-slate-500"}`} />
                      <span className="text-sm font-bold text-slate-700">{feature.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 7: Legal Information */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`size-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}>
                  <Scale className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Legal Information</h2>
                  <p className="text-slate-600 font-medium">Property legal and ownership details</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Ownership Type *</label>
                  <select
                    value={formData.ownershipType}
                    onChange={(e) => handleInputChange("ownershipType", e.target.value)}
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
                  <label className="block text-sm font-bold text-slate-700 mb-2">Title Deed Number</label>
                  <input
                    type="text"
                    placeholder="e.g., TD-123456789"
                    value={formData.titleDeedNumber}
                    onChange={(e) => handleInputChange("titleDeedNumber", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Property Tax Information</label>
                  <input
                    type="text"
                    placeholder="Annual tax amount or reference"
                    value={formData.propertyTaxInfo}
                    onChange={(e) => handleInputChange("propertyTaxInfo", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Mortgage Status *</label>
                  <select
                    value={formData.mortgageStatus}
                    onChange={(e) => handleInputChange("mortgageStatus", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="clear">Clear (No Mortgage)</option>
                    <option value="mortgaged">Mortgaged</option>
                    <option value="partially_paid">Partially Paid</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Zoning Type</label>
                  <input
                    type="text"
                    placeholder="e.g., Residential, Commercial Mixed-Use"
                    value={formData.zoningType}
                    onChange={(e) => handleInputChange("zoningType", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Shield className="size-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-amber-900 mb-1">Legal Compliance Notice</h4>
                    <p className="text-sm text-amber-800">
                      All information provided must be accurate and verifiable. Legal documents will be verified during the approval process.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 8: Seller / Agent Information */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`size-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}>
                  <UserCheck className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Seller / Agent Information</h2>
                  <p className="text-slate-600 font-medium">Contact details for property owner and agent</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Seller Information */}
                <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                  <h3 className="text-lg font-black text-blue-900 mb-4">Seller Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Seller Name *</label>
                      <input
                        type="text"
                        placeholder="Full name"
                        value={formData.sellerName}
                        onChange={(e) => handleInputChange("sellerName", e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Seller Contact Number *</label>
                      <input
                        type="tel"
                        placeholder="+44 7700 900000"
                        value={formData.sellerContact}
                        onChange={(e) => handleInputChange("sellerContact", e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Seller Email *</label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={formData.sellerEmail}
                        onChange={(e) => handleInputChange("sellerEmail", e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Agent Information */}
                <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
                  <h3 className="text-lg font-black text-purple-900 mb-4">Agent Information (Optional)</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Agent Name</label>
                      <input
                        type="text"
                        placeholder="Agent full name"
                        value={formData.agentName}
                        onChange={(e) => handleInputChange("agentName", e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Agent Contact</label>
                      <input
                        type="tel"
                        placeholder="+44 7700 900000"
                        value={formData.agentContact}
                        onChange={(e) => handleInputChange("agentContact", e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 9: Media & Documents */}
          {currentStep === 9 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`size-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}>
                  <Camera className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Media & Documents</h2>
                  <p className="text-slate-600 font-medium">Upload property images and documents</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Property Images */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">
                    <ImageIcon className="inline size-4 mr-1" />
                    Property Images * (Max 20)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="property-images"
                    />
                    <label htmlFor="property-images" className="cursor-pointer">
                      <Upload className="size-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-sm font-bold text-slate-700 mb-2">Click to upload property images</p>
                      <p className="text-xs text-slate-500">PNG, JPG up to 10MB each</p>
                    </label>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {uploadedImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img src={img} alt={`Property ${index + 1}`} className="w-full h-32 object-cover rounded-xl" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 size-8 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Property Video */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">
                    <Video className="inline size-4 mr-1" />
                    Property Video (Optional)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleInputChange("propertyVideo", e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id="property-video"
                    />
                    <label htmlFor="property-video" className="cursor-pointer">
                      <Video className="size-10 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm font-bold text-slate-700 mb-1">Upload property video</p>
                      <p className="text-xs text-slate-500">MP4, MOV up to 100MB</p>
                    </label>
                    {formData.propertyVideo && (
                      <p className="text-xs text-green-600 mt-2 font-medium">✓ Video uploaded</p>
                    )}
                  </div>
                </div>

                {/* Virtual Tour Link */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    <Globe className="inline size-4 mr-1" />
                    360° Virtual Tour Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/virtual-tour"
                    value={formData.virtualTour}
                    onChange={(e) => handleInputChange("virtualTour", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Floor Plan */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">
                    <Map className="inline size-4 mr-1" />
                    Floor Plan (Optional)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleInputChange("floorPlan", e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id="floor-plan"
                    />
                    <label htmlFor="floor-plan" className="cursor-pointer">
                      <FileText className="size-10 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm font-bold text-slate-700 mb-1">Upload floor plan</p>
                      <p className="text-xs text-slate-500">PDF, PNG, JPG up to 10MB</p>
                    </label>
                    {formData.floorPlan && (
                      <p className="text-xs text-green-600 mt-2 font-medium">✓ Floor plan uploaded</p>
                    )}
                  </div>
                </div>

                {/* Legal Documents */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">
                    <Lock className="inline size-4 mr-1" />
                    Legal Documents (Optional)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50">
                    <input
                      type="file"
                      multiple
                      accept="application/pdf"
                      onChange={(e) => {
                        if (e.target.files) {
                          const filesArray = Array.from(e.target.files);
                          handleInputChange("legalDocuments", [...formData.legalDocuments, ...filesArray]);
                        }
                      }}
                      className="hidden"
                      id="legal-docs"
                    />
                    <label htmlFor="legal-docs" className="cursor-pointer">
                      <FileText className="size-10 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm font-bold text-slate-700 mb-1">Upload legal documents</p>
                      <p className="text-xs text-slate-500">PDF files (Title deed, certificates, etc.)</p>
                    </label>
                    {formData.legalDocuments.length > 0 && (
                      <p className="text-xs text-green-600 mt-2 font-medium">✓ {formData.legalDocuments.length} document(s) uploaded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 10: Review & Submit */}
          {currentStep === 10 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`size-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}>
                  <CheckCircle className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Review & Submit</h2>
                  <p className="text-slate-600 font-medium">Verify all information before submission</p>
                </div>
              </div>

              {/* Review Summary */}
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
                  <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                    <Building2 className="size-5 text-blue-600" />
                    Basic Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-bold text-slate-600">Title:</span>
                      <p className="text-slate-900 font-medium">{formData.propertyTitle || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-600">Type:</span>
                      <p className="text-slate-900 font-medium capitalize">{formData.propertyType}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-600">Category:</span>
                      <p className="text-slate-900 font-medium capitalize">{formData.propertyCategory}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-600">Status:</span>
                      <p className="text-slate-900 font-medium capitalize">{formData.propertyStatus}</p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
                  <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                    <MapPin className="size-5 text-green-600" />
                    Location
                  </h3>
                  <div className="text-sm">
                    <p className="text-slate-900 font-medium">
                      {formData.streetAddress}, {formData.area}, {formData.city}, {formData.state} {formData.postalCode}
                    </p>
                  </div>
                </div>

                {/* Specifications */}
                <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
                  <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                    <Home className="size-5 text-purple-600" />
                    Specifications
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Square className="size-4 text-purple-600" />
                      <span className="font-bold">{formData.totalArea || "N/A"} sq ft</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bed className="size-4 text-purple-600" />
                      <span className="font-bold">{formData.bedrooms || "N/A"} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="size-4 text-purple-600" />
                      <span className="font-bold">{formData.bathrooms || "N/A"} Bathrooms</span>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
                  <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                    <DollarSign className="size-5 text-green-600" />
                    Pricing
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-bold text-slate-600">Starting Price:</span>
                      <p className="text-slate-900 font-medium">
                        {formData.currency} {formData.startingAuctionPrice ? Number(formData.startingAuctionPrice).toLocaleString() : "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-600">Reserve Price:</span>
                      <p className="text-slate-900 font-medium">
                        {formData.currency} {formData.reservePrice ? Number(formData.reservePrice).toLocaleString() : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Seller Information */}
                <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
                  <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                    <UserCheck className="size-5 text-orange-600" />
                    Seller Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-bold text-slate-600">Name:</span>
                      <p className="text-slate-900 font-medium">{formData.sellerName || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-600">Email:</span>
                      <p className="text-slate-900 font-medium">{formData.sellerEmail || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                {/* System Information */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
                  <h3 className="text-lg font-black text-slate-900 mb-4">System Information</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-bold text-slate-600">Created By:</span>
                      <p className="text-slate-900 font-medium">{formData.createdBy}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-600">Created Date:</span>
                      <p className="text-slate-900 font-medium">{new Date().toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-600">Approval Status:</span>
                      <p className="text-amber-600 font-bold capitalize">{formData.approvalStatus}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" required className="size-5 rounded accent-blue-600 mt-1" />
                  <div className="text-sm">
                    <span className="font-bold text-slate-900">I confirm that all information provided is accurate and complete. *</span>
                    <p className="text-slate-600 mt-1">
                      By submitting this property, you agree to our Terms of Service and Privacy Policy. 
                      Your property will be reviewed by our team before going live.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t-2 border-slate-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 ${
                currentStep === 1
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              <ChevronLeft className="size-5" />
              Previous
            </button>

            <div className="text-center">
              <p className="text-sm font-bold text-slate-600">
                Step {currentStep} of {totalSteps}
              </p>
            </div>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className={`px-8 py-4 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-2`}
              >
                Next
                <ChevronRight className="size-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={apiLoading}
                className={`px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-2 ${
                  apiLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <CheckCircle className="size-5" />
                {apiLoading ? "Submitting..." : "Submit Property"}
              </button>
            )}
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

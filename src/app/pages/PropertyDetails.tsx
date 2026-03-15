import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Calendar,
  Clock,
  Heart,
  Share2,
  Phone,
  Mail,
  ArrowLeft,
  CheckCircle,
  Home,
  Car,
  Zap,
  Wifi,
  ShieldCheck,
  Camera,
  Download,
  AlertCircle,
  TrendingUp,
  Award,
  Users,
  Gavel,
  ChevronRight,
  ChevronLeft,
  X,
  FileText,
  Building2,
  TreePine,
  Sparkles,
  Map,
  Navigation,
  Locate,
} from "lucide-react";
import Header from "../components/Header";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function PropertyDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get("id") || "1";
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  // Comprehensive property data
  const properties: any = {
    "1": {
      id: 1,
      title: "Victorian Terrace House",
      location: "Hackney, London",
      address: "45 Victoria Street, Hackney, London E8 2LP",
      guide: "£425,000",
      currentBid: "£405,000",
      beds: 3,
      baths: 2,
      sqft: "1,850",
      parking: 1,
      yearBuilt: "1895",
      lotNumber: "LOT-001",
      auctionDate: "March 15, 2026",
      auctionTime: "2:00 PM GMT",
      auctionLocation: "Royal Convention Centre, London",
      tenure: "Freehold",
      councilTax: "Band D",
      epcRating: "C",
      images: [
        "https://images.unsplash.com/photo-1706808849777-96e0d7be3bb7?w=1200",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
      ],
      description: "A beautifully presented Victorian terrace house offering spacious accommodation across three floors. This property features period details including original fireplaces, high ceilings, and sash windows. The property has been tastefully modernized while retaining much of its original character. Located in the heart of Hackney, close to excellent transport links and local amenities.",
      features: [
        "Three spacious bedrooms",
        "Two modern bathrooms",
        "Large reception room",
        "Modern fitted kitchen",
        "Private rear garden",
        "Original Victorian features",
        "Gas central heating",
        "Double glazed windows",
        "Off-street parking",
        "Close to transport links",
        "Period fireplaces",
        "High ceilings throughout",
      ],
      amenities: [
        { icon: Zap, label: "Central Heating", value: "Gas" },
        { icon: Wifi, label: "Broadband", value: "Fiber" },
        { icon: ShieldCheck, label: "Security", value: "Alarm" },
        { icon: TreePine, label: "Garden", value: "Private" },
        { icon: Car, label: "Parking", value: "1 Space" },
        { icon: Building2, label: "Type", value: "Terraced" },
      ],
      nearbyPlaces: [
        { name: "Victoria Park", distance: "0.3 miles", type: "Park" },
        { name: "Hackney Central Station", distance: "0.5 miles", type: "Transport" },
        { name: "Broadway Market", distance: "0.4 miles", type: "Shopping" },
        { name: "Primary School", distance: "0.2 miles", type: "Education" },
      ],
      agent: {
        name: "Sarah Johnson",
        phone: "+44 20 7946 0958",
        email: "sarah.johnson@kingauction.com",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      },
      stats: {
        views: 1247,
        favorites: 89,
        bidders: 12,
      },
    },
    "2": {
      id: 2,
      title: "Modern Apartment",
      location: "Canary Wharf, London",
      address: "Apartment 24B, Riverside Tower, Canary Wharf, London E14 5AB",
      guide: "£550,000",
      currentBid: "£520,000",
      beds: 2,
      baths: 2,
      sqft: "1,200",
      parking: 1,
      yearBuilt: "2018",
      lotNumber: "LOT-002",
      auctionDate: "March 15, 2026",
      auctionTime: "2:00 PM GMT",
      auctionLocation: "Royal Convention Centre, London",
      tenure: "Leasehold",
      councilTax: "Band E",
      epcRating: "B",
      images: [
        "https://images.unsplash.com/photo-1614622350812-96b09c78af77?w=1200",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200",
        "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200",
        "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200",
      ],
      description: "Stunning modern apartment with breathtaking views of the Thames and Canary Wharf skyline. This luxurious 2-bedroom apartment features floor-to-ceiling windows, high-spec finishes, and access to premium building amenities including 24-hour concierge, gym, and residents' lounge.",
      features: [
        "Two double bedrooms",
        "Two luxury bathrooms",
        "Open-plan living/dining",
        "Designer kitchen",
        "Private balcony",
        "Floor-to-ceiling windows",
        "Underfloor heating",
        "Built-in wardrobes",
        "24-hour concierge",
        "Residents' gym",
        "Secure parking",
        "Excellent transport links",
      ],
      amenities: [
        { icon: Zap, label: "Heating", value: "Underfloor" },
        { icon: Wifi, label: "Internet", value: "100Mbps" },
        { icon: ShieldCheck, label: "Security", value: "Concierge" },
        { icon: Building2, label: "Floor", value: "24th" },
        { icon: Car, label: "Parking", value: "Secure" },
        { icon: Users, label: "Amenities", value: "Gym & Pool" },
      ],
      nearbyPlaces: [
        { name: "Canary Wharf Station", distance: "0.2 miles", type: "Transport" },
        { name: "Jubilee Park", distance: "0.1 miles", type: "Park" },
        { name: "Cabot Place Shopping", distance: "0.3 miles", type: "Shopping" },
        { name: "Canary Wharf College", distance: "0.4 miles", type: "Education" },
      ],
      agent: {
        name: "Michael Chen",
        phone: "+44 20 7946 0959",
        email: "michael.chen@kingauction.com",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      },
      stats: {
        views: 2134,
        favorites: 156,
        bidders: 18,
      },
    },
  };

  const property = properties[propertyId] || properties["1"];

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate bid placement
    alert(`Bid placed successfully for ${bidAmount}!`);
    setShowBidModal(false);
    setBidAmount("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <Header />

      {/* Back Button */}
      <div className="container mx-auto px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-xl rounded-xl border-2 border-white/60 shadow-lg hover:shadow-xl transition-all font-bold text-slate-700 hover:text-blue-600"
        >
          <ArrowLeft className="size-5" />
          Back to Listings
        </button>
      </div>

      {/* Image Gallery */}
      <div className="container mx-auto px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Image */}
          <div className="lg:col-span-3 relative">
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
              <ImageWithFallback
                src={property.images[currentImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
              />

              {/* Image Navigation */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 size-12 bg-white/90 backdrop-blur-lg rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all"
              >
                <ChevronLeft className="size-6 text-slate-900" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 size-12 bg-white/90 backdrop-blur-lg rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all"
              >
                <ChevronRight className="size-6 text-slate-900" />
              </button>

              {/* View All Photos Button */}
              <button
                onClick={() => setShowImageModal(true)}
                className="absolute bottom-4 right-4 px-5 py-3 bg-white/90 backdrop-blur-lg rounded-xl font-bold text-slate-900 flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
              >
                <Camera className="size-5" />
                View All {property.images.length} Photos
              </button>

              {/* Image Counter */}
              <div className="absolute top-4 left-4 px-4 py-2 bg-black/60 backdrop-blur-lg rounded-full text-white font-bold text-sm">
                {currentImageIndex + 1} / {property.images.length}
              </div>

              {/* Lot Badge */}
              <div className="absolute top-4 right-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-black shadow-xl">
                {property.lotNumber}
              </div>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <div className="lg:col-span-1 space-y-4">
            {property.images.slice(0, 4).map((img: string, idx: number) => (
              <div
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`relative h-28 rounded-2xl overflow-hidden cursor-pointer transition-all ${
                  currentImageIndex === idx
                    ? "ring-4 ring-blue-600 scale-105"
                    : "hover:scale-105 opacity-70 hover:opacity-100"
                }`}
              >
                <ImageWithFallback
                  src={img}
                  alt={`View ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Actions */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-bold text-sm">
                      For Auction
                    </span>
                    <span className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-bold text-sm">
                      {property.tenure}
                    </span>
                  </div>
                  <h1 className="text-4xl font-black text-slate-900 mb-3">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 text-lg text-slate-600 font-medium">
                    <MapPin className="size-5 text-blue-600" />
                    {property.address}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`size-12 rounded-full flex items-center justify-center transition-all shadow-lg hover:scale-110 ${
                      isFavorite
                        ? "bg-gradient-to-br from-red-500 to-pink-500"
                        : "bg-white/90 backdrop-blur-lg"
                    }`}
                  >
                    <Heart
                      className={`size-5 ${
                        isFavorite ? "text-white fill-white" : "text-slate-600"
                      }`}
                    />
                  </button>
                  <button className="size-12 bg-white/90 backdrop-blur-lg rounded-full flex items-center justify-center transition-all shadow-lg hover:scale-110">
                    <Share2 className="size-5 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 pb-6 border-b-2 border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Bed className="size-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">
                      {property.beds}
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                      Bedrooms
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Bath className="size-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">
                      {property.baths}
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                      Bathrooms
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <Maximize className="size-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">
                      {property.sqft}
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                      Sq Ft
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                    <Car className="size-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">
                      {property.parking}
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                      Parking
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Home className="size-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">
                      {property.yearBuilt}
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                      Built
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                  <div className="text-sm font-bold text-blue-900 mb-2">
                    Guide Price
                  </div>
                  <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {property.guide}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200">
                  <div className="text-sm font-bold text-emerald-900 mb-2">
                    Current Bid
                  </div>
                  <div className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {property.currentBid}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <FileText className="size-6 text-blue-600" />
                Property Description
              </h2>
              <p className="text-slate-700 leading-relaxed text-lg">
                {property.description}
              </p>
            </div>

            {/* Features */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <Sparkles className="size-6 text-purple-600" />
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.features.map((feature: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl"
                  >
                    <CheckCircle className="size-5 text-blue-600 flex-shrink-0" />
                    <span className="font-semibold text-slate-700">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
              <h2 className="text-2xl font-black text-slate-900 mb-6">
                Amenities & Services
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-3 p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-200 hover:scale-105 transition-all"
                  >
                    <div className="size-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <amenity.icon className="size-7 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-slate-900">
                        {amenity.label}
                      </div>
                      <div className="text-sm text-slate-600">
                        {amenity.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Places */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <MapPin className="size-6 text-emerald-600" />
                Nearby Places
              </h2>
              <div className="space-y-3 mb-6">
                {property.nearbyPlaces.map((place: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        {place.name}
                      </div>
                      <div className="text-sm text-slate-600">{place.type}</div>
                    </div>
                    <div className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm">
                      {place.distance}
                    </div>
                  </div>
                ))}
              </div>

              {/* View on Map Button */}
              <button
                onClick={() => setShowMapModal(true)}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-3"
              >
                <Map className="size-5" />
                View on Map
                <Navigation className="size-5" />
              </button>
            </div>
          </div>

          {/* Right Column - Auction Info & Agent */}
          <div className="lg:col-span-1 space-y-6">
            {/* Auction Information */}
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 shadow-2xl sticky top-24">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full mb-4">
                  <Gavel className="size-5 text-white" />
                  <span className="text-sm font-bold text-white">
                    Live Auction
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">
                  Auction Details
                </h3>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 border-2 border-white/30">
                  <div className="flex items-center gap-3 text-white">
                    <Calendar className="size-5" />
                    <div>
                      <div className="text-xs font-semibold opacity-80">
                        Auction Date
                      </div>
                      <div className="font-bold">{property.auctionDate}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 border-2 border-white/30">
                  <div className="flex items-center gap-3 text-white">
                    <Clock className="size-5" />
                    <div>
                      <div className="text-xs font-semibold opacity-80">
                        Start Time
                      </div>
                      <div className="font-bold">{property.auctionTime}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 border-2 border-white/30">
                  <div className="flex items-center gap-3 text-white">
                    <MapPin className="size-5" />
                    <div>
                      <div className="text-xs font-semibold opacity-80">
                        Location
                      </div>
                      <div className="font-bold text-sm">
                        {property.auctionLocation}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3 text-center border-2 border-white/30">
                  <div className="text-2xl font-black text-white">
                    {property.stats.views}
                  </div>
                  <div className="text-xs font-semibold text-white/80">
                    Views
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3 text-center border-2 border-white/30">
                  <div className="text-2xl font-black text-white">
                    {property.stats.favorites}
                  </div>
                  <div className="text-xs font-semibold text-white/80">
                    Saved
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3 text-center border-2 border-white/30">
                  <div className="text-2xl font-black text-white">
                    {property.stats.bidders}
                  </div>
                  <div className="text-xs font-semibold text-white/80">
                    Bidders
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowBidModal(true)}
                  className="w-full py-4 bg-white text-blue-600 rounded-xl font-black shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 text-lg"
                >
                  <Gavel className="size-6" />
                  Place Bid
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="w-full py-4 bg-white/20 backdrop-blur-lg text-white border-2 border-white/40 rounded-xl font-bold hover:bg-white/30 transition-all"
                >
                  Register for Auction
                </button>
                <button className="w-full py-4 bg-white/20 backdrop-blur-lg text-white border-2 border-white/40 rounded-xl font-bold hover:bg-white/30 transition-all flex items-center justify-center gap-2">
                  <Download className="size-5" />
                  Download Brochure
                </button>
              </div>
            </div>

            {/* Agent Contact */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border-2 border-white/60">
              <h3 className="text-xl font-black text-slate-900 mb-4">
                Contact Agent
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <ImageWithFallback
                  src={property.agent.image}
                  alt={property.agent.name}
                  className="size-16 rounded-full object-cover ring-4 ring-blue-100"
                />
                <div>
                  <div className="font-black text-slate-900 text-lg">
                    {property.agent.name}
                  </div>
                  <div className="text-sm text-slate-600 font-semibold">
                    Senior Auctioneer
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <a
                  href={`tel:${property.agent.phone}`}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:scale-105 transition-all"
                >
                  <div className="size-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Phone className="size-5 text-white" />
                  </div>
                  <span className="font-bold text-slate-900">
                    {property.agent.phone}
                  </span>
                </a>
                <a
                  href={`mailto:${property.agent.email}`}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:scale-105 transition-all"
                >
                  <div className="size-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Mail className="size-5 text-white" />
                  </div>
                  <span className="font-bold text-slate-900 text-sm">
                    {property.agent.email}
                  </span>
                </a>
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border-2 border-white/60">
              <h3 className="text-xl font-black text-slate-900 mb-4">
                Property Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-600 font-semibold">Tenure</span>
                  <span className="font-bold text-slate-900">
                    {property.tenure}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-600 font-semibold">
                    Council Tax
                  </span>
                  <span className="font-bold text-slate-900">
                    {property.councilTax}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-600 font-semibold">
                    EPC Rating
                  </span>
                  <span className="font-bold text-slate-900">
                    {property.epcRating}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-600 font-semibold">
                    Year Built
                  </span>
                  <span className="font-bold text-slate-900">
                    {property.yearBuilt}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-6 right-6 size-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <X className="size-6 text-white" />
          </button>
          <div className="max-w-6xl w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.images.map((img: string, idx: number) => (
                <div
                  key={idx}
                  className="relative h-80 rounded-2xl overflow-hidden"
                >
                  <ImageWithFallback
                    src={img}
                    alt={`Property view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bid Modal */}
      {showBidModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-slate-900">Place Bid</h3>
              <button
                onClick={() => setShowBidModal(false)}
                className="size-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center"
              >
                <X className="size-5 text-slate-600" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
              <div className="text-sm font-bold text-blue-900 mb-1">
                Current Bid
              </div>
              <div className="text-3xl font-black text-blue-600">
                {property.currentBid}
              </div>
            </div>

            <form onSubmit={handlePlaceBid} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Your Bid Amount
                </label>
                <input
                  type="text"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="£430,000"
                  className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-2xl"
                  required
                />
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="size-5 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-900">
                    <p className="font-bold mb-1">Important</p>
                    <p>
                      Bids are legally binding. Ensure you have financing in
                      place.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-black shadow-xl hover:scale-105 transition-all"
              >
                Confirm Bid
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl overflow-hidden max-w-6xl w-full shadow-2xl relative animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 size-64 bg-white rounded-full blur-3xl animate-pulse" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Locate className="size-6 text-white" />
                    <h3 className="text-2xl font-black text-white">
                      Property Location
                    </h3>
                  </div>
                  <p className="text-white/90 font-semibold flex items-center gap-2">
                    <MapPin className="size-4" />
                    {property.address}
                  </p>
                </div>
                <button
                  onClick={() => setShowMapModal(false)}
                  className="size-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:rotate-90"
                >
                  <X className="size-6 text-white" />
                </button>
              </div>
            </div>

            {/* Map Container */}
            <div className="relative h-[600px] bg-gradient-to-br from-slate-100 to-slate-200">
              {/* Mock Map with Illustration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Simulated Map Background */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                      {[...Array(64)].map((_, i) => (
                        <div
                          key={i}
                          className="border border-slate-300"
                          style={{
                            backgroundColor: i % 3 === 0 ? '#e0f2fe' : i % 2 === 0 ? '#dcfce7' : '#f0fdf4'
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Center Marker */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="relative animate-bounce">
                      {/* Marker Pin */}
                      <div className="size-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-2xl ring-8 ring-white/50">
                        <Home className="size-8 text-white" />
                      </div>
                      {/* Pulse Effect */}
                      <div className="absolute inset-0 size-16 bg-red-500/30 rounded-full animate-ping" />
                    </div>

                    {/* Property Card */}
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-72 bg-white rounded-2xl p-4 shadow-2xl border-2 border-slate-200">
                      <div className="flex items-start gap-3">
                        <div className="size-20 rounded-xl overflow-hidden flex-shrink-0">
                          <ImageWithFallback
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-slate-900 mb-1 truncate">
                            {property.title}
                          </h4>
                          <p className="text-sm text-slate-600 font-semibold mb-2">
                            {property.location}
                          </p>
                          <p className="text-lg font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            {property.guide}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nearby Places Markers */}
                  {property.nearbyPlaces.map((place: any, idx: number) => (
                    <div
                      key={idx}
                      className="absolute z-10"
                      style={{
                        top: `${30 + idx * 15}%`,
                        left: `${20 + idx * 20}%`,
                      }}
                    >
                      <div className="relative group cursor-pointer">
                        <div className="size-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all">
                          <MapPin className="size-5 text-white" />
                        </div>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                          <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-sm font-bold whitespace-nowrap shadow-xl">
                            {place.name}
                            <div className="text-xs text-slate-300">{place.distance}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Map Controls */}
                  <div className="absolute top-4 right-4 space-y-2 z-30">
                    <button className="size-12 bg-white rounded-xl flex items-center justify-center shadow-xl hover:scale-110 transition-all border-2 border-slate-200">
                      <span className="text-2xl font-black text-slate-700">+</span>
                    </button>
                    <button className="size-12 bg-white rounded-xl flex items-center justify-center shadow-xl hover:scale-110 transition-all border-2 border-slate-200">
                      <span className="text-2xl font-black text-slate-700">-</span>
                    </button>
                  </div>

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-lg rounded-2xl p-4 shadow-xl border-2 border-white z-30">
                    <h4 className="font-black text-slate-900 mb-3 text-sm">Map Legend</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="size-4 bg-red-500 rounded-full" />
                        <span className="text-xs font-semibold text-slate-700">Property Location</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-4 bg-blue-600 rounded-full" />
                        <span className="text-xs font-semibold text-slate-700">Nearby Places</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-t-2 border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md border-2 border-slate-200">
                    <MapPin className="size-5 text-emerald-600" />
                    <span className="font-bold text-slate-900 text-sm">{property.location}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md border-2 border-slate-200">
                    <Navigation className="size-5 text-blue-600" />
                    <span className="font-bold text-slate-900 text-sm">Get Directions</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <Map className="size-5" />
                    Open in Google Maps
                  </a>
                  <button
                    onClick={() => setShowMapModal(false)}
                    className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl font-bold shadow-lg transition-all border-2 border-slate-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
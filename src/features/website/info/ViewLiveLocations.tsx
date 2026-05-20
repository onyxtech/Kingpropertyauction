import { useState } from "react";
import { useNavigate } from "react-router";
import {
  MapPin,
  Clock,
  Calendar,
  Gavel,
  Navigation,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  X,
} from "lucide-react";
import PublicLayout from "@/features/shared/layout/PublicLayout";
import { apiClient } from "@/lib/apiClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CACHE_KEYS } from "@/constants";
import { ImageWithFallback } from "@/features/shared/figma/ImageWithFallback";
import AuctionTimer from "@/features/shared/components/AuctionTimer";
import { useAuctionSocket } from "@/hooks/useAuctionSocket";

export default function ViewLiveLocations() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    selectedAuction: "",
    interests: "",
  });

  const { data: venueData, isLoading: loading } = useQuery({
    queryKey: [CACHE_KEYS.AUCTIONS, 'venues'],
    queryFn: async () => {
      const data = await apiClient.fetch('/auctions?limit=20');
      const all = (data.data || []) as any[];
      return all.filter((a) => a.auctionType === "live" && a.venue?.name);
    },
    refetchInterval: 30000,
  });
  const auctions = venueData || [];

  useAuctionSocket({
    onAuctionUpdate: () => queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.AUCTIONS, 'venues'] }),
  });

  const handleRegister = (auction: any) => {
    setFormData((prev) => ({ ...prev, selectedAuction: auction._id }));
    setRegisterModalOpen(true);
    setRegistrationSuccess(false);
    setSubmitError("");
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) return;

    const selected = auctions.find((a) => a._id === formData.selectedAuction);
    const auctionName = selected?.auctionTitle || "Live Auction";
    const venueName = selected?.venue?.name || "";
    const venueAddress = [selected?.venue?.address, selected?.venue?.city, selected?.venue?.postcode]
      .filter(Boolean)
      .join(", ");
    const auctionDate = selected?.startDateTime
      ? new Date(selected.startDateTime).toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
      : "";
    const auctionTime = selected?.startDateTime
      ? new Date(selected.startDateTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" }) + " GMT"
      : "";

    const messageLines = [
      `Auction: ${auctionName}`,
      `Venue: ${venueName}`,
      `Address: ${venueAddress}`,
      `Date: ${auctionDate}`,
      `Time: ${auctionTime}`,
      `Registrant Address: ${formData.address}, ${formData.city}, ${formData.postcode}`,
      formData.interests ? `Property Interests: ${formData.interests}` : "",
    ].filter(Boolean).join("\n");

    setIsSubmitting(true);
    setSubmitError("");
    try {
      const data = await apiClient.fetch("/leads", {
        method: "POST",
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          subject: "Live Auction Registration",
          message: messageLines,
          leadType: "live-registration",
          auctionRef: formData.selectedAuction,
        }),
      });
      if (data.success) {
        setRegistrationSuccess(true);
      } else {
        setSubmitError(data.message || "Registration failed. Please try again.");
      }
    } catch (e: any) {
      setSubmitError(e?.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-95" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 size-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 right-0 size-96 bg-cyan-300 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-lg rounded-full mb-6 border border-white/40">
              <MapPin className="size-5 text-white" />
              <span className="text-sm font-bold text-white">
                {loading ? "Loading..." : `${auctions.length} Live Venue${auctions.length !== 1 ? "s" : ""}`}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              View Live Auction
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Locations Near You
              </span>
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Register now for upcoming auctions at our premium venues. Experience the thrill of live bidding with expert support.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setRegisterModalOpen(true)}
                className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
              >
                <Sparkles className="size-5" />
                Register Now
              </button>
              <button
                onClick={() => navigate("/online-auctions")}
                className="px-8 py-4 bg-white/20 backdrop-blur-lg text-white border-2 border-white/40 rounded-2xl font-bold hover:bg-white/30 transition-all flex items-center gap-2"
              >
                View Online Auctions
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-slate-900 mb-4">
            Our Live Auction Venues
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose from our upcoming live auctions and register to attend in person
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-white/60 animate-pulse">
                <div className="h-56 bg-slate-200" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-slate-200 rounded-lg w-3/4" />
                  <div className="h-4 bg-slate-200 rounded-lg w-1/2" />
                  <div className="h-4 bg-slate-200 rounded-lg w-2/3" />
                  <div className="h-4 bg-slate-200 rounded-lg w-1/3" />
                  <div className="h-12 bg-slate-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : auctions.length === 0 ? (
          <div className="text-center py-20">
            <div className="size-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="size-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-black text-slate-700 mb-3">No Live Venues at the Moment</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              We don't have any live auction venues scheduled right now. Check back soon or browse our online auctions.
            </p>
            <button
              onClick={() => navigate("/online-auctions")}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Browse Online Auctions
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {auctions.map((auction) => {
              const startDate = auction.startDateTime ? new Date(auction.startDateTime) : null;
              const dateStr = startDate?.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                timeZone: 'Europe/London',
              }) || 'TBC';
              const timeStr = startDate
                ? startDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' }) + ' GMT'
                : '';
              const lots = auction.properties?.length || 0;
              const gradients = [
                "from-blue-500 via-blue-600 to-indigo-600",
                "from-purple-500 via-purple-600 to-pink-600",
                "from-emerald-500 via-emerald-600 to-teal-600",
                "from-orange-500 via-orange-600 to-amber-600",
                "from-rose-500 via-rose-600 to-red-600",
                "from-cyan-500 via-cyan-600 to-blue-600",
              ];
              const gradient = gradients[auctions.indexOf(auction) % gradients.length];

              return (
                <div
                  key={auction._id}
                  className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all group border-2 border-white/60"
                >
                  <div className="relative h-56 overflow-hidden">
                    {(() => {
                      const auctionImage = auction.auctionImage ||
                        auction.properties?.[0]?.media?.propertyImages?.[0] ||
                        null;
                      return auctionImage ? (
                        <ImageWithFallback
                          src={auctionImage}
                          alt={auction.auctionTitle}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                          <MapPin className="size-16 text-white/50" />
                          <span className="text-white font-black text-xl ml-2">{auction.venue?.city}</span>
                        </div>
                      );
                    })()}
                    {auction.status === 'live' && (
                      <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-xs font-black rounded-full animate-pulse shadow-lg flex items-center gap-1">
                        🔴 Live Now
                      </div>
                    )}
                    {auction.status === 'scheduled' && (
                      <div className="absolute top-4 left-4 px-3 py-1.5 bg-blue-500 text-white text-xs font-black rounded-full shadow-lg flex items-center gap-1">
                        📅 Scheduled
                      </div>
                    )}
                    {auction.status === 'completed' && (
                      <div className="absolute top-4 left-4 px-3 py-1.5 bg-slate-500 text-white text-xs font-black rounded-full shadow-lg flex items-center gap-1">
                        ✅ Completed
                      </div>
                    )}
                    {lots > 0 && (
                      <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-black rounded-full shadow-lg">
                        {lots} {lots === 1 ? "Lot" : "Lots"}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 mb-1 leading-tight">
                          {auction.auctionTitle}
                        </h3>
                        <p className="text-sm font-bold text-blue-600">
                          {auction.venue?.name}
                        </p>
                      </div>
                      <div className={`size-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <MapPin className="size-6 text-white" />
                      </div>
                    </div>

                    <div className="space-y-2.5 mb-5">
                      {auction.venue?.address && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Navigation className="size-4 text-slate-400 flex-shrink-0" />
                          <span className="font-medium">
                            {[auction.venue.address, auction.venue.city, auction.venue.postcode].filter(Boolean).join(", ")}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="size-4 text-slate-400" />
                        <span className="font-medium">{dateStr}</span>
                      </div>
                      {timeStr && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="size-4 text-slate-400" />
                          <span className="font-medium">{timeStr}</span>
                        </div>
                      )}
                      {auction.startDateTime && auction.endDateTime && (
                        <AuctionTimer
                          startDateTime={auction.startDateTime}
                          endDateTime={auction.endDateTime}
                          status={auction.status}
                          showLabel={true}
                        />
                      )}
                    </div>

                    <div className="flex gap-3">
                      {auction.status === 'scheduled' && (
                        <button
                          onClick={() => handleRegister(auction)}
                          className={`flex-1 py-3.5 bg-gradient-to-r ${gradient} text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2`}
                        >
                          <CheckCircle className="size-5" />
                          Register
                        </button>
                      )}
                      {auction.status === 'live' && (
                        <button
                          disabled
                          className="flex-1 py-3.5 bg-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                        >
                          🔴 Live Now
                        </button>
                      )}
                      {auction.status === 'completed' && (
                        <button
                          disabled
                          className="flex-1 py-3.5 bg-slate-300 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                        >
                          ✅ Completed
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/auctions/${auction.slug || auction._id}/properties`)}
                        className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
                      >
                        <Gavel className="size-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 size-96 bg-white rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 size-96 bg-cyan-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white mb-4">Ready to Start Bidding?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Register now for any of our upcoming auctions and gain access to exclusive properties
            </p>
            <button
              onClick={() => setRegisterModalOpen(true)}
              className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-3"
            >
              <Sparkles className="size-6" />
              Register for Free
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {registerModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

            <button
              className="absolute top-6 right-6 size-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-all hover:rotate-90"
              onClick={() => { setRegisterModalOpen(false); setRegistrationSuccess(false); setSubmitError(""); }}
            >
              <X className="size-5 text-slate-600" />
            </button>

            {registrationSuccess ? (
              <div className="text-center py-8">
                <div className="size-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <CheckCircle className="size-14 text-white" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">Registration Successful! 🎉</h3>
                <p className="text-lg text-slate-600 mb-8">
                  Thank you, <strong>{formData.fullName}</strong>! We've sent a confirmation email to{" "}
                  <span className="font-bold text-blue-600">{formData.email}</span>
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/view-all-lots")}
                    className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    Browse Lots
                  </button>
                  <button
                    onClick={() => { setRegisterModalOpen(false); setRegistrationSuccess(false); }}
                    className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full mb-4">
                    <Sparkles className="size-4" />
                    <span className="text-sm font-bold">Free Registration</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">Register for Live Auctions</h3>
                  <p className="text-slate-600">Complete the form below to register for an upcoming live auction</p>
                </div>

                <form onSubmit={handleSubmitRegistration} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">Full Name *</label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                        placeholder="John Smith" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">Email Address *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                        placeholder="john@example.com" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">Phone Number *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                        placeholder="+44 7700 900000" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">City *</label>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                        placeholder="London" required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                      placeholder="123 Main Street, SW1A 1AA" />
                  </div>

                  {auctions.length > 0 && (
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">Select Auction Venue *</label>
                      <select name="selectedAuction" value={formData.selectedAuction} onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                        required>
                        <option value="">Select an auction</option>
                        {auctions.map((a) => (
                          <option key={a._id} value={a._id}>
                            {a.auctionTitle} — {a.venue?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Property Interests (Optional)</label>
                    <textarea name="interests" value={formData.interests} onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400 resize-none"
                      placeholder="E.g., Residential, Commercial, Investment Properties..." rows={3} />
                  </div>

                  {submitError && (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm font-medium">
                      {submitError}
                    </div>
                  )}

                  <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="size-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="font-bold mb-1">Your data is secure with us</p>
                        <p className="text-blue-700">We'll only use your information to contact you about relevant auctions.</p>
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting}
                    className="w-full py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 disabled:opacity-60 disabled:scale-100 transition-all flex items-center justify-center gap-2 text-lg">
                    <CheckCircle className="size-6" />
                    {isSubmitting ? "Submitting..." : "Complete Registration"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </PublicLayout>
  );
}

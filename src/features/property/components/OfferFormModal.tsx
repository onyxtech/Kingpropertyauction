import { useState, useRef, useEffect, useCallback } from "react";
import { X, CheckCircle, FileText, PenLine, Loader2, MapPin } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { showSuccess, showError } from "@/lib/toast";
import AddressAutocomplete from "@/features/shared/components/AddressAutocomplete";
import type { ParsedAddress } from "@/lib/googlePlaces";

interface OfferFormModalProps {
  show: boolean;
  onClose: () => void;
  property: any;
  user: any;
}

export default function OfferFormModal({ show, onClose, property, user }: OfferFormModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [signature, setSignature] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    offerAmount: "",
    offerAmountInWords: "",
    solicitorDetails: "",
    termsAccepted: false,
  });

  // ---- Reset form when modal opens ----
  useEffect(() => {
    if (show) {
      setForm({
        name: (user as any)?.name || "",
        email: (user as any)?.email || "",
        phone: "",
        address: "",
        city: "",
        postcode: "",
        offerAmount: "",
        offerAmountInWords: "",
        solicitorDetails: "",
        termsAccepted: false,
      });
      setSignature("");
      setErrors({});
      setSubmitted(false);
      clearCanvas();
    }
  }, [show]);

  // ---- Address Selected from Google Places ----
  const handleAddressSelect = (address: ParsedAddress) => {
    setForm((f) => ({
      ...f,
      address: address.streetAddress || address.formattedAddress || f.address,
      city: address.city || f.city,
      postcode: address.postalCode || f.postcode,
    }));
  };

  // ---- SIGNATURE CANVAS ----

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    setSignature("");
    setLastPos(null);
  }, []);

  const getCanvasCoords = (
    e: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement
  ): { x: number; y: number } | null => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;

    if ("touches" in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const coords = getCanvasCoords(e, canvas);
    if (!coords) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setLastPos(coords);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const coords = getCanvasCoords(e, canvas);
    if (!coords) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (lastPos) {
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }

    setLastPos(coords);
  };

  const stopDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (isDrawing) {
      setIsDrawing(false);
      setLastPos(null);
      const canvas = canvasRef.current;
      if (canvas) {
        setSignature(canvas.toDataURL("image/png"));
      }
    }
  };

  // ---- HELPERS ----

  const numberToWords = (num: number): string => {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const convertHundreds = (n: number): string => {
      if (n === 0) return "";
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
      return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " and " + convertHundreds(n % 100) : "");
    };

    if (num === 0) return "Zero";
    if (num < 0) return "Negative " + numberToWords(Math.abs(num));

    const billion = Math.floor(num / 1000000000);
    const million = Math.floor((num % 1000000000) / 1000000);
    const thousand = Math.floor((num % 1000000) / 1000);
    const remainder = num % 1000;

    let result = "";
    if (billion) result += convertHundreds(billion) + " Billion ";
    if (million) result += convertHundreds(million) + " Million ";
    if (thousand) result += convertHundreds(thousand) + " Thousand ";
    if (remainder) result += convertHundreds(remainder);

    return result.trim();
  };

  const handleAmountChange = (value: string) => {
    const num = parseFloat(value);
    setForm((f) => ({
      ...f,
      offerAmount: value,
      offerAmountInWords: !isNaN(num) && num > 0 ? numberToWords(num) + " Pounds Sterling" : "",
    }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email is required";
    if (!form.phone.trim() || form.phone.replace(/[\s\-+()]/g, "").length < 10) errs.phone = "Valid mobile phone is required";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.postcode.trim()) errs.postcode = "Postcode is required";
    if (!form.offerAmount || parseFloat(form.offerAmount) <= 0) errs.offerAmount = "Valid offer amount is required";
    if (!form.offerAmountInWords.trim()) errs.offerAmountInWords = "Amount in words is required";
    if (!form.solicitorDetails.trim()) errs.solicitorDetails = "Solicitor details are required (enter TBC if unsure)";
    if (!form.termsAccepted) errs.termsAccepted = "You must accept the Terms of Sale";
    if (!signature) errs.signature = "Signature is required";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const result = await apiClient.fetch("/offers", {
        method: "POST",
        body: JSON.stringify({
          property: property._id,
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          postcode: form.postcode,
          offerAmount: parseFloat(form.offerAmount),
          offerAmountInWords: form.offerAmountInWords,
          solicitorDetails: form.solicitorDetails,
          termsAccepted: form.termsAccepted,
          signature,
        }),
      });
      if (result.success) {
        setSubmitted(true);
        showSuccess("Offer Submitted!", "We'll review your offer and get back to you shortly.");
        setTimeout(() => {
          onClose();
          setSubmitted(false);
        }, 3000);
      } else {
        showError("Submission failed", result.message || "Please try again.");
      }
    } catch (e: any) {
      showError("Error", e.message || "Failed to submit offer.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  const inputClass = (field: string) =>
    `w-full px-4 py-3 border-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
      errors[field] ? "border-red-300 focus:ring-red-500 bg-red-50" : "border-slate-200 focus:ring-emerald-500 bg-white"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="p-10 text-center">
            <CheckCircle className="size-20 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-slate-900 mb-2">Offer Submitted!</h2>
            <p className="text-slate-600 font-medium">Thank you for your offer. Our team will review it and get back to you shortly.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white rounded-t-3xl sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="size-7" />
                  <div>
                    <h2 className="text-xl font-black">Submit Offer Now</h2>
                    <p className="text-white/80 text-sm font-medium truncate max-w-md">
                      {property?.propertyTitle || "Property"}
                    </p>
                    {property?.location && (
                      <p className="text-white/60 text-xs mt-1 flex items-start gap-1">
                        <MapPin className="size-3 mt-0.5 flex-shrink-0" />
                        <span>
                          {[
                            property.location.streetAddress,
                            property.location.area,
                            property.location.city,
                            property.location.postalCode,
                          ].filter(Boolean).join(", ")}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <button onClick={onClose} className="size-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Offer Amount */}
              <div>
                <label className="block text-sm font-black text-slate-900 mb-1.5">
                  Offer Amount <span className="text-red-500">*</span> <span className="text-slate-400 font-normal">(£ Pound Sterling)</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter your offer amount"
                  value={form.offerAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className={inputClass("offerAmount")}
                />
                {errors.offerAmount && <p className="text-red-500 text-xs mt-1 font-medium">{errors.offerAmount}</p>}
              </div>

              {/* Offer Amount in Words */}
              <div>
                <label className="block text-sm font-black text-slate-900 mb-1.5">
                  Offer Amount in Words <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. One Hundred Thousand Pounds Sterling"
                  value={form.offerAmountInWords}
                  onChange={(e) => setForm((f) => ({ ...f, offerAmountInWords: e.target.value }))}
                  className={inputClass("offerAmountInWords")}
                />
                {errors.offerAmountInWords && <p className="text-red-500 text-xs mt-1 font-medium">{errors.offerAmountInWords}</p>}
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-slate-900 mb-1.5">Name <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Your full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputClass("name")} />
                  {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-900 mb-1.5">Email <span className="text-red-500">*</span></label>
                  <input type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputClass("email")} />
                  {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-900 mb-1.5">Phone <span className="text-red-500">*</span> <span className="text-slate-400 font-normal text-xs">(Mobile Preferred)</span></label>
                  <input type="tel" placeholder="07123 456789" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputClass("phone")} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
                </div>
              </div>

              {/* Address with Google Autocomplete */}
              <AddressAutocomplete
                value={form.address}
                onChange={(value) => setForm((f) => ({ ...f, address: value }))}
                onAddressSelect={handleAddressSelect}
                placeholder="Start typing your address..."
                label="Address"
                required
                country="gb"
                className={errors.address ? "[&_input]:border-red-300 [&_input]:bg-red-50" : ""}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-slate-900 mb-1.5">City <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Your city" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className={inputClass("city")} />
                  {errors.city && <p className="text-red-500 text-xs mt-1 font-medium">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-900 mb-1.5">Postcode <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g. G1 2AB" value={form.postcode} onChange={(e) => setForm((f) => ({ ...f, postcode: e.target.value }))} className={inputClass("postcode")} />
                  {errors.postcode && <p className="text-red-500 text-xs mt-1 font-medium">{errors.postcode}</p>}
                </div>
              </div>

              {/* Solicitor Details */}
              <div>
                <label className="block text-sm font-black text-slate-900 mb-1.5">
                  Solicitor Company Name & Contact <span className="text-red-500">*</span> <span className="text-slate-400 font-normal text-xs">(Enter TBC if unsure)</span>
                </label>
                <input type="text" placeholder="Solicitor name, firm, and contact details" value={form.solicitorDetails} onChange={(e) => setForm((f) => ({ ...f, solicitorDetails: e.target.value }))} className={inputClass("solicitorDetails")} />
                {errors.solicitorDetails && <p className="text-red-500 text-xs mt-1 font-medium">{errors.solicitorDetails}</p>}
              </div>

              {/* Terms & Conditions */}
              <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed space-y-2">
                <p>By completing & submitting this form you hereby consent for King Property Auction to bid on your behalf in accordance with our <a href="/terms-of-sale" target="_blank" className="text-emerald-600 font-bold underline">TERMS & CONDITIONS OF SALE</a>. If your offer is successful you authorise King Property Auction to allocate a representative to sign the auction contract on your behalf. We will require payment of the necessary reservation deposit by bank transfer for which bank details and invoice will be provided upon acceptance by the seller.</p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.termsAccepted}
                  onChange={(e) => setForm((f) => ({ ...f, termsAccepted: e.target.checked }))}
                  className="mt-1 size-4 rounded border-2 border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  I accept the <a href="/terms-of-sale" target="_blank" className="text-emerald-600 font-bold underline">Terms of Sale</a>...
                </span>
              </label>
              {errors.termsAccepted && <p className="text-red-500 text-xs font-medium -mt-3">{errors.termsAccepted}</p>}

              {/* Signature */}
              <div>
                <label className="block text-sm font-black text-slate-900 mb-2">
                  Signature of Offeror <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-500 mb-2">Left click and hold mouse on PC or draw on any touchscreen device with your finger...</p>
                <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <PenLine className="size-3.5" /> Draw Your Signature Below
                </p>
                <div
                  className="border-2 border-slate-300 rounded-xl overflow-hidden bg-white"
                  style={{ cursor: "crosshair", touchAction: "none" }}
                >
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={150}
                    className="w-full block"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                </div>
                <button type="button" onClick={clearCanvas} className="mt-2 text-sm font-bold text-slate-500 hover:text-red-600 transition-colors">
                  Clear
                </button>
                {errors.signature && <p className="text-red-500 text-xs mt-1 font-medium">{errors.signature}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-black text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" /> Submitting...
                  </>
                ) : (
                  "COMPLETE - Submit Your Offer Now"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
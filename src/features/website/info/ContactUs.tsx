import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Headphones,
  Globe,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import PublicLayout from "@/features/shared/layout/PublicLayout";
import { apiClient } from "@/lib/apiClient";
import { showSuccess, showError } from "@/lib/toast";
import AIChatWidget from "@/features/shared/components/AIChatWidget";

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const firstName = (fd.get("firstName") as string || "").trim();
    const lastName = (fd.get("lastName") as string || "").trim();
    const fullName = `${firstName} ${lastName}`.trim();
    const email = (fd.get("email") as string || "").trim();
    const phone = (fd.get("phone") as string || "").trim();
    const message = (fd.get("message") as string || "").trim();
    const errors: string[] = [];
    if (!fullName || fullName.length < 2) errors.push("Name must be at least 2 characters");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Valid email address is required");
    if (phone && phone.replace(/[\s\-\+\(\)]/g, "").length < 10) errors.push("Please enter a valid phone number");
    if (!message || message.length < 10) errors.push("Message must be at least 10 characters");
    if (errors.length > 0) { setError(errors.join(". ")); return; }
    setError("");
    setLoading(true);
    try {
      await apiClient.fetch("/leads", {
        method: "POST",
        body: JSON.stringify({
          name:
            `${fd.get("firstName") || ""} ${fd.get("lastName") || ""}`.trim() ||
            "User",
          email: fd.get("email") || "",
          phone: fd.get("phone") || "",
          subject: fd.get("subject") || "General Inquiry",
          message: fd.get("message") || "",
          leadType: "contact",
        }),
      });
      setSubmitted(true);
      showSuccess("Message sent!", "We'll get back to you within 24 hours.");
    } catch (e: any) {
      showError("Submission failed", "Please try again.");
      console.error("Contact submit error:", e);
    }
    setLoading(false);
  };

  return (
    <PublicLayout>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 left-1/4 size-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-95" />
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
              <Sparkles className="size-4 text-yellow-300 animate-pulse" />
              <span className="text-sm font-bold text-white">
                24/7 Support · Expert Team · Quick Response
              </span>
            </div>
            <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Get In Touch
              <br />
              <span className="text-cyan-300">We're Here To Help</span>
            </h1>
            <p className="text-2xl text-white/90 font-medium">
              Have questions? Our expert team is ready to assist you
              <br />
              <span className="text-yellow-200">
                ✨ Response within 2 hours
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Contact Options */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: Phone,
              title: "Phone",
              sub: "Call us anytime",
              value: "0800 123 4567",
              color: "from-blue-500 to-indigo-600",
            },
            {
              icon: Mail,
              title: "Email",
              sub: "Send us a message",
              value: "info@kingauction.com",
              color: "from-purple-500 to-pink-600",
            },
            {
              icon: MessageCircle,
              title: "Live Chat",
              sub: "Chat with AI now",
              value: null,
              color: "from-emerald-500 to-teal-600",
            },
            {
              icon: Clock,
              title: "Hours",
              sub: "Mon-Fri: 9am-6pm",
              value: "Sat-Sun: 10am-4pm",
              color: "from-orange-500 to-amber-600",
            },
          ].map(({ icon: Icon, title, sub, value, color }, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105"
            >
              <div
                className={`size-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-lg`}
              >
                <Icon className="size-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                {title}
              </h3>
              <p className="text-slate-600 mb-4 font-medium">{sub}</p>
              {value ? (
                <p className="text-lg font-bold text-slate-900">{value}</p>
              ) : (
                <p className="text-sm text-slate-500 font-medium">
                  Click the chat bubble →
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border-2 border-white/60">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Send className="size-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900">
                  Send us a Message
                </h2>
                <p className="text-slate-600 font-medium">
                  We'll respond within 2 hours
                </p>
              </div>
            </div>

            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle className="size-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-slate-900">
                  Message Sent!
                </h3>
                <p className="text-slate-600 mt-2">
                  We'll respond within 2 hours. Check your email for
                  confirmation.
                </p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      placeholder="John"
                      className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="john.doe@example.com"
                    className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+44 7xxx xxx xxx"
                    className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                  >
                    <option>General Inquiry</option>
                    <option>Property Valuation</option>
                    <option>Auction Question</option>
                    <option>Technical Support</option>
                    <option>Partnership</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium resize-none"
                  />
                </div>
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-3 disabled:opacity-60"
                >
                  <Send className="size-5" />
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
              <div className="flex items-start gap-4 mb-6">
                <div className="size-14 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <MapPin className="size-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">
                    Visit Our Office
                  </h3>
                  <p className="text-slate-600 font-medium mb-4">
                    123 Property Lane
                    <br />
                    Mayfair, London
                    <br />
                    W1K 5AB, United Kingdom
                  </p>
                  <button
                    onClick={() =>
                      window.open(
                        "https://www.google.com/maps/search/?api=1&query=123+Property+Lane+Mayfair+London+W1K+5AB+United+Kingdom",
                        "_blank",
                      )
                    }
                    className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    Get Directions
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
              <div className="flex items-start gap-4">
                <div className="size-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Headphones className="size-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">
                    Expert Support Team
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "24/7 AI Assistant",
                      "Property Specialists",
                      "Legal Advisors",
                      "Finance Experts",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <CheckCircle className="size-5 text-emerald-600 flex-shrink-0" />
                        <span className="text-slate-700 font-medium">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
              <div className="flex items-start gap-4">
                <div className="size-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Globe className="size-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">
                    Follow Us
                  </h3>
                  <div className="flex gap-3">
                    {[
                      { label: "f", color: "from-blue-500 to-blue-600" },
                      { label: "𝕏", color: "from-cyan-500 to-blue-500" },
                      { label: "in", color: "from-pink-500 to-rose-600" },
                      { label: "IG", color: "from-purple-500 to-pink-500" },
                    ].map(({ label, color }, idx) => (
                      <button
                        key={idx}
                        className={`size-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-110`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Widget */}
      <AIChatWidget />
    </PublicLayout>
  );
}

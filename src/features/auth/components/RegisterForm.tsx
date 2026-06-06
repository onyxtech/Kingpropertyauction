import { useState } from "react";
import { useNavigate } from "react-router";
import { showSuccess, showError } from "@/lib/toast";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  CheckCircle,
  MapPin,
  Building2,
  Globe,
  ChevronLeft,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import AddressAutocomplete from "@/features/shared/components/AddressAutocomplete";

const roles = [
  {
    key: "buyer",
    icon: "🏠",
    title: "Buyer",
    desc: "I want to bid on and purchase properties",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    key: "seller",
    icon: "💰",
    title: "Seller",
    desc: "I want to list and sell my property",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    key: "agent",
    icon: "🏢",
    title: "Agent",
    desc: "I am a property agent or agency",
    gradient: "from-orange-500 to-amber-600",
  },
];

export default function RegisterForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"role" | "form" | "success">("role");
  const [selectedRole, setSelectedRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    licenseNumber: "",
    street: "",
    city: "",
    postcode: "",
    country: "United Kingdom",
    marketingConsent: true,
    acceptTerms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setTimeout(() => setStep("form"), 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password
    ) {
      setError("Please fill in all required fields");
      return;
    }
    if (formData.firstName.trim().length < 2) {
      setError("First name must be at least 2 characters");
      return;
    }
    if (formData.lastName.trim().length < 2) {
      setError("Last name must be at least 2 characters");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!/^[\+\d\s\-\(\)]{10,15}$/.test(formData.phone)) {
      setError("Please enter a valid phone number (10-15 digits)");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!formData.acceptTerms) {
      setError("You must accept the Terms of Service");
      return;
    }

    setLoading(true);
    try {
      const body: any = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: selectedRole,
        marketingOptOut: !formData.marketingConsent,
        address: {
          street: formData.street,
          city: formData.city,
          postcode: formData.postcode,
          country: formData.country,
        },
      };

      if (selectedRole === "agent") {
        body.agentDetails = {
          companyName: formData.companyName,
          licenseNumber: formData.licenseNumber,
        };
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (data.success) {
        showSuccess("Account created! 🎉", "Please wait for admin approval.");
        setStep("success");
      } else {
        setError(data.message || "Registration failed");
        showError("Registration failed", data.message || "Registration failed");
      }
    } catch {
      setError("Cannot connect to server");
      showError("Connection error", "Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  // Success State
  if (step === "success") {
    return (
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-10 text-center">
        <div className="size-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="size-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Account Created!
        </h2>
        <p className="text-slate-600 mb-2">
          Your account has been submitted for review.
        </p>
        {selectedRole === "seller" ? (
          <p className="text-sm text-slate-500 mb-6">
            Once approved, you'll be able to list and manage your properties for
            auction.
          </p>
        ) : selectedRole === "agent" ? (
          <p className="text-sm text-slate-500 mb-6">
            Once approved, you'll be able to manage properties and clients on
            the platform.
          </p>
        ) : (
          <p className="text-sm text-slate-500 mb-6">
            You'll receive an email once your account is approved. You can then
            login and start bidding.
          </p>
        )}
        <button
          onClick={() => navigate("/login")}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Role Selection Step
  if (step === "role") {
    return (
      <div className="space-y-6">
        <p className="text-center text-slate-600 font-medium">
          Choose how you want to use King Property Auction
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {roles.map((role) => (
            <button
              key={role.key}
              onClick={() => handleRoleSelect(role.key)}
              className={`p-6 rounded-2xl border-2 text-left transition-all hover:scale-105 hover:shadow-xl group ${
                selectedRole === role.key
                  ? `bg-gradient-to-br ${role.gradient} text-white border-transparent shadow-xl`
                  : "bg-white border-slate-200 hover:border-blue-300"
              }`}
            >
              <span className="text-3xl mb-3 block">{role.icon}</span>
              <h3
                className={`text-lg font-black mb-1 ${selectedRole === role.key ? "text-white" : "text-slate-900"}`}
              >
                {role.title}
              </h3>
              <p
                className={`text-sm ${selectedRole === role.key ? "text-white/80" : "text-slate-500"}`}
              >
                {role.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Registration Form Step
  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8">
      {/* Back + Selected Role Badge */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setStep("role")}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ChevronLeft className="size-4" /> Change role
        </button>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${roles.find((r) => r.key === selectedRole)?.gradient || "from-blue-500 to-indigo-600"}`}
        >
          {roles.find((r) => r.key === selectedRole)?.icon}{" "}
          {roles.find((r) => r.key === selectedRole)?.title}
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal Details */}
        <div>
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider mb-3">
            Personal Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                First Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  placeholder="John"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Last Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  placeholder="Smith"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div>
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider mb-3">
            Account Details
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  placeholder="+44 7XXX XXXXXX"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    placeholder="Min 8 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    placeholder="Re-enter password"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider mb-3">
            Address
          </h3>
          <div className="space-y-3">
            <div>
              <AddressAutocomplete
                label="Street Address"
                value={formData.street}
                onChange={(val) => setFormData((prev) => ({ ...prev, street: val }))}
                onAddressSelect={(addr) => {
                  setFormData((prev) => ({
                    ...prev,
                    street: addr.streetAddress || addr.formattedAddress || prev.street,
                    city: addr.city || prev.city,
                    postcode: addr.postalCode || prev.postcode,
                    country: addr.country || prev.country,
                  }));
                }}
                placeholder="123 Main Street"
                inputClassName="py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white border-2-0"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  placeholder="London"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Postcode
                </label>
                <input
                  type="text"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  placeholder="SW1A 1AA"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Country
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  placeholder="United Kingdom"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Agent-specific fields */}
        {selectedRole === "agent" && (
          <div>
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider mb-3">
              Agency Details
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    placeholder="Your Agency Ltd."
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  License Number
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  placeholder="Estate agent license number"
                />
              </div>
            </div>
          </div>
        )}

        {/* Consent */}
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="marketingConsent"
              checked={formData.marketingConsent}
              onChange={handleInputChange}
              className="size-4 rounded border-slate-300 text-blue-600 mt-0.5"
            />
            <span className="text-sm text-slate-600">
              I'd like to receive emails about upcoming auctions and property
              alerts
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleInputChange}
              className="size-4 rounded border-slate-300 text-blue-600 mt-0.5"
              required
            />
            <span className="text-sm text-slate-600">
              I agree to the{" "}
              <button
                type="button"
                className="text-blue-600 font-medium hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  window.open("/terms-of-sale", "_blank");
                }}
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="text-blue-600 font-medium hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  window.open("/terms-of-sale", "_blank");
                }}
              >
                Privacy Policy
              </button>
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 text-lg"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-xs text-center text-slate-400">
          By creating an account, you agree to our Terms and Privacy Policy.
          Your account will be reviewed before activation.
        </p>
      </form>
    </div>
  );
}

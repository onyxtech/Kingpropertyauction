import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Header from "@/features/shared/layout/Header";
import Footer from "@/features/shared/layout/Footer";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setSent(true);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Cannot connect to server");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <Header />
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md shadow-xl border-2 border-white/60">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"
          >
            <ArrowLeft className="size-4" /> Back to Login
          </button>

          {sent ? (
            <div className="text-center">
              <div className="size-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="size-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                Check Your Email
              </h2>
              <p className="text-slate-600">
                If an account exists with that email, we've sent a password
                reset link.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                Forgot Password?
              </h2>
              <p className="text-slate-600 mb-6">
                Enter your email and we'll send you a reset link.
              </p>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm font-bold mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

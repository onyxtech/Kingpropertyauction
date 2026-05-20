import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";
import PublicLayout from "@/features/shared/layout/PublicLayout";
import { apiClient } from "@/lib/apiClient";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const data = await apiClient.fetch(`/auth/reset-password/${token}`, {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      if (data.success) {
        setDone(true);
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err?.message || "Cannot connect to server");
    }
    setLoading(false);
  };

  return (
    <PublicLayout>
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md shadow-xl border-2 border-white/60">
          {done ? (
            <div className="text-center">
              <div className="size-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="size-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Password Reset!</h2>
              <p className="text-slate-600 mb-6">Your password has been changed. You can now login.</p>
              <button onClick={() => navigate("/login")} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold">
                Go to Login
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Reset Password</h2>
              <p className="text-slate-600 mb-6">Enter your new password below.</p>

              {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm font-bold flex items-center gap-2 mb-4"><AlertCircle className="size-4" />{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Min 6 characters" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                    <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Re-enter password" />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50">
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
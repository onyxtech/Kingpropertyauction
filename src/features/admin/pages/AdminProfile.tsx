import { useState } from "react";
import { User, Mail, Shield, Clock, Save } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import AdminLayout from "../components/AdminLayout";
import { apiClient } from "@/lib/apiClient";

export default function AdminProfile() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError("New passwords don't match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await apiClient.fetch("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
        }),
      });
      if (data.success) {
        const updatedUser = { ...user, name: data.user.name, email: data.user.email };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        useAuthStore.getState().login(localStorage.getItem("token")!, updatedUser);
        setSaved(true);
        setIsEditing(false);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(data.message || "Update failed");
      }
    } catch (err) {
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout activeTab="profile" onTabChange={() => {}}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/60 shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="size-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-3xl">
                {user?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "AD"}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">{user?.name || "Admin User"}</h1>
              <p className="text-slate-600 font-medium capitalize">{user?.role || "Administrator"}</p>
            </div>
            {saved && <span className="ml-auto px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-bold">✅ Profile saved!</span>}
          </div>

          {!isEditing ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <User className="size-5 text-blue-600" />
                <div><p className="text-xs text-slate-500 font-medium">Name</p><p className="font-bold text-slate-900">{user?.name || "Admin User"}</p></div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <Mail className="size-5 text-indigo-600" />
                <div><p className="text-xs text-slate-500 font-medium">Email</p><p className="font-bold text-slate-900">{user?.email || "admin@kingauction.com"}</p></div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <Shield className="size-5 text-purple-600" />
                <div><p className="text-xs text-slate-500 font-medium">Role</p><p className="font-bold text-slate-900 capitalize">{user?.role || "Admin"}</p></div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <Clock className="size-5 text-green-600" />
                <div><p className="text-xs text-slate-500 font-medium">Account Status</p><p className="font-bold text-green-600">Active</p></div>
              </div>
              <button onClick={() => setIsEditing(true)} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:scale-105 transition-all">Edit Profile</button>
            </div>
          ) : (
            <div className="space-y-4">
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">{error}</div>}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <hr className="my-4" />
              <p className="text-sm font-bold text-slate-700">Change Password (optional)</p>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                <input type="password" value={formData.currentPassword} onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                <input type="password" value={formData.newPassword} onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
                <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all">Cancel</button>
                <button onClick={handleSave} disabled={loading} className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-all flex items-center justify-center gap-2"><Save className="size-5" />{loading ? "Saving..." : "Save Changes"}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
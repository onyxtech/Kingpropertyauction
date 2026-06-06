import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useTheme } from "../../../app/hooks/useTheme";
import { useAuthStore } from "@/stores/authStore";
import { useCustomerRole } from "../hooks/useCustomerRole";

export default function CustomerProfileDropdown() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, logout } = useAuthStore();
  const { getCombinedRoleLabel } = useCustomerRole();
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const initials = user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current && ref.current.contains(target)) return;
      const portal = document.getElementById("customer-profile-portal");
      if (portal && portal.contains(target)) return;
      setShow(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setShow(!show)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition-all"
      >
        <div className={`size-9 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center shadow-md`}>
          <span className="text-white text-xs font-black">{initials}</span>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-black text-slate-900 leading-none">{user?.name}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">{getCombinedRoleLabel()}</p>
        </div>
        <ChevronDown className={`size-4 text-slate-500 transition-transform ${show ? "rotate-180" : ""}`} />
      </button>

      {show && createPortal(
        <div
          id="customer-profile-portal"
          className="fixed z-50 bg-white rounded-2xl shadow-2xl border-2 border-slate-100 w-56 overflow-hidden"
          style={{ top: "72px", right: "24px" }}
        >
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <p className="font-black text-slate-900 text-sm">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            <span className={`mt-1.5 inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r ${theme.primary} text-white`}>
              {getCombinedRoleLabel()}
            </span>
          </div>
          <div className="p-2">
            <button
              onClick={() => { navigate("/dashboard/profile"); setShow(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl"
            >
              <User className="size-5 text-slate-500" /> My Profile
            </button>
            <hr className="my-1 border-slate-100" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl"
            >
              <LogOut className="size-5" /> Logout
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

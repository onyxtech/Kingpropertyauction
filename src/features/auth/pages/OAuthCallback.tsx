import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuthStore } from "@/stores/authStore";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore(state => state.login);

  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        login(token, user);
                navigate(user.role === "admin" ? "/admin" : "/", { replace: true });
      } catch (e) {
        navigate("/login?error=oauth_failed", { replace: true });
      }
    } else {
      navigate("/login?error=oauth_failed", { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <div className="text-center">
        <div className="size-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-medium">Completing login...</p>
      </div>
    </div>
  );
}
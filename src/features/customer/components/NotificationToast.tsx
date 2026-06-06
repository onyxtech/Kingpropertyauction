import { Award, AlertCircle, Info } from "lucide-react";
import { useNavigate } from "react-router";

interface Toast {
  id: number;
  type: string;
  title: string;
  message: string;
  color: string;
  link?: string;
}

interface NotificationToastProps {
  toasts: Toast[];
}

export default function NotificationToast({ toasts }: NotificationToastProps) {
  const navigate = useNavigate();

  if (!toasts.length) return null;

  const getColor = (color: string) => {
    const map: Record<string, string> = {
      orange: "border-orange-400 bg-orange-50",
      green: "border-green-400 bg-green-50",
      red: "border-red-400 bg-red-50",
      blue: "border-blue-400 bg-blue-50",
    };
    return map[color] || "border-slate-400 bg-white";
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "won": return <Award className="size-5 text-amber-500" />;
      case "outbid": return <AlertCircle className="size-5 text-orange-500" />;
      default: return <Info className="size-5 text-blue-500" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[300] space-y-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-2xl shadow-2xl border-l-4 ${getColor(toast.color)}`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(toast.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-slate-900 text-sm">{toast.title}</p>
            <p className="text-slate-600 text-xs mt-0.5">{toast.message}</p>
            {toast.link && (
              <button
                onClick={() => navigate(toast.link!)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 mt-1"
              >
                View →
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  show: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: "danger" | "success" | "primary" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
}

const variants = {
  danger:  { iconBg: "bg-red-100",    icon: "text-red-600",    btn: "bg-red-500 hover:bg-red-600" },
  success: { iconBg: "bg-green-100",  icon: "text-green-600",  btn: "bg-green-600 hover:bg-green-700" },
  primary: { iconBg: "bg-blue-100",   icon: "text-blue-600",   btn: "bg-blue-600 hover:bg-blue-700" },
  warning: { iconBg: "bg-orange-100", icon: "text-orange-600", btn: "bg-orange-600 hover:bg-orange-700" },
};

export default function ConfirmModal({ show, title, message, confirmLabel = "Confirm", variant = "danger", onConfirm, onCancel }: ConfirmModalProps) {
  if (!show) return null;
  const v = variants[variant];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`size-12 ${v.iconBg} rounded-full flex items-center justify-center`}>
            <AlertTriangle className={`size-6 ${v.icon}`} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">{title}</h3>
            <p className="text-sm text-slate-600">{message}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold">Cancel</button>
          <button onClick={onConfirm} className={`flex-1 py-3 ${v.btn} text-white rounded-xl font-bold`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

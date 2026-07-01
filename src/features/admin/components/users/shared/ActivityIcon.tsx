// src\features\admin\components\users\shared\ActivityIcon.tsx
import {
  FileText,
  DollarSign,
  Gavel,
  TrendingUp,
  Shield,
  User,
  House,
  MessageSquare,
  Bell,
  Mail,
  CreditCard,
  FileSignature,
  NotepadText,
} from "lucide-react";

const iconMap: Record<string, { icon: any; color: string }> = {
  doc: { icon: FileText, color: "bg-blue-100 text-blue-600" },
  payment: { icon: DollarSign, color: "bg-green-100 text-green-600" },
  auction: { icon: Gavel, color: "bg-rose-100 text-rose-600" },
  bid: { icon: TrendingUp, color: "bg-teal-100 text-teal-600" },
  kyc: { icon: Shield, color: "bg-violet-100 text-violet-600" },
  user: { icon: User, color: "bg-slate-100 text-slate-600" },
  property: { icon: House, color: "bg-amber-100 text-amber-600" },
  email: { icon: Mail, color: "bg-blue-100 text-blue-600" },
  alert: { icon: Bell, color: "bg-amber-100 text-amber-600" },
  message: { icon: MessageSquare, color: "bg-violet-100 text-violet-600" },
};

export function ActivityIcon({ type, className = "" }: { type: string; className?: string }) {
  const config = iconMap[type] || iconMap.user;
  const Icon = config.icon;
  return (
    <span className={`size-7 rounded-xl flex items-center justify-center shrink-0 ${config.color} ${className}`}>
      <Icon className="size-3.5" />
    </span>
  );
}
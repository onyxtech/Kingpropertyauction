// src\features\admin\components\users\tabs\PaymentsTab.tsx
import { CreditCard } from "lucide-react";
import { UserRecord } from "../UserActivityView";

export function PaymentsTab({ user }: { user: UserRecord }) {
  return (
    <div className="p-5">
      <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
        <CreditCard className="size-12 text-slate-300 mx-auto mb-3" />
        <h3 className="font-semibold text-slate-700">Payment History Coming Soon</h3>
        <p className="text-sm text-slate-400 mt-1">View all payments made by this user</p>
      </div>
    </div>
  );
}
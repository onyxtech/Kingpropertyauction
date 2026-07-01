// src\features\admin\components\users\tabs\DocumentsTab.tsx
import { FileSignature } from "lucide-react";
import { UserRecord } from "../UserActivityView";

export function DocumentsTab({ user }: { user: UserRecord }) {
  return (
    <div className="p-5">
      <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
        <FileSignature className="size-12 text-slate-300 mx-auto mb-3" />
        <h3 className="font-semibold text-slate-700">Documents Coming Soon</h3>
        <p className="text-sm text-slate-400 mt-1">User documents and agreements will appear here</p>
      </div>
    </div>
  );
}
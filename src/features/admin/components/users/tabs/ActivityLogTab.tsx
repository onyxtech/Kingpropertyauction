// src\features\admin\components\users\tabs\ActivityLogTab.tsx
import { NotepadText } from "lucide-react";
import { UserRecord } from "../UserActivityView";

export function ActivityLogTab({ user }: { user: UserRecord }) {
  return (
    <div className="p-5">
      <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
        <NotepadText className="size-12 text-slate-300 mx-auto mb-3" />
        <h3 className="font-semibold text-slate-700">Activity Log Coming Soon</h3>
        <p className="text-sm text-slate-400 mt-1">User activity and audit trail will appear here</p>
      </div>
    </div>
  );
}
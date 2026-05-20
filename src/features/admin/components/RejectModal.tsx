interface RejectModalProps {
  rejectingLead: any | null;
  rejectReason: string;
  setRejectReason: (reason: string) => void;
  onReject: () => void;
  onClose: () => void;
}

export default function RejectModal({
  rejectingLead,
  rejectReason,
  setRejectReason,
  onReject,
  onClose,
}: RejectModalProps) {
  if (!rejectingLead) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <h3 className="text-xl font-black text-slate-900 mb-2">Reject Registration</h3>
        <p className="text-sm text-slate-600 mb-4">
          Provide a reason for rejecting <strong>{rejectingLead?.name}</strong>'s registration.
        </p>
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Enter rejection reason..."
          rows={3}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-red-400 resize-none mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={onReject}
            className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
          >
            Reject
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

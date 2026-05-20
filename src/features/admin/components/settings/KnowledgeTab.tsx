import { Brain, Save, Trash2 } from "lucide-react";

interface KnowledgeTabProps {
  knowledgeEntries: any[];
  selectedEntry: any | null;
  editTitle: string;
  editContent: string;
  editCategory: string;
  knowledgeSaving: boolean;
  knowledgeMsg: string;
  onSelectEntry: (entry: any) => void;
  onNew: () => void;
  setEditTitle: (v: string) => void;
  setEditContent: (v: string) => void;
  setEditCategory: (v: string) => void;
  onSave: () => void;
  onToggle: (entry: any) => void;
  onDelete: (entry: any) => void;
}

export default function KnowledgeTab({
  knowledgeEntries,
  selectedEntry,
  editTitle,
  editContent,
  editCategory,
  knowledgeSaving,
  knowledgeMsg,
  onSelectEntry,
  onNew,
  setEditTitle,
  setEditContent,
  setEditCategory,
  onSave,
  onToggle,
  onDelete,
}: KnowledgeTabProps) {
  return (
    <div className="flex gap-6" style={{ height: 560 }}>
      {/* Left: Entry List */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-2 overflow-y-auto pr-1">
        <button
          onClick={onNew}
          className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition flex items-center gap-2 flex-shrink-0"
        >
          <Brain className="size-4" /> New Entry
        </button>
        {knowledgeEntries.length === 0 && (
          <p className="text-xs text-slate-400 text-center mt-4">
            No knowledge entries yet.
          </p>
        )}
        {knowledgeEntries.map((entry) => (
          <button
            key={entry._id}
            onClick={() => onSelectEntry(entry)}
            className={`w-full text-left px-3 py-2.5 rounded-xl border-2 transition-all flex-shrink-0 ${
              selectedEntry?._id === entry._id
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-sm font-bold text-slate-800 truncate">
                {entry.title || "(Untitled)"}
              </span>
              <span
                className={`size-2 rounded-full flex-shrink-0 ${
                  entry.isActive ? "bg-green-500" : "bg-slate-300"
                }`}
              />
            </div>
            <span className="text-xs text-slate-400 capitalize">
              {entry.category}
            </span>
          </button>
        ))}
      </div>

      {/* Right: Editor */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {!selectedEntry ? (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <Brain className="size-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Select an entry to edit</p>
              <p className="text-sm mt-1">or click New Entry to create one</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Entry title"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="company">Company</option>
                  <option value="process">Process</option>
                  <option value="fees">Fees</option>
                  <option value="legal">Legal</option>
                  <option value="faq">FAQ</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
            <div className="flex-1 flex flex-col min-h-0">
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Content
              </label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="flex-1 w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                placeholder="Write knowledge content for the AI assistant..."
              />
            </div>
            <div className="flex items-center justify-between gap-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggle(selectedEntry)}
                  disabled={selectedEntry._id === "new"}
                  className={`px-3 py-2 text-xs font-bold rounded-lg border-2 transition disabled:opacity-40 ${
                    selectedEntry.isActive
                      ? "border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
                      : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                  }`}
                >
                  {selectedEntry.isActive ? "Active" : "Inactive"}
                </button>
                {selectedEntry._id !== "new" && (
                  <button
                    onClick={() => onDelete(selectedEntry)}
                    className="px-3 py-2 text-xs font-bold rounded-lg border-2 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center gap-1"
                  >
                    <Trash2 className="size-3.5" /> Delete
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                {knowledgeMsg && (
                  <span
                    className={`text-xs font-bold ${
                      knowledgeMsg.includes("Error")
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {knowledgeMsg}
                  </span>
                )}
                <button
                  onClick={onSave}
                  disabled={
                    knowledgeSaving ||
                    !editTitle.trim() ||
                    !editContent.trim()
                  }
                  className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
                >
                  <Save className="size-4" />
                  {knowledgeSaving ? "Saving..." : "Save Entry"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { Save, FileText } from "lucide-react";

interface SimpleField {
  label: string;
  value: string;
  index: number;
}

interface EmailTemplatesTabProps {
  templates: Record<string, any>;
  templateLabels: Record<string, { label: string; icon: string; category: string }>;
  selectedTemplate: string | null;
  editSubject: string;
  editHtml: string;
  templateSaving: boolean;
  templateFilter: string;
  showPreview: boolean;
  templateMessage: string;
  simpleMode: boolean;
  simpleFields: SimpleField[];
  showLinkInput: boolean;
  linkText: string;
  linkUrl: string;
  linkStyle: "text" | "button";
  focusedFieldIndex: number | null;
  onSelectTemplate: (key: string, tpl: any) => void;
  setEditSubject: (v: string) => void;
  setEditHtml: (v: string | ((prev: string) => string)) => void;
  setTemplateFilter: (v: string) => void;
  setSimpleMode: (v: boolean) => void;
  setShowPreview: (v: boolean) => void;
  setShowLinkInput: (v: boolean) => void;
  setLinkText: (v: string) => void;
  setLinkUrl: (v: string) => void;
  setLinkStyle: (v: "text" | "button") => void;
  setFocusedFieldIndex: (v: number | null) => void;
  onSave: () => void;
  onReset: () => void;
  extractSimpleFields: (html: string) => SimpleField[];
  updateSimpleField: (fieldIndex: number, newValue: string) => void;
  insertBeforeClose: (html: string, newContent: string) => string;
  setTemplateMessage: (v: string) => void;
  setSimpleFields: (fields: SimpleField[]) => void;
}

export default function EmailTemplatesTab({
  templates,
  templateLabels,
  selectedTemplate,
  editSubject,
  editHtml,
  templateSaving,
  templateFilter,
  showPreview,
  templateMessage,
  simpleMode,
  simpleFields,
  showLinkInput,
  linkText,
  linkUrl,
  linkStyle,
  focusedFieldIndex,
  onSelectTemplate,
  setEditSubject,
  setEditHtml,
  setTemplateFilter,
  setSimpleMode,
  setShowPreview,
  setShowLinkInput,
  setLinkText,
  setLinkUrl,
  setLinkStyle,
  setFocusedFieldIndex,
  onSave,
  onReset,
  extractSimpleFields,
  updateSimpleField,
  insertBeforeClose,
  setTemplateMessage,
  setSimpleFields,
}: EmailTemplatesTabProps) {
  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {[
          { label: "All", value: "" },
          { label: "Auth", value: "auth" },
          { label: "Bidding", value: "bidding" },
          { label: "Auction", value: "auction" },
          { label: "Property", value: "property" },
          { label: "Leads", value: "lead" },
        ].map(({ label, value }) => (
          <button
            key={label}
            onClick={() => setTemplateFilter(value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              templateFilter === value
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Main flex layout: Left List + Right Editor */}
      <div className="flex gap-6" style={{ minHeight: "560px" }}>
        {/* Left: Template List */}
        <div className="w-1/3 flex-shrink-0 overflow-y-auto space-y-2 pr-1">
          {Object.keys(templates).length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Loading templates...</p>
            </div>
          ) : (
            Object.entries(templates)
              .filter(([key]: [string, any]) => {
                if (!templateFilter) return true;
                const tpl = templates[key];
                const cat = (
                  tpl?.category ||
                  templateLabels[key]?.category ||
                  ""
                ).toLowerCase();
                return cat === templateFilter.toLowerCase();
              })
              .map(([key, tpl]: [string, any]) => (
                <div
                  key={key}
                  onClick={() => onSelectTemplate(key, tpl)}
                  className={`p-3 rounded-xl cursor-pointer transition-all border-2 ${
                    selectedTemplate === key
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">
                      {templateLabels[key]?.icon || "📧"}
                    </span>
                    <span className="font-bold text-sm text-slate-900 truncate">
                      {templateLabels[key]?.label || key}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 capitalize">
                      {templates[key]?.category ||
                        templateLabels[key]?.category ||
                        "System"}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">
                      {tpl.subject}
                    </span>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Right: Editor */}
        <div className="flex-1 min-w-0 flex flex-col">
          {!selectedTemplate ? (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl">
              <div className="text-center">
                <div className="size-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <FileText className="size-7 text-slate-400" />
                </div>
                <p className="font-bold text-slate-600">
                  Select a template to edit
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Choose from the list on the left
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 overflow-y-auto">
              {/* Heading + buttons */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="font-black text-slate-900 text-base">
                  {templateLabels[selectedTemplate]?.label ||
                    selectedTemplate.replace(/([A-Z])/g, " $1").trim()}
                </h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                    <button
                      onClick={() => {
                        setSimpleMode(true);
                        setShowPreview(false);
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                        simpleMode && !showPreview
                          ? "bg-white text-blue-700 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      ✏️ Simple
                    </button>
                    <button
                      onClick={() => {
                        setSimpleMode(false);
                        setShowPreview(false);
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                        !simpleMode && !showPreview
                          ? "bg-white text-blue-700 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {"</>"} HTML
                    </button>
                    <button
                      onClick={() => {
                        setShowPreview(true);
                        setSimpleMode(false);
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                        showPreview
                          ? "bg-white text-blue-700 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      👁️ Preview
                    </button>
                  </div>
                  <button
                    onClick={onReset}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-700 hover:bg-amber-200"
                  >
                    Reset to Default
                  </button>
                </div>
                {templateMessage && (
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-lg ${
                      templateMessage.includes("Error")
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {templateMessage}
                  </span>
                )}
              </div>

              {/* Variable chips */}
              {templates[selectedTemplate]?.variables?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Available Variables
                  </p>
                  <p className="text-xs text-slate-400 mb-2">
                    💡 Click inside a text field above, then click a variable to
                    insert it there.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {templates[selectedTemplate].variables.map((v: string) => (
                      <span
                        key={v}
                        onClick={() => {
                          const insertion = `{${v}}`;
                          if (focusedFieldIndex !== null) {
                            updateSimpleField(
                              focusedFieldIndex,
                              (simpleFields.find(
                                (f) => f.index === focusedFieldIndex,
                              )?.value || "") + insertion,
                            );
                            setTemplateMessage(`Inserted ${insertion}`);
                            setTimeout(() => setTemplateMessage(""), 2000);
                          } else {
                            setEditHtml((prev) => {
                              const lastAnchorEnd = prev.lastIndexOf("</a>");
                              if (lastAnchorEnd !== -1) {
                                const insertPoint = prev.indexOf(
                                  "</div>",
                                  lastAnchorEnd,
                                );
                                if (insertPoint !== -1) {
                                  return (
                                    prev.slice(0, insertPoint) +
                                    insertion +
                                    prev.slice(insertPoint)
                                  );
                                }
                              }
                              const lastIndex = prev.lastIndexOf(
                                "</div></div>",
                              );
                              if (lastIndex === -1) return prev + insertion;
                              return (
                                prev.slice(0, lastIndex) +
                                insertion +
                                prev.slice(lastIndex)
                              );
                            });
                            setTemplateMessage(
                              `Inserted ${insertion} — click a field first to insert there`,
                            );
                            setTimeout(() => setTemplateMessage(""), 3000);
                          }
                        }}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-mono cursor-pointer hover:bg-blue-200 transition-colors select-none"
                        title={`Click to insert {${v}}`}
                      >
                        {`{${v}}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* HTML Editor */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  {simpleMode && !showPreview
                    ? "Content Editor"
                    : showPreview
                      ? "Preview"
                      : "HTML Content"}
                </label>
                {showPreview ? (
                  <div
                    className="flex-1 overflow-hidden bg-slate-100 rounded-xl flex flex-col"
                    style={{ minHeight: "300px" }}
                  >
                    <div className="px-3 py-1.5 text-xs text-slate-500 bg-slate-200 rounded-t-xl text-center font-medium">
                      📧 Email Preview — Rendered View
                    </div>
                    <iframe
                      srcDoc={editHtml}
                      className="w-full flex-1 border-0"
                      style={{ minHeight: "380px" }}
                      title="Email Preview"
                      sandbox="allow-same-origin"
                    />
                  </div>
                ) : simpleMode ? (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500 font-medium">
                      Edit the text content below. Switch to HTML mode for
                      advanced formatting.
                    </p>
                    {simpleFields.length === 0 && (
                      <p className="text-xs text-slate-400 italic">
                        No editable text fields found in this template. Use HTML
                        mode to edit.
                      </p>
                    )}
                    {simpleFields.map((field) => (
                      <div key={field.index}>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                            {field.label}
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              try {
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(
                                  editHtml,
                                  "text/html",
                                );
                                const elements = Array.from(
                                  doc.querySelectorAll("h1,h2,h3,h4,p"),
                                ).filter(
                                  (el) =>
                                    el.textContent !== null &&
                                    el.textContent !== undefined,
                                );
                                if (elements[field.index]) {
                                  elements[field.index].remove();
                                  const newHtml = doc.body.innerHTML;
                                  setEditHtml(newHtml);
                                  setSimpleFields(extractSimpleFields(newHtml));
                                }
                              } catch (e) {}
                            }}
                            className="text-xs text-red-400 hover:text-red-600 font-bold px-1.5 py-0.5 rounded hover:bg-red-50 transition-colors"
                            title="Remove this field"
                          >
                            ✕ Remove
                          </button>
                        </div>
                        {field.value.length > 60 ? (
                          <textarea
                            value={field.value}
                            onChange={(e) =>
                              updateSimpleField(field.index, e.target.value)
                            }
                            onFocus={() => setFocusedFieldIndex(field.index)}
                            rows={3}
                            className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 resize-none font-medium"
                          />
                        ) : (
                          <input
                            type="text"
                            value={field.value}
                            onChange={(e) =>
                              updateSimpleField(field.index, e.target.value)
                            }
                            onFocus={() => setFocusedFieldIndex(field.index)}
                            className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium"
                          />
                        )}
                      </div>
                    ))}
                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Add Content
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            const newHtml = insertBeforeClose(
                              editHtml,
                              '<h3 style="color:#1e293b;font-size:18px;font-weight:bold;margin:12px 0;">New Heading</h3>',
                            );
                            setEditHtml(newHtml);
                            setSimpleFields(extractSimpleFields(newHtml));
                          }}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-100 transition border border-blue-200"
                        >
                          + Heading
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newHtml = insertBeforeClose(
                              editHtml,
                              '<p style="color:#374151;font-size:14px;margin:8px 0;">New paragraph text here.</p>',
                            );
                            setEditHtml(newHtml);
                            setSimpleFields(extractSimpleFields(newHtml));
                          }}
                          className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg hover:bg-green-100 transition border border-green-200"
                        >
                          + Paragraph
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowLinkInput(!showLinkInput)}
                          className="px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-100 transition-colors"
                        >
                          + Link / Button
                        </button>
                      </div>
                      {showLinkInput && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                          <p className="text-xs font-bold text-slate-600">
                            Add Link or Button
                          </p>
                          <input
                            type="text"
                            placeholder="Link Text (e.g. View Property)"
                            value={linkText}
                            onChange={(e) => setLinkText(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                          />
                          <input
                            type="url"
                            placeholder="URL (e.g. https://kingauction.com)"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setLinkStyle("button")}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                                linkStyle === "button"
                                  ? "bg-purple-600 text-white border-purple-600"
                                  : "bg-white text-slate-600 border-slate-200"
                              }`}
                            >
                              🔲 Button Style
                            </button>
                            <button
                              type="button"
                              onClick={() => setLinkStyle("text")}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                                linkStyle === "text"
                                  ? "bg-purple-600 text-white border-purple-600"
                                  : "bg-white text-slate-600 border-slate-200"
                              }`}
                            >
                              🔗 Text Link
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (!linkText || !linkUrl) return;
                                const linkHtml =
                                  linkStyle === "button"
                                    ? `<div style="text-align:center;margin:16px 0;"><a href="${linkUrl}" style="background:linear-gradient(135deg,#f97316,#d97706);color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;font-size:14px;">${linkText}</a></div>`
                                    : `<p style="text-align:center;margin:8px 0;"><a href="${linkUrl}" style="color:#2563eb;text-decoration:underline;font-weight:bold;font-size:14px;">${linkText}</a></p>`;
                                const newHtml = insertBeforeClose(
                                  editHtml,
                                  linkHtml,
                                );
                                setEditHtml(newHtml);
                                setSimpleFields(extractSimpleFields(newHtml));
                                setLinkText("");
                                setLinkUrl("");
                                setShowLinkInput(false);
                              }}
                              className="flex-1 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700"
                            >
                              Add to Email
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowLinkInput(false)}
                              className="px-4 py-1.5 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <textarea
                      value={editHtml}
                      onChange={(e) => setEditHtml(e.target.value)}
                      className="flex-1 w-full p-4 border-2 border-slate-200 rounded-xl font-mono text-sm focus:outline-none focus:border-blue-500 resize-none"
                      placeholder="HTML template content..."
                      style={{ minHeight: "300px" }}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      💡 Tip: Use the variable chips above to insert dynamic
                      content. The HTML editor shows the raw template — use
                      Preview to see how it looks.
                    </p>
                  </>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-2 pb-4">
                <button
                  onClick={onSave}
                  disabled={templateSaving}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="size-4" />
                  {templateSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={onReset}
                  className="px-6 py-3 bg-white border-2 border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 hover:border-red-300 transition-all"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

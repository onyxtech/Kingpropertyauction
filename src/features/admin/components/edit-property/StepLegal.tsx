import { useState, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";
import {
  Scale,
  Shield,
  Upload,
  X,
  FileText,
  Lock,
  User,
  Phone,
  Mail,
  Building2,
  Trash2,
} from "lucide-react";
import { showSuccess, showError } from "@/lib/toast";
import AddressAutocomplete from "@/features/shared/components/AddressAutocomplete";
import type { ParsedAddress } from "@/lib/googlePlaces";

const DOC_TYPES = [
  {
    value: "photo_id",
    label: "📷 Photo ID — Passport / Driving Licence",
    hint: "Government-issued photo identification",
  },
  {
    value: "proof_of_address",
    label: "🏠 Proof of Address",
    hint: "Utility bill, bank statement or council tax letter (dated within 3 months)",
  },
  {
    value: "legal_pack",
    label: "📋 Legal Pack — Provided by your Solicitor",
    hint: "Title deeds, searches, contracts and legal documents",
  },
  {
    value: "solicitor_doc",
    label: "⚖️ Solicitor Document",
    hint: "Any official document from your solicitor or conveyancer",
  },
  {
    value: "other",
    label: "📄 Other Document",
    hint: "Any other relevant supporting document",
  },
];

const getDocLabel = (doc: any) => {
  const dt = doc.docType || doc.type || "";
  if (dt === "other" && doc.customLabel) return doc.customLabel;
  return (
    DOC_TYPES.find((d) => d.value === dt)?.label ||
    (dt ? dt.replace(/_/g, " ") : "📄 Document")
  );
};

export default function StepLegal({
  form,
  updateField,
  propertyId,
  createdBy,
}: any) {
  const [selectedDocType, setSelectedDocType] = useState("");
  const [customLabel, setCustomLabel] = useState("");
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const solicitor = form.solicitorDetails || {};
  const existingDocs = form.existingPrivateDocs || [];
  const newDocs = form.newPrivateDocs || [];

  const [ownerData, setOwnerData] = useState<any>(null);

  useEffect(() => {
    if (createdBy && typeof createdBy === "string") {
      apiClient
        .fetch(`/users/${createdBy}`)
        .then((res) => {
          if (res.success) setOwnerData(res.data);
        })
        .catch(() => {});
    } else if (createdBy && typeof createdBy === "object") {
      setOwnerData(createdBy);
    }
  }, [createdBy]);

  const updateSolicitor = (field: string, value: string) => {
    updateField("solicitorDetails", { ...solicitor, [field]: value });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    if (!selectedDocType) {
      alert("Please select a document type first");
      return;
    }
    const files = Array.from(e.target.files);
    const added = files.map((file) => ({
      docType: selectedDocType,
      customLabel: selectedDocType === "other" ? customLabel : "",
      file,
      originalName: file.name,
      preview: URL.createObjectURL(file),
    }));
    updateField("newPrivateDocs", [...newDocs, ...added]);
    setSelectedDocType("");
    setCustomLabel("");
    e.target.value = "";
  };

  const removeNewDoc = (i: number) => {
    updateField(
      "newPrivateDocs",
      newDocs.filter((_: any, idx: number) => idx !== i),
    );
  };

  const deleteExistingDoc = async (docIndex: number) => {
    if (!propertyId) return;
    setDeletingIndex(docIndex);
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(
        `/api/properties/${propertyId}/private-documents/${docIndex}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      if (data.success) {
        updateField(
          "existingPrivateDocs",
          existingDocs.filter((_: any, i: number) => i !== docIndex),
        );
        showSuccess("Document deleted", "The document has been removed.");
      } else {
        showError(
          "Delete failed",
          data.message || "Could not delete document.",
        );
      }
    } catch {
      showError("Delete failed", "Network error.");
    } finally {
      setDeletingIndex(null);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500";

  console.log("StepLegal createdBy:", createdBy);

  return (
    <div className="space-y-6">

       {/* Owner Information - Admin & Agent Only */}
      {createdBy && (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border-2 border-slate-200">
          <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
            <User className="size-5 text-slate-600" /> Owner Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-bold text-slate-500">Name</p>
              <p className="font-semibold text-slate-900">
                {createdBy?.name || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-600">Email</p>
              <p className="font-semibold text-slate-900">
                {createdBy?.email || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Phone</p>
              <p className="font-semibold text-slate-900">
                {createdBy?.phone || "—"}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs font-bold text-slate-500">Address</p>
              <p className="font-semibold text-slate-900">
                {createdBy?.address?.street
                  ? `${createdBy.address.street}, ${createdBy.address.city || ""}, ${createdBy.address.postcode || ""}`
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
        <Scale className="size-6 text-amber-600" /> Legal Information
      </h2>

     

      {/* Ownership */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-5">
        <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
          <Building2 className="size-5 text-blue-600" /> Ownership Details
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">
              Ownership Type
            </label>
            <select
              value={form.ownershipType || ""}
              onChange={(e) => updateField("ownershipType", e.target.value)}
              className={inputClass}
            >
              <option value="">Select...</option>
              <option value="freehold">Freehold</option>
              <option value="leasehold">Leasehold</option>
              <option value="shared">Shared Ownership</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">
              Title Deed Number
            </label>
            <input
              type="text"
              value={form.titleDeedNumber || ""}
              onChange={(e) => updateField("titleDeedNumber", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Solicitor Details */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-5">
        <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
          <User className="size-5 text-purple-600" />
          Solicitor Details
          <span className="text-xs font-medium text-slate-400 ml-1">
            (optional)
          </span>
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">
              Solicitor Name
            </label>
            <input
              type="text"
              placeholder="e.g., John Smith"
              value={solicitor.name || ""}
              onChange={(e) => updateSolicitor("name", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">
              Firm / Company Name
            </label>
            <input
              type="text"
              placeholder="e.g., Smith & Partners LLP"
              value={solicitor.firmName || ""}
              onChange={(e) => updateSolicitor("firmName", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="md:col-span-2">
            <AddressAutocomplete
              label="Address"
              value={solicitor.address || ""}
              onChange={(val) => updateSolicitor("address", val)}
              onAddressSelect={(addr: ParsedAddress) => {
                const parts = [
                  addr.streetAddress,
                  addr.city,
                  addr.state,
                  addr.postalCode,
                  addr.country,
                ].filter(Boolean);
                updateField("solicitorDetails", {
                  ...form.solicitorDetails,
                  address: parts.join(", "),
                  postcode:
                    addr.postalCode || form.solicitorDetails?.postcode || "",
                });
              }}
              placeholder="Start typing solicitor address..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Postcode</label>
            <input
              type="text"
              placeholder="e.g., SW1A 1AA"
              value={solicitor.postcode || ""}
              onChange={(e) => updateSolicitor("postcode", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">
              <Phone className="size-3.5 inline mr-1" />
              Phone
            </label>
            <input
              type="tel"
              placeholder="+44 7xxx xxx xxx"
              value={solicitor.phone || ""}
              onChange={(e) => updateSolicitor("phone", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">
              <Mail className="size-3.5 inline mr-1" />
              Email
            </label>
            <input
              type="email"
              placeholder="solicitor@firm.com"
              value={solicitor.email || ""}
              onChange={(e) => updateSolicitor("email", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Private Documents */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="size-5 text-amber-600" />
          <h3 className="font-black text-slate-900">Verification Documents</h3>
        </div>
        <p className="text-xs text-slate-500 mb-5 ml-7">
          Stored securely — only accessible by King Property Auction. NOT shown
          on public listing.
        </p>

        {/* Existing docs */}
        {existingDocs.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-bold text-slate-600 mb-3">
              Existing Documents ({existingDocs.length})
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {existingDocs.map((doc: any, i: number) => {
                const fileName =
                  doc.originalName || doc.url?.split("/").pop() || "Document";
                const fileUrl = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${doc.url}`;
                const isImg = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
                return (
                  <div
                    key={i}
                    className="bg-white border-2 border-amber-200 rounded-xl overflow-hidden"
                  >
                    <div className="h-28 bg-slate-100 flex items-center justify-center relative">
                      {isImg ? (
                        <img
                          src={fileUrl}
                          alt={fileName}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <div className="size-10 bg-red-100 rounded-xl flex items-center justify-center">
                            <FileText className="size-5 text-red-600" />
                          </div>
                          <span className="text-xs font-bold text-slate-500">
                            Document
                          </span>
                        </div>
                      )}
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white rounded-full text-xs font-bold">
                        {getDocLabel(doc)}
                      </span>
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-bold text-slate-700 truncate mb-2">
                        {fileName}
                      </p>
                      <div className="flex gap-1.5">
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold text-center hover:bg-blue-700 transition-all"
                        >
                          View
                        </a>
                        <a
                          href={fileUrl}
                          download={fileName}
                          className="flex-1 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold text-center hover:bg-slate-200 transition-all"
                        >
                          Download
                        </a>
                        <button
                          type="button"
                          onClick={() => deleteExistingDoc(i)}
                          disabled={deletingIndex === i}
                          className="px-2 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-bold hover:bg-red-200 transition-all disabled:opacity-50"
                        >
                          {deletingIndex === i ? (
                            "..."
                          ) : (
                            <Trash2 className="size-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add new doc */}
        <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200 mb-4">
          <p className="text-sm font-bold text-slate-700 mb-3">
            Add New Document
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Document Type *
              </label>
              <select
                value={selectedDocType}
                onChange={(e) => setSelectedDocType(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">Select type...</option>
                {DOC_TYPES.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              {selectedDocType && (
                <p className="text-xs text-slate-400 mt-1">
                  {DOC_TYPES.find((d) => d.value === selectedDocType)?.hint}
                </p>
              )}
            </div>
            {selectedDocType === "other" && (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Label *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Planning Permission"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            )}
          </div>
          {selectedDocType && (selectedDocType !== "other" || customLabel) && (
            <div className="mt-3">
              <input
                type="file"
                id="editPrivateDocUpload"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <label
                htmlFor="editPrivateDocUpload"
                className="cursor-pointer flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-amber-400 rounded-xl bg-amber-50 hover:bg-amber-100 transition-all"
              >
                <Upload className="size-4 text-amber-600" />
                <span className="text-sm font-bold text-amber-700">
                  Click to upload file(s)
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Queued new docs */}
        {newDocs.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-600">
              New documents to upload ({newDocs.length}):
            </p>
            {newDocs.map((doc: any, i: number) => {
              const isImg = /\.(jpg|jpeg|png|gif|webp)$/i.test(
                doc.originalName || "",
              );
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 bg-white border-2 border-slate-200 rounded-xl"
                >
                  {isImg && doc.preview ? (
                    <img
                      src={doc.preview}
                      className="size-9 rounded-lg object-cover flex-shrink-0"
                      alt=""
                    />
                  ) : (
                    <div className="size-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="size-4 text-red-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate">
                      {doc.originalName}
                    </p>
                    <span className="text-xs font-bold text-amber-600">
                      {getDocLabel(doc)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNewDoc(i)}
                    className="size-6 bg-red-100 rounded-lg flex items-center justify-center hover:bg-red-200 transition-all flex-shrink-0"
                  >
                    <X className="size-3 text-red-600" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
        <Shield className="size-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-800 font-medium">
          Private documents are only accessible by King Property Auction staff
          and are never displayed on the public listing.
        </p>
      </div>
    </div>
  );
}

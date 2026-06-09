import { useState } from "react";
import {
  Scale, Shield, Upload, X, FileText,
  Lock, User, Phone, Mail, Building2,
} from "lucide-react";
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

interface StepLegalProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  theme: { primary: string };
}

export default function StepLegal({ formData, handleInputChange, theme }: StepLegalProps) {
  const [selectedDocType, setSelectedDocType] = useState("");
  const [customLabel, setCustomLabel] = useState("");

  const solicitor = formData.solicitorDetails || {};
  const docs = formData.newPrivateDocs || [];

  const updateSolicitor = (field: string, value: string) => {
    handleInputChange("solicitorDetails", { ...formData.solicitorDetails, [field]: value });
  };

  const getDocLabel = (doc: any) => {
    if (doc.docType === "other" && doc.customLabel) return doc.customLabel;
    return DOC_TYPES.find(d => d.value === doc.docType)?.label || doc.docType || "📄 Document";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    if (!selectedDocType) {
      alert("Please select a document type first");
      return;
    }
    const files = Array.from(e.target.files);
    const newDocs = files.map(file => ({
      docType: selectedDocType,
      customLabel: selectedDocType === "other" ? customLabel : "",
      file,
      originalName: file.name,
      preview: URL.createObjectURL(file),
    }));
    handleInputChange("newPrivateDocs", [...docs, ...newDocs]);
    setSelectedDocType("");
    setCustomLabel("");
    e.target.value = "";
  };

  const removeDoc = (index: number) => {
    handleInputChange("newPrivateDocs", docs.filter((_: any, i: number) => i !== index));
  };

  const inputClass =
    "w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`size-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}>
          <Scale className="size-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Legal Information</h2>
          <p className="text-slate-600 font-medium">Property legal details and verification documents</p>
        </div>
      </div>

      {/* Ownership */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
        <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
          <Building2 className="size-5 text-blue-600" />
          Ownership Details
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Ownership Type *</label>
            <select
              value={formData.ownershipType || ""}
              onChange={e => handleInputChange("ownershipType", e.target.value)}
              className={inputClass}
              required
            >
              <option value="">Select ownership type...</option>
              <option value="freehold">Freehold</option>
              <option value="leasehold">Leasehold</option>
              <option value="shared">Shared Ownership</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Title Deed Number</label>
            <input
              type="text"
              placeholder="e.g., TD-123456789"
              value={formData.titleDeedNumber || ""}
              onChange={e => handleInputChange("titleDeedNumber", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Solicitor Details */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
        <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
          <User className="size-5 text-purple-600" />
          Solicitor Details
          <span className="text-xs font-medium text-slate-400 ml-1">(optional)</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Solicitor Name</label>
            <input type="text" placeholder="e.g., John Smith" value={solicitor.name || ""} onChange={e => updateSolicitor("name", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Firm / Company Name</label>
            <input type="text" placeholder="e.g., Smith & Partners LLP" value={solicitor.firmName || ""} onChange={e => updateSolicitor("firmName", e.target.value)} className={inputClass} />
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
                handleInputChange("solicitorDetails", {
                  ...formData.solicitorDetails,
                  address: parts.join(", "),
                  postcode: addr.postalCode || formData.solicitorDetails?.postcode || "",
                });
              }}
              placeholder="Start typing solicitor address..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Postcode</label>
            <input type="text" placeholder="e.g., SW1A 1AA" value={solicitor.postcode || ""} onChange={e => updateSolicitor("postcode", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              <Phone className="size-3.5 inline mr-1" />Contact Number
            </label>
            <input type="tel" placeholder="+44 7xxx xxx xxx" value={solicitor.phone || ""} onChange={e => updateSolicitor("phone", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              <Mail className="size-3.5 inline mr-1" />Email Address
            </label>
            <input type="email" placeholder="solicitor@firm.com" value={solicitor.email || ""} onChange={e => updateSolicitor("email", e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Private Documents */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="size-5 text-amber-600" />
          <h3 className="font-black text-slate-900">Verification Documents</h3>
        </div>
        <p className="text-xs text-slate-500 mb-5 ml-7">
          Stored securely — only accessible by King Property Auction. NOT shown on public listing.
        </p>

        {/* Doc type selector + upload */}
        <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200 mb-4">
          <p className="text-sm font-bold text-slate-700 mb-3">Add Document</p>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Document Type *</label>
              <select
                value={selectedDocType}
                onChange={e => setSelectedDocType(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">Select type...</option>
                {DOC_TYPES.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              {selectedDocType && (
                <p className="text-xs text-slate-400 mt-1">
                  {DOC_TYPES.find(d => d.value === selectedDocType)?.hint}
                </p>
              )}
            </div>
            {selectedDocType === "other" && (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Document Label *</label>
                <input
                  type="text"
                  placeholder="e.g., Planning Permission"
                  value={customLabel}
                  onChange={e => setCustomLabel(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            )}
          </div>
          {selectedDocType && (selectedDocType !== "other" || customLabel) && (
            <div className="mt-3">
              <input
                type="file"
                id="privateDocUpload"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <label
                htmlFor="privateDocUpload"
                className="cursor-pointer flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-amber-400 rounded-xl bg-amber-50 hover:bg-amber-100 transition-all"
              >
                <Upload className="size-4 text-amber-600" />
                <span className="text-sm font-bold text-amber-700">Click to upload file(s)</span>
              </label>
              <p className="text-xs text-slate-400 text-center mt-1">PDF, JPG, PNG, DOC · Max 20MB</p>
            </div>
          )}
        </div>

        {/* Queued docs list */}
        {docs.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-600">Documents to upload ({docs.length}):</p>
            {docs.map((doc: any, i: number) => {
              const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(doc.originalName || "");
              return (
                <div key={i} className="flex items-center gap-3 p-3 bg-white border-2 border-slate-200 rounded-xl">
                  {isImage && doc.preview ? (
                    <img src={doc.preview} className="size-10 rounded-lg object-cover flex-shrink-0" alt="" />
                  ) : (
                    <div className="size-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="size-5 text-red-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate">{doc.originalName}</p>
                    <span className="text-xs font-bold text-amber-600">{getDocLabel(doc)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDoc(i)}
                    className="size-7 bg-red-100 rounded-lg flex items-center justify-center hover:bg-red-200 transition-all flex-shrink-0"
                  >
                    <X className="size-3.5 text-red-600" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">
            No documents added yet. Use the form above to add documents.
          </p>
        )}
      </div>

      {/* Compliance Notice */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="size-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-amber-900 mb-1">Legal Compliance Notice</h4>
            <p className="text-sm text-amber-800">
              All information must be accurate and verifiable. Documents are verified during the
              approval process. Private documents are only accessible by King Property Auction staff.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// src\features\admin\components\users\tabs\DocumentsTab.tsx
import {
  FileText,
  Eye,
  Download,
  Image,
  Video,
  File,
  Gavel,
  User,
  Shield,
  FolderOpen,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { UserRecord } from "../UserActivityView";
import { useUserApi } from "@/features/admin/api/useUserApi";
import { useState } from "react";
import { StatusBadge } from "../shared/StatusBadge";
import { showSuccess, showError } from "@/lib/toast";

export function DocumentsTab({ user }: { user: UserRecord }) {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [processingDoc, setProcessingDoc] = useState<string | null>(null);

  const { useGetUserDocuments, useVerifyDocument } = useUserApi();
  const {
    data: docsData,
    isLoading,
    refetch,
  } = useGetUserDocuments(user._id, page, pageSize);
  const verifyDocument = useVerifyDocument();

  const documents = docsData?.data || [];
  const totalDocs = docsData?.pagination?.total || 0;
  const totalPages = Math.ceil(totalDocs / pageSize);

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getDocIcon = (doc: any) => {
    const type = doc.type || "file";
    if (type === "image" || type === "property_image")
      return <Image className="size-5 text-blue-500" />;
    if (type === "video") return <Video className="size-5 text-purple-500" />;
    if (type === "floor_plan")
      return <File className="size-5 text-amber-500" />;
    if (type === "legal" || type === "private_legal")
      return <Gavel className="size-5 text-red-500" />;
    if (
      type === "driving_license" ||
      type === "passport" ||
      type === "proof_of_address" ||
      type === "other_id"
    ) {
      return <Shield className="size-5 text-emerald-500" />;
    }
    if (
      type === "photo_id" ||
      type === "solicitor_doc" ||
      type === "legal_pack"
    ) {
      return <Gavel className="size-5 text-rose-500" />;
    }
    return <FileText className="size-5 text-slate-500" />;
  };

  const getCategoryColor = (category: string) => {
    if (category === "KYC / Verification")
      return "bg-emerald-100 text-emerald-700";
    if (category === "Property Images") return "bg-blue-100 text-blue-700";
    if (category === "Property Videos") return "bg-purple-100 text-purple-700";
    if (category === "Floor Plans") return "bg-amber-100 text-amber-700";
    if (category === "Legal Documents") return "bg-red-100 text-red-700";
    if (category === "Private Legal Documents")
      return "bg-rose-100 text-rose-700";
    return "bg-slate-100 text-slate-600";
  };

  const getStatusIcon = (status: string) => {
    if (status === "verified" || status === "approved")
      return <CheckCircle className="size-3.5 text-green-600" />;
    if (status === "rejected")
      return <XCircle className="size-3.5 text-red-600" />;
    return <Clock className="size-3.5 text-amber-600" />;
  };

  const handleVerify = async (doc: any, status: "verified" | "rejected") => {
    // Extract index from doc._id (format: userId_type_index)
    const parts = doc._id.split("_");
    const docIndex = parseInt(parts[parts.length - 1]);

    if (isNaN(docIndex)) {
      showError("Invalid document reference");
      return;
    }

    setProcessingDoc(doc._id);
    try {
      await verifyDocument.mutateAsync({
        userId: user._id,
        docIndex: docIndex,
        status: status,
        rejectionReason:
          status === "rejected" ? "Document rejected by admin" : undefined,
      });
      showSuccess(
        `Document ${status === "verified" ? "verified" : "rejected"} successfully`,
      );
      refetch();
    } catch (err: any) {
      showError("Failed", err.message || "Failed to update document status");
    } finally {
      setProcessingDoc(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (isLoading) {
    return (
      <div className="p-5">
        <div className="flex items-center justify-center h-40">
          <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-900 flex items-center gap-2">
            <FolderOpen className="size-4 text-slate-400" /> Documents (
            {totalDocs})
          </h3>
        </div>

        {totalDocs === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <FileText className="size-12 mx-auto mb-3 text-slate-300" />
            <p className="font-medium">No documents</p>
            <p className="text-sm">This user hasn't uploaded any documents</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {[
                      "Document",
                      "Category",
                      "Type",
                      "Uploaded",
                      "Status",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {documents.map((doc: any) => (
                    <tr
                      key={doc._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {getDocIcon(doc)}
                          <div>
                            <p className="font-semibold text-slate-900 truncate max-w-[250px]">
                              {doc.name || "Unnamed Document"}
                            </p>
                            {doc.propertyTitle && (
                              <p className="text-slate-400 text-xs truncate max-w-[200px]">
                                📄 {doc.propertyTitle}
                              </p>
                            )}
                            {doc.fileSize && (
                              <p className="text-slate-400 text-xs">
                                {formatFileSize(doc.fileSize)}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-bold ${getCategoryColor(doc.category)}`}
                        >
                          {doc.category || "General"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-slate-600">
                          {doc.typeLabel || doc.type || "General"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                        {doc.uploadedAt
                          ? new Date(doc.uploadedAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(doc.verificationStatus)}
                          <StatusBadge
                            status={doc.verificationStatus || "available"}
                          />
                        </div>
                        {doc.rejectionReason && (
                          <p className="text-xs text-red-500 mt-0.5 truncate max-w-[150px]">
                            {doc.rejectionReason}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => window.open(doc.fileUrl, "_blank")}
                            className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                            title="View Document"
                          >
                            <Eye className="size-4" />
                          </button>
                          <a
                            href={doc.fileUrl}
                            download
                            className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors"
                            title="Download Document"
                          >
                            <Download className="size-4" />
                          </a>
                          {doc.source === "user_kyc" &&
                            doc.verificationStatus === "pending" && (
                              <>
                                <button
                                  onClick={() => handleVerify(doc, "verified")}
                                  disabled={processingDoc === doc._id}
                                  className="p-1.5 hover:bg-green-50 rounded-lg text-green-600 transition-colors disabled:opacity-50"
                                  title="Approve Document"
                                >
                                  {processingDoc === doc._id ? (
                                    <Loader2 className="size-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="size-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = prompt(
                                      "Enter rejection reason:",
                                    );
                                    if (reason !== null) {
                                      // Extract index from doc._id
                                      const parts = doc._id.split("_");
                                      const docIndex = parseInt(
                                        parts[parts.length - 1],
                                      );
                                      if (!isNaN(docIndex)) {
                                        handleVerify(doc, "rejected");
                                      }
                                    }
                                  }}
                                  disabled={processingDoc === doc._id}
                                  className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors disabled:opacity-50"
                                  title="Reject Document"
                                >
                                  {processingDoc === doc._id ? (
                                    <Loader2 className="size-4 animate-spin" />
                                  ) : (
                                    <XCircle className="size-4" />
                                  )}
                                </button>
                              </>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Showing {(page - 1) * pageSize + 1} to{" "}
                  {Math.min(page * pageSize, totalDocs)} of {totalDocs}{" "}
                  documents
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-medium text-slate-700">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

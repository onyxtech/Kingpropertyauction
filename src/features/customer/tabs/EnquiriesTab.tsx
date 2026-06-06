import { useNavigate } from "react-router";
import { Mail, Building2, Clock, CheckCircle, Eye } from "lucide-react";
import { useTheme } from "@/app/hooks/useTheme";
import { useCustomerApi } from "../api/useCustomerApi";

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: "bg-blue-100", text: "text-blue-700", label: "New" },
  contacted: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Contacted" },
  qualified: { bg: "bg-purple-100", text: "text-purple-700", label: "Qualified" },
  converted: { bg: "bg-green-100", text: "text-green-700", label: "Converted" },
  closed: { bg: "bg-slate-100", text: "text-slate-500", label: "Closed" },
};

export default function EnquiriesTab() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { useMyEnquiries } = useCustomerApi();
  const { data: enquiries = [], isLoading } = useMyEnquiries();

  const list = Array.isArray(enquiries) ? enquiries : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <Mail className="size-8 text-blue-500" />
          My Enquiries
        </h2>
        <p className="text-slate-600 font-medium mt-1">Property enquiries you've submitted</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center">
          <Mail className="size-14 mx-auto mb-4 text-blue-300 opacity-60" />
          <p className="text-lg font-black text-slate-700">No enquiries yet</p>
          <p className="text-slate-400 text-sm mt-1">When you submit property enquiries they'll appear here</p>
          <button
            onClick={() => navigate("/properties")}
            className={`mt-6 px-6 py-2.5 bg-gradient-to-r ${theme.primary} text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity`}
          >
            Browse Properties
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((enquiry: any) => {
            const statusStyle = STATUS_STYLES[enquiry.status] || STATUS_STYLES.new;
            return (
              <div
                key={enquiry._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="size-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {enquiry.property ? (
                        <Building2 className="size-5 text-blue-600" />
                      ) : (
                        <Mail className="size-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-900 truncate">{enquiry.subject}</p>
                      {enquiry.property?.propertyTitle && (
                        <p className="text-sm text-blue-600 font-bold mt-0.5">{enquiry.property.propertyTitle}</p>
                      )}
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{enquiry.message}</p>
                      <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                        <Clock className="size-3" />
                        {new Date(enquiry.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black ${statusStyle.bg} ${statusStyle.text} flex items-center gap-1`}>
                      {enquiry.status === "converted" ? <CheckCircle className="size-3" /> : <Clock className="size-3" />}
                      {statusStyle.label}
                    </span>
                    {enquiry.property?._id && (
                      <button
                        onClick={() => navigate(`/properties/${enquiry.property.slug || enquiry.property._id}`)}
                        className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Eye className="size-3" /> View Property
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

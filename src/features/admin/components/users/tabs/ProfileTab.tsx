// src\features\admin\components\users\tabs\ProfileTab.tsx
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Star,
  House,
  Layers,
  UserCheck,
} from "lucide-react";
import { UserRecord } from "../UserActivityView";
import { StatusBadge } from "../shared/StatusBadge";

export function ProfileTab({ user }: { user: UserRecord }) {
  // Build full address from address object
  const addressParts = [
    user.address?.street,
    user.address?.city,
    user.address?.postcode,
    user.address?.country,
  ].filter(Boolean);
  const fullAddress =
    addressParts.length > 0 ? addressParts.join(", ") : "Not provided";

  // Use location or build from address
  const displayLocation =
    user.location || user.address?.city || "Not specified";

  // KYC status from approvalStatus
  const kycStatus =
    user.approvalStatus === "approved"
      ? "Verified"
      : user.approvalStatus === "rejected"
        ? "Not Verified"
        : "Pending";

  // ─── ROLE FORMATTING (Matches Users.tsx EXACTLY) ──────────────────────
  const getFormattedRole = () => {
    // Admin / Super Admin
    if (user.role === "admin") {
      return user.isSuperAdmin ? "Super Admin" : "Administrator";
    }

    // Agent
    if (user.role === "agent") {
      return user.permissions?.canBid ? "Agent & Buyer" : "Agent";
    }

    // Seller (Owner) - shows as "Owner"
    if (user.role === "seller") {
      // If seller has canBid, they are also a buyer
      if (user.permissions?.canBid) {
        return "Owner & Buyer";
      }
      return "Owner";
    }

    // Buyer
    if (user.role === "buyer") {
      // If buyer has canListProperties, they are also an owner
      if (user.permissions?.canListProperties) {
        return "Buyer & Owner";
      }
      return "Buyer";
    }

    return user.role || "User";
  };

  const profile = {
    name: user.name,
    email: user.email,
    phone: user.phone || "Not provided",
    role: getFormattedRole(),
    joined: user.createdAt,
    status: user.isActive ? "active" : "suspended",
    kyc: kycStatus,
    location: displayLocation,
    address: fullAddress,
    nationality: "British",
    id: user._id,
  };

  const fields = [
    { label: "Full Name", value: profile.name, icon: User },
    { label: "Email Address", value: profile.email, icon: Mail },
    { label: "Phone Number", value: profile.phone, icon: Phone },
    { label: "Platform Role", value: profile.role, icon: UserCheck },
    { label: "Account Status", value: profile.status, icon: UserCheck },
    { label: "KYC Status", value: profile.kyc, icon: Shield },
    { label: "Location", value: profile.location, icon: MapPin },
    { label: "Address", value: profile.address, icon: House },
    { label: "Nationality", value: profile.nationality, icon: Star },
    {
      label: "Date Joined",
      value: new Date(profile.joined).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      icon: Calendar,
    },
    { label: "User ID", value: profile.id, icon: Layers },
  ];

  return (
    <div className="p-5">
      <div className="bg-white rounded-2xl border border-slate-100 p-6 max-w-2xl">
        <h3 className="font-black text-slate-900 mb-5 flex items-center gap-2">
          <User className="size-4 text-slate-400" /> User Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((row) => {
            const Icon = row.icon;
            return (
              <div
                key={row.label}
                className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl"
              >
                <div className="size-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <Icon className="size-4 text-slate-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-400 font-medium">
                    {row.label}
                  </p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5 break-words">
                    {row.label === "Account Status" ? (
                      row.value === "active" ? (
                        <StatusBadge status="active" />
                      ) : row.value === "suspended" ? (
                        <StatusBadge status="suspended" />
                      ) : (
                        row.value
                      )
                    ) : row.label === "KYC Status" ? (
                      row.value === "Verified" ? (
                        <StatusBadge status="Verified" />
                      ) : row.value === "Not Verified" ? (
                        <StatusBadge status="Not Verified" />
                      ) : row.value === "Pending" ? (
                        <StatusBadge status="pending" />
                      ) : (
                        row.value
                      )
                    ) : (
                      row.value
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

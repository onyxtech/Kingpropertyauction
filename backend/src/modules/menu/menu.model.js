import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    url: { type: String, default: "" },
    type: { type: String, enum: ["link", "dropdown"], default: "link" },
    icon: { type: String, default: "FileText" },
    target: { type: String, enum: ["_self", "_blank"], default: "_self" },
    badge: { type: Boolean, default: false },
    badgeLabel: { type: String, default: "LIVE" },
    badgeColor: { type: String, default: "red" },
    highlight: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    color: { type: String, default: "" },
    dividerBefore: { type: Boolean, default: false },
    dividerLabel: { type: String, default: "" },
    parent: { type: mongoose.Schema.Types.Mixed, default: null },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const menuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: {
      type: String,
      enum: ["Header", "Footer", "Header Dropdown", "Mobile Header", "Sidebar"],
      default: "Header",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    items: [menuItemSchema],
    createdBy: { type: mongoose.Schema.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Menu = mongoose.model("Menu", menuSchema);
export default Menu;
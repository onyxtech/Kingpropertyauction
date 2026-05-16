import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: true,
    },
    html: {
      type: String,
      required: true,
      maxlength: 50000,
    },
    variables: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      enum: ["auth", "bidding", "property", "auction", "lead", "system"],
      default: "system",
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

templateSchema.index({ category: 1 });

const Template = mongoose.model("Template", templateSchema);
export default Template;

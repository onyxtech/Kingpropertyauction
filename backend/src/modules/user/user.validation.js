import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().trim().max(50).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().optional(),
  role: Joi.string()
    .valid("user", "agent", "admin", "buyer", "seller")
    .default("user"),
  isActive: Joi.boolean().optional(),
  agentDetails: Joi.object({
    companyName: Joi.string().allow("").optional(),
    licenseNumber: Joi.string().allow("").optional(),
    commissionRate: Joi.number().optional(),
    specialization: Joi.string().optional(),
  }).optional(),
  idDocuments: Joi.when("role", {
    is: Joi.valid("agent", "seller"),
    then: Joi.array()
      .items(
        Joi.object({
          docType: Joi.string()
            .valid(
              "driving_license",
              "passport",
              "proof_of_address",
              "other_id",
            )
            .required(),
          fileName: Joi.string().optional(),
          originalName: Joi.string().optional(),
          mimeType: Joi.string().optional(),
          fileSize: Joi.number().optional(),
          fileData: Joi.string().required(),
        }),
      )
      .min(1)
      .required()
      .custom((docs, helpers) => {
        const hasPhotoId = docs.some(
          (d) => d.docType === "driving_license" || d.docType === "passport",
        );
        const hasProofOfAddress = docs.some(
          (d) => d.docType === "proof_of_address",
        );
        if (!hasPhotoId) {
          return helpers.error("any.custom", {
            message: "A Photo ID (Driving License or Passport) is required",
          });
        }
        if (!hasProofOfAddress) {
          return helpers.error("any.custom", {
            message: "A Proof of Address document is required",
          });
        }
        return docs;
      }),
    otherwise: Joi.array().optional(),
  }),
  permissions: Joi.object({
    canBid: Joi.boolean().optional(),
    canListProperties: Joi.boolean().optional(),
    emailNotifications: Joi.boolean().optional(),
    smsAlerts: Joi.boolean().optional(),
  }).optional(),
  address: Joi.object({
    street: Joi.string().optional().allow(""),
    city: Joi.string().optional().allow(""),
    postcode: Joi.string().optional().allow(""),
    country: Joi.string().optional().allow(""),
  }).optional(),
  marketingOptOut: Joi.boolean().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});

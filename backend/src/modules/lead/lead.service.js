import Lead from "./lead.model.js";
import { sendEmail } from "../notifications/email.service.js";
import { isNotificationEnabled } from "../settings/settings.service.js";

const getNotificationKeys = (lead) => {
  const subject = (lead.subject || "").toLowerCase();
  if (subject.includes("register") && subject.includes("alert"))
    return { ruleKey: "registerAlert", templateKey: "registerAlert" };
  if (subject.includes("solicitor"))
    return { ruleKey: "solicitorEnquiry", templateKey: "solicitorEnquiry" };
  if (subject.includes("home report"))
    return { ruleKey: "homeReport", templateKey: "homeReport" };
  if (subject.includes("referral"))
    return { ruleKey: "referralFee", templateKey: "referralFee" };
  if (subject.includes("buying overview"))
    return { ruleKey: "buyingEnquiry", templateKey: "buyingEnquiry" };
  if (subject.includes("selling overview"))
    return { ruleKey: "sellingEnquiry", templateKey: "sellingEnquiry" };
  if (lead.leadType === "valuation")
    return { ruleKey: "valuationRequest", templateKey: "valuationRequest" };
  if (lead.leadType === "catalogue")
    return { ruleKey: "catalogueRequest", templateKey: "catalogueRequest" };
  if (lead.leadType === "faq")
    return { ruleKey: "faqSupport", templateKey: "faqSupport" };
  if (lead.leadType === "legal")
    return { ruleKey: "legalEnquiry", templateKey: "legalenquiry" };
  if (lead.leadType === "newsletter")
    return { ruleKey: "newsletterSignup", templateKey: "newsletterWelcome" };
  if (lead.leadType === "property_inquiry")
    return {
      ruleKey: "propertyInquiry",
      templateKey: "propertyInquiryConfirmation",
    };
  return { ruleKey: "contactForm", templateKey: "contactForm" };
};

const extractVariable = (message, label) => {
  if (!message) return "";
  const lines = message.split("\n");
  const line = lines.find(
    (l) =>
      l.toLowerCase().startsWith(label.toLowerCase() + ":") ||
      l.toLowerCase().startsWith(label.toLowerCase() + " :"),
  );
  if (line) return line.split(":").slice(1).join(":").trim();
  const pattern = new RegExp(label + "[: ]+([^.\\n,]+)", "i");
  const match = message.match(pattern);
  return match ? match[1].trim() : "";
};

export const createLead = async (data) => {
  const lead = await Lead.create(data);

  const { ruleKey, templateKey } = getNotificationKeys(lead);

  // Auto-reply to the user (fire and forget)
  (async () => {
    try {
      const enabled = await isNotificationEnabled(ruleKey);
      if (!enabled) return;

      const siteUrl = process.env.CLIENT_URL || "http://localhost:5173";
      const propertyTitle =
        lead.subject?.replace("Property Enquiry: ", "") || "Property";
      const msgPreview =
        (lead.message || "").substring(0, 150) +
        ((lead.message || "").length > 150 ? "..." : "");

      const emailVariables =
        lead.leadType === "property_inquiry"
          ? {
              inquirer_name: lead.name,
              property_title: propertyTitle,
              message_preview: msgPreview,
              property_url: `${siteUrl}/properties`,
              site_url: siteUrl,
            }
          : {
              user_name: lead.name,
              user_email: lead.email,
              user_phone: lead.phone || "Not provided",
              message: lead.message || "",
              subject: lead.subject || "",
              category: lead.leadType || "general",
              site_url: siteUrl,
              property_type:
                extractVariable(lead.message, "Property Type") || "Any",
              property_address:
                extractVariable(lead.message, "Property Address") || "",
              location:
                extractVariable(lead.message, "Location") || "Not specified",
              budget:
                extractVariable(lead.message, "Budget") || "Not specified",
              timeline: extractVariable(lead.message, "Timeline") || "",
              bedrooms: extractVariable(lead.message, "Bedrooms") || "Any",
              auction_name: extractVariable(lead.message, "Auction") || "",
              auction_date: extractVariable(lead.message, "Date") || "",
              auction_time: extractVariable(lead.message, "Time") || "",
            };

      const emailSubject =
        lead.leadType === "property_inquiry"
          ? `✅ We received your enquiry about ${propertyTitle}`
          : lead.subject || "Thank you for contacting King Property Auction";

      // For catalogue requests: generate PDF first, then send template email with attachment
      let pdfAttachment = null;

      if (lead.leadType === "catalogue") {
        try {
          const { default: Auction } = await import("../auction/auction.model.js");
          const jsPDF = (await import("jspdf")).jsPDF;

          const selectedIds = data.auctionIds || [];
          let auctions;
          if (selectedIds.length > 0) {
            auctions = await Auction.find({ _id: { $in: selectedIds } })
              .populate("properties", "propertyTitle pricing location propertyType")
              .lean();
          } else {
            auctions = await Auction.find({
              status: { $in: ["scheduled", "live"] },
            })
              .populate("properties", "propertyTitle pricing location propertyType")
              .sort("startDateTime")
              .limit(20)
              .lean();
          }

          const doc = new jsPDF();
          let y = 20;

          doc.setFontSize(18);
          doc.setFont("helvetica", "bold");
          doc.text("King Property Auction", 14, y);
          y += 10;
          doc.setFontSize(12);
          doc.setFont("helvetica", "normal");
          doc.text("Auction Catalogue", 14, y);
          y += 8;
          doc.setFontSize(9);
          doc.setTextColor(120);
          doc.text(`Generated: ${new Date().toLocaleString("en-GB")}`, 14, y);
          y += 6;
          doc.text(`Prepared for: ${lead.name} (${lead.email})`, 14, y);
          y += 12;

          if (auctions.length > 0) {
            doc.setTextColor(0);
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text(`Upcoming Auctions (${auctions.length} found)`, 14, y);

            const { default: autoTable } = await import("jspdf-autotable");

            const tableRows = [];
            let lotNumber = 1;

            auctions.forEach((auction) => {
              const props = auction.properties || [];
              if (props.length === 0) {
                tableRows.push([
                  `LOT-${String(lotNumber).padStart(3, "0")}`,
                  auction.auctionTitle || "N/A",
                  auction.auctionType || "N/A",
                  new Date(auction.startDateTime).toLocaleDateString("en-GB"),
                  new Date(auction.endDateTime).toLocaleDateString("en-GB"),
                  "0",
                  auction.startingBid ? `£${auction.startingBid.toLocaleString()}` : "£0",
                  auction.status || "N/A",
                  String(auction.totalBidders || 0),
                  auction.venue?.city || auction.venue?.name || "Online",
                ]);
                lotNumber++;
              } else {
                props.forEach((prop) => {
                  tableRows.push([
                    `LOT-${String(lotNumber).padStart(3, "0")}`,
                    prop.propertyTitle || auction.auctionTitle || "N/A",
                    prop.propertyType || auction.auctionType || "N/A",
                    new Date(auction.startDateTime).toLocaleDateString("en-GB"),
                    new Date(auction.endDateTime).toLocaleDateString("en-GB"),
                    "1",
                    prop.pricing?.startingAuctionPrice
                      ? `£${prop.pricing.startingAuctionPrice.toLocaleString()}`
                      : auction.startingBid
                        ? `£${auction.startingBid.toLocaleString()}`
                        : "£0",
                    auction.status || "N/A",
                    String(auction.totalBidders || 0),
                    prop.location?.city || auction.venue?.city || "Online",
                  ]);
                  lotNumber++;
                });
              }
            });

            autoTable(doc, {
              startY: y + 4,
              head: [
                ["Lot", "Title", "Type", "Start", "End", "Lots", "Est. Value", "Status", "Bidders", "Location"],
              ],
              body: tableRows,
              theme: "grid",
              headStyles: {
                fillColor: [37, 99, 235],
                textColor: 255,
                fontStyle: "bold",
                fontSize: 9,
              },
              bodyStyles: { fontSize: 8, textColor: 50 },
              alternateRowStyles: { fillColor: [245, 247, 250] },
              margin: { left: 14, right: 14 },
            });
          } else {
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(200, 50, 50);
            doc.text("No Auctions Currently Available", 14, y);
            y += 12;
            doc.setTextColor(0);
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            const noAuctionMsg = [
              "Thank you for your interest in King Property Auction.",
              "",
              "There are currently no scheduled or live auctions available.",
              "Our team is working on listing new properties and auctions.",
              "",
              "What happens next:",
              "• You will be notified when new auctions are listed",
              "• Check our website regularly for updates",
              "• Our team will contact you with upcoming opportunities",
              "",
              `Visit: ${siteUrl}/auctions`,
              "",
              "We appreciate your patience and look forward to serving you.",
            ];
            noAuctionMsg.forEach((msg) => {
              if (y > 270) { doc.addPage(); y = 20; }
              doc.text(msg, 14, y);
              y += 6;
            });
          }

          const pageCount = doc.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(
              `Page ${i} of ${pageCount} | King Property Auction | kingpropertyauction.com`,
              14,
              doc.internal.pageSize.height - 10,
            );
          }

          pdfAttachment = {
            filename: `auction-catalogue-${new Date().toISOString().slice(0, 10)}.pdf`,
            content: doc.output("datauristring").split(",")[1],
            encoding: "base64",
          };
        } catch (pdfErr) {
          console.error("[Catalogue] PDF generation failed:", pdfErr.message);
        }
      }

      // Send template email (with PDF attachment for catalogue requests)
      if (pdfAttachment) {
        // For catalogue: send via nodemailer directly to attach PDF
        const { getEmailSettings } = await import("../settings/settings.service.js");
        const settings = await getEmailSettings();
        if (settings?.host) {
          const nodemailer = (await import("nodemailer")).default;
          const transporter = nodemailer.createTransport({
            host: settings.host,
            port: parseInt(settings.port),
            secure: settings.encryption === "ssl" || settings.encryption === "SSL",
            auth: { user: settings.username, pass: settings.password },
          });
          const { renderTemplate } = await import("../notifications/template.service.js");
          const html = await renderTemplate(templateKey, emailVariables);
          await transporter.sendMail({
            from: `"${settings.senderName || "King Property Auction"}" <${settings.senderEmail}>`,
            to: lead.email,
            subject: emailSubject,
            html: html,
            attachments: [pdfAttachment],
          });
        }
      } else {
        // Normal template email without attachment
        await sendEmail({
          to: lead.email,
          subject: emailSubject,
          templateKey,
          variables: emailVariables,
        });
      }
    } catch (e) {
      console.error("[Lead] Auto-reply failed:", e.message);
    }
  })();

  // Notify all active admins (fire and forget)
  (async () => {
    try {
      const enabled = await isNotificationEnabled(ruleKey);
      if (!enabled) return;
      const { default: User } = await import("../user/user.model.js");
      const admins = await User.find({ role: "admin", isActive: true }).select("email name");
      for (const admin of admins) {
        await sendEmail({
          to: admin.email,
          subject: `📋 New Lead: ${lead.name} — ${lead.leadType}`,
          templateKey: "adminLeadAlert",
          variables: {
            admin_name: admin.name,
            lead_name: lead.name,
            lead_email: lead.email,
            lead_phone: lead.phone || "Not provided",
            lead_type: lead.leadType,
            message: lead.message,
            admin_url: `${process.env.CLIENT_URL}/admin/leads`,
          },
        }).catch(() => {});
      }
    } catch (e) {
      console.error("[Lead] Admin alert failed:", e.message);
    }
  })();

  // Auto-create conversation thread from this lead
  import("../message/message.service.js")
    .then(async ({ createConversationFromLead }) => {
      await createConversationFromLead(lead._id);
    })
    .catch((e) =>
      console.error("[Lead] Conversation creation failed:", e.message),
    );

  return lead;
};

export const getLeads = async (query = {}) => {
  const { page = 1, limit = 20, status, type, search } = query;
  const filter = {};
  if (status) filter.status = status;
  if (type) filter.leadType = type;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [leads, total] = await Promise.all([
    Lead.find(filter)
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit))
      .populate("assignedTo", "name email")
      .populate("property", "propertyTitle"),
    Lead.countDocuments(filter),
  ]);

  return {
    leads,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

export const getLeadById = async (id) => {
  return Lead.findById(id)
    .populate("assignedTo", "name email")
    .populate("property", "propertyTitle");
};

export const getLeadsByEmail = async (email, query = {}) => {
  const { page = 1, limit = 20 } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [leads, total] = await Promise.all([
    Lead.find({ email })
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit))
      .populate("property", "propertyTitle"),
    Lead.countDocuments({ email }),
  ]);

  return {
    leads,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

export const updateLead = async (id, data) => {
  return Lead.findByIdAndUpdate(id, data, { new: true });
};

export const deleteLead = async (id) => {
  return Lead.findByIdAndDelete(id);
};

export const getLeadsStats = async () => {
  const [total, newLeads, contacted, qualified, converted, closed, byType] =
    await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: "new" }),
      Lead.countDocuments({ status: "contacted" }),
      Lead.countDocuments({ status: "qualified" }),
      Lead.countDocuments({ status: "converted" }),
      Lead.countDocuments({ status: "closed" }),
      Lead.aggregate([{ $group: { _id: "$leadType", count: { $sum: 1 } } }]),
    ]);

  return { total, newLeads, contacted, qualified, converted, closed, byType };
};
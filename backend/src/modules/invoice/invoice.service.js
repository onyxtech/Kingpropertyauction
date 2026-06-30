import Invoice from "./invoice.model.js";
import { getSetting } from "../settings/settings.service.js";

// Get invoice settings
export const getInvoiceSettings = async () => {
  const general = (await getSetting("general")) || {};
  return {
    buyersFeePercent: general.invoiceBuyersFeePercent || 3,
    buyersFeeMin: general.invoiceBuyersFeeMin || 3250,
    depositPercent: general.invoiceDepositPercent || 10,
    depositMin: general.invoiceDepositMin || 3000,
    vatPercent: general.invoiceVatPercent || 20,
    prefix: general.invoicePrefix || "INV-KPA-",
    additionalFees: general.invoiceAdditionalFees || 0,
  };
};

// Calculate invoice amounts
export const calculateInvoice = async (salePrice, customSettings = {}) => {
  const settings = { ...(await getInvoiceSettings()), ...customSettings };

  const buyersFeeAmount = Math.max(
    (salePrice * settings.buyersFeePercent) / 100,
    settings.buyersFeeMin,
  );
  const vatAmount = (buyersFeeAmount * settings.vatPercent) / 100;
  const depositAmount = Math.max(
    (salePrice * settings.depositPercent) / 100,
    settings.depositMin,
  );
  // Total payable = fees + deposit (not including sale price)
  const totalAmount =
    buyersFeeAmount + vatAmount + (settings.additionalFees || 0) + depositAmount;

  return {
    salePrice,
    buyersFeePercent: settings.buyersFeePercent,
    buyersFeeAmount: Math.round(buyersFeeAmount),
    vatPercent: settings.vatPercent,
    vatAmount: Math.round(vatAmount),
    depositPercent: settings.depositPercent,
    depositAmount: Math.round(depositAmount),
    additionalFees: settings.additionalFees || 0,
    totalAmount: Math.round(totalAmount),
  };
};

// Generate invoice
export const generateInvoice = async (data, userId) => {
  // Check for property-specific terms of sale
  let customSettings = data.customSettings || {};
  let prop = null;
  if (data.propertyId) {
    const Property = (await import("../property/property.model.js")).default;
    prop = await Property.findById(data.propertyId)
      .select("termsOfSale")
      .lean();
    if (prop?.termsOfSale) {
      if (prop.termsOfSale.buyersFeePercent)
        customSettings.buyersFeePercent = prop.termsOfSale.buyersFeePercent;
      if (prop.termsOfSale.buyersFeeMin)
        customSettings.buyersFeeMin = prop.termsOfSale.buyersFeeMin;
      if (prop.termsOfSale.depositPercent)
        customSettings.depositPercent = prop.termsOfSale.depositPercent;
      if (prop.termsOfSale.depositMin)
        customSettings.depositMin = prop.termsOfSale.depositMin;
      if (prop.termsOfSale.vatPercent)
        customSettings.vatPercent = prop.termsOfSale.vatPercent;
      if (prop.termsOfSale.additionalFees)
        customSettings.additionalFees = prop.termsOfSale.additionalFees;
    }
  }

  const amounts = await calculateInvoice(data.salePrice, customSettings);

  const general = (await getSetting("general")) || {};
  const dueHours = data.dueHours || general.paymentDueHours || 48;
  const dueDate = new Date(Date.now() + dueHours * 60 * 60 * 1000);

  const invoice = await Invoice.create({
    ...amounts,
    property: data.propertyId,
    auction: data.auctionId || null,
    buyer: data.buyerId || null,
    buyerName: data.buyerName || null,
    buyerEmail: data.buyerEmail || null,
    buyerAddress: data.buyerAddress || null,
    seller: data.sellerId || null,
    payment: data.paymentId || null,
    commission: data.commissionId || null,
    dueDate,
    notes: data.notes || "",
    createdBy: userId,
    invoiceType: data.invoiceType || "auction_sale",
    termsOfSale:
      data.termsOfSale ||
      prop?.termsOfSale?.text ||
      (`*${amounts.depositPercent}% Deposit (Minimum £${amounts.depositAmount?.toLocaleString()})\n` +
        `Standard Completion (Unless specified differently in any Special Conditions of Sale)\n` +
        `*Buyers Fee = ${amounts.buyersFeePercent}% of Sale Price (Minimum £${amounts.buyersFeeAmount?.toLocaleString()} + vat)\n\n` +
        `STANDARD TERMS OF SALE are 4 week completion with 1 week extension.`),
  });
  console.log("TERMS SAVED:", invoice.termsOfSale?.substring(0, 80));

  const populated = await Invoice.findById(invoice._id)
    .populate("property", "propertyTitle slug location media propertyID ")
    .populate("buyer", "name email phone address")
    .populate("seller", "name email phone")
    .populate("auction", "auctionTitle slug")
    .populate("payment")
    .populate("commission");

  // Send email + notification to buyer
  try {
    const { sendEmail } = await import("../notifications/email.service.js");
    const { isNotificationEnabled } = await import("../settings/settings.service.js");
    const Notification = (await import("../notifications/notification.model.js")).default;
    const { emitToUser } = await import("../../socket.js");
    const siteUrl = process.env.CLIENT_URL || "http://localhost:5173";

    // Get buyer info - from user account or from data (for guests)
    let buyerName = data.buyerName || "";
    let buyerEmail = data.buyerEmail || "";
    let buyerId = data.buyerId || null;

    if (data.buyerId) {
      const buyer = await (await import("../user/user.model.js")).default
        .findById(data.buyerId)
        .select("name email")
        .lean();
      buyerName = buyer?.name || buyerName;
      buyerEmail = buyer?.email || buyerEmail;
    }

    const property = await (await import("../property/property.model.js")).default
      .findById(data.propertyId)
      .select("propertyTitle")
      .lean();

    if (buyerEmail) {
      const enabled = await isNotificationEnabled("invoiceGenerated");
      if (enabled) {
        await sendEmail({
          to: buyerEmail,
          subject: `📄 Invoice Generated - ${property?.propertyTitle || "Property"}`,
          templateKey: "invoiceGenerated",
          variables: {
            user_name: buyerName,
            property_title: property?.propertyTitle || "Property",
            invoice_number: invoice.invoiceNumber,
            total_amount: `£${amounts.totalAmount.toLocaleString()}`,
            deposit_amount: `£${amounts.depositAmount.toLocaleString()}`,
            due_date: dueDate.toLocaleDateString("en-GB"),
            dashboard_url: `${siteUrl}/dashboard/invoices`,
          },
        }).catch((e) => console.warn("Invoice email failed:", e.message));
      }
    }

    // Bell notification for buyer (only if has user account)
    if (buyerId) {
      await Notification.create({
        type: "system",
        icon: "file-text",
        message: `📄 Invoice ${invoice.invoiceNumber} generated for ${property?.propertyTitle}`,
        link: "/dashboard/invoices",
        color: "blue",
        targetUser: buyerId,
      }).catch(() => {});

      emitToUser(buyerId.toString(), "new_notification", {
        type: "system",
        message: `New invoice for ${property?.propertyTitle}`,
        link: "/dashboard/invoices",
      });
    }

    // Notify seller/agent
    if (data.sellerId && data.sellerId !== buyerId) {
      await Notification.create({
        type: "system",
        icon: "file-text",
        message: `📄 Invoice ${invoice.invoiceNumber} generated for ${property?.propertyTitle}`,
        link: "/dashboard/invoices",
        color: "blue",
        targetUser: data.sellerId,
      }).catch(() => {});
      emitToUser(data.sellerId.toString(), "new_notification", {
        type: "system",
        message: `Invoice generated for ${property?.propertyTitle}`,
        link: "/dashboard/invoices",
      });
    }
  } catch (e) {
    console.warn("Invoice notification failed:", e.message);
  }

  return populated;
};

// Get all invoices (admin)
export const getInvoices = async (query = {}) => {
  const { page = 1, limit = 20, status, search, buyerId, sellerId } = query;
  const filter = {};
  if (status) filter.status = status;
  if (buyerId) filter.buyer = buyerId;
  if (sellerId) filter.seller = sellerId;

  if (search) {
    const User = (await import("../user/user.model.js")).default;
    const users = await User.find({ name: new RegExp(search, "i") })
      .select("_id")
      .lean();
    filter.$or = [
      { buyer: { $in: users.map((u) => u._id) } },
      { invoiceNumber: new RegExp(search, "i") },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [invoices, total] = await Promise.all([
    Invoice.find(filter)
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit))
      .populate("property", "propertyTitle slug location pricing propertyType propertyID")
      .populate("buyer", "name email address")
      .populate("seller", "name email")
      .populate("auction", "auctionTitle")
      .lean(),
    Invoice.countDocuments(filter),
  ]);

  return {
    invoices,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

// Get invoice by ID
export const getInvoiceById = async (id) => {
  return Invoice.findById(id)
    .populate("property", "propertyTitle slug location media pricing propertyID ")
    .populate("buyer", "name email phone address")
    .populate("seller", "name email phone")
    .populate("auction", "auctionTitle slug startDateTime")
    .populate("payment")
    .populate("commission");
};

export const getUserInvoices = async (userId, view = "buyer") => {
  const filter = view === "seller" ? { seller: userId } : { buyer: userId };

  return Invoice.find(filter)
    .sort("-createdAt")
    .populate("property", "propertyTitle slug location propertyID ")
    .populate("buyer", "name email address")
    .populate("seller", "name email")
    .populate("auction", "auctionTitle slug")
    .lean();
};

// Update invoice status
export const updateInvoiceStatus = async (id, status, userId) => {
  const update = { status };
  if (status === "paid") update.paidDate = new Date();

  const invoice = await Invoice.findByIdAndUpdate(id, update, { new: true });

  // Send paid notification
  if (status === "paid") {
    try {
      const inv = await Invoice.findById(id)
        .populate("buyer", "name email address")
        .populate("property", "propertyTitle propertyID ")
        .lean();
      const { sendEmail } = await import("../notifications/email.service.js");
      const { isNotificationEnabled } =
        await import("../settings/settings.service.js");
      const Notification = (
        await import("../notifications/notification.model.js")
      ).default;
      const { emitToUser } = await import("../../socket.js");
      const siteUrl = process.env.CLIENT_URL || "http://localhost:5173";

      if (inv?.buyer?.email) {
        const enabled = await isNotificationEnabled("invoicePaid");
        if (enabled) {
          await sendEmail({
            to: inv.buyer.email,
            subject: `✅ Invoice Paid - ${inv.property?.propertyTitle || "Property"}`,
            templateKey: "invoicePaid",
            variables: {
              user_name: inv.buyer.name,
              property_title: inv.property?.propertyTitle || "Property",
              invoice_number: inv.invoiceNumber,
              total_amount: `£${inv.totalAmount.toLocaleString()}`,
              dashboard_url: `${siteUrl}/dashboard/invoices`,
            },
          }).catch(() => {});
        }
      }

      await Notification.create({
        type: "system",
        icon: "check-circle",
        message: `✅ Invoice ${inv?.invoiceNumber} has been paid`,
        link: "/dashboard/invoices",
        color: "green",
        targetUser: inv?.buyer?._id,
      }).catch(() => {});

      emitToUser(inv?.buyer?._id?.toString(), "new_notification", {
        type: "system",
        message: "Invoice marked as paid",
        link: "/dashboard/invoices",
      });
      // Also notify seller
      if (
        inv?.seller?._id &&
        inv.seller._id.toString() !== inv?.buyer?._id?.toString()
      ) {
        await Notification.create({
          type: "system",
          icon: "check-circle",
          message: `✅ Invoice ${inv.invoiceNumber} for ${inv.property?.propertyTitle} has been paid`,
          link: "/dashboard/invoices",
          color: "green",
          targetUser: inv.seller._id,
        }).catch(() => {});
        emitToUser(inv.seller._id.toString(), "new_notification", {
          type: "system",
          message: `Invoice paid for ${inv.property?.propertyTitle}`,
          link: "/dashboard/invoices",
        });
      }
    } catch (e) {
      console.warn("Invoice paid notification failed:", e.message);
    }
  }

  return invoice;
};

// Get invoice stats
export const getInvoiceStats = async () => {
  const [total, pending, paid, overdue, totalAmount] = await Promise.all([
    Invoice.countDocuments(),
    Invoice.countDocuments({ status: "pending" }),
    Invoice.countDocuments({ status: "paid" }),
    Invoice.countDocuments({ status: "overdue" }),
    Invoice.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
  ]);

  return {
    total,
    pending,
    paid,
    overdue,
    totalAmount: totalAmount[0]?.total || 0,
  };
};

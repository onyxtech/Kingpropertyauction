import Menu from "./menu.model.js";

// ─── CRUD ───────────────────────────────────────────────────────
export const createMenu = async (data, userId) => {
  const menu = await Menu.create({ ...data, createdBy: userId });
  return menu;
};

export const getMenus = async () => {
  return Menu.find().sort("-createdAt").lean();
};

export const getMenuById = async (id) => {
  const menu = await Menu.findById(id);
  if (!menu) throw new Error("Menu not found");
  return menu;
};

export const updateMenu = async (id, data) => {
  const menu = await Menu.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!menu) throw new Error("Menu not found");
  return menu;
};

export const deleteMenu = async (id) => {
  const menu = await Menu.findByIdAndDelete(id);
  if (!menu) throw new Error("Menu not found");
  return menu;
};

export const duplicateMenu = async (id, userId) => {
  const original = await Menu.findById(id);
  if (!original) throw new Error("Menu not found");

  const duplicate = await Menu.create({
    name: `${original.name} (Copy)`,
    location: original.location,
    status: "inactive",
    items: original.items,
    createdBy: userId,
  });
  return duplicate;
};

export const seedDefaultMenus = async () => {
  await Menu.deleteMany({ name: { $in: ["Main Navigation", "Footer Links"] } });

  // ─── Header Menu ───────────────────────────────────────────────
  const headerMenu = await Menu.create({
    name: "Main Navigation",
    location: "Header",
    status: "active",
    items: [],
  });

  // STEP 1: Push parent items first
  headerMenu.items.push(
    { label: "Auctions", url: "", type: "dropdown", icon: "Gavel", target: "_self", order: 0 },
    { label: "Buying", url: "", type: "dropdown", icon: "Zap", target: "_self", order: 1 },
    { label: "Selling", url: "", type: "dropdown", icon: "Briefcase", target: "_self", order: 2 },
  );
  // STEP 2: Save to generate MongoDB _ids
  await headerMenu.save();

  // STEP 3: Find saved parents by label
  const auctionParent = headerMenu.items.find((i) => i.label === "Auctions");
  const buyingParent = headerMenu.items.find((i) => i.label === "Buying");
  const sellingParent = headerMenu.items.find((i) => i.label === "Selling");

  // STEP 4: Push children with correct parent _ids + standalone links
  headerMenu.items.push(
    // Auctions dropdown children
    { label: "View All Auctions", url: "/auctions", type: "link", icon: "Grid3x3", subtitle: "Browse auction lots", color: "blue", parent: auctionParent._id, order: 0 },
    { label: "Live Auctions", url: "/live-auctions", type: "link", icon: "Zap", subtitle: "Bid in real-time", badge: true, color: "red", parent: auctionParent._id, order: 1 },
    { label: "View All Lots", url: "/view-all-lots", type: "link", icon: "Package", subtitle: "Explore inventory", color: "emerald", parent: auctionParent._id, order: 2 },
    { label: "Property Valuation", url: "/free-valuation", type: "link", icon: "FileText", subtitle: "Get instant estimate", highlight: "FREE", color: "orange", dividerBefore: true, dividerLabel: "SERVICES", parent: auctionParent._id, order: 3 },
    { label: "Catalogue Request", url: "/catalogue-request", type: "link", icon: "FileText", subtitle: "Download brochures", color: "rose", parent: auctionParent._id, order: 4 },

    // Buying dropdown children
    { label: "Buying Overview", url: "/buying-overview", type: "link", icon: "Grid3x3", subtitle: "Start your journey", color: "blue", parent: buyingParent._id, order: 0 },
    { label: "Guide", url: "/buying-guide", type: "link", icon: "BookOpen", subtitle: "Step-by-step help", color: "purple", parent: buyingParent._id, order: 1 },
    { label: "Register for Alert", url: "/register-alert", type: "link", icon: "Bell", subtitle: "Get notified instantly", color: "emerald", parent: buyingParent._id, order: 2 },
    { label: "Terms of Sale", url: "/terms-of-sale", type: "link", icon: "Shield", subtitle: "Legal protection", color: "amber", parent: buyingParent._id, order: 3 },
    { label: "Why Buy At King", url: "/why-buy-at-king", type: "link", icon: "ThumbsUp", subtitle: "Discover benefits", color: "cyan", dividerBefore: true, dividerLabel: "PREMIUM", parent: buyingParent._id, order: 4 },
    { label: "Solicitor", url: "/solicitor", type: "link", icon: "Briefcase", subtitle: "Legal experts ready", color: "rose", parent: buyingParent._id, order: 5 },

    // Selling dropdown children
    { label: "Add Property", url: "/add-property", type: "link", icon: "Building2", subtitle: "List your property", color: "green", parent: sellingParent._id, order: 0 },
    { label: "Selling Overview", url: "/selling-overview", type: "link", icon: "Grid3x3", subtitle: "Start your journey", color: "blue", parent: sellingParent._id, order: 1 },
    { label: "Why Sell With Us", url: "/why-sell-with-future", type: "link", icon: "ThumbsUp", subtitle: "Discover advantages", color: "purple", parent: sellingParent._id, order: 2 },
    { label: "Guide & FAQ", url: "/guide-faq", type: "link", icon: "HelpCircle", subtitle: "Get answers", color: "emerald", parent: sellingParent._id, order: 3 },
    { label: "Property Valuation", url: "/free-valuation", type: "link", icon: "FileText", subtitle: "Know your worth", highlight: "FREE", color: "orange", dividerBefore: true, dividerLabel: "PREMIUM", parent: sellingParent._id, order: 4 },
    { label: "Referral Fee", url: "/referral-fee", type: "link", icon: "Gift", subtitle: "Earn rewards", color: "indigo", parent: sellingParent._id, order: 5 },
    { label: "Home Report", url: "/home-report", type: "link", icon: "ClipboardList", subtitle: "Property assessment", color: "rose", parent: sellingParent._id, order: 6 },

    // Standalone links (no parent)
    { label: "Live Now", url: "/live-auctions", type: "link", icon: "Zap", badge: true, order: 3 },
    { label: "Contact Us", url: "/contact-us", type: "link", icon: "Mail", order: 4 },
  );
  // STEP 5: Final save
  await headerMenu.save();

  // ─── Footer Menu ───────────────────────────────────────────────
  const footerMenu = await Menu.create({
    name: "Footer Links",
    location: "Footer",
    status: "active",
    items: [],
  });

  // STEP 1: Push parent columns first
  footerMenu.items.push(
    { label: "Auctions", url: "", type: "dropdown", icon: "Gavel", order: 0 },
    { label: "Services", url: "", type: "dropdown", icon: "Home", order: 1 },
    { label: "Support", url: "", type: "dropdown", icon: "Shield", order: 2 },
  );
  // STEP 2: Save to generate MongoDB _ids
  await footerMenu.save();

  // STEP 3: Find saved parents by label
  const footerAuction = footerMenu.items.find((i) => i.label === "Auctions");
  const footerServices = footerMenu.items.find((i) => i.label === "Services");
  const footerSupport = footerMenu.items.find((i) => i.label === "Support");

  // STEP 4: Push children with correct parent _ids
  footerMenu.items.push(
    // Auctions column
    { label: "View All Auctions", url: "/auctions", type: "link", icon: "Gavel", parent: footerAuction._id, order: 0 },
    { label: "Live Auctions", url: "/live-auctions", type: "link", icon: "Zap", parent: footerAuction._id, order: 1 },
    { label: "Online Auctions", url: "/online-auctions", type: "link", icon: "Monitor", parent: footerAuction._id, order: 2 },
    { label: "View All Lots", url: "/view-all-lots", type: "link", icon: "Building2", parent: footerAuction._id, order: 3 },
    { label: "Auction Guide", url: "/guide-faq", type: "link", icon: "FileText", parent: footerAuction._id, order: 4 },

    // Services column
    { label: "Buying Overview", url: "/buying-overview", type: "link", icon: "FileText", parent: footerServices._id, order: 0 },
    { label: "Selling Overview", url: "/selling-overview", type: "link", icon: "FileText", parent: footerServices._id, order: 1 },
    { label: "Property Valuation", url: "/free-valuation", type: "link", icon: "Calculator", parent: footerServices._id, order: 2 },
    { label: "Find Solicitor", url: "/solicitor", type: "link", icon: "Scale", parent: footerServices._id, order: 3 },
    { label: "Home Report", url: "/home-report", type: "link", icon: "FileText", parent: footerServices._id, order: 4 },

    // Support column
    { label: "Guide & FAQ", url: "/guide-faq", type: "link", icon: "FileText", parent: footerSupport._id, order: 0 },
    { label: "Buying Guide", url: "/buying-guide", type: "link", icon: "FileText", parent: footerSupport._id, order: 1 },
    { label: "Contact Us", url: "/contact-us", type: "link", icon: "Mail", parent: footerSupport._id, order: 2 },
    { label: "About Us", url: "/about", type: "link", icon: "Info", parent: footerSupport._id, order: 3 },
    { label: "Terms of Sale", url: "/terms-of-sale", type: "link", icon: "FileText", parent: footerSupport._id, order: 4 },
    { label: "Register Alert", url: "/register-alert", type: "link", icon: "Bell", parent: footerSupport._id, order: 5 },
  );
  // STEP 5: Final save
  await footerMenu.save();

  console.log("✅ Default menus seeded (Header + Footer)");
};

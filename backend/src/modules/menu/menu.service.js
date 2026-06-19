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

export const patchAdminSidebarItems = async () => {
  try {
    const adminSidebar = await Menu.findOne({ name: "Admin Sidebar" });
    if (!adminSidebar) return;

    const existingUrls = adminSidebar.items.map((i) => i.url);

    const newItems = [
      { label: "Offers & Negotiations", url: "/admin/offers", type: "link", icon: "Handshake", order: 4.5 },
      { label: "Auction Report", url: "/admin/auction-bids", type: "link", icon: "BarChart3", order: 4.6 },
      { label: "Approvals", url: "/admin/approvals", type: "link", icon: "CheckCircle", order: 10.2 },
      { label: "Revenue", url: "/admin/revenue", type: "link", icon: "DollarSign", order: 10.3 },
      { label: "Commissions", url: "/admin/commissions", type: "link", icon: "Percent", order: 10.4 },
      { label: "Reports", url: "/admin/reports", type: "link", icon: "FileChartColumn", order: 10.5 },
    ];

    let changed = false;
    for (const item of newItems) {
      if (!existingUrls.includes(item.url)) {
        adminSidebar.items.push(item);
        changed = true;
      }
    }

    if (changed) {
      adminSidebar.items.sort((a, b) => (a.order || 0) - (b.order || 0));
      await adminSidebar.save();
      console.log("✅ Admin Sidebar patched with new items");
    }
  } catch (e) {
    console.warn("Admin sidebar patch failed:", e.message);
  }
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

  const existingQuickLinks = await Menu.findOne({ name: "Footer Quick Links" });
  if (!existingQuickLinks) {
    await Menu.create({
      name: "Footer Quick Links",
      location: "Footer Quick Links",
      status: "active",
      items: [
        { label: "Buying", url: "/buying-overview", type: "link", icon: "ShoppingCart", color: "emerald", order: 0 },
        { label: "Selling", url: "/selling-overview", type: "link", icon: "DollarSign", color: "orange", order: 1 },
        { label: "Live Now", url: "/live-auctions", type: "link", icon: "Play", color: "red", badge: true, badgeLabel: "LIVE", badgeColor: "red", order: 2 },
        { label: "Contact Us", url: "/contact-us", type: "link", icon: "Mail", color: "purple", order: 3 },
        { label: "Register", url: "/register", type: "link", icon: "UserPlus", color: "amber", order: 4 },
        { label: "Sign In", url: "/login", type: "link", icon: "LogIn", color: "slate", order: 5 },
      ],
    });
    console.log("✅ Footer Quick Links seeded");
  }

  const existingMobile = await Menu.findOne({ name: "Mobile Navigation" });
  if (!existingMobile) {
    const mobileMenu = await Menu.create({
      name: "Mobile Navigation",
      location: "Mobile Header",
      status: "active",
      items: [],
    });
    mobileMenu.items.push(
      { label: "Home", url: "/", type: "link", icon: "Home", color: "blue", order: 0 },
      { label: "Auctions", url: "/auctions", type: "link", icon: "Gavel", color: "blue", order: 1 },
      { label: "Live Auctions", url: "/live-auctions", type: "link", icon: "Zap", color: "red", badge: true, badgeLabel: "LIVE", badgeColor: "red", order: 2 },
      { label: "View All Lots", url: "/view-all-lots", type: "link", icon: "Package", color: "emerald", order: 3 },
      { label: "Add Property", url: "/add-property", type: "link", icon: "Building2", color: "green", order: 4 },
      { label: "Property Valuation", url: "/free-valuation", type: "link", icon: "FileText", color: "orange", highlight: "FREE", order: 5 },
      { label: "Buying Overview", url: "/buying-overview", type: "link", icon: "ShoppingCart", color: "cyan", order: 6 },
      { label: "Selling Overview", url: "/selling-overview", type: "link", icon: "DollarSign", color: "purple", order: 7 },
      { label: "Guide & FAQ", url: "/guide-faq", type: "link", icon: "HelpCircle", color: "amber", order: 8 },
      { label: "Contact Us", url: "/contact-us", type: "link", icon: "Mail", color: "rose", order: 9 },
    );
    await mobileMenu.save();
    console.log("✅ Mobile Navigation seeded");
  }

  await Menu.findOneAndDelete({ name: "Admin Sidebar" });
  await Menu.create({
    name: "Admin Sidebar",
    location: "Admin Sidebar",
    status: "active",
    items: [
      { label: "Overview", url: "/admin/overview", type: "link", icon: "LayoutDashboard", order: 0 },
      { label: "Menu Manager", url: "/admin/menus", type: "link", icon: "Menu", order: 1 },
      { label: "Properties", url: "/admin/properties", type: "link", icon: "Building2", order: 2 },
      { label: "Auctions", url: "/admin/auctions", type: "link", icon: "Gavel", order: 3 },
      { label: "Bids", url: "/admin/bids", type: "link", icon: "TrendingUp", order: 4 },
      { label: "Offers & Negotiations", url: "/admin/offers", type: "link", icon: "Handshake", order: 5 },
      { label: "Auction Report", url: "/admin/auction-bids", type: "link", icon: "BarChart3", order: 6 },
      { label: "Marketing", url: "/admin/campaigns", type: "link", icon: "Send", order: 7 },
      { label: "Leads", url: "/admin/leads", type: "link", icon: "Mail", order: 8 },
      { label: "Inbox", url: "/admin/inbox", type: "link", icon: "Inbox", order: 9 },
      { label: "Users", url: "/admin/users", type: "link", icon: "Users", order: 10 },
      { label: "Analytics", url: "/admin/analytics", type: "link", icon: "BarChart3", order: 11 },
      { label: "Reports", url: "/admin/reports", type: "link", icon: "FileChartColumn", order: 13 },
      { label: "Settings", url: "/admin/settings", type: "link", icon: "Settings", order: 14 },
    ],
  });
  console.log("✅ Admin Sidebar seeded");

  const existingAdminTopBar = await Menu.findOne({ name: "Admin TopBar" });
  if (!existingAdminTopBar) {
    await Menu.create({
      name: "Admin TopBar",
      location: "Admin TopBar",
      status: "active",
      items: [
        { label: "Add Property", url: "/admin/properties/new", type: "link", icon: "Plus", order: 0 },
        { label: "Create Auction", url: "/admin/auctions", type: "link", icon: "Gavel", order: 1 },
        { label: "Campaigns", url: "/admin/campaigns", type: "link", icon: "Mail", order: 2 },
        { label: "Reports", url: "/admin/analytics", type: "link", icon: "FileText", order: 3 },
      ],
    });
    console.log("✅ Admin TopBar seeded");
  }
};

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
  const existingHeader = await Menu.findOne({ name: "Main Navigation" });
  const existingFooter = await Menu.findOne({ name: "Footer Links" });
  if (existingHeader && existingFooter) return;

  // Create header menu
  const headerMenu = await Menu.create({
    name: "Main Navigation",
    location: "Header",
    status: "active",
    items: [],
  });

  // Add parent items first, capture their _id
  const auctionParent = headerMenu.items.create({
    label: "Auctions",
    url: "",
    type: "dropdown",
    icon: "Gavel",
    target: "_self",
  });
  const buyingParent = headerMenu.items.create({
    label: "Buying",
    url: "",
    type: "dropdown",
    icon: "Zap",
    target: "_self",
  });
  const sellingParent = headerMenu.items.create({
    label: "Selling",
    url: "",
    type: "dropdown",
    icon: "Briefcase",
    target: "_self",
  });

  // Add children with proper parent references
  headerMenu.items.push(
    {
      label: "View All Auctions",
      url: "/auctions",
      type: "link",
      icon: "Grid3x3",
      subtitle: "Browse auction lots",
      parent: auctionParent._id,
    },
    {
      label: "Live Auctions",
      url: "/live-auctions",
      type: "link",
      icon: "Zap",
      subtitle: "Bid in real-time",
      highlight: "LIVE",
      parent: auctionParent._id,
    },
    {
      label: "View All Lots",
      url: "/view-all-lots",
      type: "link",
      icon: "Package",
      subtitle: "Explore inventory",
      parent: auctionParent._id,
    },
    {
      label: "Free Valuation",
      url: "/free-valuation",
      type: "link",
      icon: "FileText",
      subtitle: "Get instant estimate",
      highlight: "FREE",
      parent: auctionParent._id,
    },
    {
      label: "Auction Finance",
      url: "/auction-finance",
      type: "link",
      icon: "DollarSign",
      subtitle: "Quick approval",
      parent: auctionParent._id,
    },
    {
      label: "Catalogue Request",
      url: "/catalogue-request",
      type: "link",
      icon: "FileText",
      subtitle: "Download brochures",
      parent: auctionParent._id,
    },

    {
      label: "Buying Overview",
      url: "/buying-overview",
      type: "link",
      icon: "Grid3x3",
      subtitle: "Start your journey",
      parent: buyingParent._id,
    },
    {
      label: "Guide",
      url: "/buying-guide",
      type: "link",
      icon: "BookOpen",
      subtitle: "Step-by-step help",
      parent: buyingParent._id,
    },
    {
      label: "Register for Alert",
      url: "/register-alert",
      type: "link",
      icon: "Bell",
      subtitle: "Get notified instantly",
      parent: buyingParent._id,
    },
    {
      label: "Terms of Sale",
      url: "/terms-of-sale",
      type: "link",
      icon: "Shield",
      subtitle: "Legal protection",
      parent: buyingParent._id,
    },
    {
      label: "Why Buy At King Auction",
      url: "/why-buy-at-king",
      type: "link",
      icon: "ThumbsUp",
      subtitle: "Discover benefits",
      parent: buyingParent._id,
    },
    {
      label: "Auction Finance",
      url: "/auction-finance",
      type: "link",
      icon: "DollarSign",
      subtitle: "Quick approval",
      parent: buyingParent._id,
    },
    {
      label: "Solicitor",
      url: "/solicitor",
      type: "link",
      icon: "Briefcase",
      subtitle: "Legal experts ready",
      parent: buyingParent._id,
    },

    {
      label: "Add Property",
      url: "/add-property",
      type: "link",
      icon: "Building2",
      subtitle: "List your property",
      parent: sellingParent._id,
    },
    {
      label: "Selling Overview",
      url: "/selling-overview",
      type: "link",
      icon: "Grid3x3",
      subtitle: "Start your journey",
      parent: sellingParent._id,
    },
    {
      label: "Why Sell With Future",
      url: "/why-sell-with-future",
      type: "link",
      icon: "ThumbsUp",
      subtitle: "Discover advantages",
      parent: sellingParent._id,
    },
    {
      label: "Guide & FAQ",
      url: "/guide-faq",
      type: "link",
      icon: "HelpCircle",
      subtitle: "Get answers",
      parent: sellingParent._id,
    },
    {
      label: "Free Valuation",
      url: "/free-valuation",
      type: "link",
      icon: "FileText",
      subtitle: "Know your worth",
      highlight: "FREE",
      parent: sellingParent._id,
    },
    {
      label: "Referral Fee",
      url: "/referral-fee",
      type: "link",
      icon: "Gift",
      subtitle: "Earn rewards",
      parent: sellingParent._id,
    },
    {
      label: "Home Report",
      url: "/home-report",
      type: "link",
      icon: "ClipboardList",
      subtitle: "Property assessment",
      parent: sellingParent._id,
    },

    // Standalone links
    {
      label: "Live Now",
      url: "/live-auctions",
      type: "link",
      icon: "Zap",
      badge: true,
    },
    {
      label: "Locations",
      url: "/view-live-locations",
      type: "link",
      icon: "MapPin",
    },
    { label: "Contact Us", url: "/contact-us", type: "link", icon: "Mail" },
  );
  await headerMenu.save();

  // Create footer menu
  const footerMenu = await Menu.create({
    name: "Footer Links",
    location: "Footer",
    status: "active",
    items: [],
  });

  const footerAuction = footerMenu.items.create({
    label: "Auctions",
    url: "",
    type: "dropdown",
    icon: "Gavel",
  });
  const footerServices = footerMenu.items.create({
    label: "Services",
    url: "",
    type: "dropdown",
    icon: "Home",
  });
  const footerSupport = footerMenu.items.create({
    label: "Support",
    url: "",
    type: "dropdown",
    icon: "Shield",
  });

  footerMenu.items.push(
    {
      label: "View All Auctions",
      url: "/auctions",
      type: "link",
      icon: "Gavel",
      parent: footerAuction._id,
    },
    {
      label: "Live Auctions",
      url: "/live-auctions",
      type: "link",
      icon: "Zap",
      parent: footerAuction._id,
    },
    {
      label: "Online Auctions",
      url: "/online-auctions",
      type: "link",
      icon: "Monitor",
      parent: footerAuction._id,
    },
    {
      label: "View All Lots",
      url: "/view-all-lots",
      type: "link",
      icon: "Building2",
      parent: footerAuction._id,
    },
    {
      label: "Live Locations",
      url: "/view-live-locations",
      type: "link",
      icon: "MapPin",
      parent: footerAuction._id,
    },
    {
      label: "Auction Guide",
      url: "/auction-guide",
      type: "link",
      icon: "FileText",
      parent: footerAuction._id,
    },

    {
      label: "Buying Overview",
      url: "/buying-overview",
      type: "link",
      icon: "FileText",
      parent: footerServices._id,
    },
    {
      label: "Selling Overview",
      url: "/selling-overview",
      type: "link",
      icon: "FileText",
      parent: footerServices._id,
    },
    {
      label: "Free Valuation",
      url: "/free-valuation",
      type: "link",
      icon: "Calculator",
      parent: footerServices._id,
    },
    {
      label: "Auction Finance",
      url: "/auction-finance",
      type: "link",
      icon: "DollarSign",
      parent: footerServices._id,
    },
    {
      label: "Find Solicitor",
      url: "/solicitor",
      type: "link",
      icon: "Scale",
      parent: footerServices._id,
    },
    {
      label: "Home Report",
      url: "/home-report",
      type: "link",
      icon: "FileText",
      parent: footerServices._id,
    },

    {
      label: "Guide & FAQ",
      url: "/guide-faq",
      type: "link",
      icon: "FileText",
      parent: footerSupport._id,
    },
    {
      label: "Buying Guide",
      url: "/buying-guide",
      type: "link",
      icon: "FileText",
      parent: footerSupport._id,
    },
    {
      label: "Contact Us",
      url: "/contact-us",
      type: "link",
      icon: "Mail",
      parent: footerSupport._id,
    },
    {
      label: "About Us",
      url: "/about",
      type: "link",
      icon: "Users",
      parent: footerSupport._id,
    },
    {
      label: "Terms of Sale",
      url: "/terms-of-sale",
      type: "link",
      icon: "FileText",
      parent: footerSupport._id,
    },
  );
  await footerMenu.save();

  console.log("✅ Default menus seeded (Header + Footer)");
};

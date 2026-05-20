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
  const count = await Menu.countDocuments();
  if (count > 0) return;

  const defaults = [
    {
      name: "Main Navigation",
      location: "Header",
      status: "active",
      items: [
        {
          label: "Auctions",
          url: "",
          type: "dropdown",
          icon: "Gavel",
          target: "_self",
          badge: false,
          children: [
            {
              label: "View All Auctions",
              url: "/auctions",
              type: "link",
              icon: "Gavel",
              target: "_self",
              badge: false,
            },
            {
              label: "Live Auctions",
              url: "/live-auctions",
              type: "link",
              icon: "Zap",
              target: "_self",
              badge: false,
            },
            {
              label: "Online Auctions",
              url: "/online-auctions",
              type: "link",
              icon: "Monitor",
              target: "_self",
              badge: false,
            },
            {
              label: "View All Lots",
              url: "/view-all-lots",
              type: "link",
              icon: "Building2",
              target: "_self",
              badge: false,
            },
            {
              label: "Live Locations",
              url: "/view-live-locations",
              type: "link",
              icon: "MapPin",
              target: "_self",
              badge: false,
            },
            {
              label: "Auction Guide",
              url: "/auction-guide",
              type: "link",
              icon: "FileText",
              target: "_self",
              badge: false,
            },
          ],
        },
        {
          label: "Buying",
          url: "",
          type: "dropdown",
          icon: "Zap",
          target: "_self",
          badge: false,
          children: [
            {
              label: "Buying Overview",
              url: "/buying-overview",
              type: "link",
              icon: "FileText",
              target: "_self",
              badge: false,
            },
            {
              label: "Buying Guide",
              url: "/buying-guide",
              type: "link",
              icon: "FileText",
              target: "_self",
              badge: false,
            },
            {
              label: "Why Buy At King",
              url: "/why-buy-at-king",
              type: "link",
              icon: "Star",
              target: "_self",
              badge: false,
            },
            {
              label: "Auction Finance",
              url: "/auction-finance",
              type: "link",
              icon: "DollarSign",
              target: "_self",
              badge: false,
            },
            {
              label: "Catalogue Request",
              url: "/catalogue-request",
              type: "link",
              icon: "BookOpen",
              target: "_self",
              badge: false,
            },
          ],
        },
        {
          label: "Selling",
          url: "",
          type: "dropdown",
          icon: "Briefcase",
          target: "_self",
          badge: false,
          children: [
            {
              label: "Selling Overview",
              url: "/selling-overview",
              type: "link",
              icon: "FileText",
              target: "_self",
              badge: false,
            },
            {
              label: "Why Sell With Future",
              url: "/why-sell-with-future",
              type: "link",
              icon: "Star",
              target: "_self",
              badge: false,
            },
            {
              label: "Free Valuation",
              url: "/free-valuation",
              type: "link",
              icon: "Calculator",
              target: "_self",
              badge: false,
            },
            {
              label: "Home Report",
              url: "/home-report",
              type: "link",
              icon: "FileText",
              target: "_self",
              badge: false,
            },
            {
              label: "Find Solicitor",
              url: "/solicitor",
              type: "link",
              icon: "Scale",
              target: "_self",
              badge: false,
            },
            {
              label: "Referral Fee",
              url: "/referral-fee",
              type: "link",
              icon: "Users",
              target: "_self",
              badge: false,
            },
          ],
        },
        {
          label: "Live Now",
          url: "/live-auctions",
          type: "link",
          icon: "Zap",
          target: "_self",
          badge: true,
        },
        {
          label: "Locations",
          url: "/view-live-locations",
          type: "link",
          icon: "MapPin",
          target: "_self",
          badge: false,
        },
        {
          label: "Contact Us",
          url: "/contact-us",
          type: "link",
          icon: "Mail",
          target: "_self",
          badge: false,
        },
      ],
    },
    {
      name: "Footer Links",
      location: "Footer",
      status: "active",
      items: [
        {
          label: "Auctions",
          url: "",
          type: "dropdown",
          icon: "Gavel",
          target: "_self",
          badge: false,
          children: [
            {
              label: "View All Auctions",
              url: "/auctions",
              type: "link",
              icon: "Gavel",
              target: "_self",
              badge: false,
            },
            {
              label: "Live Auctions",
              url: "/live-auctions",
              type: "link",
              icon: "Zap",
              target: "_self",
              badge: false,
            },
            {
              label: "Online Auctions",
              url: "/online-auctions",
              type: "link",
              icon: "Monitor",
              target: "_self",
              badge: false,
            },
            {
              label: "View All Lots",
              url: "/view-all-lots",
              type: "link",
              icon: "Building2",
              target: "_self",
              badge: false,
            },
            {
              label: "Live Locations",
              url: "/view-live-locations",
              type: "link",
              icon: "MapPin",
              target: "_self",
              badge: false,
            },
            {
              label: "Auction Guide",
              url: "/auction-guide",
              type: "link",
              icon: "FileText",
              target: "_self",
              badge: false,
            },
          ],
        },
        {
          label: "Services",
          url: "",
          type: "dropdown",
          icon: "Briefcase",
          target: "_self",
          badge: false,
          children: [
            {
              label: "Buying Overview",
              url: "/buying-overview",
              type: "link",
              icon: "FileText",
              target: "_self",
              badge: false,
            },
            {
              label: "Selling Overview",
              url: "/selling-overview",
              type: "link",
              icon: "FileText",
              target: "_self",
              badge: false,
            },
            {
              label: "Free Valuation",
              url: "/free-valuation",
              type: "link",
              icon: "Calculator",
              target: "_self",
              badge: false,
            },
            {
              label: "Auction Finance",
              url: "/auction-finance",
              type: "link",
              icon: "DollarSign",
              target: "_self",
              badge: false,
            },
            {
              label: "Find Solicitor",
              url: "/solicitor",
              type: "link",
              icon: "Scale",
              target: "_self",
              badge: false,
            },
            {
              label: "Home Report",
              url: "/home-report",
              type: "link",
              icon: "FileText",
              target: "_self",
              badge: false,
            },
          ],
        },
        {
          label: "Support",
          url: "",
          type: "dropdown",
          icon: "HelpCircle",
          target: "_self",
          badge: false,
          children: [
            {
              label: "Guide & FAQ",
              url: "/guide-faq",
              type: "link",
              icon: "FileText",
              target: "_self",
              badge: false,
            },
            {
              label: "Buying Guide",
              url: "/buying-guide",
              type: "link",
              icon: "FileText",
              target: "_self",
              badge: false,
            },
            {
              label: "Contact Us",
              url: "/contact-us",
              type: "link",
              icon: "Mail",
              target: "_self",
              badge: false,
            },
            {
              label: "About Us",
              url: "/about",
              type: "link",
              icon: "Users",
              target: "_self",
              badge: false,
            },
            {
              label: "Terms of Sale",
              url: "/terms-of-sale",
              type: "link",
              icon: "FileText",
              target: "_self",
              badge: false,
            },
          ],
        },
      ],
    },
  ];

  // Flatten children into items with parent references before inserting
  const flattenedDefaults = defaults.map((menu) => {
    const allItems = [];
    menu.items.forEach((item) => {
      const { children, ...parentItem } = item;
      const parentWithId = { ...parentItem, id: Date.now() + Math.random() };
      allItems.push(parentWithId);
      if (children) {
        children.forEach((child) => {
          allItems.push({
            ...child,
            parent: parentWithId.id,
            id: Date.now() + Math.random(),
          });
        });
      }
    });
    return { ...menu, items: allItems };
  });

  await Menu.insertMany(flattenedDefaults);
  console.log("✅ Default menus seeded (Header + Footer)");
};

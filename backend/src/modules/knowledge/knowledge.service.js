import Knowledge from './knowledge.model.js';

const DEFAULT_KNOWLEDGE = [
  {
    key: 'company_overview',
    title: 'Company Overview',
    category: 'company',
    order: 1,
    content: `King Property Auction is a UK-based property auction platform operating since 2024. We specialise in residential, commercial, land, and investment property auctions across the United Kingdom. We offer online auctions. Our platform serves buyers, sellers, agents, and property investors.`,
  },
  {
    key: 'selling_process',
    title: 'How to List/Sell a Property',
    category: 'process',
    order: 2,
    content: `To sell or list a property with King Property Auction:
1. Book a FREE valuation at /free-valuation (no obligation)
2. Our expert valuer contacts you within 48 hours
3. We agree a guide price and reserve price together
4. Your property is marketed in our digital catalogue
5. Property goes to auction - thousands of registered bidders compete
6. At hammer fall contracts exchange immediately
7. Completion within 28 days
8. We handle all marketing, catalogue, and auction day management
There are no upfront fees to list. We earn a small commission on successful sales only.
If you are an agent or have a seller account, you can also submit properties directly via the admin panel at /admin/properties/new after logging in with an agent or admin account.`,
  },
  {
    key: 'buying_process',
    title: 'How to Buy at Auction',
    category: 'process',
    order: 3,
    content: `To buy a property at King Property Auction:
1. Register free at /register
2. Complete ID verification (passport or driving licence)
3. Pay refundable registration deposit to activate bidding
4. Browse properties at /properties or auctions at /auctions
5. Download and review the legal pack for any property BEFORE bidding
6. Attend auction or bid online on auction day
7. Winning bid = immediate exchange of contracts
8. Complete purchase within 28 days
Auto-bidding available: set your maximum and system bids on your behalf.
Regular users register at /register.
Agents apply for an agent account to list properties.
Investors register the same as buyers at /register.`,
  },
  {
    key: 'fees_and_costs',
    title: 'Fees and Costs',
    category: 'fees',
    order: 4,
    content: `King Property Auction fees:
- Registration: FREE (account creation is free)
- Bidding deposit: Refundable if you do not win
- Buyer's premium: Added to the hammer price (check individual lot details)
- Seller fees: Commission on successful sale only, no upfront costs
- Legal pack: FREE to download and review
Always check the specific lot details for exact fees as they vary by property.`,
  },
  {
    key: 'legal_information',
    title: 'Legal Information',
    category: 'legal',
    order: 5,
    content: `Important legal information for auction participants:
- Legal packs are available for ALL properties before auction
- ALWAYS review the legal pack with a qualified solicitor before bidding
- At hammer fall, contracts exchange IMMEDIATELY - this is legally binding
- Completion is typically 28 days (some properties may vary)
- Properties are sold as seen - buyers are responsible for surveys
- Title deeds, searches, and planning information are in the legal pack
- Auction Finance and bridging loans available - see /contact-us for contact details`,
  },
  {
    key: 'auction_types',
    title: 'Types of Auctions',
    category: 'process',
    order: 6,
    content: `King Property Auction offers three auction formats:
LIVE AUCTION: Traditional in-room bidding. Bidders attend in person or bid by telephone proxy.
ONLINE AUCTION: Bid from anywhere via our website. Real-time competitive bidding with countdown timer.
HYBRID AUCTION: Both in-room and online simultaneously. Maximum exposure and competition.
RESERVE vs ABSOLUTE:
- Reserve auction: Property only sells if bidding meets the reserve price
- Absolute auction: Property sells to highest bidder regardless of price`,
  },
  {
    key: 'contact_and_hours',
    title: 'Contact Information',
    category: 'company',
    order: 7,
    content: `King Property Auction contact details:
Phone: 0800 123 4567
Email: info@kingauction.com
Address: 123 Property Lane, Mayfair, London W1K 5AB
Office Hours: Monday-Friday 9am-6pm, Saturday-Sunday 10am-4pm
For property valuations: /free-valuation
For catalogue requests: /catalogue-request
For general enquiries: /contact-us`,
  },
  {
    key: 'user_roles',
    title: 'User Roles and Account Types',
    category: 'process',
    order: 8,
    content: `Account types on King Property Auction:
BUYER: Register to bid on properties. Needs ID verification and deposit.
SELLER: List properties for auction. Start with free valuation at /free-valuation.
AGENT: Manage property listings on behalf of sellers. Apply for agent account.
INVESTOR: Portfolio management, multiple property bidding. Same registration as buyer.
All accounts are FREE to create at /register.
Admin approval may be required before full account activation.`,
  },
  {
    key: 'agent_messages',
    title: 'Agent Chat Messages',
    category: 'custom',
    order: 9,
    content: `AGENT_ACK: I've notified our support team that you'd like to speak with an agent. Someone will be with you shortly. For immediate help, please visit /contact-us or call our support line.
AGENT_HOLD: Our support agent will respond to your message shortly. Please hold on.
AGENT_OFFLINE: Our agents are currently offline. Please leave your message and we'll get back to you, or visit /contact-us for other ways to reach us.`,
  },
  {
    key: 'ai_fallback_messages',
    title: 'AI Fallback Responses',
    category: 'custom',
    order: 10,
    content: `GREETING: Hello! Welcome to King Property Auction. I'm here to help with property auctions, valuations, and more. How can I assist you today?
CONTACT: For contact details please visit /contact-us or use our contact form.
GENERAL: Thank you for your enquiry. I'd be happy to help. For specific assistance please visit /contact-us. Is there anything else I can help with?`,
  },
];

// ─── Seed defaults — upserts so new entries are added without overwriting admin edits ───
export const seedDefaultKnowledge = async () => {
  try {
    for (const entry of DEFAULT_KNOWLEDGE) {
      await Knowledge.findOneAndUpdate(
        { key: entry.key },
        { $setOnInsert: entry },
        { upsert: true, new: true }
      );
    }
    console.log('✅ Knowledge base verified/seeded');
  } catch (e) {
    console.error('[Knowledge] Seed error:', e.message);
  }
};

// ─── Get all active knowledge as formatted context string ───
export const getKnowledgeContext = async () => {
  try {
    const entries = await Knowledge.find({ isActive: true })
      .sort('order')
      .select('title content category')
      .lean();

    if (entries.length === 0) return '';

    return entries
      .map(e => `[${e.title.toUpperCase()}]\n${e.content}`)
      .join('\n\n');
  } catch (e) {
    console.error('[Knowledge] Context fetch error:', e.message);
    return '';
  }
};

export const getAllKnowledge = async () => {
  return Knowledge.find().sort('order').lean();
};

export const getKnowledgeByKey = async (key) => {
  return Knowledge.findOne({ key });
};

export const createKnowledge = async (data, userId) => {
  return Knowledge.create({ ...data, updatedBy: userId });
};

export const updateKnowledge = async (id, data, userId) => {
  return Knowledge.findByIdAndUpdate(
    id,
    { ...data, updatedBy: userId },
    { new: true, runValidators: true }
  );
};

export const deleteKnowledge = async (id) => {
  return Knowledge.findByIdAndDelete(id);
};

export const toggleKnowledge = async (id, userId) => {
  const entry = await Knowledge.findById(id);
  if (!entry) throw new Error('Knowledge entry not found');
  entry.isActive = !entry.isActive;
  entry.updatedBy = userId;
  return entry.save();
};

export const fixKnowledgeURLs = async () => {
  try {
    const entries = await Knowledge.find();
    for (const entry of entries) {
      let updated = entry.content;
      updated = updated.replace(/https?:\/\/www\.kingauction\.com/g, '');
      updated = updated.replace(/https?:\/\/kingauction\.com/g, '');
      updated = updated.replace(/http:\/\/localhost:\d+/g, '');
      if (updated !== entry.content) {
        await Knowledge.findByIdAndUpdate(entry._id, { content: updated });
        console.log(`[Knowledge] Fixed URLs in: ${entry.key}`);
      }
    }
  } catch (e) {
    console.error('[Knowledge] URL fix error:', e.message);
  }
};

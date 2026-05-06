import Lead from './lead.model.js';

export const createLead = async (data) => {
  return Lead.create(data);
};

export const getLeads = async (query = {}) => {
  const { page = 1, limit = 10, status, type } = query;
  const filter = {};
  if (status) filter.status = status;
  if (type) filter.leadType = type;

  const skip = (page - 1) * limit;
  const [leads, total] = await Promise.all([
    Lead.find(filter).sort('-createdAt').skip(skip).limit(limit).populate('assignedTo', 'name'),
    Lead.countDocuments(filter),
  ]);

  return { leads, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const updateLead = async (id, data) => {
  return Lead.findByIdAndUpdate(id, data, { new: true });
};

export const deleteLead = async (id) => {
  return Lead.findByIdAndDelete(id);
};
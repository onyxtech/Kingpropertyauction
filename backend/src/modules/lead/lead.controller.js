import * as leadService from './lead.service.js';

export const create = async (req, res) => {
  try {
    const lead = await leadService.createLead(req.body);
    res.status(201).json({ success: true, data: lead, message: 'Your message has been received!' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const result = await leadService.getLeads(req.query);
    res.status(200).json({ success: true, data: result.leads, pagination: result.pagination });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const lead = await leadService.updateLead(req.params.id, req.body);
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    await leadService.deleteLead(req.params.id);
    res.status(200).json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
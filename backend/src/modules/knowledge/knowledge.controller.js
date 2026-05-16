import * as knowledgeService from './knowledge.service.js';

export const getAll = async (req, res) => {
  try {
    const entries = await knowledgeService.getAllKnowledge();
    res.json({ success: true, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const entry = await knowledgeService.createKnowledge(req.body, req.user._id);
    res.status(201).json({ success: true, data: entry, message: 'Knowledge entry created' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const entry = await knowledgeService.updateKnowledge(req.params.id, req.body, req.user._id);
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
    res.json({ success: true, data: entry, message: 'Knowledge entry updated' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    await knowledgeService.deleteKnowledge(req.params.id);
    res.json({ success: true, message: 'Knowledge entry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggle = async (req, res) => {
  try {
    const entry = await knowledgeService.toggleKnowledge(req.params.id, req.user._id);
    res.json({ success: true, data: entry, message: `Entry ${entry.isActive ? 'enabled' : 'disabled'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

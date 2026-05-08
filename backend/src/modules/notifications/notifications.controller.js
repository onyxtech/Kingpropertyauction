import * as templateService from './template.service.js';

export const getAllTemplatesController = async (req, res) => {
  try {
    const templates = await templateService.getAllTemplates();
    res.json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTemplateController = async (req, res) => {
  try {
    const template = await templateService.getTemplate(req.params.key);
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
    res.json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTemplateController = async (req, res) => {
  try {
    const template = await templateService.updateTemplate(req.params.key, req.body);
    res.json({ success: true, data: template, message: 'Template updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetTemplateController = async (req, res) => {
  try {
    const template = await templateService.resetTemplate(req.params.key);
    res.json({ success: true, data: template, message: 'Template reset to default' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
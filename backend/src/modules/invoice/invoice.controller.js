import * as invoiceService from "./invoice.service.js";

export const generate = async (req, res) => {
  try {
    const invoice = await invoiceService.generateInvoice(req.body, req.user._id);
    res.status(201).json({ success: true, data: invoice, message: "Invoice generated successfully" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const result = await invoiceService.getInvoices(req.query);
    res.json({ success: true, ...result });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getById = async (req, res) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });
    res.json({ success: true, data: invoice });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const invoice = await invoiceService.updateInvoiceStatus(req.params.id, req.body.status, req.user._id);
    res.json({ success: true, data: invoice });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = await invoiceService.getInvoiceStats();
    res.json({ success: true, data: stats });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const calculate = async (req, res) => {
  try {
    const amounts = await invoiceService.calculateInvoice(req.body.salePrice, req.body.customSettings || {});
    res.json({ success: true, data: amounts });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};


export const getMyInvoices = async (req, res) => {
  try {
    const view = req.query.view || "buyer";
    const invoices = await invoiceService.getUserInvoices(req.user._id, view);
    res.json({ success: true, data: invoices });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
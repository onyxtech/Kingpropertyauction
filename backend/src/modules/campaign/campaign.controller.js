import * as campaignService from './campaign.service.js';

export const create = async (req, res) => {
  try {
    const campaign = await campaignService.createCampaign(req.body, req.user._id);
    res.status(201).json({ success: true, data: campaign, message: 'Campaign created' });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

export const getAll = async (req, res) => {
  try {
    const result = await campaignService.getCampaigns(req.query);
    res.status(200).json({ success: true, data: result.campaigns, pagination: result.pagination });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const getById = async (req, res) => {
  try {
    const campaign = await campaignService.getCampaignById(req.params.id);
    res.status(200).json({ success: true, data: campaign });
  } catch (error) { res.status(404).json({ success: false, message: error.message }); }
};

export const update = async (req, res) => {
  try {
    const campaign = await campaignService.updateCampaign(req.params.id, req.body);
    res.status(200).json({ success: true, data: campaign, message: 'Campaign updated' });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

export const remove = async (req, res) => {
  try {
    await campaignService.deleteCampaign(req.params.id);
    res.status(200).json({ success: true, message: 'Campaign deleted' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const duplicate = async (req, res) => {
  try {
    const campaign = await campaignService.duplicateCampaign(req.params.id, req.user._id);
    res.status(201).json({ success: true, data: campaign, message: 'Campaign duplicated' });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

export const send = async (req, res) => {
  try {
    const result = await campaignService.sendCampaign(req.params.id);
    res.status(200).json({ success: true, data: result, message: 'Campaign sent successfully' });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

export const sendTest = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Test email is required' });
    const result = await campaignService.sendTestEmail(req.params.id, email);
    res.status(200).json({ success: true, data: result, message: `Test sent to ${email}` });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

export const getStats = async (req, res) => {
  try {
    const stats = await campaignService.getCampaignStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const getTemplates = async (req, res) => {
  try {
    const templates = campaignService.getMarketingTemplates();
    res.status(200).json({ success: true, data: templates });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const getProperties = async (req, res) => {
  try {
    const properties = await campaignService.getPropertiesForCampaign();
    res.status(200).json({ success: true, data: properties });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const getAuctions = async (req, res) => {
  try {
    const auctions = await campaignService.getAuctionsForCampaign();
    res.status(200).json({ success: true, data: auctions });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const trackOpen = async (req, res) => {
  try {
    const pixel = await campaignService.trackOpen(req.params.campaignId);
    res.writeHead(200, { 'Content-Type': 'image/gif', 'Content-Length': pixel.length, 'Cache-Control': 'no-cache' });
    res.end(pixel);
  } catch (error) { res.status(200).end(); }
};

export const trackClick = async (req, res) => {
  try {
    const redirectTo = await campaignService.trackClick(req.params.campaignId, req.query.url);
    res.redirect(redirectTo);
  } catch (error) {
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const { email, token } = req.query;
    if (!email || !token) {
      return res.status(400).send('<h2 style="font-family:Arial,sans-serif;text-align:center;padding:60px 20px;">Invalid unsubscribe link.</h2>');
    }
    await campaignService.unsubscribeUser(email, token);
    res.send(`<!DOCTYPE html><html><head><title>Unsubscribed</title></head><body style="font-family:Arial,sans-serif;text-align:center;padding:60px 20px;"><h2 style="color:#1e293b;">You have been unsubscribed</h2><p style="color:#64748b;">You will no longer receive marketing emails from King Property Auction.</p></body></html>`);
  } catch (error) {
    console.error('[Campaign] unsubscribe error:', error.message);
    if (error.message === 'Invalid unsubscribe token') {
      return res.status(400).send('<h2 style="font-family:Arial,sans-serif;text-align:center;padding:60px 20px;">Invalid unsubscribe link.</h2>');
    }
    res.status(500).send('<h2 style="font-family:Arial,sans-serif;text-align:center;padding:60px 20px;">An error occurred. Please try again.</h2>');
  }
};
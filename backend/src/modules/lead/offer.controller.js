import * as offerService from "./offer.service.js";

export const submit = async (req, res) => {
  try {
    const userId = req.user?._id || null;
    const result = await offerService.submitOffer(req.body, userId);
    res.status(201).json({
      success: true,
      data: result.offer,
      message: "Your offer has been submitted successfully!",
    });
  } catch (error) {
    console.error("[Offer] submit error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const result = await offerService.getOffers(req.query);
    res.status(200).json({
      success: true,
      data: result.offers,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("[Offer] getAll error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const offer = await offerService.getOfferById(req.params.id);
    if (!offer)
      return res.status(404).json({ success: false, message: "Offer not found" });
    res.status(200).json({ success: true, data: offer });
  } catch (error) {
    console.error("[Offer] getById error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const offer = await offerService.updateOffer(
      req.params.id,
      req.body,
      req.user._id
    );
    res.status(200).json({ success: true, data: offer });
  } catch (error) {
    console.error("[Offer] update error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = await offerService.getOffersStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("[Offer] getStats error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
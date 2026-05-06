import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.CLIENT_URL || 'http://localhost:5173';

export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    const fileUrls = req.files.map((file) => ({
      fileName: file.filename,
      fileUrl: `/uploads/properties/${file.filename}`,
      fileSize: file.size,
      mimeType: file.mimetype,
    }));

    res.status(200).json({
      success: true,
      data: fileUrls,
      message: `${req.files.length} image(s) uploaded successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No video uploaded' });
    }

    res.status(200).json({
      success: true,
      data: {
        fileName: req.file.filename,
        fileUrl: `/uploads/videos/${req.file.filename}`,
        fileSize: req.file.size,
      },
      message: 'Video uploaded successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadFloorPlan = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    res.status(200).json({
      success: true,
      data: {
        fileName: req.file.filename,
        fileUrl: `/uploads/floorplans/${req.file.filename}`,
      },
      message: 'Floor plan uploaded successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadLegalDocs = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No documents uploaded' });
    }

    const fileUrls = req.files.map((file) => ({
      fileName: file.filename,
      fileUrl: `/uploads/documents/${file.filename}`,
    }));

    res.status(200).json({
      success: true,
      data: fileUrls,
      message: `${req.files.length} document(s) uploaded successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
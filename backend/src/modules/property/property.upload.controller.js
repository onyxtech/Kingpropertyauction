import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded',
      });
    }

    const fileUrls = [];

    for (const file of req.files) {
      try {
        const originalPath = file.path;
        const webpFilename = file.filename.replace(
          path.extname(file.filename),
          '.webp'
        );
        const webpPath = path.join(path.dirname(originalPath), webpFilename);

        await sharp(originalPath)
          .webp({ quality: 80 })
          .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
          .toFile(webpPath);

        const thumbFilename = `thumb_${webpFilename}`;
        const thumbPath = path.join(path.dirname(originalPath), thumbFilename);

        await sharp(originalPath)
          .webp({ quality: 60 })
          .resize(400, 300, { fit: 'cover', position: 'center' })
          .toFile(thumbPath);

        fs.unlinkSync(originalPath);

        fileUrls.push({
          fileName: webpFilename,
          fileUrl: `/uploads/properties/${webpFilename}`,
          thumbUrl: `/uploads/properties/${thumbFilename}`,
          fileSize: fs.statSync(webpPath).size,
          mimeType: 'image/webp',
        });
      } catch (conversionError) {
        console.error('WebP conversion failed:', conversionError.message);
        fileUrls.push({
          fileName: file.filename,
          fileUrl: `/uploads/properties/${file.filename}`,
          fileSize: file.size,
          mimeType: file.mimetype,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: fileUrls,
      message: `${fileUrls.length} image(s) uploaded successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Upload failed',
    });
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

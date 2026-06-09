import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BRAND_NAME = 'KING PROPERTY AUCTION';
const BRAND_SITE = 'kingpropertyauction.com';

// ============================================
// IMAGE WATERMARK - Single center diagonal
// ============================================
const addImageWatermark = async (
  inputPath,
  outputPath,
  quality = 80,
  resizeOptions = null
) => {
  // Calculate actual output dimensions AFTER resize so SVG matches exactly
  const meta = await sharp(inputPath).metadata();
  let outWidth = meta.width || 1920;
  let outHeight = meta.height || 1080;

  if (resizeOptions) {
    const { width: maxW, height: maxH, fit } = resizeOptions;
    if (fit === 'cover') {
      outWidth = maxW;
      outHeight = maxH;
    } else {
      // 'inside' or default: maintain aspect ratio, shrink only
      const ratio = Math.min(maxW / outWidth, maxH / outHeight);
      if (ratio < 1) {
        outWidth = Math.round(outWidth * ratio);
        outHeight = Math.round(outHeight * ratio);
      }
    }
  }

  // Font scales to OUTPUT dimensions
  const fontSize = Math.max(Math.floor(outWidth / 28), 18);
  const subFontSize = Math.max(Math.floor(fontSize * 0.5), 11);

  // SVG matches OUTPUT dimensions exactly
  const svg = `
    <svg
      width="${outWidth}"
      height="${outHeight}"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>
          .main {
            font-family: Arial Black, Arial, sans-serif;
            font-size: ${fontSize}px;
            fill: rgba(255, 255, 255, 0.45);
            font-weight: 900;
            letter-spacing: 4px;
          }
          .sub {
            font-family: Arial, sans-serif;
            font-size: ${subFontSize}px;
            fill: rgba(255, 255, 255, 0.38);
            font-weight: bold;
            letter-spacing: 3px;
          }
        </style>
      </defs>

      <!-- Dark semi-transparent overlay to make text readable on any image -->
      <rect
        x="0"
        y="0"
        width="${outWidth}"
        height="${outHeight}"
        fill="rgba(0,0,0,0.08)"
      />

      <!-- Main brand text - perfectly centered -->
      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        dominant-baseline="middle"
        class="main"
        transform="rotate(-35, ${outWidth/2}, ${outHeight/2})"
      >${BRAND_NAME}</text>

      <!-- Website text - below main, same center -->
      <text
        x="50%"
        y="${outHeight/2 + fontSize * 1.3}"
        text-anchor="middle"
        dominant-baseline="middle"
        class="sub"
        transform="rotate(-35, ${outWidth/2}, ${outHeight/2 + fontSize * 1.3})"
      >${BRAND_SITE}</text>

    </svg>
  `;

  const watermarkBuffer = Buffer.from(svg);

  let pipeline = sharp(inputPath);

  if (resizeOptions) {
    pipeline = pipeline.resize(
      resizeOptions.width,
      resizeOptions.height,
      {
        fit: resizeOptions.fit || 'inside',
        withoutEnlargement: true,
        position: resizeOptions.position || 'center',
      }
    );
  }

  await pipeline
    .webp({ quality })
    .composite([{
      input: watermarkBuffer,
      top: 0,
      left: 0,
    }])
    .toFile(outputPath);
};

// ============================================
// PDF WATERMARK - Single center diagonal
// ============================================
const addPdfWatermark = async (inputPath, outputPath) => {
  try {
    const existingPdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(
      existingPdfBytes,
      { ignoreEncryption: true }
    );
    const pages = pdfDoc.getPages();

    for (const page of pages) {
      const { width, height } = page.getSize();

      const fontSize = Math.min(width, height) / 16;
      const subFontSize = fontSize * 0.5;
      const angle = -35;

      const mainLen = BRAND_NAME.length * fontSize * 0.5;
      const subLen = BRAND_SITE.length * subFontSize * 0.5;

      const cx = width / 2;
      const cy = height / 2;

      // Line 1 - KING PROPERTY AUCTION
      page.drawText(BRAND_NAME, {
        x: cx - mainLen / 2,
        y: cy + fontSize * 0.5,
        size: fontSize,
        color: rgb(0.45, 0.45, 0.45),
        opacity: 0.38,
        rotate: degrees(angle),
      });

      // Line 2 - kingpropertyauction.com - clearly below line 1 with gap
      page.drawText(BRAND_SITE, {
        x: cx - subLen / 2,
        y: cy - fontSize * 2.5,
        size: subFontSize,
        color: rgb(0.45, 0.45, 0.45),
        opacity: 0.32,
        rotate: degrees(angle),
      });
    }

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
  } catch (e) {
    console.warn('PDF watermark error:', e.message);
    fs.copyFileSync(inputPath, outputPath);
  }
};

// ============================================
// HELPERS
// ============================================
const isImage = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif',
          '.webp', '.bmp', '.tiff'].includes(ext);
};

const isPdf = (filename) => {
  return path.extname(filename).toLowerCase() === '.pdf';
};

const safeDelete = (filePath) => {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (e) {
    console.warn('Could not delete file:', filePath);
  }
};

// ============================================
// UPLOAD IMAGES (property images)
// ============================================
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
        const ext = path.extname(file.filename);
        const baseName = file.filename.replace(ext, '');
        const webpFilename = `${baseName}.webp`;
        const thumbFilename = `thumb_${baseName}.webp`;
        const webpPath = path.join(path.dirname(originalPath), webpFilename);
        const thumbPath = path.join(path.dirname(originalPath), thumbFilename);

        // Main image with watermark (full size)
        await addImageWatermark(
          originalPath,
          webpPath,
          80,
          { width: 1920, height: 1080, fit: 'inside' }
        );

        // Thumbnail with watermark
        await addImageWatermark(
          originalPath,
          thumbPath,
          65,
          {
            width: 400,
            height: 300,
            fit: 'cover',
            position: 'center',
          }
        );

        safeDelete(originalPath);

        fileUrls.push({
          fileName: webpFilename,
          fileUrl: `/uploads/properties/${webpFilename}`,
          thumbUrl: `/uploads/properties/${thumbFilename}`,
          fileSize: fs.existsSync(webpPath) ? fs.statSync(webpPath).size : 0,
          mimeType: 'image/webp',
        });

      } catch (err) {
        console.error('Image upload error:', err.message);
        // Fallback without watermark
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
      message: `${fileUrls.length} image(s) uploaded`,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Upload failed',
    });
  }
};

// ============================================
// UPLOAD VIDEO (no watermark)
// ============================================
export const uploadVideo = async (req, res) => {
  try {
    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No video uploaded',
      });
    }
    const data = files.map(file => ({
      fileName: file.filename,
      fileUrl: `/uploads/videos/${file.filename}`,
      fileSize: file.size,
    }));
    res.status(200).json({
      success: true,
      data,
      message: 'Video(s) uploaded successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// UPLOAD FLOOR PLAN (image or PDF)
// ============================================
export const uploadFloorPlan = async (req, res) => {
  try {
    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const data = [];

    for (const file of files) {
      try {
        const originalPath = file.path;
        const ext = path.extname(file.filename);
        const baseName = file.filename.replace(ext, '');

        if (isImage(file.filename)) {
          const webpFilename = `${baseName}.webp`;
          const webpPath = path.join(path.dirname(originalPath), webpFilename);
          await addImageWatermark(originalPath, webpPath, 85);
          safeDelete(originalPath);
          data.push({
            fileName: webpFilename,
            fileUrl: `/uploads/floorplans/${webpFilename}`,
          });

        } else if (isPdf(file.filename)) {
          const wmFilename = `wm_${file.filename}`;
          const wmPath = path.join(path.dirname(originalPath), wmFilename);
          await addPdfWatermark(originalPath, wmPath);
          safeDelete(originalPath);
          data.push({
            fileName: wmFilename,
            fileUrl: `/uploads/floorplans/${wmFilename}`,
          });

        } else {
          data.push({
            fileName: file.filename,
            fileUrl: `/uploads/floorplans/${file.filename}`,
          });
        }
      } catch (e) {
        console.warn('Floor plan watermark failed:', e.message);
        data.push({
          fileName: file.filename,
          fileUrl: `/uploads/floorplans/${file.filename}`,
        });
      }
    }

    res.status(200).json({
      success: true,
      data,
      message: 'Floor plan(s) uploaded successfully',
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// UPLOAD LEGAL DOCUMENTS (PDF or image)
// ============================================
export const uploadLegalDocs = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No documents uploaded',
      });
    }

    const fileUrls = [];

    for (const file of req.files) {
      try {
        const originalPath = file.path;
        const ext = path.extname(file.filename);
        const baseName = file.filename.replace(ext, '');

        if (isPdf(file.filename)) {
          const wmFilename = `wm_${file.filename}`;
          const wmPath = path.join(path.dirname(originalPath), wmFilename);
          await addPdfWatermark(originalPath, wmPath);
          safeDelete(originalPath);
          fileUrls.push({
            fileName: wmFilename,
            fileUrl: `/uploads/documents/${wmFilename}`,
          });

        } else if (isImage(file.filename)) {
          const webpFilename = `${baseName}.webp`;
          const webpPath = path.join(path.dirname(originalPath), webpFilename);
          await addImageWatermark(originalPath, webpPath, 85);
          safeDelete(originalPath);
          fileUrls.push({
            fileName: webpFilename,
            fileUrl: `/uploads/documents/${webpFilename}`,
          });

        } else {
          fileUrls.push({
            fileName: file.filename,
            fileUrl: `/uploads/documents/${file.filename}`,
          });
        }
      } catch (e) {
        console.warn('Legal doc watermark failed:', e.message);
        fileUrls.push({
          fileName: file.filename,
          fileUrl: `/uploads/documents/${file.filename}`,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: fileUrls,
      message: `${req.files.length} document(s) uploaded`,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Upload failed',
    });
  }
};

// ============================================
// UPLOAD PRIVATE DOCUMENTS (ID proof / legal pack)
// Stored in uploads/private-legal/ — NOT publicly exposed
// ============================================
export const uploadPrivateDocuments = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No documents uploaded',
      });
    }

    const { docType, customLabel } = req.body;

    const fileUrls = req.files.map(file => ({
      docType: docType || 'other',
      customLabel: customLabel || '',
      url: `/uploads/private-legal/${file.filename}`,
      originalName: file.originalname,
      uploadedAt: new Date(),
    }));

    res.status(200).json({
      success: true,
      data: fileUrls,
      message: `${req.files.length} document(s) uploaded`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Upload failed',
    });
  }
};

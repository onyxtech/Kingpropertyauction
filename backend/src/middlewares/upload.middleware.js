import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    if (file.fieldname === 'propertyImages') {
      uploadPath += 'properties/';
    } else if (file.fieldname === 'propertyVideo' || file.fieldname === 'propertyVideos') {
      uploadPath += 'videos/';
    } else if (file.fieldname === 'floorPlan' || file.fieldname === 'floorPlans') {
      uploadPath += 'floorplans/';
    } else if (file.fieldname === 'legalDocuments') {
      uploadPath += 'documents/';
    } else {
      uploadPath += 'others/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png|gif|webp/;
  const videoTypes = /mp4|mov|avi|webm/;
  const docTypes = /pdf|doc|docx/;
  
  const extname = path.extname(file.originalname).toLowerCase();
  
  if (file.fieldname === 'propertyImages') {
    if (imageTypes.test(extname)) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed for property images'), false);
    }
  } else if (file.fieldname === 'propertyVideo' || file.fieldname === 'propertyVideos') {
    if (videoTypes.test(extname)) {
      cb(null, true);
    } else {
      cb(new Error('Only videos are allowed'), false);
    }
  } else if (file.fieldname === 'floorPlan' || file.fieldname === 'floorPlans' || file.fieldname === 'legalDocuments') {
    if (imageTypes.test(extname) || docTypes.test(extname)) {
      cb(null, true);
    } else {
      cb(new Error('Only images or PDFs are allowed'), false);
    }
  } else {
    cb(null, true);
  }
};

// Upload configurations
export const uploadPropertyImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per image
}).array('propertyImages', 20);

export const uploadPropertyVideo = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
}).single('propertyVideo');

export const uploadPropertyVideos = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
}).array('propertyVideos', 5);

export const uploadFloorPlan = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single('floorPlan');

export const uploadFloorPlans = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).array('floorPlans', 5);

export const uploadLegalDocs = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).array('legalDocuments', 10);

export const uploadSingleImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const imageTypes = /jpeg|jpg|png|gif|webp/;
    const extname = path.extname(file.originalname).toLowerCase();
    if (imageTypes.test(extname)) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('image');
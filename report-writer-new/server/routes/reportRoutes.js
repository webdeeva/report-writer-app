import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getReportsList, 
  getReportDetails, 
  generateAnalysis, 
  generateRelationshipReport, 
  generateYearlyReport, 
  generateLifeReport,
  generateFinancialReport,
  generateSinglesReport,
  generateChildrensLifeReport,
  downloadReport,
  deleteExistingReport,
  getUsageStats
} from '../controllers/reportController.js';

const router = express.Router();

// Download report PDF (public route)
router.get('/download/:filename', downloadReport);

// All other routes require authentication

// Get report usage statistics
router.get('/usage', protect, getUsageStats);

// Get all reports
router.get('/', protect, getReportsList);

// Get single report
router.get('/:id', protect, getReportDetails);

// Generate analysis (text only)
router.post('/analysis', protect, generateAnalysis);

// Generate relationship report (PDF)
router.post('/relationship', protect, generateRelationshipReport);

// Generate yearly report (PDF)
router.post('/yearly', protect, generateYearlyReport);

// Generate life report (PDF)
router.post('/life', protect, generateLifeReport);

// Generate financial report (PDF)
router.post('/financial', protect, generateFinancialReport);

// Generate singles report (PDF)
router.post('/singles', protect, generateSinglesReport);

// Generate children's life report (PDF)
router.post('/childrens-life', protect, generateChildrensLifeReport);

// Delete report
router.delete('/:id', protect, deleteExistingReport);

export default router;

/**
 * Reports Routes
 * 
 * This module handles all report-related endpoints including generation,
 * retrieval, deletion, and downloading of reports.
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/authMiddleware.js';
import * as reportService from '../services/reportService.js';
import { calculateBirthCards } from '../services/cardService.js';
import { generateReport as generateAIReport } from '../services/openRouterService.js';
import * as pdfService from '../services/pdfService.js';
import multer from 'multer';
import csv from 'csv-parse';
import { parseDate } from '../utils/dateUtils.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Get the directory name (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Promisify fs methods
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

// Async wrapper for timeout handling
const withTimeout = (promise, timeoutMs = 110000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    )
  ]);
};

// Generate yearly report
router.post('/yearly', protect, asyncHandler(async (req, res) => {
  const { personId, age } = req.body;
  
  if (!personId || age === undefined) {
    res.status(400);
    throw new Error('Person ID and age are required');
  }

  try {
    // Start report generation with timeout
    const report = await withTimeout(
      reportService.generateYearlyReport(req.user.id, personId, age),
      110000 // 110 seconds timeout (before DigitalOcean's 120s timeout)
    );
    
    res.status(201).json(report);
  } catch (error) {
    if (error.message === 'Operation timed out') {
      res.status(504).json({ 
        message: 'Report generation is taking longer than expected. Please try again in a few minutes.' 
      });
    } else {
      throw error;
    }
  }
}));

// Generate life report
router.post('/life', protect, asyncHandler(async (req, res) => {
  const { personId } = req.body;
  
  if (!personId) {
    res.status(400);
    throw new Error('Person ID is required');
  }

  try {
    // Start report generation with timeout
    const report = await withTimeout(
      reportService.generateLifeReport(req.user.id, personId),
      110000 // 110 seconds timeout (before DigitalOcean's 120s timeout)
    );
    
    res.status(201).json(report);
  } catch (error) {
    if (error.message === 'Operation timed out') {
      res.status(504).json({ 
        message: 'Report generation is taking longer than expected. Please try again in a few minutes.' 
      });
    } else {
      throw error;
    }
  }
}));

// Generate relationship report
router.post('/relationship', protect, asyncHandler(async (req, res) => {
  const { person1Id, person2Id } = req.body;
  
  if (!person1Id || !person2Id) {
    res.status(400);
    throw new Error('Both person IDs are required');
  }

  try {
    // Start report generation with timeout
    const report = await withTimeout(
      reportService.generateRelationshipReport(req.user.id, person1Id, person2Id),
      110000 // 110 seconds timeout (before DigitalOcean's 120s timeout)
    );
    
    res.status(201).json(report);
  } catch (error) {
    if (error.message === 'Operation timed out') {
      res.status(504).json({ 
        message: 'Report generation is taking longer than expected. Please try again in a few minutes.' 
      });
    } else {
      throw error;
    }
  }
}));

// Generate financial report
router.post('/financial', protect, asyncHandler(async (req, res) => {
  const { personId, age } = req.body;
  
  if (!personId || age === undefined) {
    res.status(400);
    throw new Error('Person ID and age are required');
  }

  try {
    // Start report generation with timeout
    const report = await withTimeout(
      reportService.generateFinancialReport(req.user.id, personId, age),
      110000 // 110 seconds timeout (before DigitalOcean's 120s timeout)
    );
    
    res.status(201).json(report);
  } catch (error) {
    if (error.message === 'Operation timed out') {
      res.status(504).json({ 
        message: 'Report generation is taking longer than expected. Please try again in a few minutes.' 
      });
    } else {
      throw error;
    }
  }
}));

// Generate singles report
router.post('/singles', protect, asyncHandler(async (req, res) => {
  const { personId, age } = req.body;
  
  if (!personId || age === undefined) {
    res.status(400);
    throw new Error('Person ID and age are required');
  }

  try {
    // Start report generation with timeout
    const report = await withTimeout(
      reportService.generateSinglesReport(req.user.id, personId, age),
      110000 // 110 seconds timeout (before DigitalOcean's 120s timeout)
    );
    
    res.status(201).json(report);
  } catch (error) {
    if (error.message === 'Operation timed out') {
      res.status(504).json({ 
        message: 'Report generation is taking longer than expected. Please try again in a few minutes.' 
      });
    } else {
      throw error;
    }
  }
}));

// Generate children's life report
router.post('/childrens-life', protect, asyncHandler(async (req, res) => {
  const { personId } = req.body;
  
  if (!personId) {
    res.status(400);
    throw new Error('Person ID is required');
  }

  try {
    // Start report generation with timeout
    const report = await withTimeout(
      reportService.generateChildrensLifeReport(req.user.id, personId),
      110000 // 110 seconds timeout (before DigitalOcean's 120s timeout)
    );
    
    res.status(201).json(report);
  } catch (error) {
    if (error.message === 'Operation timed out') {
      res.status(504).json({ 
        message: 'Report generation is taking longer than expected. Please try again in a few minutes.' 
      });
    } else {
      throw error;
    }
  }
}));

// Generate yearly report debug
router.post('/yearly-debug', protect, asyncHandler(async (req, res) => {
  const { personId, age } = req.body;
  
  if (!personId || age === undefined) {
    res.status(400);
    throw new Error('Person ID and age are required');
  }

  // Generate debug report
  const debugReport = await reportService.generateYearlyReportDebug(req.user.id, personId, age);
  
  res.status(201).json(debugReport);
}));

// Upload CSV reports
router.post('/upload-csv', protect, upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const results = [];
  const errors = [];

  try {
    // Read the CSV file
    const fileContent = await readFile(req.file.path, 'utf-8');
    
    // Parse CSV
    const parser = csv.parse({
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const records = [];
    
    parser.on('data', (row) => {
      records.push(row);
    });

    parser.on('error', (err) => {
      throw new Error(`CSV parsing error: ${err.message}`);
    });

    parser.write(fileContent);
    parser.end();

    await new Promise((resolve) => {
      parser.on('end', resolve);
    });

    // Process each record
    for (const row of records) {
      try {
        const { name, birthdate, reportType, age } = row;
        
        if (!name || !birthdate || !reportType) {
          errors.push({
            row,
            error: 'Missing required fields: name, birthdate, or reportType'
          });
          continue;
        }

        // Create or find person
        let person = await req.db.models.Person.findOne({
          userId: req.user.id,
          name: name.trim()
        });

        if (!person) {
          // Parse the birthdate
          const parsedDate = parseDate(birthdate.trim());
          if (!parsedDate) {
            errors.push({
              row,
              error: `Invalid birthdate format: ${birthdate}`
            });
            continue;
          }

          person = await req.db.models.Person.create({
            userId: req.user.id,
            name: name.trim(),
            birthdate: parsedDate.toISOString().split('T')[0]
          });
        }

        // Generate report based on type
        let report;
        switch (reportType.toLowerCase()) {
          case 'yearly':
            if (!age) {
              errors.push({
                row,
                error: 'Age is required for yearly reports'
              });
              continue;
            }
            report = await reportService.generateYearlyReport(req.user.id, person.id, parseInt(age));
            break;
          case 'life':
            report = await reportService.generateLifeReport(req.user.id, person.id);
            break;
          case 'financial':
            if (!age) {
              errors.push({
                row,
                error: 'Age is required for financial reports'
              });
              continue;
            }
            report = await reportService.generateFinancialReport(req.user.id, person.id, parseInt(age));
            break;
          case 'singles':
            if (!age) {
              errors.push({
                row,
                error: 'Age is required for singles reports'
              });
              continue;
            }
            report = await reportService.generateSinglesReport(req.user.id, person.id, parseInt(age));
            break;
          case 'childrens':
            report = await reportService.generateChildrensLifeReport(req.user.id, person.id);
            break;
          default:
            errors.push({
              row,
              error: `Unknown report type: ${reportType}`
            });
            continue;
        }

        results.push({
          name: person.name,
          reportType,
          reportId: report.id,
          status: 'success'
        });

      } catch (error) {
        errors.push({
          row,
          error: error.message
        });
      }
    }

    // Clean up uploaded file
    await unlink(req.file.path);

    res.json({
      success: true,
      results,
      errors,
      summary: {
        total: records.length,
        successful: results.length,
        failed: errors.length
      }
    });

  } catch (error) {
    // Clean up uploaded file on error
    if (req.file && req.file.path) {
      await unlink(req.file.path).catch(() => {});
    }
    throw error;
  }
}));

// Get all reports for the authenticated user
router.get('/', protect, asyncHandler(async (req, res) => {
  const reports = await reportService.getUserReports(req.user.id);
  res.json(reports);
}));

// Get a specific report
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const report = await reportService.getReport(req.user.id, req.params.id);
  
  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }
  
  res.json(report);
}));

// Delete a report
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const success = await reportService.deleteReport(req.user.id, req.params.id);
  
  if (!success) {
    res.status(404);
    throw new Error('Report not found or could not be deleted');
  }
  
  res.json({ message: 'Report deleted successfully' });
}));

// Download a report
router.get('/:id/download', protect, asyncHandler(async (req, res) => {
  const report = await reportService.getReport(req.user.id, req.params.id);
  
  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }
  
  if (!report.pdfPath) {
    res.status(404);
    throw new Error('PDF file not found for this report');
  }
  
  // Construct the full path to the PDF
  const pdfPath = path.join(__dirname, '..', report.pdfPath);
  
  // Check if file exists
  if (!fs.existsSync(pdfPath)) {
    res.status(404);
    throw new Error('PDF file not found on server');
  }
  
  // Set headers for file download
  const fileName = path.basename(report.pdfPath);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  
  // Stream the file
  const fileStream = fs.createReadStream(pdfPath);
  fileStream.pipe(res);
}));

export default router;
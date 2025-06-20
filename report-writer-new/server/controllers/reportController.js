import asyncHandler from 'express-async-handler';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  getReports, 
  getReportById, 
  createReport, 
  updateReport, 
  deleteReport,
  getReportUsage
} from '../models/index.js';
import { getPersonById } from '../models/peopleModel.js';
import { calculateAge } from '../utils/dateUtils.js';
import { 
  generateYearlyReport as generateYearlyPdf,
  generateLifeReport as generateLifePdf,
  generateRelationshipReport as generateRelationshipPdf,
  generateFinancialReport as generateFinancialPdf,
  generateSinglesReport as generateSinglesPdf,
  generateChildrensLifeReport as generateChildrensLifePdf
} from '../services/pdfService.js';
import {
  generateYearlyReportData,
  generateLifeReportData,
  generateRelationshipReportData,
  generateYearlyReportDebugInfo
} from '../services/reportGenerationService.js';
import { 
  generateYearlyReportContent,
  generateLifeReportContent,
  generateRelationshipReportContent,
  generateFinancialReportContent,
  generateSinglesReportContent,
  generateChildrensLifeReportContent
} from '../services/aiService.js';
import { mapCardsToNaturalPositions } from '../services/reportGeneration/positionMappingService.js';
import { getDefaultPrompt } from '../services/promptService.js';

// Get the directory name (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Output directory for PDF files
const outputDir = process.env.PDF_OUTPUT_DIR || path.join(__dirname, '../output');
console.log('Output directory:', outputDir);

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * @desc    Get all reports for the authenticated user
 * @route   GET /api/reports
 * @access  Private
 */
const getReportsList = asyncHandler(async (req, res) => {
  const reports = await getReports(req.user.id);
  res.json(reports);
});

/**
 * @desc    Get a single report by ID
 * @route   GET /api/reports/:id
 * @access  Private
 */
const getReportDetails = asyncHandler(async (req, res) => {
  const reportId = parseInt(req.params.id);
  const report = await getReportById(reportId);

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  // Check if the report belongs to the authenticated user
  if (report.userId !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to access this report');
  }

  res.json(report);
});

/**
 * @desc    Generate analysis (text only)
 * @route   POST /api/reports/analysis
 * @access  Private
 */
const generateAnalysis = asyncHandler(async (req, res) => {
  const { reportType } = req.body;

  if (!reportType) {
    res.status(400);
    throw new Error('Please provide a report type');
  }

  // Check if user has reached their report limit
  const usage = await getReportUsage(req.user.id);
  if (!usage.canGenerate) {
    res.status(403);
    throw new Error(`You have reached your report limit of ${usage.reportLimit}`);
  }

  try {
    // Get the default prompt for the report type
    const prompt = getDefaultPrompt(reportType);
    
    // Call OpenRouter API to generate analysis
    // This is a placeholder - actual implementation will depend on the OpenRouter API
    const analysis = "This is a placeholder for the generated analysis. In the actual implementation, this would be the result from the OpenRouter API.";
    
    // Mock token usage and cost for now
    const tokens = 1500;
    const cost = 0.03;

    res.json({
      analysis,
      tokens,
      cost
    });
  } catch (error) {
    console.error('Analysis generation error:', error);
    res.status(500);
    throw new Error('Failed to generate analysis');
  }
});

/**
 * @desc    Generate relationship report (PDF)
 * @route   POST /api/reports/relationship
 * @access  Private
 */
const generateRelationshipReport = asyncHandler(async (req, res) => {
  const { 
    person1Id, 
    person2Id,
    userSettings
  } = req.body;

  if (!person1Id || !person2Id) {
    res.status(400);
    throw new Error('Please provide person1Id and person2Id');
  }

  // Check if user has reached their report limit
  const usage = await getReportUsage(req.user.id);
  if (!usage.canGenerate) {
    res.status(403);
    throw new Error(`You have reached your report limit of ${usage.reportLimit}`);
  }

  try {
    // Get person details
    const person1 = await getPersonById(person1Id);
    const person2 = await getPersonById(person2Id);

    if (!person1 || !person2) {
      res.status(404);
      throw new Error('One or both people not found');
    }

    // Check if the people belong to the authenticated user
    if (person1.userId !== req.user.id || person2.userId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to access these people');
    }

    // Generate report data using the report generation service
    console.log(`Generating relationship report data for ${person1.name} and ${person2.name}`);
    let reportData;
    try {
      reportData = await generateRelationshipReportData(person1, person2);
      console.log('Successfully generated relationship report data');
    } catch (dataError) {
      console.error('Error generating relationship report data:', dataError);
      console.error('Error details:', JSON.stringify({
        message: dataError.message,
        stack: dataError.stack,
        person1: { id: person1.id, name: person1.name, birthdate: person1.birthdate },
        person2: { id: person2.id, name: person2.name, birthdate: person2.birthdate }
      }));
      throw new Error(`Failed to generate relationship report data: ${dataError.message}`);
    }
    
    // Generate analysis using the AI service
    console.log('Generating relationship report content');
    let analysisResult;
    try {
      analysisResult = await generateRelationshipReportContent(reportData);
      console.log('Successfully generated relationship report content');
    } catch (contentError) {
      console.error('Error generating relationship report content:', contentError);
      throw new Error(`Failed to generate relationship report content: ${contentError.message}`);
    }
    
    const { content: analysis, tokensUsed: tokens, cost } = analysisResult;
    
    // Add the analysis to the report data
    reportData.content = analysis;
    
    // Generate a unique filename
    const timestamp = Date.now();
    const fileName = `${person1.name.replace(/\s+/g, '_')}_${person2.name.replace(/\s+/g, '_')}_Relationship_Report_${timestamp}.pdf`;
    
    // Generate the PDF with the same filename (without extension)
    const fileNameWithoutExt = `${person1.name.replace(/\s+/g, '_')}_${person2.name.replace(/\s+/g, '_')}_Relationship_Report_${timestamp}`;
    
    // Add userSettings to reportData for custom logo and footer
    if (userSettings) {
      reportData.userSettings = userSettings;
    } else {
      // Fallback to userId if userSettings not provided
      reportData.userId = req.user.id;
    }
    
    console.log('Generating relationship PDF');
    let filePath;
    try {
      filePath = await generateRelationshipPdf(reportData, fileNameWithoutExt);
      console.log('Successfully generated relationship PDF:', filePath);
    } catch (pdfError) {
      console.error('Error generating relationship PDF:', pdfError);
      throw new Error(`Failed to generate relationship PDF: ${pdfError.message}`);
    }

    // Create report record in database
    console.log('Creating report record in database');
    const report = await createReport({
      type: 'relationship',
      person1Id,
      person2Id,
      content: analysis,
      pdfUrl: `/api/reports/download/${fileName}`,
      tokensUsed: tokens || 0,
      cost: cost || 0,
      userId: req.user.id
    });

    res.json({
      report,
      pdfUrl: `/api/reports/download/${fileName}`
    });
  } catch (error) {
    console.error('Relationship report generation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500);
    throw new Error(`Failed to generate relationship report: ${error.message}`);
  }
});

/**
 * @desc    Generate yearly report (PDF)
 * @route   POST /api/reports/yearly
 * @access  Private
 */
const generateYearlyReport = asyncHandler(async (req, res) => {
  const { 
    personId, 
    customAge,
    originalDateFormat,
    userSettings
  } = req.body;

  if (!personId) {
    res.status(400);
    throw new Error('Please provide personId');
  }

  // Check if user has reached their report limit
  const usage = await getReportUsage(req.user.id);
  if (!usage.canGenerate) {
    res.status(403);
    throw new Error(`You have reached your report limit of ${usage.reportLimit}`);
  }

  try {
    // Get person details
    const person = await getPersonById(personId);

    if (!person) {
      res.status(404);
      throw new Error('Person not found');
    }

    // Check if the person belongs to the authenticated user
    if (person.userId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to access this person');
    }

    // Add originalDateFormat to person object if provided
    if (originalDateFormat) {
      person.originalDateFormat = originalDateFormat;
    }

    // Calculate age or use custom age if provided
    const calculatedAge = calculateAge(person.birthdate);
    const age = customAge !== undefined ? customAge : calculatedAge;

    // Generate report data using the report generation service
    const reportData = await generateYearlyReportData(person, customAge !== undefined ? customAge : null);
    
    // Generate analysis using the AI service
    const { content: analysis, tokensUsed: tokens, cost } = await generateYearlyReportContent(reportData);
    
    // Add the analysis to the report data
    reportData.content = analysis;
    
    // Generate a unique filename
    const timestamp = Date.now();
    const fileName = `${person.name.replace(/\s+/g, '_')}_Age${age}_Yearly_Report_${timestamp}.pdf`;
    
    // Generate the PDF with the same filename (without extension)
    const fileNameWithoutExt = `${person.name.replace(/\s+/g, '_')}_Age${age}_Yearly_Report_${timestamp}`;
    
    // Add userSettings to reportData for custom logo and footer
    if (userSettings) {
      reportData.userSettings = userSettings;
    } else {
      // Fallback to userId if userSettings not provided
      reportData.userId = req.user.id;
    }
    
    const filePath = await generateYearlyPdf(reportData, fileNameWithoutExt);

    // Create report record in database
    const report = await createReport({
      type: 'yearly',
      person1Id: personId,
      customAge: customAge !== undefined ? customAge : null,
      content: analysis,
      pdfUrl: `/api/reports/download/${fileName}`,
      tokensUsed: tokens || 0,
      cost: cost || 0,
      userId: req.user.id
    });

    res.json({
      report,
      pdfUrl: `/api/reports/download/${fileName}`
    });
  } catch (error) {
    console.error('Yearly report generation error:', error);
    res.status(500);
    throw new Error('Failed to generate yearly report');
  }
});

/**
 * @desc    Generate life report (PDF)
 * @route   POST /api/reports/life
 * @access  Private
 */
const generateLifeReport = asyncHandler(async (req, res) => {
  const { 
    personId,
    originalDateFormat,
    userSettings
  } = req.body;

  if (!personId) {
    res.status(400);
    throw new Error('Please provide personId');
  }
  
  console.log('Life report request received:', {
    personId: personId,
    userId: req.user.id,
    hasUserSettings: !!userSettings,
    timestamp: new Date().toISOString()
  });

  // Check if user has reached their report limit
  const usage = await getReportUsage(req.user.id);
  if (!usage.canGenerate) {
    res.status(403);
    throw new Error(`You have reached your report limit of ${usage.reportLimit}`);
  }

  try {
    console.log('Starting life report generation for personId:', personId);
    
    // Get person details
    const person = await getPersonById(personId);

    if (!person) {
      res.status(404);
      throw new Error('Person not found');
    }

    // Check if the person belongs to the authenticated user
    if (person.userId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to access this person');
    }

    // Add originalDateFormat to person object if provided
    if (originalDateFormat) {
      person.originalDateFormat = originalDateFormat;
    }

    // Generate report data using the report generation service
    const reportData = await generateLifeReportData(person);
    
    // Generate analysis using the AI service
    console.log('Generating AI content...');
    const { content: analysis, tokensUsed: tokens, cost } = await generateLifeReportContent(reportData);
    console.log('AI content generated, tokens used:', tokens);
    
    // Add the analysis to the report data
    reportData.content = analysis;
    
    // Generate a unique filename
    const timestamp = Date.now();
    const fileName = `${person.name.replace(/\s+/g, '_')}_Life_Report_${timestamp}.pdf`;
    
    // Generate the PDF with the same filename (without extension)
    const fileNameWithoutExt = `${person.name.replace(/\s+/g, '_')}_Life_Report_${timestamp}`;
    
    // Add userSettings to reportData for custom logo and footer
    if (userSettings) {
      reportData.userSettings = userSettings;
    } else {
      // Fallback to userId if userSettings not provided
      reportData.userId = req.user.id;
    }
    
    console.log('Calling generateLifePdf with filename:', fileNameWithoutExt);
    
    // Generate PDF and get the external URL if available
    const result = await generateLifePdf(reportData, fileNameWithoutExt);
    
    console.log('PDF generation result:', result);
    
    // Check if we got an external URL (from WeasyPrint API)
    let pdfUrl = `/api/reports/download/${fileName}`;
    let externalPdfUrl = null;
    
    // Try to read the JSON file with external URL info
    try {
      const jsonPath = path.join(outputDir, `${fileNameWithoutExt}.json`);
      if (fs.existsSync(jsonPath)) {
        const pdfInfo = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        externalPdfUrl = pdfInfo.externalUrl;
        console.log('Found external PDF URL:', externalPdfUrl);
      }
    } catch (error) {
      console.log('No external PDF info found:', error.message);
    }

    // Create report record in database
    const report = await createReport({
      type: 'life',
      person1Id: personId,
      content: analysis,
      pdfUrl: pdfUrl,
      externalPdfUrl: externalPdfUrl, // Store external URL if available
      tokensUsed: tokens || 0,
      cost: cost || 0,
      userId: req.user.id
    });

    res.json({
      report,
      pdfUrl: pdfUrl,
      externalPdfUrl: externalPdfUrl
    });
  } catch (error) {
    console.error('Life report generation error:', error);
    res.status(500);
    throw new Error('Failed to generate life report');
  }
});

/**
 * @desc    Download a report PDF
 * @route   GET /api/reports/download/:filename
 * @access  Private
 */
const downloadReport = asyncHandler(async (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(outputDir, fileName);

  console.log('Attempting to download file:', filePath);
  console.log('File exists check:', fs.existsSync(filePath));
  
  // In production on DigitalOcean, check database for external URL
  if (process.env.NODE_ENV === 'production') {
    try {
      // Try to find the report in database by filename pattern
      const reports = await Report.find({
        pdfUrl: { $regex: fileName }
      }).sort({ createdAt: -1 }).limit(1);
      
      if (reports.length > 0 && reports[0].externalPdfUrl) {
        console.log('Found external PDF URL in database:', reports[0].externalPdfUrl);
        const downloadUrl = reports[0].externalPdfUrl.includes('?') 
          ? `${reports[0].externalPdfUrl}&download=true`
          : `${reports[0].externalPdfUrl}?download=true`;
        
        return res.redirect(downloadUrl);
      }
    } catch (error) {
      console.error('Error checking database for external URL:', error);
    }
  }
  
  // First check if there's a JSON file with external PDF info
  const fileNameWithoutExt = fileName.replace('.pdf', '');
  const jsonPath = path.join(outputDir, `${fileNameWithoutExt}.json`);
  
  if (fs.existsSync(jsonPath)) {
    try {
      const pdfInfo = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      console.log('Found external PDF info:', pdfInfo);
      
      // Redirect to external PDF URL with download parameter
      const downloadUrl = pdfInfo.externalUrl.includes('?') 
        ? `${pdfInfo.externalUrl}&download=true`
        : `${pdfInfo.externalUrl}?download=true`;
      
      return res.redirect(downloadUrl);
    } catch (error) {
      console.error('Error reading PDF info:', error);
    }
  }
  
  // List files in output directory to debug
  console.log('Files in output directory:');
  const files = fs.readdirSync(outputDir);
  files.forEach(file => {
    console.log(file);
  });

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    
    // Try to find a similar file by matching the base name without the timestamp
    const baseNameParts = fileName.split('_');
    const timestampPart = baseNameParts.pop(); // Remove the timestamp part
    const baseName = baseNameParts.join('_');
    
    console.log(`Looking for files matching base name: ${baseName}`);
    
    // Find files that match the base name pattern
    const matchingFiles = files.filter(file => 
      file.startsWith(baseName) && file.endsWith(path.extname(fileName))
    );
    
    if (matchingFiles.length > 0) {
      // Sort by creation time (newest first) and use the first match
      const sortedFiles = matchingFiles.sort((a, b) => {
        const statsA = fs.statSync(path.join(outputDir, a));
        const statsB = fs.statSync(path.join(outputDir, b));
        return statsB.birthtimeMs - statsA.birthtimeMs;
      });
      
      const closestMatch = sortedFiles[0];
      console.log(`Found closest match: ${closestMatch}`);
      
      // Use the closest match instead
      const newFilePath = path.join(outputDir, closestMatch);
      if (fs.existsSync(newFilePath)) {
        console.log(`Using alternative file: ${newFilePath}`);
        return res.redirect(`/api/reports/download/${closestMatch}`);
      }
    }
    
    res.status(404);
    throw new Error('Report file not found');
  }

  try {
    // Check if it's an HTML file masquerading as PDF in production
    if (process.env.NODE_ENV === 'production' && fileName.endsWith('.pdf')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.startsWith('<!DOCTYPE html>')) {
        console.log('Serving HTML report as web page');
        res.setHeader('Content-Type', 'text/html');
        res.send(content);
        return;
      }
    }
    
    // Determine content type based on file extension
    const ext = path.extname(fileName).toLowerCase();
    const contentType = ext === '.pdf' ? 'application/pdf' : 
                        ext === '.html' ? 'text/html' : 
                        'application/octet-stream';
    
    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Create a read stream and pipe it to the response
    const fileStream = fs.createReadStream(filePath);
    
    // Handle errors in the stream before piping
    fileStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error streaming file' });
      }
    });
    
    // Pipe the file to the response
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading report:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error downloading report' });
    }
  }
});

/**
 * @desc    Delete a report
 * @route   DELETE /api/reports/:id
 * @access  Private
 */
const deleteExistingReport = asyncHandler(async (req, res) => {
  const reportId = parseInt(req.params.id);
  
  // Get report to check ownership and get file path
  const report = await getReportById(reportId);
  
  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }
  
  // Check if the report belongs to the authenticated user
  if (report.userId !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to delete this report');
  }
  
  // Delete report from database
  const deleted = await deleteReport(reportId, req.user.id);
  
  if (!deleted) {
    res.status(500);
    throw new Error('Failed to delete report');
  }
  
  // Try to delete the PDF file if it exists
  if (report.pdfUrl) {
    const fileName = report.pdfUrl.split('/').pop();
    const filePath = path.join(outputDir, fileName);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  
  res.json({ message: 'Report deleted successfully' });
});

/**
 * @desc    Generate financial report (PDF)
 * @route   POST /api/reports/financial
 * @access  Private
 */
const generateFinancialReport = asyncHandler(async (req, res) => {
  const { 
    personId, 
    customAge,
    originalDateFormat,
    userSettings
  } = req.body;

  if (!personId) {
    res.status(400);
    throw new Error('Please provide personId');
  }

  // Check if user has reached their report limit
  const usage = await getReportUsage(req.user.id);
  if (!usage.canGenerate) {
    res.status(403);
    throw new Error(`You have reached your report limit of ${usage.reportLimit}`);
  }

  try {
    // Get person details
    const person = await getPersonById(personId);

    if (!person) {
      res.status(404);
      throw new Error('Person not found');
    }

    // Check if the person belongs to the authenticated user
    if (person.userId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to access this person');
    }

    // Add originalDateFormat to person object if provided
    if (originalDateFormat) {
      person.originalDateFormat = originalDateFormat;
    }

    // Calculate age or use custom age if provided
    const calculatedAge = calculateAge(person.birthdate);
    const age = customAge !== undefined ? customAge : calculatedAge;

    // Generate report data using the report generation service
    // This uses the yearly report data but will enhance it with financial position mappings
    const reportData = await generateYearlyReportData(person, customAge !== undefined ? customAge : null);
    
    // Enhance with position mappings for financial insights
    const enhancedSpread = await mapCardsToNaturalPositions(reportData.spread_with_positions.map(item => item.card));
    reportData.financial_spread = enhancedSpread;
    
    // Generate analysis using the AI service with financial prompts
    const { content: analysis, tokensUsed: tokens, cost } = await generateFinancialReportContent(reportData);
    
    // Add the analysis to the report data
    reportData.content = analysis;
    
    // Generate a unique filename
    const timestamp = Date.now();
    const fileName = `${person.name.replace(/\s+/g, '_')}_Age${age}_Financial_Report_${timestamp}.pdf`;
    
    // Generate the PDF with the same filename (without extension)
    const fileNameWithoutExt = `${person.name.replace(/\s+/g, '_')}_Age${age}_Financial_Report_${timestamp}`;
    
    // Add userSettings to reportData for custom logo and footer
    if (userSettings) {
      reportData.userSettings = userSettings;
    } else {
      // Fallback to userId if userSettings not provided
      reportData.userId = req.user.id;
    }
    
    // Create a financial PDF using a modified version of the yearly template
    const filePath = await generateFinancialPdf(reportData, fileNameWithoutExt);

    // Create report record in database
    const report = await createReport({
      type: 'financial',
      person1Id: personId,
      customAge: customAge !== undefined ? customAge : null,
      content: analysis,
      pdfUrl: `/api/reports/download/${fileName}`,
      tokensUsed: tokens || 0,
      cost: cost || 0,
      userId: req.user.id
    });

    res.json({
      report,
      pdfUrl: `/api/reports/download/${fileName}`
    });
  } catch (error) {
    console.error('Financial report generation error:', error);
    res.status(500);
    throw new Error('Failed to generate financial report');
  }
});

/**
 * @desc    Get report usage statistics
 * @route   GET /api/reports/usage
 * @access  Private
 */
const getUsageStats = asyncHandler(async (req, res) => {
  const usage = await getReportUsage(req.user.id);
  res.json(usage);
});

/**
 * @desc    Generate singles report (PDF)
 * @route   POST /api/reports/singles
 * @access  Private
 */
const generateSinglesReport = asyncHandler(async (req, res) => {
  const { 
    personId, 
    customAge,
    originalDateFormat,
    userSettings
  } = req.body;

  if (!personId) {
    res.status(400);
    throw new Error('Please provide personId');
  }

  // Check if user has reached their report limit
  const usage = await getReportUsage(req.user.id);
  if (!usage.canGenerate) {
    res.status(403);
    throw new Error(`You have reached your report limit of ${usage.reportLimit}`);
  }

  try {
    // Get person details
    const person = await getPersonById(personId);

    if (!person) {
      res.status(404);
      throw new Error('Person not found');
    }

    // Check if the person belongs to the authenticated user
    if (person.userId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to access this person');
    }

    // Add originalDateFormat to person object if provided
    if (originalDateFormat) {
      person.originalDateFormat = originalDateFormat;
    }

    // Calculate age or use custom age if provided
    const calculatedAge = calculateAge(person.birthdate);
    const age = customAge !== undefined ? customAge : calculatedAge;

    // Generate report data using the report generation service
    // This uses the yearly report data but will enhance it for singles insights
    const reportData = await generateYearlyReportData(person, customAge !== undefined ? customAge : null);
    
    // Generate analysis using the AI service with singles prompts
    const { content: analysis, tokensUsed: tokens, cost } = await generateSinglesReportContent(reportData);
    
    // Add the analysis to the report data
    reportData.content = analysis;
    
    // Generate a unique filename
    const timestamp = Date.now();
    const fileName = `${person.name.replace(/\s+/g, '_')}_Age${age}_Singles_Report_${timestamp}.pdf`;
    
    // Generate the PDF with the same filename (without extension)
    const fileNameWithoutExt = `${person.name.replace(/\s+/g, '_')}_Age${age}_Singles_Report_${timestamp}`;
    
    // Add userSettings to reportData for custom logo and footer
    if (userSettings) {
      reportData.userSettings = userSettings;
    } else {
      // Fallback to userId if userSettings not provided
      reportData.userId = req.user.id;
    }
    
    // Create a singles PDF using a modified version of the yearly template
    const filePath = await generateSinglesPdf(reportData, fileNameWithoutExt);

    // Create report record in database
    const report = await createReport({
      type: 'singles',
      person1Id: personId,
      customAge: customAge !== undefined ? customAge : null,
      content: analysis,
      pdfUrl: `/api/reports/download/${fileName}`,
      tokensUsed: tokens || 0,
      cost: cost || 0,
      userId: req.user.id
    });

    res.json({
      report,
      pdfUrl: `/api/reports/download/${fileName}`
    });
  } catch (error) {
    console.error('Singles report generation error:', error);
    res.status(500);
    throw new Error('Failed to generate singles report');
  }
});

/**
 * @desc    Generate yearly report debug (HTML and PDF)
 * @route   POST /api/reports/yearly/debug
 * @access  Private (Admin only)
 */
const generateYearlyReportDebug = asyncHandler(async (req, res) => {
  const { 
    personId, 
    customAge,
    originalDateFormat,
    birthdate
  } = req.body;

  // Check if the user is an admin
  if (!req.user.isAdmin) {
    res.status(403);
    throw new Error('Admin access required for debug reports');
  }

  try {
    let person;
    
    // If personId is provided, get person details from database
    if (personId) {
      person = await getPersonById(personId);

      if (!person) {
        res.status(404);
        throw new Error('Person not found');
      }
    } 
    // Otherwise, use the provided birthdate to create a temporary person object
    else if (birthdate) {
      person = {
        name: req.body.name || 'Debug User',
        birthdate: birthdate,
        originalDateFormat: originalDateFormat
      };
    } else {
      res.status(400);
      throw new Error('Please provide either personId or birthdate');
    }

    // Calculate age or use custom age if provided
    const calculatedAge = calculateAge(person.birthdate);
    const age = customAge !== undefined ? customAge : calculatedAge;

    // Generate debug information
    const debugInfo = await generateYearlyReportDebugInfo(person, customAge !== undefined ? customAge : null);
    
    // Generate a unique filename
    const timestamp = Date.now();
    const fileNameWithoutExt = `${person.name.replace(/\s+/g, '_')}_Age${age}_Yearly_Report_Debug_${timestamp}`;
    
    // Add userId to debugInfo for custom logo and footer
    debugInfo.userId = req.user.id;
    
    // Generate the PDF
    const filePath = await generateYearlyReportDebug(debugInfo, fileNameWithoutExt);

    // Return the debug info and PDF URL
    res.json({
      debugInfo,
      pdfUrl: `/api/reports/download/${fileNameWithoutExt}.pdf`,
      htmlUrl: `/api/reports/download/${fileNameWithoutExt}.html`
    });
  } catch (error) {
    console.error('Yearly report debug generation error:', error);
    res.status(500);
    throw new Error('Failed to generate yearly report debug');
  }
});

/**
 * @desc    Generate children's life report (PDF)
 * @route   POST /api/reports/childrens-life
 * @access  Private
 */
const generateChildrensLifeReport = asyncHandler(async (req, res) => {
  const { 
    personId,
    originalDateFormat,
    userSettings
  } = req.body;

  if (!personId) {
    res.status(400);
    throw new Error('Please provide personId');
  }

  // Check if user has reached their report limit
  const usage = await getReportUsage(req.user.id);
  if (!usage.canGenerate) {
    res.status(403);
    throw new Error(`You have reached your report limit of ${usage.reportLimit}`);
  }

  try {
    // Get person details
    const person = await getPersonById(personId);

    if (!person) {
      res.status(404);
      throw new Error('Person not found');
    }

    // Check if the person belongs to the authenticated user
    if (person.userId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to access this person');
    }

    // Add originalDateFormat to person object if provided
    if (originalDateFormat) {
      person.originalDateFormat = originalDateFormat;
    }

    // Generate report data using the report generation service
    const reportData = await generateLifeReportData(person);
    
    // Generate analysis using the AI service with children's life report prompts
    const { content: analysis, tokensUsed: tokens, cost } = await generateChildrensLifeReportContent(reportData);
    
    // Add the analysis to the report data
    reportData.content = analysis;
    
    // Generate a unique filename
    const timestamp = Date.now();
    const fileName = `${person.name.replace(/\s+/g, '_')}_Childrens_Life_Report_${timestamp}.pdf`;
    
    // Generate the PDF with the same filename (without extension)
    const fileNameWithoutExt = `${person.name.replace(/\s+/g, '_')}_Childrens_Life_Report_${timestamp}`;
    
    // Add userSettings to reportData for custom logo and footer
    if (userSettings) {
      reportData.userSettings = userSettings;
    } else {
      // Fallback to userId if userSettings not provided
      reportData.userId = req.user.id;
    }
    
    const filePath = await generateChildrensLifePdf(reportData, fileNameWithoutExt);

    // Create report record in database
    const report = await createReport({
      type: 'childrens-life',
      person1Id: personId,
      content: analysis,
      pdfUrl: `/api/reports/download/${fileName}`,
      tokensUsed: tokens || 0,
      cost: cost || 0,
      userId: req.user.id
    });

    res.json({
      report,
      pdfUrl: `/api/reports/download/${fileName}`
    });
  } catch (error) {
    console.error('Children\'s life report generation error:', error);
    res.status(500);
    throw new Error('Failed to generate children\'s life report');
  }
});

export {
  getReportsList,
  getReportDetails,
  generateAnalysis,
  generateRelationshipReport,
  generateYearlyReport,
  generateLifeReport,
  generateFinancialReport,
  generateSinglesReport,
  generateChildrensLifeReport,
  generateYearlyReportDebug,
  downloadReport,
  deleteExistingReport,
  getUsageStats
};

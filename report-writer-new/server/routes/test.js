/**
 * Test Routes
 * 
 * Temporary routes for testing external services
 */

import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// Test external WeasyPrint API connectivity
router.get('/weasyprint-health', async (req, res) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch('http://198.74.52.74/', {
      signal: controller.signal
    }).finally(() => clearTimeout(timeout));
    const data = await response.json();
    res.json({
      success: true,
      status: response.status,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test external WeasyPrint API PDF generation
router.post('/weasyprint-test', async (req, res) => {
  try {
    const testHtml = '<html><body><h1>Test from DigitalOcean</h1><p>Testing external WeasyPrint API</p></body></html>';
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch('http://198.74.52.74/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: testHtml,
        css: 'body { font-family: Arial; }',
        filename: 'test.pdf'
      }),
      signal: controller.signal
    }).finally(() => clearTimeout(timeout));
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`WeasyPrint API error (${response.status}): ${errorText}`);
    }
    
    const pdfBuffer = await response.buffer();
    
    res.json({
      success: true,
      pdfSize: pdfBuffer.length,
      message: 'PDF generated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// Debug output directory
router.get('/output-files', async (req, res) => {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const outputDir = path.join(__dirname, '../output');
    
    if (!fs.existsSync(outputDir)) {
      return res.json({
        exists: false,
        message: 'Output directory does not exist'
      });
    }
    
    const files = fs.readdirSync(outputDir);
    const fileDetails = files.map(file => {
      const stats = fs.statSync(path.join(outputDir, file));
      return {
        name: file,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      };
    });
    
    res.json({
      exists: true,
      path: outputDir,
      files: fileDetails,
      count: files.length
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

export default router;
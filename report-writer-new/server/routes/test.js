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
    const response = await fetch('http://198.74.52.74/');
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

export default router;
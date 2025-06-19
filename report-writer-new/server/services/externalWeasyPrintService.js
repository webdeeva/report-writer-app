/**
 * External WeasyPrint API Service
 * 
 * This service uses an external WeasyPrint API server to generate PDFs.
 * The API is hosted on a Linode server at http://198.74.52.74/
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Output directory for PDF files
const OUTPUT_DIR = path.join(__dirname, '../output');

// External WeasyPrint API URL
const WEASYPRINT_API_URL = process.env.WEASYPRINT_API_URL || 'http://198.74.52.74';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Generate a PDF from HTML using external WeasyPrint API
 * 
 * @param {string} html - HTML content to convert to PDF
 * @param {string} outputFilename - Name of the output file (without extension)
 * @param {string} css - Optional CSS styles
 * @returns {Promise<string>} - Path to the generated PDF file
 */
export async function generatePdfFromHtml(html, outputFilename, css = '') {
  const outputPath = path.join(OUTPUT_DIR, `${outputFilename}.pdf`);
  
  try {
    console.log(`Generating PDF using external WeasyPrint API at ${WEASYPRINT_API_URL}`);
    
    // Extract CSS from HTML if not provided separately
    if (!css && html.includes('<style>')) {
      const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
      if (styleMatch) {
        css = styleMatch.map(tag => tag.replace(/<\/?style[^>]*>/gi, '')).join('\n');
      }
    }
    
    // Make request to external API with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(`${WEASYPRINT_API_URL}/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: html,
        css: css || '',
        filename: `${outputFilename}.pdf`,
        save: true  // Save PDF on server
      }),
      signal: controller.signal
    }).finally(() => clearTimeout(timeout));
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`WeasyPrint API error (${response.status}): ${errorText}`);
    }
    
    // Get the PDF URL from response headers
    const pdfUrl = response.headers.get('X-PDF-URL');
    const pdfId = response.headers.get('X-PDF-ID');
    
    if (pdfUrl || pdfId) {
      // Store the external PDF URL for later retrieval
      const pdfInfo = {
        externalUrl: pdfUrl || `${WEASYPRINT_API_URL}/pdf/${pdfId}`,
        externalId: pdfId,
        filename: `${outputFilename}.pdf`,
        createdAt: new Date().toISOString()
      };
      
      // Save PDF info to a JSON file for tracking
      const infoPath = path.join(OUTPUT_DIR, `${outputFilename}.json`);
      await writeFile(infoPath, JSON.stringify(pdfInfo, null, 2));
      
      // Also save the PDF buffer locally as backup
      const pdfBuffer = await response.buffer();
      await writeFile(outputPath, pdfBuffer);
      
      console.log(`PDF generated successfully: ${outputPath}`);
      console.log(`External PDF URL: ${pdfInfo.externalUrl}`);
      return outputPath;
    } else {
      // Fallback to original behavior if no URL in headers
      const pdfBuffer = await response.buffer();
      await writeFile(outputPath, pdfBuffer);
      console.log(`PDF generated successfully: ${outputPath}`);
      return outputPath;
    }
    
  } catch (error) {
    console.error('Error generating PDF with external WeasyPrint API:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
}

/**
 * Check if external WeasyPrint API is available
 * 
 * @returns {Promise<boolean>} - True if API is available
 */
export async function isApiAvailable() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${WEASYPRINT_API_URL}/`, {
      signal: controller.signal
    }).finally(() => clearTimeout(timeout));
    
    if (response.ok) {
      const data = await response.json();
      console.log('External WeasyPrint API status:', data);
      return data.status === 'healthy';
    }
    
    return false;
  } catch (error) {
    console.error('External WeasyPrint API not available:', error.message);
    return false;
  }
}

export default {
  generatePdfFromHtml,
  isApiAvailable
};
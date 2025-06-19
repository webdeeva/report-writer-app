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
        filename: `${outputFilename}.pdf`
      }),
      signal: controller.signal
    }).finally(() => clearTimeout(timeout));
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`WeasyPrint API error (${response.status}): ${errorText}`);
    }
    
    // Get PDF buffer from response
    const pdfBuffer = await response.buffer();
    
    // Write to file
    await writeFile(outputPath, pdfBuffer);
    
    console.log(`PDF generated successfully: ${outputPath}`);
    return outputPath;
    
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
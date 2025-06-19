/**
 * HTML-based PDF Service
 * 
 * This service uses Puppeteer to generate PDFs when WeasyPrint is not available.
 * Falls back to HTML if Puppeteer is also not available.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { generatePdfFromHtml as puppeteerGeneratePdf } from './puppeteerPdfService.js';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Output directory for files
const OUTPUT_DIR = path.join(__dirname, '../output');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Save HTML content as PDF using Puppeteer or fallback to HTML
 * 
 * @param {string} html - HTML content to save
 * @param {string} outputFilename - Name of the output file (without extension)
 * @returns {Promise<string>} - Path to the saved file
 */
export async function saveHtmlAsPdf(html, outputFilename) {
  // First try to use html-pdf-node
  try {
    console.log('Attempting to generate PDF with html-pdf-node...');
    return await puppeteerGeneratePdf(html, outputFilename);
  } catch (error) {
    console.log('PDF generation failed, saving as HTML with .pdf extension:', error.message);
    // Fall back to saving as HTML if PDF generation fails
    const outputPath = path.join(OUTPUT_DIR, `${outputFilename}.pdf`);
    
    // Wrap HTML with print-friendly styling
    const printableHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Report</title>
    <style>
        .pdf-notice {
            background-color: #fffbeb;
            border: 1px solid #fbbf24;
            padding: 12px;
            margin: 20px;
            border-radius: 6px;
            color: #92400e;
            font-family: Arial, sans-serif;
            print-media: none;
        }
        @media print {
            .pdf-notice { display: none; }
        }
        @media print {
            body { margin: 0; }
            .page-break { page-break-after: always; }
        }
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2, h3 { color: #2c3e50; }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
        }
        th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left;
        }
        th { 
            background-color: #f2f2f2; 
            font-weight: bold;
        }
        .report-header {
            text-align: center;
            margin-bottom: 40px;
        }
    </style>
</head>
<body>
    <div class="pdf-notice">
        <strong>Note:</strong> This is an HTML file with a .pdf extension. To view it properly:
        <ul style="margin: 5px 0;">
            <li>Rename the file extension from .pdf to .html</li>
            <li>Open it in a web browser</li>
            <li>Use the browser's Print → Save as PDF feature to create a real PDF</li>
        </ul>
    </div>
    ${html}
    <script>
        // Auto-print when opened in browser
        if (window.location.search.includes('print=true')) {
            window.print();
        }
    </script>
</body>
</html>`;
  
    try {
      await writeFile(outputPath, printableHtml, 'utf8');
      console.log(`HTML report saved to: ${outputPath}`);
      return outputPath;
    } catch (writeError) {
      console.error('Error saving HTML report:', writeError);
      throw new Error(`Failed to save HTML report: ${writeError.message}`);
    }
  }
}

export default {
  saveHtmlAsPdf
};
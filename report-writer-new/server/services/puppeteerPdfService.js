/**
 * HTML PDF Node Service
 * 
 * This service uses html-pdf-node to generate PDFs from HTML content.
 * It provides good CSS support and layout preservation.
 */

import html_to_pdf from 'html-pdf-node';
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

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Generate a PDF from HTML using html-pdf-node
 * 
 * @param {string} html - HTML content to convert to PDF
 * @param {string} outputFilename - Name of the output file (without extension)
 * @returns {Promise<string>} - Path to the generated PDF file
 */
export async function generatePdfFromHtml(html, outputFilename) {
  const outputPath = path.join(OUTPUT_DIR, `${outputFilename}.pdf`);
  
  try {
    // Prepare options similar to WeasyPrint
    const options = {
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '40px',
        bottom: '40px', 
        left: '40px',
        right: '40px'
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 9px; color: #666; text-align: center; width: 100%; padding-top: 20px;">
          Report Writer
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 9px; color: #666; text-align: center; width: 100%; padding-bottom: 20px;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      `,
      preferCSSPageSize: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    };

    // Add CSS for print color adjustment
    const enhancedHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;

    // Generate PDF
    const pdfBuffer = await html_to_pdf.generatePdf(
      { content: enhancedHtml },
      options
    );
    
    // Write to file
    await writeFile(outputPath, pdfBuffer);
    
    console.log(`PDF generated successfully: ${outputPath}`);
    return outputPath;
    
  } catch (error) {
    console.error('Error generating PDF with html-pdf-node:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
}

export default {
  generatePdfFromHtml
};
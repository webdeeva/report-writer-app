/**
 * HTML-based PDF Service
 * 
 * This service provides HTML output for environments where WeasyPrint is not available.
 * The HTML can be converted to PDF by the browser or served as-is.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

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
 * Save HTML content as a file
 * 
 * @param {string} html - HTML content to save
 * @param {string} outputFilename - Name of the output file (without extension)
 * @returns {Promise<string>} - Path to the saved HTML file
 */
export async function saveHtmlAsPdf(html, outputFilename) {
  // For compatibility, we'll save as .pdf but it's actually HTML
  const outputPath = path.join(OUTPUT_DIR, `${outputFilename}.pdf`);
  
  // Wrap HTML with print-friendly styling
  const printableHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Report</title>
    <style>
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
  } catch (error) {
    console.error('Error saving HTML report:', error);
    throw new Error(`Failed to save HTML report: ${error.message}`);
  }
}

export default {
  saveHtmlAsPdf
};
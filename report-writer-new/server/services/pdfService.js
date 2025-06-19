/**
 * PDF Generation Service
 * 
 * This service provides functions for generating PDF reports using WeasyPrint.
 * It interfaces with the Python script to convert HTML to PDF.
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

// Get the directory name (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import templateService using ES module syntax
import * as templateService from './templateService.js';

// Path to the WeasyPrint generator script
const WEASYPRINT_SCRIPT = path.join(__dirname, '../pdf_generator/weasyprint_generator.py');

// Output directory for PDF files
const OUTPUT_DIR = path.join(__dirname, '../output');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Generate a PDF from HTML content
 * 
 * @param {string} html - HTML content to convert to PDF
 * @param {string} outputFilename - Name of the output PDF file
 * @param {Object} options - Additional options
 * @param {boolean} options.debug - Enable debug mode
 * @param {string} options.baseUrl - Base URL for resolving relative URLs in the HTML
 * @returns {Promise<string>} - Path to the generated PDF file
 */
async function generatePdfFromHtml(html, outputFilename, options = {}) {
  const { debug = false, baseUrl = null } = options;
  
  // Create a temporary HTML file
  const tempHtmlPath = path.join(OUTPUT_DIR, `${outputFilename}.html`);
  const outputPath = path.join(OUTPUT_DIR, `${outputFilename}.pdf`);
  
  try {
    // Write HTML content to a temporary file
    await writeFile(tempHtmlPath, html, 'utf8');
    
    // Build command arguments
    const args = [
      WEASYPRINT_SCRIPT,
      '--file', tempHtmlPath,
      '--output', outputPath,
    ];
    
    if (baseUrl) {
      args.push('--base-url', baseUrl);
    }
    
    if (debug) {
      args.push('--debug');
    }
    
    // Execute the WeasyPrint script
    return new Promise((resolve, reject) => {
      const process = spawn('python3', args);
      
      let stdout = '';
      let stderr = '';
      
      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      process.on('close', (code) => {
        // Clean up the temporary HTML file
        fs.unlink(tempHtmlPath, (err) => {
          if (err && debug) {
            console.error(`Error deleting temporary HTML file: ${err.message}`);
          }
        });
        
        if (code === 0) {
          resolve(outputPath);
        } else {
          reject(new Error(`PDF generation failed with code ${code}: ${stderr}`));
        }
      });
      
      process.on('error', (err) => {
        reject(new Error(`Failed to start PDF generation process: ${err.message}`));
      });
    });
  } catch (error) {
    throw new Error(`PDF generation failed: ${error.message}`);
  }
}

/**
 * Generate a yearly report PDF
 * 
 * @param {Object} data - Report data
 * @param {string} data.person_name - Name of the person
 * @param {number} data.age - Age of the person
 * @param {string} data.birthdate - Birthdate of the person
 * @param {number} data.custom_age - Optional custom age for the report
 * @param {Array} data.birth_cards - Birth cards of the person
 * @param {Array} data.year_cards - Year cards for the specific age
 * @param {Array} data.yearly_influences - Influences for the year
 * @param {Array} data.recommendations - Recommendations for the year
 * @param {Array} data.key_dates - Key dates for the year
 * @param {string} [customFilename] - Optional custom filename (without extension)
 * @returns {Promise<string>} - Path to the generated PDF file
 */
async function generateYearlyReport(data, customFilename) {
  // Map legacy field names if needed
  const reportData = {
    ...data,
    person_name: data.person_name || data.personName,
    birthdate: data.birthdate || data.birthDate,
  };
  
  // Use custom filename if provided, otherwise generate one
  let filename;
  if (customFilename) {
    filename = customFilename;
  } else {
    const timestamp = Date.now();
    filename = `${reportData.person_name.replace(/\s+/g, '_')}_Age${reportData.age}_Yearly_Report_${timestamp}`;
  }
  
  try {
    // Generate HTML content for the report using the template service
    const html = await templateService.renderYearlyReport(reportData);
    
    // Set the base URL to the templates directory for resolving relative paths
    const templatesDir = path.join(__dirname, '../pdf_generator/templates');
    
    // Generate PDF with the base URL set
    return generatePdfFromHtml(html, filename, { baseUrl: templatesDir });
  } catch (error) {
    throw new Error(`Failed to generate yearly report: ${error.message}`);
  }
}

/**
 * Generate a life report PDF
 * 
 * @param {Object} data - Report data
 * @param {string} data.person_name - Name of the person
 * @param {string} data.birthdate - Birthdate of the person
 * @param {Array} data.birth_cards - Birth cards of the person
 * @param {string} data.life_path_description - Description of the life path
 * @param {string} data.personality_overview - Overview of the personality
 * @param {Array} data.personality_traits - Personality traits
 * @param {Array} data.life_stages - Life stages
 * @param {Array} data.challenges - Life challenges
 * @param {Array} data.opportunities - Life opportunities
 * @param {Array} data.recommendations - Life recommendations
 * @returns {Promise<string>} - Path to the generated PDF file
 */
async function generateLifeReport(data) {
  // Map legacy field names if needed
  const reportData = {
    ...data,
    person_name: data.person_name || data.personName,
    birthdate: data.birthdate || data.birthDate,
  };
  
  // Generate a unique filename
  const timestamp = Date.now();
  const filename = `${reportData.person_name.replace(/\s+/g, '_')}_Life_Report_${timestamp}`;
  
  try {
    // Generate HTML content for the report using the template service
    const html = await templateService.renderLifeReport(reportData);
    
    // Set the base URL to the templates directory for resolving relative paths
    const templatesDir = path.join(__dirname, '../pdf_generator/templates');
    
    // Generate PDF with the base URL set
    return generatePdfFromHtml(html, filename, { baseUrl: templatesDir });
  } catch (error) {
    throw new Error(`Failed to generate life report: ${error.message}`);
  }
}

/**
 * Generate a relationship report PDF
 * 
 * @param {Object} data - Report data
 * @param {string} data.person1_name - Name of the first person
 * @param {string} data.person2_name - Name of the second person
 * @param {string} data.person1_birthdate - Birthdate of the first person
 * @param {string} data.person2_birthdate - Birthdate of the second person
 * @param {Array} data.person1_cards - Birth cards of the first person
 * @param {Array} data.person2_cards - Birth cards of the second person
 * @param {Object} data.combination_card - Combination card
 * @param {Array} data.person1_pov_card - POV card for first person
 * @param {Array} data.person2_pov_card - POV card for second person
 * @param {string} data.compatibility_overview - Overview of the compatibility
 * @param {number} data.compatibility_score - Compatibility score (1-10)
 * @param {Array} data.relationship_dynamics - Relationship dynamics
 * @param {Array} data.strengths - Relationship strengths
 * @param {Array} data.challenges - Relationship challenges
 * @param {Array} data.personality_comparison - Personality comparison
 * @param {Array} data.recommendations - Relationship recommendations
 * @param {string} [customFilename] - Optional custom filename (without extension)
 * @returns {Promise<string>} - Path to the generated PDF file
 */
async function generateRelationshipReport(data, customFilename) {
  // Map legacy field names if needed
  const reportData = {
    ...data,
    person1_name: data.person1_name || data.person1Name,
    person2_name: data.person2_name || data.person2Name,
    person1_birthdate: data.person1_birthdate || data.person1Birthdate,
    person2_birthdate: data.person2_birthdate || data.person2Birthdate,
  };
  
  // Use custom filename if provided, otherwise generate one
  let filename;
  if (customFilename) {
    filename = customFilename;
  } else {
    const timestamp = Date.now();
    filename = `${reportData.person1_name.replace(/\s+/g, '_')}_${reportData.person2_name.replace(/\s+/g, '_')}_Relationship_Report_${timestamp}`;
  }
  
  try {
    // Generate HTML content for the report using the template service
    const html = await templateService.renderRelationshipReport(reportData);
    
    // Set the base URL to the templates directory for resolving relative paths
    const templatesDir = path.join(__dirname, '../pdf_generator/templates');
    
    // Generate PDF with the base URL set
    return generatePdfFromHtml(html, filename, { baseUrl: templatesDir });
  } catch (error) {
    throw new Error(`Failed to generate relationship report: ${error.message}`);
  }
}

/**
 * Generate a yearly report debug PDF
 * 
 * @param {Object} debugInfo - Debug information
 * @param {string} [customFilename] - Optional custom filename (without extension)
 * @returns {Promise<string>} - Path to the generated PDF file
 */
async function generateYearlyReportDebug(debugInfo, customFilename) {
  // Use custom filename if provided, otherwise generate one
  let filename;
  if (customFilename) {
    filename = customFilename;
  } else {
    const timestamp = Date.now();
    const personName = debugInfo.input?.person?.name || 'Debug';
    filename = `${personName.replace(/\s+/g, '_')}_Yearly_Report_Debug_${timestamp}`;
  }
  
  try {
    // Generate HTML content for the report using the template service
    const html = await templateService.renderYearlyReportDebug(debugInfo);
    
    // Set the base URL to the templates directory for resolving relative paths
    const templatesDir = path.join(__dirname, '../pdf_generator/templates');
    
    // Generate PDF with the base URL set
    return generatePdfFromHtml(html, filename, { baseUrl: templatesDir });
  } catch (error) {
    throw new Error(`Failed to generate yearly report debug: ${error.message}`);
  }
}

/**
 * Generate a financial report PDF
 * 
 * @param {Object} data - Report data
 * @param {string} data.person_name - Name of the person
 * @param {number} data.age - Age of the person
 * @param {string} data.birthdate - Birthdate of the person
 * @param {number} data.custom_age - Optional custom age for the report
 * @param {Array} data.birth_cards - Birth cards of the person
 * @param {Array} data.year_cards - Year cards for the specific age
 * @param {Array} data.financial_spread - Enhanced spread with position correlations
 * @param {string} [customFilename] - Optional custom filename (without extension)
 * @returns {Promise<string>} - Path to the generated PDF file
 */
async function generateFinancialReport(data, customFilename) {
  // Map legacy field names if needed
  const reportData = {
    ...data,
    person_name: data.person_name || data.personName,
    birthdate: data.birthdate || data.birthDate,
  };
  
  // Use custom filename if provided, otherwise generate one
  let filename;
  if (customFilename) {
    filename = customFilename;
  } else {
    const timestamp = Date.now();
    filename = `${reportData.person_name.replace(/\s+/g, '_')}_Age${reportData.age}_Financial_Report_${timestamp}`;
  }
  
  try {
    // Generate HTML content for the report using the template service
    const html = await templateService.renderFinancialReport(reportData);
    
    // Set the base URL to the templates directory for resolving relative paths
    const templatesDir = path.join(__dirname, '../pdf_generator/templates');
    
    // Generate PDF with the base URL set
    return generatePdfFromHtml(html, filename, { baseUrl: templatesDir });
  } catch (error) {
    throw new Error(`Failed to generate financial report: ${error.message}`);
  }
}

/**
 * Generate a singles report PDF
 * 
 * @param {Object} data - Report data
 * @param {string} data.person_name - Name of the person
 * @param {number} data.age - Age of the person
 * @param {string} data.birthdate - Birthdate of the person
 * @param {number} data.custom_age - Optional custom age for the report
 * @param {Array} data.birth_cards - Birth cards of the person
 * @param {Array} data.year_cards - Year cards for the specific age
 * @param {Array} data.spread_with_positions - Enhanced spread with position correlations
 * @param {string} [customFilename] - Optional custom filename (without extension)
 * @returns {Promise<string>} - Path to the generated PDF file
 */
async function generateSinglesReport(data, customFilename) {
  // Map legacy field names if needed
  const reportData = {
    ...data,
    person_name: data.person_name || data.personName,
    birthdate: data.birthdate || data.birthDate,
  };
  
  // Use custom filename if provided, otherwise generate one
  let filename;
  if (customFilename) {
    filename = customFilename;
  } else {
    const timestamp = Date.now();
    filename = `${reportData.person_name.replace(/\s+/g, '_')}_Age${reportData.age}_Singles_Report_${timestamp}`;
  }
  
  try {
    // Generate HTML content for the report using the template service
    const html = await templateService.renderSinglesReport(reportData);
    
    // Set the base URL to the templates directory for resolving relative paths
    const templatesDir = path.join(__dirname, '../pdf_generator/templates');
    
    // Generate PDF with the base URL set
    return generatePdfFromHtml(html, filename, { baseUrl: templatesDir });
  } catch (error) {
    throw new Error(`Failed to generate singles report: ${error.message}`);
  }
}

/**
 * Generate a children's life report PDF
 * 
 * @param {Object} data - Report data
 * @param {string} data.person_name - Name of the child
 * @param {string} data.birthdate - Birthdate of the child
 * @param {Array} data.birth_cards - Birth cards of the child
 * @param {string} data.life_path_description - Description of the life path
 * @param {string} data.personality_overview - Overview of the personality
 * @param {Array} data.personality_traits - Personality traits
 * @param {Array} data.life_stages - Life stages
 * @param {Array} data.challenges - Life challenges
 * @param {Array} data.opportunities - Life opportunities
 * @param {Array} data.recommendations - Life recommendations
 * @returns {Promise<string>} - Path to the generated PDF file
 */
async function generateChildrensLifeReport(data) {
  // Map legacy field names if needed
  const reportData = {
    ...data,
    person_name: data.person_name || data.personName,
    birthdate: data.birthdate || data.birthDate,
  };
  
  // Generate a unique filename
  const timestamp = Date.now();
  const filename = `${reportData.person_name.replace(/\s+/g, '_')}_Childrens_Life_Report_${timestamp}`;
  
  try {
    // Generate HTML content for the report using the template service
    const html = await templateService.renderChildrensLifeReport(reportData);
    
    // Set the base URL to the templates directory for resolving relative paths
    const templatesDir = path.join(__dirname, '../pdf_generator/templates');
    
    // Generate PDF with the base URL set
    return generatePdfFromHtml(html, filename, { baseUrl: templatesDir });
  } catch (error) {
    throw new Error(`Failed to generate children's life report: ${error.message}`);
  }
}

export {
  generatePdfFromHtml,
  generateYearlyReport,
  generateLifeReport,
  generateRelationshipReport,
  generateYearlyReportDebug,
  generateFinancialReport,
  generateSinglesReport,
  generateChildrensLifeReport
};

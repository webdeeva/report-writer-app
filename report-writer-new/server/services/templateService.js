/**
 * Template Service
 * 
 * This service provides functions for rendering HTML templates using Nunjucks.
 * It handles loading templates, rendering them with data, and caching.
 */

import nunjucks from 'nunjucks';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

// Get the directory name (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the templates directory
const TEMPLATES_DIR = path.join(__dirname, '../pdf_generator/templates');

// Configure Nunjucks
const env = nunjucks.configure(TEMPLATES_DIR, {
  autoescape: true,
  trimBlocks: true,
  lstripBlocks: true,
  noCache: process.env.NODE_ENV === 'development',
});

// Add custom filters
env.addFilter('formatDate', (date, format = 'MMMM D, YYYY') => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  // Simple date formatter (in a real app, you might use a library like date-fns)
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  
  return `${month} ${day}, ${year}`;
});

// Add markdown filter
env.addFilter('markdown', (content) => {
  if (!content) return '';
  
  // Configure marked to sanitize the output
  marked.setOptions({
    sanitize: true
  });
  
  // Convert markdown to HTML
  return marked.parse(content);
});

// Import settings model
import { getSettings } from '../models/settingsModel.js';
import { getUserById } from '../models/userModel.js';

/**
 * Render a template with data
 * 
 * @param {string} templateName - Name of the template file (without extension)
 * @param {Object} data - Data to render the template with
 * @returns {Promise<string>} - Rendered HTML
 */
async function renderTemplate(templateName, data = {}) {
  const templatePath = `${templateName}.html`;
  
  // Check if template exists
  const fullPath = path.join(TEMPLATES_DIR, templatePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }
  
  // Add generated date if not provided
  if (!data.generated_date) {
    data.generated_date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  // Get custom logo and footer if available
  try {
    // If userSettings is provided directly, use those
    if (data.userSettings) {
      data.custom_logo = data.userSettings.logoPath;
      data.custom_footer = data.userSettings.footerText;
    }
    // Otherwise, if userId is provided, get settings for that user from the database
    else if (data.userId) {
      const userSettings = await getSettings(data.userId);
      
      // If user has assigned settings, use those
      if (userSettings && userSettings.assignedUserId) {
        const assignedSettings = await getSettings(userSettings.assignedUserId);
        if (assignedSettings) {
          data.custom_logo = assignedSettings.logoPath;
          data.custom_footer = assignedSettings.footerText;
        }
      } else if (userSettings) {
        // Otherwise use user's own settings
        data.custom_logo = userSettings.logoPath;
        data.custom_footer = userSettings.footerText;
      }
    }
  } catch (error) {
    console.error('Error getting custom logo/footer:', error);
    // Continue without custom logo/footer
  }
  
  // Render template
  return new Promise((resolve, reject) => {
    nunjucks.render(templatePath, data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * Render a yearly report template
 * 
 * @param {Object} data - Report data
 * @returns {Promise<string>} - Rendered HTML
 */
async function renderYearlyReport(data) {
  // Set title if not provided
  if (!data.title) {
    data.title = `Yearly Report for ${data.person_name}`;
  }
  
  return renderTemplate('yearly_report', data);
}

/**
 * Render a life report template
 * 
 * @param {Object} data - Report data
 * @returns {Promise<string>} - Rendered HTML
 */
async function renderLifeReport(data) {
  // Set title if not provided
  if (!data.title) {
    data.title = `Life Report for ${data.person_name}`;
  }
  
  return renderTemplate('life_report', data);
}

/**
 * Render a relationship report template
 * 
 * @param {Object} data - Report data
 * @returns {Promise<string>} - Rendered HTML
 */
async function renderRelationshipReport(data) {
  // Set title if not provided
  if (!data.title) {
    data.title = `Relationship Report for ${data.person1_name} & ${data.person2_name}`;
  }
  
  return renderTemplate('relationship_report', data);
}

/**
 * Render a yearly report debug template
 * 
 * @param {Object} debugInfo - Debug information
 * @returns {Promise<string>} - Rendered HTML
 */
async function renderYearlyReportDebug(debugInfo) {
  // Set title if not provided
  if (!debugInfo.title) {
    debugInfo.title = `Yearly Report Debug Information`;
  }
  
  // Add a JSON filter for debugging
  env.addFilter('json', (obj) => {
    return JSON.stringify(obj, null, 2);
  });
  
  return renderTemplate('yearly_report_debug', { debug_info: debugInfo });
}

/**
 * Render a financial report template
 * 
 * @param {Object} data - Report data
 * @returns {Promise<string>} - Rendered HTML
 */
async function renderFinancialReport(data) {
  // Set title if not provided
  if (!data.title) {
    data.title = `Financial Report for ${data.person_name}`;
  }
  
  // For now, use the yearly report template as a base
  // In a production environment, you would create a dedicated financial_report.html template
  return renderTemplate('yearly_report', data);
}

/**
 * Render a singles report template
 * 
 * @param {Object} data - Report data
 * @returns {Promise<string>} - Rendered HTML
 */
async function renderSinglesReport(data) {
  // Set title if not provided
  if (!data.title) {
    data.title = `Singles Report for ${data.person_name}`;
  }
  
  return renderTemplate('singles_report', data);
}

/**
 * Render a children's life report template
 * 
 * @param {Object} data - Report data
 * @returns {Promise<string>} - Rendered HTML
 */
async function renderChildrensLifeReport(data) {
  // Set title if not provided
  if (!data.title) {
    data.title = `Children's Life Report for ${data.person_name}`;
  }
  
  return renderTemplate('childrens_life_report', data);
}

export {
  renderTemplate,
  renderYearlyReport,
  renderLifeReport,
  renderRelationshipReport,
  renderYearlyReportDebug,
  renderFinancialReport,
  renderSinglesReport,
  renderChildrensLifeReport
};

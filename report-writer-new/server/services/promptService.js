/**
 * Prompt Service
 * 
 * This service provides the default prompts for generating reports.
 * These prompts are used by the report generation service to create
 * detailed analyses based on card data.
 * 
 * The prompts are split into separate files for better organization and maintainability.
 */

// Import prompts from separate files
import { 
  yearlyReportPrompt,
  yearlyReportPromptChunk1,
  yearlyReportPromptChunk2,
  yearlyReportPromptChunk3,
  yearlyReportPromptChunk4
} from './prompts/yearlyReportPrompts.js';

import {
  lifeReportPrompt,
  lifeReportPromptChunk1,
  lifeReportPromptChunk2,
  lifeReportPromptChunk3,
  lifeReportPromptChunk4
} from './prompts/lifeReportPrompts.js';

import {
  relationshipReportPrompt,
  relationshipReportPromptChunk1,
  relationshipReportPromptChunk2,
  relationshipReportPromptChunk3,
  relationshipReportPromptChunk4,
  relationshipReportPromptChunk5
} from './prompts/relationshipReportPrompts.js';

import {
  financialReportPrompt,
  financialReportPromptChunk1,
  financialReportPromptChunk2,
  financialReportPromptChunk3,
  financialReportPromptChunk4
} from './prompts/financialReportPrompts.js';

import {
  singlesReportPrompt,
  singlesReportPromptChunk1,
  singlesReportPromptChunk2,
  singlesReportPromptChunk3,
  singlesReportPromptChunk4
} from './prompts/singlesReportPrompts.js';

import {
  childrensLifeReportPrompt,
  childrensLifeReportPromptChunk1,
  childrensLifeReportPromptChunk2,
  childrensLifeReportPromptChunk3,
  childrensLifeReportPromptChunk4
} from './prompts/childrensLifeReportPrompts.js';

/**
 * Get the default prompt for a specific report type
 * @param {string} reportType - The type of report (yearly, life, relationship, etc.)
 * @returns {string} The default prompt for the specified report type
 */
const getDefaultPrompt = (reportType) => {
  switch (reportType.toLowerCase()) {
    case 'yearly':
      return yearlyReportPrompt;
    case 'life':
      return lifeReportPrompt;
    case 'relationship':
      return relationshipReportPrompt;
    case 'financial':
      return financialReportPrompt;
    case 'singles':
      return singlesReportPrompt;
    case 'childrens-life':
      return childrensLifeReportPrompt;
    default:
      throw new Error(`Unknown report type: ${reportType}`);
  }
};

// Export all prompts
export {
  // Yearly report prompts
  yearlyReportPrompt,
  yearlyReportPromptChunk1,
  yearlyReportPromptChunk2,
  yearlyReportPromptChunk3,
  yearlyReportPromptChunk4,
  
  // Life report prompts
  lifeReportPrompt,
  lifeReportPromptChunk1,
  lifeReportPromptChunk2,
  lifeReportPromptChunk3,
  lifeReportPromptChunk4,
  
  // Relationship report prompts
  relationshipReportPrompt,
  relationshipReportPromptChunk1,
  relationshipReportPromptChunk2,
  relationshipReportPromptChunk3,
  relationshipReportPromptChunk4,
  relationshipReportPromptChunk5,
  
  // Financial report prompts
  financialReportPrompt,
  financialReportPromptChunk1,
  financialReportPromptChunk2,
  financialReportPromptChunk3,
  financialReportPromptChunk4,
  
  // Singles report prompts
  singlesReportPrompt,
  singlesReportPromptChunk1,
  singlesReportPromptChunk2,
  singlesReportPromptChunk3,
  singlesReportPromptChunk4,
  
  // Children's life report prompts
  childrensLifeReportPrompt,
  childrensLifeReportPromptChunk1,
  childrensLifeReportPromptChunk2,
  childrensLifeReportPromptChunk3,
  childrensLifeReportPromptChunk4,
  
  // Helper function
  getDefaultPrompt
};

/**
 * Report Generation Service
 * 
 * This service provides functions for generating report data with optimizations for speed.
 * It handles the calculation of birth cards, year cards, and other report content.
 */

// Export all public functions from the modules
export { 
  calculateBirthCards, 
  calculateYearCards 
} from './cardCalculation.js';

export {
  generateYearlyReportData,
  generateLifeReportData,
  generateRelationshipReportData,
  generateYearlyReportDebugInfo
} from './reportGenerators.js';

// Export utility functions that might be needed by other modules
export {
  getCardDescription,
  getCardKeywords
} from './cardUtils.js';

// Export constants that might be needed by other modules
export {
  CARD_POSITIONS,
  CardSuit,
  CardValue,
  CardSymbols
} from './constants.js';

/**
 * Position Mapping Service
 * 
 * This service provides functions for mapping cards to their natural positions
 * and generating financial interpretations based on position correlations.
 */

import { CARD_POSITIONS } from './constants.js';
import { getYearlySpread } from './dataLoader.js';

/**
 * Maps cards in a spread to their natural positions from Age 0
 * @param {Array} currentSpread - The spread of cards for current age
 * @returns {Array} Mapped positions with financial interpretations
 */
export const mapCardsToNaturalPositions = async (currentSpread) => {
  // Get Age 0 spread (natural positions)
  const age0Spread = await getYearlySpread(0);
  
  if (!age0Spread || !Array.isArray(age0Spread)) {
    console.warn('Age 0 spread not found or invalid');
    return currentSpread.map((card, index) => ({
      card,
      currentPosition: CARD_POSITIONS[index] || 'Unknown',
      naturalPosition: 'Unknown',
      financialImplication: 'Unable to determine position correlation'
    }));
  }
  
  // Create mapping of cards to their natural positions
  const naturalPositions = {};
  CARD_POSITIONS.forEach((position, index) => {
    if (index < age0Spread.length) {
      naturalPositions[age0Spread[index]] = {
        position,
        index
      };
    }
  });
  
  // Map current spread cards to their natural positions
  return currentSpread.map((card, index) => {
    const currentPosition = CARD_POSITIONS[index] || 'Unknown';
    const naturalPosition = naturalPositions[card.symbol] 
      ? naturalPositions[card.symbol].position 
      : "Unknown";
    
    return {
      card,
      currentPosition,
      naturalPosition,
      financialImplication: getFinancialImplication(currentPosition, naturalPosition, card)
    };
  });
};

/**
 * Get financial interpretation based on current and natural positions
 * @param {string} currentPosition - Current position in the spread
 * @param {string} naturalPosition - Natural position from Age 0
 * @param {Object} card - Card object
 * @returns {string} Financial interpretation
 */
const getFinancialImplication = (currentPosition, naturalPosition, card) => {
  // Financial position meanings
  const positionMeanings = {
    "Sun": "Core financial identity and purpose",
    "Mercury": "Financial communication and ideas",
    "Venus": "Financial values and resources",
    "Mars": "Financial action and drive",
    "Jupiter": "Financial growth and expansion",
    "Saturn": "Financial discipline and limitations",
    "Uranus": "Financial innovation and disruption",
    "Neptune": "Financial intuition and vision",
    "Pluto": "Financial transformation and power",
    "Result": "Financial outcome and manifestation",
    "Peak": "Financial peak potential",
    "Moon": "Financial emotions and patterns",
    "Earth/Transformation": "Material financial reality"
  };

  // Extract the primary position (before the slash if present)
  const currentPrimaryPosition = currentPosition.split('/')[0].trim();
  const naturalPrimaryPosition = naturalPosition.split('/')[0].trim();
  
  // Get meanings for the positions
  const currentMeaning = positionMeanings[currentPrimaryPosition] || 'Unknown financial aspect';
  const naturalMeaning = positionMeanings[naturalPrimaryPosition] || 'Unknown financial aspect';

  // When a card is in its natural position
  if (currentPosition === naturalPosition) {
    return `This card is in its natural position of ${currentPosition}, indicating strong alignment with ${currentMeaning}. This suggests a natural talent or strength in this financial area.`;
  }
  
  // When a card is not in its natural position
  return `This card naturally belongs in the ${naturalPosition} position (${naturalMeaning}) but is currently in the ${currentPosition} position (${currentMeaning}). This suggests that ${card.name}'s energy is being redirected from its natural financial expression to influence ${currentMeaning}. This can create both opportunities and challenges as the card's energy adapts to a new financial context.`;
};

/**
 * Generate a financial interpretation for a card based on its position and keywords
 * @param {Object} card - Card object
 * @param {string} position - Position in the spread
 * @returns {string} Financial interpretation
 */
export const generateCardFinancialInterpretation = (card, position) => {
  // Financial interpretations based on position
  const positionInterpretations = {
    "Sun": "This position represents your core financial identity and purpose. It shows how you fundamentally approach money and wealth creation.",
    "Mercury": "This position represents your financial communication, ideas, and thinking patterns about money. It influences how you discuss, learn about, and conceptualize financial matters.",
    "Venus": "This position represents your financial values and resources. It shows what you truly value in material terms and how you attract resources.",
    "Mars": "This position represents your financial action and drive. It shows how you pursue money and the energy you bring to wealth-building activities.",
    "Jupiter": "This position represents financial growth and expansion. It shows areas where you can experience financial abundance and opportunities for growth.",
    "Saturn": "This position represents financial discipline and limitations. It shows areas where you need structure and may face challenges in building wealth.",
    "Uranus": "This position represents financial innovation and disruption. It shows how you might experience sudden changes or innovative approaches to money.",
    "Neptune": "This position represents financial intuition and vision. It shows how your dreams and intuition influence your financial decisions.",
    "Pluto": "This position represents financial transformation and power. It shows areas where deep financial changes and power dynamics play out.",
    "Result": "This position represents your financial outcomes and manifestations. It shows the likely results of your financial efforts.",
    "Peak": "This position represents your financial peak potential. It shows the highest level of financial achievement possible for you this year.",
    "Moon": "This position represents your financial emotions and patterns. It shows how your feelings and habits influence your financial life.",
    "Earth/Transformation": "This position represents your material financial reality. It shows how your financial situation manifests in the physical world."
  };

  // Get the primary position (before the slash if present)
  const primaryPosition = position.split('/')[0].trim();
  
  // Get the position interpretation
  const positionInterpretation = positionInterpretations[primaryPosition] || 'This position represents an aspect of your financial life.';
  
  // Generate a financial interpretation based on the card's keywords and the position
  let financialInterpretation = `${positionInterpretation} With the ${card.name} in this position, `;
  
  // Add card-specific financial interpretation based on keywords
  // This is a simplified approach - in a real implementation, you might have more specific interpretations
  if (card.keywords.includes('Success') || card.keywords.includes('Wealth') || card.keywords.includes('Abundance')) {
    financialInterpretation += "you have strong potential for financial success and abundance in this area. Focus on leveraging your natural talents for wealth creation.";
  } else if (card.keywords.includes('Challenge') || card.keywords.includes('Obstacle') || card.keywords.includes('Difficulty')) {
    financialInterpretation += "you may face challenges or obstacles in this financial area. However, overcoming these challenges can lead to significant growth and learning.";
  } else if (card.keywords.includes('Change') || card.keywords.includes('Transformation') || card.keywords.includes('Growth')) {
    financialInterpretation += "you're likely to experience significant changes or transformation in this financial area. Stay adaptable and open to new opportunities.";
  } else if (card.keywords.includes('Stability') || card.keywords.includes('Security') || card.keywords.includes('Foundation')) {
    financialInterpretation += "you have the potential to create stability and security in this financial area. Focus on building strong foundations for long-term wealth.";
  } else if (card.keywords.includes('Creativity') || card.keywords.includes('Innovation') || card.keywords.includes('Inspiration')) {
    financialInterpretation += "your creative and innovative approach can lead to unique financial opportunities in this area. Think outside the box for wealth creation.";
  } else {
    financialInterpretation += "the energy of this card influences how you approach and experience this aspect of your financial life. Pay attention to the card's qualities as they manifest in your financial decisions and experiences.";
  }
  
  return financialInterpretation;
};

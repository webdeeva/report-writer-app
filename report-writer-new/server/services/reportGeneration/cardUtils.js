/**
 * Utility functions for working with cards
 */

import { CardSymbols, cardNumericValues, CARD_VALUES, CARD_SYMBOLS_BY_VALUE } from './constants.js';

/**
 * Create a card object with all properties
 * 
 * @param {string} suit - Card suit
 * @param {string} value - Card value
 * @returns {Object} Card object
 */
export const createCard = (suit, value) => {
  const symbol = CardSymbols[suit];
  const numericValue = cardNumericValues[value];
  const name = `${value} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`;
  
  return {
    suit,
    value,
    symbol,
    name,
    numericValue
  };
};

/**
 * Parse card symbol to create a card object
 * 
 * @param {string} cardSymbol - Card symbol (e.g., "4♣")
 * @returns {Object} Card object
 */
export const parseCardSymbol = (cardSymbol) => {
  // Extract value and suit symbol
  const valueSymbol = cardSymbol.slice(0, -1);
  const suitSymbol = cardSymbol.slice(-1);
  
  // Import these directly to avoid circular dependencies
  const CardSuit = {
    Hearts: 'hearts',
    Diamonds: 'diamonds',
    Clubs: 'clubs',
    Spades: 'spades'
  };
  
  const CardValue = {
    Ace: 'Ace',
    Two: 'Two',
    Three: 'Three',
    Four: 'Four',
    Five: 'Five',
    Six: 'Six',
    Seven: 'Seven',
    Eight: 'Eight',
    Nine: 'Nine',
    Ten: 'Ten',
    Jack: 'Jack',
    Queen: 'Queen',
    King: 'King'
  };
  
  // Map suit symbol to suit
  let suit;
  switch (suitSymbol) {
    case '♥': suit = CardSuit.Hearts; break;
    case '♦': suit = CardSuit.Diamonds; break;
    case '♣': suit = CardSuit.Clubs; break;
    case '♠': suit = CardSuit.Spades; break;
    default: suit = CardSuit.Hearts;
  }
  
  // Map value symbol to value
  let value;
  switch (valueSymbol) {
    case 'A': value = CardValue.Ace; break;
    case '2': value = CardValue.Two; break;
    case '3': value = CardValue.Three; break;
    case '4': value = CardValue.Four; break;
    case '5': value = CardValue.Five; break;
    case '6': value = CardValue.Six; break;
    case '7': value = CardValue.Seven; break;
    case '8': value = CardValue.Eight; break;
    case '9': value = CardValue.Nine; break;
    case '10': value = CardValue.Ten; break;
    case 'J': value = CardValue.Jack; break;
    case 'Q': value = CardValue.Queen; break;
    case 'K': value = CardValue.King; break;
    default: value = CardValue.Ace;
  }
  
  return createCard(suit, value);
};

/**
 * Get card description based on card
 * 
 * @param {Object} card - Card object
 * @returns {string} Card description
 */
export const getCardDescription = (card) => {
  // Import these directly to avoid circular dependencies
  const CardSuit = {
    Hearts: 'hearts',
    Diamonds: 'diamonds',
    Clubs: 'clubs',
    Spades: 'spades'
  };
  
  const CardValue = {
    Ace: 'Ace',
    Two: 'Two',
    Three: 'Three',
    Four: 'Four',
    Five: 'Five',
    Six: 'Six',
    Seven: 'Seven',
    Eight: 'Eight',
    Nine: 'Nine',
    Ten: 'Ten',
    Jack: 'Jack',
    Queen: 'Queen',
    King: 'King'
  };
  
  // This is a placeholder implementation
  // In a real implementation, this would return actual card descriptions
  // from a database or predefined set of descriptions
  
  const descriptions = {
    [`${CardValue.Ace}_${CardSuit.Hearts}`]: "The Ace of Hearts represents love, happiness, and new emotional beginnings. It symbolizes the home and deep feelings.",
    [`${CardValue.King}_${CardSuit.Hearts}`]: "The King of Hearts represents a warm-hearted, kind and generous man. He is affectionate and concerned about others.",
    [`${CardValue.Queen}_${CardSuit.Hearts}`]: "The Queen of Hearts represents a loving, kind and generous woman. She is emotionally mature and nurturing.",
    [`${CardValue.Jack}_${CardSuit.Hearts}`]: "The Jack of Hearts represents a young, warm-hearted person. They are often creative and romantic.",
    
    [`${CardValue.Ace}_${CardSuit.Diamonds}`]: "The Ace of Diamonds represents a new financial beginning, clarity of values, and material abundance.",
    [`${CardValue.King}_${CardSuit.Diamonds}`]: "The King of Diamonds represents a financially successful man. He is business-minded, practical, and ambitious.",
    [`${CardValue.Queen}_${CardSuit.Diamonds}`]: "The Queen of Diamonds represents a financially independent woman. She is practical, grounded, and values security.",
    [`${CardValue.Jack}_${CardSuit.Diamonds}`]: "The Jack of Diamonds represents a young, ambitious person. They are often focused on material success.",
    
    [`${CardValue.Ace}_${CardSuit.Clubs}`]: "The Ace of Clubs represents new ideas, inspiration, and spiritual growth. It symbolizes creativity and ambition.",
    [`${CardValue.King}_${CardSuit.Clubs}`]: "The King of Clubs represents a wise, knowledgeable man. He is intellectual, authoritative, and creative.",
    [`${CardValue.Queen}_${CardSuit.Clubs}`]: "The Queen of Clubs represents an intelligent, creative woman. She is perceptive, witty, and communicative.",
    [`${CardValue.Jack}_${CardSuit.Clubs}`]: "The Jack of Clubs represents a creative, ambitious young person. They are often intellectual and curious.",
    
    [`${CardValue.Ace}_${CardSuit.Spades}`]: "The Ace of Spades represents transformation, power, and clarity of thought. It symbolizes new mental beginnings.",
    [`${CardValue.King}_${CardSuit.Spades}`]: "The King of Spades represents an authoritative, powerful man. He is intellectual, strategic, and sometimes stern.",
    [`${CardValue.Queen}_${CardSuit.Spades}`]: "The Queen of Spades represents a perceptive, intelligent woman. She is independent, analytical, and sometimes critical.",
    [`${CardValue.Jack}_${CardSuit.Spades}`]: "The Jack of Spades represents a serious, thoughtful young person. They are often analytical and strategic."
  };
  
  const key = `${card.value}_${card.suit}`;
  
  return descriptions[key] || `The ${card.name} represents [card meaning].`;
};

/**
 * Get card keywords based on card
 * 
 * @param {Object} card - Card object
 * @returns {Array} Array of keywords
 */
export const getCardKeywords = (card) => {
  // Import these directly to avoid circular dependencies
  const CardSuit = {
    Hearts: 'hearts',
    Diamonds: 'diamonds',
    Clubs: 'clubs',
    Spades: 'spades'
  };
  
  const CardValue = {
    Ace: 'Ace',
    Two: 'Two',
    Three: 'Three',
    Four: 'Four',
    Five: 'Five',
    Six: 'Six',
    Seven: 'Seven',
    Eight: 'Eight',
    Nine: 'Nine',
    Ten: 'Ten',
    Jack: 'Jack',
    Queen: 'Queen',
    King: 'King'
  };
  
  // This is a placeholder implementation
  // In a real implementation, this would return actual card keywords
  // from a database or predefined set of keywords
  
  const keywords = {
    [`${CardValue.Ace}_${CardSuit.Hearts}`]: ["Love", "Happiness", "Home", "Emotions", "New beginnings"],
    [`${CardValue.King}_${CardSuit.Hearts}`]: ["Affectionate", "Kind", "Generous", "Warm-hearted", "Caring"],
    [`${CardValue.Queen}_${CardSuit.Hearts}`]: ["Loving", "Nurturing", "Emotionally mature", "Compassionate", "Supportive"],
    [`${CardValue.Jack}_${CardSuit.Hearts}`]: ["Creative", "Romantic", "Emotional", "Youthful", "Warm-hearted"],
    
    [`${CardValue.Ace}_${CardSuit.Diamonds}`]: ["Wealth", "Abundance", "Values", "Material success", "New opportunity"],
    [`${CardValue.King}_${CardSuit.Diamonds}`]: ["Successful", "Practical", "Business-minded", "Ambitious", "Resourceful"],
    [`${CardValue.Queen}_${CardSuit.Diamonds}`]: ["Practical", "Grounded", "Independent", "Security-minded", "Resourceful"],
    [`${CardValue.Jack}_${CardSuit.Diamonds}`]: ["Ambitious", "Practical", "Material-focused", "Youthful", "Energetic"],
    
    [`${CardValue.Ace}_${CardSuit.Clubs}`]: ["Creativity", "Inspiration", "Ambition", "Spiritual growth", "New ideas"],
    [`${CardValue.King}_${CardSuit.Clubs}`]: ["Wise", "Knowledgeable", "Authoritative", "Creative", "Intellectual"],
    [`${CardValue.Queen}_${CardSuit.Clubs}`]: ["Intelligent", "Creative", "Perceptive", "Witty", "Communicative"],
    [`${CardValue.Jack}_${CardSuit.Clubs}`]: ["Creative", "Ambitious", "Intellectual", "Curious", "Innovative"],
    
    [`${CardValue.Ace}_${CardSuit.Spades}`]: ["Transformation", "Power", "Clarity", "Mental strength", "New beginning"],
    [`${CardValue.King}_${CardSuit.Spades}`]: ["Authoritative", "Powerful", "Intellectual", "Strategic", "Disciplined"],
    [`${CardValue.Queen}_${CardSuit.Spades}`]: ["Perceptive", "Intelligent", "Independent", "Analytical", "Discerning"],
    [`${CardValue.Jack}_${CardSuit.Spades}`]: ["Serious", "Thoughtful", "Analytical", "Strategic", "Determined"]
  };
  
  const key = `${card.value}_${card.suit}`;
  
  return keywords[key] || ["Keyword 1", "Keyword 2", "Keyword 3"];
};

/**
 * Find the position of a card in a spread
 * 
 * @param {string} cardSymbol - Card symbol (e.g., "4♣")
 * @param {Array} spread - Array of card symbols
 * @returns {number} Position of the card in the spread (0-based), or -1 if not found
 */
export const findCardPositionInSpread = (cardSymbol, spread) => {
  return spread.findIndex(card => card === cardSymbol);
};

/**
 * Get the 13-card spread starting from a position
 * 
 * @param {Array} spread - Full spread array
 * @param {number} startPosition - Starting position
 * @returns {Array} 13-card spread
 */
export const get13CardSpread = (spread, startPosition) => {
  const result = [];
  
  // Get 13 cards starting from the position, wrapping around if needed
  for (let i = 0; i < 13; i++) {
    const position = (startPosition + i) % spread.length;
    result.push(spread[position]);
  }
  
  return result;
};

/**
 * Get the absolute numeric value (1-52) for a card
 * 
 * @param {string} cardSymbol - Card symbol (e.g., "4♣")
 * @returns {number} Absolute numeric value (1-52)
 */
export const getCardAbsoluteValue = (cardSymbol) => {
  return CARD_VALUES[cardSymbol] || 1; // Default to 1 (Ace of Hearts) if not found
};

/**
 * Get card symbol from absolute numeric value (1-52)
 * 
 * @param {number} value - Absolute numeric value (1-52)
 * @returns {string} Card symbol
 */
export const getCardSymbolFromValue = (value) => {
  // Ensure value is within 1-52 range
  let adjustedValue = value;
  while (adjustedValue > 52) {
    adjustedValue -= 52;
  }
  while (adjustedValue < 1) {
    adjustedValue += 52;
  }
  
  return CARD_SYMBOLS_BY_VALUE[adjustedValue] || "A♥"; // Default to Ace of Hearts if not found
};

/**
 * Calculate combination card from two birth cards
 * 
 * @param {string} card1Symbol - First card symbol
 * @param {string} card2Symbol - Second card symbol
 * @returns {string} Combination card symbol
 */
export const calculateCombinationCard = (card1Symbol, card2Symbol) => {
  if (!card1Symbol || !card2Symbol) {
    throw new Error('Both card symbols are required to calculate combination card');
  }
  
  if (typeof card1Symbol !== 'string' || typeof card2Symbol !== 'string') {
    throw new Error('Card symbols must be strings');
  }
  
  try {
    const card1Value = getCardAbsoluteValue(card1Symbol);
    if (!card1Value || card1Value < 1 || card1Value > 52) {
      throw new Error(`Invalid card1 value: ${card1Value} from symbol ${card1Symbol}`);
    }
    
    const card2Value = getCardAbsoluteValue(card2Symbol);
    if (!card2Value || card2Value < 1 || card2Value > 52) {
      throw new Error(`Invalid card2 value: ${card2Value} from symbol ${card2Symbol}`);
    }
    
    // Add the values
    let combinationValue = card1Value + card2Value;
    
    // If sum is greater than 52, subtract 52
    if (combinationValue > 52) {
      combinationValue -= 52;
    }
    
    // Get the card symbol for this value
    const combinationSymbol = getCardSymbolFromValue(combinationValue);
    if (!combinationSymbol) {
      throw new Error(`Failed to get symbol for combination value: ${combinationValue}`);
    }
    
    return combinationSymbol;
  } catch (error) {
    console.error('Error in calculateCombinationCard:', error);
    console.error(`Inputs: card1Symbol=${card1Symbol}, card2Symbol=${card2Symbol}`);
    throw new Error(`Failed to calculate combination card: ${error.message}`);
  }
};

/**
 * Calculate POV (Point of View) card
 * 
 * @param {string} birthCardSymbol - Birth card symbol
 * @param {string} combinationCardSymbol - Combination card symbol
 * @returns {string} POV card symbol
 */
export const calculatePovCard = (birthCardSymbol, combinationCardSymbol) => {
  if (!birthCardSymbol || !combinationCardSymbol) {
    throw new Error('Both birth card and combination card symbols are required to calculate POV card');
  }
  
  if (typeof birthCardSymbol !== 'string' || typeof combinationCardSymbol !== 'string') {
    throw new Error('Card symbols must be strings');
  }
  
  try {
    const birthCardValue = getCardAbsoluteValue(birthCardSymbol);
    if (!birthCardValue || birthCardValue < 1 || birthCardValue > 52) {
      throw new Error(`Invalid birth card value: ${birthCardValue} from symbol ${birthCardSymbol}`);
    }
    
    const combinationCardValue = getCardAbsoluteValue(combinationCardSymbol);
    if (!combinationCardValue || combinationCardValue < 1 || combinationCardValue > 52) {
      throw new Error(`Invalid combination card value: ${combinationCardValue} from symbol ${combinationCardSymbol}`);
    }
    
    // Add the values
    let povValue = birthCardValue + combinationCardValue;
    
    // If sum is greater than 52, subtract 52
    if (povValue > 52) {
      povValue -= 52;
    }
    
    // Get the card symbol for this value
    const povSymbol = getCardSymbolFromValue(povValue);
    if (!povSymbol) {
      throw new Error(`Failed to get symbol for POV value: ${povValue}`);
    }
    
    return povSymbol;
  } catch (error) {
    console.error('Error in calculatePovCard:', error);
    console.error(`Inputs: birthCardSymbol=${birthCardSymbol}, combinationCardSymbol=${combinationCardSymbol}`);
    throw new Error(`Failed to calculate POV card: ${error.message}`);
  }
};

/**
 * Card Service
 * 
 * This service provides functions for working with card data,
 * including retrieving card descriptions and keywords.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

// Get the directory name (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the cards.json file
const CARDS_JSON_PATH = path.join(__dirname, '../../cards.json');

// Cache for card data
let cardDataCache = null;

/**
 * Load card data from the cards.json file
 * 
 * @returns {Promise<Array>} Array of card data
 */
const loadCardData = async () => {
  if (cardDataCache) {
    return cardDataCache;
  }
  
  try {
    const data = await readFile(CARDS_JSON_PATH, 'utf8');
    cardDataCache = JSON.parse(data);
    return cardDataCache;
  } catch (error) {
    console.error('Error loading card data:', error);
    return [];
  }
};

/**
 * Get card data by name
 * 
 * @param {string} cardName - Name of the card (e.g., "Ace of Hearts")
 * @returns {Promise<Object|null>} Card data or null if not found
 */
const getCardData = async (cardName) => {
  const cardData = await loadCardData();
  return cardData.find(card => card.Card === cardName) || null;
};

/**
 * Get card description by name
 * 
 * @param {string} cardName - Name of the card (e.g., "Ace of Hearts")
 * @returns {Promise<string|null>} Card description or null if not found
 */
const getCardDescription = async (cardName) => {
  const card = await getCardData(cardName);
  return card ? card.Description : null;
};

/**
 * Get card keywords by name
 * 
 * @param {string} cardName - Name of the card (e.g., "Ace of Hearts")
 * @returns {Promise<string|null>} Card keywords or null if not found
 */
const getCardKeywords = async (cardName) => {
  const card = await getCardData(cardName);
  return card ? card.Keywords : null;
};

/**
 * Get card position by name
 * 
 * @param {string} cardName - Name of the card (e.g., "Ace of Hearts")
 * @returns {Promise<string|null>} Card position or null if not found
 */
const getCardPosition = async (cardName) => {
  const card = await getCardData(cardName);
  return card ? card.Position : null;
};

/**
 * Get card daily karma by name
 * 
 * @param {string} cardName - Name of the card (e.g., "Ace of Hearts")
 * @returns {Promise<Object|null>} Card daily karma or null if not found
 */
const getCardDailyKarma = async (cardName) => {
  const card = await getCardData(cardName);
  return card ? card['Daily Karma'] : null;
};

/**
 * Get all cards
 * 
 * @returns {Promise<Array>} Array of all cards
 */
const getAllCards = async () => {
  return loadCardData();
};

export {
  getCardData,
  getCardDescription,
  getCardKeywords,
  getCardPosition,
  getCardDailyKarma,
  getAllCards
};

/**
 * Data loading functions for report generation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { parse } from 'csv-parse/sync';

const readFile = promisify(fs.readFile);

// Get the directory name (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the data files - relative to server root
const DATA_DIR = path.join(__dirname, '../../data');
const CARD_BIRTHS_PATH = path.join(DATA_DIR, 'Card_Births.csv');
const SPREADS_JSON_PATH = path.join(DATA_DIR, 'spreads.json');
const CARDS_JSON_PATH = path.join(DATA_DIR, 'cards.json');

// Cache for data
let cardBirthsCache = null;
let spreadsCache = null;
let cardsDataCache = null;

/**
 * Load card births data from CSV file
 * 
 * @returns {Promise<Array>} Array of card birth data
 */
export const loadCardBirths = async () => {
  if (cardBirthsCache) {
    return cardBirthsCache;
  }
  
  try {
    const data = await readFile(CARD_BIRTHS_PATH, 'utf8');
    const records = parse(data, {
      columns: true,
      skip_empty_lines: true
    });
    cardBirthsCache = records;
    return records;
  } catch (error) {
    console.error('Error loading card births data:', error);
    return [];
  }
};

/**
 * Load spreads data from JSON file
 * 
 * @returns {Promise<Object>} Spreads data object
 */
export const loadSpreads = async () => {
  if (spreadsCache) {
    return spreadsCache;
  }
  
  try {
    const data = await readFile(SPREADS_JSON_PATH, 'utf8');
    const spreads = JSON.parse(data);
    spreadsCache = spreads;
    return spreads;
  } catch (error) {
    console.error('Error loading spreads data:', error);
    return {};
  }
};

/**
 * Load cards data from JSON file
 * 
 * @returns {Promise<Array>} Array of card data
 */
export const loadCardsData = async () => {
  if (cardsDataCache) {
    return cardsDataCache;
  }
  
  try {
    const data = await readFile(CARDS_JSON_PATH, 'utf8');
    const cards = JSON.parse(data);
    cardsDataCache = cards;
    return cards;
  } catch (error) {
    console.error('Error loading cards data:', error);
    return [];
  }
};

/**
 * Get card karma information based on card name
 * 
 * @param {string} cardName - Full card name (e.g., "Ace of Hearts")
 * @returns {Promise<Object|null>} Card karma information or null if not found
 */
export const getCardKarma = async (cardName) => {
  const cardsData = await loadCardsData();
  
  // Find the card by name
  const card = cardsData.find(card => card.Card === cardName);
  
  if (!card || !card["Daily Karma"]) {
    return null;
  }
  
  return card["Daily Karma"];
};

/**
 * Get the yearly spread for a given age
 * 
 * @param {number} age - Age for the spread
 * @returns {Promise<Array>} Array of card strings in the spread
 */
export const getYearlySpread = async (age) => {
  // Calculate effective age for spread lookup (handles ages beyond 45)
  const effectiveAge = calculateEffectiveAge(age);
  const spreads = await loadSpreads();
  
  // Get the spread for the effective age
  const ageKey = `Age ${effectiveAge}`;
  return spreads[ageKey] || [];
};

/**
 * Calculate effective age for spread lookup (handles ages beyond 45)
 * 
 * @param {number} age - Actual age
 * @returns {number} Effective age for spread lookup (1-46)
 */
const calculateEffectiveAge = (age) => {
  // If age is 0-45, use it directly
  if (age >= 0 && age <= 45) {
    return age;
  }
  
  // Otherwise, cycle through (age % 46)
  // Add 1 because spreads are 0-indexed but we want 1-indexed
  return (age % 46) + 1;
};

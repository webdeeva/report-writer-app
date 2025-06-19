/**
 * Functions for calculating birth and year cards
 */

import { getDate, getMonth, getYear } from 'date-fns';
import { parseDate } from '../../utils/dateUtils.js';
import { createCard } from './cardUtils.js';
import { loadCardBirths, getYearlySpread } from './dataLoader.js';
import { CardSuit, CardValue, CARD_POSITIONS } from './constants.js';
import { findCardPositionInSpread, get13CardSpread, parseCardSymbol } from './cardUtils.js';

/**
 * Calculate birth card(s) based on birthdate
 * 
 * @param {string} birthdate - Birthdate string in ISO format (YYYY-MM-DD)
 * @returns {Promise<Array>} Array of birth cards (usually 1 card)
 */
export const calculateBirthCards = async (birthdate) => {
  // Parse the date using date-fns with useLocal=true to avoid timezone issues
  const date = parseDate(birthdate, true);
  
  // Get the month and day directly from the date-fns functions
  const month = getMonth(date) + 1; // getMonth() returns 0-11
  const day = getDate(date);
  
  // Format as MM/DD
  const birthDateKey = `${month}/${day}`;
  
  // Load card births data
  const cardBirths = await loadCardBirths();
  
  // Find the card for this birth date
  const birthCardData = cardBirths.find(record => record.Date === birthDateKey);
  
  if (!birthCardData) {
    console.error(`No birth card found for date: ${birthDateKey}`);
    // Fallback to simplified calculation
    const fallbackCard = calculateFallbackBirthCard(birthdate);
    return [fallbackCard];
  }
  
  // Debug log to verify the correct card is being found
  console.log(`Found birth card for ${birthDateKey}: ${birthCardData.Card}`);
  
  // Parse the card name to get suit and value
  const cardName = birthCardData.Card;
  const [value, suitWithOf] = cardName.split(' of ');
  const suit = suitWithOf.toLowerCase();
  
  // Map the value to the CardValue enum
  let cardValue;
  switch (value) {
    case 'Ace': cardValue = CardValue.Ace; break;
    case 'Two': cardValue = CardValue.Two; break;
    case 'Three': cardValue = CardValue.Three; break;
    case 'Four': cardValue = CardValue.Four; break;
    case 'Five': cardValue = CardValue.Five; break;
    case 'Six': cardValue = CardValue.Six; break;
    case 'Seven': cardValue = CardValue.Seven; break;
    case 'Eight': cardValue = CardValue.Eight; break;
    case 'Nine': cardValue = CardValue.Nine; break;
    case 'Ten': cardValue = CardValue.Ten; break;
    case 'Jack': cardValue = CardValue.Jack; break;
    case 'Queen': cardValue = CardValue.Queen; break;
    case 'King': cardValue = CardValue.King; break;
    default: cardValue = CardValue.Ace;
  }
  
  // Map the suit to the CardSuit enum
  let cardSuit;
  switch (suit) {
    case 'hearts': cardSuit = CardSuit.Hearts; break;
    case 'diamonds': cardSuit = CardSuit.Diamonds; break;
    case 'clubs': cardSuit = CardSuit.Clubs; break;
    case 'spades': cardSuit = CardSuit.Spades; break;
    default: cardSuit = CardSuit.Hearts;
  }
  
  return [createCard(cardSuit, cardValue)];
};

/**
 * Fallback method to calculate birth card if not found in CSV
 * 
 * @param {string} birthdate - Birthdate string in ISO format (YYYY-MM-DD)
 * @returns {Object} Birth card
 */
export const calculateFallbackBirthCard = (birthdate) => {
  // Parse the date using date-fns with useLocal=true to avoid timezone issues
  const date = parseDate(birthdate, true);
  
  // Get the date parts directly from date-fns functions
  const month = getMonth(date) + 1; // getMonth() returns 0-11
  const day = getDate(date);
  const year = getYear(date);
  
  // Calculate sum of month + day + year digits
  const yearSum = year.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  const sum = month + day + yearSum;
  
  // Adjust sum to be within 1-52 range (standard deck)
  let adjustedSum = sum;
  while (adjustedSum > 52) {
    adjustedSum -= 52;
  }
  
  // Convert to card index (0-51)
  const cardIndex = adjustedSum - 1;
  
  // Get suit and value
  const suitIndex = Math.floor(cardIndex / 13);
  const valueIndex = cardIndex % 13;
  
  const suits = [CardSuit.Hearts, CardSuit.Clubs, CardSuit.Diamonds, CardSuit.Spades];
  const values = Object.values(CardValue);
  
  const suit = suits[suitIndex];
  const value = values[valueIndex];
  
  return createCard(suit, value);
};

/**
 * Calculate year cards based on birthdate and age
 * 
 * @param {string} birthdate - Birthdate string in ISO format (YYYY-MM-DD)
 * @param {number} age - Age for which to calculate the year cards
 * @returns {Promise<Object>} Object containing year cards and displacing card
 */
export const calculateYearCards = async (birthdate, age) => {
  // Get birth card
  const birthCards = await calculateBirthCards(birthdate);
  const birthCard = birthCards[0];
  
  // Get birth card symbol
  const birthCardSymbol = `${birthCard.value}${birthCard.symbol}`;
  
  // Get spreads
  const ageSpread = await getYearlySpread(age);
  const zeroSpread = await getYearlySpread(0);
  
  // Find birth card position in age spread
  const birthCardPosition = findCardPositionInSpread(birthCardSymbol, ageSpread);
  
  if (birthCardPosition === -1) {
    console.error(`Birth card ${birthCardSymbol} not found in age ${age} spread`);
    // Fallback to simplified calculation
    const fallbackYearCard = calculateFallbackYearCard(birthdate, age);
    return {
      yearCards: [fallbackYearCard],
      displacingCard: fallbackYearCard,
      yearlySpread: []
    };
  }
  
  // Get 13-card spread starting from birth card position
  const yearlySpread = get13CardSpread(ageSpread, birthCardPosition);
  
  // Convert card symbols to card objects
  const yearCards = yearlySpread.map(cardSymbol => parseCardSymbol(cardSymbol));
  
  // Get displacing card (card at same position in Age 0 spread)
  const displacingCardSymbol = zeroSpread[birthCardPosition];
  const displacingCard = parseCardSymbol(displacingCardSymbol);
  
  return {
    yearCards,
    displacingCard,
    yearlySpread,
    positions: CARD_POSITIONS
  };
};

/**
 * Fallback method to calculate year card if spread calculation fails
 * 
 * @param {string} birthdate - Birthdate string in ISO format (YYYY-MM-DD)
 * @param {number} age - Age for which to calculate the year card
 * @returns {Object} Year card
 */
export const calculateFallbackYearCard = (birthdate, age) => {
  // This is a simplified implementation
  const birthCards = calculateFallbackBirthCard(birthdate);
  const birthCard = birthCards;
  
  // Simple algorithm for demonstration purposes
  let yearCardValue = (birthCard.numericValue + age) % 13;
  if (yearCardValue === 0) yearCardValue = 13;
  
  const yearCardSuitIndex = (Object.values(CardSuit).indexOf(birthCard.suit) + age) % 4;
  const yearCardSuit = Object.values(CardSuit)[yearCardSuitIndex];
  
  const yearCardValueEnum = Object.values(CardValue)[yearCardValue - 1];
  
  return createCard(yearCardSuit, yearCardValueEnum);
};

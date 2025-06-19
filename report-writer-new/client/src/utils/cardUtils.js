/**
 * Card Utilities
 *
 * This file contains utility functions for working with playing cards,
 * including calculating birth cards, year cards, and formatting card data.
 */
// Card suits
export var CardSuit;
(function (CardSuit) {
    CardSuit["Hearts"] = "hearts";
    CardSuit["Diamonds"] = "diamonds";
    CardSuit["Clubs"] = "clubs";
    CardSuit["Spades"] = "spades";
})(CardSuit || (CardSuit = {}));
// Card values
export var CardValue;
(function (CardValue) {
    CardValue["Ace"] = "A";
    CardValue["Two"] = "2";
    CardValue["Three"] = "3";
    CardValue["Four"] = "4";
    CardValue["Five"] = "5";
    CardValue["Six"] = "6";
    CardValue["Seven"] = "7";
    CardValue["Eight"] = "8";
    CardValue["Nine"] = "9";
    CardValue["Ten"] = "10";
    CardValue["Jack"] = "J";
    CardValue["Queen"] = "Q";
    CardValue["King"] = "K";
})(CardValue || (CardValue = {}));
// Card symbols
export const CardSymbols = {
    [CardSuit.Hearts]: '♥',
    [CardSuit.Diamonds]: '♦',
    [CardSuit.Clubs]: '♣',
    [CardSuit.Spades]: '♠'
};
// Card numeric values for calculations
const cardNumericValues = {
    [CardValue.Ace]: 1,
    [CardValue.Two]: 2,
    [CardValue.Three]: 3,
    [CardValue.Four]: 4,
    [CardValue.Five]: 5,
    [CardValue.Six]: 6,
    [CardValue.Seven]: 7,
    [CardValue.Eight]: 8,
    [CardValue.Nine]: 9,
    [CardValue.Ten]: 10,
    [CardValue.Jack]: 11,
    [CardValue.Queen]: 12,
    [CardValue.King]: 13
};
/**
 * Create a card object with all properties
 *
 * @param suit - Card suit
 * @param value - Card value
 * @returns Card object
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
 * Get all cards in a standard deck
 *
 * @returns Array of all cards
 */
export const getAllCards = () => {
    const cards = [];
    Object.values(CardSuit).forEach(suit => {
        Object.values(CardValue).forEach(value => {
            cards.push(createCard(suit, value));
        });
    });
    return cards;
};
/**
 * Calculate birth card(s) based on birthdate
 *
 * @param birthdate - Birthdate string in ISO format (YYYY-MM-DD)
 * @returns Array of birth cards (usually 1 or 2 cards)
 */
export const calculateBirthCards = (birthdate) => {
    // This is a placeholder implementation
    // In a real implementation, this would use the actual algorithm
    // for calculating birth cards based on the birthdate
    const date = new Date(birthdate);
    const month = date.getMonth() + 1; // 1-12
    const day = date.getDate(); // 1-31
    // Simple algorithm for demonstration purposes
    // In reality, this would be more complex
    const sum = month + day;
    const adjustedSum = sum > 52 ? sum - 52 : sum;
    // Convert to card index (0-51)
    const cardIndex = adjustedSum - 1;
    // Get suit and value
    const suitIndex = Math.floor(cardIndex / 13);
    const valueIndex = cardIndex % 13;
    const suits = [CardSuit.Hearts, CardSuit.Clubs, CardSuit.Diamonds, CardSuit.Spades];
    const values = Object.values(CardValue);
    const suit = suits[suitIndex];
    const value = values[valueIndex];
    return [createCard(suit, value)];
};
/**
 * Calculate year card based on birthdate and age/year
 *
 * @param birthdate - Birthdate string in ISO format (YYYY-MM-DD)
 * @param age - Age for which to calculate the year card
 * @returns Year card
 */
export const calculateYearCard = (birthdate, age) => {
    // This is a placeholder implementation
    // In a real implementation, this would use the actual algorithm
    // for calculating year cards based on the birthdate and age
    const birthCards = calculateBirthCards(birthdate);
    const birthCard = birthCards[0];
    // Simple algorithm for demonstration purposes
    // In reality, this would be more complex
    let yearCardValue = (birthCard.numericValue + age) % 13;
    if (yearCardValue === 0)
        yearCardValue = 13;
    const yearCardSuitIndex = (Object.values(CardSuit).indexOf(birthCard.suit) + age) % 4;
    const yearCardSuit = Object.values(CardSuit)[yearCardSuitIndex];
    const yearCardValueEnum = Object.values(CardValue)[yearCardValue - 1];
    return createCard(yearCardSuit, yearCardValueEnum);
};
/**
 * Format card for display
 *
 * @param card - Card object
 * @returns Formatted card string (e.g., "A♥")
 */
export const formatCard = (card) => {
    return `${card.value}${card.symbol}`;
};
/**
 * Get card color based on suit
 *
 * @param suit - Card suit
 * @returns CSS color class
 */
export const getCardColor = (suit) => {
    return suit === CardSuit.Hearts || suit === CardSuit.Diamonds
        ? 'text-red-600'
        : 'text-black';
};
/**
 * Get card description based on card
 *
 * @param card - Card object
 * @returns Card description
 */
export const getCardDescription = (card) => {
    // This is a placeholder implementation
    // In a real implementation, this would return actual card descriptions
    return `The ${card.name} represents [card meaning].`;
};

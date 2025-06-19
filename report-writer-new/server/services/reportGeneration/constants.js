/**
 * Constants and enums for card calculations and report generation
 */

// Card positions with astrological meanings
export const CARD_POSITIONS = [
  'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 
  'Uranus', 'Neptune', 'Pluto', 'Result', 'Peak', 'Moon', 
  'Earth/Transformation'
];

// Card suits
export const CardSuit = {
  Hearts: 'hearts',
  Diamonds: 'diamonds',
  Clubs: 'clubs',
  Spades: 'spades'
};

// Card values
export const CardValue = {
  Ace: 'A',
  Two: '2',
  Three: '3',
  Four: '4',
  Five: '5',
  Six: '6',
  Seven: '7',
  Eight: '8',
  Nine: '9',
  Ten: '10',
  Jack: 'J',
  Queen: 'Q',
  King: 'K'
};

// Card symbols
export const CardSymbols = {
  [CardSuit.Hearts]: '♥',
  [CardSuit.Diamonds]: '♦',
  [CardSuit.Clubs]: '♣',
  [CardSuit.Spades]: '♠'
};

// Card numeric values for calculations
export const cardNumericValues = {
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

// Absolute card values (1-52) for relationship calculations
export const CARD_VALUES = {
  "A♥": 1, "2♥": 2, "3♥": 3, "4♥": 4, "5♥": 5, "6♥": 6, "7♥": 7, "8♥": 8, "9♥": 9, "10♥": 10,
  "J♥": 11, "Q♥": 12, "K♥": 13,
  "A♣": 14, "2♣": 15, "3♣": 16, "4♣": 17, "5♣": 18, "6♣": 19, "7♣": 20, "8♣": 21, "9♣": 22, "10♣": 23,
  "J♣": 24, "Q♣": 25, "K♣": 26,
  "A♦": 27, "2♦": 28, "3♦": 29, "4♦": 30, "5♦": 31, "6♦": 32, "7♦": 33, "8♦": 34, "9♦": 35, "10♦": 36,
  "J♦": 37, "Q♦": 38, "K♦": 39,
  "A♠": 40, "2♠": 41, "3♠": 42, "4♠": 43, "5♠": 44, "6♠": 45, "7♠": 46, "8♠": 47, "9♠": 48, "10♠": 49,
  "J♠": 50, "Q♠": 51, "K♠": 52
};

// Reverse mapping from card value (1-52) to card symbol
export const CARD_SYMBOLS_BY_VALUE = {
  1: "A♥", 2: "2♥", 3: "3♥", 4: "4♥", 5: "5♥", 6: "6♥", 7: "7♥", 8: "8♥", 9: "9♥", 10: "10♥",
  11: "J♥", 12: "Q♥", 13: "K♥",
  14: "A♣", 15: "2♣", 16: "3♣", 17: "4♣", 18: "5♣", 19: "6♣", 20: "7♣", 21: "8♣", 22: "9♣", 23: "10♣",
  24: "J♣", 25: "Q♣", 26: "K♣",
  27: "A♦", 28: "2♦", 29: "3♦", 30: "4♦", 31: "5♦", 32: "6♦", 33: "7♦", 34: "8♦", 35: "9♦", 36: "10♦",
  37: "J♦", 38: "Q♦", 39: "K♦",
  40: "A♠", 41: "2♠", 42: "3♠", 43: "4♠", 44: "5♠", 45: "6♠", 46: "7♠", 47: "8♠", 48: "9♠", 49: "10♠",
  50: "J♠", 51: "Q♠", 52: "K♠"
};

/**
 * Report generator functions for different report types
 */

import { calculateAge } from '../../utils/dateUtils.js';
import { calculateBirthCards, calculateYearCards } from './cardCalculation.js';
import { 
  getCardDescription, 
  getCardKeywords, 
  getCardAbsoluteValue, 
  calculateCombinationCard, 
  calculatePovCard, 
  parseCardSymbol, 
  findCardPositionInSpread, 
  get13CardSpread 
} from './cardUtils.js';
import { loadCardsData, getYearlySpread } from './dataLoader.js';
import { CARD_POSITIONS } from './constants.js';

/**
 * Generate yearly report data
 * 
 * @param {Object} person - Person object with name and birthdate
 * @param {number} age - Age for the report (optional, defaults to current age)
 * @returns {Promise<Object>} Yearly report data
 */
export const generateYearlyReportData = async (person, age = null) => {
  // Calculate current age if not provided
  const currentAge = age !== null ? age : calculateAge(person.birthdate);
  
  // Use originalDateFormat if available, otherwise use birthdate
  const birthdateToUse = person.originalDateFormat || person.birthdate;
  
  // Calculate birth cards
  const birthCards = await calculateBirthCards(birthdateToUse);
  
  // Calculate year cards and displacing card
  const { yearCards, displacingCard, yearlySpread, positions } = await calculateYearCards(birthdateToUse, currentAge);
  
  // Get card descriptions and keywords
  const birthCardDescriptions = await Promise.all(birthCards.map(card => getCardDescription(card)));
  const birthCardKeywords = await Promise.all(birthCards.map(card => getCardKeywords(card)));
  const yearCardDescriptions = await Promise.all(yearCards.map(card => getCardDescription(card)));
  const yearCardKeywords = await Promise.all(yearCards.map(card => getCardKeywords(card)));
  const displacingCardDescription = await getCardDescription(displacingCard);
  const displacingCardKeywords = await getCardKeywords(displacingCard);
  
  // Get karma information for each card
  const cardsData = await loadCardsData();
  
  // Create spread with positions and karma information
  const spreadWithPositions = await Promise.all(yearCards.map(async (card, index) => {
    // Find the card data in cards.json
    const cardData = cardsData.find(c => c.Card === card.name);
    
    // Get karma information
    const karma = cardData ? cardData["Daily Karma"] : null;
    
    return {
      position: positions[index],
      card,
      symbol: `${card.value}${card.symbol}`,
      name: card.name,
      description: yearCardDescriptions[index],
      keywords: yearCardKeywords[index],
      karma: karma || {
        "Positive Experiences": ["No karma information available"],
        "Negative Experiences": ["No karma information available"]
      }
    };
  }));
  
  // Generate yearly influences
  const yearlyInfluences = [
    {
      title: "Personal Growth",
      description: "This year offers significant opportunities for personal growth and self-discovery. Focus on developing your inner strengths and addressing any limiting beliefs."
    },
    {
      title: "Relationships",
      description: "Your relationships will be a key area of focus this year. Existing relationships may deepen, while new connections could form that have lasting impact."
    },
    {
      title: "Career & Finances",
      description: "Professional growth is highlighted this year. Stay open to new opportunities and be willing to take calculated risks for advancement."
    }
  ];
  
  // Generate recommendations
  const recommendations = [
    "Take time for self-reflection and personal development",
    "Nurture important relationships and communicate openly",
    "Be open to new professional opportunities",
    "Maintain balance between work and personal life",
    "Pay attention to your physical and mental well-being"
  ];
  
  // Generate key dates
  const reportYear = new Date().getFullYear() + (currentAge - calculateAge(person.birthdate));
  const keyDates = [
    { date: `January 15, ${reportYear}`, description: "Potential for significant personal insight" },
    { date: `March 21, ${reportYear}`, description: "Favorable time for new beginnings" },
    { date: `June 10, ${reportYear}`, description: "Important relationship development" },
    { date: `September 5, ${reportYear}`, description: "Career opportunity or advancement" },
    { date: `November 18, ${reportYear}`, description: "Time for reflection and planning" }
  ];
  
  // Compile the report data
  return {
    person_name: person.name,
    age: currentAge,
    birthdate: person.birthdate,
    custom_age: age !== null ? age : null,
    birth_cards: birthCards,
    birth_card_name: birthCards[0].name,
    birth_card_description: birthCardDescriptions[0],
    birth_card_keywords: birthCardKeywords[0],
    year_cards: yearCards,
    year_card_name: yearCards[0].name,
    year_card_description: yearCardDescriptions[0],
    year_card_keywords: yearCardKeywords[0],
    displacing_card: displacingCard,
    displacing_card_name: displacingCard.name,
    displacing_card_description: displacingCardDescription,
    displacing_card_keywords: displacingCardKeywords,
    yearly_spread: yearlySpread,
    spread_with_positions: spreadWithPositions,
    yearly_influences: yearlyInfluences,
    recommendations: recommendations,
    key_dates: keyDates,
    generated_date: new Date().toISOString()
  };
};

/**
 * Generate life report data
 * 
 * @param {Object} person - Person object with name and birthdate
 * @returns {Promise<Object>} Life report data
 */
export const generateLifeReportData = async (person) => {
  try {
    console.log(`Starting life report data generation for ${person.name}`);
    console.log(`Person object:`, JSON.stringify(person, null, 2));
    
    // Use originalDateFormat if available otherwise use birthdate
    const birthdateToUse = person.originalDateFormat || person.birthdate;
    console.log(`Using birthdate: ${birthdateToUse} (originalDateFormat: ${person.originalDateFormat}, birthdate: ${person.birthdate})`);

    // Calculate birth cards
    const birthCards = await calculateBirthCards(birthdateToUse);
    console.log(`Birth cards calculated: ${birthCards[0].name}`);

    // Get birth card symbol
    const birthCardSymbol = `${birthCards[0].value}${birthCards[0].symbol}`;
    console.log(`Birth card symbol: ${birthCardSymbol}`);

    // Get the age 0 spread
    console.log('Getting Age 0 spread');
    const zeroSpread = await getYearlySpread(0);
    if (!zeroSpread || !Array.isArray(zeroSpread) || zeroSpread.length === 0) {
      throw new Error('Age 0 spread is empty or invalid');
    }

    // Find birth card position in age 0 spread
    console.log(`Finding position of ${birthCardSymbol} in Age 0 spread`);
    const birthCardPosition = findCardPositionInSpread(birthCardSymbol, zeroSpread);
    console.log(`Birth card position in spread: ${birthCardPosition}`);

    if (birthCardPosition === -1) {
      console.warn(`Warning: Birth card ${birthCardSymbol} not found in Age 0 spread`);
      throw new Error(`Birth card ${birthCardSymbol} not found in Age 0 spread`);
    }

    // Get 13-card spread starting from birth card position
    console.log('Getting 13-card spread for life report');
    const lifeSpreadSymbols = get13CardSpread(zeroSpread, birthCardPosition);
    console.log(`Life spread symbols: ${lifeSpreadSymbols.join(', ')}`);

    // Convert card symbols to card objects
    const lifeCards = lifeSpreadSymbols.map(cardSymbol => parseCardSymbol(cardSymbol));

    // Get card descriptions and keywords
    const birthCardDescriptions = await Promise.all(birthCards.map(card => getCardDescription(card)));
    const birthCardKeywords = await Promise.all(birthCards.map(card => getCardKeywords(card)));
    const lifeCardDescriptions = await Promise.all(lifeCards.map(card => getCardDescription(card)));
    const lifeCardKeywords = await Promise.all(lifeCards.map(card => getCardKeywords(card)));

    // Get karma information for each card
    const cardsData = await loadCardsData();

      // Create spread with positions and karma information
      const spreadWithPositions = await Promise.all(lifeCards.map(async (card, index) => {
        // Find the card data in cards.json
        const cardData = cardsData.find(c => c.Card === card.name);
        
        // Get karma information
        const karma = cardData ? cardData["Daily Karma"] : null;
        
        return {
          position: CARD_POSITIONS[index],
          card,
          symbol: `${card.value}${card.symbol}`,
          name: card.name,
          description: lifeCardDescriptions[index],
          keywords: lifeCardKeywords[index],
          karma: karma || {
            "Positive Experiences": ["No karma information available"],
            "Negative Experiences": ["No karma information available"]
          }
        };
      }));

    // Generate life path description
    const lifePathDescription = "Your life path is characterized by your birth card and the 13-card spread from the age 0 spread. This path offers both challenges and opportunities for growth throughout your life journey.";

    // Generate personality overview
    const personalityOverview = "Your personality is characterized by your birth card and the cards in your life spread. You have natural strengths and may face challenges in various areas of life.";

    // Generate personality traits
    const personalityTraits = [
      { title: "Strengths", description: "Your natural strengths are reflected in your birth card and life spread." },
      { title: "Challenges", description: "Areas for growth are indicated by challenging cards in your life spread." },
      { title: "Communication Style", description: "Your communication style is influenced by your birth card and the Mercury position in your life spread." }
    ];

    // Generate challenges
    const challenges = [
      "Balancing different aspects of life",
      "Overcoming tendencies shown in challenging cards",
      "Developing qualities indicated by your life spread",
      "Learning to set healthy boundaries",
      "Finding balance between work and personal life"
    ];
    
    // Generate opportunities
    const opportunities = [
      "Developing your natural talents shown in your birth card",
      "Building meaningful relationships through understanding your Venus card",
      "Finding fulfillment through activities aligned with your life spread",
      "Making a positive impact through your Jupiter card",
      "Personal growth through understanding your life spread"
    ];
    
    // Generate recommendations
    const recommendations = [
      "Focus on developing your strengths shown in your birth card",
      "Practice mindfulness and self-reflection",
      "Seek balance in all aspects of life",
      "Nurture meaningful relationships",
      "Pursue activities that align with your values"
    ];
    
    // Compile the report data
    return {
      person_name: person.name,
      birthdate: person.birthdate,
      birth_cards: birthCards,
      birth_card_name: birthCards[0].name,
      birth_card_description: birthCardDescriptions[0],
      birth_card_keywords: birthCardKeywords[0],
      life_cards: lifeCards,
      life_spread_symbols: lifeSpreadSymbols,
      spread_with_positions: spreadWithPositions,
      life_path_description: lifePathDescription,
      personality_overview: personalityOverview,
      personality_traits: personalityTraits,
      challenges: challenges,
      opportunities: opportunities,
      recommendations: recommendations,
      generated_date: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in generateLifeReportData:', error);
    console.error('Error stack:', error.stack);
    throw error; // Re-throw the error to be handled by the caller
  }
};

/**
 * Generate relationship report data
 * 
 * @param {Object} person1 - First person object with name and birthdate
 * @param {Object} person2 - Second person object with name and birthdate
 * @returns {Promise<Object>} Relationship report data
 */
export const generateRelationshipReportData = async (person1, person2) => {
  try {
    console.log(`Starting relationship report data generation for ${person1.name} and ${person2.name}`);
    
    // Validate input parameters
    if (!person1 || !person2) {
      throw new Error('Both person1 and person2 are required');
    }
    
    if (!person1.birthdate || !person2.birthdate) {
      throw new Error('Both people must have birthdates');
    }
    
    // Use originalDateFormat if available, otherwise use birthdate
    const person1BirthdateToUse = person1.originalDateFormat || person1.birthdate;
    const person2BirthdateToUse = person2.originalDateFormat || person2.birthdate;
    
    console.log(`Using birthdates: ${person1BirthdateToUse} and ${person2BirthdateToUse}`);
    
    // Calculate birth cards for both people
    let person1BirthCards, person2BirthCards;
    try {
      console.log(`Calculating birth cards for ${person1.name}`);
      person1BirthCards = await calculateBirthCards(person1BirthdateToUse);
      
      console.log(`Calculating birth cards for ${person2.name}`);
      person2BirthCards = await calculateBirthCards(person2BirthdateToUse);
    } catch (error) {
      console.error('Error calculating birth cards:', error);
      throw new Error(`Failed to calculate birth cards: ${error.message}`);
    }
    
    if (!person1BirthCards || !person1BirthCards.length || !person2BirthCards || !person2BirthCards.length) {
      throw new Error('Failed to calculate birth cards for one or both people');
    }
    
    console.log(`Birth cards calculated: ${person1.name} - ${person1BirthCards[0].name}, ${person2.name} - ${person2BirthCards[0].name}`);
    
    // Get birth card symbols
    const person1BirthCardSymbol = `${person1BirthCards[0].value}${person1BirthCards[0].symbol}`;
    const person2BirthCardSymbol = `${person2BirthCards[0].value}${person2BirthCards[0].symbol}`;
    
    console.log(`Birth card symbols: ${person1BirthCardSymbol} and ${person2BirthCardSymbol}`);
    
    // Get absolute numeric values (1-52) for birth cards
    let person1CardValue, person2CardValue;
    try {
      person1CardValue = getCardAbsoluteValue(person1BirthCardSymbol);
      person2CardValue = getCardAbsoluteValue(person2BirthCardSymbol);
      console.log(`Card values: ${person1CardValue} and ${person2CardValue}`);
    } catch (error) {
      console.error('Error getting card absolute values:', error);
      throw new Error(`Failed to get card absolute values: ${error.message}`);
    }
    
    // Calculate combination card
    let combinationCardSymbol, combinationCard, combinationCardValue;
    try {
      console.log(`Calculating combination card from ${person1BirthCardSymbol} and ${person2BirthCardSymbol}`);
      combinationCardSymbol = calculateCombinationCard(person1BirthCardSymbol, person2BirthCardSymbol);
      combinationCard = parseCardSymbol(combinationCardSymbol);
      combinationCardValue = getCardAbsoluteValue(combinationCardSymbol);
      console.log(`Combination card: ${combinationCardSymbol}, value: ${combinationCardValue}`);
    } catch (error) {
      console.error('Error calculating combination card:', error);
      throw new Error(`Failed to calculate combination card: ${error.message}`);
    }
    
    // Calculate POV cards
    let person1PovCardSymbol, person2PovCardSymbol, person1PovCard, person2PovCard, person1PovCardValue, person2PovCardValue;
    try {
      console.log('Calculating POV cards');
      person1PovCardSymbol = calculatePovCard(person1BirthCardSymbol, combinationCardSymbol);
      person2PovCardSymbol = calculatePovCard(person2BirthCardSymbol, combinationCardSymbol);
      person1PovCard = parseCardSymbol(person1PovCardSymbol);
      person2PovCard = parseCardSymbol(person2PovCardSymbol);
      person1PovCardValue = getCardAbsoluteValue(person1PovCardSymbol);
      person2PovCardValue = getCardAbsoluteValue(person2PovCardSymbol);
      console.log(`POV cards: ${person1PovCardSymbol} (${person1PovCardValue}) and ${person2PovCardSymbol} (${person2PovCardValue})`);
    } catch (error) {
      console.error('Error calculating POV cards:', error);
      throw new Error(`Failed to calculate POV cards: ${error.message}`);
    }
    
    // Get card descriptions and keywords
    let person1CardDescription, person2CardDescription, combinationCardDescription, person1PovCardDescription, person2PovCardDescription;
    let person1CardKeywords, person2CardKeywords, combinationCardKeywords, person1PovCardKeywords, person2PovCardKeywords;
    
    try {
      console.log('Getting card descriptions and keywords');
      person1CardDescription = await getCardDescription(person1BirthCards[0]);
      person2CardDescription = await getCardDescription(person2BirthCards[0]);
      combinationCardDescription = await getCardDescription(combinationCard);
      person1PovCardDescription = await getCardDescription(person1PovCard);
      person2PovCardDescription = await getCardDescription(person2PovCard);
      
      person1CardKeywords = await getCardKeywords(person1BirthCards[0]);
      person2CardKeywords = await getCardKeywords(person2BirthCards[0]);
      combinationCardKeywords = await getCardKeywords(combinationCard);
      person1PovCardKeywords = await getCardKeywords(person1PovCard);
      person2PovCardKeywords = await getCardKeywords(person2PovCard);
      console.log('Successfully retrieved card descriptions and keywords');
    } catch (error) {
      console.error('Error getting card descriptions or keywords:', error);
      throw new Error(`Failed to get card descriptions or keywords: ${error.message}`);
    }
    
    // Get the spread for the combination card from Age 0
    let zeroSpread, combinationCardPosition;
    try {
      console.log('Getting Age 0 spread');
      zeroSpread = await getYearlySpread(0);
      if (!zeroSpread || !Array.isArray(zeroSpread) || zeroSpread.length === 0) {
        throw new Error('Age 0 spread is empty or invalid');
      }
      
      console.log(`Finding position of ${combinationCardSymbol} in Age 0 spread`);
      combinationCardPosition = findCardPositionInSpread(combinationCardSymbol, zeroSpread);
      console.log(`Combination card position in spread: ${combinationCardPosition}`);
      
      if (combinationCardPosition === -1) {
        console.warn(`Warning: Combination card ${combinationCardSymbol} not found in Age 0 spread`);
      }
    } catch (error) {
      console.error('Error getting Age 0 spread or finding card position:', error);
      throw new Error(`Failed to get Age 0 spread or find card position: ${error.message}`);
    }
    
    // Get 13-card spread starting from combination card position
    let spreadSymbols = [];
    try {
      if (combinationCardPosition !== -1) {
        console.log('Getting 13-card spread');
        spreadSymbols = get13CardSpread(zeroSpread, combinationCardPosition);
        console.log(`Spread symbols: ${spreadSymbols.join(', ')}`);
      } else {
        console.warn('No spread symbols generated because combination card was not found in Age 0 spread');
        // Provide a default set of cards as fallback
        spreadSymbols = ["A♥", "2♥", "3♥", "4♥", "5♥", "6♥", "7♥", "8♥", "9♥", "10♥", "J♥", "Q♥", "K♥"];
      }
    } catch (error) {
      console.error('Error generating spread symbols:', error);
      throw new Error(`Failed to generate spread symbols: ${error.message}`);
    }
    
    // Get karma information for each card
    let cardsData;
    try {
      console.log('Loading cards data for karma information');
      cardsData = await loadCardsData();
      if (!cardsData || !Array.isArray(cardsData) || cardsData.length === 0) {
        console.warn('Warning: Cards data is empty or invalid');
        cardsData = []; // Use empty array as fallback
      }
    } catch (error) {
      console.error('Error loading cards data:', error);
      console.warn('Using empty cards data as fallback');
      cardsData = []; // Use empty array as fallback
    }
    
    // Create spread with positions and karma information
    let spreadWithPositions;
    try {
      console.log('Creating spread with positions and karma information');
      
      // Process the spread cards to create objects with card details
      const processedSpreadCards = await Promise.all(spreadSymbols.map(async (symbol, index) => {
        try {
          const card = parseCardSymbol(symbol);
          const description = await getCardDescription(card);
          const keywords = await getCardKeywords(card);
          const value = getCardAbsoluteValue(symbol);
          
          // Find the card data in cards.json
          const cardData = cardsData.find(c => c.Card === card.name);
          
          // Get karma information
          const karma = cardData ? cardData["Daily Karma"] : null;
          
          return {
            position: CARD_POSITIONS[index], // Assign position based on index in CARD_POSITIONS
            symbol,
            card,
            description,
            keywords,
            value,
            karma: karma || {
              "Positive Experiences": ["No karma information available"],
              "Negative Experiences": ["No karma information available"]
            }
          };
        } catch (cardError) {
          console.error(`Error processing spread card ${symbol}:`, cardError);
          // Return a default card object instead of failing the entire process
          return {
            position: CARD_POSITIONS[index], // Assign position based on index in CARD_POSITIONS
            symbol,
            card: parseCardSymbol("A♥"), // Default to Ace of Hearts
            description: `Error processing card ${symbol}: ${cardError.message}`,
            keywords: ["Error"],
            value: 1,
            karma: {
              "Positive Experiences": ["No karma information available"],
              "Negative Experiences": ["No karma information available"]
            }
          };
        }
      }));
      
      // Create the final spreadWithPositions array
      spreadWithPositions = processedSpreadCards;
      
      console.log(`Successfully created spread with ${spreadWithPositions.length} positions`);
    } catch (error) {
      console.error('Error creating spread with positions:', error);
      throw new Error(`Failed to create spread with positions: ${error.message}`);
    }
    
    // Calculate compatibility score (1-10)
    // This is a simplified implementation
    const compatibilityScore = Math.floor(Math.random() * 5) + 6; // 6-10 for demo purposes
    
    // Generate compatibility overview
    const compatibilityOverview = `${person1.name} and ${person2.name} have a compatibility score of ${compatibilityScore}/10. Their relationship is characterized by the combination card ${combinationCard.name} (${combinationCardSymbol}).`;
    
    // Generate connection description
    const connectionDescription = `The connection between ${person1.name} and ${person2.name} is represented by the ${combinationCard.name} (${combinationCardSymbol}), which has a value of ${combinationCardValue}. This card is calculated by adding the values of their birth cards: ${person1CardValue} + ${person2CardValue} = ${combinationCardValue}.`;
    
    // Generate relationship dynamics
    const relationshipDynamics = [
      { title: "Communication", description: `Communication between these individuals is influenced by their POV cards: ${person1.name}'s ${person1PovCard.name} (${person1PovCardSymbol}) and ${person2.name}'s ${person2PovCard.name} (${person2PovCardSymbol}).` },
      { title: "Emotional Connection", description: `The emotional connection is represented by the combination card ${combinationCard.name} (${combinationCardSymbol}).` },
      { title: "Conflict Resolution", description: `When conflicts arise, these individuals approach them through the lens of their POV cards.` },
      { title: "Shared Values", description: `Their shared values are reflected in the combination card ${combinationCard.name} (${combinationCardSymbol}).` }
    ];
    
    // Generate strengths
    const strengths = [
      "Strong communication and understanding",
      "Complementary personality traits",
      "Shared values and goals",
      "Mutual respect and support",
      "Balance of different perspectives"
    ];
    
    // Generate challenges
    const challenges = [
      "Different communication styles",
      "Balancing independence and togetherness",
      "Managing expectations",
      "Navigating differences in priorities",
      "Handling stress and pressure"
    ];
    
    // Generate personality comparison
    const personalityComparison = [
      { name: "Birth Card", person1_value: `${person1BirthCards[0].name} (${person1BirthCardSymbol}) - Value: ${person1CardValue}`, person2_value: `${person2BirthCards[0].name} (${person2BirthCardSymbol}) - Value: ${person2CardValue}` },
      { name: "POV Card", person1_value: `${person1PovCard.name} (${person1PovCardSymbol}) - Value: ${person1PovCardValue}`, person2_value: `${person2PovCard.name} (${person2PovCardSymbol}) - Value: ${person2PovCardValue}` },
      { name: "Communication Style", person1_value: "Direct", person2_value: "Thoughtful" },
      { name: "Decision Making", person1_value: "Analytical", person2_value: "Intuitive" },
      { name: "Conflict Style", person1_value: "Assertive", person2_value: "Accommodating" }
    ];
    
    // Generate recommendations
    const recommendations = [
      "Practice active listening and open communication",
      "Respect each other's differences and boundaries",
      "Make time for shared activities and experiences",
      "Support each other's individual goals and interests",
      "Regularly check in with each other about the relationship"
    ];
    
    // Compile the report data
    console.log('Compiling final relationship report data');
    const reportData = {
      person1_name: person1.name,
      person2_name: person2.name,
      person1_birthdate: person1.birthdate,
      person2_birthdate: person2.birthdate,
      person1_cards: person1BirthCards,
      person2_cards: person2BirthCards,
      person1_card_name: person1BirthCards[0].name,
      person2_card_name: person2BirthCards[0].name,
      person1_card_symbol: person1BirthCardSymbol,
      person2_card_symbol: person2BirthCardSymbol,
      person1_card_value: person1CardValue,
      person2_card_value: person2CardValue,
      person1_description: person1CardDescription,
      person2_description: person2CardDescription,
      person1_keywords: person1CardKeywords,
      person2_keywords: person2CardKeywords,
      
      combination_card: combinationCard,
      combination_card_symbol: combinationCardSymbol,
      combination_card_value: combinationCardValue,
      combination_card_description: combinationCardDescription,
      combination_card_keywords: combinationCardKeywords,
      
      person1_pov_card: person1PovCard,
      person2_pov_card: person2PovCard,
      person1_pov_card_symbol: person1PovCardSymbol,
      person2_pov_card_symbol: person2PovCardSymbol,
      person1_pov_card_value: person1PovCardValue,
      person2_pov_card_value: person2PovCardValue,
      person1_pov_card_description: person1PovCardDescription,
      person2_pov_card_description: person2PovCardDescription,
      person1_pov_card_keywords: person1PovCardKeywords,
      person2_pov_card_keywords: person2PovCardKeywords,
      
      spread_with_positions: spreadWithPositions,
      
      compatibility_overview: compatibilityOverview,
      compatibility_score: compatibilityScore,
      connection_description: connectionDescription,
      relationship_dynamics: relationshipDynamics,
      strengths: strengths,
      challenges: challenges,
      personality_comparison: personalityComparison,
      recommendations: recommendations,
      generated_date: new Date().toISOString()
    };
    
    console.log('Successfully generated relationship report data');
    return reportData;
  } catch (error) {
    console.error('Error in generateRelationshipReportData:', error);
    console.error('Error stack:', error.stack);
    throw error; // Re-throw the error to be handled by the caller
  }
};

/**
 * Generate debug information for yearly report generation
 * 
 * @param {Object} person - Person object with name and birthdate
 * @param {number} age - Age for the report (optional, defaults to current age)
 * @returns {Promise<Object>} Debug information
 */
export const generateYearlyReportDebugInfo = async (person, age = null) => {
  // Calculate current age if not provided
  const currentAge = age !== null ? age : calculateAge(person.birthdate);
  
  // Use originalDateFormat if available, otherwise use birthdate
  const birthdateToUse = person.originalDateFormat || person.birthdate;
  
  // Debug information object
  const debugInfo = {
    input: {
      person: { ...person },
      age: currentAge,
      birthdateToUse
    },
    steps: [],
    errors: []
  };
  
  try {
    // Step 1: Calculate birth cards
    debugInfo.steps.push({ step: 'Calculate birth cards', status: 'started' });
    const birthCards = await calculateBirthCards(birthdateToUse);
    debugInfo.steps[0].status = 'completed';
    debugInfo.steps[0].result = birthCards;
    
    // Step 2: Calculate year cards and displacing card
    debugInfo.steps.push({ step: 'Calculate year cards and displacing card', status: 'started' });
    const { yearCards, displacingCard, yearlySpread, positions } = await calculateYearCards(birthdateToUse, currentAge);
    debugInfo.steps[1].status = 'completed';
    debugInfo.steps[1].result = { yearCards, displacingCard, yearlySpread, positions };
    
    // Step 3: Get card descriptions and keywords
    debugInfo.steps.push({ step: 'Get card descriptions and keywords', status: 'started' });
    const birthCardDescriptions = await Promise.all(birthCards.map(card => getCardDescription(card)));
    const birthCardKeywords = await Promise.all(birthCards.map(card => getCardKeywords(card)));
    const yearCardDescriptions = await Promise.all(yearCards.map(card => getCardDescription(card)));
    const yearCardKeywords = await Promise.all(yearCards.map(card => getCardKeywords(card)));
    const displacingCardDescription = await getCardDescription(displacingCard);
    const displacingCardKeywords = await getCardKeywords(displacingCard);
    debugInfo.steps[2].status = 'completed';
    debugInfo.steps[2].result = {
      birthCardDescriptions,
      birthCardKeywords,
      yearCardDescriptions,
      yearCardKeywords,
      displacingCardDescription,
      displacingCardKeywords
    };
    
    // Step 4: Get karma information for each card
    debugInfo.steps.push({ step: 'Get karma information for each card', status: 'started' });
    const cardsData = await loadCardsData();
    debugInfo.steps[3].status = 'completed';
    debugInfo.steps[3].cardsDataLoaded = !!cardsData;
    debugInfo.steps[3].cardsDataLength = cardsData ? cardsData.length : 0;
    
    // Step 5: Create spread with positions and karma information
    debugInfo.steps.push({ step: 'Create spread with positions and karma information', status: 'started' });
    const spreadWithPositions = await Promise.all(yearCards.map(async (card, index) => {
      // Find the card data in cards.json
      const cardData = cardsData.find(c => c.Card === card.name);
      
      // Get karma information
      const karma = cardData ? cardData["Daily Karma"] : null;
      
      return {
        position: positions[index],
        card,
        symbol: `${card.value}${card.symbol}`,
        name: card.name,
        description: yearCardDescriptions[index],
        keywords: yearCardKeywords[index],
        karma: karma || {
          "Positive Experiences": ["No karma information available"],
          "Negative Experiences": ["No karma information available"]
        }
      };
    }));
    debugInfo.steps[4].status = 'completed';
    debugInfo.steps[4].result = spreadWithPositions;
    
    // Step 6: Generate yearly influences, recommendations, and key dates
    debugInfo.steps.push({ step: 'Generate yearly influences, recommendations, and key dates', status: 'started' });
    const yearlyInfluences = [
      {
        title: "Personal Growth",
        description: "This year offers significant opportunities for personal growth and self-discovery. Focus on developing your inner strengths and addressing any limiting beliefs."
      },
      {
        title: "Relationships",
        description: "Your relationships will be a key area of focus this year. Existing relationships may deepen, while new connections could form that have lasting impact."
      },
      {
        title: "Career & Finances",
        description: "Professional growth is highlighted this year. Stay open to new opportunities and be willing to take calculated risks for advancement."
      }
    ];
    
    const recommendations = [
      "Take time for self-reflection and personal development",
      "Nurture important relationships and communicate openly",
      "Be open to new professional opportunities",
      "Maintain balance between work and personal life",
      "Pay attention to your physical and mental well-being"
    ];
    
    const reportYear = new Date().getFullYear() + (currentAge - calculateAge(person.birthdate));
    const keyDates = [
      { date: `January 15, ${reportYear}`, description: "Potential for significant personal insight" },
      { date: `March 21, ${reportYear}`, description: "Favorable time for new beginnings" },
      { date: `June 10, ${reportYear}`, description: "Important relationship development" },
      { date: `September 5, ${reportYear}`, description: "Career opportunity or advancement" },
      { date: `November 18, ${reportYear}`, description: "Time for reflection and planning" }
    ];
    debugInfo.steps[5].status = 'completed';
    debugInfo.steps[5].result = { yearlyInfluences, recommendations, keyDates };
    
    // Step 7: Compile the report data
    debugInfo.steps.push({ step: 'Compile the report data', status: 'started' });
    const reportData = {
      person_name: person.name,
      age: currentAge,
      birthdate: person.birthdate,
      custom_age: age !== null ? age : null,
      birth_cards: birthCards,
      birth_card_name: birthCards[0].name,
      birth_card_description: birthCardDescriptions[0],
      birth_card_keywords: birthCardKeywords[0],
      year_cards: yearCards,
      year_card_name: yearCards[0].name,
      year_card_description: yearCardDescriptions[0],
      year_card_keywords: yearCardKeywords[0],
      displacing_card: displacingCard,
      displacing_card_name: displacingCard.name,
      displacing_card_description: displacingCardDescription,
      displacing_card_keywords: displacingCardKeywords,
      yearly_spread: yearlySpread,
      spread_with_positions: spreadWithPositions,
      yearly_influences: yearlyInfluences,
      recommendations: recommendations,
      key_dates: keyDates,
      generated_date: new Date().toISOString()
    };
    debugInfo.steps[6].status = 'completed';
    debugInfo.steps[6].result = reportData;
    
    // Add the final report data to the debug info
    debugInfo.reportData = reportData;
    
  } catch (error) {
    // Log any errors that occur during the process
    debugInfo.errors.push({
      message: error.message,
      stack: error.stack,
      step: debugInfo.steps.length > 0 ? debugInfo.steps[debugInfo.steps.length - 1].step : 'Unknown'
    });
    
    // Mark the current step as failed
    if (debugInfo.steps.length > 0) {
      debugInfo.steps[debugInfo.steps.length - 1].status = 'failed';
      debugInfo.steps[debugInfo.steps.length - 1].error = error.message;
    }
  }
  
  return debugInfo;
};

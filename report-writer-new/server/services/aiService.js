/**
 * AI Service
 * 
 * This service provides functions for interacting with AI models like OpenAI/OpenRouter
 * to generate report content based on card data and prompts.
 */

import fetch from 'node-fetch';
import { getCardDescription, getCardKeywords } from './cardService.js';
import {
  // Import prompts from promptService.js
  yearlyReportPrompt,
  yearlyReportPromptChunk1,
  yearlyReportPromptChunk2,
  yearlyReportPromptChunk3,
  yearlyReportPromptChunk4,
  lifeReportPrompt,
  lifeReportPromptChunk1,
  lifeReportPromptChunk2,
  lifeReportPromptChunk3,
  lifeReportPromptChunk4,
  relationshipReportPrompt,
  relationshipReportPromptChunk1,
  relationshipReportPromptChunk2,
  relationshipReportPromptChunk3,
  relationshipReportPromptChunk4,
  relationshipReportPromptChunk5,
  financialReportPrompt,
  financialReportPromptChunk1,
  financialReportPromptChunk2,
  financialReportPromptChunk3,
  financialReportPromptChunk4,
  singlesReportPrompt,
  singlesReportPromptChunk1,
  singlesReportPromptChunk2,
  singlesReportPromptChunk3,
  singlesReportPromptChunk4,
  childrensLifeReportPrompt,
  childrensLifeReportPromptChunk1,
  childrensLifeReportPromptChunk2,
  childrensLifeReportPromptChunk3,
  childrensLifeReportPromptChunk4
} from './promptService.js';

// Default model to use
const DEFAULT_MODEL = 'anthropic/claude-3.7-sonnet';

/**
 * Format a card for inclusion in a prompt
 * 
 * @param {Object} card - Card object
 * @returns {Object} Formatted card data
 */
const formatCardForPrompt = async (card) => {
  const description = await getCardDescription(card.name);
  const keywords = await getCardKeywords(card.name);
  
  return {
    name: card.name,
    symbol: `${card.value}${card.symbol}`,
    description: description || `The ${card.name} represents [card meaning].`,
    keywords: keywords ? keywords.split(',').map(k => k.trim()) : ['Keyword 1', 'Keyword 2', 'Keyword 3']
  };
};

/**
 * Prepare a yearly report prompt
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt
 */
const prepareYearlyReportPrompt = async (data) => {
  // Format birth card
  const birthCard = data.birth_cards[0];
  const formattedBirthCard = await formatCardForPrompt(birthCard);
  
  // Format displacing card (year card)
  const displacingCard = data.displacing_card;
  const formattedDisplacingCard = await formatCardForPrompt(displacingCard);
  
  // Format yearly spread using the spread_with_positions data
  const yearlySpread = [];
  
  // Check if spread_with_positions exists and is an array
  if (data.spread_with_positions && Array.isArray(data.spread_with_positions)) {
    // Use the actual spread data from the report generation service
    for (const item of data.spread_with_positions) {
      const formattedCard = await formatCardForPrompt(item.card);
      yearlySpread.push({
        position: item.position,
        card: formattedCard
      });
    }
  } else {
    console.warn('No spread_with_positions data found, using fallback');
    // Fallback to using just the birth card and year cards as examples
    yearlySpread.push({
      position: 'Mercury',
      card: formattedBirthCard
    });
    yearlySpread.push({
      position: 'Venus',
      card: formattedDisplacingCard
    });
  }
  
  // Format the spread info
  const spreadInfo = yearlySpread.map(item => 
    `**${item.position}**: ${item.card.name} (${item.card.symbol})\n` +
    `- **Keywords**: ${item.card.keywords.join(', ')}\n` +
    `- **Description**: ${item.card.description}\n`
  ).join('\n');
  
  // Replace placeholders in the prompt template
  let prompt = yearlyReportPrompt
    .replace('[Birth Card Name]', formattedBirthCard.name)
    .replace('[Birth Card Keywords]', formattedBirthCard.keywords.join(', '))
    .replace('[Birth Card Description]', formattedBirthCard.description)
    .replace('[Displacing Card Name]', formattedDisplacingCard.name)
    .replace('[Displacing Card Keywords]', formattedDisplacingCard.keywords.join(', '))
    .replace('[Displacing Card Description]', formattedDisplacingCard.description)
    .replace('[Formatted Spread Info with each card position, name, keywords, and description]', spreadInfo);
  
  return prompt;
};

/**
 * Prepare a life report prompt
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt
 */
const prepareLifeReportPrompt = async (data) => {
  console.log('Preparing life report prompt');
  
  // Format birth card
  const birthCard = data.birth_cards[0];
  const formattedBirthCard = await formatCardForPrompt(birthCard);
  
  // Format life spread using the spread_with_positions data
  const lifeSpread = [];
  
  // Check if spread_with_positions exists and is an array
  if (data.spread_with_positions && Array.isArray(data.spread_with_positions)) {
    console.log(`Found ${data.spread_with_positions.length} cards in spread_with_positions`);
    
    // Use the actual spread data from the report generation service
    for (const item of data.spread_with_positions) {
      const formattedCard = await formatCardForPrompt(item.card);
      lifeSpread.push({
        position: item.position,
        card: formattedCard
      });
    }
  } else {
    console.warn('No spread_with_positions data found for life report, using fallback');
    // Fallback to using just the birth card as an example
    lifeSpread.push({
      position: 'Mercury',
      card: formattedBirthCard
    });
  }
  
  // Format the spread info
  const spreadInfo = lifeSpread.map(item => 
    `**${item.position}**: ${item.card.name} (${item.card.symbol})\n` +
    `- **Keywords**: ${item.card.keywords.join(', ')}\n` +
    `- **Description**: ${item.card.description}\n`
  ).join('\n');
  
  console.log(`Formatted ${lifeSpread.length} cards for life report prompt`);
  
  // Replace placeholders in the prompt template
  let prompt = lifeReportPrompt
    .replace('[Birth Card Name]', formattedBirthCard.name)
    .replace('[Birth Card Keywords]', formattedBirthCard.keywords.join(', '))
    .replace('[Birth Card Description]', formattedBirthCard.description)
    .replace('[Formatted Spread Info with each card position, name, keywords, and description]', spreadInfo);
  
  return prompt;
};

/**
 * Prepare a relationship report prompt
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt
 */
const prepareRelationshipReportPrompt = async (data) => {
  // Format person 1 birth card
  const person1BirthCard = data.person1_cards[0];
  const formattedPerson1BirthCard = await formatCardForPrompt(person1BirthCard);
  
  // Format person 2 birth card
  const person2BirthCard = data.person2_cards[0];
  const formattedPerson2BirthCard = await formatCardForPrompt(person2BirthCard);
  
  // Format POV cards (in a real implementation, these would be calculated)
  const person1POVCard = person1BirthCard; // Placeholder
  const person2POVCard = person2BirthCard; // Placeholder
  const formattedPerson1POVCard = await formatCardForPrompt(person1POVCard);
  const formattedPerson2POVCard = await formatCardForPrompt(person2POVCard);
  
  // Format combination card (in a real implementation, this would be calculated)
  const combinationCard = person1BirthCard; // Placeholder
  const formattedCombinationCard = await formatCardForPrompt(combinationCard);
  
  // Format relationship spread
  const relationshipSpread = [];
  // In a real implementation, this would format all cards in the relationship spread
  // For now, we'll just use the birth cards as examples
  relationshipSpread.push({
    position: 'Mercury',
    card: formattedPerson1BirthCard
  });
  relationshipSpread.push({
    position: 'Venus',
    card: formattedPerson2BirthCard
  });
  
  // Format the spread info
  const spreadInfo = relationshipSpread.map(item => 
    `**${item.position}**: ${item.card.name} (${item.card.symbol})\n` +
    `- **Keywords**: ${item.card.keywords.join(', ')}\n` +
    `- **Description**: ${item.card.description}\n`
  ).join('\n');
  
  // Replace placeholders in the prompt template
  let prompt = relationshipReportPrompt
    .replace(/\[Person 1 Name\]/g, data.person1_name)
    .replace(/\[Person 2 Name\]/g, data.person2_name)
    .replace('[Person 1 Birth Card]', formattedPerson1BirthCard.name)
    .replace('[Person 1 Keywords]', formattedPerson1BirthCard.keywords.join(', '))
    .replace('[Person 1 Description]', formattedPerson1BirthCard.description)
    .replace('[Person 1 POV Card]', formattedPerson1POVCard.name)
    .replace('[Person 1 POV Keywords]', formattedPerson1POVCard.keywords.join(', '))
    .replace('[Person 1 POV Description]', formattedPerson1POVCard.description)
    .replace('[Person 2 Birth Card]', formattedPerson2BirthCard.name)
    .replace('[Person 2 Keywords]', formattedPerson2BirthCard.keywords.join(', '))
    .replace('[Person 2 Description]', formattedPerson2BirthCard.description)
    .replace('[Person 2 POV Card]', formattedPerson2POVCard.name)
    .replace('[Person 2 POV Keywords]', formattedPerson2POVCard.keywords.join(', '))
    .replace('[Person 2 POV Description]', formattedPerson2POVCard.description)
    .replace('[Combination Card]', formattedCombinationCard.name)
    .replace('[Combination Keywords]', formattedCombinationCard.keywords.join(', '))
    .replace('[Combination Description]', formattedCombinationCard.description)
    .replace('[Formatted Spread Info with each card position, name, keywords, and description]', spreadInfo);
  
  return prompt;
};

/**
 * Generate report content using an AI model
 * 
 * @param {string} prompt - Formatted prompt
 * @param {Object} options - Additional options
 * @param {string} options.model - AI model to use
 * @param {number} options.maxTokens - Maximum tokens to generate
 * @returns {Object} Generated content and metadata
 */
const generateReportContent = async (prompt, options = {}) => {
  const { 
    model = DEFAULT_MODEL, 
    maxTokens = 4000 
  } = options;
  
  // Hardcoded API key for testing
  const apiKey = "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";
  
  console.log('Using hardcoded API key');
  console.log('API Key length:', apiKey.length);
  
  // Determine which API to use
  const isOpenRouter = true; // Since we're using a hardcoded OpenRouter API key
  const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  
  console.log('Using API: OpenRouter');
  console.log('API URL:', apiUrl);
  console.log('Model:', model);
  
  try {
    console.log('Preparing to send request to API...');
    
    const requestBody = {
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are a skilled card reader and report writer. Your task is to generate detailed, insightful reports based on card readings. Use markdown formatting for headers and sections.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: maxTokens,
      temperature: 0.7
    };
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    // Format headers according to OpenRouter API requirements
    // See: https://openrouter.ai/docs
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://report-writer.app',
      'X-Title': 'Report Writer App'
    };
    
    console.log('Request headers:', JSON.stringify(headers, null, 2).replace(apiKey, '[REDACTED]'));
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });
    
    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);
    
    const responseText = await response.text();
    console.log('Response text:', responseText);
    
    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText);
        throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
      } catch (parseError) {
        throw new Error(`API error: ${response.statusText} - ${responseText}`);
      }
    }
    
    const data = JSON.parse(responseText);
    
    // Check if the response has the expected structure
    if (!data.choices || !data.choices.length || !data.choices[0].message) {
      console.error('Unexpected API response structure:', data);
      throw new Error('Unexpected API response structure. Missing choices or message.');
    }
    
    // Extract the generated content
    const content = data.choices[0].message.content;
    
    // Calculate token usage (with fallback if usage is not provided)
    const tokensUsed = data.usage ? data.usage.total_tokens : 0;
    
    // Calculate approximate cost (this is a rough estimate)
    // Rates vary by model and provider
    const costPerToken = 0.00002; // Example rate
    const cost = tokensUsed * costPerToken;
    
    return {
      content,
      tokensUsed,
      cost
    };
  } catch (error) {
    console.error('Error generating report content:', error);
    throw error;
  }
};

/**
 * Prepare a yearly report prompt for chunk 1 (Introduction and Displacing Card)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 1
 */
const prepareYearlyReportPromptChunk1 = async (data) => {
  // Format birth card
  const birthCard = data.birth_cards[0];
  const formattedBirthCard = await formatCardForPrompt(birthCard);
  
  // Format displacing card (year card)
  const displacingCard = data.displacing_card;
  const formattedDisplacingCard = await formatCardForPrompt(displacingCard);
  
  // Replace placeholders in the prompt template
  let prompt = yearlyReportPromptChunk1
    .replace('[Birth Card Name]', formattedBirthCard.name)
    .replace('[Birth Card Keywords]', formattedBirthCard.keywords.join(', '))
    .replace('[Birth Card Description]', formattedBirthCard.description)
    .replace('[Displacing Card Name]', formattedDisplacingCard.name)
    .replace('[Displacing Card Keywords]', formattedDisplacingCard.keywords.join(', '))
    .replace('[Displacing Card Description]', formattedDisplacingCard.description);
  
  return prompt;
};

/**
 * Prepare a yearly report prompt for chunk 2 (Card Analysis for Sun through Jupiter)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 2
 */
const prepareYearlyReportPromptChunk2 = async (data) => {
  // Format yearly spread using the spread_with_positions data
  const yearlySpread = [];
  
  // Check if spread_with_positions exists and is an array
  if (data.spread_with_positions && Array.isArray(data.spread_with_positions)) {
    // Use the actual spread data from the report generation service
    // Only include Sun through Jupiter (positions 0-5)
    // Explicitly exclude Saturn position
    const sunThroughJupiterPositions = ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter'];
    
    // Find all cards from Sun through Jupiter by position name
    for (const position of sunThroughJupiterPositions) {
      const item = data.spread_with_positions.find(item => item.position === position);
      if (item) {
        const formattedCard = await formatCardForPrompt(item.card);
        yearlySpread.push({
          position: item.position,
          card: formattedCard
        });
      }
    }
  } else {
    console.warn('No spread_with_positions data found for chunk 2, using fallback');
    return ''; // Return empty string to skip this chunk
  }
  
  // Format the spread info
  const spreadInfo = yearlySpread.map(item => 
    `**${item.position}**: ${item.card.name} (${item.card.symbol})\n` +
    `- **Keywords**: ${item.card.keywords.join(', ')}\n` +
    `- **Description**: ${item.card.description}\n`
  ).join('\n');
  
  // Replace placeholders in the prompt template
  let prompt = yearlyReportPromptChunk2
    .replace('[Formatted Spread Info for Sun through Jupiter]', spreadInfo);
  
  return prompt;
};

/**
 * Prepare a yearly report prompt for chunk 3 (Card Analysis for Saturn through Earth)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 3
 */
const prepareYearlyReportPromptChunk3 = async (data) => {
  // Format yearly spread using the spread_with_positions data
  const yearlySpread = [];
  
  // Check if spread_with_positions exists and is an array
  if (data.spread_with_positions && Array.isArray(data.spread_with_positions)) {
    // Use the actual spread data from the report generation service
    // Only include Saturn through Earth/Transformation (positions 6-12)
    // Make sure to include the Earth/Transformation card which is the last card
    const positions = ['Saturn', 'Uranus', 'Neptune', 'Pluto', 'Result', 'Peak', 'Moon', 'Earth/Transformation'];
    
    // Find all cards from Saturn through Earth by position name
    for (const position of positions) {
      const item = data.spread_with_positions.find(item => item.position === position);
      if (item) {
        const formattedCard = await formatCardForPrompt(item.card);
        yearlySpread.push({
          position: item.position,
          card: formattedCard
        });
      }
    }
  } else {
    console.warn('No spread_with_positions data found for chunk 3, using fallback');
    return ''; // Return empty string to skip this chunk
  }
  
  // Format the spread info
  const spreadInfo = yearlySpread.map(item => 
    `**${item.position}**: ${item.card.name} (${item.card.symbol})\n` +
    `- **Keywords**: ${item.card.keywords.join(', ')}\n` +
    `- **Description**: ${item.card.description}\n`
  ).join('\n');
  
  // Replace placeholders in the prompt template
  let prompt = yearlyReportPromptChunk3
    .replace('[Formatted Spread Info for Saturn through Earth]', spreadInfo);
  
  return prompt;
};

/**
 * Prepare a yearly report prompt for chunk 4 (Financial, Love, and Health Outlooks)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 4
 */
const prepareYearlyReportPromptChunk4 = async (data) => {
  // Format yearly spread using the spread_with_positions data
  const yearlySpread = [];
  
  // Check if spread_with_positions exists and is an array
  if (data.spread_with_positions && Array.isArray(data.spread_with_positions)) {
    // Use the actual spread data from the report generation service
    for (const item of data.spread_with_positions) {
      const formattedCard = await formatCardForPrompt(item.card);
      yearlySpread.push({
        position: item.position,
        card: formattedCard
      });
    }
  } else {
    console.warn('No spread_with_positions data found for chunk 4, using fallback');
    return ''; // Return empty string to skip this chunk
  }
  
  // Format the spread info
  const spreadInfo = yearlySpread.map(item => 
    `**${item.position}**: ${item.card.name} (${item.card.symbol})\n` +
    `- **Keywords**: ${item.card.keywords.join(', ')}\n` +
    `- **Description**: ${item.card.description}\n`
  ).join('\n');
  
  // Replace placeholders in the prompt template
  let prompt = yearlyReportPromptChunk4
    .replace('[Formatted Spread Info with each card position, name, keywords, and description]', spreadInfo);
  
  return prompt;
};

/**
 * Generate yearly report content using a chunking approach
 * 
 * @param {Object} data - Report data
 * @param {Object} options - Additional options
 * @returns {Object} Generated content and metadata
 */
const generateYearlyReportContent = async (data, options = {}) => {
  console.log('Generating yearly report content using chunking approach');
  
  // Prepare prompts for each chunk
  const chunk1Prompt = await prepareYearlyReportPromptChunk1(data);
  const chunk2Prompt = await prepareYearlyReportPromptChunk2(data);
  const chunk3Prompt = await prepareYearlyReportPromptChunk3(data);
  const chunk4Prompt = await prepareYearlyReportPromptChunk4(data);
  
  // Generate content for each chunk
  console.log('Generating content for chunk 1: Introduction and Displacing Card');
  const chunk1Result = await generateReportContent(chunk1Prompt, { ...options, maxTokens: 4000 });
  
  console.log('Generating content for chunk 2: Card Analysis (Sun through Jupiter)');
  const chunk2Result = await generateReportContent(chunk2Prompt, { ...options, maxTokens: 4500 });
  
  console.log('Generating content for chunk 3: Card Analysis (Saturn through Earth)');
  const chunk3Result = await generateReportContent(chunk3Prompt, { ...options, maxTokens: 7000 });
  
  console.log('Generating content for chunk 4: Financial, Love, and Health Outlooks');
  const chunk4Result = await generateReportContent(chunk4Prompt, { ...options, maxTokens: 4500 });
  
  // Combine the results
  const combinedContent = [
    chunk1Result.content,
    chunk2Result.content,
    chunk3Result.content,
    chunk4Result.content
  ].join('\n\n');
  
  // Calculate total tokens and cost
  const totalTokensUsed = 
    chunk1Result.tokensUsed + 
    chunk2Result.tokensUsed + 
    chunk3Result.tokensUsed + 
    chunk4Result.tokensUsed;
  
  const totalCost = 
    chunk1Result.cost + 
    chunk2Result.cost + 
    chunk3Result.cost + 
    chunk4Result.cost;
  
  return {
    content: combinedContent,
    tokensUsed: totalTokensUsed,
    cost: totalCost
  };
};

/**
 * Prepare a life report prompt for chunk 1 (Introduction)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 1
 */
const prepareLifeReportPromptChunk1 = async (data) => {
  console.log('Preparing life report prompt chunk 1 (Introduction)');
  
  // Format birth card
  const birthCard = data.birth_cards[0];
  const formattedBirthCard = await formatCardForPrompt(birthCard);
  
  // Replace placeholders in the prompt template
  let prompt = lifeReportPromptChunk1
    .replace('[Birth Card Name]', formattedBirthCard.name)
    .replace('[Birth Card Keywords]', formattedBirthCard.keywords.join(', '))
    .replace('[Birth Card Description]', formattedBirthCard.description);
  
  return prompt;
};

/**
 * Prepare a life report prompt for chunk 2 (Card Analysis for Sun through Jupiter)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 2
 */
const prepareLifeReportPromptChunk2 = async (data) => {
  console.log('Preparing life report prompt chunk 2 (Card Analysis for Sun through Jupiter)');
  
  // Format life spread using the spread_with_positions data
  const lifeSpread = [];
  
  // Check if spread_with_positions exists and is an array
  if (data.spread_with_positions && Array.isArray(data.spread_with_positions)) {
    // Use the actual spread data from the report generation service
    // Only include Sun through Jupiter (positions 0-5)
    // Explicitly exclude Saturn position
    const sunThroughJupiterPositions = ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter'];
    
    // Find all cards from Sun through Jupiter by position name
    for (const position of sunThroughJupiterPositions) {
      const item = data.spread_with_positions.find(item => item.position === position);
      if (item) {
        const formattedCard = await formatCardForPrompt(item.card);
        lifeSpread.push({
          position: item.position,
          card: formattedCard
        });
      }
    }
  } else {
    console.warn('No spread_with_positions data found for chunk 2, using fallback');
    return ''; // Return empty string to skip this chunk
  }
  
  // Format the spread info
  const spreadInfo = lifeSpread.map(item => 
    `**${item.position}**: ${item.card.name} (${item.card.symbol})\n` +
    `- **Keywords**: ${item.card.keywords.join(', ')}\n` +
    `- **Description**: ${item.card.description}\n`
  ).join('\n');
  
  console.log(`Formatted ${lifeSpread.length} cards for life report prompt chunk 2`);
  
  // Replace placeholders in the prompt template
  let prompt = lifeReportPromptChunk2
    .replace('[Formatted Spread Info for Sun through Jupiter]', spreadInfo);
  
  return prompt;
};

/**
 * Prepare a life report prompt for chunk 3 (Card Analysis for Saturn through Earth)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 3
 */
const prepareLifeReportPromptChunk3 = async (data) => {
  console.log('Preparing life report prompt chunk 3 (Card Analysis for Saturn through Earth)');
  
  // Format life spread using the spread_with_positions data
  const lifeSpread = [];
  
  // Check if spread_with_positions exists and is an array
  if (data.spread_with_positions && Array.isArray(data.spread_with_positions)) {
    // Use the actual spread data from the report generation service
    // Only include Saturn through Earth/Transformation (positions 6-12)
    // Make sure to include the Earth/Transformation card which is the last card
    const positions = ['Saturn', 'Uranus', 'Neptune', 'Pluto', 'Result', 'Peak', 'Moon', 'Earth/Transformation'];
    
    // Find all cards from Saturn through Earth by position name
    for (const position of positions) {
      const item = data.spread_with_positions.find(item => item.position === position);
      if (item) {
        const formattedCard = await formatCardForPrompt(item.card);
        lifeSpread.push({
          position: item.position,
          card: formattedCard
        });
      }
    }
  } else {
    console.warn('No spread_with_positions data found for chunk 3, using fallback');
    return ''; // Return empty string to skip this chunk
  }
  
  // Format the spread info
  const spreadInfo = lifeSpread.map(item => 
    `**${item.position}**: ${item.card.name} (${item.card.symbol})\n` +
    `- **Keywords**: ${item.card.keywords.join(', ')}\n` +
    `- **Description**: ${item.card.description}\n`
  ).join('\n');
  
  console.log(`Formatted ${lifeSpread.length} cards for life report prompt chunk 3`);
  
  // Replace placeholders in the prompt template
  let prompt = lifeReportPromptChunk3
    .replace('[Formatted Spread Info for Saturn through Earth]', spreadInfo);
  
  return prompt;
};

/**
 * Prepare a life report prompt for chunk 4 (Financial, Love, and Health Outlooks)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 4
 */
const prepareLifeReportPromptChunk4 = async (data) => {
  console.log('Preparing life report prompt chunk 4 (Financial, Love, and Health Outlooks)');
  
  // Format life spread using the spread_with_positions data
  const lifeSpread = [];
  
  // Check if spread_with_positions exists and is an array
  if (data.spread_with_positions && Array.isArray(data.spread_with_positions)) {
    // Use the actual spread data from the report generation service
    for (const item of data.spread_with_positions) {
      const formattedCard = await formatCardForPrompt(item.card);
      lifeSpread.push({
        position: item.position,
        card: formattedCard
      });
    }
  } else {
    console.warn('No spread_with_positions data found for chunk 4, using fallback');
    return ''; // Return empty string to skip this chunk
  }
  
  // Format the spread info
  const spreadInfo = lifeSpread.map(item => 
    `**${item.position}**: ${item.card.name} (${item.card.symbol})\n` +
    `- **Keywords**: ${item.card.keywords.join(', ')}\n` +
    `- **Description**: ${item.card.description}\n`
  ).join('\n');
  
  console.log(`Formatted ${lifeSpread.length} cards for life report prompt chunk 4`);
  
  // Replace placeholders in the prompt template
  let prompt = lifeReportPromptChunk4
    .replace('[Formatted Spread Info with each card position, name, keywords, and description]', spreadInfo);
  
  return prompt;
};

/**
 * Generate life report content using a chunking approach
 * 
 * @param {Object} data - Report data
 * @param {Object} options - Additional options
 * @returns {Object} Generated content and metadata
 */
const generateLifeReportContent = async (data, options = {}) => {
  console.log('Generating life report content using chunking approach');
  
  // Prepare prompts for each chunk
  const chunk1Prompt = await prepareLifeReportPromptChunk1(data);
  const chunk2Prompt = await prepareLifeReportPromptChunk2(data);
  const chunk3Prompt = await prepareLifeReportPromptChunk3(data);
  const chunk4Prompt = await prepareLifeReportPromptChunk4(data);
  
  // Generate content for each chunk
  console.log('Generating content for chunk 1: Introduction');
  const chunk1Result = await generateReportContent(chunk1Prompt, { ...options, maxTokens: 2000 });
  
  console.log('Generating content for chunk 2: Card Analysis (Sun through Jupiter)');
  const chunk2Result = await generateReportContent(chunk2Prompt, { ...options, maxTokens: 4500 });
  
  console.log('Generating content for chunk 3: Card Analysis (Saturn through Earth)');
  const chunk3Result = await generateReportContent(chunk3Prompt, { ...options, maxTokens: 7000 });
  
  console.log('Generating content for chunk 4: Financial, Love, and Health Outlooks');
  const chunk4Result = await generateReportContent(chunk4Prompt, { ...options, maxTokens: 4500 });
  
  // Combine the results
  const combinedContent = [
    chunk1Result.content,
    chunk2Result.content,
    chunk3Result.content,
    chunk4Result.content
  ].join('\n\n');
  
  // Calculate total tokens and cost
  const totalTokensUsed = 
    chunk1Result.tokensUsed + 
    chunk2Result.tokensUsed + 
    chunk3Result.tokensUsed + 
    chunk4Result.tokensUsed;
  
  const totalCost = 
    chunk1Result.cost + 
    chunk2Result.cost + 
    chunk3Result.cost + 
    chunk4Result.cost;
  
  return {
    content: combinedContent,
    tokensUsed: totalTokensUsed,
    cost: totalCost
  };
};

/**
 * Prepare a relationship report prompt for chunk 1 (Introduction and Combination Card)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 1
 */
const prepareRelationshipReportPromptChunk1 = async (data) => {
  // Format person 1 birth card
  const person1BirthCard = data.person1_cards[0];
  const formattedPerson1BirthCard = await formatCardForPrompt(person1BirthCard);
  
  // Format person 2 birth card
  const person2BirthCard = data.person2_cards[0];
  const formattedPerson2BirthCard = await formatCardForPrompt(person2BirthCard);
  
  // Format combination card
  const combinationCard = data.combination_card;
  const formattedCombinationCard = await formatCardForPrompt(combinationCard);
  
  // Replace placeholders in the prompt template
  let prompt = relationshipReportPromptChunk1
    .replace(/\[Person 1 Name\]/g, data.person1_name)
    .replace(/\[Person 2 Name\]/g, data.person2_name)
    .replace('[Person 1 Birth Card]', formattedPerson1BirthCard.name)
    .replace('[Person 1 Card Symbol]', data.person1_card_symbol)
    .replace('[Person 1 Keywords]', formattedPerson1BirthCard.keywords.join(', '))
    .replace('[Person 1 Description]', formattedPerson1BirthCard.description)
    .replace('[Person 2 Birth Card]', formattedPerson2BirthCard.name)
    .replace('[Person 2 Card Symbol]', data.person2_card_symbol)
    .replace('[Person 2 Keywords]', formattedPerson2BirthCard.keywords.join(', '))
    .replace('[Person 2 Description]', formattedPerson2BirthCard.description)
    .replace('[Combination Card]', formattedCombinationCard.name)
    .replace('[Combination Card Symbol]', data.combination_card_symbol)
    .replace('[Combination Keywords]', formattedCombinationCard.keywords.join(', '))
    .replace('[Combination Description]', formattedCombinationCard.description);
  
  return prompt;
};

/**
 * Prepare a relationship report prompt for chunk 2 (POV Analysis)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 2
 */
const prepareRelationshipReportPromptChunk2 = async (data) => {
  // Format person 1 birth card and POV card
  const person1BirthCard = data.person1_cards[0];
  const person1POVCard = data.person1_pov_card;
  const formattedPerson1BirthCard = await formatCardForPrompt(person1BirthCard);
  const formattedPerson1POVCard = await formatCardForPrompt(person1POVCard);
  
  // Format person 2 birth card and POV card
  const person2BirthCard = data.person2_cards[0];
  const person2POVCard = data.person2_pov_card;
  const formattedPerson2BirthCard = await formatCardForPrompt(person2BirthCard);
  const formattedPerson2POVCard = await formatCardForPrompt(person2POVCard);
  
  // Replace placeholders in the prompt template
  let prompt = relationshipReportPromptChunk2
    .replace(/\[Person 1 Name\]/g, data.person1_name)
    .replace(/\[Person 2 Name\]/g, data.person2_name)
    .replace('[Person 1 Birth Card]', formattedPerson1BirthCard.name)
    .replace('[Person 1 Card Symbol]', data.person1_card_symbol)
    .replace('[Person 1 POV Card]', formattedPerson1POVCard.name)
    .replace('[Person 1 POV Card Symbol]', data.person1_pov_card_symbol)
    .replace('[Person 1 POV Keywords]', formattedPerson1POVCard.keywords.join(', '))
    .replace('[Person 1 POV Description]', formattedPerson1POVCard.description)
    .replace('[Person 2 Birth Card]', formattedPerson2BirthCard.name)
    .replace('[Person 2 Card Symbol]', data.person2_card_symbol)
    .replace('[Person 2 POV Card]', formattedPerson2POVCard.name)
    .replace('[Person 2 POV Card Symbol]', data.person2_pov_card_symbol)
    .replace('[Person 2 POV Keywords]', formattedPerson2POVCard.keywords.join(', '))
    .replace('[Person 2 POV Description]', formattedPerson2POVCard.description);
  
  return prompt;
};

/**
 * Prepare a relationship report prompt for chunk 3 (Spread Analysis - First Half)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 3
 */
const prepareRelationshipReportPromptChunk3 = async (data) => {
  // Format spread cards for the first half of positions
  const spreadCards = [];
  
  // Check if spread_with_positions exists and is an array
  if (data.spread_with_positions && Array.isArray(data.spread_with_positions)) {
    // Define the first half of positions in the correct order
    const firstHalfPositions = ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus'];
    
    // Find all cards from the first half by position name
    for (const position of firstHalfPositions) {
      const item = data.spread_with_positions.find(item => item.position === position);
      if (item) {
        spreadCards.push({
          position: item.position,
          card: item.card,
          symbol: item.symbol,
          description: item.description,
          keywords: item.keywords
        });
      }
    }
  } else {
    console.warn('No spread_with_positions data found for chunk 3, using fallback');
    return ''; // Return empty string to skip this chunk
  }
  
  // Format the spread info
  const spreadInfo = spreadCards.map(item => 
    `**${item.position}**: ${item.card.name} (${item.symbol})\n` +
    `- **Keywords**: ${Array.isArray(item.keywords) ? item.keywords.join(', ') : item.keywords}\n` +
    `- **Description**: ${item.description}\n`
  ).join('\n');
  
  // Replace placeholders in the prompt template
  let prompt = relationshipReportPromptChunk3
    .replace(/\[Person 1 Name\]/g, data.person1_name)
    .replace(/\[Person 2 Name\]/g, data.person2_name)
    .replace('[Formatted Spread Info for First Half]', spreadInfo);
  
  return prompt;
};

/**
 * Prepare a relationship report prompt for chunk 4 (Spread Analysis - Second Half)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 4
 */
const prepareRelationshipReportPromptChunk4 = async (data) => {
  // Format spread cards for the second half of positions
  const spreadCards = [];
  
  // Check if spread_with_positions exists and is an array
  if (data.spread_with_positions && Array.isArray(data.spread_with_positions)) {
    // Define the second half of positions in the correct order
    const secondHalfPositions = ['Neptune', 'Pluto', 'Result', 'Peak', 'Moon', 'Earth/Transformation'];
    
    // Find all cards from the second half by position name
    for (const position of secondHalfPositions) {
      const item = data.spread_with_positions.find(item => item.position === position);
      if (item) {
        spreadCards.push({
          position: item.position,
          card: item.card,
          symbol: item.symbol,
          description: item.description,
          keywords: item.keywords
        });
      }
    }
  } else {
    console.warn('No spread_with_positions data found for chunk 4, using fallback');
    return ''; // Return empty string to skip this chunk
  }
  
  // Format the spread info
  const spreadInfo = spreadCards.map(item => 
    `**${item.position}**: ${item.card.name} (${item.symbol})\n` +
    `- **Keywords**: ${Array.isArray(item.keywords) ? item.keywords.join(', ') : item.keywords}\n` +
    `- **Description**: ${item.description}\n`
  ).join('\n');
  
  // Replace placeholders in the prompt template
  let prompt = relationshipReportPromptChunk4
    .replace(/\[Person 1 Name\]/g, data.person1_name)
    .replace(/\[Person 2 Name\]/g, data.person2_name)
    .replace('[Formatted Spread Info for Second Half]', spreadInfo);
  
  return prompt;
};

/**
 * Prepare a relationship report prompt for chunk 5 (Deeper Relationship Analysis)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 5
 */
const prepareRelationshipReportPromptChunk5 = async (data) => {
  console.log('Preparing relationship report prompt chunk 5 (Deeper Relationship Analysis)');
  
  // Format combination card
  const combinationCard = data.combination_card;
  const formattedCombinationCard = await formatCardForPrompt(combinationCard);
  
  // Format POV cards
  const person1POVCard = data.person1_pov_card;
  const person2POVCard = data.person2_pov_card;
  const formattedPerson1POVCard = await formatCardForPrompt(person1POVCard);
  const formattedPerson2POVCard = await formatCardForPrompt(person2POVCard);
  
  // Initialize card variables
  let saturnCard = null;
  let saturnCardSymbol = '';
  let venusCard = null;
  let venusCardSymbol = '';
  let neptuneCard = null;
  let neptuneCardSymbol = '';
  let moonCard = null;
  let moonCardSymbol = '';
  let marsCard = null;
  let marsCardSymbol = '';
  let plutoCard = null;
  let plutoCardSymbol = '';
  
  // Find the relevant cards from the spread
  if (data.spread_with_positions && Array.isArray(data.spread_with_positions)) {
    console.log(`Found ${data.spread_with_positions.length} cards in spread_with_positions for chunk 5`);
    
    // Find Saturn card
    const saturnItem = data.spread_with_positions.find(item => item.position === 'Saturn');
    if (saturnItem) {
      saturnCard = saturnItem.card;
      saturnCardSymbol = saturnItem.symbol;
      console.log(`Found Saturn card: ${saturnCardSymbol}`);
    }
    
    // Find Venus card
    const venusItem = data.spread_with_positions.find(item => item.position === 'Venus');
    if (venusItem) {
      venusCard = venusItem.card;
      venusCardSymbol = venusItem.symbol;
      console.log(`Found Venus card: ${venusCardSymbol}`);
    }
    
    // Find Neptune card
    const neptuneItem = data.spread_with_positions.find(item => item.position === 'Neptune');
    if (neptuneItem) {
      neptuneCard = neptuneItem.card;
      neptuneCardSymbol = neptuneItem.symbol;
      console.log(`Found Neptune card: ${neptuneCardSymbol}`);
    }
    
    // Find Moon card
    const moonItem = data.spread_with_positions.find(item => item.position === 'Moon');
    if (moonItem) {
      moonCard = moonItem.card;
      moonCardSymbol = moonItem.symbol;
      console.log(`Found Moon card: ${moonCardSymbol}`);
    }
    
    // Find Mars card
    const marsItem = data.spread_with_positions.find(item => item.position === 'Mars');
    if (marsItem) {
      marsCard = marsItem.card;
      marsCardSymbol = marsItem.symbol;
      console.log(`Found Mars card: ${marsCardSymbol}`);
    }
    
    // Find Pluto card
    const plutoItem = data.spread_with_positions.find(item => item.position === 'Pluto');
    if (plutoItem) {
      plutoCard = plutoItem.card;
      plutoCardSymbol = plutoItem.symbol;
      console.log(`Found Pluto card: ${plutoCardSymbol}`);
    }
  }
  
  // Use fallbacks for any cards not found
  if (!saturnCard) {
    console.warn('Saturn card not found in spread, using combination card as fallback');
    saturnCard = combinationCard;
    saturnCardSymbol = data.combination_card_symbol;
  }
  
  if (!venusCard) {
    console.warn('Venus card not found in spread, using combination card as fallback');
    venusCard = combinationCard;
    venusCardSymbol = data.combination_card_symbol;
  }
  
  if (!neptuneCard) {
    console.warn('Neptune card not found in spread, using combination card as fallback');
    neptuneCard = combinationCard;
    neptuneCardSymbol = data.combination_card_symbol;
  }
  
  if (!moonCard) {
    console.warn('Moon card not found in spread, using combination card as fallback');
    moonCard = combinationCard;
    moonCardSymbol = data.combination_card_symbol;
  }
  
  if (!marsCard) {
    console.warn('Mars card not found in spread, using combination card as fallback');
    marsCard = combinationCard;
    marsCardSymbol = data.combination_card_symbol;
  }
  
  if (!plutoCard) {
    console.warn('Pluto card not found in spread, using combination card as fallback');
    plutoCard = combinationCard;
    plutoCardSymbol = data.combination_card_symbol;
  }
  
  // Format all cards
  const formattedSaturnCard = await formatCardForPrompt(saturnCard);
  const formattedVenusCard = await formatCardForPrompt(venusCard);
  const formattedNeptuneCard = await formatCardForPrompt(neptuneCard);
  const formattedMoonCard = await formatCardForPrompt(moonCard);
  const formattedMarsCard = await formatCardForPrompt(marsCard);
  const formattedPlutoCard = await formatCardForPrompt(plutoCard);
  
  // Create descriptions for Love and Affection and Passion and Potential Problems sections
  const loveAndAffectionCards = `Venus (${venusCardSymbol}): ${formattedVenusCard.name}, Neptune (${neptuneCardSymbol}): ${formattedNeptuneCard.name}, Moon (${moonCardSymbol}): ${formattedMoonCard.name}`;
  const passionAndProblemsCards = `Mars (${marsCardSymbol}): ${formattedMarsCard.name}, Pluto (${plutoCardSymbol}): ${formattedPlutoCard.name}`;
  
  // Replace placeholders in the prompt template
  let prompt = relationshipReportPromptChunk5
    .replace(/\[Person 1 Name\]/g, data.person1_name)
    .replace(/\[Person 2 Name\]/g, data.person2_name)
    .replace('[Combination Card]', formattedCombinationCard.name)
    .replace('[Combination Card Symbol]', data.combination_card_symbol)
    .replace('[Combination Keywords]', formattedCombinationCard.keywords.join(', '))
    .replace('[Person 1 POV Card]', formattedPerson1POVCard.name)
    .replace('[Person 1 POV Card Symbol]', data.person1_pov_card_symbol)
    .replace('[Person 2 POV Card]', formattedPerson2POVCard.name)
    .replace('[Person 2 POV Card Symbol]', data.person2_pov_card_symbol)
    .replace('[Saturn Card]', formattedSaturnCard.name)
    .replace('[Saturn Card Symbol]', saturnCardSymbol);
  
  // Add additional information about the cards for Love and Affection and Passion and Problems sections
  prompt = prompt.replace('Analyze the Venus, Neptune, and Moon cards from the spread.', 
    `Analyze the Venus, Neptune, and Moon cards from the spread: ${loveAndAffectionCards}.`);
  
  prompt = prompt.replace('Examine the Mars and Pluto cards', 
    `Examine the Mars and Pluto cards: ${passionAndProblemsCards}`);
  
  console.log('Successfully prepared relationship report prompt chunk 5');
  return prompt;
};

/**
 * Generate relationship report content using a chunking approach
 * 
 * @param {Object} data - Report data
 * @param {Object} options - Additional options
 * @returns {Object} Generated content and metadata
 */
const generateRelationshipReportContent = async (data, options = {}) => {
  console.log('Generating relationship report content using chunking approach');
  
  // Prepare prompts for each chunk
  const chunk1Prompt = await prepareRelationshipReportPromptChunk1(data);
  const chunk2Prompt = await prepareRelationshipReportPromptChunk2(data);
  const chunk3Prompt = await prepareRelationshipReportPromptChunk3(data);
  const chunk4Prompt = await prepareRelationshipReportPromptChunk4(data);
  const chunk5Prompt = await prepareRelationshipReportPromptChunk5(data);
  
  // Generate content for each chunk
  console.log('Generating content for chunk 1: Introduction and Combination Card');
  const chunk1Result = await generateReportContent(chunk1Prompt, { ...options, maxTokens: 2000 });
  
  console.log('Generating content for chunk 2: POV Analysis');
  const chunk2Result = await generateReportContent(chunk2Prompt, { ...options, maxTokens: 3000 });
  
  console.log('Generating content for chunk 3: Spread Analysis (First Half)');
  const chunk3Result = await generateReportContent(chunk3Prompt, { ...options, maxTokens: 3000 });
  
  console.log('Generating content for chunk 4: Spread Analysis (Second Half)');
  const chunk4Result = await generateReportContent(chunk4Prompt, { ...options, maxTokens: 3000 });
  
  console.log('Generating content for chunk 5: Deeper Relationship Analysis');
  const chunk5Result = await generateReportContent(chunk5Prompt, { ...options, maxTokens: 3000 });
  
  // Combine the results
  const combinedContent = [
    chunk1Result.content,
    chunk2Result.content,
    chunk3Result.content,
    chunk4Result.content,
    chunk5Result.content
  ].join('\n\n');
  
  // Calculate total tokens and cost
  const totalTokensUsed = 
    chunk1Result.tokensUsed + 
    chunk2Result.tokensUsed + 
    chunk3Result.tokensUsed + 
    chunk4Result.tokensUsed + 
    chunk5Result.tokensUsed;
  
  const totalCost = 
    chunk1Result.cost + 
    chunk2Result.cost + 
    chunk3Result.cost + 
    chunk4Result.cost + 
    chunk5Result.cost;
  
  return {
    content: combinedContent,
    tokensUsed: totalTokensUsed,
    cost: totalCost
  };
};

/**
 * Prepare a financial report prompt for chunk 1 (Introduction and Financial Overview)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 1
 */
const prepareFinancialReportPromptChunk1 = async (data) => {
  console.log('Preparing financial report prompt chunk 1 (Introduction and Financial Overview)');
  
  // Format birth card
  const birthCard = data.birth_cards[0];
  const formattedBirthCard = await formatCardForPrompt(birthCard);
  
  // Format displacing card (year card)
  const displacingCard = data.displacing_card;
  const formattedDisplacingCard = await formatCardForPrompt(displacingCard);
  
  // Define all 13 positions that must be included
  const allPositions = ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Result', 'Peak', 'Moon', 'Earth/Transformation'];
  
  // Format card positions for all 13 positions
  let positionCorrelations = '';
  if (data.spread_with_positions && Array.isArray(data.spread_with_positions)) {
    // Create a map of positions to cards
    const positionMap = {};
    data.spread_with_positions.forEach(item => {
      positionMap[item.position] = item;
    });
    
    // Generate position correlations for all 13 positions in the correct order
    positionCorrelations = allPositions.map(position => {
      const item = positionMap[position];
      if (item) {
        return `**${item.card.name} (${item.card.symbol}) - ${position}**\n` +
          `- **Position**: ${position}\n` +
          `- **Financial Significance**: This card in the ${position} position influences your financial life by affecting ${position.toLowerCase()}-related financial matters.\n`;
      } else {
        console.warn(`No card found for position ${position}, using placeholder`);
        return `**Position: ${position}**\n` +
          `- **Position**: ${position}\n` +
          `- **Financial Significance**: The ${position} position influences your financial life by affecting ${position.toLowerCase()}-related financial matters.\n`;
      }
    }).join('\n\n');
  } else {
    console.warn('No spread_with_positions data found for chunk 1, using fallback');
    positionCorrelations = 'Card position data not available.';
  }
  
  // Replace placeholders in the prompt template
  let prompt = financialReportPromptChunk1
    .replace('[Birth Card Name]', formattedBirthCard.name)
    .replace('[Birth Card Keywords]', formattedBirthCard.keywords.join(', '))
    .replace('[Birth Card Description]', formattedBirthCard.description)
    .replace('[Displacing Card Name]', formattedDisplacingCard.name)
    .replace('[Displacing Card Keywords]', formattedDisplacingCard.keywords.join(', '))
    .replace('[Displacing Card Description]', formattedDisplacingCard.description)
    .replace('[Formatted Position Correlations]', positionCorrelations);
  
  return prompt;
};

/**
 * Prepare a financial report prompt for chunk 2 (Investment Opportunities Analysis)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 2
 */
const prepareFinancialReportPromptChunk2 = async (data) => {
  console.log('Preparing financial report prompt chunk 2 (Investment Opportunities Analysis)');
  
  // Format yearly spread using the spread_with_positions data
  const yearlySpread = [];
  
  // Check if spread_with_positions exists and is an array
  if (data.spread_with_positions && Array.isArray(data.spread_with_positions)) {
    // Use the actual spread data from the report generation service
    // Only include Sun through Jupiter (positions 0-5)
    const sunThroughJupiterPositions = ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter'];
    
    // Find all cards from Sun through Jupiter by position name
    for (const position of sunThroughJupiterPositions) {
      const item = data.spread_with_positions.find(item => item.position === position);
      if (item) {
        const formattedCard = await formatCardForPrompt(item.card);
        
        // Find the corresponding financial spread item for this card
        const financialItem = data.financial_spread ? 
          data.financial_spread.find(fi => fi.card.symbol === item.card.symbol) : null;
        
        yearlySpread.push({
          position: item.position,
          card: formattedCard,
          naturalPosition: financialItem ? financialItem.naturalPosition : 'Unknown',
          financialImplication: financialItem ? financialItem.financialImplication : 'No financial implication data available'
        });
      }
    }
  } else {
    console.warn('No spread_with_positions data found for chunk 2, using fallback');
    return ''; // Return empty string to skip this chunk
  }
  
  // Format the spread info
  const spreadInfo = yearlySpread.map(item => 
    `**${item.position}**: ${item.card.name} (${item.card.symbol})\n` +
    `- **Natural Position**: ${item.naturalPosition}\n` +
    `- **Keywords**: ${item.card.keywords.join(', ')}\n` +
    `- **Description**: ${item.card.description}\n` +
    `- **Financial Implication**: ${item.financialImplication}\n`
  ).join('\n');
  
  // Replace placeholders in the prompt template
  let prompt = financialReportPromptChunk2
    .replace('[Formatted Spread Info for Sun through Jupiter]', spreadInfo);
  
  return prompt;
};

/**
 * Prepare a financial report prompt for chunk 3 (Business Growth Analysis)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 3
 */
const prepareFinancialReportPromptChunk3 = async (data) => {
  console.log('Preparing financial report prompt chunk 3 (Business Growth Analysis)');
  
  // Format yearly spread using the spread_with_positions data
  const yearlySpread = [];
  
  // Check if spread_with_positions exists and is an array
  if (data.spread_with_positions && Array.isArray(data.spread_with_positions)) {
    // Use the actual spread data from the report generation service
    // Only include Saturn through Earth (positions 6-12)
    const saturnThroughEarthPositions = ['Saturn', 'Uranus', 'Neptune', 'Pluto', 'Result', 'Peak', 'Moon', 'Earth/Transformation'];
    
    // Find all cards from Saturn through Earth by position name
    for (const position of saturnThroughEarthPositions) {
      const item = data.spread_with_positions.find(item => item.position === position);
      if (item) {
        const formattedCard = await formatCardForPrompt(item.card);
        
        // Find the corresponding financial spread item for this card
        const financialItem = data.financial_spread ? 
          data.financial_spread.find(fi => fi.card.symbol === item.card.symbol) : null;
        
        yearlySpread.push({
          position: item.position,
          card: formattedCard,
          naturalPosition: financialItem ? financialItem.naturalPosition : 'Unknown',
          financialImplication: financialItem ? financialItem.financialImplication : 'No financial implication data available'
        });
      }
    }
  } else {
    console.warn('No spread_with_positions data found for chunk 3, using fallback');
    return ''; // Return empty string to skip this chunk
  }
  
  // Format the spread info
  const spreadInfo = yearlySpread.map(item => 
    `**${item.position}**: ${item.card.name} (${item.card.symbol})\n` +
    `- **Natural Position**: ${item.naturalPosition}\n` +
    `- **Keywords**: ${item.card.keywords.join(', ')}\n` +
    `- **Description**: ${item.card.description}\n` +
    `- **Financial Implication**: ${item.financialImplication}\n`
  ).join('\n');
  
  // Replace placeholders in the prompt template
  let prompt = financialReportPromptChunk3
    .replace('[Formatted Spread Info for Saturn through Earth]', spreadInfo);
  
  return prompt;
};

/**
 * Prepare a financial report prompt for chunk 4 (Financial Challenges and Action Plan)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 4
 */
const prepareFinancialReportPromptChunk4 = async (data) => {
  console.log('Preparing financial report prompt chunk 4 (Financial Challenges and Action Plan)');
  
  // Format yearly spread using the spread_with_positions data
  const yearlySpread = [];
  
  // Check if spread_with_positions exists and is an array
  if (data.spread_with_positions && Array.isArray(data.spread_with_positions)) {
    // Use the actual spread data from the report generation service
    for (const item of data.spread_with_positions) {
      const formattedCard = await formatCardForPrompt(item.card);
      
      // Find the corresponding financial spread item for this card
      const financialItem = data.financial_spread ? 
        data.financial_spread.find(fi => fi.card.symbol === item.card.symbol) : null;
      
      yearlySpread.push({
        position: item.position,
        card: formattedCard,
        naturalPosition: financialItem ? financialItem.naturalPosition : 'Unknown',
        financialImplication: financialItem ? financialItem.financialImplication : 'No financial implication data available'
      });
    }
  } else {
    console.warn('No spread_with_positions data found for chunk 4, using fallback');
    return ''; // Return empty string to skip this chunk
  }
  
  // Format the spread info
  const spreadInfo = yearlySpread.map(item => 
    `**${item.position}**: ${item.card.name} (${item.card.symbol})\n` +
    `- **Natural Position**: ${item.naturalPosition}\n` +
    `- **Keywords**: ${item.card.keywords.join(', ')}\n` +
    `- **Description**: ${item.card.description}\n` +
    `- **Financial Implication**: ${item.financialImplication}\n`
  ).join('\n');
  
  // Replace placeholders in the prompt template
  let prompt = financialReportPromptChunk4
    .replace('[Formatted Spread Info with each card position, name, keywords, and description]', spreadInfo);
  
  return prompt;
};

/**
 * Generate financial report content using a chunking approach
 * 
 * @param {Object} data - Report data
 * @param {Object} options - Additional options
 * @returns {Object} Generated content and metadata
 */
const generateFinancialReportContent = async (data, options = {}) => {
  console.log('Generating financial report content using chunking approach');
  
  // Prepare prompts for each chunk
  const chunk1Prompt = await prepareFinancialReportPromptChunk1(data);
  const chunk2Prompt = await prepareFinancialReportPromptChunk2(data);
  const chunk3Prompt = await prepareFinancialReportPromptChunk3(data);
  const chunk4Prompt = await prepareFinancialReportPromptChunk4(data);
  
  // Generate content for each chunk
  console.log('Generating content for chunk 1: Introduction and Financial Overview');
  const chunk1Result = await generateReportContent(chunk1Prompt, { ...options, maxTokens: 6000 });
  
  // Add a card analysis section for Saturn through Earth before Investment & Business Opportunities
  console.log('Generating content for Saturn card analysis');
  
  // Prepare Saturn card analysis prompt
  const saturnCardPrompt = `
## Saturn Card Analysis
[Formatted Spread Info for Saturn]

Please provide a detailed analysis of the Saturn card in the financial spread. Structure your analysis as follows:

For the Saturn card in the yearly spread, provide a 300-word interpretation focused on its financial implications. Consider:

1. How this card influences financial responsibilities and challenges
2. Long-term financial planning considerations based on this card
3. How this card's natural position versus current position affects financial outcomes
4. Specific financial advice related to this card's energy

Use markdown formatting for headers, paragraphs, and advice lists. Ensure the analysis is detailed and insightful, drawing inferences from the card's position and keywords. Refer to the client directly as "you" within the analysis. Avoid using phrases like "In the realm of."

IMPORTANT FORMATTING: Start with a dark red title and a divider line below it. Format the title in this exact format:

<span style="color: #8B0000; font-weight: bold;">[Card Name] ([Card Symbol]) - Saturn</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

Do not split this title across multiple lines or add any additional text to this title line. The entire card title must be on a single line.

IMPORTANT: Only provide the Saturn card analysis. Do not include any introduction or other sections.
`;

  // Extract Saturn card data
  let saturnCardData = '';
  if (data.spread_with_positions && Array.isArray(data.spread_with_positions)) {
    const saturnItem = data.spread_with_positions.find(item => item.position === 'Saturn');
    if (saturnItem) {
      const formattedCard = await formatCardForPrompt(saturnItem.card);
      saturnCardData = `**Saturn**: ${formattedCard.name} (${formattedCard.symbol})\n` +
        `- **Keywords**: ${formattedCard.keywords.join(', ')}\n` +
        `- **Description**: ${formattedCard.description}\n`;
    }
  }
  
  // Replace placeholder in the prompt
  const saturnPrompt = saturnCardPrompt.replace('[Formatted Spread Info for Saturn]', saturnCardData);
  
  // Generate Saturn card analysis
  const saturnCardResult = await generateReportContent(saturnPrompt, { ...options, maxTokens: 2000 });
  
  console.log('Generating content for chunk 2: Investment & Business Opportunities Analysis');
  const chunk2Result = await generateReportContent(chunk2Prompt, { ...options, maxTokens: 4500 });
  
  console.log('Generating content for chunk 3: Business Growth Analysis');
  const chunk3Result = await generateReportContent(chunk3Prompt, { ...options, maxTokens: 4500 });
  
  console.log('Generating content for chunk 4: Financial Challenges and Diamond Card Money Opportunities');
  const chunk4Result = await generateReportContent(chunk4Prompt, { ...options, maxTokens: 6000 });
  
  // Combine the results
  const combinedContent = [
    chunk1Result.content,
    saturnCardResult.content,
    chunk2Result.content,
    chunk3Result.content,
    chunk4Result.content
  ].join('\n\n');
  
  // Calculate total tokens and cost
  const totalTokensUsed = 
    chunk1Result.tokensUsed + 
    saturnCardResult.tokensUsed +
    chunk2Result.tokensUsed + 
    chunk3Result.tokensUsed + 
    chunk4Result.tokensUsed;
  
  const totalCost = 
    chunk1Result.cost + 
    saturnCardResult.cost +
    chunk2Result.cost + 
    chunk3Result.cost + 
    chunk4Result.cost;
  
  return {
    content: combinedContent,
    tokensUsed: totalTokensUsed,
    cost: totalCost
  };
};

/**
 * Prepare a singles report prompt for chunk 1 (Introduction and Singles Overview)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 1
 */
const prepareSinglesReportPromptChunk1 = async (data) => {
  console.log('Preparing singles report prompt chunk 1 (Introduction and Singles Overview)');
  
  // Format birth card
  const birthCard = data.birth_cards[0];
  const formattedBirthCard = await formatCardForPrompt(birthCard);
  
  // Format displacing card (year card)
  const displacingCard = data.displacing_card;
  const formattedDisplacingCard = await formatCardForPrompt(displacingCard);
  
  // Define all 13 positions that must be included
  const allPositions = ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Result', 'Peak', 'Moon', 'Earth/Transformation'];
  
  // Format card positions for all 13 positions
  let positionCorrelations = '';
  if (data.spread_with_positions && Array.isArray(data.spread_with_positions)) {
    // Create a map of positions to cards
    const positionMap = {};
    data.spread_with_positions.forEach(item => {
      positionMap[item.position] = item;
    });
    
    // Generate position correlations for all 13 positions in the correct order
    positionCorrelations = allPositions.map(position => {
      const item = positionMap[position];
      if (item) {
        return `**${item.card.name} (${item.card.symbol}) - ${position}**\n` +
          `- **Position**: ${position}\n` +
          `- **Relationship Significance**: This card in the ${position} position influences your romantic life by affecting ${position.toLowerCase()}-related relationship matters.\n`;
      } else {
        console.warn(`No card found for position ${position}, using placeholder`);
        return `**Position: ${position}**\n` +
          `- **Position**: ${position}\n` +
          `- **Relationship Significance**: The ${position} position influences your romantic life by affecting ${position.toLowerCase()}-related relationship matters.\n`;
      }
    }).join('\n\n');
  } else {
    console.warn('No spread_with_positions data found for chunk 1, using fallback');
    positionCorrelations = 'Card position data not available.';
  }
  
  // Replace placeholders in the prompt template
  let prompt = singlesReportPromptChunk1
    .replace('[Birth Card Name]', formattedBirthCard.name)
    .replace('[Birth Card Keywords]', formattedBirthCard.keywords.join(', '))
    .replace('[Birth Card Description]', formattedBirthCard.description)
    .replace('[Displacing Card Name]', formattedDisplacingCard.name)
    .replace('[Displacing Card Keywords]', formattedDisplacingCard.keywords.join(', '))
    .replace('[Displacing Card Description]', formattedDisplacingCard.description)
    .replace('[Formatted Position Correlations]', positionCorrelations);
  
  return prompt;
};

/**
 * Prepare a singles report prompt for chunk 2 (Relationship Prospects & Dating Opportunities)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 2
 */
const prepareSinglesReportPromptChunk2 = async (data) => {
  console.log('Preparing singles report prompt chunk 2 (Relationship Prospects & Dating Opportunities)');
  
  // Format yearly spread using the spread_with_positions data
  const yearlySpread = [];
  
  // Check if spread_with_positions exists and is an array
  if (data.spread_with_positions && Array.isArray(data.spread_with_positions)) {
    // Use the actual spread data from the report generation service
    // Only include Sun through Jupiter (positions 0-5)
    const sunThroughJupiterPositions = ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter'];
    
    // Find all cards from Sun through Jupiter by position name
    for (const position of sunThroughJupiterPositions) {
      const item = data.spread_with_positions.find(item => item.position === position);
      if (item) {
        const formattedCard = await formatCardForPrompt(item.card);
        yearlySpread.push({
          position: item.position,
          card: formattedCard
        });
      }
    }
  } else {
    console.warn('No spread_with_positions data found for chunk 2, using fallback');
    return ''; // Return empty string to skip this chunk
  }
  
  // Format the spread info
  const spreadInfo = yearlySpread.map(item => 
    `**${item.position}**: ${item.card.name} (${item.card.symbol})\n` +
    `- **Keywords**: ${item.card.keywords.join(', ')}\n` +
    `- **Description**: ${item.card.description}\n`
  ).join('\n');
  
  // Replace placeholders in the prompt template
  let prompt = singlesReportPromptChunk2
    .replace('[Formatted Spread Info for Sun through Jupiter]', spreadInfo);
  
  return prompt;
};

/**
 * Prepare a singles report prompt for chunk 3 (Emotional Growth & Relationship Wisdom)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 3
 */
const prepareSinglesReportPromptChunk3 = async (data) => {
  console.log('Preparing singles report prompt chunk 3 (Emotional Growth & Relationship Wisdom)');
  
  // Format yearly spread using the spread_with_positions data
  const yearlySpread = [];
  
  // Check if spread_with_positions exists and is an array
  if (data.spread_with_positions && Array.isArray(data.spread_with_positions)) {
    // Use the actual spread data from the report generation service
    // Only include Saturn through Earth (positions 6-12)
    const saturnThroughEarthPositions = ['Saturn', 'Uranus', 'Neptune', 'Pluto', 'Result', 'Peak', 'Moon', 'Earth/Transformation'];
    
    // Find all cards from Saturn through Earth by position name
    for (const position of saturnThroughEarthPositions) {
      const item = data.spread_with_positions.find(item => item.position === position);
      if (item) {
        const formattedCard = await formatCardForPrompt(item.card);
        yearlySpread.push({
          position: item.position,
          card: formattedCard
        });
      }
    }
  } else {
    console.warn('No spread_with_positions data found for chunk 3, using fallback');
    return ''; // Return empty string to skip this chunk
  }
  
  // Format the spread info
  const spreadInfo = yearlySpread.map(item => 
    `**${item.position}**: ${item.card.name} (${item.card.symbol})\n` +
    `- **Keywords**: ${item.card.keywords.join(', ')}\n` +
    `- **Description**: ${item.card.description}\n`
  ).join('\n');
  
  // Replace placeholders in the prompt template
  let prompt = singlesReportPromptChunk3
    .replace('[Formatted Spread Info for Saturn through Earth]', spreadInfo);
  
  return prompt;
};

/**
 * Prepare a singles report prompt for chunk 4 (Relationship Challenges and Love Opportunities)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 4
 */
const prepareSinglesReportPromptChunk4 = async (data) => {
  console.log('Preparing singles report prompt chunk 4 (Relationship Challenges and Love Opportunities)');
  
  // Format yearly spread using the spread_with_positions data
  const yearlySpread = [];
  
  // Check if spread_with_positions exists and is an array
  if (data.spread_with_positions && Array.isArray(data.spread_with_positions)) {
    // Use the actual spread data from the report generation service
    for (const item of data.spread_with_positions) {
      const formattedCard = await formatCardForPrompt(item.card);
      yearlySpread.push({
        position: item.position,
        card: formattedCard
      });
    }
  } else {
    console.warn('No spread_with_positions data found for chunk 4, using fallback');
    return ''; // Return empty string to skip this chunk
  }
  
  // Format the spread info
  const spreadInfo = yearlySpread.map(item => 
    `**${item.position}**: ${item.card.name} (${item.card.symbol})\n` +
    `- **Keywords**: ${item.card.keywords.join(', ')}\n` +
    `- **Description**: ${item.card.description}\n`
  ).join('\n');
  
  // Replace placeholders in the prompt template
  let prompt = singlesReportPromptChunk4
    .replace('[Formatted Spread Info with each card position, name, keywords, and description]', spreadInfo);
  
  return prompt;
};

/**
 * Generate singles report content using a chunking approach
 * 
 * @param {Object} data - Report data
 * @param {Object} options - Additional options
 * @returns {Object} Generated content and metadata
 */
const generateSinglesReportContent = async (data, options = {}) => {
  console.log('Generating singles report content using chunking approach');
  
  // Prepare prompts for each chunk
  const chunk1Prompt = await prepareSinglesReportPromptChunk1(data);
  const chunk2Prompt = await prepareSinglesReportPromptChunk2(data);
  const chunk3Prompt = await prepareSinglesReportPromptChunk3(data);
  const chunk4Prompt = await prepareSinglesReportPromptChunk4(data);
  
  // Generate content for each chunk
  console.log('Generating content for chunk 1: Introduction and Singles Overview');
  const chunk1Result = await generateReportContent(chunk1Prompt, { ...options, maxTokens: 6000 });
  
  console.log('Generating content for chunk 2: Relationship Prospects & Dating Opportunities');
  const chunk2Result = await generateReportContent(chunk2Prompt, { ...options, maxTokens: 4500 });
  
  console.log('Generating content for chunk 3: Emotional Growth & Relationship Wisdom');
  const chunk3Result = await generateReportContent(chunk3Prompt, { ...options, maxTokens: 4500 });
  
  console.log('Generating content for chunk 4: Relationship Challenges and Love Opportunities');
  const chunk4Result = await generateReportContent(chunk4Prompt, { ...options, maxTokens: 6000 });
  
  // Combine the results
  const combinedContent = [
    chunk1Result.content,
    chunk2Result.content,
    chunk3Result.content,
    chunk4Result.content
  ].join('\n\n');
  
  // Calculate total tokens and cost
  const totalTokensUsed = 
    chunk1Result.tokensUsed + 
    chunk2Result.tokensUsed + 
    chunk3Result.tokensUsed + 
    chunk4Result.tokensUsed;
  
  const totalCost = 
    chunk1Result.cost + 
    chunk2Result.cost + 
    chunk3Result.cost + 
    chunk4Result.cost;
  
  return {
    content: combinedContent,
    tokensUsed: totalTokensUsed,
    cost: totalCost
  };
};

/**
 * Prepare a children's life report prompt for chunk 1 (Introduction)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 1
 */
const prepareChildrensLifeReportPromptChunk1 = async (data) => {
  console.log('Preparing children\'s life report prompt chunk 1 (Introduction)');
  
  // Format birth card
  const birthCard = data.birth_cards[0];
  const formattedBirthCard = await formatCardForPrompt(birthCard);
  
  // Replace placeholders in the prompt template
  let prompt = childrensLifeReportPromptChunk1
    .replace('[Birth Card Name]', formattedBirthCard.name)
    .replace('[Birth Card Keywords]', formattedBirthCard.keywords.join(', '))
    .replace('[Birth Card Description]', formattedBirthCard.description);
  
  return prompt;
};

/**
 * Prepare a children's life report prompt for chunk 2 (Card Analysis for Sun through Jupiter)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 2
 */
const prepareChildrensLifeReportPromptChunk2 = async (data) => {
  console.log('Preparing children\'s life report prompt chunk 2 (Card Analysis for Sun through Jupiter)');
  
  // Format life spread using the spread_with_positions data
  const lifeSpread = [];
  
  // Check if spread_with_positions exists and is an array
  if (data.spread_with_positions && Array.isArray(data.spread_with_positions)) {
    // Use the actual spread data from the report generation service
    // Only include Sun through Jupiter (positions 0-5)
    const sunThroughJupiterPositions = ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter'];
    
    // Find all cards from Sun through Jupiter by position name
    for (const position of sunThroughJupiterPositions) {
      const item = data.spread_with_positions.find(item => item.position === position);
      if (item) {
        const formattedCard = await formatCardForPrompt(item.card);
        lifeSpread.push({
          position: item.position,
          card: formattedCard
        });
      }
    }
  } else {
    console.warn('No spread_with_positions data found for chunk 2, using fallback');
    return ''; // Return empty string to skip this chunk
  }
  
  // Format the spread info
  const spreadInfo = lifeSpread.map(item => 
    `**${item.position}**: ${item.card.name} (${item.card.symbol})\n` +
    `- **Keywords**: ${item.card.keywords.join(', ')}\n` +
    `- **Description**: ${item.card.description}\n`
  ).join('\n');
  
  console.log(`Formatted ${lifeSpread.length} cards for children\'s life report prompt chunk 2`);
  
  // Replace placeholders in the prompt template
  let prompt = childrensLifeReportPromptChunk2
    .replace('[Formatted Spread Info for Sun through Jupiter]', spreadInfo);
  
  return prompt;
};

/**
 * Prepare a children's life report prompt for chunk 3 (Card Analysis for Saturn through Earth)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 3
 */
const prepareChildrensLifeReportPromptChunk3 = async (data) => {
  console.log('Preparing children\'s life report prompt chunk 3 (Card Analysis for Saturn through Earth)');
  
  // Format life spread using the spread_with_positions data
  const lifeSpread = [];
  
  // Check if spread_with_positions exists and is an array
  if (data.spread_with_positions && Array.isArray(data.spread_with_positions)) {
    // Use the actual spread data from the report generation service
    // Only include Saturn through Earth/Transformation (positions 6-12)
    const positions = ['Saturn', 'Uranus', 'Neptune', 'Pluto', 'Result', 'Peak', 'Moon', 'Earth/Transformation'];
    
    // Find all cards from Saturn through Earth by position name
    for (const position of positions) {
      const item = data.spread_with_positions.find(item => item.position === position);
      if (item) {
        const formattedCard = await formatCardForPrompt(item.card);
        lifeSpread.push({
          position: item.position,
          card: formattedCard
        });
      }
    }
  } else {
    console.warn('No spread_with_positions data found for chunk 3, using fallback');
    return ''; // Return empty string to skip this chunk
  }
  
  // Format the spread info
  const spreadInfo = lifeSpread.map(item => 
    `**${item.position}**: ${item.card.name} (${item.card.symbol})\n` +
    `- **Keywords**: ${item.card.keywords.join(', ')}\n` +
    `- **Description**: ${item.card.description}\n`
  ).join('\n');
  
  console.log(`Formatted ${lifeSpread.length} cards for children\'s life report prompt chunk 3`);
  
  // Replace placeholders in the prompt template
  let prompt = childrensLifeReportPromptChunk3
    .replace('[Formatted Spread Info for Saturn through Earth]', spreadInfo);
  
  return prompt;
};

/**
 * Prepare a children's life report prompt for chunk 4 (Development, Education, and Health Guidance)
 * 
 * @param {Object} data - Report data
 * @returns {string} Formatted prompt for chunk 4
 */
const prepareChildrensLifeReportPromptChunk4 = async (data) => {
  console.log('Preparing children\'s life report prompt chunk 4 (Development, Education, and Health Guidance)');
  
  // Format life spread using the spread_with_positions data
  const lifeSpread = [];
  
  // Check if spread_with_positions exists and is an array
  if (data.spread_with_positions && Array.isArray(data.spread_with_positions)) {
    // Use the actual spread data from the report generation service
    for (const item of data.spread_with_positions) {
      const formattedCard = await formatCardForPrompt(item.card);
      lifeSpread.push({
        position: item.position,
        card: formattedCard
      });
    }
  } else {
    console.warn('No spread_with_positions data found for chunk 4, using fallback');
    return ''; // Return empty string to skip this chunk
  }
  
  // Format the spread info
  const spreadInfo = lifeSpread.map(item => 
    `**${item.position}**: ${item.card.name} (${item.card.symbol})\n` +
    `- **Keywords**: ${item.card.keywords.join(', ')}\n` +
    `- **Description**: ${item.card.description}\n`
  ).join('\n');
  
  console.log(`Formatted ${lifeSpread.length} cards for children\'s life report prompt chunk 4`);
  
  // Replace placeholders in the prompt template
  let prompt = childrensLifeReportPromptChunk4
    .replace('[Formatted Spread Info with each card position, name, keywords, and description]', spreadInfo);
  
  return prompt;
};

/**
 * Generate children's life report content using a chunking approach
 * 
 * @param {Object} data - Report data
 * @param {Object} options - Additional options
 * @returns {Object} Generated content and metadata
 */
const generateChildrensLifeReportContent = async (data, options = {}) => {
  console.log('Generating children\'s life report content using chunking approach');
  
  // Prepare prompts for each chunk - using the children's specific prompts
  const chunk1Prompt = await prepareChildrensLifeReportPromptChunk1(data);
  const chunk2Prompt = await prepareChildrensLifeReportPromptChunk2(data);
  const chunk3Prompt = await prepareChildrensLifeReportPromptChunk3(data);
  const chunk4Prompt = await prepareChildrensLifeReportPromptChunk4(data);
  
  // Generate content for each chunk
  console.log('Generating content for chunk 1: Introduction');
  const chunk1Result = await generateReportContent(chunk1Prompt, { 
    ...options, 
    maxTokens: 2000
  });
  
  console.log('Generating content for chunk 2: Card Analysis (Sun through Jupiter)');
  const chunk2Result = await generateReportContent(chunk2Prompt, { 
    ...options, 
    maxTokens: 4500
  });
  
  console.log('Generating content for chunk 3: Card Analysis (Saturn through Earth)');
  const chunk3Result = await generateReportContent(chunk3Prompt, { 
    ...options, 
    maxTokens: 7000
  });
  
  console.log('Generating content for chunk 4: Development, Education, and Health Guidance');
  const chunk4Result = await generateReportContent(chunk4Prompt, { 
    ...options, 
    maxTokens: 4500
  });
  
  // Combine the results
  const combinedContent = [
    chunk1Result.content,
    chunk2Result.content,
    chunk3Result.content,
    chunk4Result.content
  ].join('\n\n');
  
  // Calculate total tokens and cost
  const totalTokensUsed = 
    chunk1Result.tokensUsed + 
    chunk2Result.tokensUsed + 
    chunk3Result.tokensUsed + 
    chunk4Result.tokensUsed;
  
  const totalCost = 
    chunk1Result.cost + 
    chunk2Result.cost + 
    chunk3Result.cost + 
    chunk4Result.cost;
  
  return {
    content: combinedContent,
    tokensUsed: totalTokensUsed,
    cost: totalCost
  };
};

export {
  generateYearlyReportContent,
  generateLifeReportContent,
  generateRelationshipReportContent,
  generateFinancialReportContent,
  generateSinglesReportContent,
  generateChildrensLifeReportContent
};

/**
 * Life Report Prompts
 * 
 * This file contains the prompts for generating life reports.
 */

// Chunk 1: Introduction
const lifeReportPromptChunk1 = `
## Birth Information
- **Birth Card**: [Birth Card Name]
- **Keywords**: [Birth Card Keywords]
- **Card Description**: [Birth Card Description]

Please provide the first part of a detailed life analysis based on these cards. Structure your analysis as follows:

1. **Introduction:** Explain the significance of the Birth Card in the individual's life in a minimum of 500 words. Focus on how this card forms the foundation of their personality, life path, and personal journey. This is their Birth card for life so it never changes.

Use markdown formatting for headers and paragraphs. Bold the card name/symbol on its own line. Ensure the section is detailed and insightful, drawing inferences from the card's keywords and description. Refer to the client directly as "you" within the analysis. Avoid using phrases like "In the realm of." Always include the card symbol (4♥, 5♦, etc.). Always bold the card name/symbol on its own line.

IMPORTANT: Only provide the Introduction section. Do not include any card analysis or other sections.
`;

// Chunk 2: Card Analysis for Sun through Jupiter
const lifeReportPromptChunk2 = `
## Card Analysis
[Formatted Spread Info for Sun through Jupiter]

Please provide the second part of a detailed life analysis based on these cards. Structure your analysis as follows:

For each of the cards in the life spread listed above, provide a 300-word interpretation focused on life path, personal development, and major life themes. Use full card names and symbols. Be aware of the astrological influence from the card's position (e.g., Jupiter/Uranus) and use its astrology to build your interpretation of the energy or influence of each card but do not mention the position in the text - it's only to help you build the interpretation. Also, consider the keywords provided in the card data. Also include a list of tips to gain mastery from this card. Make sure the list uses - for markdown.

Use markdown formatting for headers, paragraphs, and advice lists. Ensure each section is detailed and insightful, drawing inferences from the card's position and keywords. Refer to the client directly as "you" within the analysis. Avoid using phrases like "In the realm of."

IMPORTANT FORMATTING: For each card analysis, start with a dark red title and a divider line below it. Format the title in this exact format:

<span style="color: #8B0000; font-weight: bold;">[Card Name] ([Card Symbol]) - [Position]</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

For example:
<span style="color: #8B0000; font-weight: bold;">Seven of Spades (7♠) - Saturn</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

Do not split this title across multiple lines or add any additional text to this title line. The entire card title must be on a single line.

IMPORTANT: Only provide the Card Analysis for the cards listed above. Do not include any introduction or other sections. Do not include any "Card Analysis" header as it's already included above.
`;

// Chunk 3: Card Analysis for Saturn through Earth
const lifeReportPromptChunk3 = `
## Card Analysis (Continued)
[Formatted Spread Info for Saturn through Earth]

Please provide the third part of a detailed life analysis based on these cards. Structure your analysis as follows:

For each of the cards in the life spread listed above, provide a 300-word interpretation focused on life path, personal development, and major life themes. Use full card names and symbols. Be aware of the astrological influence from the card's position (e.g., Saturn/Pluto) and use its astrology to build your interpretation of the energy or influence of each card but do not mention the position in the text - it's only to help you build the interpretation. Also, consider the keywords provided in the card data. Also include a list of tips to gain mastery from this card. Make sure the list uses - for markdown.

Use markdown formatting for headers, paragraphs, and advice lists. Ensure each section is detailed and insightful, drawing inferences from the card's position and keywords. Refer to the client directly as "you" within the analysis. Avoid using phrases like "In the realm of."

IMPORTANT FORMATTING: For each card analysis, start with a dark red title and a divider line below it. Format the title in this exact format:

<span style="color: #8B0000; font-weight: bold;">[Card Name] ([Card Symbol]) - [Position]</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

For example:
<span style="color: #8B0000; font-weight: bold;">Seven of Spades (7♠) - Saturn</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

Do not split this title across multiple lines or add any additional text to this title line. The entire card title must be on a single line.

IMPORTANT: Only provide the Card Analysis for the cards listed above. Do not include any introduction or other sections. Do not include any "Card Analysis" header as it's already included above.
`;

// Chunk 4: Financial, Love, and Health Outlooks
const lifeReportPromptChunk4 = `
## Life Spread Analysis (Complete)
[Formatted Spread Info with each card position, name, keywords, and description]

Please provide a detailed Financial, Love, Health Outlook based on these cards. Structure your analysis as follows:

1. **Financial Outlook:** Focus on diamonds and cards in Jupiter/Venus positions. Provide a 300-word analysis of the individual's financial life path, including strengths, challenges, and long-term potential. Follow with 7 specific pieces of advice for financial success.

2. **Love Outlook:** Analyze hearts and cards in the Venus position. Provide a 300-word analysis of the individual's relationship patterns, romantic tendencies, and potential for deep connection. Follow with 7 specific pieces of advice for relationship success.

3. **Health Outlook:** Focus on clubs and cards in the Saturn/Mars positions. Provide a 300-word analysis of the individual's health tendencies, potential challenges, and approaches to wellness. Follow with 7 specific pieces of advice for maintaining optimal health.

Use markdown formatting for headers, paragraphs, and advice lists. Ensure each section is detailed and insightful, drawing inferences from the card's position and keywords. Refer to the client directly as "you" within the analysis. Avoid using phrases like "In the realm of."

IMPORTANT FORMATTING: For each card analysis, start with a dark red title and a divider line below it. Format the title in this exact format:

<span style="color: #8B0000; font-weight: bold;">[Card Name] ([Card Symbol]) - [Position]</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

For example:
<span style="color: #8B0000; font-weight: bold;">Seven of Spades (7♠) - Saturn</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

Do not split this title across multiple lines or add any additional text to this title line. The entire card title must be on a single line.

IMPORTANT: Only provide the Financial, Love, and Health Outlooks. Do not include any introduction or card analysis sections that have already been covered.
`;

// Combined prompt for backward compatibility
const lifeReportPrompt = `
## Birth Information
- **Birth Card**: [Birth Card Name]
- **Keywords**: [Birth Card Keywords]
- **Card Description**: [Birth Card Description]

## Life Spread Analysis
[Formatted Spread Info with each card position, name, keywords, and description]

Please provide a detailed life analysis based on these cards. Structure your analysis as follows:

1. **Introduction:** Explain the significance of the Birth Card in the individual's life in a minimum of 500 words. Focus on how this card forms the foundation of their personality, life path, and personal journey. This is their Birth card for life so it never changes.

2. **Card Analysis:** For each of the 13 cards in the life spread, provide a 300-word interpretation focused on life path, personal development, and major life themes. Use full card names and symbols. Be aware of the astrological influence from the card's position (e.g., Jupiter/Uranus) and use its astrology to build your interpretation of the energy or influence of each card but do not mention the position in the text - it's only to help you build the interpretation. Also, consider the keywords provided in the card data.

3. **Financial Outlook:** Focus on diamonds and cards in Jupiter/Venus positions. Provide a 300-word analysis of the individual's financial life path, including strengths, challenges, and long-term potential. Follow with 7 specific pieces of advice for financial success.

4. **Love Outlook:** Analyze hearts and cards in the Venus position. Provide a 300-word analysis of the individual's relationship patterns, romantic tendencies, and potential for deep connection. Follow with 7 specific pieces of advice for relationship success.

5. **Health Outlook:** Focus on clubs and cards in the Saturn/Mars positions. Provide a 300-word analysis of the individual's health tendencies, potential challenges, and approaches to wellness. Follow with 7 specific pieces of advice for maintaining optimal health.

Use markdown formatting for headers, paragraphs, and advice lists. Ensure each section is detailed and insightful, drawing inferences from the card's position and keywords. Refer to the client directly as "you" within the analysis. Avoid using phrases like "In the realm of."

IMPORTANT FORMATTING: For each card analysis, start with a dark red title and a divider line below it. Format the title in this exact format:

<span style="color: #8B0000; font-weight: bold;">[Card Name] ([Card Symbol]) - [Position]</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

For example:
<span style="color: #8B0000; font-weight: bold;">Seven of Spades (7♠) - Saturn</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

Do not split this title across multiple lines or add any additional text to this title line. The entire card title must be on a single line.
`;

// Export the prompts
export {
  lifeReportPrompt,
  lifeReportPromptChunk1,
  lifeReportPromptChunk2,
  lifeReportPromptChunk3,
  lifeReportPromptChunk4
};

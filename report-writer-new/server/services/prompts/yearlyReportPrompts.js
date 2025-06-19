/**
 * Yearly Report Prompts
 * 
 * This file contains the prompts for generating yearly reports.
 */

// Chunk 1: Introduction and Displacing Card
const yearlyReportPromptChunk1 = `
## Birth Information
- **Birth Card**: [Birth Card Name]
- **Keywords**: [Birth Card Keywords]
- **Card Description**: [Birth Card Description]

## Displacing Card: [Displacing Card Name]
- **Keywords**: [Displacing Card Keywords]
- **Card Description**: [Displacing Card Description]

Please provide the first part of a detailed yearly analysis based on these cards. Structure your analysis as follows:

1. **Introduction:** Explain the significance of the Sun card in the individual's life in a minimum of 300 words. This is their Sun card for life so it never changes. Do not refer to it as a "yearly" card. Refer to it as their Birth card.
2. **Displacing Card:** Describe this card and how it may influence the year in a minimum of 500 words. Remember the persons birth card or sun card is displacing this card not vice verse. Explain that displacing this card brings a new experience and perspective and superpowers for the year. For fixed cards like King of Spades, 8 of Clubs, Jack of Hearts they only displace their own card every year - so if its one of those cards explain that and leave out the description.

Use markdown formatting for headers and paragraphs. Bold the card name/symbol on its own line. Ensure each section is detailed and insightful, drawing inferences from the card's position and keywords. Refer to the client directly as "you" within the analysis. Avoid using phrases like "In the realm of." Always include the card symbol (4♥, 5♦, etc.). Always bold the card name/symbol on its own line.

IMPORTANT: Only provide the Introduction and Displacing Card sections. Do not include any card analysis or other sections.
`;

// Chunk 2: Card Analysis for Sun through Jupiter
const yearlyReportPromptChunk2 = `
## Card Analysis
[Formatted Spread Info for Sun through Jupiter]

Please provide the second part of a detailed yearly analysis based on these cards. Structure your analysis as follows:

For each of the cards in the yearly spread listed above, provide a 300-word interpretation. Use full card names and symbols. Be aware of the astrological influence from the card's position (e.g., Jupiter/Uranus) and use its astrology to build your interpretation of the energy or influence of each card but do not mention the position in the text - it's only to help you build the interpretation. Also, consider the keywords provided in the card data. Also include a list of tips to gain mastery from this card. Make sure the list uses - for markdown.

Use markdown formatting for headers, paragraphs, and advice lists. Ensure each section is detailed and insightful, drawing inferences from the card's position and keywords. Refer to the client directly as "you" within the analysis. Avoid using phrases like "In the realm of."

IMPORTANT FORMATTING: For each card analysis, start with a dark red title and a divider line below it. Format the title in this exact format:

<span style="color: #8B0000; font-weight: bold;">[Card Name] ([Card Symbol]) - [Position]</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

For example:
<span style="color: #8B0000; font-weight: bold;">Seven of Spades (7♠) - Saturn</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

Do not split this title across multiple lines or add any additional text to this title line. The entire card title must be on a single line.

IMPORTANT: Only provide the Card Analysis for the cards listed above. Do not include any introduction, displacing card analysis, or other sections. Do not include any "Card Analysis" header as it's already included above.
`;

// Chunk 3: Card Analysis for Saturn through Earth
const yearlyReportPromptChunk3 = `
## Card Analysis (Continued)
[Formatted Spread Info for Saturn through Earth]

Please provide the third part of a detailed yearly analysis based on these cards. Structure your analysis as follows:

For each of the cards in the yearly spread listed above, provide a 300-word interpretation. Use full card names and symbols. Be aware of the astrological influence from the card's position (e.g., Saturn/Pluto) and use its astrology to build your interpretation of the energy or influence of each card but do not mention the position in the text - it's only to help you build the interpretation. Also, consider the keywords provided in the card data. Also include a list of tips to gain mastery from this card. Make sure the list uses - for markdown.

Use markdown formatting for headers, paragraphs, and advice lists. Ensure each section is detailed and insightful, drawing inferences from the card's position and keywords. Refer to the client directly as "you" within the analysis. Avoid using phrases like "In the realm of."

IMPORTANT FORMATTING: For each card analysis, start with a dark red title and a divider line below it. Format the title in this exact format:

<span style="color: #8B0000; font-weight: bold;">[Card Name] ([Card Symbol]) - [Position]</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

For example:
<span style="color: #8B0000; font-weight: bold;">Seven of Spades (7♠) - Saturn</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

Do not split this title across multiple lines or add any additional text to this title line. The entire card title must be on a single line.

IMPORTANT: Only provide the Card Analysis for the cards listed above. Do not include any introduction, displacing card analysis, or other sections. Do not include any "Card Analysis" header as it's already included above.
`;

// Chunk 4: Financial, Love, and Health Outlooks
const yearlyReportPromptChunk4 = `
## Yearly Spread Analysis (Complete)
[Formatted Spread Info with each card position, name, keywords, and description]

Please provide the final part of a detailed yearly analysis based on these cards. Structure your analysis as follows:

1. **Financial Outlook:** Focus on diamonds and cards in Jupiter/Venus positions. Provide a 7-sentence explanation per card, followed by 5 pieces of advice. Only start this section AFTER all card analyses have been completed.

2. **Love Outlook:** Analyze hearts and cards in the Venus position. Provide a 7-sentence explanation per card, followed by 5 pieces of advice.

3. **Health Outlook:** Focus on clubs and cards in the Saturn/Mars positions. Provide a 7-sentence explanation per card, followed by 5 pieces of advice.

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
const yearlyReportPrompt = `
## Birth Information
- **Birth Card**: [Birth Card Name]
- **Keywords**: [Birth Card Keywords]
- **Card Description**: [Birth Card Description]

## Displacing Card: [Displacing Card Name]
- **Keywords**: [Displacing Card Keywords]
- **Card Description**: [Displacing Card Description]

## Yearly Spread Analysis
[Formatted Spread Info with each card position, name, keywords, and description]

Please provide a detailed yearly analysis based on these cards. Structure your analysis as follows:

1. **Introduction:** Explain the significance of the Sun card in the individual's life in a minimum of 300 words. This is their Sun card for life so it never changes. Do not refer to it as a "yearly" card. Refer to it as their Birth card.

2. **Displacing Card:** Describe this card and how it may influence the year in a minimum of 500 words. Remember the persons birth card or sun card is displacing this card not vice verse. Explain that displacing this card brings a new experience and perspective and superpowers for the year. For fixed cards like King of Spades, 8 of Clubs, Jack of Hearts they only displace their own card every year - so if its one of those cards explain that and leave out the description.

3. **Card Analysis:** For each of the 13 cards in the yearly spread, provide a 300-word interpretation. Use full card names and symbols. Be aware of the astrological influence from the card's position (e.g., Jupiter/Uranus) and use its astrology to build your interpretation of the energy or influence of each card but do not mention the position in the text - it's only to help you build the interpretation. Also, consider the keywords provided in the card data.

4. **Financial Outlook:** Focus on diamonds and cards in Jupiter/Venus positions. Provide a 7-sentence explanation per card, followed by 5 pieces of advice. Only start this section AFTER all card analyses have been completed.

5. **Love Outlook:** Analyze hearts and cards in the Venus position. Provide a 7-sentence explanation per card, followed by 5 pieces of advice.

6. **Health Outlook:** Focus on clubs and cards in the Saturn/Mars positions. Provide a 7-sentence explanation per card, followed by 5 pieces of advice.

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
  yearlyReportPrompt,
  yearlyReportPromptChunk1,
  yearlyReportPromptChunk2,
  yearlyReportPromptChunk3,
  yearlyReportPromptChunk4
};

/**
 * Financial Report Prompts
 * 
 * This file contains the prompts for generating financial reports.
 */

// Chunk 1: Introduction and Financial Overview
const financialReportPromptChunk1 = `
## Birth Information
- **Birth Card**: [Birth Card Name]
- **Keywords**: [Birth Card Keywords]
- **Card Description**: [Birth Card Description]

## Displacing Card: [Displacing Card Name]
- **Keywords**: [Displacing Card Keywords]
- **Card Description**: [Displacing Card Description]

## Card Positions
[Formatted Position Correlations]

Please provide the first part of a detailed financial analysis based on these cards. Structure your analysis as follows:

1. **Introduction:** Explain the significance of the Birth Card in the individual's financial life in a minimum of 300 words. Focus on how this card influences their approach to money, wealth creation, and financial decision-making. This is their Birth card for life so it never changes.

2. **Yearly Financial Overview:** Describe how the Displacing Card may influence their financial situation this year in a minimum of 500 words. Explain how displacing this card brings new financial opportunities, challenges, and perspectives for the year. For fixed cards like King of Spades, 8 of Clubs, Jack of Hearts that only displace their own card every year - explain that and focus on the financial implications of this consistency.

3. For the card positions data provided above, analyze how each card's position affects financial outcomes. DO NOT use a separate title for this section. Simply continue your analysis after the Yearly Financial Overview, explaining the significance of each card's position for financial planning and decision-making this year. 

YOU MUST INCLUDE ALL 13 POSITIONS IN YOUR ANALYSIS: Sun, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, Result, Peak, Moon, and Earth/Transformation. For each position, provide a detailed analysis of how the card in that position affects financial outcomes.

Use markdown formatting for headers and paragraphs. For each card in the analysis, start with a dark red title and a divider line below it. Format the title in this exact format:

<span style="color: #8B0000; font-weight: bold;">[Card Name] ([Card Symbol]) - [Position]</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

Ensure each section is detailed and insightful, drawing inferences from the card's position. Refer to the client directly as "you" within the analysis. Avoid using phrases like "In the realm of." Always include the card symbol (4♥, 5♦, etc.). Do not explicitly mention keywords in your analysis, but use them to inform your interpretation.

IMPORTANT: Only provide the Introduction and Yearly Financial Overview sections, followed by the card positions analysis without a separate title. Do not include any investment analysis or other sections.
`;

// Chunk 2: Investment & Business Opportunities Analysis
const financialReportPromptChunk2 = `
## Investment & Business Opportunities Analysis
[Formatted Spread Info for Sun through Jupiter]

Please provide the second part of a detailed financial analysis based on these cards. Structure your analysis as follows:

For each of the cards in the yearly spread listed above, provide a 300-word interpretation focused on both investment opportunities and business ventures. Consider:

1. What types of investments are favored by this card's energy
2. What business sectors or ventures a person could invest in or start based on this card
3. Timing considerations for investments and business launches based on this card
4. Potential returns and risks associated with this card's influence
5. How this card's natural position versus current position affects investment and business outcomes

Use markdown formatting for headers, paragraphs, and advice lists. Ensure each section is detailed and insightful, drawing inferences from the card's position and keywords. Refer to the client directly as "you" within the analysis. Avoid using phrases like "In the realm of."

IMPORTANT FORMATTING: For each card analysis, start with a dark red title and a divider line below it. Format the title in this exact format:

<span style="color: #8B0000; font-weight: bold;">[Card Name] ([Card Symbol]) - [Position] - Investment & Business Opportunities</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

For example:
<span style="color: #8B0000; font-weight: bold;">Seven of Spades (7♠) - Saturn - Investment & Business Opportunities</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

Do not split this title across multiple lines or add any additional text to this title line. The entire card title must be on a single line.

IMPORTANT: Only provide the Investment & Business Opportunities Analysis for the cards listed above. Do not include any introduction or other sections.
`;

// Chunk 3: Business Growth Analysis
const financialReportPromptChunk3 = `
## Business Growth Analysis
[Formatted Spread Info for Saturn through Earth]

Please provide the third part of a detailed financial analysis based on these cards. Structure your analysis as follows:

For each of the cards in the yearly spread listed above, provide a 300-word interpretation focused specifically on business growth opportunities. Consider:

1. What business sectors or activities are favored by this card's energy
2. How to leverage this card's influence for business expansion
3. Potential challenges in business growth associated with this card
4. How this card's natural position versus current position affects business outcomes

Use markdown formatting for headers, paragraphs, and advice lists. Ensure each section is detailed and insightful, drawing inferences from the card's position and keywords. Refer to the client directly as "you" within the analysis. Avoid using phrases like "In the realm of."

IMPORTANT FORMATTING: For each card analysis, start with a dark red title and a divider line below it. Format the title in this exact format:

<span style="color: #8B0000; font-weight: bold;">[Card Name] ([Card Symbol]) - [Position] - Business Growth</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

For example:
<span style="color: #8B0000; font-weight: bold;">Seven of Spades (7♠) - Saturn - Business Growth</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

Do not split this title across multiple lines or add any additional text to this title line. The entire card title must be on a single line.

IMPORTANT: Only provide the Business Growth Analysis for the cards listed above. Do not include any introduction or other sections.
`;

// Chunk 4: Financial Challenges and Diamond Card Money Opportunities
const financialReportPromptChunk4 = `
## Financial Analysis (Complete)
[Formatted Spread Info with each card position, name, keywords, and description]

Please provide the final part of a detailed financial analysis based on these cards. Structure your analysis as follows:

1. **Financial Challenges:** Identify potential financial challenges for this year based on the cards in the spread. Focus particularly on Spades cards, cards in Saturn or Pluto positions, and any cards that are far from their natural positions. For each challenge, provide a 7-sentence explanation followed by 3 specific strategies to overcome it.

2. **Wealth-Building Strategies:** Based on the entire spread, provide 7 specific wealth-building strategies tailored to the client's cards for this year. For each strategy, explain the reasoning behind it in 5 sentences and provide 3 actionable steps to implement it.

3. **Diamond Card Money Opportunities:** Analyze all diamond cards in the spread and their positions to identify specific money-receiving opportunities this year. For each diamond card, consider both the card's inherent meaning and its placement:

   - 10♦: Indicates windfalls or winnings. In Saturn position, this could mean delayed windfalls; in Jupiter, exceptionally large windfalls.
   - 2♦: Indicates deals. The position will influence the timing and nature of these deals.
   - 8♦: Indicates inheritances, settlements, loans, or grants. The position affects how these manifest.
   - 6♦: Indicates retirement funds, investments, income taxes, or money paid to you. Position affects timing and amount.
   - 3♦: Indicates money from "hustling" or from multiple business endeavors or creative pursuits. Position affects which approach works best.
   - 9♦: Indicates philanthropic money or resources from charity, government, crowdfunding, or donations. Position affects the source and timing.
   - 4♦: Indicates money from residual investment, return on investments, banking interest, or venture capital. Position affects which source is most promising.
   - 5♦: Indicates money from investing, speculation, gambling, real estate, crypto, or stocks. Position affects which vehicle is most favorable.
   - 7♦: Indicates money from wealth-building strategies, faith-based approaches, or gambling. Position affects which approach is most effective.
   - A♦: Indicates money from new opportunities, partnerships, fast money, or gaming. Position affects the timing and nature of these opportunities.

   For each diamond card present, provide a 300-word analysis of the specific money opportunity it represents, considering both the card's meaning and its position in the spread.

Use markdown formatting for headers, paragraphs, and advice lists. Ensure each section is detailed and insightful, drawing inferences from the card's position and keywords. Refer to the client directly as "you" within the analysis. Avoid using phrases like "In the realm of."

IMPORTANT: Only provide the Financial Challenges, Wealth-Building Strategies, and Diamond Card Money Opportunities sections. Do not include any introduction or card analysis sections.
`;

// Combined prompt for backward compatibility
const financialReportPrompt = `
## Birth Information
- **Birth Card**: [Birth Card Name]
- **Keywords**: [Birth Card Keywords]
- **Card Description**: [Birth Card Description]

## Displacing Card: [Displacing Card Name]
- **Keywords**: [Displacing Card Keywords]
- **Card Description**: [Displacing Card Description]

## Position Correlations
[Formatted Position Correlations]

## Yearly Spread Analysis
[Formatted Spread Info with each card position, name, keywords, and description]

Please provide a detailed financial analysis based on these cards. Structure your analysis as follows:

1. **Introduction:** Explain the significance of the Birth Card in the individual's financial life in a minimum of 300 words. Focus on how this card influences their approach to money, wealth creation, and financial decision-making. This is their Birth card for life so it never changes.

2. **Yearly Financial Overview:** Describe how the Displacing Card may influence their financial situation this year in a minimum of 500 words. Explain how displacing this card brings new financial opportunities, challenges, and perspectives for the year. For fixed cards like King of Spades, 8 of Clubs, Jack of Hearts that only displace their own card every year - explain that and focus on the financial implications of this consistency.

3. **Position Correlations:** Analyze how cards in their natural positions versus current positions affect financial outcomes. Explain the significance of these correlations for financial planning and decision-making this year.

4. **Investment & Business Opportunities Analysis:** For each of the 13 cards in the yearly spread, provide a 300-word interpretation focused on both investment opportunities and business ventures. Consider what types of investments are favored, what business sectors or ventures a person could invest in or start, timing considerations, potential returns and risks, and how the card's natural position versus current position affects investment and business outcomes.

5. **Business Growth Analysis:** For each of the 13 cards in the yearly spread, provide a 300-word interpretation focused specifically on business growth opportunities. Consider what business sectors are favored, how to leverage the card's influence for business expansion, potential challenges, and how the card's natural position versus current position affects business outcomes.

6. **Financial Challenges:** Identify potential financial challenges for this year based on the cards in the spread. Focus particularly on Spades cards, cards in Saturn or Pluto positions, and any cards that are far from their natural positions. For each challenge, provide a 7-sentence explanation followed by 3 specific strategies to overcome it.

7. **Wealth-Building Strategies:** Based on the entire spread, provide 7 specific wealth-building strategies tailored to the client's cards for this year. For each strategy, explain the reasoning behind it in 5 sentences and provide 3 actionable steps to implement it.

8. **Diamond Card Money Opportunities:** Analyze all diamond cards in the spread and their positions to identify specific money-receiving opportunities this year. For each diamond card, consider both the card's inherent meaning and its placement:

   - 10♦: Indicates windfalls or winnings. In Saturn position, this could mean delayed windfalls; in Jupiter, exceptionally large windfalls.
   - 2♦: Indicates deals. The position will influence the timing and nature of these deals.
   - 8♦: Indicates inheritances, settlements, loans, or grants. The position affects how these manifest.
   - 6♦: Indicates retirement funds, investments, income taxes, or money paid to you. Position affects timing and amount.
   - 3♦: Indicates money from "hustling" or from multiple business endeavors or creative pursuits. Position affects which approach works best.
   - 9♦: Indicates philanthropic money or resources from charity, government, crowdfunding, or donations. Position affects the source and timing.
   - 4♦: Indicates money from residual investment, return on investments, banking interest, or venture capital. Position affects which source is most promising.
   - 5♦: Indicates money from investing, speculation, gambling, real estate, crypto, or stocks. Position affects which vehicle is most favorable.
   - 7♦: Indicates money from wealth-building strategies, faith-based approaches, or gambling. Position affects which approach is most effective.
   - A♦: Indicates money from new opportunities, partnerships, fast money, or gaming. Position affects the timing and nature of these opportunities.

   For each diamond card present, provide a 300-word analysis of the specific money opportunity it represents, considering both the card's meaning and its position in the spread.

Use markdown formatting for headers, paragraphs, and advice lists. Ensure each section is detailed and insightful, drawing inferences from the card's position and keywords. Refer to the client directly as "you" within the analysis. Avoid using phrases like "In the realm of."

IMPORTANT FORMATTING: For each card analysis in the Investment & Business Opportunities and Business Growth sections, start with a dark red title and a divider line below it. Format the title in this exact format:

<span style="color: #8B0000; font-weight: bold;">[Card Name] ([Card Symbol]) - [Position] - [Analysis Type]</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

For example:
<span style="color: #8B0000; font-weight: bold;">Seven of Spades (7♠) - Saturn - Investment & Business Opportunities</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

Do not split this title across multiple lines or add any additional text to this title line. The entire card title must be on a single line.
`;

// Export the prompts
export {
  financialReportPrompt,
  financialReportPromptChunk1,
  financialReportPromptChunk2,
  financialReportPromptChunk3,
  financialReportPromptChunk4
};

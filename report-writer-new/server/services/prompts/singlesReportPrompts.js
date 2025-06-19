/**
 * Singles Report Prompts
 * 
 * This file contains the prompts for generating singles reports.
 */

// Chunk 1: Introduction and Singles Overview
const singlesReportPromptChunk1 = `
## Birth Information
- **Birth Card**: [Birth Card Name]
- **Keywords**: [Birth Card Keywords]
- **Card Description**: [Birth Card Description]

## Displacing Card: [Displacing Card Name]
- **Keywords**: [Displacing Card Keywords]
- **Card Description**: [Displacing Card Description]

Please provide the first part of a detailed singles analysis based on these cards. Structure your analysis as follows:

1. **Introduction:** Explain the significance of the Birth Card in the individual's romantic life in a minimum of 300 words. Focus on how this card influences their approach to dating, relationships, and love. This is their Birth card for life so it never changes.

2. **Singles Overview for This Year:** Describe how the Displacing Card may influence their romantic situation this year in a minimum of 500 words. Explain how displacing this card brings new romantic opportunities, challenges, and perspectives for the year. For fixed cards like King of Spades, 8 of Clubs, Jack of Hearts that only displace their own card every year - explain that and focus on the romantic implications of this consistency.

Use markdown formatting for headers and paragraphs. Bold the card name/symbol on its own line. Ensure each section is detailed and insightful, drawing inferences from the card's keywords and description. Refer to the client directly as "you" within the analysis. Avoid using phrases like "In the realm of." Always include the card symbol (4♥, 5♦, etc.). Always bold the card name/symbol on its own line.

IMPORTANT: Only provide the Introduction and Singles Overview sections. Do not include any card analysis or other sections.
`;

// Chunk 2: Relationship Prospects & Dating Opportunities
const singlesReportPromptChunk2 = `
## Relationship Prospects & Dating Opportunities
[Formatted Spread Info for Sun through Jupiter]

Please provide the second part of a detailed singles analysis based on these cards. Structure your analysis as follows:

For each of the cards in the yearly spread listed above, provide a 300-word interpretation focused specifically on dating prospects and relationship opportunities. Consider:

1. What types of romantic connections are favored by this card's energy
2. What potential partners or dating scenarios might manifest based on this card
3. Timing considerations for romantic pursuits based on this card
4. Potential strengths and challenges in dating associated with this card's influence
5. How this card's natural position versus current position affects romantic outcomes

Use markdown formatting for headers, paragraphs, and advice lists. Ensure each section is detailed and insightful, drawing inferences from the card's position and keywords. Refer to the client directly as "you" within the analysis. Avoid using phrases like "In the realm of."

IMPORTANT FORMATTING: For each card analysis, start with a dark red title and a divider line below it. Format the title in this exact format:

<span style="color: #8B0000; font-weight: bold;">[Card Name] ([Card Symbol]) - [Position] - Relationship Prospects</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

For example:
<span style="color: #8B0000; font-weight: bold;">Seven of Spades (7♠) - Saturn - Relationship Prospects</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

Do not split this title across multiple lines or add any additional text to this title line. The entire card title must be on a single line.

IMPORTANT: Only provide the Relationship Prospects & Dating Opportunities Analysis for the cards listed above. Do not include any introduction or other sections.
`;

// Chunk 3: Emotional Growth & Relationship Wisdom
const singlesReportPromptChunk3 = `
## Emotional Growth & Relationship Wisdom
[Formatted Spread Info for Saturn through Earth]

Please provide the third part of a detailed singles analysis based on these cards. Structure your analysis as follows:

For each of the cards in the yearly spread listed above, provide a 300-word interpretation focused specifically on emotional growth and relationship wisdom. Consider:

1. What emotional lessons or growth opportunities are presented by this card's energy
2. How to leverage this card's influence for personal development in relationships
3. What relationship wisdom or insights this card offers for the single individual
4. How this card's natural position versus current position affects emotional development

Use markdown formatting for headers, paragraphs, and advice lists. Ensure each section is detailed and insightful, drawing inferences from the card's position and keywords. Refer to the client directly as "you" within the analysis. Avoid using phrases like "In the realm of."

IMPORTANT FORMATTING: For each card analysis, start with a dark red title and a divider line below it. Format the title in this exact format:

<span style="color: #8B0000; font-weight: bold;">[Card Name] ([Card Symbol]) - [Position] - Emotional Growth</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

For example:
<span style="color: #8B0000; font-weight: bold;">Seven of Spades (7♠) - Saturn - Emotional Growth</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

Do not split this title across multiple lines or add any additional text to this title line. The entire card title must be on a single line.

IMPORTANT: Only provide the Emotional Growth & Relationship Wisdom Analysis for the cards listed above. Do not include any introduction or other sections.
`;

// Chunk 4: Relationship Challenges and Love Opportunities
const singlesReportPromptChunk4 = `
## Singles Analysis (Complete)
[Formatted Spread Info with each card position, name, keywords, and description]

Please provide the final part of a detailed singles analysis based on these cards. Structure your analysis as follows:

1. **Relationship Challenges:** Identify potential romantic challenges for this year based on the cards in the spread. Focus particularly on Spades cards, cards in Saturn or Pluto positions, and any cards that are far from their natural positions. For each challenge, provide a 7-sentence explanation followed by 3 specific strategies to overcome it.

2. **Self-Development for Love:** Based on the entire spread, provide 7 specific self-development strategies tailored to the client's cards for this year that will enhance their romantic prospects. For each strategy, explain the reasoning behind it in 5 sentences and provide 3 actionable steps to implement it.

3. **Heart Card Love Opportunities:** Analyze all heart cards in the spread and their positions to identify specific love opportunities this year. For each heart card, consider both the card's inherent meaning and its placement:

   - A♥: Represents new love, a fresh start in relationships, or a significant emotional beginning.
   - K♥: For women, represents the man of their dreams; for men, becoming the man of someone's dreams or stepping into the role of husband or father.
   - Q♥: Represents romantic marriage, the role of wife or mother, or potential pregnancy.
   - J♥: Represents youthful or immature love - someone who may not be ready for commitment.
   - 10♥: Indicates emotional richness, family connections, and committed relationships.
   - 9♥: Could represent a rebound relationship or highlight the need to work on one's own emotional baggage before getting serious with someone new.
   - 8♥: Suggests emotional transformation and deepening of feelings in relationships.
   - 7♥: Represents someone you may fall hard for, but signals a need to take it slow, get to know them properly, and maintain healthy boundaries.
   - 6♥: Indicates the arrival of someone very important relationship-wise, often marriage material or a significant long-term partner.
   - 5♥: Represents freedom and unconventional relationships.
   - 4♥: The traditional marriage card, representing preparation for marriage and family.
   - 3♥: Represents dating, diversifying romantic connections, and exploring relationships outside your typical type.
   - 2♥: Represents an intense connection, possibly a soulmate relationship or a deeply meaningful partnership.

   For each heart card present, provide a 300-word analysis of the specific love opportunity it represents, considering both the card's meaning and its position in the spread.

Use markdown formatting for headers, paragraphs, and advice lists. Ensure each section is detailed and insightful, drawing inferences from the card's position and keywords. Refer to the client directly as "you" within the analysis. Avoid using phrases like "In the realm of."

IMPORTANT: Only provide the Relationship Challenges, Self-Development for Love, and Heart Card Love Opportunities sections. Do not include any introduction or card analysis sections.
`;

// Combined prompt for backward compatibility
const singlesReportPrompt = `
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

Please provide a detailed singles analysis based on these cards. Structure your analysis as follows:

1. **Introduction:** Explain the significance of the Birth Card in the individual's romantic life in a minimum of 300 words. Focus on how this card influences their approach to dating, relationships, and love. This is their Birth card for life so it never changes.

2. **Singles Overview for This Year:** Describe how the Displacing Card may influence their romantic situation this year in a minimum of 500 words. Explain how displacing this card brings new romantic opportunities, challenges, and perspectives for the year. For fixed cards like King of Spades, 8 of Clubs, Jack of Hearts that only displace their own card every year - explain that and focus on the romantic implications of this consistency.

3. **Position Correlations:** Analyze how cards in their natural positions versus current positions affect romantic outcomes. Explain the significance of these correlations for dating and relationship prospects this year.

4. **Relationship Prospects & Dating Opportunities:** For each of the 13 cards in the yearly spread, provide a 300-word interpretation focused specifically on dating prospects and relationship opportunities. Consider what types of romantic connections are favored, what potential partners might manifest, timing considerations, and how the card's natural position versus current position affects romantic outcomes.

5. **Emotional Growth & Relationship Wisdom:** For each of the 13 cards in the yearly spread, provide a 300-word interpretation focused specifically on emotional growth and relationship wisdom. Consider what emotional lessons are presented, how to leverage the card's influence for personal development, what relationship wisdom this card offers, and how the card's natural position versus current position affects emotional development.

6. **Relationship Challenges:** Identify potential romantic challenges for this year based on the cards in the spread. Focus particularly on Spades cards, cards in Saturn or Pluto positions, and any cards that are far from their natural positions. For each challenge, provide a 7-sentence explanation followed by 3 specific strategies to overcome it.

7. **Self-Development for Love:** Based on the entire spread, provide 7 specific self-development strategies tailored to the client's cards for this year that will enhance their romantic prospects. For each strategy, explain the reasoning behind it in 5 sentences and provide 3 actionable steps to implement it.

8. **Heart Card Love Opportunities:** Analyze all heart cards in the spread and their positions to identify specific love opportunities this year. For each heart card, consider both the card's inherent meaning and its placement:

   - A♥: Represents new love, a fresh start in relationships, or a significant emotional beginning.
   - K♥: For women, represents the man of their dreams; for men, becoming the man of someone's dreams or stepping into the role of husband or father.
   - Q♥: Represents romantic marriage, the role of wife or mother, or potential pregnancy.
   - J♥: Represents youthful or immature love - someone who may not be ready for commitment.
   - 10♥: Indicates emotional richness, family connections, and committed relationships.
   - 9♥: Could represent a rebound relationship or highlight the need to work on one's own emotional baggage before getting serious with someone new.
   - 8♥: Suggests emotional transformation and deepening of feelings in relationships.
   - 7♥: Represents someone you may fall hard for, but signals a need to take it slow, get to know them properly, and maintain healthy boundaries.
   - 6♥: Indicates the arrival of someone very important relationship-wise, often marriage material or a significant long-term partner.
   - 5♥: Represents freedom and unconventional relationships.
   - 4♥: The traditional marriage card, representing preparation for marriage and family.
   - 3♥: Represents dating, diversifying romantic connections, and exploring relationships outside your typical type.
   - 2♥: Represents an intense connection, possibly a soulmate relationship or a deeply meaningful partnership.

   For each heart card present, provide a 300-word analysis of the specific love opportunity it represents, considering both the card's meaning and its position in the spread.

Use markdown formatting for headers, paragraphs, and advice lists. Ensure each section is detailed and insightful, drawing inferences from the card's position and keywords. Refer to the client directly as "you" within the analysis. Avoid using phrases like "In the realm of."

IMPORTANT FORMATTING: For each card analysis in the Relationship Prospects & Dating Opportunities and Emotional Growth & Relationship Wisdom sections, start with a dark red title and a divider line below it. Format the title in this exact format:

<span style="color: #8B0000; font-weight: bold;">[Card Name] ([Card Symbol]) - [Position] - [Analysis Type]</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

For example:
<span style="color: #8B0000; font-weight: bold;">Seven of Spades (7♠) - Saturn - Relationship Prospects</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

Do not split this title across multiple lines or add any additional text to this title line. The entire card title must be on a single line.
`;

// Export the prompts
export {
  singlesReportPrompt,
  singlesReportPromptChunk1,
  singlesReportPromptChunk2,
  singlesReportPromptChunk3,
  singlesReportPromptChunk4
};

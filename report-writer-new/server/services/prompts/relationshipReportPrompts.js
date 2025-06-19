/**
 * Relationship Report Prompts
 * 
 * This file contains the prompts for generating relationship reports.
 */

// Chunk 1: Introduction and Combination Card
const relationshipReportPromptChunk1 = `
## Birth Information - Person 1
- **Birth Card**: [Birth Card 1 Name]
- **Keywords**: [Birth Card 1 Keywords]
- **Card Description**: [Birth Card 1 Description]

## Birth Information - Person 2
- **Birth Card**: [Birth Card 2 Name]
- **Keywords**: [Birth Card 2 Keywords]
- **Card Description**: [Birth Card 2 Description]

## Combination Card
- **Card**: [Combination Card Name]
- **Keywords**: [Combination Card Keywords]
- **Card Description**: [Combination Card Description]

Please provide the first part of a detailed relationship analysis based on these cards. Structure your analysis as follows:

1. **Introduction:** Explain the significance of each person's Birth Card in a minimum of 200 words per person. Focus on how each card influences their approach to relationships, communication style, and emotional needs.

2. **Combination Card Analysis:** Provide a 500-word analysis of the Combination Card and what it reveals about the relationship dynamic. Explain how this card represents the energy created when these two individuals come together and what it suggests about their compatibility and relationship potential.

Use markdown formatting for headers and paragraphs. Bold the card name/symbol on its own line. Ensure each section is detailed and insightful, drawing inferences from the card's keywords and description. Refer to the clients directly as "you" within the analysis. Avoid using phrases like "In the realm of." Always include the card symbol (4♥, 5♦, etc.). Always bold the card name/symbol on its own line.

IMPORTANT: Only provide the Introduction and Combination Card Analysis sections. Do not include any card analysis or other sections.
`;

// Chunk 2: POV Analysis
const relationshipReportPromptChunk2 = `
## POV Analysis
- **Person 1 POV Card**: [Person 1 POV Card Name]
- **Keywords**: [Person 1 POV Card Keywords]
- **Card Description**: [Person 1 POV Card Description]

- **Person 2 POV Card**: [Person 2 POV Card Name]
- **Keywords**: [Person 2 POV Card Keywords]
- **Card Description**: [Person 2 POV Card Description]

Please provide the second part of a detailed relationship analysis based on these cards. Structure your analysis as follows:

1. **Person 1's Perspective:** Provide a 300-word analysis of how Person 1 views the relationship based on their POV card. Consider their expectations, what attracts them to Person 2, and what they hope to gain from the relationship.

2. **Person 2's Perspective:** Provide a 300-word analysis of how Person 2 views the relationship based on their POV card. Consider their expectations, what attracts them to Person 1, and what they hope to gain from the relationship.

3. **Perspective Alignment:** Provide a 300-word analysis comparing the two perspectives and discussing areas of alignment and potential misunderstanding. Offer insights into how these different viewpoints might complement or challenge each other.

Use markdown formatting for headers and paragraphs. Bold the card name/symbol on its own line. Ensure each section is detailed and insightful, drawing inferences from the card's keywords and description. Refer to the clients directly as "you" within the analysis. Avoid using phrases like "In the realm of." Always include the card symbol (4♥, 5♦, etc.). Always bold the card name/symbol on its own line.

IMPORTANT: Only provide the POV Analysis sections. Do not include any introduction, combination card analysis, or other sections.
`;

// Chunk 3: Spread Analysis - First Half
const relationshipReportPromptChunk3 = `
## Relationship Spread Analysis
[Formatted Spread Info for Sun through Jupiter]

Please provide the third part of a detailed relationship analysis based on these cards. Structure your analysis as follows:

For each of the cards in the relationship spread listed above, provide a 300-word interpretation focused on how this energy affects the relationship. Consider communication patterns, shared activities, mutual growth, and potential challenges. Use full card names and symbols. Be aware of the astrological influence from the card's position (e.g., Jupiter/Uranus) and use its astrology to build your interpretation of the energy or influence of each card but do not mention the position in the text - it's only to help you build the interpretation. Also, consider the keywords provided in the card data.

Use markdown formatting for headers, paragraphs, and advice lists. Ensure each section is detailed and insightful, drawing inferences from the card's position and keywords. Refer to the clients directly as "you" within the analysis. Avoid using phrases like "In the realm of."

IMPORTANT FORMATTING: For each card analysis, start with a dark red title and a divider line below it. Format the title in this exact format:

<span style="color: #8B0000; font-weight: bold;">[Card Name] ([Card Symbol]) - [Position]</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

For example:
<span style="color: #8B0000; font-weight: bold;">Seven of Spades (7♠) - Saturn</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

Do not split this title across multiple lines or add any additional text to this title line. The entire card title must be on a single line.

IMPORTANT: Only provide the Relationship Spread Analysis for the cards listed above. Do not include any introduction, POV analysis, or other sections. Do not include any "Relationship Spread Analysis" header as it's already included above.
`;

// Chunk 4: Spread Analysis - Second Half
const relationshipReportPromptChunk4 = `
## Relationship Spread Analysis (Continued)
[Formatted Spread Info for Saturn through Earth]

Please provide the fourth part of a detailed relationship analysis based on these cards. Structure your analysis as follows:

For each of the cards in the relationship spread listed above, provide a 300-word interpretation focused on how this energy affects the relationship. Consider communication patterns, shared activities, mutual growth, and potential challenges. Use full card names and symbols. Be aware of the astrological influence from the card's position (e.g., Saturn/Pluto) and use its astrology to build your interpretation of the energy or influence of each card but do not mention the position in the text - it's only to help you build the interpretation. Also, consider the keywords provided in the card data.

Use markdown formatting for headers, paragraphs, and advice lists. Ensure each section is detailed and insightful, drawing inferences from the card's position and keywords. Refer to the clients directly as "you" within the analysis. Avoid using phrases like "In the realm of."

IMPORTANT FORMATTING: For each card analysis, start with a dark red title and a divider line below it. Format the title in this exact format:

<span style="color: #8B0000; font-weight: bold;">[Card Name] ([Card Symbol]) - [Position]</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

For example:
<span style="color: #8B0000; font-weight: bold;">Seven of Spades (7♠) - Saturn</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

Do not split this title across multiple lines or add any additional text to this title line. The entire card title must be on a single line.

IMPORTANT: Only provide the Relationship Spread Analysis for the cards listed above. Do not include any introduction, POV analysis, or other sections. Do not include any "Relationship Spread Analysis" header as it's already included above.
`;

// Chunk 5: Deeper Relationship Analysis
const relationshipReportPromptChunk5 = `
## Deeper Relationship Analysis
[Formatted Spread Info with each card position, name, keywords, and description]

Please provide the final part of a detailed relationship analysis based on these cards. Structure your analysis as follows:

1. **Communication Patterns:** Analyze Mercury and air cards (Spades) in the spread to identify communication patterns, strengths, and challenges in the relationship. Provide a 300-word analysis followed by 5 specific strategies to improve communication.

2. **Emotional Connection:** Analyze Venus, Moon, and water cards (Hearts) in the spread to explore the emotional bond, intimacy, and emotional compatibility. Provide a 300-word analysis followed by 5 specific strategies to deepen emotional connection.

3. **Shared Purpose:** Analyze Jupiter, Uranus, and fire cards (Clubs) in the spread to understand shared goals, vision for the future, and mutual growth. Provide a 300-word analysis followed by 5 specific strategies to strengthen shared purpose.

4. **Practical Compatibility:** Analyze Saturn, Earth, and earth cards (Diamonds) in the spread to assess day-to-day compatibility, shared responsibilities, and practical aspects of the relationship. Provide a 300-word analysis followed by 5 specific strategies to enhance practical compatibility.

5. **Relationship Potential:** Based on the entire spread, provide a 500-word analysis of the relationship's potential, including strengths to leverage, challenges to navigate, and the overall trajectory. Focus on what makes this relationship unique and how both individuals can contribute to its growth.

Use markdown formatting for headers, paragraphs, and advice lists. Ensure each section is detailed and insightful, drawing inferences from the card's position and keywords. Refer to the clients directly as "you" within the analysis. Avoid using phrases like "In the realm of."

IMPORTANT FORMATTING: For each card mentioned in your analysis, format its first mention in this exact format:

<span style="color: #8B0000; font-weight: bold;">[Card Name] ([Card Symbol])</span>

For example:
<span style="color: #8B0000; font-weight: bold;">Seven of Spades (7♠)</span>

IMPORTANT: Only provide the Deeper Relationship Analysis sections. Do not include any introduction, POV analysis, or card analysis sections that have already been covered.
`;

// Combined prompt for backward compatibility
const relationshipReportPrompt = `
## Birth Information - Person 1
- **Birth Card**: [Birth Card 1 Name]
- **Keywords**: [Birth Card 1 Keywords]
- **Card Description**: [Birth Card 1 Description]

## Birth Information - Person 2
- **Birth Card**: [Birth Card 2 Name]
- **Keywords**: [Birth Card 2 Keywords]
- **Card Description**: [Birth Card 2 Description]

## Combination Card
- **Card**: [Combination Card Name]
- **Keywords**: [Combination Card Keywords]
- **Card Description**: [Combination Card Description]

## POV Analysis
- **Person 1 POV Card**: [Person 1 POV Card Name]
- **Keywords**: [Person 1 POV Card Keywords]
- **Card Description**: [Person 1 POV Card Description]

- **Person 2 POV Card**: [Person 2 POV Card Name]
- **Keywords**: [Person 2 POV Card Keywords]
- **Card Description**: [Person 2 POV Card Description]

## Relationship Spread Analysis
[Formatted Spread Info with each card position, name, keywords, and description]

Please provide a detailed relationship analysis based on these cards. Structure your analysis as follows:

1. **Introduction:** Explain the significance of each person's Birth Card in a minimum of 200 words per person. Focus on how each card influences their approach to relationships, communication style, and emotional needs.

2. **Combination Card Analysis:** Provide a 500-word analysis of the Combination Card and what it reveals about the relationship dynamic. Explain how this card represents the energy created when these two individuals come together and what it suggests about their compatibility and relationship potential.

3. **Person 1's Perspective:** Provide a 300-word analysis of how Person 1 views the relationship based on their POV card. Consider their expectations, what attracts them to Person 2, and what they hope to gain from the relationship.

4. **Person 2's Perspective:** Provide a 300-word analysis of how Person 2 views the relationship based on their POV card. Consider their expectations, what attracts them to Person 1, and what they hope to gain from the relationship.

5. **Perspective Alignment:** Provide a 300-word analysis comparing the two perspectives and discussing areas of alignment and potential misunderstanding. Offer insights into how these different viewpoints might complement or challenge each other.

6. **Card Analysis:** For each of the 13 cards in the relationship spread, provide a 300-word interpretation focused on how this energy affects the relationship. Consider communication patterns, shared activities, mutual growth, and potential challenges. Use full card names and symbols. Be aware of the astrological influence from the card's position (e.g., Jupiter/Uranus) and use its astrology to build your interpretation of the energy or influence of each card but do not mention the position in the text - it's only to help you build the interpretation. Also, consider the keywords provided in the card data.

7. **Communication Patterns:** Analyze Mercury and air cards (Spades) in the spread to identify communication patterns, strengths, and challenges in the relationship. Provide a 300-word analysis followed by 5 specific strategies to improve communication.

8. **Emotional Connection:** Analyze Venus, Moon, and water cards (Hearts) in the spread to explore the emotional bond, intimacy, and emotional compatibility. Provide a 300-word analysis followed by 5 specific strategies to deepen emotional connection.

9. **Shared Purpose:** Analyze Jupiter, Uranus, and fire cards (Clubs) in the spread to understand shared goals, vision for the future, and mutual growth. Provide a 300-word analysis followed by 5 specific strategies to strengthen shared purpose.

10. **Practical Compatibility:** Analyze Saturn, Earth, and earth cards (Diamonds) in the spread to assess day-to-day compatibility, shared responsibilities, and practical aspects of the relationship. Provide a 300-word analysis followed by 5 specific strategies to enhance practical compatibility.

11. **Relationship Potential:** Based on the entire spread, provide a 500-word analysis of the relationship's potential, including strengths to leverage, challenges to navigate, and the overall trajectory. Focus on what makes this relationship unique and how both individuals can contribute to its growth.

Use markdown formatting for headers, paragraphs, and advice lists. Ensure each section is detailed and insightful, drawing inferences from the card's position and keywords. Refer to the clients directly as "you" within the analysis. Avoid using phrases like "In the realm of."

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
  relationshipReportPrompt,
  relationshipReportPromptChunk1,
  relationshipReportPromptChunk2,
  relationshipReportPromptChunk3,
  relationshipReportPromptChunk4,
  relationshipReportPromptChunk5
};

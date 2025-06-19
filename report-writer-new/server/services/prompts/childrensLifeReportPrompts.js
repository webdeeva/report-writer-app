/**
 * Children's Life Report Prompts
 * 
 * This file contains the prompts for generating children's life reports.
 */

// Chunk 1: Introduction
const childrensLifeReportPromptChunk1 = `
## Birth Information
- **Birth Card**: [Birth Card Name]
- **Keywords**: [Birth Card Keywords]
- **Card Description**: [Birth Card Description]

Please provide the first part of a detailed children's life analysis based on these cards. Structure your analysis as follows:

1. **Introduction:** Explain the significance of the Birth Card in the child's life in a minimum of 500 words. Focus on how this card forms the foundation of their personality, development, and personal journey. This is their Birth card for life so it never changes. Include both the positive gifts and potential challenges this card brings. Discuss:
   - Natural strengths and talents
   - Areas where the child may struggle or face difficulties
   - Common behavioral patterns (both positive and challenging)
   - Potential emotional or social challenges
   - How parents can help navigate the difficult aspects

Tailor the analysis to be appropriate for parents of children aged 14-15 and under. Be honest about challenges while remaining constructive and offering guidance.

Use markdown formatting for headers and paragraphs. Bold the card name/symbol on its own line. Ensure the section is detailed and insightful, using the keywords and description to inform your analysis but DO NOT mention the keywords directly in the text. Refer to the child directly as "your child" when addressing the parents. Avoid using phrases like "In the realm of." Always include the card symbol (4♥, 5♦, etc.). Always bold the card name/symbol on its own line. Avoid using em dashes (—) in your writing.

If the card's keywords and description suggest patterns consistent with neurodevelopmental conditions (such as ADHD, autism spectrum traits, OCD tendencies, anxiety, sensory processing differences, etc.), mention these possibilities sensitively. Frame as "may show traits similar to..." or "might benefit from evaluation for..." Always note these are observations, not diagnoses.

IMPORTANT: Only provide the Introduction section. Do not include any card analysis or other sections.
`;

// Chunk 2: Card Analysis for Sun through Jupiter
const childrensLifeReportPromptChunk2 = `
## Card Analysis
[Formatted Spread Info for Sun through Jupiter]

Please provide the second part of a detailed children's life analysis based on these cards. Structure your analysis as follows:

For each of the cards in the life spread listed above, provide a 300-word interpretation focused on child development, learning style, and major developmental themes. Use full card names and symbols. Be aware of the astrological influence from the card's position (e.g., Jupiter/Uranus) and use its astrology to build your interpretation of the energy or influence of each card but do not mention the position in the text - it's only to help you build the interpretation. Also, consider the keywords provided in the card data. 

For each card, provide a balanced analysis that includes:
- Positive traits and abilities this card brings
- Potential challenges, difficulties, or negative patterns
- How these challenges might manifest in childhood
- Specific behavioral or emotional issues to watch for

Also include a list of parenting tips that address BOTH nurturing the positive aspects AND managing the challenging aspects of this card's energy. Make sure the list uses - for markdown.

Use markdown formatting for headers, paragraphs, and advice lists. Ensure each section is detailed and insightful, using the card's position and keywords to inform your analysis but DO NOT mention the keywords directly in the text. Address the parents directly and refer to the child as "your child" within the analysis. Avoid using phrases like "In the realm of." Avoid using em dashes (—) in your writing.

When relevant based on the card's meaning and position, mention if your child might show traits consistent with conditions like ADHD, autism spectrum, OCD, anxiety disorders, or sensory processing differences. Be specific but sensitive, using phrases like "may exhibit behaviors similar to..." or "could benefit from screening for..."

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
const childrensLifeReportPromptChunk3 = `
## Card Analysis (Continued)
[Formatted Spread Info for Saturn through Earth]

Please provide the third part of a detailed children's life analysis based on these cards. Structure your analysis as follows:

For each of the cards in the life spread listed above, provide a 300-word interpretation focused on child development, learning style, and major developmental themes. Use full card names and symbols. Be aware of the astrological influence from the card's position (e.g., Saturn/Pluto) and use its astrology to build your interpretation of the energy or influence of each card but do not mention the position in the text - it's only to help you build the interpretation. Also, consider the keywords provided in the card data. 

For each card, provide a balanced analysis that includes:
- Positive traits and abilities this card brings
- Potential challenges, difficulties, or negative patterns
- How these challenges might manifest in childhood
- Specific behavioral or emotional issues to watch for

Also include a list of parenting tips that address BOTH nurturing the positive aspects AND managing the challenging aspects of this card's energy. Make sure the list uses - for markdown.

Use markdown formatting for headers, paragraphs, and advice lists. Ensure each section is detailed and insightful, using the card's position and keywords to inform your analysis but DO NOT mention the keywords directly in the text. Address the parents directly and refer to the child as "your child" within the analysis. Avoid using phrases like "In the realm of." Avoid using em dashes (—) in your writing.

When relevant based on the card's meaning and position, mention if your child might show traits consistent with conditions like ADHD, autism spectrum, OCD, anxiety disorders, or sensory processing differences. Be specific but sensitive, using phrases like "may exhibit behaviors similar to..." or "could benefit from screening for..."

IMPORTANT FORMATTING: For each card analysis, start with a dark red title and a divider line below it. Format the title in this exact format:

<span style="color: #8B0000; font-weight: bold;">[Card Name] ([Card Symbol]) - [Position]</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

For example:
<span style="color: #8B0000; font-weight: bold;">Seven of Spades (7♠) - Saturn</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

Do not split this title across multiple lines or add any additional text to this title line. The entire card title must be on a single line.

IMPORTANT: Only provide the Card Analysis for the cards listed above. Do not include any introduction or other sections. Do not include any "Card Analysis" header as it's already included above.
`;

// Chunk 4: Development, Education, and Health Guidance
const childrensLifeReportPromptChunk4 = `
## Children's Life Analysis (Complete)
[Formatted Spread Info with each card position, name, keywords, and description]

Please provide the final part of a detailed children's life analysis based on these cards. Structure your analysis as follows:

1. **Development Guidance:** Focus on clubs and cards in Jupiter/Uranus positions. Provide a 300-word analysis of the child's developmental strengths, learning style, and potential. Include both gifts and developmental challenges. Discuss potential delays, difficulties, or areas where the child may struggle. Follow with 7 specific pieces of advice for parents that address both supporting strengths and managing developmental challenges.

2. **Education Approach:** Analyze spades and cards in Mercury positions. Provide a 300-word analysis of the child's educational needs, learning preferences, and academic potential. Be honest about potential learning difficulties, attention issues, or academic challenges. Discuss both areas where the child will excel and where they may struggle. Follow with 7 specific pieces of advice for parents and educators that address both maximizing potential and supporting areas of difficulty.

3. **Health & Wellness:** Focus on diamonds and hearts in the Saturn/Mars positions. Provide a 300-word analysis of the child's health tendencies, physical energy, and emotional well-being. Include potential health vulnerabilities, emotional sensitivities, stress patterns, and areas of concern. Be specific about what to watch for. Follow with 7 specific pieces of advice for maintaining health while addressing potential physical and emotional challenges.

4. **Parent-Child Relationship:** Based on the entire spread, provide a 500-word analysis of how parents can best support, nurture, and guide this child based on their unique card energies. Include discussion of:
   - Potential conflicts or power struggles
   - Communication challenges
   - Discipline issues and effective approaches
   - Emotional triggers and sensitivities
   - How to navigate difficult phases
   - Building trust while maintaining boundaries
Focus on realistic strategies that acknowledge both the joys and challenges of raising this particular child.

Use markdown formatting for headers, paragraphs, and advice lists. Ensure each section is detailed and insightful, using the card's position and keywords to inform your analysis but DO NOT mention the keywords directly in the text. Address the parents directly and refer to the child as "your child" within the analysis. Avoid using phrases like "In the realm of." Avoid using em dashes (—) in your writing.

Throughout these sections, when the cards suggest patterns consistent with neurodevelopmental or psychological conditions (ADHD, autism spectrum, OCD, anxiety, sensory processing, learning differences, etc.), mention these sensitively. Use language like "may benefit from evaluation for..." or "shows patterns consistent with..."

IMPORTANT FORMATTING: For each card mentioned in your analysis, format its first mention in this exact format:

<span style="color: #8B0000; font-weight: bold;">[Card Name] ([Card Symbol])</span>

For example:
<span style="color: #8B0000; font-weight: bold;">Seven of Spades (7♠)</span>

IMPORTANT: Only provide the Development Guidance, Education Approach, Health & Wellness, and Parent-Child Relationship sections. Do not include any introduction or card analysis sections that have already been covered.

At the very end of your response, add this disclaimer:
**Important Note:** This reading is based on archetypal patterns and is not a medical or psychological diagnosis. If you have concerns about your child's development, behavior, or health, please consult with qualified healthcare professionals, including pediatricians, child psychologists, or developmental specialists. Early intervention and professional support can make a significant difference in addressing any challenges your child may face.
`;

// Combined prompt for backward compatibility
const childrensLifeReportPrompt = `
## Birth Information
- **Birth Card**: [Birth Card Name]
- **Keywords**: [Birth Card Keywords]
- **Card Description**: [Birth Card Description]

## Life Spread Analysis
[Formatted Spread Info with each card position, name, keywords, and description]

Please provide a detailed children's life analysis based on these cards. Structure your analysis as follows:

1. **Introduction:** Explain the significance of the Birth Card in the child's life in a minimum of 500 words. Focus on how this card forms the foundation of their personality, development, and personal journey. Include both positive gifts and potential challenges. Discuss natural strengths, areas of difficulty, behavioral patterns, and emotional challenges. This is their Birth card for life so it never changes. Tailor the analysis to be appropriate for parents of children aged 14-15 and under.

2. **Card Analysis:** For each of the 13 cards in the life spread, provide a 300-word interpretation focused on child development, learning style, and major developmental themes. Include both positive traits and potential challenges for each card. Discuss how difficulties might manifest and specific issues to watch for. Use full card names and symbols. Be aware of the astrological influence from the card's position (e.g., Jupiter/Uranus) and use its astrology to build your interpretation of the energy or influence of each card but do not mention the position in the text - it's only to help you build the interpretation. Also, consider the keywords provided in the card data.

3. **Development Guidance:** Focus on clubs and cards in Jupiter/Uranus positions. Provide a 300-word analysis of the child's developmental strengths, learning style, and potential. Include developmental challenges, potential delays, and areas of struggle. Follow with 7 specific pieces of advice for parents that address both nurturing strengths and managing challenges.

4. **Education Approach:** Analyze spades and cards in Mercury positions. Provide a 300-word analysis of the child's educational needs, learning preferences, and academic potential. Include potential learning difficulties, attention issues, and academic challenges. Follow with 7 specific pieces of advice for parents and educators that address both maximizing potential and supporting difficulties.

5. **Health & Wellness:** Focus on diamonds and hearts in the Saturn/Mars positions. Provide a 300-word analysis of the child's health tendencies, physical energy, and emotional well-being. Include health vulnerabilities, emotional sensitivities, and stress patterns. Follow with 7 specific pieces of advice for maintaining health while addressing challenges.

6. **Parent-Child Relationship:** Based on the entire spread, provide a 500-word analysis of how parents can best support, nurture, and guide this child. Include potential conflicts, communication challenges, discipline issues, emotional triggers, and strategies for difficult phases. Focus on realistic approaches that acknowledge both joys and challenges of raising this particular child.

Use markdown formatting for headers, paragraphs, and advice lists. Ensure each section is detailed and insightful, using the card's position and keywords to inform your analysis but DO NOT mention the keywords directly in the text. Address the parents directly and refer to the child as "your child" within the analysis. Avoid using phrases like "In the realm of." Avoid using em dashes (—) in your writing.

Throughout the report, when cards suggest patterns consistent with neurodevelopmental or psychological conditions (ADHD, autism spectrum, OCD, anxiety, sensory processing, learning differences, etc.), mention these sensitively. Use language like "may benefit from evaluation for..." or "shows patterns consistent with..."

IMPORTANT FORMATTING: For each card analysis, start with a dark red title and a divider line below it. Format the title in this exact format:

<span style="color: #8B0000; font-weight: bold;">[Card Name] ([Card Symbol]) - [Position]</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

For example:
<span style="color: #8B0000; font-weight: bold;">Seven of Spades (7♠) - Saturn</span>
<hr style="border-top: 1px solid #ddd; margin-top: 5px; margin-bottom: 15px;">

Do not split this title across multiple lines or add any additional text to this title line. The entire card title must be on a single line.

At the very end of your report, add this disclaimer:
**Important Note:** This reading is based on archetypal patterns and is not a medical or psychological diagnosis. If you have concerns about your child's development, behavior, or health, please consult with qualified healthcare professionals, including pediatricians, child psychologists, or developmental specialists. Early intervention and professional support can make a significant difference in addressing any challenges your child may face.
`;

// Export the prompts
export {
  childrensLifeReportPrompt,
  childrensLifeReportPromptChunk1,
  childrensLifeReportPromptChunk2,
  childrensLifeReportPromptChunk3,
  childrensLifeReportPromptChunk4
};

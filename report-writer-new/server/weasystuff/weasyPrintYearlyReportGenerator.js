/**
 * WeasyPrint Yearly Report Generator Service
 * 
 * This service generates yearly reports using WeasyPrint for high-quality PDF output.
 */

import { generatePdf } from '../weasy-print/index.js';
import path from 'path';
import fs from 'fs';
import { join } from 'path';

// Card suit symbols
const SUIT_SYMBOLS = {
  'S': '♠',
  'H': '♥',
  'D': '♦',
  'C': '♣'
};

/**
 * Generate a yearly or life report using WeasyPrint
 * 
 * @param {Object} params - The parameters for the report
 * @param {string} params.name - The person's name
 * @param {string} params.birthDate - The person's birth date
 * @param {number} params.age - The person's age
 * @param {string} params.birthCard - The person's birth card
 * @param {string} params.displacingCard - The person's displacing card (only for yearly reports)
 * @param {Object} params.yearlySpread - The spread data
 * @param {string} params.analysis - The analysis content
 * @param {string} [params.email] - The person's email (optional)
 * @param {boolean} [params.includeAstrology] - Whether to include astrology (optional)
 * @param {boolean} [params.includeTarot] - Whether to include tarot (optional)
 * @param {boolean} [params.includeNumerology] - Whether to include numerology (optional)
 * @param {string} [params.type] - The report type ('yearly' or 'life')
 * @param {number} [params.person1_id] - The person's ID (optional)
 * @returns {Promise<Buffer>} The PDF buffer
 */
async function generateWeasyPrintYearlyReport(params) {
  try {
    const isLifeReport = params.type === 'life';
    const reportType = isLifeReport ? 'life' : 'yearly';
    
    console.log(`=== WEASYPRINT ${reportType.toUpperCase()} REPORT SERVICE STARTED ===`);
    console.log(`Generating ${reportType} report for:`, params.name);
    
    // Format the birth date with timezone handling
    // Parse the date parts to avoid timezone issues
    let birthDate;
    if (typeof params.birthDate === 'string') {
      // If it's a date string like YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(params.birthDate)) {
        const [year, month, day] = params.birthDate.split('-').map(Number);
        birthDate = new Date(year, month - 1, day); // Month is 0-indexed in JS Date
      } 
      // If it's an ISO string, extract just the date part
      else if (params.birthDate.includes('T')) {
        const datePart = params.birthDate.split('T')[0];
        const [year, month, day] = datePart.split('-').map(Number);
        birthDate = new Date(year, month - 1, day); // Month is 0-indexed in JS Date
      } 
      // Otherwise, create a Date object directly
      else {
        birthDate = new Date(params.birthDate);
      }
    } else {
      // If it's already a Date object
      birthDate = params.birthDate;
    }
    
    const formattedBirthDate = birthDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC' // Use UTC to avoid timezone issues
    });
    
    // Format the yearly spread
    const formattedYearlySpread = formatYearlySpread(params.yearlySpread);
    
    // Generate karma content
    const karmaContent = generateKarmaContent(formattedYearlySpread);
    
    // Generate the HTML content
    const htmlContent = generateHtmlTemplate({
      name: params.name,
      birthDate: formattedBirthDate,
      age: params.age,
      birthCard: formatCardName(params.birthCard),
      displacingCard: isLifeReport ? null : formatCardName(params.displacingCard),
      yearlySpread: formattedYearlySpread,
      analysis: formatAnalysisContent(params.analysis),
      karmaContent: karmaContent,
      reportType: reportType
    });
    
    // Generate the CSS content
    const cssContent = generateCssStyles();
    
    // Generate the PDF
    const pdfBuffer = await generatePdf({
      html: htmlContent,
      css: cssContent
    });
    
    console.log('Yearly report generated successfully');
    return pdfBuffer;
  } catch (error) {
    console.error('Error in generateWeasyPrintYearlyReport:', error);
    throw new Error(`Yearly report generation failed: ${error.message}`);
  }
}

/**
 * Format a card name with proper suit symbols
 * 
 * @param {string} cardName - The card name (e.g., "AS" for Ace of Spades)
 * @returns {string} The formatted card name
 */
function formatCardName(cardName) {
  if (!cardName) return '';
  
  // Handle cards that already have symbols
  if (cardName.includes('♠') || cardName.includes('♥') || 
      cardName.includes('♦') || cardName.includes('♣')) {
    return cardName;
  }
  
  // Extract the value and suit
  const value = cardName.slice(0, -1);
  const suit = cardName.slice(-1).toUpperCase();
  
  // Map the suit to a symbol
  const suitSymbol = SUIT_SYMBOLS[suit] || suit;
  
  return `${value}${suitSymbol}`;
}

/**
 * Format the yearly spread with proper suit symbols
 * 
 * @param {Object} yearlySpread - The yearly spread data
 * @returns {Object} The formatted yearly spread
 */
function formatYearlySpread(yearlySpread) {
  if (!yearlySpread) return {};
  
  const formattedSpread = {};
  
  for (const [position, card] of Object.entries(yearlySpread)) {
    formattedSpread[position] = formatCardName(card);
  }
  
  return formattedSpread;
}

/**
 * Get karma data for a specific card
 * 
 * @param {string} cardString - The card string (e.g., "10♥", "K♠")
 * @returns {Object|null} Karma data for the card or null if not found
 */
function getCardKarma(cardString) {
  if (!cardString) return null;
  
  try {
    // Parse the card string to get the value and suit
    let cardName;
    
    // Handle cards that already have symbols
    if (cardString.includes('♠')) {
      const value = cardString.replace('♠', '');
      cardName = convertValueToFullName(value) + ' of Spades';
    } else if (cardString.includes('♥')) {
      const value = cardString.replace('♥', '');
      cardName = convertValueToFullName(value) + ' of Hearts';
    } else if (cardString.includes('♦')) {
      const value = cardString.replace('♦', '');
      cardName = convertValueToFullName(value) + ' of Diamonds';
    } else if (cardString.includes('♣')) {
      const value = cardString.replace('♣', '');
      cardName = convertValueToFullName(value) + ' of Clubs';
    } else {
      // Handle cards without symbols (e.g., "AS" for Ace of Spades)
      const value = cardString.slice(0, -1);
      const suit = cardString.slice(-1).toUpperCase();
      
      let suitName;
      switch (suit) {
        case 'S': suitName = 'Spades'; break;
        case 'H': suitName = 'Hearts'; break;
        case 'D': suitName = 'Diamonds'; break;
        case 'C': suitName = 'Clubs'; break;
        default: suitName = suit;
      }
      
      cardName = convertValueToFullName(value) + ' of ' + suitName;
    }
    
    console.log(`Getting karma for card: ${cardString} (${cardName})`);
    
    // Load card data from cards.json
    const cardsJsonPath = join(process.cwd(), 'cards.json');
    const cardsData = JSON.parse(fs.readFileSync(cardsJsonPath, 'utf-8'));
    
    // Find the card in the data
    const card = cardsData.find(c => c.Card === cardName);
    
    if (card && card['Daily Karma']) {
      console.log(`Found karma data for card: ${cardName}`);
      return card['Daily Karma'];
    }
    
    // Try to find the card by searching through all cards
    for (const c of cardsData) {
      if (c.Card && c.Card.toLowerCase() === cardName.toLowerCase()) {
        console.log(`Found karma data for card (case-insensitive): ${cardName}`);
        return c['Daily Karma'];
      }
    }
    
    // Try to find the card by searching through all cards and checking the Birthdays field
    const today = new Date();
    const month = today.getMonth() + 1; // getMonth() returns 0-11
    const day = today.getDate();
    const dateString = `${month}/${day}`;
    const formattedDateString = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(today);
    
    for (const c of cardsData) {
      if (c.Birthdays && Array.isArray(c.Birthdays)) {
        for (const birthday of c.Birthdays) {
          if (birthday.includes(dateString) || birthday.includes(formattedDateString)) {
            console.log(`Found karma data for card by birthday (${birthday}): ${c.Card}`);
            return c['Daily Karma'];
          }
        }
      }
    }
    
    // Default karma data for cards not found in the JSON
    console.log(`No karma data found for card: ${cardName}, using default`);
    return {
      'Positive Experiences': [
        'Experiencing personal growth and development',
        'Finding opportunities for self-expression and creativity',
        'Building meaningful connections with others',
        'Discovering new insights about yourself and the world',
        'Overcoming challenges through perseverance and resilience'
      ],
      'Negative Experiences': [
        'Facing obstacles that test your patience and determination',
        'Dealing with unexpected changes or disruptions',
        'Experiencing moments of self-doubt or uncertainty',
        'Navigating complex decisions or choices',
        'Encountering situations that require adaptability and flexibility'
      ]
    };
  } catch (error) {
    console.error('Error getting card karma:', error);
    return null;
  }
}

/**
 * Convert card value to full name (e.g., "A" to "Ace", "K" to "King")
 * 
 * @param {string} value - The card value
 * @returns {string} The full name of the card value
 */
function convertValueToFullName(value) {
  switch (value) {
    case 'A': return 'Ace';
    case 'K': return 'King';
    case 'Q': return 'Queen';
    case 'J': return 'Jack';
    case '2': return 'Two';
    case '3': return 'Three';
    case '4': return 'Four';
    case '5': return 'Five';
    case '6': return 'Six';
    case '7': return 'Seven';
    case '8': return 'Eight';
    case '9': return 'Nine';
    case '10': return 'Ten';
    default: return value;
  }
}

/**
 * Generate karma content for all cards in a yearly spread
 * 
 * @param {Object} yearlySpread - The yearly spread object
 * @returns {string} Formatted HTML for all karma data
 */
function generateKarmaContent(yearlySpread) {
  if (!yearlySpread) return '';
  
  // Introduction text for the karma section
  const introText = `
    <p>
      In Cardology, karmas represent the energetic signatures associated with each card. These signatures shape the events, experiences, and opportunities that manifest on any given day. The concept of karmas in Cardology bears a striking resemblance to the ancient Egyptian calendar of good and bad days, which outlined specific experiences and advised on the favorability of initiating new ventures.
    </p>
    <p>
      Each card carries its own unique set of karmas, both positive and negative. These karmas influence the day's events when a particular card is active. For example, a day governed by the Jack of Clubs might bring experiences such as financial concerns, increased risk of car-related issues, intellectual debates, job-related anxieties, or recognition for knowledge and expertise.
    </p>
    <p>
      It's important to understand that anything born or created on a particular day inherits the birthday of that day, along with its corresponding card and all associated karmas. This concept explains many of life's seeming inconsistencies and offers a blueprint for crafting a more harmonious life.
    </p>
    <p>
      The karmas listed for each card in your yearly spread represent potential experiences, both positive and negative, that you may encounter during the period influenced by that card. By being aware of these potential influences, you can better navigate challenges and capitalize on opportunities as they arise.
    </p>
    <p>
      Remember, while karmas suggest potential experiences, your free will and personal choices play a significant role in how these energies manifest in your life. Use this knowledge as a tool for self-awareness and personal growth rather than as a deterministic forecast.
    </p>
  `;
  
  let html = `<div class="karma-intro">${introText}</div>\n`;
  
  // Process each position in the yearly spread
  const positions = {
    sun: 'Sun',
    mercury: 'Mercury',
    venus: 'Venus',
    mars: 'Mars',
    jupiter: 'Jupiter',
    saturn: 'Saturn',
    uranus: 'Uranus',
    neptune: 'Neptune',
    pluto: 'Pluto',
    result: 'Result',
    peak: 'Peak',
    moon: 'Moon',
    earth: 'Earth'
  };
  
  // Convert the yearlySpread object to an array of positions
  Object.entries(yearlySpread)
    .filter(([key]) => positions[key])
    .forEach(([key, card]) => {
      const positionName = positions[key];
      const karma = getCardKarma(card);
      
      if (karma) {
        html += `<div class="karma-card-section">\n`;
        html += `<h3>${positionName} - ${card}</h3>\n`;
        
        // Format positive experiences
        if (karma['Positive Experiences'] && karma['Positive Experiences'].length > 0) {
          html += '<div class="karma-positive">\n';
          html += '<h4>Positive Experiences</h4>\n<ul>\n';
          karma['Positive Experiences'].forEach(experience => {
            html += `<li>${experience}</li>\n`;
          });
          html += '</ul>\n</div>\n';
        }
        
        // Format negative experiences
        if (karma['Negative Experiences'] && karma['Negative Experiences'].length > 0) {
          html += '<div class="karma-negative">\n';
          html += '<h4>Negative Experiences</h4>\n<ul>\n';
          karma['Negative Experiences'].forEach(experience => {
            html += `<li>${experience}</li>\n`;
          });
          html += '</ul>\n</div>\n';
        }
        
        html += `</div>\n`;
      }
    });
  
  // Add copyright footer
  html += `<div class="karma-copyright">Copyright 2025 Aquarius Maximus - www.aquariusmaximus.com</div>\n`;
  
  return html;
}

/**
 * Format the analysis content as HTML
 * 
 * @param {string} analysisContent - The analysis content in Markdown format
 * @returns {string} The formatted analysis content as HTML
 */
function formatAnalysisContent(analysisContent) {
  if (!analysisContent) return '';
  
  // Simple Markdown to HTML conversion
  let html = analysisContent
    // Headers
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Lists
    .replace(/^\s*-\s*(.*$)/gm, '<li>$1</li>')
    .replace(/^\s*\d+\.\s*(.*$)/gm, '<li>$1</li>')
    
    // Paragraphs
    .replace(/\n\n/g, '</p><p>');
  
  // Wrap in paragraph tags
  html = '<p>' + html + '</p>';
  
  // Fix lists
  html = html.replace(/<p><li>/g, '<ul><li>');
  html = html.replace(/<\/li><\/p>/g, '</li></ul>');
  
  // Fix consecutive list items
  html = html.replace(/<\/li><li>/g, '</li>\n<li>');
  
  return html;
}

/**
 * Generate the HTML template for the report
 * 
 * @param {Object} data - The data for the template
 * @returns {string} The HTML template
 */
function generateHtmlTemplate(data) {
  const isLifeReport = data.reportType === 'life';
  const reportTitle = isLifeReport ? 'Life Report Analysis' : 'Yearly Deep Dive Analysis';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${reportTitle} - ${data.name}</title>
</head>
<body>
  <div class="cover-page">
    <div class="cover-header">
      <div class="cover-border"></div>
      <h1 class="cover-title">${reportTitle}</h1>
    </div>
    
    <div class="cover-content">
      <h2 class="person-name">${data.name}</h2>
      
      <div class="birth-cards">
        <div class="birth-card" style="${data.birthCard && (data.birthCard.includes('♥') || data.birthCard.includes('♦')) ? 'color: #8B0000;' : ''}">${data.birthCard}</div>
        ${!isLifeReport ? `<div class="displacing-card" style="${data.displacingCard && (data.displacingCard.includes('♥') || data.displacingCard.includes('♦')) ? 'color: #8B0000;' : ''}">${data.displacingCard}</div>` : ''}
      </div>
      
      <div class="birth-info">
        <p>Age: ${data.age}</p>
        <p>Birth Card: ${data.birthCard}</p>
        ${!isLifeReport ? `<p>Displacing Card: ${data.displacingCard}</p>` : ''}
      </div>
    </div>
    
    <div class="cover-footer">
      <p>Cardology Analysis</p>
    </div>
  </div>
  
  <div class="page-break"></div>
  
  <div class="birth-info-section">
    <h2>Birth Information</h2>
    
    <div class="info-box">
      <div class="info-row">
        <div class="info-label">Name:</div>
        <div class="info-value">${data.name}</div>
      </div>
      
      <div class="info-row">
        <div class="info-label">Birth Date:</div>
        <div class="info-value">${data.birthDate}</div>
      </div>
      
      <div class="info-row">
        <div class="info-label">Age:</div>
        <div class="info-value">${data.age}</div>
      </div>
      
      <div class="info-row">
        <div class="info-label">Birth Card:</div>
        <div class="info-value" style="${data.birthCard && (data.birthCard.includes('♥') || data.birthCard.includes('♦')) ? 'color: #8B0000;' : ''}">${data.birthCard}</div>
      </div>
      
      ${!isLifeReport ? `
      <div class="info-row">
        <div class="info-label">Displacing Card:</div>
        <div class="info-value" style="${data.displacingCard && (data.displacingCard.includes('♥') || data.displacingCard.includes('♦')) ? 'color: #8B0000;' : ''}">${data.displacingCard}</div>
      </div>
      ` : ''}
    </div>
  </div>
  
  <div class="page-break"></div>
  
  <div class="yearly-spread-section">
    <h2>${isLifeReport ? 'Life Spread' : 'Yearly Spread'}</h2>
    
    <div class="spread-visualization">
      <div class="spread-row">
        <div class="spread-position">
          <div class="position-label">Sun</div>
          <div class="position-card" style="${data.yearlySpread.sun && (data.yearlySpread.sun.includes('♥') || data.yearlySpread.sun.includes('♦')) ? 'color: #8B0000;' : ''}">${data.yearlySpread.sun || ''}</div>
        </div>
        
        <div class="spread-position">
          <div class="position-label">Mercury</div>
          <div class="position-card" style="${data.yearlySpread.mercury && (data.yearlySpread.mercury.includes('♥') || data.yearlySpread.mercury.includes('♦')) ? 'color: #8B0000;' : ''}">${data.yearlySpread.mercury || ''}</div>
        </div>
        
        <div class="spread-position">
          <div class="position-label">Venus</div>
          <div class="position-card" style="${data.yearlySpread.venus && (data.yearlySpread.venus.includes('♥') || data.yearlySpread.venus.includes('♦')) ? 'color: #8B0000;' : ''}">${data.yearlySpread.venus || ''}</div>
        </div>
        
        <div class="spread-position">
          <div class="position-label">Mars</div>
          <div class="position-card" style="${data.yearlySpread.mars && (data.yearlySpread.mars.includes('♥') || data.yearlySpread.mars.includes('♦')) ? 'color: #8B0000;' : ''}">${data.yearlySpread.mars || ''}</div>
        </div>
      </div>
      
      <div class="spread-row">
        <div class="spread-position">
          <div class="position-label">Jupiter</div>
          <div class="position-card" style="${data.yearlySpread.jupiter && (data.yearlySpread.jupiter.includes('♥') || data.yearlySpread.jupiter.includes('♦')) ? 'color: #8B0000;' : ''}">${data.yearlySpread.jupiter || ''}</div>
        </div>
        
        <div class="spread-position">
          <div class="position-label">Saturn</div>
          <div class="position-card" style="${data.yearlySpread.saturn && (data.yearlySpread.saturn.includes('♥') || data.yearlySpread.saturn.includes('♦')) ? 'color: #8B0000;' : ''}">${data.yearlySpread.saturn || ''}</div>
        </div>
        
        <div class="spread-position">
          <div class="position-label">Uranus</div>
          <div class="position-card" style="${data.yearlySpread.uranus && (data.yearlySpread.uranus.includes('♥') || data.yearlySpread.uranus.includes('♦')) ? 'color: #8B0000;' : ''}">${data.yearlySpread.uranus || ''}</div>
        </div>
        
        <div class="spread-position">
          <div class="position-label">Neptune</div>
          <div class="position-card" style="${data.yearlySpread.neptune && (data.yearlySpread.neptune.includes('♥') || data.yearlySpread.neptune.includes('♦')) ? 'color: #8B0000;' : ''}">${data.yearlySpread.neptune || ''}</div>
        </div>
      </div>
      
      <div class="spread-row">
        <div class="spread-position">
          <div class="position-label">Pluto</div>
          <div class="position-card" style="${data.yearlySpread.pluto && (data.yearlySpread.pluto.includes('♥') || data.yearlySpread.pluto.includes('♦')) ? 'color: #8B0000;' : ''}">${data.yearlySpread.pluto || ''}</div>
        </div>
        
        <div class="spread-position">
          <div class="position-label">Result</div>
          <div class="position-card" style="${data.yearlySpread.result && (data.yearlySpread.result.includes('♥') || data.yearlySpread.result.includes('♦')) ? 'color: #8B0000;' : ''}">${data.yearlySpread.result || ''}</div>
        </div>
        
        <div class="spread-position">
          <div class="position-label">Peak</div>
          <div class="position-card" style="${data.yearlySpread.peak && (data.yearlySpread.peak.includes('♥') || data.yearlySpread.peak.includes('♦')) ? 'color: #8B0000;' : ''}">${data.yearlySpread.peak || ''}</div>
        </div>
        
        <div class="spread-position">
          <div class="position-label">Moon</div>
          <div class="position-card" style="${data.yearlySpread.moon && (data.yearlySpread.moon.includes('♥') || data.yearlySpread.moon.includes('♦')) ? 'color: #8B0000;' : ''}">${data.yearlySpread.moon || ''}</div>
        </div>
      </div>
      
      <div class="spread-row">
        <div class="spread-position">
          <div class="position-label">Earth</div>
          <div class="position-card" style="${data.yearlySpread.earth && (data.yearlySpread.earth.includes('♥') || data.yearlySpread.earth.includes('♦')) ? 'color: #8B0000;' : ''}">${data.yearlySpread.earth || ''}</div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="page-break"></div>
  
  <div class="analysis-section">
    <div class="analysis-content">
      ${data.analysis}
    </div>
  </div>
  
  ${data.karmaContent ? `
  <div class="page-break"></div>
  
  <div class="karma-section">
    <h2>${isLifeReport ? 'Life Card Karmas' : 'Yearly Card Karmas'}</h2>
    <div class="karma-content">
      ${data.karmaContent}
    </div>
  </div>
  ` : ''}
  
  <div class="footer">
    <div class="footer-content">
      <p>${data.reportType === 'life' ? 'Life Report' : 'Yearly Deep Dive'} - ${data.name}</p>
    </div>
    <div class="page-number"></div>
  </div>
</body>
</html>`;
}

/**
 * Generate the CSS styles for the yearly report
 * 
 * @returns {string} The CSS styles
 */
function generateCssStyles() {
  return `
/* Base Styles */
@page {
  size: letter;
  margin: 1cm;
  @bottom-center {
    content: counter(page);
    font-family: Arial, sans-serif;
    font-size: 10pt;
  }
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333333;
  margin: 0;
  padding: 0;
}

h1, h2, h3, h4 {
  font-family: Arial, sans-serif;
  color: #8B0000;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

h1 {
  font-size: 28pt;
  text-align: center;
}

h2 {
  font-size: 24pt;
  border-bottom: 2px solid #C53030;
  padding-bottom: 5px;
}

h3 {
  font-size: 18pt;
  color: #4A4A4A;
}

h4 {
  font-size: 14pt;
  color: #4A4A4A;
}

p {
  margin-bottom: 1em;
}

ul, ol {
  margin-bottom: 1em;
  padding-left: 2em;
}

li {
  margin-bottom: 0.5em;
}

.page-break {
  page-break-after: always;
}

/* Cover Page */
.cover-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2cm;
  box-sizing: border-box;
}

.cover-header {
  text-align: center;
  position: relative;
  padding-bottom: 20px;
}

.cover-border {
  border-top: 4px solid #8B0000;
  width: 100%;
  margin-bottom: 20px;
}

.cover-title {
  font-size: 36pt;
  color: #8B0000;
  margin: 0;
}

.cover-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.person-name {
  font-size: 30pt;
  color: #4A4A4A;
  margin-bottom: 40px;
}

.birth-cards {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
}

.birth-card, .displacing-card {
  font-size: 24pt; /* Reduced from 48pt to match other cards */
  padding: 5px; /* Reduced from 15px to make cards more compact */
  border: 2px solid #C53030;
  border-radius: 10px;
  width: 100px; /* Reduced from 120px */
  height: 100px; /* Reduced from 120px */
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto; /* Center the card */
}

.birth-info {
  font-size: 16pt;
  color: #4A4A4A;
}

.cover-footer {
  text-align: center;
  font-size: 14pt;
  color: #666666;
}

/* Birth Information Section */
.birth-info-section {
  padding: 20px;
  margin-bottom: 40px;
}

.info-box {
  border: 1px solid #E0E0E0;
  border-left: 5px solid #C53030;
  padding: 20px;
  background-color: #F9F9F9;
  margin-top: 20px;
}

.info-row {
  display: flex;
  margin-bottom: 10px;
}

.info-label {
  font-weight: bold;
  width: 150px;
}

.info-value {
  flex-grow: 1;
}

/* Yearly Spread Section */
.yearly-spread-section {
  padding: 20px;
  margin-bottom: 40px;
}

.spread-visualization {
  margin-top: 30px;
  width: 100%;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.spread-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px; /* Reduced margin between rows */
  width: 100%;
}

/* Special case for rows with fewer cards */
.spread-row:nth-child(4) {
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 20px;
}

.spread-position {
  text-align: center;
  padding: 0 20px; /* Add horizontal padding to each position */
}

.position-label {
  font-weight: bold;
  margin-bottom: 15px; /* Margin below label */
  color: #4A4A4A;
  font-size: 14pt;
}

.position-card {
  font-size: 24pt;
  padding: 5px; /* Reduced from 15px to match birth cards */
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100px; /* Reduced from 120px to match birth cards */
  height: 100px; /* Reduced from 120px to match birth cards */
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 10px auto; /* Center the card and add bottom margin */
}

/* Default color for cards */
.position-card {
  /* Default color for all cards */
  color: #000000;
}

/* Analysis Section */
.analysis-section {
  padding: 20px;
}

.analysis-content {
  line-height: 1.8;
}

.analysis-content h1 {
  font-size: 28pt;
  color: #8B0000;
  text-align: center;
  margin-bottom: 30px;
}

.analysis-content h2 {
  font-size: 24pt;
  color: #8B0000;
  border-bottom: 2px solid #C53030;
  padding-bottom: 5px;
  margin-top: 40px;
}

.analysis-content h3 {
  font-size: 18pt;
  color: #4A4A4A;
  margin-top: 30px;
}

.analysis-content p {
  margin-bottom: 1em;
}

.analysis-content ul, .analysis-content ol {
  margin-bottom: 1em;
  padding-left: 2em;
}

.analysis-content li {
  margin-bottom: 0.5em;
}

/* Karma Section */
.karma-section {
  padding: 20px;
  margin-bottom: 40px;
}

.karma-content {
  line-height: 1.8;
}

.karma-intro {
  margin-bottom: 30px;
  background-color: #F9F9F9;
  padding: 20px;
  border-radius: 8px;
  border-left: 5px solid #C53030;
}

.karma-card-section {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #E0E0E0;
}

.karma-card-section h3 {
  color: #8B0000;
  font-size: 20pt;
  margin-bottom: 20px;
  padding-bottom: 5px;
  border-bottom: 1px solid #C53030;
}

.karma-positive, .karma-negative {
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 8px;
}

.karma-positive {
  background-color: rgba(0, 128, 0, 0.05);
  border-left: 4px solid #008000;
}

.karma-negative {
  background-color: rgba(220, 20, 60, 0.05);
  border-left: 4px solid #DC143C;
}

.karma-positive h4 {
  color: #008000;
}

.karma-negative h4 {
  color: #DC143C;
}

.karma-copyright {
  text-align: center;
  font-size: 12pt;
  color: #666666;
  margin-top: 50px;
  padding-top: 20px;
  border-top: 1px solid #E0E0E0;
  font-style: italic;
}

/* Footer */
.footer {
  position: running(footer);
  text-align: center;
  font-size: 10pt;
  color: #666666;
  border-top: 1px solid #E0E0E0;
  padding-top: 10px;
  margin-top: 40px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
}

.page-number:before {
  content: counter(page);
}
`;
}

export {
  generateWeasyPrintYearlyReport
};

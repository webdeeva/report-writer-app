import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { PlayingCard, CardGroup, CardDetails, createCard, calculateBirthCards, calculateYearCard } from './index';
import { CardSuit, CardValue } from '../../utils/cardUtils';
/**
 * CardDemo component for demonstrating the card visualization components
 *
 * This component shows examples of the different card components
 * and how they can be used in the application.
 */
const CardDemo = () => {
    // Sample cards for demonstration
    const aceOfHearts = createCard(CardSuit.Hearts, CardValue.Ace);
    const kingOfSpades = createCard(CardSuit.Spades, CardValue.King);
    const queenOfDiamonds = createCard(CardSuit.Diamonds, CardValue.Queen);
    const jackOfClubs = createCard(CardSuit.Clubs, CardValue.Jack);
    // Sample birth date for demonstration
    const [birthdate, setBirthdate] = useState('1990-01-01');
    const [age, setAge] = useState(33);
    // Calculate birth cards and year card based on birthdate and age
    const birthCards = calculateBirthCards(birthdate);
    const yearCard = calculateYearCard(birthdate, age);
    // Sample card group
    const cardGroup = [aceOfHearts, kingOfSpades, queenOfDiamonds, jackOfClubs];
    return (_jsxs("div", { className: "p-6 max-w-6xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Card Visualization Components" }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "PlayingCard Component" }), _jsx("p", { className: "mb-4", children: "The PlayingCard component displays a single playing card with different sizes." }), _jsxs("div", { className: "flex flex-wrap gap-6 mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Small" }), _jsx(PlayingCard, { card: aceOfHearts, size: "sm" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Medium (Default)" }), _jsx(PlayingCard, { card: kingOfSpades, size: "md" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Large" }), _jsx(PlayingCard, { card: queenOfDiamonds, size: "lg" })] })] }), _jsxs("div", { className: "bg-gray-100 p-4 rounded-md", children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Usage Example" }), _jsx("pre", { className: "bg-gray-800 text-white p-4 rounded-md overflow-x-auto", children: `import { PlayingCard, createCard, CardSuit, CardValue } from '../components/cards';

// Create a card
const aceOfHearts = createCard(CardSuit.Hearts, CardValue.Ace);

// Render the card
<PlayingCard card={aceOfHearts} size="md" />` })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "CardGroup Component" }), _jsx("p", { className: "mb-4", children: "The CardGroup component displays multiple cards together, with options for overlapping or spacing." }), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Overlapping Cards (Default)" }), _jsx(CardGroup, { cards: cardGroup, title: "Court Cards", description: "A collection of court cards from different suits." })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Non-overlapping Cards" }), _jsx(CardGroup, { cards: cardGroup, overlap: false, size: "sm" })] }), _jsxs("div", { className: "bg-gray-100 p-4 rounded-md", children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Usage Example" }), _jsx("pre", { className: "bg-gray-800 text-white p-4 rounded-md overflow-x-auto", children: `import { CardGroup } from '../components/cards';

// Render a group of cards
<CardGroup 
  cards={cardArray} 
  title="Card Group Title" 
  description="Description of the card group."
  overlap={true}
  size="md"
/>` })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "CardDetails Component" }), _jsx("p", { className: "mb-4", children: "The CardDetails component displays detailed information about a card, including its meaning and keywords." }), _jsx("div", { className: "mb-6", children: _jsx(CardDetails, { card: jackOfClubs, meaning: "The Jack of Clubs represents a creative and ambitious young person. It symbolizes new ideas, innovation, and the pursuit of knowledge.", keywords: ['Creative', 'Ambitious', 'Innovative', 'Youthful', 'Intellectual'] }) }), _jsxs("div", { className: "bg-gray-100 p-4 rounded-md", children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Usage Example" }), _jsx("pre", { className: "bg-gray-800 text-white p-4 rounded-md overflow-x-auto", children: `import { CardDetails } from '../components/cards';

// Render card details
<CardDetails 
  card={card}
  title="Custom Title" // Optional
  description="Custom description" // Optional
  meaning="Card meaning" // Optional
  keywords={['Keyword1', 'Keyword2']} // Optional
  showCard={true} // Optional
  cardSize="md" // Optional
/>` })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Birth Cards and Year Card" }), _jsx("p", { className: "mb-4", children: "Example of calculating and displaying birth cards and year cards based on birthdate and age." }), _jsxs("div", { className: "mb-6 flex flex-col md:flex-row gap-6", children: [_jsxs("div", { className: "flex-grow", children: [_jsx("label", { className: "block mb-2 font-medium", children: "Birthdate" }), _jsx("input", { type: "date", value: birthdate, onChange: (e) => setBirthdate(e.target.value), className: "border rounded-md px-3 py-2 w-full" })] }), _jsxs("div", { className: "flex-grow", children: [_jsx("label", { className: "block mb-2 font-medium", children: "Age" }), _jsx("input", { type: "number", value: age, onChange: (e) => setAge(parseInt(e.target.value) || 0), min: 0, max: 120, className: "border rounded-md px-3 py-2 w-full" })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Birth Cards" }), _jsx(CardGroup, { cards: birthCards, title: "Birth Cards", description: "Cards calculated based on the birthdate." })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Year Card" }), _jsx(CardDetails, { card: yearCard, title: `Year Card (Age ${age})`, description: `Card calculated based on the birthdate and age ${age}.`, meaning: "This card represents the energies and themes present during this year of your life." })] })] })] }));
};
export default CardDemo;

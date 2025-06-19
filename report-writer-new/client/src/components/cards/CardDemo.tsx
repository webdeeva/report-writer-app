import React, { useState } from 'react';
import {
  PlayingCard,
  CardGroup,
  CardDetails,
  createCard,
  calculateBirthCards,
  calculateYearCard
} from './index';
import { CardSuit, CardValue } from '../../utils/cardUtils';

/**
 * CardDemo component for demonstrating the card visualization components
 * 
 * This component shows examples of the different card components
 * and how they can be used in the application.
 */
const CardDemo: React.FC = () => {
  // Sample cards for demonstration
  const aceOfHearts = createCard(CardSuit.Hearts, CardValue.Ace);
  const kingOfSpades = createCard(CardSuit.Spades, CardValue.King);
  const queenOfDiamonds = createCard(CardSuit.Diamonds, CardValue.Queen);
  const jackOfClubs = createCard(CardSuit.Clubs, CardValue.Jack);
  
  // Sample birth date for demonstration
  const [birthdate, setBirthdate] = useState<string>('1990-01-01');
  const [age, setAge] = useState<number>(33);
  
  // Calculate birth cards and year card based on birthdate and age
  const birthCards = calculateBirthCards(birthdate);
  const yearCard = calculateYearCard(birthdate, age);
  
  // Sample card group
  const cardGroup = [aceOfHearts, kingOfSpades, queenOfDiamonds, jackOfClubs];
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Card Visualization Components</h1>
      
      {/* PlayingCard examples */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">PlayingCard Component</h2>
        <p className="mb-4">The PlayingCard component displays a single playing card with different sizes.</p>
        
        <div className="flex flex-wrap gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Small</h3>
            <PlayingCard card={aceOfHearts} size="sm" />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Medium (Default)</h3>
            <PlayingCard card={kingOfSpades} size="md" />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Large</h3>
            <PlayingCard card={queenOfDiamonds} size="lg" />
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-2">Usage Example</h3>
          <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
            {`import { PlayingCard, createCard, CardSuit, CardValue } from '../components/cards';

// Create a card
const aceOfHearts = createCard(CardSuit.Hearts, CardValue.Ace);

// Render the card
<PlayingCard card={aceOfHearts} size="md" />`}
          </pre>
        </div>
      </section>
      
      {/* CardGroup examples */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">CardGroup Component</h2>
        <p className="mb-4">The CardGroup component displays multiple cards together, with options for overlapping or spacing.</p>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Overlapping Cards (Default)</h3>
          <CardGroup 
            cards={cardGroup} 
            title="Court Cards" 
            description="A collection of court cards from different suits."
          />
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Non-overlapping Cards</h3>
          <CardGroup 
            cards={cardGroup} 
            overlap={false}
            size="sm"
          />
        </div>
        
        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-2">Usage Example</h3>
          <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
            {`import { CardGroup } from '../components/cards';

// Render a group of cards
<CardGroup 
  cards={cardArray} 
  title="Card Group Title" 
  description="Description of the card group."
  overlap={true}
  size="md"
/>`}
          </pre>
        </div>
      </section>
      
      {/* CardDetails examples */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">CardDetails Component</h2>
        <p className="mb-4">The CardDetails component displays detailed information about a card, including its meaning and keywords.</p>
        
        <div className="mb-6">
          <CardDetails 
            card={jackOfClubs}
            meaning="The Jack of Clubs represents a creative and ambitious young person. It symbolizes new ideas, innovation, and the pursuit of knowledge."
            keywords={['Creative', 'Ambitious', 'Innovative', 'Youthful', 'Intellectual']}
          />
        </div>
        
        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-2">Usage Example</h3>
          <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
            {`import { CardDetails } from '../components/cards';

// Render card details
<CardDetails 
  card={card}
  title="Custom Title" // Optional
  description="Custom description" // Optional
  meaning="Card meaning" // Optional
  keywords={['Keyword1', 'Keyword2']} // Optional
  showCard={true} // Optional
  cardSize="md" // Optional
/>`}
          </pre>
        </div>
      </section>
      
      {/* Birth Cards and Year Card examples */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Birth Cards and Year Card</h2>
        <p className="mb-4">Example of calculating and displaying birth cards and year cards based on birthdate and age.</p>
        
        <div className="mb-6 flex flex-col md:flex-row gap-6">
          <div className="flex-grow">
            <label className="block mb-2 font-medium">Birthdate</label>
            <input 
              type="date" 
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>
          
          <div className="flex-grow">
            <label className="block mb-2 font-medium">Age</label>
            <input 
              type="number" 
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value) || 0)}
              min={0}
              max={120}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Birth Cards</h3>
          <CardGroup 
            cards={birthCards} 
            title="Birth Cards" 
            description="Cards calculated based on the birthdate."
          />
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Year Card</h3>
          <CardDetails 
            card={yearCard}
            title={`Year Card (Age ${age})`}
            description={`Card calculated based on the birthdate and age ${age}.`}
            meaning="This card represents the energies and themes present during this year of your life."
          />
        </div>
      </section>
    </div>
  );
};

export default CardDemo;

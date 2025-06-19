# Card Visualization Components

This directory contains components for visualizing playing cards in the Report Writer application. These components are used to display birth cards, year cards, and other card-related information in reports.

## Components

### PlayingCard

A component for displaying a single playing card.

```tsx
import { PlayingCard, createCard, CardSuit, CardValue } from '../components/cards';

// Create a card
const aceOfHearts = createCard(CardSuit.Hearts, CardValue.Ace);

// Render the card
<PlayingCard 
  card={aceOfHearts} 
  size="md" // 'sm', 'md', or 'lg'
  className="custom-class" // optional
/>
```

### CardGroup

A component for displaying multiple cards together, with options for overlapping or spacing.

```tsx
import { CardGroup } from '../components/cards';

// Render a group of cards
<CardGroup 
  cards={cardArray} 
  title="Card Group Title" // optional
  description="Description of the card group." // optional
  overlap={true} // optional, default: true
  size="md" // optional, 'sm', 'md', or 'lg'
  className="custom-class" // optional
/>
```

### CardDetails

A component for displaying detailed information about a card, including its meaning and keywords.

```tsx
import { CardDetails } from '../components/cards';

// Render card details
<CardDetails 
  card={card}
  title="Custom Title" // optional
  description="Custom description" // optional
  meaning="Card meaning" // optional
  keywords={['Keyword1', 'Keyword2']} // optional
  showCard={true} // optional
  cardSize="md" // optional
  className="custom-class" // optional
/>
```

## Utilities

The card components use utilities from `cardUtils.ts` for creating and manipulating cards:

### Card Types

```tsx
// Card suit enum
enum CardSuit {
  Hearts = 'hearts',
  Diamonds = 'diamonds',
  Clubs = 'clubs',
  Spades = 'spades'
}

// Card value enum
enum CardValue {
  Ace = 'A',
  Two = '2',
  Three = '3',
  // ...
  King = 'K'
}

// Card interface
interface Card {
  suit: CardSuit;
  value: CardValue;
  symbol: string;
  name: string;
  numericValue: number;
}
```

### Card Functions

```tsx
// Create a card
const card = createCard(CardSuit.Hearts, CardValue.Ace);

// Get all cards in a standard deck
const allCards = getAllCards();

// Calculate birth cards based on birthdate
const birthCards = calculateBirthCards('1990-01-01');

// Calculate year card based on birthdate and age
const yearCard = calculateYearCard('1990-01-01', 33);

// Format card for display
const formattedCard = formatCard(card); // "A♥"

// Get card color based on suit
const cardColor = getCardColor(CardSuit.Hearts); // "text-red-600"

// Get card description
const description = getCardDescription(card);
```

## Demo

A demo component is available to showcase the card visualization components:

```tsx
import { CardDemo } from '../components/cards';

// Render the demo
<CardDemo />
```

The demo includes examples of all card components and utilities, with interactive elements for testing birth cards and year cards based on birthdate and age.

## Styling

The card components use Tailwind CSS for styling, with responsive design for different screen sizes. The components are designed to be visually consistent with the rest of the application.

## Integration with Reports

The card components are designed to be used in the report generation process. They can be integrated with the report forms and previews to display card-related information.

For example, in a yearly report:

```tsx
import { CardGroup, CardDetails, calculateBirthCards, calculateYearCard } from '../components/cards';

// In a component
const birthCards = calculateBirthCards(person.birthdate);
const yearCard = calculateYearCard(person.birthdate, age);

// Render birth cards
<CardGroup 
  cards={birthCards} 
  title="Birth Cards" 
  description="These cards represent your core personality and life path."
/>

// Render year card
<CardDetails 
  card={yearCard}
  title={`Year Card (Age ${age})`}
  description="This card represents the energies and themes present during this year of your life."
  meaning="Detailed meaning of the year card..."
  keywords={['Keyword1', 'Keyword2']}
/>

import React from 'react';
import { Card } from '../../utils/cardUtils';
import PlayingCard from './PlayingCard';

interface CardGroupProps {
  cards: Card[];
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  overlap?: boolean;
}

/**
 * CardGroup component for displaying a group of playing cards
 * 
 * @param cards - Array of Card objects to display
 * @param title - Optional title for the card group
 * @param description - Optional description for the card group
 * @param size - Size of the cards (sm, md, lg)
 * @param className - Additional CSS classes
 * @param overlap - Whether cards should overlap each other
 */
const CardGroup: React.FC<CardGroupProps> = ({
  cards,
  title,
  description,
  size = 'md',
  className = '',
  overlap = true
}) => {
  // Calculate overlap margin based on card size
  const overlapMargin = {
    sm: '-ml-10',
    md: '-ml-16',
    lg: '-ml-20'
  };
  
  // Calculate container width based on card size and number of cards
  const getContainerWidth = () => {
    const baseWidth = {
      sm: 64, // 16rem
      md: 96, // 24rem
      lg: 128 // 32rem
    };
    
    if (!overlap) {
      return 'w-full';
    }
    
    // If overlapping, calculate width based on first card + partial width for each additional card
    const firstCardWidth = baseWidth[size];
    const additionalCardWidth = {
      sm: 24, // 6rem
      md: 32, // 8rem
      lg: 48 // 12rem
    };
    
    const totalWidth = firstCardWidth + (cards.length - 1) * additionalCardWidth[size];
    return `w-${totalWidth}`;
  };
  
  return (
    <div className={`card-group ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
      )}
      
      <div className={`flex flex-wrap ${overlap ? 'justify-start' : 'justify-center gap-4'}`}>
        {cards.map((card, index) => (
          <div 
            key={`${card.suit}-${card.value}-${index}`}
            className={`${index > 0 && overlap ? overlapMargin[size] : ''} transition-transform hover:transform hover:-translate-y-2`}
          >
            <PlayingCard card={card} size={size} />
          </div>
        ))}
      </div>
      
      {description && (
        <p className="mt-4 text-gray-700">{description}</p>
      )}
    </div>
  );
};

export default CardGroup;

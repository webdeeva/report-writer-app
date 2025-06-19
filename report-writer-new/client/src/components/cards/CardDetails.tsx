import React from 'react';
import { Card, getCardDescription } from '../../utils/cardUtils';
import PlayingCard from './PlayingCard';

interface CardDetailsProps {
  card: Card;
  title?: string;
  description?: string;
  meaning?: string;
  keywords?: string[];
  className?: string;
  showCard?: boolean;
  cardSize?: 'sm' | 'md' | 'lg';
}

/**
 * CardDetails component for displaying detailed information about a card
 * 
 * @param card - Card object to display details for
 * @param title - Optional custom title (defaults to card name)
 * @param description - Optional custom description
 * @param meaning - Optional card meaning
 * @param keywords - Optional keywords associated with the card
 * @param className - Additional CSS classes
 * @param showCard - Whether to show the card visualization
 * @param cardSize - Size of the card visualization
 */
const CardDetails: React.FC<CardDetailsProps> = ({
  card,
  title,
  description,
  meaning,
  keywords = [],
  className = '',
  showCard = true,
  cardSize = 'md'
}) => {
  // Get default description if not provided
  const cardDescription = description || getCardDescription(card);
  
  // Use card name as title if not provided
  const cardTitle = title || card.name;
  
  return (
    <div className={`card-details ${className}`}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Card visualization */}
        {showCard && (
          <div className="flex-shrink-0">
            <PlayingCard card={card} size={cardSize} />
          </div>
        )}
        
        {/* Card information */}
        <div className="flex-grow">
          <h3 className="text-xl font-semibold mb-2">{cardTitle}</h3>
          
          <div className="mb-4">
            <p className="text-gray-700">{cardDescription}</p>
          </div>
          
          {meaning && (
            <div className="mb-4">
              <h4 className="text-lg font-medium mb-1">Meaning</h4>
              <p className="text-gray-700 italic">{meaning}</p>
            </div>
          )}
          
          {keywords.length > 0 && (
            <div>
              <h4 className="text-lg font-medium mb-1">Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDetails;

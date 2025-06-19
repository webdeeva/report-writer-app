import React from 'react';
import { Card, CardSuit } from '../../utils/cardUtils';

interface PlayingCardProps {
  card: Card;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * PlayingCard component for displaying a playing card
 * 
 * @param card - Card object to display
 * @param size - Size of the card (sm, md, lg)
 * @param className - Additional CSS classes
 */
const PlayingCard: React.FC<PlayingCardProps> = ({ 
  card, 
  size = 'md', 
  className = '' 
}) => {
  // Determine card color based on suit
  const isRed = card.suit === CardSuit.Hearts || card.suit === CardSuit.Diamonds;
  const textColor = isRed ? 'text-red-600' : 'text-black';
  
  // Determine card size
  const sizeClasses = {
    sm: 'w-16 h-24 text-xs',
    md: 'w-24 h-36 text-base',
    lg: 'w-32 h-48 text-lg'
  };
  
  // Determine corner text size
  const cornerTextSize = {
    sm: 'text-xs',
    md: 'text-base',
    lg: 'text-xl'
  };
  
  // Determine center symbol size
  const centerSymbolSize = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl'
  };
  
  return (
    <div 
      className={`
        relative bg-white rounded-lg shadow-md border-2 
        ${isRed ? 'border-red-500' : 'border-gray-800'} 
        ${sizeClasses[size]} 
        ${textColor} 
        ${className}
      `}
      aria-label={card.name}
    >
      {/* Top left corner */}
      <div className={`absolute top-1 left-1 ${cornerTextSize[size]}`}>
        <div className="font-bold">{card.value}</div>
        <div>{card.symbol}</div>
      </div>
      
      {/* Center symbol */}
      <div className={`
        absolute inset-0 flex items-center justify-center 
        ${centerSymbolSize[size]} font-serif
      `}>
        {card.symbol}
      </div>
      
      {/* Bottom right corner (inverted) */}
      <div className={`
        absolute bottom-1 right-1 ${cornerTextSize[size]} 
        transform rotate-180
      `}>
        <div className="font-bold">{card.value}</div>
        <div>{card.symbol}</div>
      </div>
    </div>
  );
};

export default PlayingCard;

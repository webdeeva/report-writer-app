import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CardSuit } from '../../utils/cardUtils';
/**
 * PlayingCard component for displaying a playing card
 *
 * @param card - Card object to display
 * @param size - Size of the card (sm, md, lg)
 * @param className - Additional CSS classes
 */
const PlayingCard = ({ card, size = 'md', className = '' }) => {
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
    return (_jsxs("div", { className: `
        relative bg-white rounded-lg shadow-md border-2 
        ${isRed ? 'border-red-500' : 'border-gray-800'} 
        ${sizeClasses[size]} 
        ${textColor} 
        ${className}
      `, "aria-label": card.name, children: [_jsxs("div", { className: `absolute top-1 left-1 ${cornerTextSize[size]}`, children: [_jsx("div", { className: "font-bold", children: card.value }), _jsx("div", { children: card.symbol })] }), _jsx("div", { className: `
        absolute inset-0 flex items-center justify-center 
        ${centerSymbolSize[size]} font-serif
      `, children: card.symbol }), _jsxs("div", { className: `
        absolute bottom-1 right-1 ${cornerTextSize[size]} 
        transform rotate-180
      `, children: [_jsx("div", { className: "font-bold", children: card.value }), _jsx("div", { children: card.symbol })] })] }));
};
export default PlayingCard;

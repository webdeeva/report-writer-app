import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PlayingCard from './PlayingCard';
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
const CardGroup = ({ cards, title, description, size = 'md', className = '', overlap = true }) => {
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
    return (_jsxs("div", { className: `card-group ${className}`, children: [title && (_jsx("h3", { className: "text-lg font-semibold mb-2", children: title })), _jsx("div", { className: `flex flex-wrap ${overlap ? 'justify-start' : 'justify-center gap-4'}`, children: cards.map((card, index) => (_jsx("div", { className: `${index > 0 && overlap ? overlapMargin[size] : ''} transition-transform hover:transform hover:-translate-y-2`, children: _jsx(PlayingCard, { card: card, size: size }) }, `${card.suit}-${card.value}-${index}`))) }), description && (_jsx("p", { className: "mt-4 text-gray-700", children: description }))] }));
};
export default CardGroup;

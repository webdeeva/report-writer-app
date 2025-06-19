import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getCardDescription } from '../../utils/cardUtils';
import PlayingCard from './PlayingCard';
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
const CardDetails = ({ card, title, description, meaning, keywords = [], className = '', showCard = true, cardSize = 'md' }) => {
    // Get default description if not provided
    const cardDescription = description || getCardDescription(card);
    // Use card name as title if not provided
    const cardTitle = title || card.name;
    return (_jsx("div", { className: `card-details ${className}`, children: _jsxs("div", { className: "flex flex-col md:flex-row gap-6", children: [showCard && (_jsx("div", { className: "flex-shrink-0", children: _jsx(PlayingCard, { card: card, size: cardSize }) })), _jsxs("div", { className: "flex-grow", children: [_jsx("h3", { className: "text-xl font-semibold mb-2", children: cardTitle }), _jsx("div", { className: "mb-4", children: _jsx("p", { className: "text-gray-700", children: cardDescription }) }), meaning && (_jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "text-lg font-medium mb-1", children: "Meaning" }), _jsx("p", { className: "text-gray-700 italic", children: meaning })] })), keywords.length > 0 && (_jsxs("div", { children: [_jsx("h4", { className: "text-lg font-medium mb-1", children: "Keywords" }), _jsx("div", { className: "flex flex-wrap gap-2", children: keywords.map((keyword, index) => (_jsx("span", { className: "px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full", children: keyword }, index))) })] }))] })] }) }));
};
export default CardDetails;

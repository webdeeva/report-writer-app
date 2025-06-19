import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePeople } from '@/hooks/usePeople';
import { calculateAge, toDisplayDateString } from '@/utils/dateUtils';
const PeoplePage = () => {
    const { people, loading, error, deletePerson, fetchPeople } = usePeople();
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const handleDelete = async (id) => {
        if (await deletePerson(id)) {
            setDeleteConfirmId(null);
        }
    };
    // Function to get the display date
    const getDisplayDate = (person) => {
        // If the person has an originalDateFormat, use that
        if (person.originalDateFormat) {
            return person.originalDateFormat;
        }
        // Otherwise, convert the ISO date to a display date
        return toDisplayDateString(person.birthdate);
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h2", { className: "text-2xl font-bold", children: "People" }), _jsx(Link, { to: "/dashboard/people/new", className: "btn btn-primary", children: "Add Person" })] }), loading ? (_jsx("div", { className: "flex justify-center py-8", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" }) })) : error ? (_jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative", role: "alert", children: [_jsx("strong", { className: "font-bold", children: "Error: " }), _jsx("span", { className: "block sm:inline", children: error })] })) : (_jsxs("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: [_jsxs("div", { className: "p-4 border-b border-gray-200 bg-gray-50", children: [_jsx("h3", { className: "text-lg font-medium", children: "Your People" }), _jsx("p", { className: "text-sm text-secondary", children: "Manage the people you want to generate reports for." })] }), people.length === 0 ? (_jsxs("div", { className: "p-6", children: [_jsx("p", { className: "text-center text-secondary py-8", children: "You haven't added any people yet." }), _jsx("div", { className: "flex justify-center", children: _jsx(Link, { to: "/dashboard/people/new", className: "btn btn-outline", children: "Add Your First Person" }) })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Name" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Birth Date" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Age" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: people.map((person) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm font-medium text-gray-900", children: person.name }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-500", children: getDisplayDate(person) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-500", children: calculateAge(person.birthdate) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(Link, { to: `/dashboard/reports/yearly/${person.id}`, className: "text-primary hover:text-primary-dark", children: "Yearly Report" }), _jsx(Link, { to: `/dashboard/reports/life/${person.id}`, className: "text-primary hover:text-primary-dark", children: "Life Report" }), _jsx(Link, { to: `/dashboard/people/${person.id}/edit`, className: "text-indigo-600 hover:text-indigo-900", children: "Edit" }), deleteConfirmId === person.id ? (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: () => handleDelete(person.id), className: "text-red-600 hover:text-red-900", children: "Confirm" }), _jsx("button", { onClick: () => setDeleteConfirmId(null), className: "text-gray-500 hover:text-gray-700", children: "Cancel" })] })) : (_jsx("button", { onClick: () => setDeleteConfirmId(person.id), className: "text-red-600 hover:text-red-900", children: "Delete" }))] }) })] }, person.id))) })] }) }))] }))] }));
};
export default PeoplePage;

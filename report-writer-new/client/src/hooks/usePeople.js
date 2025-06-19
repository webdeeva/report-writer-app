import { useState, useEffect } from 'react';
import { useAuthStore } from '../context/authStore';
/**
 * Convert MM/DD/YYYY to YYYY-MM-DD format using direct string manipulation
 * @param dateStr Date string in MM/DD/YYYY format
 * @returns Date string in YYYY-MM-DD format
 */
const formatDateForStorage = (dateStr) => {
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
    }
    // Convert MM/DD/YYYY to YYYY-MM-DD
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
        const [month, day, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    // If it's an ISO string with time, extract just the date part
    if (dateStr.includes('T')) {
        return dateStr.split('T')[0];
    }
    return dateStr;
};
/**
 * Custom hook for fetching and managing people data
 *
 * This hook provides access to the user's list of people, with loading and error states.
 * It automatically fetches the data when the component mounts and provides functions
 * for adding, updating, and deleting people.
 */
export const usePeople = () => {
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuthStore();
    // Fetch people from the API
    const fetchPeople = async () => {
        if (!token)
            return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/people`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching people: ${response.statusText}`);
            }
            const data = await response.json();
            setPeople(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            console.error('Error fetching people:', err);
        }
        finally {
            setLoading(false);
        }
    };
    // Add a new person
    const addPerson = async (personData) => {
        if (!token)
            return null;
        try {
            console.log('Sending to server:', personData);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/people`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(personData)
            });
            if (!response.ok) {
                throw new Error(`Error adding person: ${response.statusText}`);
            }
            const newPerson = await response.json();
            console.log('Received from server:', newPerson);
            setPeople(prev => [...prev, newPerson]);
            return newPerson;
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            console.error('Error adding person:', err);
            return null;
        }
    };
    // Update an existing person
    const updatePerson = async (id, personData) => {
        if (!token)
            return false;
        try {
            console.log('Updating person with data:', personData);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/people/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(personData)
            });
            if (!response.ok) {
                throw new Error(`Error updating person: ${response.statusText}`);
            }
            const updatedPerson = await response.json();
            console.log('Received updated person from server:', updatedPerson);
            setPeople(prev => prev.map(p => p.id === id ? updatedPerson : p));
            return true;
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            console.error('Error updating person:', err);
            return false;
        }
    };
    // Delete a person
    const deletePerson = async (id) => {
        if (!token)
            return false;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/people/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error deleting person: ${response.statusText}`);
            }
            setPeople(prev => prev.filter(p => p.id !== id));
            return true;
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            console.error('Error deleting person:', err);
            return false;
        }
    };
    // Fetch people when the component mounts or token changes
    useEffect(() => {
        if (token) {
            fetchPeople();
        }
        else {
            setPeople([]);
            setLoading(false);
        }
    }, [token]);
    return {
        people,
        loading,
        error,
        fetchPeople,
        addPerson,
        updatePerson,
        deletePerson
    };
};

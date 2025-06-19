import axios from 'axios';
// In production, use relative URLs (empty string)
// In development, use the configured URL or localhost
const API_URL = import.meta.env.VITE_API_URL !== undefined 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.DEV ? 'http://localhost:8080' : '');
/**
 * Login user with username and password
 * @param username User's username
 * @param password User's password
 * @returns User data with authentication token
 */
export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, {
            username,
            password,
        });
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message;
            throw new Error(message);
        }
        throw error;
    }
};
/**
 * Get user profile
 * @returns User profile data
 */
export const getUserProfile = async () => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found');
        }
        const response = await axios.get(`${API_URL}/api/auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message;
            throw new Error(message);
        }
        throw error;
    }
};
/**
 * Create axios instance with authentication token
 * @returns Axios instance with auth header
 */
export const createAuthenticatedAxios = () => {
    const token = localStorage.getItem('authToken');
    return axios.create({
        baseURL: API_URL,
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
        },
    });
};

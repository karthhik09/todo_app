import axios from 'axios';

// Base URL for the Spring Boot backend
const API_BASE_URL = 'https://todo-backend-1fzd.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth API
export const authAPI = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    register: async (name, email, password) => {
        const response = await api.post('/auth/register', { name, email, password });
        return response.data;
    },

    updateUser: async (userId, name, email, password) => {
        const response = await api.put(`/users/${userId}`, { name, email, password });
        return response.data;
    },
};

// Tasks API
export const tasksAPI = {
    getTasks: async (userId) => {
        const response = await api.get(`/tasks?userId=${userId}`);
        return response.data;
    },

    addTask: async (title, status = false, userId) => {
        const response = await api.post(`/tasks?userId=${userId}`, { title, status });
        return response.data;
    },

    toggleTask: async (taskId) => {
        const response = await api.put(`/tasks/${taskId}/toggle`);
        return response.data;
    },

    deleteTask: async (taskId) => {
        const response = await api.delete(`/tasks/${taskId}`);
        return response.data;
    },

    updateTask: async (taskId, title) => {
        const response = await api.put(`/tasks/${taskId}`, { title });
        return response.data;
    },
};

export default api;

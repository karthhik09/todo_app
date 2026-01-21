/**
 * API Service
 * Handles all HTTP requests to the Spring Boot backend
 */

import axios from 'axios';

//Configuration
const API_BASE_URL = 'https://todo-backend-1fzd.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

//Authentication API
export const authAPI = {
    // User login
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    // User registration
    register: async (name, email, password) => {
        const response = await api.post('/auth/register', { name, email, password });
        return response.data;
    },

    // Update user profile
    updateUser: async (userId, name, email, password) => {
        const response = await api.put(`/users/${userId}`, { name, email, password });
        return response.data;
    },
};

//Tasks API
export const tasksAPI = {
    // Get all tasks for a user
    getTasks: async (userId) => {
        const response = await api.get(`/tasks?userId=${userId}`);
        return response.data;
    },

    // Create a new task
    addTask: async (title, status = false, userId, dueDateTime = null) => {
        const taskData = { title, status };

        if (dueDateTime) {
            taskData.dueDateTime = dueDateTime;
        }

        const response = await api.post(`/tasks?userId=${userId}`, taskData);
        return response.data;
    },

    // Toggle task completion status
    toggleTask: async (taskId) => {
        const response = await api.put(`/tasks/${taskId}/toggle`);
        return response.data;
    },

    // Delete a task
    deleteTask: async (taskId) => {
        const response = await api.delete(`/tasks/${taskId}`);
        return response.data;
    },

    // Update task title
    updateTask: async (taskId, title) => {
        const response = await api.put(`/tasks/${taskId}`, { title });
        return response.data;
    },
};

export default api;

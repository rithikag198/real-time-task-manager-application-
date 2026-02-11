import axios from 'axios';
import { User, Task, AuthResponse, TasksResponse } from '../types';

// Create axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Add token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  register: async (userData: { username: string; email: string; password: string }): Promise<AuthResponse> => {
    const response = await API.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await API.get('/auth/me');
    return response.data;
  },
};

// Task APIs
export const taskAPI = {
  getTasks: async (params?: { search?: string; status?: string }): Promise<TasksResponse> => {
    const response = await API.get('/tasks', { params });
    return response.data;
  },

  createTask: async (taskData: { title: string; description?: string }): Promise<{ message: string; task: Task }> => {
    const response = await API.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id: string, taskData: { title?: string; description?: string; status?: string }): Promise<{ message: string; task: Task }> => {
    const response = await API.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id: string): Promise<{ message: string; taskId: string }> => {
    const response = await API.delete(`/tasks/${id}`);
    return response.data;
  },

  toggleTaskStatus: async (id: string): Promise<{ message: string; task: Task }> => {
    const response = await API.patch(`/tasks/${id}/toggle`);
    return response.data;
  },
};

export default API;

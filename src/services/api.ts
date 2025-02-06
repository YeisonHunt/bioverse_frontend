import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return user;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      return null;
    }
  },
};

export const questionnaireService = {
  getAll: async () => {
    const response = await api.get('/questionnaires');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/questionnaires/${id}`);
    return response.data;
  },

  getQuestions: async (id: number) => {
    const response = await api.get(`/questionnaires/${id}/questions`);
    return response.data;
  },

  submitResponses: async (questionnaireId: number, responses: any) => {
    const response = await api.post(`/questionnaires/${questionnaireId}/responses`, {
      responses,
    });
    return response.data;
  },

  getUserResponses: async (questionnaireId: number) => {
    const response = await api.get(`/questionnaires/${questionnaireId}/user-responses`);
    return response.data;
  },
};

export const adminService = {
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getUserResponses: async (userId: number) => {
    const response = await api.get(`/admin/users/${userId}/responses`);
    return response.data;
  },
};
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('auth_token', data.token);
    return data.user;
  },

  register: async (name: string, email: string, password: string, role: string) => {
    const { data } = await api.post('/auth/register', { name, email, password, role });
    localStorage.setItem('auth_token', data.token);
    return data.user;
  },

  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('auth_token');
  },

  getCurrentUser: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  }
};

export const gencoding = {
  generate: async (prompt: string, context?: string) => {
    const { data } = await api.post('/gencoding/generate', { prompt, context });
    return data;
  },
  
  saveInteraction: async (prompt: string, result: string, code?: string) => {
    const { data } = await api.post('/hub/interactions', {
      prompt,
      result,
      code,
      timestamp: Date.now(),
    });
    return data;
  },
};

export const files = {
  create: async (path: string, content: string) => {
    const { data } = await api.post('/files', { path, content });
    return data;
  },

  update: async (path: string, content: string) => {
    const { data } = await api.put(`/files/${encodeURIComponent(path)}`, { content });
    return data;
  },

  delete: async (path: string) => {
    await api.delete(`/files/${encodeURIComponent(path)}`);
  },

  rename: async (oldPath: string, newPath: string) => {
    const { data } = await api.post('/files/rename', { oldPath, newPath });
    return data;
  },

  getTree: async () => {
    const { data } = await api.get('/files/tree');
    return data;
  }
};

export const collaboration = {
  invite: async (email: string, fileId: string) => {
    const { data } = await api.post('/collaboration/invite', { email, fileId });
    return data;
  },

  getUsers: async (fileId: string) => {
    const { data } = await api.get(`/collaboration/${fileId}/users`);
    return data;
  },

  shareLink: async (fileId: string) => {
    const { data } = await api.post(`/collaboration/${fileId}/share`);
    return data;
  }
};

export default api;

export { api }
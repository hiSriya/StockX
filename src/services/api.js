
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service methods
export const apiService = {
  // POST /api/run - Upload CSV files and run optimization
  runOptimization: async (inventoryFile, storesFile) => {
    const formData = new FormData();
    formData.append('inventory', inventoryFile);
    formData.append('stores', storesFile);
    
    const response = await api.post('/api/run', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // GET /api/inventory - Fetch all inventory items
  getInventory: async () => {
    const response = await api.get('/api/inventory');
    return response.data;
  },

  // GET /api/transfers - Fetch all transfer suggestions
  getTransfers: async () => {
    const response = await api.get('/api/transfers');
    return response.data;
  },
};

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    throw error;
  }
);

export default apiService;

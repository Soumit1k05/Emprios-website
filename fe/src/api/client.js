// Using mock data for frontend-only testing
// When backend is ready, replace with actual API calls
import { mockBundleAPI, mockAuthAPI } from './mockData';

const API_BASE_URL = 'http://localhost:5000/api';
const USE_MOCK_DATA = false; // Live mode active


// Get token from localStorage
const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem('empiros_user'));
    return user?.token || null;
  } catch {
    return null;
  }
};

const headers = {
  'Content-Type': 'application/json'
};

const getAuthHeaders = () => ({
  ...headers,
  'Authorization': `Bearer ${getToken()}`
});

// Bundle APIs
export const bundleAPI = USE_MOCK_DATA ? mockBundleAPI : {
  getAllBundles: async () => {
    const response = await fetch(`${API_BASE_URL}/bundles`, { headers });
    if (!response.ok) throw new Error('Failed to fetch bundles');
    return response.json();
  },

  getBundleById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/bundles/${id}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch bundle');
    return response.json();
  },

  initiatePurchase: async (bundleId) => {
    const response = await fetch(`${API_BASE_URL}/bundles/purchase/initiate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ bundleId })
    });
    if (!response.ok) throw new Error('Failed to initiate purchase');
    return response.json();
  },

  handlePaymentSuccess: async (purchaseId, paymentId) => {
    const response = await fetch(`${API_BASE_URL}/bundles/purchase/success`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ purchaseId, paymentId })
    });
    if (!response.ok) throw new Error('Failed to process payment');
    return response.json();
  },

  getUserPurchasedBundles: async () => {
    const response = await fetch(`${API_BASE_URL}/bundles/user/purchases`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch purchased bundles');
    return response.json();
  },

  getBundleItems: async (bundleId) => {
    const response = await fetch(`${API_BASE_URL}/bundles/${bundleId}/items`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch bundle items');
    return response.json();
  },
  
  getDownloadLink: async (bundleId) => {
    const response = await fetch(`${API_BASE_URL}/bundles/${bundleId}/download`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch download link');
    return response.json();
  }
};

// Auth APIs
export const authAPI = USE_MOCK_DATA ? mockAuthAPI : {
  register: async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, email, password })
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  }
};

export default { bundleAPI, authAPI };

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response error logging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.error || error.message,
      url: error.config?.url,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// ==================== AUTH ENDPOINTS ====================
export const authAPI = {
  signup: (data) => apiClient.post('/auth/signup', data),
  login: (data) => apiClient.post('/auth/login', data),
  getCurrentUser: () => apiClient.get('/auth/me'),
};

// ==================== JOBS ENDPOINTS ====================
export const jobsAPI = {
  getAllJobs: (params) => apiClient.get('/jobs', { params }),
  getJobById: (id) => apiClient.get(`/jobs/${id}`),
  createJob: (data) => apiClient.post('/jobs', data),
  updateJob: (id, data) => apiClient.put(`/jobs/${id}`, data),
  deleteJob: (id) => apiClient.delete(`/jobs/${id}`),
  applyForJob: (id, data) => apiClient.post(`/jobs/${id}/apply`, data),
  withdrawApplication: (jobId) => apiClient.post('/jobs/withdraw', { jobId }),
  getUserJobs: () => apiClient.get('/jobs/user/posted'),
  saveJob: (jobId) => apiClient.post('/jobs/save', { jobId }),
  unsaveJob: (jobId) => apiClient.post('/jobs/unsave', { jobId }),
  getSavedJobs: () => apiClient.get('/jobs/user/saved'),
  getUserApplications: () => apiClient.get('/jobs/user/applications'),
  updateApplicationStatus: (jobId, userId, status) =>
    apiClient.put('/jobs/application/status', { jobId, userId, status }),
  addJobReview: (jobId, data) => apiClient.post(`/jobs/${jobId}/review`, data),
  getJobReviews: (jobId) => apiClient.get(`/jobs/${jobId}/reviews`),
};

// ==================== USERS ENDPOINTS ====================
export const usersAPI = {
  getUserProfile: () => apiClient.get('/users/profile'),
  updateUserProfile: (data) => apiClient.put('/users/profile', data),
  getUserById: (id) => apiClient.get(`/users/${id}`),
  deleteAccount: () => apiClient.delete('/users/account'),
  getAllUsers: (params) => apiClient.get('/users/admin/users', { params }),
  getAllJobs: (params) => apiClient.get('/users/admin/jobs', { params }),
  getAllApplications: (params) => apiClient.get('/users/admin/applications', { params }),
  getAdminStats: () => apiClient.get('/users/admin/stats'),
  deleteUser: (userId) => apiClient.post('/users/admin/delete-user', { userId }),
  deleteJob: (jobId) => apiClient.post('/users/admin/delete-job', { jobId }),
};

// ==================== COMPANIES ENDPOINTS ====================
export const companiesAPI = {
  getAllCompanies: (params) => apiClient.get('/companies', { params }),
  getCompanyById: (id) => apiClient.get(`/companies/${id}`),
  createCompany: (data) => apiClient.post('/companies', data),
  updateCompany: (id, data) => apiClient.put(`/companies/${id}`, data),
  deleteCompany: (id) => apiClient.delete(`/companies/${id}`),
  addCompanyReview: (companyId, data) => apiClient.post(`/companies/${companyId}/review`, data),
};

// ==================== HEALTH CHECK ====================
export const healthCheck = () => apiClient.get('/health');

export const api = apiClient;
export default apiClient;

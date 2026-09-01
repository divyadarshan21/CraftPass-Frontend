export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  appName: import.meta.env.VITE_APP_NAME || 'CraftPass',
  appVersion: '1.0.0',
  environment: import.meta.env.VITE_ENV || 'development',
}

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
    updateProfile: '/api/auth/profile',
    changePassword: '/api/auth/change-password',
  },
  products: {
    list: '/api/products/my',
    create: '/api/products',
    get: (id) => `/api/products/${id}`,
    update: (id) => `/api/products/${id}`,
    delete: (id) => `/api/products/${id}`,
    submit: (id) => `/api/products/${id}/submit`,
  },
  evidence: {
    upload: (productId) => `/api/products/${productId}/evidence/upload`,
    list: (productId) => `/api/products/${productId}/evidence`,
    delete: (id) => `/api/evidence/${id}`,
    update: (id) => `/api/evidence/${id}`,
  },
  verifier: {
    pending: '/api/verifier/products/pending',
    get: (id) => `/api/verifier/products/${id}`,
    approve: (id) => `/api/verifier/products/${id}/approve`,
    reject: (id) => `/api/verifier/products/${id}/reject`,
    correction: (id) => `/api/verifier/products/${id}/correction`,
  },
  passport: {
    get: (slug) => `/api/passport/${slug}`,
  },
}
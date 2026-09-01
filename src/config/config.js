export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  appName: import.meta.env.VITE_APP_NAME || 'CraftPass',
  appVersion: '1.0.0',
  environment: import.meta.env.VITE_ENV || 'development',
}

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    updateProfile: '/auth/profile',
    changePassword: '/auth/change-password',
  },
  products: {
    list: '/products',
    create: '/products',
    get: (id) => `/products/${id}`,
    update: (id) => `/products/${id}`,
    delete: (id) => `/products/${id}`,
    search: '/products/search',
    status: (id) => `/products/${id}/status`,
  },
  evidence: {
    upload: '/evidence/upload',
    list: (productId) => `/evidence/${productId || ''}`,
    get: (id) => `/evidence/${id}`,
    delete: (id) => `/evidence/${id}`,
    update: (id) => `/evidence/${id}`,
  },
  verification: {
    queue: '/verification/queue',
    review: (id) => `/verification/review/${id}`,
    decide: (id) => `/verification/decide/${id}`,
    history: '/verification/history',
    stats: '/verification/stats',
  },
  passport: {
    get: (slug) => `/passport/${slug}`,
    share: (slug) => `/passport/${slug}/share`,
  },
  artisan: {
    profile: '/artisan/profile',
    dashboard: '/artisan/dashboard',
    submissions: '/artisan/submissions',
  },
  buyer: {
    search: '/buyer/search',
    products: '/buyer/products',
  },
}

export const STATUS_COLORS = {
  verified: '#2D8A4E',
  pending: '#D4A02B',
  rejected: '#C62828',
  draft: '#8A8277',
  review: '#1565C0',
}

export const STATUS_LABELS = {
  verified: 'Verified',
  pending: 'Pending',
  rejected: 'Rejected',
  draft: 'Draft',
  review: 'In Review',
}

export const USER_ROLES = {
  ARTISAN: 'artisan',
  VERIFIER: 'verifier',
  BUYER: 'buyer',
}

export const USER_ROLE_LABELS = {
  artisan: 'Artisan',
  verifier: 'Verifier',
  buyer: 'Buyer',
}

export const EVIDENCE_TYPES = {
  IMAGE: 'image',
  DOCUMENT: 'document',
  VIDEO: 'video',
  AUDIO: 'audio',
}

export const VERIFICATION_DECISIONS = {
  APPROVE: 'approve',
  REJECT: 'reject',
  REQUEST_CHANGES: 'request_changes',
}

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
}

export const FILE_UPLOAD = {
  MAX_SIZE: 20 * 1024 * 1024, // 20MB
  ACCEPTED_TYPES: {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    video: ['video/mp4', 'video/webm', 'video/ogg'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
}

export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  ARTISAN: {
    DASHBOARD: '/artisan/dashboard',
    PRODUCTS: '/artisan/products',
    NEW_PRODUCT: '/artisan/products/new',
    PRODUCT_DETAILS: '/artisan/products/:id',
    EDIT_PRODUCT: '/artisan/products/:id/edit',
    EVIDENCE: '/artisan/evidence',
    SUBMISSIONS: '/artisan/submissions',
    PROFILE: '/artisan/profile',
  },
  VERIFIER: {
    DASHBOARD: '/verifier/dashboard',
    QUEUE: '/verifier/queue',
    REVIEW: '/verifier/submissions/:id',
    HISTORY: '/verifier/history',
  },
  BUYER: {
    HOME: '/',
    SEARCH: '/search',
    PASSPORT: '/passport/:slug',
  },
}
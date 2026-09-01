export const ROLES = {
  ARTISAN: 'artisan',
  VERIFIER: 'verifier',
  BUYER: 'buyer',
};

export const PRODUCT_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  NEEDS_REVISION: 'needs_revision',
};

export const EVIDENCE_TYPES = {
  PHOTO: 'photo',
  VIDEO: 'video',
  DOCUMENT: 'document',
  CERTIFICATE: 'certificate',
};

export const CATEGORIES = [
  'Textiles',
  'Pottery',
  'Woodwork',
  'Metalwork',
  'Jewelry',
  'Painting',
  'Sculpture',
  'Other',
];

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  ARTISAN_DASHBOARD: '/artisan/dashboard',
  ARTISAN_PRODUCTS: '/artisan/products',
  ARTISAN_ADD_PRODUCT: '/artisan/products/new',
  ARTISAN_EVIDENCE: '/artisan/evidence',
  ARTISAN_SUBMISSIONS: '/artisan/submissions',
  VERIFIER_DASHBOARD: '/verifier/dashboard',
  VERIFIER_QUEUE: '/verifier/queue',
  VERIFIER_HISTORY: '/verifier/history',
  HOME: '/',
  SEARCH: '/search',
  PASSPORT: '/passport/:slug',
};
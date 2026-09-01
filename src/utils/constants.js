// ============================================
// PRODUCT STATUS - Updated for Backend
// ============================================
export const PRODUCT_STATUS = {
  DRAFT: 'DRAFT',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
  CORRECTION_REQUIRED: 'CORRECTION_REQUIRED',
}

export const PRODUCT_STATUS_LABELS = {
  [PRODUCT_STATUS.DRAFT]: 'Draft',
  [PRODUCT_STATUS.PENDING_VERIFICATION]: 'Pending Verification',
  [PRODUCT_STATUS.VERIFIED]: 'Verified',
  [PRODUCT_STATUS.REJECTED]: 'Rejected',
  [PRODUCT_STATUS.CORRECTION_REQUIRED]: 'Correction Required',
}

export const PRODUCT_STATUS_COLORS = {
  [PRODUCT_STATUS.DRAFT]: '#8A8277',
  [PRODUCT_STATUS.PENDING_VERIFICATION]: '#D4A02B',
  [PRODUCT_STATUS.VERIFIED]: '#2D8A4E',
  [PRODUCT_STATUS.REJECTED]: '#C62828',
  [PRODUCT_STATUS.CORRECTION_REQUIRED]: '#E65100',
}

export const PRODUCT_STATUS_ICONS = {
  [PRODUCT_STATUS.DRAFT]: '📄',
  [PRODUCT_STATUS.PENDING_VERIFICATION]: '⏳',
  [PRODUCT_STATUS.VERIFIED]: '✅',
  [PRODUCT_STATUS.REJECTED]: '❌',
  [PRODUCT_STATUS.CORRECTION_REQUIRED]: '✏️',
}

// ============================================
// EVIDENCE TYPES - Updated for Backend
// ============================================
export const EVIDENCE_TYPES = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  DOCUMENT: 'DOCUMENT',
  CERTIFICATE: 'CERTIFICATE',
}

export const EVIDENCE_TYPE_LABELS = {
  [EVIDENCE_TYPES.IMAGE]: 'Image',
  [EVIDENCE_TYPES.VIDEO]: 'Video',
  [EVIDENCE_TYPES.DOCUMENT]: 'Document',
  [EVIDENCE_TYPES.CERTIFICATE]: 'Certificate',
}

// ============================================
// ROLES - Updated for Backend
// ============================================
export const ROLES = {
  ARTISAN: 'ARTISAN',
  VERIFIER: 'VERIFIER',
  BUYER: 'BUYER',
}
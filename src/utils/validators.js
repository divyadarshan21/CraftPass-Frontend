/**
 * Validators Utility
 * Helper functions for form validation
 */

import { REGEX, VALIDATION } from './constants'

// ============================================
// BASIC VALIDATORS
// ============================================

/**
 * Check if value is required (not empty)
 * @param {*} value - Value to check
 * @returns {boolean} True if valid
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'object') return Object.keys(value).length > 0
  return true
}

/**
 * Check if value meets minimum length
 * @param {string} value - Value to check
 * @param {number} min - Minimum length
 * @returns {boolean} True if valid
 */
export const isMinLength = (value, min = VALIDATION.PASSWORD_MIN_LENGTH) => {
  if (!value) return false
  return String(value).length >= min
}

/**
 * Check if value meets maximum length
 * @param {string} value - Value to check
 * @param {number} max - Maximum length
 * @returns {boolean} True if valid
 */
export const isMaxLength = (value, max = VALIDATION.PASSWORD_MAX_LENGTH) => {
  if (!value) return true
  return String(value).length <= max
}

/**
 * Check if value is a valid email
 * @param {string} value - Value to check
 * @returns {boolean} True if valid
 */
export const isEmail = (value) => {
  if (!value) return false
  return REGEX.EMAIL.test(value)
}

/**
 * Check if value is a valid URL
 * @param {string} value - Value to check
 * @returns {boolean} True if valid
 */
export const isUrl = (value) => {
  if (!value) return true // Optional field
  return REGEX.URL.test(value)
}

/**
 * Check if value is a valid phone number
 * @param {string} value - Value to check
 * @returns {boolean} True if valid
 */
export const isPhone = (value) => {
  if (!value) return true // Optional field
  return REGEX.PHONE.test(value)
}

/**
 * Check if value is a valid name
 * @param {string} value - Value to check
 * @returns {boolean} True if valid
 */
export const isName = (value) => {
  if (!value) return false
  return REGEX.NAME.test(value)
}

/**
 * Check if value is alphanumeric
 * @param {string} value - Value to check
 * @returns {boolean} True if valid
 */
export const isAlphanumeric = (value) => {
  if (!value) return true // Optional field
  return REGEX.ALPHANUMERIC.test(value)
}

/**
 * Check if value is a valid password
 * @param {string} value - Value to check
 * @returns {boolean} True if valid
 */
export const isPassword = (value) => {
  if (!value) return false
  return REGEX.PASSWORD.test(value)
}

/**
 * Check if two values match (e.g., password confirmation)
 * @param {string} value - First value
 * @param {string} confirmValue - Second value
 * @returns {boolean} True if match
 */
export const isMatch = (value, confirmValue) => {
  return value === confirmValue
}

// ============================================
// NUMBER VALIDATORS
// ============================================

/**
 * Check if value is a number
 * @param {*} value - Value to check
 * @returns {boolean} True if valid
 */
export const isNumber = (value) => {
  if (value === null || value === undefined) return false
  return !isNaN(Number(value))
}

/**
 * Check if value is a positive number
 * @param {*} value - Value to check
 * @returns {boolean} True if valid
 */
export const isPositiveNumber = (value) => {
  if (!isNumber(value)) return false
  return Number(value) > 0
}

/**
 * Check if value is a non-negative number
 * @param {*} value - Value to check
 * @returns {boolean} True if valid
 */
export const isNonNegativeNumber = (value) => {
  if (!isNumber(value)) return false
  return Number(value) >= 0
}

/**
 * Check if value is an integer
 * @param {*} value - Value to check
 * @returns {boolean} True if valid
 */
export const isInteger = (value) => {
  if (!isNumber(value)) return false
  return Number.isInteger(Number(value))
}

/**
 * Check if value is within range
 * @param {*} value - Value to check
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} True if valid
 */
export const isInRange = (value, min, max) => {
  if (!isNumber(value)) return false
  const num = Number(value)
  return num >= min && num <= max
}

// ============================================
// FILE VALIDATORS
// ============================================

/**
 * Check if file size is within limit
 * @param {File} file - File to check
 * @param {number} maxSize - Maximum size in bytes
 * @returns {boolean} True if valid
 */
export const isFileSizeValid = (file, maxSize = FILE_UPLOAD.MAX_SIZE) => {
  if (!file) return false
  return file.size <= maxSize
}

/**
 * Check if file type is accepted
 * @param {File} file - File to check
 * @param {Array} acceptedTypes - Array of accepted MIME types
 * @returns {boolean} True if valid
 */
export const isFileTypeValid = (file, acceptedTypes = FILE_UPLOAD.ACCEPTED_IMAGE_TYPES) => {
  if (!file) return false
  return acceptedTypes.includes(file.type)
}

/**
 * Check if file is an image
 * @param {File} file - File to check
 * @returns {boolean} True if image
 */
export const isImageFile = (file) => {
  if (!file) return false
  return file.type.startsWith('image/')
}

/**
 * Check if file is a video
 * @param {File} file - File to check
 * @returns {boolean} True if video
 */
export const isVideoFile = (file) => {
  if (!file) return false
  return file.type.startsWith('video/')
}

/**
 * Check if file is a document
 * @param {File} file - File to check
 * @returns {boolean} True if document
 */
export const isDocumentFile = (file) => {
  if (!file) return false
  return FILE_UPLOAD.ACCEPTED_DOCUMENT_TYPES.includes(file.type)
}

// ============================================
// ARRAY VALIDATORS
// ============================================

/**
 * Check if array is not empty
 * @param {Array} arr - Array to check
 * @returns {boolean} True if valid
 */
export const isArrayRequired = (arr) => {
  return Array.isArray(arr) && arr.length > 0
}

/**
 * Check if array meets minimum length
 * @param {Array} arr - Array to check
 * @param {number} min - Minimum length
 * @returns {boolean} True if valid
 */
export const isArrayMinLength = (arr, min = 1) => {
  return Array.isArray(arr) && arr.length >= min
}

/**
 * Check if array meets maximum length
 * @param {Array} arr - Array to check
 * @param {number} max - Maximum length
 * @returns {boolean} True if valid
 */
export const isArrayMaxLength = (arr, max = VALIDATION.MAX_TAGS) => {
  return Array.isArray(arr) && arr.length <= max
}

// ============================================
// DATE VALIDATORS
// ============================================

/**
 * Check if value is a valid date
 * @param {string|Date} value - Value to check
 * @returns {boolean} True if valid
 */
export const isDate = (value) => {
  if (!value) return false
  const date = new Date(value)
  return !isNaN(date.getTime())
}

/**
 * Check if date is in the past
 * @param {string|Date} value - Value to check
 * @returns {boolean} True if past
 */
export const isPastDate = (value) => {
  if (!isDate(value)) return false
  const date = new Date(value)
  const now = new Date()
  return date < now
}

/**
 * Check if date is in the future
 * @param {string|Date} value - Value to check
 * @returns {boolean} True if future
 */
export const isFutureDate = (value) => {
  if (!isDate(value)) return false
  const date = new Date(value)
  const now = new Date()
  return date > now
}

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Create a validation rule object
 * @param {Function} validator - Validation function
 * @param {string} message - Error message
 * @returns {Object} Validation rule
 */
export const createRule = (validator, message) => {
  return { validator, message }
}

/**
 * Validate a value against multiple rules
 * @param {*} value - Value to validate
 * @param {Array} rules - Array of validation rules
 * @returns {Object} Validation result
 */
export const validate = (value, rules) => {
  for (const rule of rules) {
    const isValid = rule.validator(value)
    if (!isValid) {
      return {
        valid: false,
        message: rule.message,
        rule: rule,
      }
    }
  }
  return { valid: true, message: null }
}

/**
 * Validate a form object
 * @param {Object} data - Form data
 * @param {Object} schema - Validation schema
 * @returns {Object} Validation errors
 */
export const validateForm = (data, schema) => {
  const errors = {}
  
  Object.keys(schema).forEach((field) => {
    const value = data[field]
    const rules = schema[field]
    
    // Handle custom validator function
    if (typeof rules === 'function') {
      const result = rules(value, data)
      if (result !== true) {
        errors[field] = result
      }
      return
    }
    
    // Handle array of rules
    if (Array.isArray(rules)) {
      const result = validate(value, rules)
      if (!result.valid) {
        errors[field] = result.message
      }
      return
    }
    
    // Handle single rule
    if (rules && typeof rules === 'object' && rules.validator) {
      const result = validate(value, [rules])
      if (!result.valid) {
        errors[field] = result.message
      }
    }
  })
  
  return errors
}

// ============================================
// COMMON VALIDATION SCHEMAS
// ============================================

/**
 * Common validation rules for email field
 * @param {boolean} required - Whether field is required
 * @returns {Array} Validation rules
 */
export const emailRules = (required = true) => {
  const rules = []
  if (required) {
    rules.push(createRule(isRequired, 'Email is required'))
  }
  rules.push(createRule(isEmail, 'Please enter a valid email address'))
  return rules
}

/**
 * Common validation rules for password field
 * @param {boolean} required - Whether field is required
 * @returns {Array} Validation rules
 */
export const passwordRules = (required = true) => {
  const rules = []
  if (required) {
    rules.push(createRule(isRequired, 'Password is required'))
  }
  rules.push(createRule(
    (value) => isMinLength(value, VALIDATION.PASSWORD_MIN_LENGTH),
    `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`
  ))
  rules.push(createRule(isPassword, 'Password must contain at least one letter and one number'))
  return rules
}

/**
 * Common validation rules for name field
 * @param {boolean} required - Whether field is required
 * @returns {Array} Validation rules
 */
export const nameRules = (required = true) => {
  const rules = []
  if (required) {
    rules.push(createRule(isRequired, 'Name is required'))
  }
  rules.push(createRule(
    (value) => isMinLength(value, VALIDATION.NAME_MIN_LENGTH),
    `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`
  ))
  rules.push(createRule(isName, 'Please enter a valid name'))
  return rules
}

/**
 * Common validation rules for phone field
 * @param {boolean} required - Whether field is required
 * @returns {Array} Validation rules
 */
export const phoneRules = (required = false) => {
  const rules = []
  if (required) {
    rules.push(createRule(isRequired, 'Phone number is required'))
  }
  rules.push(createRule(isPhone, 'Please enter a valid phone number'))
  return rules
}

/**
 * Common validation rules for URL field
 * @param {boolean} required - Whether field is required
 * @returns {Array} Validation rules
 */
export const urlRules = (required = false) => {
  const rules = []
  if (required) {
    rules.push(createRule(isRequired, 'URL is required'))
  }
  rules.push(createRule(isUrl, 'Please enter a valid URL'))
  return rules
}

// Export all validators
export default {
  // Basic
  isRequired,
  isMinLength,
  isMaxLength,
  isEmail,
  isUrl,
  isPhone,
  isName,
  isAlphanumeric,
  isPassword,
  isMatch,
  // Number
  isNumber,
  isPositiveNumber,
  isNonNegativeNumber,
  isInteger,
  isInRange,
  // File
  isFileSizeValid,
  isFileTypeValid,
  isImageFile,
  isVideoFile,
  isDocumentFile,
  // Array
  isArrayRequired,
  isArrayMinLength,
  isArrayMaxLength,
  // Date
  isDate,
  isPastDate,
  isFutureDate,
  // Helpers
  createRule,
  validate,
  validateForm,
  // Common schemas
  emailRules,
  passwordRules,
  nameRules,
  phoneRules,
  urlRules,
}
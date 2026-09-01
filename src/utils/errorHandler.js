/**
 * Error Handler Utility
 * Centralized error handling for the application
 */

import toast from 'react-hot-toast'
import { ERROR_MESSAGES } from './constants'

/**
 * Handle API errors
 * @param {Error} error - The error object
 * @param {Object} options - Additional options
 * @param {boolean} options.showToast - Whether to show a toast notification
 * @param {Function} options.onUnauthorized - Callback for unauthorized errors
 * @param {Function} options.onForbidden - Callback for forbidden errors
 * @param {Function} options.onNotFound - Callback for not found errors
 * @param {Function} options.onServerError - Callback for server errors
 * @param {Function} options.onNetworkError - Callback for network errors
 * @returns {Object} Formatted error object
 */
export const handleApiError = (error, options = {}) => {
  const {
    showToast = true,
    onUnauthorized = () => {
      // Redirect to login or clear session
      localStorage.removeItem('craftpass_token')
      window.location.href = '/login'
    },
    onForbidden = null,
    onNotFound = null,
    onServerError = null,
    onNetworkError = null,
  } = options

  // Default error response
  const errorResponse = {
    message: ERROR_MESSAGES.SERVER_ERROR,
    status: 500,
    data: null,
    originalError: error,
  }

  if (!error) {
    return errorResponse
  }

  // Handle different error types
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response
    const message = data?.message || data?.error || error.message || ERROR_MESSAGES.SERVER_ERROR

    errorResponse.status = status
    errorResponse.message = message
    errorResponse.data = data

    switch (status) {
      case 400:
        // Bad Request - Validation errors
        errorResponse.message = data?.message || ERROR_MESSAGES.VALIDATION
        break
      case 401:
        // Unauthorized
        errorResponse.message = data?.message || ERROR_MESSAGES.UNAUTHORIZED
        if (onUnauthorized) onUnauthorized()
        break
      case 403:
        // Forbidden
        errorResponse.message = data?.message || ERROR_MESSAGES.FORBIDDEN
        if (onForbidden) onForbidden()
        break
      case 404:
        // Not Found
        errorResponse.message = data?.message || ERROR_MESSAGES.NOT_FOUND
        if (onNotFound) onNotFound()
        break
      case 422:
        // Validation Error
        errorResponse.message = data?.message || ERROR_MESSAGES.VALIDATION
        errorResponse.errors = data?.errors || null
        break
      case 500:
      case 502:
      case 503:
        // Server Error
        errorResponse.message = data?.message || ERROR_MESSAGES.SERVER_ERROR
        if (onServerError) onServerError()
        break
      default:
        break
    }
  } else if (error.request) {
    // Request made but no response received
    errorResponse.message = ERROR_MESSAGES.NETWORK
    errorResponse.status = 0
    if (onNetworkError) onNetworkError()
  } else {
    // Something else happened
    errorResponse.message = error.message || ERROR_MESSAGES.SERVER_ERROR
  }

  // Show toast notification if enabled
  if (showToast) {
    toast.error(errorResponse.message)
  }

  return errorResponse
}

/**
 * Handle form validation errors
 * @param {Object} errors - Validation errors object
 * @param {Object} options - Additional options
 * @param {boolean} options.showToast - Whether to show a toast notification
 * @returns {Object} Formatted validation errors
 */
export const handleValidationErrors = (errors, options = {}) => {
  const { showToast = true } = options

  const formattedErrors = {}

  if (errors) {
    Object.keys(errors).forEach((key) => {
      const value = errors[key]
      if (Array.isArray(value)) {
        formattedErrors[key] = value[0] || ERROR_MESSAGES.REQUIRED
      } else if (typeof value === 'string') {
        formattedErrors[key] = value
      } else {
        formattedErrors[key] = ERROR_MESSAGES.REQUIRED
      }
    })
  }

  if (showToast && Object.keys(formattedErrors).length > 0) {
    const firstError = Object.values(formattedErrors)[0]
    toast.error(firstError)
  }

  return formattedErrors
}

/**
 * Format error for display
 * @param {Error|Object|string} error - The error to format
 * @returns {string} Formatted error message
 */
export const formatErrorMessage = (error) => {
  if (!error) return ERROR_MESSAGES.SERVER_ERROR

  if (typeof error === 'string') {
    return error
  }

  if (error.message) {
    return error.message
  }

  if (error.response?.data?.message) {
    return error.response.data.message
  }

  if (error.response?.data?.error) {
    return error.response.data.error
  }

  return ERROR_MESSAGES.SERVER_ERROR
}

/**
 * Check if error is a network error
 * @param {Error} error - The error to check
 * @returns {boolean} True if network error
 */
export const isNetworkError = (error) => {
  return !error.response && !error.request && !error.message
}

/**
 * Check if error is a validation error
 * @param {Error} error - The error to check
 * @returns {boolean} True if validation error
 */
export const isValidationError = (error) => {
  return error.response?.status === 422
}

/**
 * Check if error is an authentication error
 * @param {Error} error - The error to check
 * @returns {boolean} True if authentication error
 */
export const isAuthError = (error) => {
  return error.response?.status === 401
}

/**
 * Check if error is a forbidden error
 * @param {Error} error - The error to check
 * @returns {boolean} True if forbidden error
 */
export const isForbiddenError = (error) => {
  return error.response?.status === 403
}

/**
 * Check if error is a not found error
 * @param {Error} error - The error to check
 * @returns {boolean} True if not found error
 */
export const isNotFoundError = (error) => {
  return error.response?.status === 404
}

/**
 * Check if error is a server error
 * @param {Error} error - The error to check
 * @returns {boolean} True if server error
 */
export const isServerError = (error) => {
  const status = error.response?.status
  return status >= 500 && status < 600
}

/**
 * Get error status code
 * @param {Error} error - The error object
 * @returns {number} Status code
 */
export const getErrorStatus = (error) => {
  return error.response?.status || error.status || 0
}

/**
 * Get error data
 * @param {Error} error - The error object
 * @returns {Object} Error data
 */
export const getErrorData = (error) => {
  return error.response?.data || error.data || null
}

/**
 * Create a custom error
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @param {Object} data - Additional error data
 * @returns {Error} Custom error
 */
export const createError = (message, status = 500, data = null) => {
  const error = new Error(message)
  error.status = status
  error.data = data
  return error
}

// Export all handlers
export default {
  handleApiError,
  handleValidationErrors,
  formatErrorMessage,
  isNetworkError,
  isValidationError,
  isAuthError,
  isForbiddenError,
  isNotFoundError,
  isServerError,
  getErrorStatus,
  getErrorData,
  createError,
}
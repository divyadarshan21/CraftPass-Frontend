/**
 * Formatters Utility
 * Helper functions for formatting data
 */

import { DATE_FORMATS, DEFAULTS } from './constants'

// ============================================
// DATE FORMATTERS
// ============================================

/**
 * Format date to display format
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = DATE_FORMATS.DISPLAY) => {
  if (!date) return 'N/A'

  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Invalid Date'

  const options = {
    [DATE_FORMATS.DISPLAY]: { month: 'short', day: 'numeric', year: 'numeric' },
    [DATE_FORMATS.DISPLAY_WITH_TIME]: { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' },
    [DATE_FORMATS.TIME]: { hour: '2-digit', minute: '2-digit' },
    [DATE_FORMATS.SHORT_DATE]: { month: '2-digit', day: '2-digit', year: 'numeric' },
  }

  const formatOptions = options[format] || options[DATE_FORMATS.DISPLAY]
  return d.toLocaleDateString('en-US', formatOptions)
}

/**
 * Format date with time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date with time
 */
export const formatDateTime = (date) => {
  return formatDate(date, DATE_FORMATS.DISPLAY_WITH_TIME)
}

/**
 * Format time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted time
 */
export const formatTime = (date) => {
  return formatDate(date, DATE_FORMATS.TIME)
}

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A'

  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Invalid Date'

  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) {
    return 'Just now'
  } else if (minutes < 60) {
    return `${minutes}m ago`
  } else if (hours < 24) {
    return `${hours}h ago`
  } else if (days < 7) {
    return `${days}d ago`
  } else if (days < 30) {
    return `${Math.floor(days / 7)}w ago`
  } else if (months < 12) {
    return `${months}mo ago`
  } else {
    return `${years}y ago`
  }
}

// ============================================
// NUMBER FORMATTERS
// ============================================

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @param {string} locale - Locale (default: en-US)
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, currency = DEFAULTS.CURRENCY, locale = DEFAULTS.LOCALE) => {
  if (amount === null || amount === undefined) return 'N/A'

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

/**
 * Format number with commas
 * @param {number} number - Number to format
 * @param {number} decimals - Number of decimal places
 * @param {string} locale - Locale (default: en-US)
 * @returns {string} Formatted number
 */
export const formatNumber = (number, decimals = 0, locale = DEFAULTS.LOCALE) => {
  if (number === null || number === undefined) return 'N/A'

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number)
}

/**
 * Format percentage
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimal places
 * @param {string} locale - Locale (default: en-US)
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 1, locale = DEFAULTS.LOCALE) => {
  if (value === null || value === undefined) return 'N/A'

  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100)
}

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  if (bytes === null || bytes === undefined) return 'N/A'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const size = bytes / Math.pow(k, i)

  return `${parseFloat(size.toFixed(dm))} ${sizes[i]}`
}

// ============================================
// STRING FORMATTERS
// ============================================

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Capitalize each word in a string
 * @param {string} str - String to capitalize
 * @returns {string} Title-cased string
 */
export const titleCase = (str) => {
  if (!str) return ''
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to append (default: '...')
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + suffix
}

/**
 * Slugify a string
 * @param {string} str - String to slugify
 * @returns {string} Slugified string
 */
export const slugify = (str) => {
  if (!str) return ''
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Generate a random ID
 * @param {number} length - Length of the ID
 * @returns {string} Random ID
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Get initials from name
 * @param {string} name - Full name
 * @param {number} max - Maximum number of initials
 * @returns {string} Initials
 */
export const getInitials = (name, max = 2) => {
  if (!name) return 'U'
  const parts = name.trim().split(' ')
  if (parts.length === 0) return 'U'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return parts
    .slice(0, max)
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
}

/**
 * Format phone number
 * @param {string} phone - Phone number to format
 * @param {string} format - Format pattern
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone, format = '(xxx) xxx-xxxx') => {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 0) return ''
  
  let result = format
  let digitIndex = 0
  
  for (let i = 0; i < result.length && digitIndex < digits.length; i++) {
    if (result[i] === 'x') {
      result = result.substring(0, i) + digits[digitIndex] + result.substring(i + 1)
      digitIndex++
    }
  }
  
  return result
}

/**
 * Format address
 * @param {Object} address - Address object
 * @param {string} address.street - Street address
 * @param {string} address.city - City
 * @param {string} address.state - State/Province
 * @param {string} address.zip - ZIP/Postal code
 * @param {string} address.country - Country
 * @returns {string} Formatted address
 */
export const formatAddress = (address) => {
  if (!address) return ''
  const parts = []
  if (address.street) parts.push(address.street)
  if (address.city) parts.push(address.city)
  if (address.state) parts.push(address.state)
  if (address.zip) parts.push(address.zip)
  if (address.country) parts.push(address.country)
  return parts.join(', ')
}

// ============================================
// ARRAY FORMATTERS
// ============================================

/**
 * Join array items with a separator
 * @param {Array} arr - Array to join
 * @param {string} separator - Separator (default: ', ')
 * @param {string} lastSeparator - Separator for last item (default: ' and ')
 * @returns {string} Joined string
 */
export const joinItems = (arr, separator = ', ', lastSeparator = ' and ') => {
  if (!arr || arr.length === 0) return ''
  if (arr.length === 1) return arr[0]
  if (arr.length === 2) return arr.join(lastSeparator)
  return arr.slice(0, -1).join(separator) + lastSeparator + arr[arr.length - 1]
}

/**
 * Group array items by key
 * @param {Array} arr - Array to group
 * @param {string|Function} key - Group key or function
 * @returns {Object} Grouped object
 */
export const groupBy = (arr, key) => {
  if (!arr || arr.length === 0) return {}
  return arr.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key]
    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
    return result
  }, {})
}

/**
 * Sort array by key
 * @param {Array} arr - Array to sort
 * @param {string} key - Sort key
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} Sorted array
 */
export const sortBy = (arr, key, direction = 'asc') => {
  if (!arr || arr.length === 0) return []
  const sorted = [...arr]
  sorted.sort((a, b) => {
    const aVal = a[key] || ''
    const bVal = b[key] || ''
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
  return sorted
}

/**
 * Filter array by search term
 * @param {Array} arr - Array to filter
 * @param {string} term - Search term
 * @param {Array} fields - Fields to search in
 * @returns {Array} Filtered array
 */
export const searchInArray = (arr, term, fields) => {
  if (!arr || arr.length === 0 || !term) return arr
  const searchTerm = term.toLowerCase()
  return arr.filter(item => {
    return fields.some(field => {
      const value = item[field]
      if (!value) return false
      return String(value).toLowerCase().includes(searchTerm)
    })
  })
}

// Export all formatters
export default {
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatFileSize,
  capitalize,
  titleCase,
  truncateText,
  slugify,
  generateId,
  getInitials,
  formatPhone,
  formatAddress,
  joinItems,
  groupBy,
  sortBy,
  searchInArray,
}
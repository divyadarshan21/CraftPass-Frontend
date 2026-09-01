/**
 * Storage Utility
 * Helper functions for localStorage and sessionStorage operations
 */

import { STORAGE_KEYS } from './constants'

// ============================================
// LOCAL STORAGE
// ============================================

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Stored value or default
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    if (item === null) return defaultValue
    return JSON.parse(item)
  } catch (error) {
    console.error(`Error getting item from localStorage: ${key}`, error)
    return defaultValue
  }
}

/**
 * Set item in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error setting item in localStorage: ${key}`, error)
    return false
  }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing item from localStorage: ${key}`, error)
    return false
  }
}

/**
 * Clear all localStorage
 * @returns {boolean} Success status
 */
export const clear = () => {
  try {
    localStorage.clear()
    return true
  } catch (error) {
    console.error('Error clearing localStorage', error)
    return false
  }
}

/**
 * Check if item exists in localStorage
 * @param {string} key - Storage key
 * @returns {boolean} True if exists
 */
export const hasItem = (key) => {
  return localStorage.getItem(key) !== null
}

/**
 * Get all keys from localStorage
 * @returns {Array} Array of keys
 */
export const getKeys = () => {
  return Object.keys(localStorage)
}

/**
 * Get all items from localStorage
 * @returns {Object} All items
 */
export const getAll = () => {
  const items = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      items[key] = getItem(key)
    }
  }
  return items
}

// ============================================
// SESSION STORAGE
// ============================================

/**
 * Get item from sessionStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Stored value or default
 */
export const getSessionItem = (key, defaultValue = null) => {
  try {
    const item = sessionStorage.getItem(key)
    if (item === null) return defaultValue
    return JSON.parse(item)
  } catch (error) {
    console.error(`Error getting item from sessionStorage: ${key}`, error)
    return defaultValue
  }
}

/**
 * Set item in sessionStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export const setSessionItem = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error setting item in sessionStorage: ${key}`, error)
    return false
  }
}

/**
 * Remove item from sessionStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const removeSessionItem = (key) => {
  try {
    sessionStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing item from sessionStorage: ${key}`, error)
    return false
  }
}

/**
 * Clear all sessionStorage
 * @returns {boolean} Success status
 */
export const clearSession = () => {
  try {
    sessionStorage.clear()
    return true
  } catch (error) {
    console.error('Error clearing sessionStorage', error)
    return false
  }
}

// ============================================
// SPECIALIZED STORAGE FUNCTIONS
// ============================================

/**
 * Get auth token
 * @returns {string|null} Auth token
 */
export const getToken = () => {
  return getItem(STORAGE_KEYS.TOKEN)
}

/**
 * Set auth token
 * @param {string} token - Auth token
 * @returns {boolean} Success status
 */
export const setToken = (token) => {
  return setItem(STORAGE_KEYS.TOKEN, token)
}

/**
 * Remove auth token
 * @returns {boolean} Success status
 */
export const removeToken = () => {
  return removeItem(STORAGE_KEYS.TOKEN)
}

/**
 * Get user from storage
 * @returns {Object|null} User object
 */
export const getUser = () => {
  return getItem(STORAGE_KEYS.USER)
}

/**
 * Set user in storage
 * @param {Object} user - User object
 * @returns {boolean} Success status
 */
export const setUser = (user) => {
  return setItem(STORAGE_KEYS.USER, user)
}

/**
 * Remove user from storage
 * @returns {boolean} Success status
 */
export const removeUser = () => {
  return removeItem(STORAGE_KEYS.USER)
}

/**
 * Get theme preference
 * @returns {string} Theme ('light' or 'dark')
 */
export const getTheme = () => {
  return getItem(STORAGE_KEYS.THEME, 'light')
}

/**
 * Set theme preference
 * @param {string} theme - Theme ('light' or 'dark')
 * @returns {boolean} Success status
 */
export const setTheme = (theme) => {
  return setItem(STORAGE_KEYS.THEME, theme)
}

/**
 * Get sidebar state
 * @returns {boolean} Sidebar open state
 */
export const getSidebarOpen = () => {
  return getItem(STORAGE_KEYS.SIDEBAR_OPEN, true)
}

/**
 * Set sidebar state
 * @param {boolean} open - Sidebar open state
 * @returns {boolean} Success status
 */
export const setSidebarOpen = (open) => {
  return setItem(STORAGE_KEYS.SIDEBAR_OPEN, open)
}

/**
 * Clear all application data (logout)
 * @returns {boolean} Success status
 */
export const clearAppData = () => {
  try {
    removeToken()
    removeUser()
    // Keep theme and sidebar preference
    return true
  } catch (error) {
    console.error('Error clearing app data', error)
    return false
  }
}

// ============================================
// STORAGE EVENT HANDLING
// ============================================

/**
 * Listen to storage changes
 * @param {Function} callback - Callback function
 * @returns {Function} Cleanup function
 */
export const onStorageChange = (callback) => {
  const handler = (event) => {
    if (event.storageArea === localStorage) {
      callback(event.key, event.newValue, event.oldValue)
    }
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}

// Export all storage functions
export default {
  // Local storage
  getItem,
  setItem,
  removeItem,
  clear,
  hasItem,
  getKeys,
  getAll,
  // Session storage
  getSessionItem,
  setSessionItem,
  removeSessionItem,
  clearSession,
  // Specialized
  getToken,
  setToken,
  removeToken,
  getUser,
  setUser,
  removeUser,
  getTheme,
  setTheme,
  getSidebarOpen,
  setSidebarOpen,
  clearAppData,
  onStorageChange,
}
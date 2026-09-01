import { useAuth as useAuthContext } from '../context/AuthContext'

/**
 * Custom hook for authentication
 * Provides access to auth state and methods with additional computed properties
 * @returns {Object} Auth context value with extended properties
 */
export const useAuth = () => {
  const auth = useAuthContext()
  
  return {
    ...auth,
    // Additional computed properties
    isLoggedIn: auth.isAuthenticated,
    
    /**
     * Check if user has a specific role
     * @param {string} role - Role to check ('artisan', 'verifier', 'buyer')
     * @returns {boolean} True if user has the role
     */
    hasRole: (role) => auth.user?.role === role,
    
    /**
     * Check if user is an artisan
     * @returns {boolean} True if user is an artisan
     */
    isArtisan: auth.isArtisan,
    
    /**
     * Check if user is a verifier
     * @returns {boolean} True if user is a verifier
     */
    isVerifier: auth.isVerifier,
    
    /**
     * Check if user is a buyer
     * @returns {boolean} True if user is a buyer
     */
    isBuyer: auth.isBuyer,
    
    /**
     * Get user's display name
     * @returns {string} User's display name or email
     */
    getDisplayName: () => {
      if (!auth.user) return 'User'
      return auth.user.name || auth.user.email || 'User'
    },
    
    /**
     * Get user's initials for avatar
     * @returns {string} User's initials (max 2 characters)
     */
    getInitials: () => {
      if (!auth.user?.name) return 'U'
      const name = auth.user.name
      const parts = name.split(' ')
      if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase()
      }
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
    },
    
    /**
     * Get user's full name
     * @returns {string} User's full name
     */
    getFullName: () => {
      if (!auth.user) return ''
      return auth.user.name || ''
    },
    
    /**
     * Get user's email
     * @returns {string} User's email
     */
    getEmail: () => {
      if (!auth.user) return ''
      return auth.user.email || ''
    },
    
    /**
     * Get user's role label
     * @returns {string} User's role label
     */
    getRoleLabel: () => {
      if (!auth.user?.role) return 'User'
      const labels = {
        artisan: 'Artisan',
        verifier: 'Verifier',
        buyer: 'Buyer',
      }
      return labels[auth.user.role] || auth.user.role
    },
    
    /**
     * Check if user has profile image
     * @returns {boolean} True if user has profile image
     */
    hasProfileImage: () => {
      return !!auth.user?.profileImage
    },
    
    /**
     * Get user's profile image URL
     * @returns {string|null} Profile image URL or null
     */
    getProfileImage: () => {
      return auth.user?.profileImage || null
    },
  }
}
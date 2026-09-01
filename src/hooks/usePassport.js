import { useState, useCallback } from 'react'
import { passportApi } from '../services/passportApi'
import toast from 'react-hot-toast'

/**
 * Custom hook for passport/verification badge functionality
 * @returns {Object} Passport methods and state
 */
export const usePassport = () => {
  const [passport, setPassport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sharing, setSharing] = useState(false)
  const [downloading, setDownloading] = useState(false)

  /**
   * Get passport by slug
   * @param {string} slug - Passport slug or product ID
   * @returns {Promise<Object>} Passport data
   */
  const getPassport = useCallback(async (slug) => {
    if (!slug) {
      setError('Slug is required')
      return null
    }

    try {
      setLoading(true)
      setError(null)
      const response = await passportApi.get(slug)
      setPassport(response.data)
      return response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch passport'
      setError(message)
      toast.error(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Share passport via native share API or clipboard
   * @param {string} slug - Passport slug
   * @param {Object} options - Share options
   * @param {string} options.title - Share title
   * @param {string} options.text - Share text
   * @returns {Promise<Object>} Share result
   */
  const sharePassport = useCallback(async (slug, options = {}) => {
    if (!slug) {
      toast.error('Invalid passport')
      return { success: false, error: 'Invalid passport' }
    }

    try {
      setSharing(true)
      setError(null)
      
      const url = `${window.location.origin}/passport/${slug}`
      const shareData = {
        title: options.title || 'CraftPass Product',
        text: options.text || 'Check out this verified product on CraftPass!',
        url: url,
      }
      
      // Try native share API first
      if (navigator.share) {
        await navigator.share(shareData)
        toast.success('Shared successfully!')
        return { success: true, method: 'native' }
      }
      
      // Fallback to clipboard
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
      return { success: true, method: 'clipboard' }
    } catch (err) {
      if (err.name !== 'AbortError') {
        const message = 'Failed to share passport'
        setError(message)
        toast.error(message)
        return { success: false, error: message }
      }
      return { success: false, error: 'Share cancelled' }
    } finally {
      setSharing(false)
    }
  }, [])

  /**
   * Download passport as PDF
   * @param {string} slug - Passport slug
   * @param {string} format - Download format (pdf, json)
   * @returns {Promise<Object>} Download result
   */
  const downloadPassport = useCallback(async (slug, format = 'pdf') => {
    if (!slug) {
      toast.error('Invalid passport')
      return { success: false, error: 'Invalid passport' }
    }

    try {
      setDownloading(true)
      setError(null)
      
      // In a real implementation, this would generate a PDF
      // For now, we'll simulate a download
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success(`Passport downloaded successfully as ${format.toUpperCase()}`)
      return { success: true, format }
    } catch (err) {
      const message = 'Failed to download passport'
      setError(message)
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setDownloading(false)
    }
  }, [])

  /**
   * Verify passport authenticity
   * @param {string} slug - Passport slug
   * @param {string} verificationCode - Optional verification code
   * @returns {Promise<Object>} Verification result
   */
  const verifyPassport = useCallback(async (slug, verificationCode = null) => {
    if (!slug) {
      toast.error('Invalid passport')
      return { success: false, error: 'Invalid passport' }
    }

    try {
      setLoading(true)
      setError(null)
      
      // In a real implementation, this would verify the passport
      // For now, we'll simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const isVerified = Math.random() > 0.1 // 90% success rate for demo
      if (isVerified) {
        toast.success('Passport verified successfully!')
        return { success: true, verified: true }
      } else {
        toast.error('Verification failed. Please try again.')
        return { success: false, verified: false, error: 'Verification failed' }
      }
    } catch (err) {
      const message = 'Failed to verify passport'
      setError(message)
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Get verification status of passport
   * @param {Object} passportData - Passport data
   * @returns {Object} Status information
   */
  const getStatusInfo = useCallback((passportData) => {
    const status = passportData?.status || 'draft'
    const statusMap = {
      verified: {
        label: 'Verified',
        color: 'success',
        icon: '✅',
        message: 'This product has been verified as authentic',
      },
      pending: {
        label: 'Pending Verification',
        color: 'warning',
        icon: '⏳',
        message: 'This product is awaiting verification',
      },
      rejected: {
        label: 'Rejected',
        color: 'error',
        icon: '❌',
        message: 'This product did not pass verification',
      },
      draft: {
        label: 'Draft',
        color: 'muted',
        icon: '📄',
        message: 'This product has not been submitted',
      },
    }
    return statusMap[status] || statusMap.draft
  }, [])

  /**
   * Clear passport data
   */
  const clearPassport = useCallback(() => {
    setPassport(null)
    setError(null)
  }, [])

  return {
    passport,
    loading,
    error,
    sharing,
    downloading,
    getPassport,
    sharePassport,
    downloadPassport,
    verifyPassport,
    getStatusInfo,
    clearPassport,
  }
}
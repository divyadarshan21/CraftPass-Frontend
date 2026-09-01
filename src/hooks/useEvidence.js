import { useState, useCallback, useEffect } from 'react'
import { evidenceApi } from '../services/evidenceApi'
import toast from 'react-hot-toast'

/**
 * Custom hook for evidence management
 * @param {Object} options - Configuration options
 * @param {string} options.productId - Optional product ID to filter evidence
 * @param {number} options.initialLimit - Initial items per page
 * @returns {Object} Evidence management methods and state
 */
export const useEvidence = (options = {}) => {
  const {
    productId = null,
    initialLimit = 20,
  } = options

  const [evidence, setEvidence] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState({})
  const [selectedEvidence, setSelectedEvidence] = useState(null)
  const [total, setTotal] = useState(0)
  const [limit] = useState(initialLimit)

  /**
   * Fetch evidence list
   * @param {string} id - Optional product ID to filter by
   * @returns {Promise<Array>} Array of evidence items
   */
  const fetchEvidence = useCallback(async (id = productId) => {
    try {
      setLoading(true)
      setError(null)
      const response = await evidenceApi.list(id)
      const data = response.data || []
      setEvidence(data)
      setTotal(data.length)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch evidence'
      setError(message)
      toast.error(message)
      return []
    } finally {
      setLoading(false)
    }
  }, [productId])

  /**
   * Upload evidence files
   * @param {string} id - Product ID
   * @param {File[]} files - Array of files to upload
   * @returns {Promise<Object>} Upload response
   */
  const uploadEvidence = useCallback(async (id, files) => {
    if (!id) {
      toast.error('Product ID is required')
      return null
    }

    if (!files || files.length === 0) {
      toast.error('No files selected')
      return null
    }

    try {
      setLoading(true)
      setError(null)
      
      // Track upload progress for each file
      const progressTracker = {}
      files.forEach((_, index) => {
        progressTracker[index] = 0
      })
      setUploadProgress(progressTracker)

      const response = await evidenceApi.upload(id, files, (progressEvent, index) => {
        if (index !== undefined) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setUploadProgress(prev => ({
            ...prev,
            [index]: percentCompleted,
          }))
        }
      })

      toast.success(`Successfully uploaded ${files.length} file(s)`)
      await fetchEvidence(id)
      setUploadProgress({})
      return response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Upload failed'
      setError(message)
      toast.error(message)
      setUploadProgress({})
      return null
    } finally {
      setLoading(false)
    }
  }, [fetchEvidence])

  /**
   * Delete evidence by ID
   * @param {string} id - Evidence ID
   * @returns {Promise<boolean>} Success status
   */
  const deleteEvidence = useCallback(async (id) => {
    try {
      setLoading(true)
      setError(null)
      await evidenceApi.delete(id)
      toast.success('Evidence deleted successfully')
      await fetchEvidence()
      if (selectedEvidence?.id === id) {
        setSelectedEvidence(null)
      }
      return true
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete evidence'
      setError(message)
      toast.error(message)
      return false
    } finally {
      setLoading(false)
    }
  }, [fetchEvidence, selectedEvidence])

  /**
   * Get evidence by ID
   * @param {string} id - Evidence ID
   * @returns {Promise<Object>} Evidence data
   */
  const getEvidence = useCallback(async (id) => {
    try {
      setLoading(true)
      setError(null)
      const response = await evidenceApi.get(id)
      setSelectedEvidence(response.data)
      return response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch evidence'
      setError(message)
      toast.error(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Update evidence metadata
   * @param {string} id - Evidence ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>} Updated evidence
   */
  const updateEvidence = useCallback(async (id, data) => {
    try {
      setLoading(true)
      setError(null)
      const response = await evidenceApi.update(id, data)
      toast.success('Evidence updated successfully')
      await fetchEvidence()
      if (selectedEvidence?.id === id) {
        setSelectedEvidence(response.data)
      }
      return response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update evidence'
      setError(message)
      toast.error(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [fetchEvidence, selectedEvidence])

  /**
   * Clear upload progress
   */
  const clearUploadProgress = useCallback(() => {
    setUploadProgress({})
  }, [])

  /**
   * Reset all state
   */
  const resetEvidence = useCallback(() => {
    setEvidence([])
    setSelectedEvidence(null)
    setError(null)
    setTotal(0)
    setUploadProgress({})
  }, [])

  // Auto-fetch on productId change
  useEffect(() => {
    if (productId) {
      fetchEvidence(productId)
    } else {
      setEvidence([])
      setTotal(0)
    }
  }, [fetchEvidence, productId])

  return {
    evidence,
    loading,
    error,
    uploadProgress,
    selectedEvidence,
    total,
    limit,
    fetchEvidence,
    uploadEvidence,
    deleteEvidence,
    getEvidence,
    updateEvidence,
    clearUploadProgress,
    resetEvidence,
    setSelectedEvidence,
  }
}
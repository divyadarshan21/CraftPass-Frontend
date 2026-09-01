import { useState, useCallback, useEffect } from 'react'
import { verificationApi } from '../services/verificationApi'
import toast from 'react-hot-toast'

/**
 * Custom hook for verification management
 * @param {Object} options - Configuration options
 * @param {number} options.initialPage - Initial page number
 * @param {number} options.initialLimit - Items per page
 * @param {boolean} options.autoFetch - Auto-fetch queue on mount
 * @returns {Object} Verification methods and state
 */
export const useVerification = (options = {}) => {
  const {
    initialPage = 1,
    initialLimit = 10,
    autoFetch = true,
  } = options

  const [queue, setQueue] = useState([])
  const [history, setHistory] = useState([])
  const [submission, setSubmission] = useState(null)
  const [stats, setStats] = useState({
    pending: 0,
    inReview: 0,
    verified: 0,
    rejected: 0,
    total: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  /**
   * Fetch verification queue
   * @returns {Promise<Array>} Queue items
   */
  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await verificationApi.getQueue()
      const items = response.data || []
      setQueue(items)
      
      // Update stats
      setStats({
        pending: items.filter(p => p.status === 'pending').length,
        inReview: items.filter(p => p.status === 'review').length,
        verified: items.filter(p => p.status === 'verified').length,
        rejected: items.filter(p => p.status === 'rejected').length,
        total: items.length,
      })
      
      return items
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch queue'
      setError(message)
      toast.error(message)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Fetch verification history
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} History items
   */
  const fetchHistory = useCallback(async (params = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      const queryParams = {
        page,
        limit,
        ...params,
      }
      
      const response = await verificationApi.getHistory(queryParams)
      const data = response.data || []
      setHistory(data)
      setTotal(response.total || 0)
      setTotalPages(Math.ceil((response.total || 0) / limit))
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch history'
      setError(message)
      toast.error(message)
      return []
    } finally {
      setLoading(false)
    }
  }, [page, limit])

  /**
   * Fetch single submission for review
   * @param {string} id - Submission ID
   * @returns {Promise<Object>} Submission data
   */
  const fetchSubmission = useCallback(async (id) => {
    if (!id) {
      setError('Submission ID is required')
      return null
    }

    try {
      setLoading(true)
      setError(null)
      const response = await verificationApi.getReview(id)
      setSubmission(response.data)
      return response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch submission'
      setError(message)
      toast.error(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Make verification decision
   * @param {string} id - Submission ID
   * @param {string} decision - Decision type ('approve', 'reject', 'request_changes')
   * @param {string} feedback - Optional feedback/reason
   * @returns {Promise<Object>} Updated submission
   */
  const makeDecision = useCallback(async (id, decision, feedback = '') => {
    if (!id) {
      toast.error('Submission ID is required')
      return null
    }

    const validDecisions = ['approve', 'reject', 'request_changes']
    if (!validDecisions.includes(decision)) {
      toast.error(`Invalid decision: ${decision}`)
      return null
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await verificationApi.decide(id, decision, feedback)
      
      const decisionLabels = {
        approve: 'Approved',
        reject: 'Rejected',
        request_changes: 'Changes Requested',
      }
      
      toast.success(`Product ${decisionLabels[decision] || 'Updated'} successfully!`)
      
      // Refresh queue and submission
      await fetchQueue()
      if (submission?.id === id) {
        setSubmission(response.data)
      }
      
      return response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to make decision'
      setError(message)
      toast.error(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [fetchQueue, submission])

  /**
   * Approve a submission
   * @param {string} id - Submission ID
   * @returns {Promise<Object>} Updated submission
   */
  const approveSubmission = useCallback(async (id) => {
    return makeDecision(id, 'approve')
  }, [makeDecision])

  /**
   * Reject a submission
   * @param {string} id - Submission ID
   * @param {string} reason - Rejection reason
   * @returns {Promise<Object>} Updated submission
   */
  const rejectSubmission = useCallback(async (id, reason) => {
    return makeDecision(id, 'reject', reason)
  }, [makeDecision])

  /**
   * Request changes for a submission
   * @param {string} id - Submission ID
   * @param {string} feedback - Change request feedback
   * @returns {Promise<Object>} Updated submission
   */
  const requestChanges = useCallback(async (id, feedback) => {
    return makeDecision(id, 'request_changes', feedback)
  }, [makeDecision])

  /**
   * Go to specific page
   * @param {number} newPage - Page number
   */
  const goToPage = useCallback((newPage) => {
    if (newPage < 1 || (totalPages > 0 && newPage > totalPages)) {
      return
    }
    setPage(newPage)
  }, [totalPages])

  /**
   * Clear submission data
   */
  const clearSubmission = useCallback(() => {
    setSubmission(null)
  }, [])

  /**
   * Reset all verification state
   */
  const resetVerification = useCallback(() => {
    setQueue([])
    setHistory([])
    setSubmission(null)
    setStats({
      pending: 0,
      inReview: 0,
      verified: 0,
      rejected: 0,
      total: 0,
    })
    setError(null)
    setPage(1)
    setTotal(0)
    setTotalPages(0)
  }, [])

  // Auto-fetch queue on mount
  useEffect(() => {
    if (autoFetch) {
      fetchQueue()
    }
  }, [fetchQueue, autoFetch])

  // Auto-fetch history on page/limit change
  useEffect(() => {
    if (history.length > 0 || page > 1) {
      fetchHistory()
    }
  }, [fetchHistory, page, limit])

  return {
    queue,
    history,
    submission,
    stats,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    fetchQueue,
    fetchHistory,
    fetchSubmission,
    makeDecision,
    approveSubmission,
    rejectSubmission,
    requestChanges,
    goToPage,
    setLimit,
    clearSubmission,
    resetVerification,
  }
}
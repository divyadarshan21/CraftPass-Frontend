import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader'
import { VerificationQueue } from '../../../components/verification/VerificationQueue/VerificationQueue'
import { Loader } from '../../../components/common/Loader/Loader'
import { Button } from '../../../components/common/Button/Button'
import { verificationApi } from '../../../services/verificationApi'
import toast from 'react-hot-toast'
import './Queue.css'

export const Queue = () => {
  const navigate = useNavigate()
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchQueue()
  }, [])

  const fetchQueue = async () => {
    try {
      setLoading(true)
      const response = await verificationApi.getPending()
      setQueue(response.data || [])
      setError(null)
    } catch (err) {
      console.error('Failed to fetch queue:', err)
      setError('Failed to load verification queue')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchQueue()
    setRefreshing(false)
    toast.success('Queue refreshed')
  }

  const handleSelect = (id) => {
    navigate(`/verifier/submissions/${id}`)
  }

  if (loading) {
    return <Loader fullPage message="Loading queue..." />
  }

  if (error) {
    return (
      <div className="verifier-queue-error">
        <span className="verifier-queue-error-icon">⚠️</span>
        <h3>Failed to Load Queue</h3>
        <p>{error}</p>
        <Button onClick={fetchQueue}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="verifier-queue-page">
      <PageHeader
        title="Verification Queue"
        subtitle={`${queue.length} product${queue.length !== 1 ? 's' : ''} pending review`}
        actions={
          <Button variant="primary" onClick={handleRefresh} loading={refreshing}>
            🔄 Refresh
          </Button>
        }
      />

      <VerificationQueue
        items={queue}
        onSelect={handleSelect}
        onRefresh={handleRefresh}
        loading={loading}
        itemsPerPage={10}
      />
    </div>
  )
}
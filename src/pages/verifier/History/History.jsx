import React, { useState, useEffect } from 'react'
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader'
import { VerificationHistory } from '../../../components/verification/VerificationHistory/VerificationHistory'
import { Loader } from '../../../components/common/Loader/Loader'
import { Button } from '../../../components/common/Button/Button'
import { verificationApi } from '../../../services/verificationApi'
import toast from 'react-hot-toast'
import './History.css'

export const History = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const response = await verificationApi.getHistory()
      setHistory(response.data || [])
      setError(null)
    } catch (err) {
      console.error('Failed to fetch history:', err)
      setError('Failed to load verification history')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchHistory()
    setRefreshing(false)
    toast.success('History refreshed')
  }

  if (loading) {
    return <Loader fullPage message="Loading history..." />
  }

  if (error) {
    return (
      <div className="verifier-history-error">
        <span className="verifier-history-error-icon">⚠️</span>
        <h3>Failed to Load History</h3>
        <p>{error}</p>
        <Button onClick={fetchHistory}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="verifier-history-page">
      <PageHeader
        title="Verification History"
        subtitle={`${history.length} review${history.length !== 1 ? 's' : ''} completed`}
        actions={
          <Button variant="primary" onClick={handleRefresh} loading={refreshing}>
            🔄 Refresh
          </Button>
        }
      />

      <VerificationHistory
        items={history}
        onRefresh={handleRefresh}
        itemsPerPage={10}
      />
    </div>
  )
}
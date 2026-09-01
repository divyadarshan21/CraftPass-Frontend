import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader'
import { StatCard } from '../../../components/common/StatCard/StatCard'
import { VerificationQueue } from '../../../components/verification/VerificationQueue/VerificationQueue'
import { Loader } from '../../../components/common/Loader/Loader'
import { EmptyState } from '../../../components/common/EmptyState/EmptyState'
import { verificationApi } from '../../../services/verificationApi'
import './Dashboard.css'

export const Dashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    inReview: 0,
    verified: 0,
    rejected: 0,
    total: 0,
  })
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await verificationApi.getQueue()
      const items = response.data || []
      setQueue(items)

      setStats({
        pending: items.filter(p => p.status === 'pending').length,
        inReview: items.filter(p => p.status === 'review').length,
        verified: items.filter(p => p.status === 'verified').length,
        rejected: items.filter(p => p.status === 'rejected').length,
        total: items.length,
      })
      setError(null)
    } catch (err) {
      console.error('Failed to fetch verification data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loader fullPage message="Loading dashboard..." />
  }

  if (error) {
    return (
      <div className="verifier-dashboard-error">
        <span className="verifier-dashboard-error-icon">⚠️</span>
        <h3>Failed to Load Dashboard</h3>
        <p>{error}</p>
        <button className="verifier-dashboard-retry" onClick={fetchData}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="verifier-dashboard">
      <PageHeader
        title="Verifier Dashboard"
        subtitle={`${stats.pending} products pending review`}
        actions={
          <Link to="/verifier/queue">
            <button className="verifier-dashboard-review-btn">
              📋 Review Queue ({stats.pending})
            </button>
          </Link>
        }
      />

      <div className="verifier-dashboard-stats">
        <StatCard
          label="Pending Review"
          value={stats.pending}
          icon="⏳"
          color="warning"
        />
        <StatCard
          label="In Review"
          value={stats.inReview}
          icon="🔍"
          color="info"
        />
        <StatCard
          label="Verified"
          value={stats.verified}
          icon="✅"
          color="success"
        />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          icon="❌"
          color="error"
        />
      </div>

      <div className="verifier-dashboard-queue">
        <div className="verifier-dashboard-queue-header">
          <h3>Recent Queue Items</h3>
          <Link to="/verifier/queue" className="view-all">
            View All →
          </Link>
        </div>
        {queue.length > 0 ? (
          <VerificationQueue items={queue.slice(0, 5)} onSelect={(id) => {
            window.location.href = `/verifier/submissions/${id}`
          }} />
        ) : (
          <EmptyState
            title="Queue is empty"
            description="No products pending verification at this time."
            icon="✅"
            actionText="Refresh"
            onAction={fetchData}
          />
        )}
      </div>

      <div className="verifier-dashboard-quick-actions">
        <div className="verifier-dashboard-quick-actions-grid">
          <Link to="/verifier/queue" className="quick-action-card">
            <span className="quick-action-icon">📋</span>
            <h4>Review Queue</h4>
            <p>Review pending products</p>
          </Link>
          <Link to="/verifier/history" className="quick-action-card">
            <span className="quick-action-icon">📜</span>
            <h4>History</h4>
            <p>View review history</p>
          </Link>
          <Link to="/verifier/statistics" className="quick-action-card">
            <span className="quick-action-icon">📊</span>
            <h4>Statistics</h4>
            <p>View verification stats</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
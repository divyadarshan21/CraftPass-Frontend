import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader'
import { Button } from '../../../components/common/Button/Button'
import { StatusBadge } from '../../../components/common/StatusBadge/StatusBadge'
import { Loader } from '../../../components/common/Loader/Loader'
import { EmptyState } from '../../../components/common/EmptyState/EmptyState'
import { productApi } from '../../../services/productApi'
import { formatDate, formatDateTime } from '../../../utils/formatters'
import toast from 'react-hot-toast'
import './Submissions.css'

export const Submissions = () => {
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const response = await productApi.list({ status: 'submitted' })
      setSubmissions(response.data || [])
      setError(null)
    } catch (err) {
      console.error('Failed to fetch submissions:', err)
      setError('Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }

  const getFilteredSubmissions = () => {
    if (filter === 'all') return submissions
    return submissions.filter(s => s.status === filter)
  }

  const getStatusCount = (status) => {
    if (status === 'all') return submissions.length
    return submissions.filter(s => s.status === status).length
  }

  const handleResubmit = async (id) => {
    try {
      await productApi.update(id, { status: 'pending' })
      toast.success('Product resubmitted for verification')
      await fetchSubmissions()
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to resubmit'
      toast.error(message)
    }
  }

  const filteredSubmissions = getFilteredSubmissions()

  if (loading) {
    return <Loader fullPage message="Loading submissions..." />
  }

  if (error) {
    return (
      <div className="submissions-error">
        <span className="submissions-error-icon">⚠️</span>
        <h3>Failed to Load Submissions</h3>
        <p>{error}</p>
        <Button onClick={fetchSubmissions}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="submissions-page">
      <PageHeader
        title="Submissions"
        subtitle="Track the verification status of your products"
        actions={
          <Link to="/artisan/products/new">
            <Button variant="accent">+ New Submission</Button>
          </Link>
        }
      />

      <div className="submissions-filters">
        <button
          className={`submissions-filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({getStatusCount('all')})
        </button>
        <button
          className={`submissions-filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({getStatusCount('pending')})
        </button>
        <button
          className={`submissions-filter-btn ${filter === 'verified' ? 'active' : ''}`}
          onClick={() => setFilter('verified')}
        >
          Verified ({getStatusCount('verified')})
        </button>
        <button
          className={`submissions-filter-btn ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected ({getStatusCount('rejected')})
        </button>
      </div>

      {filteredSubmissions.length > 0 ? (
        <div className="submissions-list">
          {filteredSubmissions.map((submission) => (
            <div key={submission.id} className="submission-item">
              <div className="submission-item-header">
                <div className="submission-item-product">
                  <img
                    src={submission.image || '/assets/images/placeholders/product-placeholder.png'}
                    alt={submission.name}
                    className="submission-item-thumbnail"
                    onError={(e) => {
                      e.target.src = '/assets/images/placeholders/product-placeholder.png'
                    }}
                  />
                  <div className="submission-item-details">
                    <Link 
                      to={`/artisan/products/${submission.id}`}
                      className="submission-item-name"
                    >
                      {submission.name || 'Untitled'}
                    </Link>
                    <div className="submission-item-meta">
                      <span className="submission-item-category">
                        📂 {submission.category || 'Uncategorized'}
                      </span>
                      {submission.submittedAt && (
                        <span className="submission-item-date">
                          📅 Submitted {formatDate(submission.submittedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="submission-item-status">
                  <StatusBadge status={submission.status} size="sm" />
                </div>
              </div>

              <div className="submission-item-body">
                {submission.status === 'rejected' && submission.rejectionReason && (
                  <div className="submission-item-rejection">
                    <span className="submission-item-rejection-label">Rejection Reason:</span>
                    <span className="submission-item-rejection-text">
                      {submission.rejectionReason}
                    </span>
                  </div>
                )}
                {submission.feedback && (
                  <div className="submission-item-feedback">
                    <span className="submission-item-feedback-label">Feedback:</span>
                    <span className="submission-item-feedback-text">
                      {submission.feedback}
                    </span>
                  </div>
                )}
                {submission.verifiedAt && (
                  <div className="submission-item-timeline">
                    <span className="submission-item-timeline-label">Verified on:</span>
                    <span className="submission-item-timeline-value">
                      {formatDateTime(submission.verifiedAt)}
                    </span>
                  </div>
                )}
              </div>

              <div className="submission-item-actions">
                <Link to={`/artisan/products/${submission.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
                {submission.status === 'rejected' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleResubmit(submission.id)}
                  >
                    Resubmit for Review
                  </Button>
                )}
                {submission.status === 'pending' && (
                  <Button variant="ghost" size="sm" disabled>
                    Awaiting Review
                  </Button>
                )}
                {submission.status === 'verified' && (
                  <Link to={`/passport/${submission.id}`}>
                    <Button variant="success" size="sm">
                      View Passport
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No submissions found"
          description="Submit your products for verification to get started."
          icon="📤"
          actionText="Submit a Product"
          onAction={() => navigate('/artisan/products/new')}
        />
      )}
    </div>
  )
}
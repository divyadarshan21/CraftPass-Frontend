import React, { useState } from 'react'
import { StatusBadge } from '../../common/StatusBadge/StatusBadge'
import { Button } from '../../common/Button/Button'
import { EvidenceList } from '../../evidence/EvidenceList/EvidenceList'
import { formatDate, formatDateTime } from '../../../utils/formatters'
import './VerificationReview.css'

export const VerificationReview = ({
  submission,
  onApprove,
  onReject,
  onRequestChanges,
  loading = false,
  className = '',
}) => {
  const [feedback, setFeedback] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showChangesModal, setShowChangesModal] = useState(false)

  const {
    id,
    name,
    description,
    image,
    status,
    category,
    artisanName,
    origin,
    price,
    materials,
    submittedAt,
    evidence = [],
    previousReviews = [],
    rejectionReason: existingRejection,
  } = submission || {}

  const handleApprove = () => {
    if (window.confirm('Are you sure you want to approve this product?')) {
      onApprove(id)
    }
  }

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(id, rejectionReason)
      setShowRejectModal(false)
      setRejectionReason('')
    }
  }

  const handleRequestChanges = () => {
    if (feedback.trim()) {
      onRequestChanges(id, feedback)
      setShowChangesModal(false)
      setFeedback('')
    }
  }

  const detailItems = [
    { label: 'Category', value: category, icon: '📂' },
    { label: 'Artisan', value: artisanName, icon: '👤' },
    { label: 'Origin', value: origin, icon: '📍' },
    { label: 'Price', value: price ? `$${price}` : null, icon: '💰' },
    { label: 'Materials', value: materials, icon: '🧵' },
  ]

  const visibleDetails = detailItems.filter(item => item.value)

  return (
    <div className={`verification-review ${className}`}>
      <div className="verification-review-header">
        <div className="verification-review-product">
          <img
            src={image || '/assets/images/placeholders/product-placeholder.png'}
            alt={name}
            className="verification-review-image"
            onError={(e) => {
              e.target.src = '/assets/images/placeholders/product-placeholder.png'
            }}
          />
          <div className="verification-review-product-info">
            <h2 className="verification-review-title">{name || 'Untitled'}</h2>
            <div className="verification-review-meta">
              <StatusBadge status={status} size="sm" />
              <span className="verification-review-id">#{id?.slice(0, 8)}</span>
              {submittedAt && (
                <span className="verification-review-date">
                  Submitted {formatDate(submittedAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="verification-review-actions">
          <Button
            variant="success"
            onClick={handleApprove}
            loading={loading}
            disabled={loading}
          >
            ✅ Approve
          </Button>
          <Button
            variant="warning"
            onClick={() => setShowChangesModal(true)}
            loading={loading}
            disabled={loading}
          >
            ✏️ Request Changes
          </Button>
          <Button
            variant="danger"
            onClick={() => setShowRejectModal(true)}
            loading={loading}
            disabled={loading}
          >
            ❌ Reject
          </Button>
        </div>
      </div>

      <div className="verification-review-body">
        <div className="verification-review-main">
          {/* Product Details */}
          {visibleDetails.length > 0 && (
            <div className="verification-review-section">
              <h3 className="verification-review-section-title">Product Details</h3>
              <div className="verification-review-grid">
                {visibleDetails.map((item, index) => (
                  <div key={index} className="verification-review-grid-item">
                    <span className="verification-review-grid-icon">{item.icon}</span>
                    <div className="verification-review-grid-content">
                      <span className="verification-review-grid-label">{item.label}</span>
                      <span className="verification-review-grid-value">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="verification-review-section">
              <h3 className="verification-review-section-title">Description</h3>
              <p className="verification-review-description">{description}</p>
            </div>
          )}

          {/* Evidence */}
          {evidence && evidence.length > 0 && (
            <div className="verification-review-section">
              <h3 className="verification-review-section-title">
                Evidence ({evidence.length})
              </h3>
              <EvidenceList
                evidence={evidence}
                showActions={false}
                cardSize="sm"
                layout="grid"
              />
            </div>
          )}

          {/* Previous Reviews */}
          {previousReviews && previousReviews.length > 0 && (
            <div className="verification-review-section">
              <h3 className="verification-review-section-title">Review History</h3>
              <div className="verification-review-history">
                {previousReviews.map((review, index) => (
                  <div key={index} className="verification-review-history-item">
                    <div className="verification-review-history-header">
                      <span className="verification-review-history-decision">
                        {review.decision === 'approve' ? '✅ Approved' :
                         review.decision === 'reject' ? '❌ Rejected' :
                         '✏️ Changes Requested'}
                      </span>
                      <span className="verification-review-history-date">
                        {formatDateTime(review.createdAt)}
                      </span>
                    </div>
                    {review.feedback && (
                      <p className="verification-review-history-feedback">
                        {review.feedback}
                      </p>
                    )}
                    <span className="verification-review-history-reviewer">
                      Reviewed by {review.reviewerName || 'Unknown'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Existing Rejection */}
          {status === 'rejected' && existingRejection && (
            <div className="verification-review-section verification-review-rejection">
              <h3 className="verification-review-section-title text-error">Rejection Reason</h3>
              <p className="verification-review-rejection-text">{existingRejection}</p>
            </div>
          )}
        </div>

        <div className="verification-review-sidebar">
          <div className="verification-review-sidebar-card">
            <h4 className="verification-review-sidebar-title">Submission Info</h4>
            <div className="verification-review-sidebar-item">
              <span className="verification-review-sidebar-label">Status</span>
              <StatusBadge status={status} size="sm" />
            </div>
            <div className="verification-review-sidebar-item">
              <span className="verification-review-sidebar-label">Submitted</span>
              <span className="verification-review-sidebar-value">
                {submittedAt ? formatDateTime(submittedAt) : 'N/A'}
              </span>
            </div>
            <div className="verification-review-sidebar-item">
              <span className="verification-review-sidebar-label">Evidence Items</span>
              <span className="verification-review-sidebar-value">{evidence?.length || 0}</span>
            </div>
          </div>

          <div className="verification-review-sidebar-card">
            <h4 className="verification-review-sidebar-title">Quick Actions</h4>
            <div className="verification-review-sidebar-actions">
              <Button variant="outline" fullWidth size="sm">
                📋 View Passport
              </Button>
              <Button variant="outline" fullWidth size="sm">
                📎 Download Evidence
              </Button>
              <Button variant="outline" fullWidth size="sm">
                📧 Contact Artisan
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="verification-review-modal-overlay">
          <div className="verification-review-modal">
            <h3 className="verification-review-modal-title">Reject Product</h3>
            <p className="verification-review-modal-description">
              Please provide a reason for rejecting this product. This will be shared with the artisan.
            </p>
            <textarea
              className="verification-review-modal-textarea"
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
            <div className="verification-review-modal-actions">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectionReason('')
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Request Changes Modal */}
      {showChangesModal && (
        <div className="verification-review-modal-overlay">
          <div className="verification-review-modal">
            <h3 className="verification-review-modal-title">Request Changes</h3>
            <p className="verification-review-modal-description">
              Provide feedback on what changes are needed for this product.
            </p>
            <textarea
              className="verification-review-modal-textarea"
              placeholder="Enter feedback for changes..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
            <div className="verification-review-modal-actions">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowChangesModal(false)
                  setFeedback('')
                }}
              >
                Cancel
              </Button>
              <Button
                variant="warning"
                onClick={handleRequestChanges}
                disabled={!feedback.trim()}
              >
                Request Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
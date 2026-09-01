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
  onRequestCorrection,
  loading = false,
  className = '',
}) => {
  const [feedback, setFeedback] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showCorrectionModal, setShowCorrectionModal] = useState(false)

  const {
    id,
    name,
    description,
    image,
    status,
    craft,
    origin,
    materials,
    techniques,
    submittedAt,
    evidence = [],
    previousReviews = [],
    rejectionReason,
    correctionRemarks,
  } = submission || {}

  const handleApprove = () => {
    if (window.confirm('Are you sure you want to approve this product?')) {
      onApprove(id, feedback)
      setFeedback('')
    }
  }

  const handleReject = () => {
    if (feedback.trim()) {
      onReject(id, feedback)
      setShowRejectModal(false)
      setFeedback('')
    }
  }

  const handleRequestCorrection = () => {
    if (feedback.trim()) {
      onRequestCorrection(id, feedback)
      setShowCorrectionModal(false)
      setFeedback('')
    }
  }

  const detailItems = [
    { label: 'Craft', value: craft, icon: '🎨' },
    { label: 'Origin', value: origin, icon: '📍' },
    { label: 'Materials', value: materials?.join(', '), icon: '🧵' },
    { label: 'Techniques', value: techniques?.join(', '), icon: '🔧' },
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
            onClick={() => setShowCorrectionModal(true)}
            loading={loading}
            disabled={loading}
          >
            ✏️ Request Correction
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

          {/* Rejection Reason */}
          {status === 'REJECTED' && rejectionReason && (
            <div className="verification-review-section verification-review-rejection">
              <h3 className="verification-review-section-title text-error">Rejection Reason</h3>
              <p className="verification-review-rejection-text">{rejectionReason}</p>
            </div>
          )}

          {/* Correction Remarks */}
          {status === 'CORRECTION_REQUIRED' && correctionRemarks && (
            <div className="verification-review-section verification-review-correction">
              <h3 className="verification-review-section-title text-warning">Correction Required</h3>
              <p className="verification-review-correction-text">{correctionRemarks}</p>
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
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="verification-review-modal-overlay">
          <div className="verification-review-modal">
            <h3 className="verification-review-modal-title">Reject Product</h3>
            <p className="verification-review-modal-description">
              Please provide a reason for rejecting this product.
            </p>
            <textarea
              className="verification-review-modal-textarea"
              placeholder="Enter rejection reason..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
            <div className="verification-review-modal-actions">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowRejectModal(false)
                  setFeedback('')
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleReject}
                disabled={!feedback.trim()}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Correction Modal */}
      {showCorrectionModal && (
        <div className="verification-review-modal-overlay">
          <div className="verification-review-modal">
            <h3 className="verification-review-modal-title">Request Correction</h3>
            <p className="verification-review-modal-description">
              Provide feedback on what corrections are needed.
            </p>
            <textarea
              className="verification-review-modal-textarea"
              placeholder="Enter correction feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
            <div className="verification-review-modal-actions">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowCorrectionModal(false)
                  setFeedback('')
                }}
              >
                Cancel
              </Button>
              <Button
                variant="warning"
                onClick={handleRequestCorrection}
                disabled={!feedback.trim()}
              >
                Request Correction
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
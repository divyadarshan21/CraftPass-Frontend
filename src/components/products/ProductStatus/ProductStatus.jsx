import React from 'react'
import { StatusBadge } from '../../common/StatusBadge/StatusBadge'
import { Button } from '../../common/Button/Button'
import './ProductStatus.css'

export const ProductStatus = ({
  product,
  onStatusChange,
  onViewDetails,
  className = '',
  showActions = true,
  compact = false,
}) => {
  const {
    id,
    name,
    status,
    submittedAt,
    verifiedAt,
    rejectionReason,
    feedback,
  } = product || {}

  const getStatusInfo = () => {
    switch (status?.toLowerCase()) {
      case 'verified':
        return {
          icon: '✅',
          title: 'Verified',
          color: 'success',
          message: 'This product has been verified as authentic',
          date: verifiedAt,
          dateLabel: 'Verified on',
          action: 'Revoke Verification',
          actionType: 'rejected',
        }
      case 'pending':
        return {
          icon: '⏳',
          title: 'Pending Verification',
          color: 'warning',
          message: 'This product is awaiting review by a verifier',
          date: submittedAt,
          dateLabel: 'Submitted on',
          action: 'Cancel Submission',
          actionType: 'draft',
        }
      case 'rejected':
        return {
          icon: '❌',
          title: 'Rejected',
          color: 'error',
          message: 'This product did not pass verification',
          date: null,
          dateLabel: null,
          action: 'Resubmit',
          actionType: 'pending',
        }
      default:
        return {
          icon: '📄',
          title: 'Draft',
          color: 'muted',
          message: 'This product is a draft and not yet submitted',
          date: null,
          dateLabel: null,
          action: 'Submit for Verification',
          actionType: 'pending',
        }
    }
  }

  const info = getStatusInfo()

  const handleStatusAction = () => {
    if (onStatusChange && info.actionType) {
      onStatusChange(id, info.actionType)
    }
  }

  if (compact) {
    return (
      <div className={`product-status-compact ${info.color} ${className}`}>
        <span className="product-status-compact-icon">{info.icon}</span>
        <span className="product-status-compact-label">{info.title}</span>
        <StatusBadge status={status} size="sm" />
      </div>
    )
  }

  return (
    <div className={`product-status ${info.color} ${className}`}>
      <div className="product-status-header">
        <div className="product-status-icon-wrapper">
          <span className="product-status-icon">{info.icon}</span>
        </div>
        <div className="product-status-info">
          <h4 className="product-status-title">{info.title}</h4>
          <p className="product-status-message">{info.message}</p>
          {info.date && (
            <span className="product-status-date">
              {info.dateLabel}: {new Date(info.date).toLocaleString()}
            </span>
          )}
          {status === 'rejected' && rejectionReason && (
            <div className="product-status-rejection">
              <span className="product-status-rejection-label">Reason:</span>
              <span className="product-status-rejection-text">{rejectionReason}</span>
            </div>
          )}
          {feedback && (
            <div className="product-status-feedback">
              <span className="product-status-feedback-label">Feedback:</span>
              <span className="product-status-feedback-text">{feedback}</span>
            </div>
          )}
        </div>
      </div>

      {showActions && (
        <div className="product-status-actions">
          {onStatusChange && info.action && (
            <Button
              variant={info.color === 'success' ? 'danger' : 'primary'}
              size="sm"
              onClick={handleStatusAction}
            >
              {info.action}
            </Button>
          )}
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(id)}
            >
              View Details
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
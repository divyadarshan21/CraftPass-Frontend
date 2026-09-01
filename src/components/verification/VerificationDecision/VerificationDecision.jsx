import React, { useState } from 'react'
import { Button } from '../../common/Button/Button'
import './VerificationDecision.css'

export const VerificationDecision = ({
  submission,
  onDecide,
  loading = false,
  className = '',
}) => {
  const [feedback, setFeedback] = useState('')
  const [decision, setDecision] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const handleDecision = (type) => {
    if (type === 'approve') {
      onDecide('approve', '')
    } else {
      setDecision(type)
      setShowFeedback(true)
    }
  }

  const handleSubmitFeedback = () => {
    if (feedback.trim()) {
      onDecide(decision, feedback)
      setShowFeedback(false)
      setFeedback('')
      setDecision(null)
    }
  }

  const handleCancel = () => {
    setShowFeedback(false)
    setFeedback('')
    setDecision(null)
  }

  return (
    <div className={`verification-decision ${className}`}>
      <div className="verification-decision-header">
        <h3 className="verification-decision-title">Make a Decision</h3>
        <p className="verification-decision-description">
          Review the product details and evidence before making your decision.
        </p>
      </div>

      <div className="verification-decision-actions">
        <button
          className="verification-decision-btn approve"
          onClick={() => handleDecision('approve')}
          disabled={loading}
        >
          <span className="verification-decision-btn-icon">✅</span>
          <span className="verification-decision-btn-label">Approve</span>
          <span className="verification-decision-btn-description">
            Product meets all requirements
          </span>
        </button>

        <button
          className="verification-decision-btn changes"
          onClick={() => handleDecision('changes')}
          disabled={loading}
        >
          <span className="verification-decision-btn-icon">✏️</span>
          <span className="verification-decision-btn-label">Request Changes</span>
          <span className="verification-decision-btn-description">
            Needs modifications or additional information
          </span>
        </button>

        <button
          className="verification-decision-btn reject"
          onClick={() => handleDecision('reject')}
          disabled={loading}
        >
          <span className="verification-decision-btn-icon">❌</span>
          <span className="verification-decision-btn-label">Reject</span>
          <span className="verification-decision-btn-description">
            Does not meet verification criteria
          </span>
        </button>
      </div>

      {showFeedback && (
        <div className="verification-decision-feedback">
          <div className="verification-decision-feedback-header">
            <h4 className="verification-decision-feedback-title">
              {decision === 'changes' ? 'Request Changes' : 'Rejection Reason'}
            </h4>
            <p className="verification-decision-feedback-description">
              {decision === 'changes'
                ? 'Provide specific feedback on what changes are needed.'
                : 'Explain why this product is being rejected.'}
            </p>
          </div>
          <textarea
            className="verification-decision-feedback-textarea"
            placeholder={decision === 'changes'
              ? 'Enter feedback for changes...'
              : 'Enter rejection reason...'}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
          />
          <div className="verification-decision-feedback-actions">
            <Button variant="ghost" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant={decision === 'changes' ? 'warning' : 'danger'}
              onClick={handleSubmitFeedback}
              loading={loading}
              disabled={!feedback.trim()}
            >
              {decision === 'changes' ? 'Request Changes' : 'Confirm Rejection'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
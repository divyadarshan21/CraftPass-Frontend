import React from 'react'
import './VerificationSeal.css'

export const VerificationSeal = ({ 
  status, 
  size = 'md',
  showMessage = true,
  className = '',
  onVerify,
}) => {
  const getSealInfo = () => {
    switch (status?.toLowerCase()) {
      case 'verified':
        return {
          icon: '✅',
          label: 'Verified',
          color: 'success',
          message: 'This product has been verified as authentic by CraftPass',
          details: 'All evidence has been reviewed and approved',
        }
      case 'pending':
        return {
          icon: '⏳',
          label: 'Pending Verification',
          color: 'warning',
          message: 'This product is currently awaiting verification',
          details: 'Verifier review in progress',
        }
      case 'rejected':
        return {
          icon: '❌',
          label: 'Verification Failed',
          color: 'error',
          message: 'This product did not pass the verification process',
          details: 'Please review the feedback for more information',
        }
      default:
        return {
          icon: '📄',
          label: 'Draft',
          color: 'muted',
          message: 'This product has not been submitted for verification',
          details: 'Complete the submission process to start verification',
        }
    }
  }

  const info = getSealInfo()
  const isVerified = status?.toLowerCase() === 'verified'

  return (
    <div className={`verification-seal ${info.color} ${size} ${className}`}>
      <div className="verification-seal-inner">
        <div className="verification-seal-icon-wrapper">
          <div className="verification-seal-icon-ring">
            <span className="verification-seal-icon">{info.icon}</span>
          </div>
          {isVerified && (
            <div className="verification-seal-pulse">
              <span className="verification-seal-pulse-dot" />
            </div>
          )}
        </div>

        <div className="verification-seal-content">
          <span className="verification-seal-label">{info.label}</span>
          {showMessage && (
            <>
              <span className="verification-seal-message">{info.message}</span>
              {info.details && (
                <span className="verification-seal-details">{info.details}</span>
              )}
            </>
          )}
          {isVerified && (
            <div className="verification-seal-certificate">
              <span className="verification-seal-certificate-icon">🏆</span>
              <span className="verification-seal-certificate-text">
                CraftPass Authenticity Certificate
              </span>
            </div>
          )}
          {onVerify && status?.toLowerCase() === 'pending' && (
            <button 
              className="verification-seal-action"
              onClick={onVerify}
            >
              Verify Now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
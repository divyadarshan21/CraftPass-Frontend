import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader'
import { VerificationReview } from '../../../components/verification/VerificationReview/VerificationReview'
import { VerificationDecision } from '../../../components/verification/VerificationDecision/VerificationDecision'
import { Loader } from '../../../components/common/Loader/Loader'
import { Button } from '../../../components/common/Button/Button'
import { verificationApi } from '../../../services/verificationApi'
import toast from 'react-hot-toast'
import './ReviewSubmission.css'

export const ReviewSubmission = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSubmission()
  }, [id])

  const fetchSubmission = async () => {
    try {
      setLoading(true)
      const response = await verificationApi.getReview(id)
      setSubmission(response.data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch submission:', err)
      setError('Submission not found or unavailable')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (submissionId) => {
    setProcessing(true)
    try {
      await verificationApi.decide(submissionId, 'approve', '')
      toast.success('Product approved successfully!')
      navigate('/verifier/queue')
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to approve'
      toast.error(message)
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async (submissionId, reason) => {
    setProcessing(true)
    try {
      await verificationApi.decide(submissionId, 'reject', reason)
      toast.success('Product rejected')
      navigate('/verifier/queue')
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to reject'
      toast.error(message)
    } finally {
      setProcessing(false)
    }
  }

  const handleRequestChanges = async (submissionId, feedback) => {
    setProcessing(true)
    try {
      await verificationApi.decide(submissionId, 'request_changes', feedback)
      toast.success('Changes requested successfully')
      navigate('/verifier/queue')
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to request changes'
      toast.error(message)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return <Loader fullPage message="Loading submission..." />
  }

  if (error || !submission) {
    return (
      <div className="review-submission-error">
        <div className="review-submission-error-content">
          <span className="review-submission-error-icon">🔍</span>
          <h2>Submission Not Found</h2>
          <p>{error || 'The submission you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/verifier/queue')}>
            Back to Queue
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="review-submission-page">
      <PageHeader
        title="Review Submission"
        subtitle={`Product: ${submission.name || 'Untitled'}`}
        actions={
          <div className="review-submission-header-actions">
            <Link to="/verifier/queue">
              <Button variant="ghost" size="sm">
                ← Back to Queue
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/passport/${submission.id}`, '_blank')}
            >
              📋 View Passport
            </Button>
          </div>
        }
      />

      <div className="review-submission-content">
        <div className="review-submission-main">
          <VerificationReview
            submission={submission}
            onApprove={handleApprove}
            onReject={handleReject}
            onRequestChanges={handleRequestChanges}
            loading={processing}
          />
        </div>

        <div className="review-submission-sidebar">
          <div className="review-submission-sidebar-card">
            <h4>Review Progress</h4>
            <div className="review-submission-progress">
              <div className="review-submission-progress-step completed">
                <span className="review-submission-progress-step-icon">✓</span>
                <span className="review-submission-progress-step-label">Review Details</span>
              </div>
              <div className="review-submission-progress-step completed">
                <span className="review-submission-progress-step-icon">✓</span>
                <span className="review-submission-progress-step-label">Examine Evidence</span>
              </div>
              <div className="review-submission-progress-step active">
                <span className="review-submission-progress-step-icon">●</span>
                <span className="review-submission-progress-step-label">Make Decision</span>
              </div>
            </div>
          </div>

          <div className="review-submission-sidebar-card">
            <h4>Guidelines</h4>
            <ul className="review-submission-guidelines">
              <li>✅ Verify product authenticity</li>
              <li>✅ Check evidence quality</li>
              <li>✅ Review artisan information</li>
              <li>✅ Ensure product meets standards</li>
              <li>✅ Provide constructive feedback</li>
            </ul>
          </div>

          <div className="review-submission-sidebar-card">
            <h4>Quick Stats</h4>
            <div className="review-submission-stats">
              <div className="review-submission-stat">
                <span className="review-submission-stat-label">Status</span>
                <span className={`review-submission-stat-value status-${submission.status?.toLowerCase() || 'pending'}`}>
                  {submission.status || 'Pending'}
                </span>
              </div>
              <div className="review-submission-stat">
                <span className="review-submission-stat-label">Submitted</span>
                <span className="review-submission-stat-value">
                  {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="review-submission-stat">
                <span className="review-submission-stat-label">Evidence</span>
                <span className="review-submission-stat-value">
                  {submission.evidence?.length || 0} items
                </span>
              </div>
              <div className="review-submission-stat">
                <span className="review-submission-stat-label">Reviews</span>
                <span className="review-submission-stat-value">
                  {submission.previousReviews?.length || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="review-submission-sidebar-card review-submission-decision-card">
            <h4>Decision</h4>
            <VerificationDecision
              submission={submission}
              onDecide={(decision, feedback) => {
                if (decision === 'approve') {
                  handleApprove(submission.id)
                } else if (decision === 'reject') {
                  handleReject(submission.id, feedback)
                } else if (decision === 'changes') {
                  handleRequestChanges(submission.id, feedback)
                }
              }}
              loading={processing}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
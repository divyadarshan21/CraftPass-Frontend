import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader'
import { VerificationReview } from '../../../components/verification/VerificationReview/VerificationReview'
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
      const response = await verificationApi.getProduct(id)
      setSubmission(response.data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch submission:', err)
      setError('Submission not found or unavailable')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (submissionId, remarks) => {
    setProcessing(true)
    try {
      await verificationApi.approve(submissionId, remarks)
      toast.success('Product approved successfully!')
      navigate('/verifier/queue')
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to approve'
      toast.error(message)
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async (submissionId, remarks) => {
    setProcessing(true)
    try {
      await verificationApi.reject(submissionId, remarks)
      toast.success('Product rejected')
      navigate('/verifier/queue')
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to reject'
      toast.error(message)
    } finally {
      setProcessing(false)
    }
  }

  const handleRequestCorrection = async (submissionId, remarks) => {
    setProcessing(true)
    try {
      await verificationApi.correction(submissionId, remarks)
      toast.success('Correction requested successfully')
      navigate('/verifier/queue')
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to request correction'
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
              onClick={() => window.open(`/passport/${submission.passportSlug || submission.id}`, '_blank')}
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
            onRequestCorrection={handleRequestCorrection}
            loading={processing}
          />
        </div>
      </div>
    </div>
  )
}
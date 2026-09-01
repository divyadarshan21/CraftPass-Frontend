import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/common/Button/Button'
import { Loader } from '../../../components/common/Loader/Loader'
import { PassportHeader } from '../../../components/passport/PassportHeader/PassportHeader'
import { PassportDetails } from '../../../components/passport/PassportDetails/PassportDetails'
import { PassportEvidence } from '../../../components/passport/PassportEvidence/PassportEvidence'
import { ProvenanceTimeline } from '../../../components/passport/ProvenanceTimeline/ProvenanceTimeline'
import { VerificationSeal } from '../../../components/passport/VerificationSeal/VerificationSeal'
import { passportApi } from '../../../services/passportApi'
import './Passport.css'

export const Passport = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await passportApi.get(slug)
        setProduct(response.data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch passport:', err)
        setError('Product not found or unavailable')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug])

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || 'CraftPass Product',
          text: `Check out this verified product: ${product?.name}`,
          url: url,
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          // Fallback to clipboard
          await navigator.clipboard.writeText(url)
          alert('Link copied to clipboard!')
        }
      }
    } else {
      await navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return <Loader fullPage message="Loading passport..." />
  }

  if (error || !product) {
    return (
      <div className="passport-error">
        <div className="passport-error-content">
          <span className="passport-error-icon">🔍</span>
          <h2>Product Not Found</h2>
          <p>{error || 'The product you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/search')}>Search Products</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="passport-page">
      <div className="passport-container">
        <div className="passport-header-actions">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            ← Back
          </Button>
          <div className="passport-header-actions-right">
            <Button variant="outline" size="sm" onClick={handleShare}>
              📤 Share
            </Button>
            <Button variant="outline" size="sm">
              📄 Download
            </Button>
          </div>
        </div>

        {/* Verification Seal */}
        <div className="passport-seal-wrapper">
          <VerificationSeal
            status={product.status}
            size="lg"
            showMessage={true}
          />
        </div>

        {/* Passport Header */}
        <PassportHeader
          name={product.name}
          status={product.status}
          image={product.image}
          artisanName={product.artisan}
          category={product.category}
          origin={product.origin}
        />

        {/* Passport Content */}
        <div className="passport-content">
          <div className="passport-main">
            {/* Product Details */}
            <PassportDetails
              artisan={product.artisan}
              category={product.category}
              origin={product.origin}
              date={product.createdAt}
              description={product.description}
              price={product.price}
              materials={product.materials}
              dimensions={product.dimensions}
              weight={product.weight}
              tags={product.tags || []}
            />

            {/* Evidence */}
            {product.evidence && product.evidence.length > 0 && (
              <PassportEvidence
                evidence={product.evidence}
                title="Supporting Evidence"
              />
            )}

            {/* Provenance Timeline */}
            {product.provenanceEvents && product.provenanceEvents.length > 0 && (
              <ProvenanceTimeline
                events={product.provenanceEvents}
                title="Provenance Timeline"
              />
            )}
          </div>

          <div className="passport-sidebar">
            <div className="passport-sidebar-card">
              <h4>Quick Actions</h4>
              <div className="passport-sidebar-actions">
                <Button variant="outline" fullWidth size="sm" onClick={handleShare}>
                  📤 Share Product
                </Button>
                <Button variant="outline" fullWidth size="sm">
                  📋 Report Issue
                </Button>
                <Button variant="primary" fullWidth size="sm">
                  💬 Contact Artisan
                </Button>
              </div>
            </div>

            {product.status === 'verified' && (
              <div className="passport-sidebar-card passport-sidebar-card-success">
                <div className="passport-sidebar-card-icon">✅</div>
                <h4>Verified Product</h4>
                <p>This product has been verified by CraftPass</p>
                <div className="passport-sidebar-card-date">
                  Verified on {new Date(product.verifiedAt || product.createdAt).toLocaleDateString()}
                </div>
              </div>
            )}

            {product.status === 'pending' && (
              <div className="passport-sidebar-card passport-sidebar-card-warning">
                <div className="passport-sidebar-card-icon">⏳</div>
                <h4>Pending Verification</h4>
                <p>This product is currently under review</p>
              </div>
            )}

            {product.status === 'rejected' && (
              <div className="passport-sidebar-card passport-sidebar-card-error">
                <div className="passport-sidebar-card-icon">❌</div>
                <h4>Verification Failed</h4>
                <p>This product did not pass verification</p>
                {product.rejectionReason && (
                  <p className="passport-sidebar-card-reason">
                    Reason: {product.rejectionReason}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
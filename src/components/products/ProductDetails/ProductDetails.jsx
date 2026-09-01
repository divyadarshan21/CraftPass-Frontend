import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { StatusBadge } from '../../common/StatusBadge/StatusBadge'
import { Button } from '../../common/Button/Button'
import { formatDate, formatDateTime } from '../../../utils/formatters'
import './ProductDetails.css'

export const ProductDetails = ({ 
  product,
  onDelete,
  onEdit,
  onStatusChange,
  className = '',
  showActions = true,
  showFullDescription = true,
}) => {
  const navigate = useNavigate()
  const [showFullDesc, setShowFullDesc] = useState(showFullDescription)
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    id,
    name,
    category,
    description,
    image,
    status,
    price,
    artisanName,
    origin,
    materials,
    dimensions,
    weight,
    createdAt,
    updatedAt,
    submittedAt,
    verifiedAt,
    rejectionReason,
    tags = [],
  } = product || {}

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      setIsDeleting(true)
      try {
        await onDelete?.(id)
        navigate('/artisan/products')
      } catch (error) {
        console.error('Delete failed:', error)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleStatusChange = (newStatus) => {
    onStatusChange?.(id, newStatus)
  }

  const detailItems = [
    { label: 'Category', value: category, icon: '📂' },
    { label: 'Artisan', value: artisanName, icon: '👤' },
    { label: 'Origin', value: origin, icon: '📍' },
    { label: 'Price', value: price ? `$${price}` : null, icon: '💰' },
    { label: 'Materials', value: materials, icon: '🧵' },
    { label: 'Dimensions', value: dimensions, icon: '📐' },
    { label: 'Weight', value: weight, icon: '⚖️' },
  ]

  const timelineItems = [
    { label: 'Created', date: createdAt, icon: '🔨' },
    { label: 'Submitted', date: submittedAt, icon: '📤' },
    { label: 'Verified', date: verifiedAt, icon: '✅' },
    { label: 'Last Updated', date: updatedAt, icon: '🔄' },
  ]

  const visibleDetails = detailItems.filter(item => item.value)
  const visibleTimeline = timelineItems.filter(item => item.date)

  return (
    <div className={`product-details ${className}`}>
      <div className="product-details-header">
        <div className="product-details-image-container">
          <img
            src={image || '/assets/images/placeholders/product-placeholder.png'}
            alt={name || 'Product'}
            className="product-details-image"
            onError={(e) => {
              e.target.src = '/assets/images/placeholders/product-placeholder.png'
            }}
          />
          <div className="product-details-status">
            <StatusBadge status={status} size="lg" />
          </div>
        </div>

        <div className="product-details-info">
          <h1 className="product-details-title">{name || 'Untitled Product'}</h1>
          
          <div className="product-details-meta">
            {category && (
              <span className="product-details-meta-item">
                <span className="product-details-meta-icon">📂</span>
                {category}
              </span>
            )}
            {artisanName && (
              <span className="product-details-meta-item">
                <span className="product-details-meta-icon">👤</span>
                {artisanName}
              </span>
            )}
            {createdAt && (
              <span className="product-details-meta-item">
                <span className="product-details-meta-icon">📅</span>
                Created {formatDate(createdAt)}
              </span>
            )}
          </div>

          {showActions && (onEdit || onDelete || onStatusChange) && (
            <div className="product-details-actions">
              {onEdit && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onEdit(id)}
                >
                  ✏️ Edit Product
                </Button>
              )}
              {onStatusChange && status === 'pending' && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleStatusChange('verified')}
                >
                  ✅ Verify
                </Button>
              )}
              {onStatusChange && status === 'verified' && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleStatusChange('rejected')}
                >
                  ❌ Revoke
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDelete}
                  loading={isDeleting}
                >
                  🗑️ Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="product-details-body">
        <div className="product-details-main">
          {/* Description */}
          {description && (
            <div className="product-details-section">
              <h3 className="product-details-section-title">Description</h3>
              <div className="product-details-description">
                <p>
                  {showFullDesc ? description : description.slice(0, 300)}
                  {description.length > 300 && (
                    <button
                      className="product-details-description-toggle"
                      onClick={() => setShowFullDesc(prev => !prev)}
                    >
                      {showFullDesc ? ' Show less' : '... Show more'}
                    </button>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Details Grid */}
          {visibleDetails.length > 0 && (
            <div className="product-details-section">
              <h3 className="product-details-section-title">Product Details</h3>
              <div className="product-details-grid">
                {visibleDetails.map((item, index) => (
                  <div key={index} className="product-details-grid-item">
                    <span className="product-details-grid-icon">{item.icon}</span>
                    <div className="product-details-grid-content">
                      <span className="product-details-grid-label">{item.label}</span>
                      <span className="product-details-grid-value">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="product-details-section">
              <h3 className="product-details-section-title">Tags</h3>
              <div className="product-details-tags">
                {tags.map((tag, index) => (
                  <span key={index} className="product-details-tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rejection Reason */}
          {status === 'rejected' && rejectionReason && (
            <div className="product-details-section product-details-rejection">
              <h3 className="product-details-section-title text-error">Rejection Reason</h3>
              <p className="product-details-rejection-text">{rejectionReason}</p>
            </div>
          )}
        </div>

        <div className="product-details-sidebar">
          {/* Timeline */}
          {visibleTimeline.length > 0 && (
            <div className="product-details-sidebar-card">
              <h4 className="product-details-sidebar-title">Timeline</h4>
              <div className="product-details-timeline">
                {visibleTimeline.map((item, index) => (
                  <div key={index} className="product-details-timeline-item">
                    <span className="product-details-timeline-icon">{item.icon}</span>
                    <div className="product-details-timeline-content">
                      <span className="product-details-timeline-label">{item.label}</span>
                      <span className="product-details-timeline-date">
                        {formatDateTime(item.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="product-details-sidebar-card">
            <h4 className="product-details-sidebar-title">Quick Actions</h4>
            <div className="product-details-sidebar-actions">
              <Link to={`/artisan/evidence?productId=${id}`}>
                <Button variant="outline" fullWidth size="sm">
                  📎 Manage Evidence
                </Button>
              </Link>
              <Link to={`/passport/${id}`}>
                <Button variant="outline" fullWidth size="sm">
                  📋 View Passport
                </Button>
              </Link>
              <Button variant="outline" fullWidth size="sm">
                  🔗 Share Product
              </Button>
            </div>
          </div>

          {/* Status Summary */}
          <div className="product-details-sidebar-card product-details-status-summary">
            <h4 className="product-details-sidebar-title">Status Summary</h4>
            <div className="product-details-status-item">
              <span className="product-details-status-label">Current Status</span>
              <StatusBadge status={status} size="sm" />
            </div>
            <div className="product-details-status-item">
              <span className="product-details-status-label">Product ID</span>
              <span className="product-details-status-value">#{id?.slice(0, 8)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
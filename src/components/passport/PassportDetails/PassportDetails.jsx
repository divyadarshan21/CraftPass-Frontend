import React, { useState } from 'react'
import { formatDate } from '../../../utils/formatters'
import './PassportDetails.css'

export const PassportDetails = ({
  artisan,
  category,
  origin,
  date,
  description,
  price,
  materials,
  dimensions,
  weight,
  tags = [],
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const detailItems = [
    { label: 'Artisan', value: artisan, icon: '👤' },
    { label: 'Category', value: category, icon: '📂' },
    { label: 'Origin', value: origin, icon: '📍' },
    { label: 'Date', value: date ? formatDate(date) : null, icon: '📅' },
    { label: 'Price', value: price ? `$${price}` : null, icon: '💰' },
    { label: 'Materials', value: materials, icon: '🧵' },
    { label: 'Dimensions', value: dimensions, icon: '📐' },
    { label: 'Weight', value: weight, icon: '⚖️' },
  ]

  const visibleDetails = detailItems.filter(item => item.value)
  const shouldTruncate = description && description.length > 200

  return (
    <div className={`passport-details ${className}`}>
      <div className="passport-details-header">
        <h3 className="passport-details-title">Product Details</h3>
        <span className="passport-details-badge">Authenticity Information</span>
      </div>

      <div className="passport-details-grid">
        {visibleDetails.map((item, index) => (
          <div key={index} className="passport-detail-item">
            <span className="passport-detail-icon">{item.icon}</span>
            <div className="passport-detail-content">
              <span className="passport-detail-label">{item.label}</span>
              <span className="passport-detail-value">{item.value}</span>
            </div>
          </div>
        ))}
      </div>

      {description && (
        <div className="passport-detail-description">
          <h4 className="passport-detail-description-title">Description</h4>
          <p className="passport-detail-description-text">
            {isExpanded ? description : description.slice(0, 200)}
            {shouldTruncate && (
              <button
                className="passport-detail-description-toggle"
                onClick={() => setIsExpanded(prev => !prev)}
              >
                {isExpanded ? ' Show less' : '... Show more'}
              </button>
            )}
          </p>
        </div>
      )}

      {tags.length > 0 && (
        <div className="passport-detail-tags">
          <span className="passport-detail-tags-label">Tags:</span>
          {tags.map((tag, index) => (
            <span key={index} className="passport-detail-tag">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
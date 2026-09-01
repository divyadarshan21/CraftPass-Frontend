import React from 'react'
import { StatusBadge } from '../../common/StatusBadge/StatusBadge'
import './PassportHeader.css'

export const PassportHeader = ({ 
  name, 
  status, 
  image, 
  artisanName,
  category,
  origin,
  className = '' 
}) => {
  return (
    <div className={`passport-header ${className}`}>
      <div className="passport-header-image-container">
        <div className="passport-header-image">
          <img
            src={image || '/assets/images/placeholders/product-placeholder.png'}
            alt={name || 'Product'}
            onError={(e) => {
              e.target.src = '/assets/images/placeholders/product-placeholder.png'
            }}
          />
        </div>
        <div className="passport-header-status-badge">
          <StatusBadge status={status} size="lg" />
        </div>
      </div>
      
      <div className="passport-header-info">
        <h1 className="passport-header-title">{name || 'Untitled Product'}</h1>
        
        <div className="passport-header-metadata">
          {artisanName && (
            <span className="passport-header-metadata-item">
              <span className="passport-header-metadata-icon">👤</span>
              {artisanName}
            </span>
          )}
          {category && (
            <span className="passport-header-metadata-item">
              <span className="passport-header-metadata-icon">📂</span>
              {category}
            </span>
          )}
          {origin && (
            <span className="passport-header-metadata-item">
              <span className="passport-header-metadata-icon">📍</span>
              {origin}
            </span>
          )}
        </div>
        
        {status === 'verified' && (
          <div className="passport-header-verified-banner">
            <span className="passport-header-verified-icon">✓</span>
            Verified Authentic Product
          </div>
        )}
      </div>
    </div>
  )
}
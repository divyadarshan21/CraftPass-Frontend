import React, { useState } from 'react'
import { formatDate } from '../../../utils/formatters'
import { Button } from '../../common/Button/Button'
import './EvidenceCard.css'

export const EvidenceCard = ({
  evidence,
  onDelete,
  onView,
  showActions = true,
  size = 'md',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const {
    id,
    name,
    type,
    url,
    thumbnail,
    description,
    uploadedAt,
    uploadedBy,
    status = 'verified',
    tags = [],
  } = evidence || {}

  const getFileIcon = () => {
    if (!type) return '📄'
    if (type.startsWith('image/')) return '🖼️'
    if (type.startsWith('video/')) return '🎬'
    if (type === 'application/pdf') return '📄'
    return '📎'
  }

  const getFileColor = () => {
    if (!type) return 'muted'
    if (type.startsWith('image/')) return 'image'
    if (type.startsWith('video/')) return 'video'
    if (type === 'application/pdf') return 'pdf'
    return 'muted'
  }

  const isImage = type?.startsWith('image/')
  const isVideo = type?.startsWith('video/')

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this evidence?')) {
      onDelete(id)
    }
  }

  const renderPreview = () => {
    if (isImage && url) {
      return (
        <div className="evidence-card-preview-image">
          {!imageLoaded && <div className="evidence-card-preview-loader" />}
          <img 
            src={thumbnail || url} 
            alt={name || 'Evidence'}
            onLoad={() => setImageLoaded(true)}
            style={{ display: imageLoaded ? 'block' : 'none' }}
          />
        </div>
      )
    }

    if (isVideo && url) {
      return (
        <div className="evidence-card-preview-video">
          <video src={url} controls preload="metadata" />
        </div>
      )
    }

    return (
      <div className={`evidence-card-preview-icon ${getFileColor()}`}>
        <span>{getFileIcon()}</span>
        {type && <span className="evidence-card-preview-type">{type.split('/')[1]?.toUpperCase() || 'FILE'}</span>}
      </div>
    )
  }

  return (
    <div className={`evidence-card evidence-card-${size} ${isExpanded ? 'expanded' : ''}`}>
      <div className="evidence-card-preview">
        {renderPreview()}
      </div>

      <div className="evidence-card-content">
        <div className="evidence-card-header">
          <h4 className="evidence-card-title" title={name}>
            {name || 'Untitled Evidence'}
          </h4>
          {status && (
            <span className={`evidence-card-status ${status}`}>
              {status}
            </span>
          )}
        </div>

        {description && (
          <p className="evidence-card-description">
            {isExpanded ? description : description.slice(0, 80) + (description.length > 80 ? '...' : '')}
            {description.length > 80 && (
              <button 
                className="evidence-card-expand"
                onClick={() => setIsExpanded(prev => !prev)}
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </p>
        )}

        <div className="evidence-card-meta">
          {uploadedAt && (
            <span className="evidence-card-date">
              📅 {formatDate(uploadedAt)}
            </span>
          )}
          {uploadedBy && (
            <span className="evidence-card-uploader">
              👤 {uploadedBy}
            </span>
          )}
        </div>

        {tags.length > 0 && (
          <div className="evidence-card-tags">
            {tags.map((tag, index) => (
              <span key={index} className="evidence-card-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {showActions && (
          <div className="evidence-card-actions">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(id)}
              >
                View
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
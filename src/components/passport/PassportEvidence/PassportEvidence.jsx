import React, { useState } from 'react'
import { formatDate } from '../../../utils/formatters'
import './PassportEvidence.css'

export const PassportEvidence = ({ 
  evidence = [], 
  title = 'Supporting Evidence',
  className = '',
  maxDisplay = 6,
}) => {
  const [showAll, setShowAll] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  if (!evidence || evidence.length === 0) {
    return null
  }

  const displayEvidence = showAll ? evidence : evidence.slice(0, maxDisplay)
  const hasMore = evidence.length > maxDisplay

  const getFileIcon = (type) => {
    if (!type) return '📄'
    if (type.startsWith('image/')) return '🖼️'
    if (type.startsWith('video/')) return '🎬'
    if (type === 'application/pdf') return '📄'
    return '📎'
  }

  const getFileColor = (type) => {
    if (!type) return 'muted'
    if (type.startsWith('image/')) return 'image'
    if (type.startsWith('video/')) return 'video'
    if (type === 'application/pdf') return 'pdf'
    return 'muted'
  }

  const isImage = (item) => {
    return item.type?.startsWith('image/') || 
           (item.url && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item.url))
  }

  const isVideo = (item) => {
    return item.type?.startsWith('video/') ||
           (item.url && /\.(mp4|webm|ogg)$/i.test(item.url))
  }

  const handleItemClick = (item) => {
    if (isImage(item) && item.url) {
      setSelectedItem(item)
    } else if (item.url) {
      window.open(item.url, '_blank')
    }
  }

  const handleCloseModal = () => {
    setSelectedItem(null)
  }

  return (
    <div className={`passport-evidence ${className}`}>
      <div className="passport-evidence-header">
        <h3 className="passport-evidence-title">{title}</h3>
        <span className="passport-evidence-count">{evidence.length} items</span>
      </div>

      <div className="passport-evidence-grid">
        {displayEvidence.map((item, index) => (
          <div
            key={item.id || index}
            className={`passport-evidence-item ${getFileColor(item.type)}`}
            onClick={() => handleItemClick(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleItemClick(item)
              }
            }}
          >
            <div className="passport-evidence-item-preview">
              {isImage(item) && item.url ? (
                <img
                  src={item.thumbnail || item.url}
                  alt={item.name || 'Evidence'}
                  className="passport-evidence-item-image"
                  loading="lazy"
                />
              ) : isVideo(item) && item.url ? (
                <video
                  src={item.url}
                  className="passport-evidence-item-video"
                  muted
                  preload="metadata"
                />
              ) : (
                <div className="passport-evidence-item-icon">
                  <span className="passport-evidence-item-icon-emoji">
                    {getFileIcon(item.type)}
                  </span>
                  <span className="passport-evidence-item-icon-type">
                    {item.type?.split('/')[1]?.toUpperCase() || 'FILE'}
                  </span>
                </div>
              )}
              {isImage(item) && (
                <div className="passport-evidence-item-overlay">
                  <span className="passport-evidence-item-overlay-icon">🔍</span>
                </div>
              )}
            </div>
            <div className="passport-evidence-item-info">
              <span className="passport-evidence-item-name">
                {item.name || 'Untitled'}
              </span>
              {item.uploadedAt && (
                <span className="passport-evidence-item-date">
                  {formatDate(item.uploadedAt)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          className="passport-evidence-show-more"
          onClick={() => setShowAll(prev => !prev)}
        >
          {showAll ? 'Show less' : `Show ${evidence.length - maxDisplay} more`}
        </button>
      )}

      {/* Lightbox Modal */}
      {selectedItem && isImage(selectedItem) && (
        <div className="passport-evidence-lightbox" onClick={handleCloseModal}>
          <button
            className="passport-evidence-lightbox-close"
            onClick={handleCloseModal}
            aria-label="Close"
          >
            ✕
          </button>
          <img
            src={selectedItem.url}
            alt={selectedItem.name || 'Evidence'}
            className="passport-evidence-lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
          {selectedItem.name && (
            <div className="passport-evidence-lightbox-caption">
              {selectedItem.name}
              {selectedItem.description && (
                <span className="passport-evidence-lightbox-description">
                  {selectedItem.description}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
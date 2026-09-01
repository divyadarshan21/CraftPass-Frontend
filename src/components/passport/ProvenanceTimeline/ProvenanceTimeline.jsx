import React from 'react'
import { formatDateTime } from '../../../utils/formatters'
import './ProvenanceTimeline.css'

export const ProvenanceTimeline = ({ 
  events = [], 
  title = 'Provenance Timeline',
  className = '',
  showLabels = true,
}) => {
  if (!events || events.length === 0) {
    return null
  }

  const getEventIcon = (type) => {
    const icons = {
      creation: '🔨',
      submission: '📤',
      verification: '✅',
      review: '🔍',
      rejection: '❌',
      correction: '✏️',
      approval: '✔️',
      default: '📌',
    }
    return icons[type?.toLowerCase()] || icons.default
  }

  const getEventColor = (type) => {
    const colors = {
      creation: 'primary',
      submission: 'info',
      verification: 'success',
      review: 'warning',
      rejection: 'error',
      correction: 'warning',
      approval: 'success',
    }
    return colors[type?.toLowerCase()] || 'muted'
  }

  const getEventLabel = (type) => {
    const labels = {
      creation: 'Created',
      submission: 'Submitted for Verification',
      verification: 'Verified',
      review: 'Under Review',
      rejection: 'Rejected',
      correction: 'Correction Requested',
      approval: 'Approved',
    }
    return labels[type?.toLowerCase()] || type || 'Event'
  }

  return (
    <div className={`provenance-timeline ${className}`}>
      <div className="provenance-timeline-header">
        <h3 className="provenance-timeline-title">{title}</h3>
        <span className="provenance-timeline-count">{events.length} events</span>
      </div>

      <div className="provenance-timeline-list">
        {events.map((event, index) => {
          const isLast = index === events.length - 1
          const icon = event.icon || getEventIcon(event.type)
          const color = getEventColor(event.type)
          const label = event.label || getEventLabel(event.type)

          return (
            <div 
              key={event.id || index} 
              className={`provenance-timeline-item ${color} ${isLast ? 'last' : ''}`}
            >
              <div className="provenance-timeline-item-marker">
                <span className="provenance-timeline-item-icon">{icon}</span>
                {!isLast && <div className="provenance-timeline-item-line" />}
              </div>

              <div className="provenance-timeline-item-content">
                <div className="provenance-timeline-item-header">
                  <span className="provenance-timeline-item-label">{label}</span>
                  {event.date && (
                    <span className="provenance-timeline-item-date">
                      {formatDateTime(event.date)}
                    </span>
                  )}
                </div>

                {event.description && (
                  <p className="provenance-timeline-item-description">
                    {event.description}
                  </p>
                )}

                {event.details && (
                  <div className="provenance-timeline-item-details">
                    {Object.entries(event.details).map(([key, value]) => (
                      <span key={key} className="provenance-timeline-item-detail">
                        <span className="provenance-timeline-item-detail-key">{key}:</span>
                        <span className="provenance-timeline-item-detail-value">{value}</span>
                      </span>
                    ))}
                  </div>
                )}

                {showLabels && event.status && (
                  <div className="provenance-timeline-item-status">
                    <span className={`provenance-timeline-item-status-badge ${event.status.toLowerCase()}`}>
                      {event.status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
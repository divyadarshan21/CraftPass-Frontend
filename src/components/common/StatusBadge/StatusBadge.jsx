import React from 'react'
import {
  PRODUCT_STATUS,
  PRODUCT_STATUS_LABELS,
  PRODUCT_STATUS_COLORS,
  PRODUCT_STATUS_ICONS,
} from '../../../utils/constants'
import './StatusBadge.css'

export const StatusBadge = ({ status, size = 'md', className = '' }) => {
  const statusKey = status?.toUpperCase() || 'DRAFT'
  const label = PRODUCT_STATUS_LABELS[statusKey] || status
  const color = PRODUCT_STATUS_COLORS[statusKey] || '#8A8277'
  const icon = PRODUCT_STATUS_ICONS[statusKey] || '📄'

  // Map status to CSS class
  const getStatusClass = () => {
    switch (statusKey) {
      case 'VERIFIED':
        return 'success'
      case 'PENDING_VERIFICATION':
        return 'warning'
      case 'REJECTED':
        return 'error'
      case 'CORRECTION_REQUIRED':
        return 'correction'
      default:
        return 'muted'
    }
  }

  return (
    <span 
      className={`status-badge ${getStatusClass()} ${size} ${className}`}
      style={{ '--status-color': color }}
    >
      <span className="status-badge-icon">{icon}</span>
      {label}
    </span>
  )
}
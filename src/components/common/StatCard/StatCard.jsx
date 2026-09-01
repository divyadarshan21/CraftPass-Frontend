import React from 'react'
import './StatCard.css'

export const StatCard = ({ label, value, icon, color = 'default', className = '' }) => {
  return (
    <div className={`stat-card stat-card-${color} ${className}`}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-content">
        <span className="stat-card-label">{label}</span>
        <span className="stat-card-value">{value}</span>
      </div>
    </div>
  )
}
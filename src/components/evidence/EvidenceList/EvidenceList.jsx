import React, { useState } from 'react'
import { EvidenceCard } from '../EvidenceCard/EvidenceCard'
import { EmptyState } from '../../common/EmptyState/EmptyState'
import { Loader } from '../../common/Loader/Loader'
import { Button } from '../../common/Button/Button'
import './EvidenceList.css'

export const EvidenceList = ({
  evidence = [],
  loading = false,
  onDelete,
  onView,
  onUpload,
  title = 'Evidence',
  emptyMessage = 'No evidence uploaded yet',
  emptyActionText = 'Upload Evidence',
  showActions = true,
  cardSize = 'md',
  layout = 'grid',
  sortBy = 'uploadedAt',
  sortOrder = 'desc',
}) => {
  const [viewMode, setViewMode] = useState(layout)
  const [selectedEvidence, setSelectedEvidence] = useState(null)

  const sortedEvidence = [...evidence].sort((a, b) => {
    const aVal = a[sortBy] || ''
    const bVal = b[sortBy] || ''
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1
    }
    return aVal < bVal ? 1 : -1
  })

  const handleSelect = (id) => {
    setSelectedEvidence(selectedEvidence === id ? null : id)
  }

  if (loading) {
    return (
      <div className="evidence-list-loading">
        <Loader message="Loading evidence..." />
      </div>
    )
  }

  if (!evidence || evidence.length === 0) {
    return (
      <div className="evidence-list-empty">
        <EmptyState
          title={emptyMessage}
          description="Upload supporting evidence for your product verification."
          icon="📎"
          actionText={emptyActionText}
          onAction={onUpload}
        />
      </div>
    )
  }

  return (
    <div className="evidence-list">
      <div className="evidence-list-header">
        <div className="evidence-list-header-left">
          <h3>{title}</h3>
          <span className="evidence-list-count">{evidence.length} items</span>
        </div>
        <div className="evidence-list-header-right">
          <div className="evidence-list-view-toggle">
            <button
              className={`evidence-list-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              ⊞
            </button>
            <button
              className={`evidence-list-view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              ☰
            </button>
          </div>
          {onUpload && (
            <Button variant="primary" size="sm" onClick={onUpload}>
              + Upload
            </Button>
          )}
        </div>
      </div>

      <div className={`evidence-list-content evidence-list-${viewMode}`}>
        {sortedEvidence.map((item) => (
          <div key={item.id} className="evidence-list-item">
            <EvidenceCard
              evidence={item}
              onDelete={onDelete}
              onView={onView}
              showActions={showActions}
              size={cardSize}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
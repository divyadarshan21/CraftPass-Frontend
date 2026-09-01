import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../../common/StatusBadge/StatusBadge'
import { EmptyState } from '../../common/EmptyState/EmptyState'
import { formatDate, formatDateTime } from '../../../utils/formatters'
import './VerificationHistory.css'

export const VerificationHistory = ({
  items = [],
  className = '',
  itemsPerPage = 10,
  showFilters = true,
  onRefresh,
}) => {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredItems = useMemo(() => {
    let result = items

    if (filter !== 'all') {
      result = result.filter(item => 
        item.status?.toLowerCase() === filter.toLowerCase() ||
        item.decision?.toLowerCase() === filter.toLowerCase()
      )
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(item =>
        item.name?.toLowerCase().includes(term) ||
        item.artisanName?.toLowerCase().includes(term) ||
        item.id?.toLowerCase().includes(term)
      )
    }

    return result
  }, [items, filter, searchTerm])

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (!items || items.length === 0) {
    return (
      <EmptyState
        title="No verification history"
        description="Products you've verified will appear here."
        icon="📋"
        actionText="Review Queue"
        onAction={onRefresh}
      />
    )
  }

  return (
    <div className={`verification-history ${className}`}>
      {showFilters && (
        <div className="verification-history-toolbar">
          <div className="verification-history-filters">
            <button
              className={`verification-history-filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({items.length})
            </button>
            <button
              className={`verification-history-filter-btn ${filter === 'verified' ? 'active' : ''}`}
              onClick={() => setFilter('verified')}
            >
              Verified ({items.filter(i => i.status === 'verified' || i.decision === 'approve').length})
            </button>
            <button
              className={`verification-history-filter-btn ${filter === 'rejected' ? 'active' : ''}`}
              onClick={() => setFilter('rejected')}
            >
              Rejected ({items.filter(i => i.status === 'rejected' || i.decision === 'reject').length})
            </button>
            <button
              className={`verification-history-filter-btn ${filter === 'changes' ? 'active' : ''}`}
              onClick={() => setFilter('changes')}
            >
              Changes Requested ({items.filter(i => i.decision === 'changes').length})
            </button>
          </div>

          <div className="verification-history-search">
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="verification-history-search-input"
            />
            <span className="verification-history-search-icon">🔍</span>
          </div>
        </div>
      )}

      <div className="verification-history-list">
        {paginatedItems.map((item) => (
          <div key={item.id} className="verification-history-item">
            <div className="verification-history-item-header">
              <div className="verification-history-item-product">
                <img
                  src={item.image || '/assets/images/placeholders/product-placeholder.png'}
                  alt={item.name}
                  className="verification-history-item-thumbnail"
                  onError={(e) => {
                    e.target.src = '/assets/images/placeholders/product-placeholder.png'
                  }}
                />
                <div className="verification-history-item-details">
                  <Link to={`/verifier/submissions/${item.id}`} className="verification-history-item-name">
                    {item.name || 'Untitled'}
                  </Link>
                  <div className="verification-history-item-meta">
                    <span className="verification-history-item-artisan">
                      👤 {item.artisanName || 'Unknown Artisan'}
                    </span>
                    <span className="verification-history-item-id">
                      #{item.id?.slice(0, 8)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="verification-history-item-status">
                {item.decision ? (
                  <span className={`verification-history-item-decision ${item.decision}`}>
                    {item.decision === 'approve' ? '✅ Approved' :
                     item.decision === 'reject' ? '❌ Rejected' :
                     '✏️ Changes Requested'}
                  </span>
                ) : (
                  <StatusBadge status={item.status} size="sm" />
                )}
              </div>
            </div>

            <div className="verification-history-item-body">
              {item.category && (
                <span className="verification-history-item-category">
                  📂 {item.category}
                </span>
              )}
              {item.verifiedAt && (
                <span className="verification-history-item-date">
                  ✅ Verified {formatDate(item.verifiedAt)}
                </span>
              )}
              {item.reviewedAt && (
                <span className="verification-history-item-date">
                  📋 Reviewed {formatDate(item.reviewedAt)}
                </span>
              )}
              {item.feedback && (
                <div className="verification-history-item-feedback">
                  <span className="verification-history-item-feedback-label">Feedback:</span>
                  <span className="verification-history-item-feedback-text">{item.feedback}</span>
                </div>
              )}
              {item.rejectionReason && (
                <div className="verification-history-item-rejection">
                  <span className="verification-history-item-rejection-label">Reason:</span>
                  <span className="verification-history-item-rejection-text">{item.rejectionReason}</span>
                </div>
              )}
            </div>

            <div className="verification-history-item-footer">
              <span className="verification-history-item-reviewer">
                Reviewed by {item.reviewerName || 'Unknown'}
              </span>
              <span className="verification-history-item-time">
                {item.reviewedAt ? formatDateTime(item.reviewedAt) : 'N/A'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="verification-history-pagination">
          <button
            className="verification-history-pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          <span className="verification-history-pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="verification-history-pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
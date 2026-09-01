import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../../common/StatusBadge/StatusBadge'
import { Button } from '../../common/Button/Button'
import { EmptyState } from '../../common/EmptyState/EmptyState'
import { formatDate } from '../../../utils/formatters'
import { PRODUCT_STATUS } from '../../../utils/constants'
import './VerificationQueue.css'

export const VerificationQueue = ({
  items = [],
  onSelect,
  onRefresh,
  loading = false,
  className = '',
  showFilters = true,
  itemsPerPage = 10,
}) => {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredItems = useMemo(() => {
    let result = items

    if (filter !== 'all') {
      result = result.filter(item => 
        item.status?.toLowerCase() === filter.toLowerCase()
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

  const getStatusCount = (status) => {
    if (status === 'all') return items.length
    return items.filter(i => i.status === status).length
  }

  if (loading) {
    return (
      <div className="verification-queue-loading">
        <div className="verification-queue-loading-spinner" />
        <p>Loading queue...</p>
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <EmptyState
        title="Queue is empty"
        description="No products pending verification at this time."
        icon="✅"
        actionText="Refresh"
        onAction={onRefresh}
      />
    )
  }

  return (
    <div className={`verification-queue ${className}`}>
      {showFilters && (
        <div className="verification-queue-toolbar">
          <div className="verification-queue-filters">
            <button
              className={`verification-queue-filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({getStatusCount('all')})
            </button>
            <button
              className={`verification-queue-filter-btn ${filter === 'PENDING_VERIFICATION' ? 'active' : ''}`}
              onClick={() => setFilter('PENDING_VERIFICATION')}
            >
              Pending ({getStatusCount('PENDING_VERIFICATION')})
            </button>
          </div>

          <div className="verification-queue-search">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="verification-queue-search-input"
            />
            <span className="verification-queue-search-icon">🔍</span>
          </div>

          {onRefresh && (
            <Button variant="ghost" size="sm" onClick={onRefresh}>
              🔄 Refresh
            </Button>
          )}
        </div>
      )}

      <div className="verification-queue-list">
        {paginatedItems.map((item) => (
          <div
            key={item.id}
            className="verification-queue-item"
            onClick={() => onSelect?.(item.id)}
            role="button"
            tabIndex={0}
          >
            <div className="verification-queue-item-header">
              <div className="verification-queue-item-info">
                <div className="verification-queue-item-product">
                  <img
                    src={item.image || '/assets/images/placeholders/product-placeholder.png'}
                    alt={item.name}
                    className="verification-queue-item-thumbnail"
                    onError={(e) => {
                      e.target.src = '/assets/images/placeholders/product-placeholder.png'
                    }}
                  />
                  <div className="verification-queue-item-details">
                    <h4 className="verification-queue-item-name">{item.name || 'Untitled'}</h4>
                    <div className="verification-queue-item-meta">
                      <span className="verification-queue-item-artisan">
                        👤 {item.artisanName || 'Unknown Artisan'}
                      </span>
                      <span className="verification-queue-item-id">
                        #{item.id?.slice(0, 8)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="verification-queue-item-badges">
                <StatusBadge status={item.status} size="sm" />
              </div>
            </div>

            <div className="verification-queue-item-body">
              {item.craft && (
                <span className="verification-queue-item-category">
                  🎨 {item.craft}
                </span>
              )}
              {item.origin && (
                <span className="verification-queue-item-origin">
                  📍 {item.origin}
                </span>
              )}
              {item.submittedAt && (
                <span className="verification-queue-item-date">
                  📅 Submitted {formatDate(item.submittedAt)}
                </span>
              )}
              {item.evidenceCount !== undefined && (
                <span className="verification-queue-item-evidence">
                  📎 {item.evidenceCount} evidence items
                </span>
              )}
            </div>

            <div className="verification-queue-item-actions">
              <Link to={`/verifier/submissions/${item.id}`}>
                <Button variant="primary" size="sm">
                  Review
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="verification-queue-pagination">
          <button
            className="verification-queue-pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          <span className="verification-queue-pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="verification-queue-pagination-btn"
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
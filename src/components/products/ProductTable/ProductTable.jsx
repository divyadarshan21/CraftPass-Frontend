import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../../common/StatusBadge/StatusBadge'
import { Button } from '../../common/Button/Button'
import { EmptyState } from '../../common/EmptyState/EmptyState'
import { formatDate } from '../../../utils/formatters'
import './ProductTable.css'

export const ProductTable = ({
  products = [],
  onDelete,
  onEdit,
  onStatusChange,
  showActions = true,
  className = '',
  itemsPerPage = 10,
  searchable = true,
  sortable = true,
  onRowClick,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products
    return products.filter(product =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.artisanName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [products, searchTerm])

  const sortedProducts = useMemo(() => {
    if (!sortable) return filteredProducts
    return [...filteredProducts].sort((a, b) => {
      const aVal = a[sortField] || ''
      const bVal = b[sortField] || ''
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredProducts, sortField, sortDirection, sortable])

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSort = (field) => {
    if (!sortable) return
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleDelete = (id, e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this product?')) {
      onDelete(id)
    }
  }

  const handleEdit = (id, e) => {
    e.stopPropagation()
    onEdit(id)
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="Start by adding your first product."
        icon="📦"
        actionText="Add Product"
        onAction={() => window.location.href = '/artisan/products/new'}
      />
    )
  }

  return (
    <div className={`product-table-wrapper ${className}`}>
      {searchable && (
        <div className="product-table-toolbar">
          <div className="product-table-search">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="product-table-search-input"
            />
            <span className="product-table-search-icon">🔍</span>
          </div>
          <span className="product-table-count">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className={sortField === 'name' ? 'active' : ''}>
                Product
                {sortable && <span className="product-table-sort-icon">
                  {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
                </span>}
              </th>
              <th onClick={() => handleSort('category')} className={sortField === 'category' ? 'active' : ''}>
                Category
                {sortable && <span className="product-table-sort-icon">
                  {sortField === 'category' && (sortDirection === 'asc' ? '▲' : '▼')}
                </span>}
              </th>
              <th onClick={() => handleSort('status')} className={sortField === 'status' ? 'active' : ''}>
                Status
                {sortable && <span className="product-table-sort-icon">
                  {sortField === 'status' && (sortDirection === 'asc' ? '▲' : '▼')}
                </span>}
              </th>
              <th onClick={() => handleSort('createdAt')} className={sortField === 'createdAt' ? 'active' : ''}>
                Date
                {sortable && <span className="product-table-sort-icon">
                  {sortField === 'createdAt' && (sortDirection === 'asc' ? '▲' : '▼')}
                </span>}
              </th>
              {showActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr 
                key={product.id} 
                className="product-table-row"
                onClick={() => onRowClick?.(product.id)}
              >
                <td>
                  <div className="product-table-cell-product">
                    <img
                      src={product.image || '/assets/images/placeholders/product-placeholder.png'}
                      alt={product.name}
                      className="product-table-thumbnail"
                      onError={(e) => {
                        e.target.src = '/assets/images/placeholders/product-placeholder.png'
                      }}
                    />
                    <div className="product-table-cell-product-info">
                      <Link to={`/artisan/products/${product.id}`} className="product-table-name">
                        {product.name || 'Untitled'}
                      </Link>
                      {product.artisanName && (
                        <span className="product-table-artisan">By {product.artisanName}</span>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  {product.category && (
                    <span className="product-table-category">{product.category}</span>
                  )}
                </td>
                <td>
                  <StatusBadge status={product.status} size="sm" />
                </td>
                <td>
                  <span className="product-table-date">
                    {formatDate(product.createdAt)}
                  </span>
                </td>
                {showActions && (
                  <td>
                    <div className="product-table-actions">
                      {onEdit && (
                        <button
                          className="product-table-action edit"
                          onClick={(e) => handleEdit(product.id, e)}
                          aria-label="Edit product"
                          title="Edit"
                        >
                          ✏️
                        </button>
                      )}
                      {onStatusChange && product.status === 'pending' && (
                        <button
                          className="product-table-action verify"
                          onClick={(e) => {
                            e.stopPropagation()
                            onStatusChange(product.id, 'verified')
                          }}
                          aria-label="Verify product"
                          title="Verify"
                        >
                          ✅
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className="product-table-action delete"
                          onClick={(e) => handleDelete(product.id, e)}
                          aria-label="Delete product"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="product-table-pagination">
          <button
            className="product-table-pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          <div className="product-table-pagination-pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`product-table-pagination-btn ${page === currentPage ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            className="product-table-pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
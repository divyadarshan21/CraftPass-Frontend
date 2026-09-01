import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Input } from '../../../components/common/Input/Input'
import { Select } from '../../../components/common/Select/Select'
import { Button } from '../../../components/common/Button/Button'
import { StatusBadge } from '../../../components/common/StatusBadge/StatusBadge'
import { EmptyState } from '../../../components/common/EmptyState/EmptyState'
import { Loader } from '../../../components/common/Loader/Loader'
import { productApi } from '../../../services/productApi'
import './Search.css'

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'textile', label: 'Textile' },
  { value: 'metal', label: 'Metal Craft' },
  { value: 'painting', label: 'Painting' },
  { value: 'pottery', label: 'Pottery' },
  { value: 'woodwork', label: 'Woodwork' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'leather', label: 'Leather Craft' },
  { value: 'paper', label: 'Paper Craft' },
  { value: 'glass', label: 'Glass Art' },
  { value: 'other', label: 'Other' },
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'verified', label: 'Verified' },
  { value: 'pending', label: 'Pending' },
  { value: 'rejected', label: 'Rejected' },
]

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
]

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [status, setStatus] = useState(searchParams.get('status') || 'all')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recent')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    // Initial search from URL params
    if (searchParams.get('q')) {
      handleSearch()
    }
  }, [])

  const handleSearch = async (page = 1) => {
    setLoading(true)
    setCurrentPage(page)

    try {
      const params = {
        q: searchTerm,
        category: category !== 'all' ? category : undefined,
        status: status !== 'all' ? status : undefined,
        sort: sortBy,
        page,
        limit: 12,
      }

      const response = await productApi.search(params)
      setResults(response.data || [])
      setTotalResults(response.total || 0)
      setTotalPages(Math.ceil((response.total || 0) / 12))

      // Update URL params
      const urlParams = new URLSearchParams()
      if (searchTerm) urlParams.set('q', searchTerm)
      if (category !== 'all') urlParams.set('category', category)
      if (status !== 'all') urlParams.set('status', status)
      if (sortBy !== 'recent') urlParams.set('sort', sortBy)
      if (page > 1) urlParams.set('page', page)
      setSearchParams(urlParams)
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
      setTotalResults(0)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(1)
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setCategory('all')
    setStatus('all')
    setSortBy('recent')
    handleSearch(1)
  }

  return (
    <div className="search-page">
      <div className="search-header">
        <div className="container">
          <h1>Search Products</h1>
          <p>Find and verify authentic artisan products</p>
        </div>
      </div>

      <div className="search-filters container">
        <div className="search-bar">
          <Input
            type="text"
            placeholder="Search by product name, artisan, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            icon={() => <span>🔍</span>}
          />
          <Button variant="primary" onClick={() => handleSearch(1)} loading={loading}>
            Search
          </Button>
        </div>

        <div className="search-filter-options">
          <Select
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={setCategory}
            placeholder="Category"
          />
          <Select
            options={STATUS_OPTIONS}
            value={status}
            onChange={setStatus}
            placeholder="Status"
          />
          <Select
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by"
          />
          <Button variant="ghost" onClick={clearFilters} disabled={loading}>
            Clear Filters
          </Button>
        </div>
      </div>

      <div className="search-results container">
        {loading ? (
          <div className="search-loading">
            <Loader message="Searching..." />
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="search-result-header">
              <p className="search-result-count">
                Found {totalResults} product{totalResults !== 1 ? 's' : ''}
              </p>
              {totalResults > 0 && (
                <span className="search-result-page">
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>

            <div className="search-results-grid">
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/passport/${product.id}`}
                  className="search-result-card"
                >
                  <div className="search-result-image">
                    <img
                      src={product.image || '/assets/images/placeholders/product-placeholder.png'}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/assets/images/placeholders/product-placeholder.png'
                      }}
                    />
                    <StatusBadge status={product.status} />
                  </div>
                  <div className="search-result-info">
                    <h3>{product.name || 'Untitled'}</h3>
                    <p className="search-result-artisan">By {product.artisanName || 'Unknown Artisan'}</p>
                    <span className="search-result-category">{product.category || 'Craft'}</span>
                    {product.price && (
                      <span className="search-result-price">${product.price}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="search-pagination">
                <button
                  className="search-pagination-btn"
                  onClick={() => handleSearch(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || loading}
                >
                  ← Previous
                </button>
                <div className="search-pagination-pages">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    return (
                      <button
                        key={pageNum}
                        className={`search-pagination-btn ${pageNum === currentPage ? 'active' : ''}`}
                        onClick={() => handleSearch(pageNum)}
                        disabled={loading}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                <button
                  className="search-pagination-btn"
                  onClick={() => handleSearch(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages || loading}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : searchTerm || category !== 'all' || status !== 'all' ? (
          <EmptyState
            title="No products found"
            description="Try adjusting your search terms or filters to find what you're looking for."
            icon="🔍"
            actionText="Clear Filters"
            onAction={clearFilters}
          />
        ) : (
          <EmptyState
            title="Start Searching"
            description="Enter a search term to find authentic artisan products."
            icon="🔍"
          />
        )}
      </div>
    </div>
  )
}
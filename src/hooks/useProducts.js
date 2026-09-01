import { useState, useCallback, useEffect } from 'react'
import { productApi } from '../services/productApi'
import toast from 'react-hot-toast'

/**
 * Custom hook for product management
 * @param {Object} options - Configuration options
 * @param {number} options.initialPage - Initial page number
 * @param {number} options.initialLimit - Items per page
 * @param {Object} options.initialFilters - Initial filter values
 * @param {boolean} options.autoFetch - Auto-fetch on mount
 * @returns {Object} Product management methods and state
 */
export const useProducts = (options = {}) => {
  const {
    initialPage = 1,
    initialLimit = 10,
    initialFilters = {},
    autoFetch = true,
  } = options

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [filters, setFilters] = useState(initialFilters)
  const [selectedProduct, setSelectedProduct] = useState(null)

  /**
   * Fetch products with current filters
   * @param {Object} params - Additional query parameters
   * @returns {Promise<Array>} Array of products
   */
  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      const queryParams = {
        page,
        limit,
        ...filters,
        ...params,
      }
      
      const response = await productApi.list(queryParams)
      const data = response.data || []
      setProducts(data)
      setTotal(response.total || 0)
      setTotalPages(Math.ceil((response.total || 0) / limit))
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch products'
      setError(message)
      toast.error(message)
      return []
    } finally {
      setLoading(false)
    }
  }, [page, limit, filters])

  /**
   * Fetch single product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Product data
   */
  const fetchProduct = useCallback(async (id) => {
    if (!id) {
      setError('Product ID is required')
      return null
    }

    try {
      setLoading(true)
      setError(null)
      const response = await productApi.get(id)
      setSelectedProduct(response.data)
      return response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch product'
      setError(message)
      toast.error(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Create a new product
   * @param {Object} data - Product data
   * @returns {Promise<Object>} Created product
   */
  const createProduct = useCallback(async (data) => {
    try {
      setLoading(true)
      setError(null)
      const response = await productApi.create(data)
      toast.success('Product created successfully!')
      await fetchProducts()
      return response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create product'
      setError(message)
      toast.error(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [fetchProducts])

  /**
   * Update an existing product
   * @param {string} id - Product ID
   * @param {Object} data - Updated product data
   * @returns {Promise<Object>} Updated product
   */
  const updateProduct = useCallback(async (id, data) => {
    if (!id) {
      toast.error('Product ID is required')
      return null
    }

    try {
      setLoading(true)
      setError(null)
      const response = await productApi.update(id, data)
      toast.success('Product updated successfully!')
      await fetchProducts()
      if (selectedProduct?.id === id) {
        setSelectedProduct(response.data)
      }
      return response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update product'
      setError(message)
      toast.error(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [fetchProducts, selectedProduct])

  /**
   * Delete a product
   * @param {string} id - Product ID
   * @returns {Promise<boolean>} Success status
   */
  const deleteProduct = useCallback(async (id) => {
    if (!id) {
      toast.error('Product ID is required')
      return false
    }

    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return false
    }

    try {
      setLoading(true)
      setError(null)
      await productApi.delete(id)
      toast.success('Product deleted successfully!')
      await fetchProducts()
      if (selectedProduct?.id === id) {
        setSelectedProduct(null)
      }
      return true
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete product'
      setError(message)
      toast.error(message)
      return false
    } finally {
      setLoading(false)
    }
  }, [fetchProducts, selectedProduct])

  /**
   * Update product status
   * @param {string} id - Product ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated product
   */
  const updateStatus = useCallback(async (id, status) => {
    if (!id) {
      toast.error('Product ID is required')
      return null
    }

    const validStatuses = ['draft', 'pending', 'verified', 'rejected']
    if (!validStatuses.includes(status)) {
      toast.error(`Invalid status: ${status}`)
      return null
    }

    try {
      setLoading(true)
      setError(null)
      const response = await productApi.update(id, { status })
      toast.success(`Product status updated to ${status}`)
      await fetchProducts()
      if (selectedProduct?.id === id) {
        setSelectedProduct(response.data)
      }
      return response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update status'
      setError(message)
      toast.error(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [fetchProducts, selectedProduct])

  /**
   * Search products
   * @param {string|Object} query - Search query or query object
   * @returns {Promise<Array>} Search results
   */
  const searchProducts = useCallback(async (query) => {
    if (!query) {
      toast.error('Search query is required')
      return []
    }

    try {
      setLoading(true)
      setError(null)
      const response = await productApi.search(query)
      return response.data || []
    } catch (err) {
      const message = err.response?.data?.message || 'Search failed'
      setError(message)
      toast.error(message)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Go to specific page
   * @param {number} newPage - Page number
   */
  const goToPage = useCallback((newPage) => {
    if (newPage < 1 || (totalPages > 0 && newPage > totalPages)) {
      return
    }
    setPage(newPage)
  }, [totalPages])

  /**
   * Update filters
   * @param {Object} newFilters - New filter values
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setPage(1)
  }, [])

  /**
   * Reset all filters
   */
  const resetFilters = useCallback(() => {
    setFilters({})
    setPage(1)
  }, [])

  /**
   * Reset all product state
   */
  const resetProducts = useCallback(() => {
    setProducts([])
    setSelectedProduct(null)
    setError(null)
    setTotal(0)
    setTotalPages(0)
  }, [])

  // Auto-fetch on mount or when page/filter changes
  useEffect(() => {
    if (autoFetch) {
      fetchProducts()
    }
  }, [fetchProducts, autoFetch])

  return {
    products,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    filters,
    selectedProduct,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStatus,
    searchProducts,
    goToPage,
    updateFilters,
    resetFilters,
    resetProducts,
    setSelectedProduct,
    setLimit,
  }
}
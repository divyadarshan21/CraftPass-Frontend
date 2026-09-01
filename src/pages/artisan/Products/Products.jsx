import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader'
import { Button } from '../../../components/common/Button/Button'
import { ProductTable } from '../../../components/products/ProductTable/ProductTable'
import { ProductCard } from '../../../components/products/ProductCard/ProductCard'
import { Loader } from '../../../components/common/Loader/Loader'
import { EmptyState } from '../../../components/common/EmptyState/EmptyState'
import { productApi } from '../../../services/productApi'
import toast from 'react-hot-toast'
import './Products.css'

export const Products = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('table') // 'table' | 'grid'
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productApi.list()
      setProducts(response.data || [])
      setError(null)
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await productApi.delete(id)
      toast.success('Product deleted successfully')
      await fetchProducts()
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete product'
      toast.error(message)
    }
  }

  const handleEdit = (id) => {
    navigate(`/artisan/products/${id}/edit`)
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await productApi.update(id, { status: newStatus })
      toast.success(`Product status updated to ${newStatus}`)
      await fetchProducts()
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update status'
      toast.error(message)
    }
  }

  if (loading) {
    return <Loader fullPage message="Loading products..." />
  }

  if (error) {
    return (
      <div className="products-error">
        <span className="products-error-icon">⚠️</span>
        <h3>Failed to Load Products</h3>
        <p>{error}</p>
        <Button onClick={fetchProducts}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="products-page">
      <PageHeader
        title="My Products"
        subtitle={`${products.length} product${products.length !== 1 ? 's' : ''} total`}
        actions={
          <div className="products-page-actions">
            <div className="products-view-toggle">
              <button
                className={`products-view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                aria-label="Table view"
              >
                ☰
              </button>
              <button
                className={`products-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                ⊞
              </button>
            </div>
            <Link to="/artisan/products/new">
              <Button variant="accent">+ Add Product</Button>
            </Link>
          </div>
        }
      />

      {products.length > 0 ? (
        viewMode === 'table' ? (
          <ProductTable
            products={products}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDelete}
                onEdit={handleEdit}
                showActions={true}
              />
            ))}
          </div>
        )
      ) : (
        <EmptyState
          title="No products added yet"
          description="Start by creating your first product listing."
          icon="📦"
          actionText="Add Product"
          onAction={() => navigate('/artisan/products/new')}
        />
      )}
    </div>
  )
}
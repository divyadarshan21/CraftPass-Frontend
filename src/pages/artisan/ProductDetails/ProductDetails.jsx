import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader'
import { ProductDetails as ProductDetailsComponent } from '../../../components/products/ProductDetails/ProductDetails'
import { Loader } from '../../../components/common/Loader/Loader'
import { Button } from '../../../components/common/Button/Button'
import { productApi } from '../../../services/productApi'
import { evidenceApi } from '../../../services/evidenceApi'
import toast from 'react-hot-toast'
import './ProductDetails.css'

export const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await productApi.get(id)
      setProduct(response.data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch product:', err)
      setError('Product not found or unavailable')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId) => {
    try {
      await productApi.delete(productId)
      toast.success('Product deleted successfully')
      navigate('/artisan/products')
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete product'
      toast.error(message)
    }
  }

  const handleEdit = (productId) => {
    navigate(`/artisan/products/${productId}/edit`)
  }

  const handleStatusChange = async (productId, newStatus) => {
    try {
      await productApi.update(productId, { status: newStatus })
      toast.success(`Product status updated to ${newStatus}`)
      await fetchProduct()
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update status'
      toast.error(message)
    }
  }

  if (loading) {
    return <Loader fullPage message="Loading product details..." />
  }

  if (error || !product) {
    return (
      <div className="product-details-error">
        <span className="product-details-error-icon">⚠️</span>
        <h3>Product Not Found</h3>
        <p>{error || 'The product you are looking for does not exist.'}</p>
        <Button onClick={() => navigate('/artisan/products')}>
          Back to Products
        </Button>
      </div>
    )
  }

  return (
    <div className="product-details-page">
      <PageHeader
        title={product.name || 'Product Details'}
        subtitle={`ID: ${product.id?.slice(0, 8)}`}
        actions={
          <div className="product-details-page-actions">
            <Link to={`/artisan/evidence?productId=${product.id}`}>
              <Button variant="outline" size="sm">
                📎 Manage Evidence
              </Button>
            </Link>
            <Link to={`/passport/${product.id}`}>
              <Button variant="outline" size="sm">
                📋 View Passport
              </Button>
            </Link>
          </div>
        }
      />

      <ProductDetailsComponent
        product={product}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
        showActions={true}
        showFullDescription={true}
      />
    </div>
  )
}
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader'
import { ProductForm } from '../../../components/products/ProductForm/ProductForm'
import { Button } from '../../../components/common/Button/Button'
import { productApi } from '../../../services/productApi'
import toast from 'react-hot-toast'
import './AddProduct.css'

export const AddProduct = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      // Prepare data for API
      const data = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        artisanName: formData.artisanName,
        origin: formData.origin,
        price: parseFloat(formData.price) || 0,
        materials: formData.materials,
        dimensions: formData.dimensions,
        weight: formData.weight,
        tags: formData.tags,
        status: 'draft',
      }

      // If there's an image file, upload it separately or include in form data
      const response = await productApi.create(data)
      
      // If there's an image, upload it
      if (formData.image && typeof formData.image === 'object') {
        // Handle image upload separately if needed
        // For now, we'll assume the API handles it
      }

      toast.success('Product created successfully!')
      navigate(`/artisan/products/${response.data.id}`)
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create product'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Your changes will not be saved.')) {
      navigate('/artisan/products')
    }
  }

  return (
    <div className="add-product-page">
      <PageHeader
        title="Add New Product"
        subtitle="Fill in the details to create a new product listing"
        actions={
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
        }
      />

      <ProductForm
        onSubmit={handleSubmit}
        loading={loading}
        onCancel={handleCancel}
      />
    </div>
  )
}
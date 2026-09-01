import React, { useState, useRef } from 'react'
import { Input } from '../../common/Input/Input'
import { Select } from '../../common/Select/Select'
import { Button } from '../../common/Button/Button'
import { FileUploader } from '../../evidence/EvidenceUploader/EvidenceUploader'
import './ProductForm.css'

const CATEGORY_OPTIONS = [
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
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'verified', label: 'Verified' },
  { value: 'rejected', label: 'Rejected' },
]

export const ProductForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
  showStatus = false,
  className = '',
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    category: initialData.category || '',
    description: initialData.description || '',
    artisanName: initialData.artisanName || '',
    origin: initialData.origin || '',
    price: initialData.price || '',
    materials: initialData.materials || '',
    dimensions: initialData.dimensions || '',
    weight: initialData.weight || '',
    status: initialData.status || 'draft',
    tags: initialData.tags || [],
    ...initialData,
  })

  const [errors, setErrors] = useState({})
  const [tagInput, setTagInput] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(initialData.image || null)
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageUpload = (files) => {
    if (files.length > 0) {
      const file = files[0]
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageRemove = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAddTag = () => {
    const tag = tagInput.trim()
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name?.trim()) {
      newErrors.name = 'Product name is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const submitData = {
      ...formData,
      image: imageFile || formData.image,
    }

    onSubmit(submitData)
  }

  return (
    <form className={`product-form ${className}`} onSubmit={handleSubmit}>
      <div className="product-form-grid">
        <div className="product-form-main">
          {/* Basic Information */}
          <div className="product-form-section">
            <h4 className="product-form-section-title">Basic Information</h4>
            
            <Input
              label="Product Name"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

            <Select
              label="Category"
              name="category"
              options={CATEGORY_OPTIONS}
              value={formData.category}
              onChange={(value) => handleSelectChange('category', value)}
              error={errors.category}
              required
            />

            <div className="product-form-row">
              <Input
                label="Artisan Name"
                name="artisanName"
                placeholder="Enter artisan name"
                value={formData.artisanName}
                onChange={handleChange}
              />
              <Input
                label="Origin"
                name="origin"
                placeholder="e.g., Odisha, India"
                value={formData.origin}
                onChange={handleChange}
              />
            </div>

            <div className="product-form-row">
              <Input
                label="Price"
                name="price"
                type="number"
                placeholder="Enter price (optional)"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
              />
              <Input
                label="Weight"
                name="weight"
                placeholder="e.g., 2.5 kg"
                value={formData.weight}
                onChange={handleChange}
              />
            </div>

            <div className="product-form-row">
              <Input
                label="Materials"
                name="materials"
                placeholder="e.g., Cotton, Silk"
                value={formData.materials}
                onChange={handleChange}
              />
              <Input
                label="Dimensions"
                name="dimensions"
                placeholder="e.g., 36 x 44 inches"
                value={formData.dimensions}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Description */}
          <div className="product-form-section">
            <h4 className="product-form-section-title">Description</h4>
            <div className="product-form-textarea-wrapper">
              <textarea
                name="description"
                className={`product-form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Describe your product in detail..."
                value={formData.description}
                onChange={handleChange}
                rows={6}
              />
              {errors.description && (
                <span className="product-form-error">{errors.description}</span>
              )}
              <span className="product-form-char-count">
                {formData.description?.length || 0} characters
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="product-form-section">
            <h4 className="product-form-section-title">Tags</h4>
            <div className="product-form-tags">
              <div className="product-form-tags-input">
                <Input
                  placeholder="Add tags (press Enter)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || formData.tags.length >= 10}
                >
                  Add
                </Button>
              </div>
              <div className="product-form-tags-list">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="product-form-tag">
                    #{tag}
                    <button
                      type="button"
                      className="product-form-tag-remove"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      ✕
                    </button>
                  </span>
                ))}
                {formData.tags.length === 0 && (
                  <span className="product-form-tags-empty">No tags added yet</span>
                )}
              </div>
              <span className="product-form-tags-hint">
                {formData.tags.length}/10 tags
              </span>
            </div>
          </div>

          {/* Status (for edit mode) */}
          {showStatus && (
            <div className="product-form-section">
              <h4 className="product-form-section-title">Status</h4>
              <Select
                label="Product Status"
                name="status"
                options={STATUS_OPTIONS}
                value={formData.status}
                onChange={(value) => handleSelectChange('status', value)}
              />
            </div>
          )}
        </div>

        <div className="product-form-sidebar">
          {/* Image Upload */}
          <div className="product-form-section">
            <h4 className="product-form-section-title">Product Image</h4>
            <div className="product-form-image-upload">
              <FileUploader
                onUpload={handleImageUpload}
                accept="image/*"
                maxFiles={1}
                label="Upload product image"
              />
              {imagePreview && (
                <div className="product-form-image-preview">
                  <img src={imagePreview} alt="Product preview" />
                  <button
                    type="button"
                    className="product-form-image-remove"
                    onClick={handleImageRemove}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            <span className="product-form-hint">
              Recommended: Square image, minimum 500x500px
            </span>
          </div>

          {/* Actions */}
          <div className="product-form-actions">
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              fullWidth
            >
              {isEdit ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
import React, { useState, useRef } from 'react'
import { Input } from '../../common/Input/Input'
import { Select } from '../../common/Select/Select'
import { Button } from '../../common/Button/Button'
import { CATEGORIES, CATEGORY_ICONS } from '../../../utils/constants'
import './ProductForm.css'

// Map categories to backend-friendly format
const CATEGORY_OPTIONS = CATEGORIES.map(cat => ({
  value: cat,
  label: cat,
}))

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
    craft: initialData.craft || '',
    origin: initialData.origin || '',
    materials: initialData.materials || [],
    techniques: initialData.techniques || [],
    description: initialData.description || '',
    price: initialData.price || '',
    ...initialData,
  })

  const [errors, setErrors] = useState({})
  const [materialInput, setMaterialInput] = useState('')
  const [techniqueInput, setTechniqueInput] = useState('')

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

  const handleAddMaterial = () => {
    const material = materialInput.trim()
    if (material && !formData.materials.includes(material)) {
      setFormData(prev => ({
        ...prev,
        materials: [...prev.materials, material]
      }))
      setMaterialInput('')
    }
  }

  const handleRemoveMaterial = (materialToRemove) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter(m => m !== materialToRemove)
    }))
  }

  const handleAddTechnique = () => {
    const technique = techniqueInput.trim()
    if (technique && !formData.techniques.includes(technique)) {
      setFormData(prev => ({
        ...prev,
        techniques: [...prev.techniques, technique]
      }))
      setTechniqueInput('')
    }
  }

  const handleRemoveTechnique = (techniqueToRemove) => {
    setFormData(prev => ({
      ...prev,
      techniques: prev.techniques.filter(t => t !== techniqueToRemove)
    }))
  }

  const handleKeyDown = (e, handler) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handler()
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name?.trim()) {
      newErrors.name = 'Product name is required'
    }

    if (!formData.craft) {
      newErrors.craft = 'Craft type is required'
    }

    if (!formData.origin?.trim()) {
      newErrors.origin = 'Origin is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    onSubmit(formData)
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
              label="Craft Type"
              name="craft"
              options={CATEGORY_OPTIONS}
              value={formData.craft}
              onChange={(value) => handleSelectChange('craft', value)}
              error={errors.craft}
              required
            />

            <Input
              label="Origin"
              name="origin"
              placeholder="e.g., Odisha, India"
              value={formData.origin}
              onChange={handleChange}
              error={errors.origin}
              required
            />

            <Input
              label="Price (optional)"
              name="price"
              type="number"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
            />
          </div>

          {/* Materials */}
          <div className="product-form-section">
            <h4 className="product-form-section-title">Materials</h4>
            <div className="product-form-tags">
              <div className="product-form-tags-input">
                <Input
                  placeholder="Add material (press Enter)"
                  value={materialInput}
                  onChange={(e) => setMaterialInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleAddMaterial)}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleAddMaterial}
                  disabled={!materialInput.trim()}
                >
                  Add
                </Button>
              </div>
              <div className="product-form-tags-list">
                {formData.materials.map((material, index) => (
                  <span key={index} className="product-form-tag">
                    {material}
                    <button
                      type="button"
                      className="product-form-tag-remove"
                      onClick={() => handleRemoveMaterial(material)}
                    >
                      ✕
                    </button>
                  </span>
                ))}
                {formData.materials.length === 0 && (
                  <span className="product-form-tags-empty">No materials added</span>
                )}
              </div>
            </div>
          </div>

          {/* Techniques */}
          <div className="product-form-section">
            <h4 className="product-form-section-title">Techniques</h4>
            <div className="product-form-tags">
              <div className="product-form-tags-input">
                <Input
                  placeholder="Add technique (press Enter)"
                  value={techniqueInput}
                  onChange={(e) => setTechniqueInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleAddTechnique)}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleAddTechnique}
                  disabled={!techniqueInput.trim()}
                >
                  Add
                </Button>
              </div>
              <div className="product-form-tags-list">
                {formData.techniques.map((technique, index) => (
                  <span key={index} className="product-form-tag">
                    {technique}
                    <button
                      type="button"
                      className="product-form-tag-remove"
                      onClick={() => handleRemoveTechnique(technique)}
                    >
                      ✕
                    </button>
                  </span>
                ))}
                {formData.techniques.length === 0 && (
                  <span className="product-form-tags-empty">No techniques added</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="product-form-sidebar">
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
            </div>
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
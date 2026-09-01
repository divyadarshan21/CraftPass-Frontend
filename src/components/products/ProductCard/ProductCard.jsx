import React from 'react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../../common/StatusBadge/StatusBadge'
import './ProductCard.css'

export const ProductCard = ({ 
  product, 
  onClick,
  showActions = true,
  onDelete,
  onEdit,
  className = '' 
}) => {
  const {
    id,
    name,
    category,
    description,
    image,
    status,
    price,
    artisanName,
    createdAt,
  } = product || {}

  const handleDelete = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      onDelete?.(id)
    }
  }

  const handleEdit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onEdit?.(id)
  }

  return (
    <Link 
      to={`/artisan/products/${id}`} 
      className={`product-card ${className}`}
      onClick={onClick}
    >
      <div className="product-card-image">
        <img
          src={image || '/assets/images/placeholders/product-placeholder.png'}
          alt={name || 'Product'}
          onError={(e) => {
            e.target.src = '/assets/images/placeholders/product-placeholder.png'
          }}
          loading="lazy"
        />
        <div className="product-card-status-badge">
          <StatusBadge status={status} size="sm" />
        </div>
        {price && (
          <div className="product-card-price">
            ${price}
          </div>
        )}
      </div>

      <div className="product-card-body">
        <h3 className="product-card-title">{name || 'Untitled'}</h3>
        
        <div className="product-card-meta">
          {category && (
            <span className="product-card-category">{category}</span>
          )}
          {artisanName && (
            <span className="product-card-artisan">By {artisanName}</span>
          )}
          {createdAt && (
            <span className="product-card-date">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {description && (
          <p className="product-card-description">
            {description.length > 80 ? description.slice(0, 80) + '...' : description}
          </p>
        )}

        {showActions && (onDelete || onEdit) && (
          <div className="product-card-actions">
            {onEdit && (
              <button 
                className="product-card-action edit"
                onClick={handleEdit}
                aria-label="Edit product"
              >
                ✏️ Edit
              </button>
            )}
            {onDelete && (
              <button 
                className="product-card-action delete"
                onClick={handleDelete}
                aria-label="Delete product"
              >
                🗑️ Delete
              </button>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
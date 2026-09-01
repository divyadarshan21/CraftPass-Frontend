import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader'
import { StatCard } from '../../../components/common/StatCard/StatCard'
import { Button } from '../../../components/common/Button/Button'
import { ProductTable } from '../../../components/products/ProductTable/ProductTable'
import { Loader } from '../../../components/common/Loader/Loader'
import { EmptyState } from '../../../components/common/EmptyState/EmptyState'
import { productApi } from '../../../services/productApi'
import './Dashboard.css'

export const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
  })
  const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await productApi.list({ limit: 5 })
        const products = response.data || []
        setRecentProducts(products)

        setStats({
          total: products.length,
          verified: products.filter(p => p.status === 'verified').length,
          pending: products.filter(p => p.status === 'pending').length,
          rejected: products.filter(p => p.status === 'rejected').length,
        })
        setError(null)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <Loader fullPage message="Loading dashboard..." />
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <span className="dashboard-error-icon">⚠️</span>
        <h3>Failed to Load Dashboard</h3>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="artisan-dashboard">
      <PageHeader
        title="Artisan Dashboard"
        subtitle="Manage your products and verification status"
        actions={
          <Link to="/artisan/products/new">
            <Button variant="accent">+ Add Product</Button>
          </Link>
        }
      />

      <div className="dashboard-stats">
        <StatCard
          label="Total Products"
          value={stats.total}
          icon="📦"
        />
        <StatCard
          label="Verified"
          value={stats.verified}
          icon="✅"
          color="success"
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon="⏳"
          color="warning"
        />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          icon="❌"
          color="error"
        />
      </div>

      <div className="dashboard-recent">
        <div className="dashboard-recent-header">
          <h3>Recent Products</h3>
          <Link to="/artisan/products" className="view-all">
            View All →
          </Link>
        </div>
        {recentProducts.length > 0 ? (
          <ProductTable 
            products={recentProducts} 
            showActions={false}
          />
        ) : (
          <EmptyState
            title="No products yet"
            description="Start by adding your first product to get verified."
            actionText="Add Product"
            onAction={() => window.location.href = '/artisan/products/new'}
          />
        )}
      </div>

      <div className="dashboard-quick-actions">
        <div className="dashboard-quick-actions-grid">
          <Link to="/artisan/products/new" className="quick-action-card">
            <span className="quick-action-icon">➕</span>
            <h4>Add New Product</h4>
            <p>Create a new product listing</p>
          </Link>
          <Link to="/artisan/evidence" className="quick-action-card">
            <span className="quick-action-icon">📎</span>
            <h4>Manage Evidence</h4>
            <p>Upload supporting documents</p>
          </Link>
          <Link to="/artisan/submissions" className="quick-action-card">
            <span className="quick-action-icon">📋</span>
            <h4>View Submissions</h4>
            <p>Check verification status</p>
          </Link>
          <Link to="/artisan/profile" className="quick-action-card">
            <span className="quick-action-icon">👤</span>
            <h4>Update Profile</h4>
            <p>Manage your artisan profile</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
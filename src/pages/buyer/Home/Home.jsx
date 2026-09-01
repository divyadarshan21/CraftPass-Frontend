import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/common/Button/Button'
import { StatusBadge } from '../../../components/common/StatusBadge/StatusBadge'
import { Loader } from '../../../components/common/Loader/Loader'
import { productApi } from '../../../services/productApi'
import './Home.css'

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    products: 0,
    artisans: 0,
    verificationRate: 0,
    countries: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await productApi.list({ limit: 6 })
        setFeaturedProducts(response.data || [])
        
        // Mock stats - In production, these would come from an API
        setStats({
          products: 12847,
          artisans: 3421,
          verificationRate: 98.7,
          countries: 156,
        })
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <Loader fullPage message="Loading..." />
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-hero-badge">✨ Authentic Artisan Products</div>
          <h1>Authenticate. Trust. Prosper.</h1>
          <p>
            Discover and verify the authenticity of handcrafted products from
            artisans around the world. Every product tells a story of tradition
            and craftsmanship.
          </p>
          <div className="home-hero-actions">
            <Link to="/search">
              <Button variant="primary" size="lg">
                Explore Products
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg">
                Join as Artisan
              </Button>
            </Link>
          </div>
        </div>
        <div className="home-hero-image">
          <div className="home-hero-image-placeholder">
            <span>🎨</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="home-stats">
        <div className="home-stats-grid">
          <div className="stat-item">
            <span className="stat-number">{stats.products.toLocaleString()}</span>
            <span className="stat-label">Verified Products</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.artisans.toLocaleString()}</span>
            <span className="stat-label">Artisans</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.verificationRate}%</span>
            <span className="stat-label">Verification Rate</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.countries}</span>
            <span className="stat-label">Countries</span>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="home-featured">
        <div className="container">
          <div className="home-featured-header">
            <div className="home-featured-header-left">
              <h2>Featured Products</h2>
              <p className="home-featured-subtitle">
                Discover authentic handcrafted products from verified artisans
              </p>
            </div>
            <Link to="/search" className="view-all">
              View All →
            </Link>
          </div>
          <div className="home-featured-grid">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/passport/${product.id}`}
                className="product-card-link"
              >
                <div className="product-card">
                  <div className="product-card-image">
                    <img
                      src={product.image || '/assets/images/placeholders/product-placeholder.png'}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/assets/images/placeholders/product-placeholder.png'
                      }}
                    />
                    <StatusBadge status={product.status} />
                  </div>
                  <div className="product-card-info">
                    <h3 className="product-card-name">{product.name || 'Untitled'}</h3>
                    <p className="product-card-artisan">By {product.artisanName || 'Unknown Artisan'}</p>
                    <span className="product-card-category">{product.category || 'Craft'}</span>
                    {product.price && (
                      <span className="product-card-price">${product.price}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="home-cta">
        <div className="home-cta-content">
          <div className="home-cta-text">
            <h2>Are you an Artisan?</h2>
            <p>
              Get your products verified and build trust with buyers worldwide.
              Join the CraftPass community today and showcase your authentic
              craftsmanship.
            </p>
            <div className="home-cta-benefits">
              <div className="home-cta-benefit">
                <span className="home-cta-benefit-icon">✅</span>
                <span>Get your products verified</span>
              </div>
              <div className="home-cta-benefit">
                <span className="home-cta-benefit-icon">🌍</span>
                <span>Reach global buyers</span>
              </div>
              <div className="home-cta-benefit">
                <span className="home-cta-benefit-icon">📈</span>
                <span>Build your reputation</span>
              </div>
            </div>
            <Link to="/register">
              <Button variant="accent" size="lg">
                Get Started
              </Button>
            </Link>
          </div>
          <div className="home-cta-image">
            <div className="home-cta-image-placeholder">
              <span>🏺</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="home-trust">
        <div className="container">
          <h2>Why Trust CraftPass?</h2>
          <div className="home-trust-grid">
            <div className="trust-item">
              <span className="trust-icon">🔍</span>
              <h4>Rigorous Verification</h4>
              <p>Every product undergoes thorough verification by expert verifiers</p>
            </div>
            <div className="trust-item">
              <span className="trust-icon">📜</span>
              <h4>Provenance Tracking</h4>
              <p>Complete traceability from creation to verification</p>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🤝</span>
              <h4>Artisan Support</h4>
              <p>Empowering artisans with tools to showcase their work</p>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🛡️</span>
              <h4>Buyer Protection</h4>
              <p>Shop with confidence knowing products are verified</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
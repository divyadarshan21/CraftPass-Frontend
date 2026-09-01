import React, { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { Input } from '../../../components/common/Input/Input'
import { Button } from '../../../components/common/Button/Button'
import { validateEmail, validateRequired } from '../../../utils/validators'
import './Login.css'

export const Login = () => {
  const { login, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    const result = await login(formData.email, formData.password)
    setLoading(false)

    if (result.success) {
      const user = result.user
      if (user.role === 'artisan') {
        navigate('/artisan/dashboard')
      } else if (user.role === 'verifier') {
        navigate('/verifier/dashboard')
      } else {
        navigate('/')
      }
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <img src="/logo.png" alt="CraftPass" className="auth-logo" />
          <h1 className="auth-brand-title">CraftPass</h1>
          <p className="auth-brand-subtitle">Authenticate. Trust. Prosper.</p>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your CraftPass account</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <Input
              type="email"
              name="email"
              label="Email Address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              icon={() => <span>✉️</span>}
            />

            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              icon={() => <span>🔒</span>}
            />

            <div className="auth-form-options">
              <label className="auth-remember">
                <input type="checkbox" />
                Remember me
              </label>
              <Link to="/forgot-password" className="auth-forgot">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Sign In
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>

        <div className="auth-features">
          <div className="auth-feature">
            <span className="auth-feature-icon">✅</span>
            <span>Verified Products</span>
          </div>
          <div className="auth-feature">
            <span className="auth-feature-icon">🔒</span>
            <span>Secure Authentication</span>
          </div>
          <div className="auth-feature">
            <span className="auth-feature-icon">🌍</span>
            <span>Global Artisan Community</span>
          </div>
        </div>
      </div>
    </div>
  )
}
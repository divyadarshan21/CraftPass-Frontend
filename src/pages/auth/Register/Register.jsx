import React, { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { Input } from '../../../components/common/Input/Input'
import { Select } from '../../../components/common/Select/Select'
import { Button } from '../../../components/common/Button/Button'
import { validateEmail, validateRequired, validateMinLength } from '../../../utils/validators'
import './Register.css'

const ROLE_OPTIONS = [
  { value: 'artisan', label: 'Artisan' },
  { value: 'verifier', label: 'Verifier' },
  { value: 'buyer', label: 'Buyer' },
]

export const Register = () => {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
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

    if (!validateRequired(formData.name)) {
      newErrors.name = 'Full name is required'
    }

    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = 'Password is required'
    } else if (!validateMinLength(formData.password, 6)) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!validateRequired(formData.role)) {
      newErrors.role = 'Role is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    const { confirmPassword, ...registerData } = formData
    const result = await register(registerData)
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
          <p className="auth-brand-subtitle">Start your journey of authenticity</p>
        </div>

        <div className="auth-card auth-card-register">
          <div className="auth-card-header">
            <h2>Create Account</h2>
            <p>Join the CraftPass community</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <Input
              type="text"
              name="name"
              label="Full Name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              icon={() => <span>👤</span>}
            />

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
              placeholder="Create a password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              icon={() => <span>🔒</span>}
            />

            <Input
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
              icon={() => <span>✓</span>}
            />

            <Select
              name="role"
              label="I am a"
              options={ROLE_OPTIONS}
              value={formData.role}
              onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
              error={errors.role}
              required
            />

            <div className="auth-terms">
              <label className="auth-terms-checkbox">
                <input type="checkbox" required />
                I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
              </label>
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              fullWidth
              loading={loading}
            >
              Create Account
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
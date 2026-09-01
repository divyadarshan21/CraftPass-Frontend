import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { Button } from '../../common/Button/Button'
import { Input } from '../../common/Input/Input'
import { validateEmail, validateRequired } from '../../../utils/validators'
import './LoginForm.css'

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error on change
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
    <div className="login-form-wrapper">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-form-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your CraftPass account</p>
        </div>

        <div className="login-form-fields">
          <Input
            type="email"
            name="email"
            label="Email Address"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
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
          />
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

        <p className="login-form-footer">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  )
}
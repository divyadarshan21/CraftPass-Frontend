import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { Button } from '../../common/Button/Button'
import { Input } from '../../common/Input/Input'
import { Select } from '../../common/Select/Select'
import { validateEmail, validateRequired, validateMinLength } from '../../../utils/validators'
import './RegisterForm.css'

const ROLE_OPTIONS = [
  { value: 'artisan', label: 'Artisan' },
  { value: 'verifier', label: 'Verifier' },
  { value: 'buyer', label: 'Buyer' },
]

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

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
    <div className="register-form-wrapper">
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="register-form-header">
          <h2>Create Account</h2>
          <p>Join the CraftPass community</p>
        </div>

        <div className="register-form-fields">
          <Input
            type="text"
            name="name"
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
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
          />

          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
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

        <p className="register-form-footer">
          Already have an account? <a href="/login">Sign In</a>
        </p>
      </form>
    </div>
  )
}
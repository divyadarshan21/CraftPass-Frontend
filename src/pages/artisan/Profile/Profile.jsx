import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader'
import { Input } from '../../../components/common/Input/Input'
import { Button } from '../../../components/common/Button/Button'
import { FileUploader } from '../../../components/evidence/EvidenceUploader/EvidenceUploader'
import { Loader } from '../../../components/common/Loader/Loader'
import { useAuth } from '../../../context/AuthContext'
import { authApi } from '../../../services/authApi'
import toast from 'react-hot-toast'
import './Profile.css'

export const Profile = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    artisanName: '',
    bio: '',
    location: '',
    phone: '',
    website: '',
    specialties: '',
    profileImage: null,
  })
  const [errors, setErrors] = useState({})
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        artisanName: user.artisanName || '',
        bio: user.bio || '',
        location: user.location || '',
        phone: user.phone || '',
        website: user.website || '',
        specialties: user.specialties || '',
        profileImage: user.profileImage || null,
      })
      setImagePreview(user.profileImage || null)
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageUpload = (files) => {
    if (files.length > 0) {
      const file = files[0]
      setFormData(prev => ({ ...prev, profileImage: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    try {
      const data = new FormData()
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key])
        }
      })

      await authApi.updateProfile(data)
      toast.success('Profile updated successfully')
      
      // Refresh user data
      const response = await authApi.getMe()
      updateUser(response.data)
      
      navigate('/artisan/dashboard')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Loader fullPage message="Loading profile..." />
  }

  return (
    <div className="profile-page">
      <PageHeader
        title="Artisan Profile"
        subtitle="Manage your artisan profile information"
      />

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="profile-form-grid">
          <div className="profile-form-main">
            <div className="profile-form-section">
              <h4 className="profile-form-section-title">Personal Information</h4>
              
              <Input
                label="Full Name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                disabled
              />

              <Input
                label="Artisan Name"
                name="artisanName"
                placeholder="Enter your artisan name or brand"
                value={formData.artisanName}
                onChange={handleChange}
              />

              <Input
                label="Location"
                name="location"
                placeholder="e.g., Odisha, India"
                value={formData.location}
                onChange={handleChange}
              />

              <Input
                label="Phone Number"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />

              <Input
                label="Website"
                name="website"
                placeholder="https://your-website.com"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            <div className="profile-form-section">
              <h4 className="profile-form-section-title">About You</h4>
              
              <div className="profile-form-textarea-wrapper">
                <label className="profile-form-label">Bio</label>
                <textarea
                  name="bio"
                  className="profile-form-textarea"
                  placeholder="Tell us about yourself and your craft..."
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <Input
                label="Specialties"
                name="specialties"
                placeholder="e.g., Handloom, Metalwork, Painting"
                value={formData.specialties}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="profile-form-sidebar">
            <div className="profile-form-section">
              <h4 className="profile-form-section-title">Profile Image</h4>
              <div className="profile-form-image-upload">
                <FileUploader
                  onUpload={handleImageUpload}
                  accept="image/*"
                  maxFiles={1}
                  label="Upload profile image"
                />
                {imagePreview && (
                  <div className="profile-form-image-preview">
                    <img src={imagePreview} alt="Profile preview" />
                  </div>
                )}
              </div>
              <span className="profile-form-hint">
                Recommended: Square image, minimum 200x200px
              </span>
            </div>

            <div className="profile-form-section">
              <h4 className="profile-form-section-title">Account Stats</h4>
              <div className="profile-stats">
                <div className="profile-stat">
                  <span className="profile-stat-label">Role</span>
                  <span className="profile-stat-value">
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Artisan'}
                  </span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-label">Member Since</span>
                  <span className="profile-stat-value">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-form-actions">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/artisan/dashboard')}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={saving}
              >
                Save Profile
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../services/authApi'
import { storage } from '../utils/storage'
import { USER_ROLES } from '../config/config'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(storage.get('craftpass_token'))

  useEffect(() => {
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUser = useCallback(async () => {
    try {
      const response = await authApi.getMe()
      setUser(response.data)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password)
      const { token, user } = response.data
      
      storage.set('craftpass_token', token)
      setToken(token)
      setUser(user)
      
      toast.success(`Welcome back, ${user.name || user.email}!`)
      return { success: true, user }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData)
      const { token, user } = response.data
      
      storage.set('craftpass_token', token)
      setToken(token)
      setUser(user)
      
      toast.success('Account created successfully!')
      return { success: true, user }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = useCallback(() => {
    storage.remove('craftpass_token')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser)
    storage.set('craftpass_user', updatedUser)
  }, [])

  const isAuthenticated = !!user
  const isArtisan = user?.role === USER_ROLES.ARTISAN
  const isVerifier = user?.role === USER_ROLES.VERIFIER
  const isBuyer = user?.role === USER_ROLES.BUYER

  const value = {
    user,
    loading,
    token,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
    isArtisan,
    isVerifier,
    isBuyer,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
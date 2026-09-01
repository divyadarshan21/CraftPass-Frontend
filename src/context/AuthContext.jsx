import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../services/authApi'
import { storage } from '../utils/storage'
import { ROLES } from '../utils/constants'
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
  const [token, setToken] = useState(storage.getToken())

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
      storage.clearAppData()
      setToken(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password)
      const { token, user } = response.data
      
      storage.setToken(token)
      storage.setUser(user)
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
      
      storage.setToken(token)
      storage.setUser(user)
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
    storage.clearAppData()
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser)
    storage.setUser(updatedUser)
  }, [])

  const value = {
    user,
    loading,
    token,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isArtisan: user?.role === ROLES.ARTISAN,
    isVerifier: user?.role === ROLES.VERIFIER,
    isBuyer: user?.role === ROLES.BUYER,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
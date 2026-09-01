import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const VerifierRoute = () => {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return null // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'verifier') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
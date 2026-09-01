import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const PublicRoute = () => {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    // Redirect based on role
    if (user?.role === 'artisan') {
      return <Navigate to="/artisan/dashboard" replace />
    } else if (user?.role === 'verifier') {
      return <Navigate to="/verifier/dashboard" replace />
    } else {
      return <Navigate to="/" replace />
    }
  }

  return <Outlet />
}
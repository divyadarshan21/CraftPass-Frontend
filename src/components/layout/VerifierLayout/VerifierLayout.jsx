import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { Navbar } from '../Navbar/Navbar'
import { Sidebar } from '../Sidebar/Sidebar'
import { useApp } from '../../../context/AppContext'
import './VerifierLayout.css'

export const VerifierLayout = () => {
  const { isAuthenticated, isVerifier, loading } = useAuth()
  const { sidebarOpen, toggleSidebar } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login')
    } else if (!loading && !isVerifier) {
      navigate('/')
    }
  }, [isAuthenticated, isVerifier, loading, navigate])

  if (loading) {
    return (
      <div className="verifier-layout-loading">
        <div className="verifier-layout-loading-spinner" />
      </div>
    )
  }

  return (
    <div className="verifier-layout">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="verifier-layout-body">
        <Sidebar open={sidebarOpen} />
        <div className={`verifier-layout-overlay ${sidebarOpen ? 'open' : ''}`} onClick={toggleSidebar} />
        <main className="verifier-layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
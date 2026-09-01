import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { Navbar } from '../Navbar/Navbar'
import { Sidebar } from '../Sidebar/Sidebar'
import { useApp } from '../../../context/AppContext'
import './ArtisanLayout.css'

export const ArtisanLayout = () => {
  const { isAuthenticated, isArtisan, loading } = useAuth()
  const { sidebarOpen, toggleSidebar } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login')
    } else if (!loading && !isArtisan) {
      navigate('/')
    }
  }, [isAuthenticated, isArtisan, loading, navigate])

  if (loading) {
    return (
      <div className="artisan-layout-loading">
        <div className="artisan-layout-loading-spinner" />
      </div>
    )
  }

  return (
    <div className="artisan-layout">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="artisan-layout-body">
        <Sidebar open={sidebarOpen} />
        <div className={`artisan-layout-overlay ${sidebarOpen ? 'open' : ''}`} onClick={toggleSidebar} />
        <main className="artisan-layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
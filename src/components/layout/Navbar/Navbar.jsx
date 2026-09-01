import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useApp } from '../../../context/AppContext'
import './Navbar.css'

export const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useApp()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev)
  }

  const getUserInitials = () => {
    if (!user?.name) return 'U'
    return user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button
          className="navbar-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          aria-expanded={false}
        >
          <span className="navbar-toggle-icon">☰</span>
        </button>

        <Link to="/" className="navbar-brand">
          <img src="/logo.png" alt="CraftPass" className="navbar-logo" />
          <span className="navbar-brand-text">CraftPass</span>
        </Link>
      </div>

      <div className="navbar-center">
        {/* Search bar (optional) */}
      </div>

      <div className="navbar-right">
        {/* Theme Toggle */}
        <button
          className="navbar-theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {user && (
          <div className="navbar-user" ref={dropdownRef}>
            <button
              className={`navbar-user-btn ${dropdownOpen ? 'active' : ''}`}
              onClick={toggleDropdown}
              aria-label="User menu"
              aria-expanded={dropdownOpen}
            >
              <span className="navbar-user-avatar">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} />
                ) : (
                  <span className="navbar-user-initials">{getUserInitials()}</span>
                )}
              </span>
              <span className="navbar-user-name">{user.name || user.email}</span>
              <span className={`navbar-user-chevron ${dropdownOpen ? 'open' : ''}`}>▾</span>
            </button>

            {dropdownOpen && (
              <div className="navbar-dropdown">
                <div className="navbar-dropdown-header">
                  <span className="navbar-dropdown-avatar">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.name} />
                    ) : (
                      <span className="navbar-dropdown-initials">{getUserInitials()}</span>
                    )}
                  </span>
                  <div className="navbar-dropdown-user">
                    <span className="navbar-dropdown-name">{user.name || 'User'}</span>
                    <span className="navbar-dropdown-email">{user.email}</span>
                    <span className="navbar-dropdown-role">{user.role || 'Member'}</span>
                  </div>
                </div>

                <div className="navbar-dropdown-divider" />

                <Link to={`/${user.role}/dashboard`} className="navbar-dropdown-item">
                  <span className="navbar-dropdown-item-icon">📊</span>
                  Dashboard
                </Link>

                {user.role === 'artisan' && (
                  <>
                    <Link to="/artisan/products" className="navbar-dropdown-item">
                      <span className="navbar-dropdown-item-icon">📦</span>
                      My Products
                    </Link>
                    <Link to="/artisan/evidence" className="navbar-dropdown-item">
                      <span className="navbar-dropdown-item-icon">📎</span>
                      Evidence
                    </Link>
                    <Link to="/artisan/submissions" className="navbar-dropdown-item">
                      <span className="navbar-dropdown-item-icon">📋</span>
                      Submissions
                    </Link>
                  </>
                )}

                {user.role === 'verifier' && (
                  <>
                    <Link to="/verifier/queue" className="navbar-dropdown-item">
                      <span className="navbar-dropdown-item-icon">📋</span>
                      Review Queue
                    </Link>
                    <Link to="/verifier/history" className="navbar-dropdown-item">
                      <span className="navbar-dropdown-item-icon">📜</span>
                      History
                    </Link>
                  </>
                )}

                <Link to={`/${user.role}/profile`} className="navbar-dropdown-item">
                  <span className="navbar-dropdown-item-icon">👤</span>
                  Profile
                </Link>

                <div className="navbar-dropdown-divider" />

                <button className="navbar-dropdown-item logout" onClick={handleLogout}>
                  <span className="navbar-dropdown-item-icon">🚪</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
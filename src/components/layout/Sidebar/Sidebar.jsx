import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useApp } from '../../../context/AppContext'
import './Sidebar.css'

export const Sidebar = ({ open }) => {
  const { user } = useAuth()
  const { closeSidebar } = useApp()
  const location = useLocation()

  const getNavItems = () => {
    const commonItems = []

    const roleItems = {
      artisan: [
        { to: '/artisan/dashboard', label: 'Dashboard', icon: '📊' },
        { to: '/artisan/products', label: 'Products', icon: '📦' },
        { to: '/artisan/evidence', label: 'Evidence', icon: '📎' },
        { to: '/artisan/submissions', label: 'Submissions', icon: '📋' },
        { to: '/artisan/profile', label: 'Profile', icon: '👤' },
      ],
      verifier: [
        { to: '/verifier/dashboard', label: 'Dashboard', icon: '📊' },
        { to: '/verifier/queue', label: 'Queue', icon: '📋' },
        { to: '/verifier/history', label: 'History', icon: '📜' },
        { to: '/verifier/profile', label: 'Profile', icon: '👤' },
      ],
      buyer: [
        { to: '/', label: 'Home', icon: '🏠' },
        { to: '/search', label: 'Search', icon: '🔍' },
        { to: '/buyer/profile', label: 'Profile', icon: '👤' },
      ],
    }

    return [...commonItems, ...(roleItems[user?.role] || [])]
  }

  const navItems = getNavItems()

  const handleLinkClick = () => {
    closeSidebar()
  }

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <nav className="sidebar-nav">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} />
            ) : (
              <span className="sidebar-user-initials">
                {user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'}
              </span>
            )}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.name || 'User'}</span>
            <span className="sidebar-user-role">{user?.role || 'Member'}</span>
          </div>
        </div>

        <div className="sidebar-divider" />

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            onClick={handleLinkClick}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span className="sidebar-link-label">{item.label}</span>
          </NavLink>
        ))}

        <div className="sidebar-divider" />

        <div className="sidebar-bottom">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            onClick={handleLinkClick}
          >
            <span className="sidebar-link-icon">🏠</span>
            <span className="sidebar-link-label">Home</span>
          </NavLink>
        </div>
      </nav>
    </aside>
  )
}
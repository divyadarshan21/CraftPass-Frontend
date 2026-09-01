import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { storage } from '../utils/storage'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return storage.get('sidebar_open') !== false
  })
  const [theme, setTheme] = useState(() => {
    return storage.get('theme') || 'light'
  })
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    storage.set('sidebar_open', sidebarOpen)
  }, [sidebarOpen])

  useEffect(() => {
    storage.set('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  const closeSidebar = useCallback(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }, [])

  const addNotification = useCallback((notification) => {
    setNotifications(prev => [{
      id: Date.now(),
      read: false,
      createdAt: new Date().toISOString(),
      ...notification,
    }, ...prev])
    setUnreadCount(prev => prev + 1)
  }, [])

  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
    setUnreadCount(0)
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
    setUnreadCount(0)
  }, [])

  const value = {
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    closeSidebar,
    theme,
    setTheme,
    toggleTheme,
    isMobile,
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
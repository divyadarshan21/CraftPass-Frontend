import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../Navbar/Navbar'
import { useApp } from '../../../context/AppContext'
import './BuyerLayout.css'

export const BuyerLayout = () => {
  const { toggleSidebar } = useApp()

  return (
    <div className="buyer-layout">
      <Navbar toggleSidebar={toggleSidebar} />
      <main className="buyer-layout-content">
        <Outlet />
      </main>
    </div>
  )
}
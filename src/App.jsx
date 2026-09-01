import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Context Providers
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'

// Auth Pages
import { Login } from './pages/auth/Login/Login'
import { Register } from './pages/auth/Register/Register'

// Buyer Pages
import { Home } from './pages/buyer/Home/Home'
import { Search } from './pages/buyer/Search/Search'
import { Passport } from './pages/buyer/Passport/Passport'

// Artisan Pages
import { ArtisanLayout } from './components/layout/ArtisanLayout/ArtisanLayout'
import { Dashboard as ArtisanDashboard } from './pages/artisan/Dashboard/Dashboard'
import { Products } from './pages/artisan/Products/Products'
import { AddProduct } from './pages/artisan/AddProduct/AddProduct'
import { ProductDetails as ArtisanProductDetails } from './pages/artisan/ProductDetails/ProductDetails'
import { Evidence } from './pages/artisan/Evidence/Evidence'
import { Submissions } from './pages/artisan/Submissions/Submissions'
import { Profile } from './pages/artisan/Profile/Profile'

// Verifier Pages
import { VerifierLayout } from './components/layout/VerifierLayout/VerifierLayout'
import { Dashboard as VerifierDashboard } from './pages/verifier/Dashboard/Dashboard'
import { Queue } from './pages/verifier/Queue/Queue'
import { ReviewSubmission } from './pages/verifier/ReviewSubmission/ReviewSubmission'
import { History as VerifierHistory } from './pages/verifier/History/History'

// Route Guards
import { ProtectedRoute } from './routes/ProtectedRoute'
import { ArtisanRoute } from './routes/ArtisanRoute'
import { VerifierRoute } from './routes/VerifierRoute'
import { PublicRoute } from './routes/PublicRoute'

// Error Boundary
import { ErrorBoundary } from './components/common/ErrorBoundary/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#FFFFFF',
                  color: '#0F181E',
                  borderRadius: '8px',
                  boxShadow: '0 8px 30px rgba(15, 24, 30, 0.12)',
                  padding: '16px 20px',
                },
                success: {
                  icon: '✅',
                },
                error: {
                  icon: '❌',
                },
                loading: {
                  icon: '⏳',
                },
              }}
            />
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Buyer Routes (Public) */}
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/passport/:slug" element={<Passport />} />

              {/* Artisan Routes (Protected) */}
              <Route element={<ProtectedRoute />}>
                <Route element={<ArtisanRoute />}>
                  <Route path="/artisan" element={<ArtisanLayout />}>
                    <Route index element={<Navigate to="/artisan/dashboard" replace />} />
                    <Route path="dashboard" element={<ArtisanDashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="products/new" element={<AddProduct />} />
                    <Route path="products/:id" element={<ArtisanProductDetails />} />
                    <Route path="products/:id/edit" element={<AddProduct />} />
                    <Route path="evidence" element={<Evidence />} />
                    <Route path="submissions" element={<Submissions />} />
                    <Route path="profile" element={<Profile />} />
                  </Route>
                </Route>
              </Route>

              {/* Verifier Routes (Protected) */}
              <Route element={<ProtectedRoute />}>
                <Route element={<VerifierRoute />}>
                  <Route path="/verifier" element={<VerifierLayout />}>
                    <Route index element={<Navigate to="/verifier/dashboard" replace />} />
                    <Route path="dashboard" element={<VerifierDashboard />} />
                    <Route path="queue" element={<Queue />} />
                    <Route path="submissions/:id" element={<ReviewSubmission />} />
                    <Route path="history" element={<VerifierHistory />} />
                  </Route>
                </Route>
              </Route>

              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

// 404 Component
const NotFound = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center',
      background: '#F7F5EF',
    }}>
      <div style={{
        fontSize: '6rem',
        marginBottom: '1rem',
      }}>🔍</div>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#0F181E',
        margin: '0 0 0.5rem 0',
      }}>Page Not Found</h1>
      <p style={{
        fontSize: '1.125rem',
        color: '#52636B',
        margin: '0 0 2rem 0',
        maxWidth: '400px',
      }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <a href="/" style={{
        padding: '0.75rem 2rem',
        background: '#14535F',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '500',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'all 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.target.style.background = '#0E3F48'
        e.target.style.transform = 'translateY(-2px)'
        e.target.style.boxShadow = '0 4px 12px rgba(20, 83, 95, 0.2)'
      }}
      onMouseLeave={(e) => {
        e.target.style.background = '#14535F'
        e.target.style.transform = 'translateY(0)'
        e.target.style.boxShadow = 'none'
      }}>
        Go to Homepage
      </a>
    </div>
  )
}

export default App
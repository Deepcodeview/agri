'use client'
import { useState, useEffect } from 'react'
import LoginPage from '../components/LoginPage'
import Dashboard from '../components/Dashboard'
import ExpertDashboard from '../components/ExpertDashboard'
import SuperAdminDashboard from '../components/SuperAdminDashboard'
import ModernNavbar from '../components/ModernNavbar'
import ModernAuthModal from '../components/ModernAuthModal'
import ModernConsultationDashboard from '../components/ModernConsultationDashboard'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [currentView, setCurrentView] = useState<'dashboard' | 'consultation'>('dashboard')
  const [loading, setLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login')

  useEffect(() => {
    // Check if user is already logged in
    try {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData)
        // Skip token validation to prevent auth popups
        setUser(parsedUser)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      // Clear corrupted data
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleLogin = (userData: any) => {
    setUser(userData)
  }

  const handleLoginClick = () => {
    setAuthModalTab('login')
    setIsAuthModalOpen(true)
  }

  const handleRegisterClick = () => {
    setAuthModalTab('register')
    setIsAuthModalOpen(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setCurrentView('dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <ModernNavbar 
          onLoginClick={handleLoginClick}
          onRegisterClick={handleRegisterClick}
        />
        
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4 sm:p-6">
          <div className="text-center max-w-4xl w-full">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <span className="text-2xl sm:text-3xl md:text-4xl">🌱</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-4 sm:mb-6">
              BeejHealth
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-neutral-600 mb-6 sm:mb-8 leading-relaxed px-4">
              Connect with agricultural experts for AI-powered plant disease diagnosis and consultation
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div className="card p-4 sm:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl">🔬</span>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2 text-sm sm:text-base">AI Diagnosis</h3>
                <p className="text-neutral-600 text-xs sm:text-sm">Advanced machine learning for accurate plant disease detection</p>
              </div>
              
              <div className="card p-4 sm:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl">👨🌾</span>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2 text-sm sm:text-base">Expert Connect</h3>
                <p className="text-neutral-600 text-xs sm:text-sm">Get personalized advice from certified agricultural experts</p>
              </div>
              
              <div className="card p-4 sm:p-6 text-center sm:col-span-2 md:col-span-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-earth-100 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl">📱</span>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2 text-sm sm:text-base">Easy to Use</h3>
                <p className="text-neutral-600 text-xs sm:text-sm">Simple interface designed for farmers and agricultural professionals</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
              <button onClick={handleRegisterClick} className="btn-primary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto">
                Get Started Free
              </button>
              <button onClick={handleLoginClick} className="btn-secondary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto">
                Login
              </button>
            </div>
          </div>
        </div>

        <ModernAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialTab={authModalTab}
          onLogin={handleLogin}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen">
      {user.role === 'superadmin' ? (
        <SuperAdminDashboard user={user} onLogout={handleLogout} />
      ) : user.role === 'expert' ? (
        <ExpertDashboard user={user} onLogout={handleLogout} />
      ) : (
        <>
          {currentView === 'dashboard' ? (
            <Dashboard 
              user={user} 
              onLogout={handleLogout} 
              onStartConsultation={() => setCurrentView('consultation')}
            />
          ) : (
            <ModernConsultationDashboard />
          )}
          
          {/* Floating Action Button */}
          <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-40">
            <button
              onClick={() => setCurrentView(currentView === 'dashboard' ? 'consultation' : 'dashboard')}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-4 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-3xl font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              <span className="hidden sm:inline">{currentView === 'dashboard' ? '🌱 Start Consultation' : '📊 Back to Dashboard'}</span>
              <span className="sm:hidden">{currentView === 'dashboard' ? '🌱' : '📊'}</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
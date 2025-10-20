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
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
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
        
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-6">
          <div className="text-center max-w-4xl">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <span className="text-4xl">🌱</span>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-6">
              BeejHealth
            </h1>
            
            <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
              Connect with agricultural experts for AI-powered plant disease diagnosis and consultation
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔬</span>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">AI Diagnosis</h3>
                <p className="text-neutral-600 text-sm">Advanced machine learning for accurate plant disease detection</p>
              </div>
              
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👨🌾</span>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Expert Connect</h3>
                <p className="text-neutral-600 text-sm">Get personalized advice from certified agricultural experts</p>
              </div>
              
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-earth-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Easy to Use</h3>
                <p className="text-neutral-600 text-sm">Simple interface designed for farmers and agricultural professionals</p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button onClick={handleRegisterClick} className="btn-primary px-8 py-4 text-lg">
                Get Started Free
              </button>
              <button onClick={handleLoginClick} className="btn-secondary px-8 py-4 text-lg">
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
          <div className="fixed bottom-8 right-8 z-40">
            <button
              onClick={() => setCurrentView(currentView === 'dashboard' ? 'consultation' : 'dashboard')}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              {currentView === 'dashboard' ? '🌱 Start Consultation' : '📊 Back to Dashboard'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
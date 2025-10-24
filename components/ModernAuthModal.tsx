'use client'
import { useState } from 'react'
import { X, Eye, EyeOff, Leaf, Mail, Phone, Lock, User, MessageCircle } from 'lucide-react'
import WhatsAppOTPModal from './WhatsAppOTPModal'
import BackendAPI from '../lib/backend-fix'

interface ModernAuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab: 'login' | 'register'
  onLogin: (userData: any) => void
}

export default function ModernAuthModal({ isOpen, onClose, initialTab, onLogin }: ModernAuthModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [authMethod, setAuthMethod] = useState('password')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'farmer'
  })
  const [showWhatsAppOTP, setShowWhatsAppOTP] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Admin login check first
    if (activeTab === 'login' && formData.email === 'admin@beejhealth.com' && formData.password === 'password') {
      const adminUser = {
        id: 1,
        name: 'Super Admin',
        email: 'admin@beejhealth.com',
        role: 'superadmin'
      }
      localStorage.setItem('token', 'admin-token')
      localStorage.setItem('user', JSON.stringify(adminUser))
      onLogin(adminUser)
      onClose()
      setLoading(false)
      return
    }

    try {
      // Real backend connection
      const endpoint = activeTab === 'login' ? 
        'https://backend.cvframeiq.in/api/auth.php?action=login' : 
        'https://backend.cvframeiq.in/api/auth.php?action=register'
        
      const submitData = {
        ...formData,
        phone: formData.phone || '0000000000'
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(submitData)
      })
      
      const result = await response.json()
      
      if (response.ok && result.success) {
        localStorage.setItem('token', result.token)
        localStorage.setItem('user', JSON.stringify(result.user))
        onLogin(result.user)
        onClose()
      } else {
        alert(result.error || 'Authentication failed')
      }
      
    } catch (error) {
      console.error('Auth error:', error)
      alert('Connection failed. Please check your credentials.')
    }
    
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Leaf className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">BeejHealth</h2>
              <p className="text-primary-100 text-sm">Plant Disease Diagnosis Platform</p>
            </div>
          </div>
        </div>

        <div className="flex bg-neutral-50 mx-6 mt-6 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-center font-medium rounded-lg transition-all ${
              activeTab === 'login' 
                ? 'bg-white text-primary-600 shadow-card' 
                : 'text-neutral-600 hover:text-neutral-800'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 text-center font-medium rounded-lg transition-all ${
              activeTab === 'register' 
                ? 'bg-white text-primary-600 shadow-card' 
                : 'text-neutral-600 hover:text-neutral-800'
            }`}
          >
            Register
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'register' && (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="input-field w-full pl-11"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="tel"
                    placeholder="Phone Number (Required)"
                    className="input-field w-full pl-11"
                    value={formData.phone}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '')
                      if (value.length <= 10) {
                        setFormData({...formData, phone: value})
                      }
                    }}
                    required
                  />
                </div>
                
                <select
                  className="input-field w-full"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="farmer">Farmer</option>
                  <option value="expert">Agricultural Expert</option>
                </select>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="email"
                placeholder="Email Address"
                className="input-field w-full pl-11"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            {activeTab === 'login' && (
              <div className="flex bg-neutral-100 rounded-xl p-1 mb-4">
                <button
                  type="button"
                  onClick={() => setAuthMethod('password')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    authMethod === 'password' 
                      ? 'bg-white text-primary-600 shadow-card' 
                      : 'text-neutral-600'
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('otp')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    authMethod === 'otp' 
                      ? 'bg-white text-primary-600 shadow-card' 
                      : 'text-neutral-600'
                  }`}
                >
                  WhatsApp OTP
                </button>
              </div>
            )}
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="input-field w-full pl-11 pr-11"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {activeTab === 'login' && authMethod === 'otp' && (
              <button 
                type="button" 
                onClick={() => setShowWhatsAppOTP(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl w-full flex items-center justify-center space-x-2"
              >
                <MessageCircle size={20} />
                <span>Login with WhatsApp OTP</span>
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Please wait...</span>
                </div>
              ) : (
                activeTab === 'login' ? 'Login to BeejHealth' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-600">
            <p className="mb-2">Connect with agricultural experts</p>
            <p>AI-powered plant disease diagnosis</p>
          </div>
        </div>
      </div>
      
      <WhatsAppOTPModal
        isOpen={showWhatsAppOTP}
        onClose={() => setShowWhatsAppOTP(false)}
        onSuccess={(userData) => {
          localStorage.setItem('user', JSON.stringify(userData))
          onLogin(userData)
          onClose()
        }}
      />
    </div>
  )
}
'use client'
import { useState } from 'react'
import { X } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab: 'login' | 'register'
}

export default function AuthModal({ isOpen, onClose, initialTab }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [authMethod, setAuthMethod] = useState('password')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Authentication</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 text-center ${activeTab === 'login' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'}`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 text-center ${activeTab === 'register' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'}`}
          >
            Register
          </button>
        </div>

        {activeTab === 'login' ? (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Email/Mobile"
              className="input-field w-full"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setAuthMethod('otp')}
                className={`flex-1 py-2 px-4 rounded ${authMethod === 'otp' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
              >
                OTP
              </button>
              <button
                onClick={() => setAuthMethod('password')}
                className={`flex-1 py-2 px-4 rounded ${authMethod === 'password' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
              >
                Password
              </button>
            </div>
            
            {authMethod === 'password' ? (
              <input
                type="password"
                placeholder="Password"
                className="input-field w-full"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            ) : (
              <button className="btn-secondary w-full">Get OTP</button>
            )}
            
            <button className="btn-primary w-full">Login</button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="input-field w-full"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input
              type="email"
              placeholder="Email"
              className="input-field w-full"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="input-field w-full"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
            <input
              type="password"
              placeholder="Password"
              className="input-field w-full"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button className="btn-primary w-full">Register</button>
          </div>
        )}
      </div>
    </div>
  )
}
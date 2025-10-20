'use client'
import { useState } from 'react'
import { Eye, EyeOff, Leaf } from 'lucide-react'

interface LoginPageProps {
  onLogin: (userData: any) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'farmer'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        onLogin(data.user)
      } else {
        alert(data.error || 'Authentication failed')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">BeejHealth</h1>
          <p className="text-gray-600 mt-2">Plant Disease Diagnosis Platform</p>
        </div>

        <div className="flex mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-center font-medium ${
              isLogin ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-center font-medium ${
              !isLogin ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                className="input-field w-full"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required={!isLogin}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="input-field w-full"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <select
                className="input-field w-full"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="farmer">Farmer</option>
                <option value="expert">Expert</option>
              </select>
            </>
          )}

          <input
            type="email"
            placeholder="Email Address"
            className="input-field w-full"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="input-field w-full pr-12"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-lg"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Connect farmers with agricultural experts</p>
          <p className="mt-1">AI-powered plant disease diagnosis</p>
        </div>
      </div>
    </div>
  )
}
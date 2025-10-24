'use client'
import { useState } from 'react'
import { Leaf, ChevronDown, Menu, X } from 'lucide-react'

interface ModernNavbarProps {
  onLoginClick: () => void
  onRegisterClick: () => void
}

export default function ModernNavbar({ onLoginClick, onRegisterClick }: ModernNavbarProps) {
  const [userRole, setUserRole] = useState('Farmer')
  const [language, setLanguage] = useState('English')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-soft border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              BeejHealth
            </h1>
          </div>
          
          {/* Desktop Controls */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="relative">
              <select 
                value={userRole} 
                onChange={(e) => setUserRole(e.target.value)}
                className="appearance-none bg-white border border-neutral-200 rounded-xl px-4 py-2 pr-10 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none font-medium text-neutral-700"
              >
                <option value="Farmer">Farmer</option>
                <option value="Expert">Expert</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
            
            <div className="relative">
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none bg-white border border-neutral-200 rounded-xl px-4 py-2 pr-10 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none font-medium text-neutral-700"
              >
                <option value="English">English</option>
                <option value="Hindi">हिंदी</option>
                <option value="Punjabi">ਪੰਜਾਬੀ</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <button onClick={onLoginClick} className="btn-secondary px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base">
              Login
            </button>
            <button onClick={onRegisterClick} className="btn-primary px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base">
              Register
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-neutral-700" />
            ) : (
              <Menu className="w-6 h-6 text-neutral-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden mt-4 pb-4 border-t border-neutral-100">
            <div className="pt-4 space-y-4">
              {/* Mobile Controls */}
              <div className="space-y-3">
                <div className="relative">
                  <select 
                    value={userRole} 
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full appearance-none bg-white border border-neutral-200 rounded-xl px-4 py-3 pr-10 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none font-medium text-neutral-700"
                  >
                    <option value="Farmer">Farmer</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>
                
                <div className="relative">
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full appearance-none bg-white border border-neutral-200 rounded-xl px-4 py-3 pr-10 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none font-medium text-neutral-700"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">हिंदी</option>
                    <option value="Punjabi">ਪੰਜਾਬੀ</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col space-y-3 pt-2">
                <button 
                  onClick={() => {
                    onLoginClick()
                    setIsMobileMenuOpen(false)
                  }} 
                  className="btn-secondary w-full py-3 text-center"
                >
                  Login
                </button>
                <button 
                  onClick={() => {
                    onRegisterClick()
                    setIsMobileMenuOpen(false)
                  }} 
                  className="btn-primary w-full py-3 text-center"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
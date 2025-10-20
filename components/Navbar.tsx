'use client'
import { useState } from 'react'

interface NavbarProps {
  onLoginClick: () => void
  onRegisterClick: () => void
}

export default function Navbar({ onLoginClick, onRegisterClick }: NavbarProps) {
  const [userRole, setUserRole] = useState('Farmer')
  const [language, setLanguage] = useState('English')

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary-600">BeejHealth</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <select 
            value={userRole} 
            onChange={(e) => setUserRole(e.target.value)}
            className="input-field"
          >
            <option value="Farmer">Farmer</option>
            <option value="Expert">Expert</option>
          </select>
          
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="input-field"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-4">
          <button onClick={onLoginClick} className="btn-secondary">
            Login
          </button>
          <button onClick={onRegisterClick} className="btn-primary">
            Register
          </button>
        </div>
      </div>
    </nav>
  )
}
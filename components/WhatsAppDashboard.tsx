'use client'
import { useState } from 'react'
import { MessageCircle, Settings, Phone, Send } from 'lucide-react'

export default function WhatsAppDashboard() {
  const [apiConfig, setApiConfig] = useState({
    secret: localStorage.getItem('whatsapp_secret') || '',
    baseUrl: localStorage.getItem('whatsapp_base_url') || 'https://wa.bitseva.in/api'
  })
  const [welcomeMessage, setWelcomeMessage] = useState(
    localStorage.getItem('welcome_message') || 'Welcome to BeejHealth! 🌱 Your plant health expert is here to help.'
  )
  const [otpEnabled, setOtpEnabled] = useState(
    localStorage.getItem('otp_enabled') === 'true'
  )

  const saveSettings = () => {
    localStorage.setItem('whatsapp_secret', apiConfig.secret)
    localStorage.setItem('whatsapp_base_url', apiConfig.baseUrl)
    localStorage.setItem('welcome_message', welcomeMessage)
    localStorage.setItem('otp_enabled', otpEnabled.toString())
    console.log('WhatsApp settings saved successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">WhatsApp Integration</h2>
            <p className="text-neutral-600">Welcome messages and login OTP</p>
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">API Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">API Secret Key</label>
            <input 
              type="password" 
              placeholder="Enter WhatsApp API Secret" 
              className="input-field w-full"
              value={apiConfig.secret}
              onChange={(e) => setApiConfig({...apiConfig, secret: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">API Base URL</label>
            <input 
              type="url" 
              className="input-field w-full"
              value={apiConfig.baseUrl}
              onChange={(e) => setApiConfig({...apiConfig, baseUrl: e.target.value})}
            />
          </div>
        </div>
      </div>
      {/* Welcome Message Settings */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Welcome Message</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Welcome Message Text</label>
            <textarea 
              className="input-field w-full h-24 resize-none"
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              placeholder="Enter welcome message for new users..."
            />
          </div>
          <p className="text-sm text-neutral-600">
            This message will be sent to new users when they first interact with your WhatsApp bot.
          </p>
        </div>
      </div>

      {/* Login OTP Settings */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Login OTP</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input 
              type="checkbox" 
              id="otpEnabled"
              checked={otpEnabled}
              onChange={(e) => setOtpEnabled(e.target.checked)}
              className="w-4 h-4 text-green-600 rounded"
            />
            <label htmlFor="otpEnabled" className="text-sm font-medium text-neutral-700">
              Enable WhatsApp OTP for login
            </label>
          </div>
          <p className="text-sm text-neutral-600">
            When enabled, users can login using OTP sent to their WhatsApp number.
          </p>
        </div>
      </div>

      {/* Save Settings */}
      <div className="flex justify-end">
        <button onClick={saveSettings} className="btn-primary flex items-center">
          <Settings size={16} className="mr-2" />
          Save Settings
        </button>
      </div>

      {/* Usage Instructions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">How to Use</h3>
        <div className="space-y-3 text-sm text-neutral-600">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 font-bold text-xs">1</span>
            </div>
            <p><strong>API Setup:</strong> Enter your WhatsApp API secret key and base URL above</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 font-bold text-xs">2</span>
            </div>
            <p><strong>Welcome Message:</strong> Customize the message sent to new users</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 font-bold text-xs">3</span>
            </div>
            <p><strong>Login OTP:</strong> Enable WhatsApp OTP for user authentication</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 font-bold text-xs">4</span>
            </div>
            <p><strong>Save Settings:</strong> Click save to apply your configuration</p>
          </div>
        </div>
      </div>

    </div>
  )
}
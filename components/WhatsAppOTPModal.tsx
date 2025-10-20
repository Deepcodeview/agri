'use client'
import { useState } from 'react'
import { X, Phone, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react'

interface WhatsAppOTPModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (userData: any) => void
}

export default function WhatsAppOTPModal({ isOpen, onClose, onSuccess }: WhatsAppOTPModalProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [attemptsLeft, setAttemptsLeft] = useState(3)

  if (!isOpen) return null

  const sendOTP = async () => {
    let finalPhone = phone
    
    // Auto-add +91 for 10-digit numbers
    if (phone.length === 10 && /^[6-9]\d{9}$/.test(phone)) {
      finalPhone = '+91' + phone
      setPhone(finalPhone)
    }
    
    if (!finalPhone.startsWith('+91') || finalPhone.length !== 13) {
      setError('Please enter valid Indian mobile number')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/whatsapp-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: finalPhone, action: 'send' })
      })

      const data = await response.json()

      if (data.success) {
        setStep('otp')
        setError('')
      } else {
        setError(data.error || 'Failed to send OTP')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter 6-digit OTP')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/whatsapp-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, action: 'verify' })
      })

      const data = await response.json()

      if (data.success) {
        onSuccess(data.user)
        onClose()
        resetForm()
      } else {
        setError(data.error || 'Invalid OTP')
        setAttemptsLeft(data.attemptsLeft || 0)
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep('phone')
    setPhone('')
    setOtp('')
    setError('')
    setAttemptsLeft(3)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold">WhatsApp Login</h3>
              <p className="text-sm text-neutral-600">Secure OTP verification</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-neutral-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {step === 'phone' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '')
                    if (value.length === 10 && !value.startsWith('91')) {
                      value = '91' + value
                    }
                    if (value.length > 0 && !value.startsWith('91')) {
                      value = '91' + value
                    }
                    setPhone(value.length > 0 ? '+' + value : '')
                  }}
                  placeholder="+91XXXXXXXXXX"
                  className="input-field pl-10 w-full"
                  maxLength={13}
                />
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Enter your WhatsApp number to receive OTP
              </p>
            </div>

            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={sendOTP}
              disabled={loading || !phone}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending OTP...
                </div>
              ) : (
                'Send OTP via WhatsApp'
              )}
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-neutral-600">
                OTP sent to <span className="font-medium">{phone}</span>
              </p>
              <p className="text-xs text-neutral-500">Check your WhatsApp messages</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="input-field w-full text-center text-2xl tracking-widest"
                maxLength={6}
              />
              <p className="text-xs text-neutral-500 mt-1 text-center">
                Valid for 5 minutes
              </p>
            </div>

            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-red-600">{error}</p>
                  {attemptsLeft > 0 && (
                    <p className="text-xs text-red-500">{attemptsLeft} attempts left</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setStep('phone')}
                className="btn-secondary flex-1"
              >
                Change Number
              </button>
              <button
                onClick={verifyOTP}
                disabled={loading || otp.length !== 6}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify OTP'
                )}
              </button>
            </div>

            <button
              onClick={sendOTP}
              disabled={loading}
              className="text-sm text-primary-600 hover:text-primary-700 w-full"
            >
              Resend OTP
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
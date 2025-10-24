import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, otp, action } = body
    
    if (action === 'send') {
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString()
      
      // Get WhatsApp config from localStorage (passed from frontend)
      const whatsappSecret = body.whatsappSecret || 'demo_secret'
      const whatsappAccount = body.whatsappAccount || 'demo_account'
      
      try {
        // Send OTP via WhatsApp API
        const formData = new FormData()
        formData.append('secret', whatsappSecret)
        formData.append('account', whatsappAccount)
        formData.append('recipient', phone)
        formData.append('type', 'text')
        formData.append('message', `🔐 BeejHealth Login OTP: ${generatedOTP}\n\nYour secure login code. Valid for 5 minutes.\n\n⚠️ Do not share this code.`)
        
        const whatsappResponse = await fetch('https://wa.bitseva.in/api/send/whatsapp', {
          method: 'POST',
          body: formData
        })
        
        if (whatsappResponse.ok) {
          // Store OTP temporarily (in production use Redis/Database)
          global.otpStore = global.otpStore || {}
          global.otpStore[phone] = {
            otp: generatedOTP,
            expires: Date.now() + 5 * 60 * 1000, // 5 minutes
            attempts: 3
          }
          
          return NextResponse.json({
            success: true,
            message: 'OTP sent successfully via WhatsApp'
          })
        } else {
          throw new Error('WhatsApp API failed')
        }
      } catch (error) {
        // Demo fallback
        global.otpStore = global.otpStore || {}
        global.otpStore[phone] = {
          otp: generatedOTP,
          expires: Date.now() + 5 * 60 * 1000,
          attempts: 3
        }
        
        return NextResponse.json({
          success: true,
          message: `Demo mode - OTP: ${generatedOTP}`,
          demo_otp: generatedOTP
        })
      }
    }
    
    if (action === 'verify') {
      global.otpStore = global.otpStore || {}
      const storedData = global.otpStore[phone]
      
      if (!storedData) {
        return NextResponse.json({
          success: false,
          error: 'OTP not found. Please request new OTP.'
        }, { status: 400 })
      }
      
      if (Date.now() > storedData.expires) {
        delete global.otpStore[phone]
        return NextResponse.json({
          success: false,
          error: 'OTP expired. Please request new OTP.'
        }, { status: 400 })
      }
      
      if (storedData.attempts <= 0) {
        delete global.otpStore[phone]
        return NextResponse.json({
          success: false,
          error: 'Too many failed attempts. Please request new OTP.'
        }, { status: 400 })
      }
      
      if (storedData.otp === otp) {
        delete global.otpStore[phone]
        
        // Create/login user
        const userData = {
          id: Date.now(),
          name: `User ${phone.slice(-4)}`,
          phone: phone,
          email: `${phone.replace('+', '')}@whatsapp.user`,
          role: 'farmer',
          loginMethod: 'whatsapp_otp'
        }
        
        return NextResponse.json({
          success: true,
          message: 'Login successful',
          user: userData,
          token: 'demo_token_' + Date.now()
        })
      } else {
        storedData.attempts--
        return NextResponse.json({
          success: false,
          error: 'Invalid OTP',
          attemptsLeft: storedData.attempts
        }, { status: 400 })
      }
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    
  } catch (error) {
    console.error('WhatsApp OTP Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
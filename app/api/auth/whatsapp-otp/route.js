import { NextResponse } from 'next/server'

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store OTPs temporarily
const otpStore = new Map()

export async function POST(request) {
  try {
    const { phone, action, otp } = await request.json()

    if (action === 'send') {
      if (!phone || !phone.startsWith('+')) {
        return NextResponse.json({ error: 'Invalid phone format. Use +91XXXXXXXXXX' }, { status: 400 })
      }

      const generatedOTP = generateOTP()
      
      otpStore.set(phone, {
        otp: generatedOTP,
        expires: Date.now() + 5 * 60 * 1000,
        attempts: 0
      })

      // Simulate WhatsApp API call
      console.log(`Sending OTP ${generatedOTP} to ${phone}`)
      
      return NextResponse.json({ 
        success: true, 
        message: 'OTP sent successfully via WhatsApp',
        debug: generatedOTP // Remove in production
      })
    }

    if (action === 'verify') {
      if (!otpStore.has(phone)) {
        return NextResponse.json({ error: 'OTP not found or expired' }, { status: 400 })
      }

      const storedData = otpStore.get(phone)
      
      if (Date.now() > storedData.expires) {
        otpStore.delete(phone)
        return NextResponse.json({ error: 'OTP expired' }, { status: 400 })
      }

      if (storedData.attempts >= 3) {
        otpStore.delete(phone)
        return NextResponse.json({ error: 'Too many attempts' }, { status: 400 })
      }

      if (storedData.otp === otp) {
        otpStore.delete(phone)
        
        const userData = {
          phone,
          verified: true,
          loginTime: new Date().toISOString(),
          name: 'User',
          role: 'farmer'
        }

        return NextResponse.json({ 
          success: true, 
          message: 'OTP verified successfully',
          user: userData
        })
      } else {
        storedData.attempts++
        otpStore.set(phone, storedData)
        return NextResponse.json({ 
          error: 'Invalid OTP',
          attemptsLeft: 3 - storedData.attempts 
        }, { status: 400 })
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    return NextResponse.json({ 
      error: 'Server error',
      details: error.message 
    }, { status: 500 })
  }
}
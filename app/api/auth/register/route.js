import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { name, email, phone, password, role } = await request.json()

    // Simple validation
    if (!name || !email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Name, email and password are required' 
      }, { status: 400 })
    }

    // Create user (in production, save to database)
    const user = {
      id: Date.now(),
      name,
      email,
      phone: phone || '',
      role: role || 'farmer',
      created_at: new Date().toISOString()
    }

    // Generate token (in production, use JWT)
    const token = 'token_' + Date.now()

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user,
      token
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Registration failed',
      details: error.message
    }, { status: 500 })
  }
}
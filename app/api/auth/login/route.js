import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Simple validation
    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email and password are required' 
      }, { status: 400 })
    }

    // Demo users for testing
    const demoUsers = [
      { id: 1, name: 'Super Admin', email: 'admin@beejhealth.com', password: 'admin123', role: 'superadmin' },
      { id: 2, name: 'Dr. Rajesh Kumar', email: 'expert@beejhealth.com', password: 'expert123', role: 'expert' },
      { id: 3, name: 'राम कुमार', email: 'farmer@beejhealth.com', password: 'farmer123', role: 'farmer' }
    ]

    // Find user
    const user = demoUsers.find(u => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid email or password' 
      }, { status: 401 })
    }

    // Generate token
    const token = 'token_' + Date.now()

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Login failed',
      details: error.message
    }, { status: 500 })
  }
}
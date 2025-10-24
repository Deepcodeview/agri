import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const action = body.action || 'login'
    
    // Test backend connectivity first
    const testResponse = await fetch('https://backend.cvframeiq.in/test.php')
    if (!testResponse.ok) {
      throw new Error('Backend server not responding')
    }
    
    const response = await fetch(`https://backend.cvframeiq.in/api/auth.php?action=${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    
    const result = await response.json()
    return NextResponse.json(result, { status: response.status })
    
  } catch (error) {
    console.error('Backend error:', error)
    return NextResponse.json({ success: false, error: 'Backend not accessible' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Testing backend connection to https://backend.cvframeiq.in/test.php')
    
    const response = await fetch('https://backend.cvframeiq.in/test.php', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Backend response status:', response.status)
    
    if (response.ok) {
      const result = await response.json()
      console.log('Backend result:', result)
      return NextResponse.json({ 
        success: true, 
        message: 'Backend is accessible from Vercel!',
        backend: result 
      })
    }
    
    return NextResponse.json({ 
      success: false, 
      error: `Backend returned status: ${response.status}` 
    })
    
  } catch (error) {
    console.error('Backend test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: `Connection failed: ${error.message}` 
    })
  }
}
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test with auth.php since test.php might not be uploaded
    const response = await fetch('https://backend.cvframeiq.in/api/auth.php', {
      method: 'OPTIONS'
    })
    
    return NextResponse.json({ 
      success: response.ok, 
      status: response.status,
      message: response.ok ? 'Backend accessible!' : 'Backend not accessible',
      url: 'https://backend.cvframeiq.in/api/auth.php'
    })
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    })
  }
}
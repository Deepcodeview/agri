import { NextRequest, NextResponse } from 'next/server'

const PHP_BACKEND_URL = process.env.PHP_BACKEND_URL || 'http://localhost/php-backend'

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${PHP_BACKEND_URL}/api/weather.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
    
  } catch (error) {
    console.error('Weather API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
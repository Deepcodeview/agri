import { NextRequest, NextResponse } from 'next/server'

const PHP_BACKEND_URL = process.env.PHP_BACKEND_URL || 'http://localhost/php-backend'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    
    const response = await fetch(`${PHP_BACKEND_URL}/api/farmer-consultations.php`, {
      method: 'GET',
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
    
  } catch (error) {
    console.error('Farmer Consultations API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
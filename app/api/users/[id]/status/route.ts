import { NextRequest, NextResponse } from 'next/server'

const PHP_BACKEND_URL = process.env.PHP_BACKEND_URL || 'http://localhost/php-backend'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')
    const body = await request.json()
    
    const response = await fetch(`${PHP_BACKEND_URL}/api/users.php/${params.id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
    
  } catch (error) {
    console.error('Update User Status API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
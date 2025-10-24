import { NextRequest, NextResponse } from 'next/server'

const PHP_BACKEND_URL = process.env.PHP_BACKEND_URL || 'http://localhost/php-backend'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')
    
    const response = await fetch(`${PHP_BACKEND_URL}/api/states.php/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
    
  } catch (error) {
    console.error('Delete State API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
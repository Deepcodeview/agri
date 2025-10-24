import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching users from backend...');
    
    const response = await fetch('https://backend.cvframeiq.in/api/users.php', {
      method: 'GET',
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Users API response status:', response.status);
    
    if (response.ok) {
      const result = await response.json()
      console.log('Users API result:', result);
      return NextResponse.json(result.data || [])
    }
    
    throw new Error(`Backend failed with status: ${response.status}`);
    
  } catch (error) {
    console.log('Users API error:', error.message);
    
    // Return demo data if backend fails
    const demoUsers = [
      { id: 1, name: 'राम कुमार', email: 'ram@example.com', role: 'farmer', status: 'active', joinDate: '2024-01-15' },
      { id: 2, name: 'श्याम सिंह', email: 'shyam@example.com', role: 'farmer', status: 'active', joinDate: '2024-01-16' },
      { id: 3, name: 'गीता देवी', email: 'geeta@example.com', role: 'farmer', status: 'inactive', joinDate: '2024-01-17' }
    ]
    
    return NextResponse.json(demoUsers)
  }
}
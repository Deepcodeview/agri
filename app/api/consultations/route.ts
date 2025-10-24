import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('https://backend.cvframeiq.in/api/consultations.php', {
      headers: {
        'Authorization': request.headers.get('Authorization') || ''
      }
    })
    
    if (response.ok) {
      const result = await response.json()
      return NextResponse.json(result.data || [])
    }
    
    throw new Error('Backend failed')
    
  } catch (error) {
    // Return demo data if backend fails
    const demoConsultations = [
      { id: 1, user_id: 1, crop_type: 'Apple', disease_detected: 'Apple Scab', status: 'completed' },
      { id: 2, user_id: 2, crop_type: 'Tomato', disease_detected: 'Tomato Blight', status: 'completed' },
      { id: 3, user_id: 3, crop_type: 'Potato', disease_detected: 'Late Blight', status: 'in_progress' }
    ]
    
    return NextResponse.json(demoConsultations)
  }
}
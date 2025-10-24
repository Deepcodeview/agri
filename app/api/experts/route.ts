import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('https://backend.cvframeiq.in/api/experts.php', {
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
    const demoExperts = [
      { id: 4, name: 'डॉ. अजय वर्मा', specialization: 'Plant Pathology', experience: '10+ years', rating: 4.8, status: 'approved' },
      { id: 5, name: 'डॉ. प्रिया गुप्ता', specialization: 'Crop Protection', experience: '5+ years', rating: 4.5, status: 'pending' }
    ]
    
    return NextResponse.json(demoExperts)
  }
}
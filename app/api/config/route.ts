import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (body.type === 'whatsapp') {
      return NextResponse.json({
        success: true,
        message: 'WhatsApp API configuration saved successfully',
        data: body.data
      })
    }
    
    return NextResponse.json({ error: 'Invalid configuration type' }, { status: 400 })
    
  } catch (error) {
    console.error('Config API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
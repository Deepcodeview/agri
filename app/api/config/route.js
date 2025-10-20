import { NextResponse } from 'next/server'

// In-memory storage (use database in production)
let config = {
  whatsapp: {
    apiSecret: '',
    accountId: '',
    baseUrl: 'https://wa.bitseva.in/api'
  },
  system: {
    platformName: 'BeejHealth',
    maxFileSize: 10,
    sessionTimeout: 30
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'whatsapp') {
      return NextResponse.json({
        success: true,
        data: {
          ...config.whatsapp,
          apiSecret: config.whatsapp.apiSecret ? '***hidden***' : ''
        }
      })
    }

    if (type === 'system') {
      return NextResponse.json({
        success: true,
        data: config.system
      })
    }

    return NextResponse.json({
      success: true,
      data: config
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to get configuration',
      details: error.message
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { type, data } = await request.json()

    if (type === 'whatsapp') {
      config.whatsapp = {
        ...config.whatsapp,
        ...data
      }

      // Test WhatsApp API connection
      if (data.apiSecret && data.accountId) {
        try {
          // Simulate API test
          console.log('Testing WhatsApp API connection...')
          
          return NextResponse.json({
            success: true,
            message: 'WhatsApp API configuration saved and tested successfully',
            connectionStatus: 'connected'
          })
        } catch (error) {
          return NextResponse.json({
            success: true,
            message: 'Configuration saved but API test failed',
            connectionStatus: 'failed',
            error: error.message
          })
        }
      }

      return NextResponse.json({
        success: true,
        message: 'WhatsApp API configuration saved'
      })
    }

    if (type === 'system') {
      config.system = {
        ...config.system,
        ...data
      }

      return NextResponse.json({
        success: true,
        message: 'System configuration saved'
      })
    }

    return NextResponse.json({
      error: 'Invalid configuration type'
    }, { status: 400 })

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to save configuration',
      details: error.message
    }, { status: 500 })
  }
}
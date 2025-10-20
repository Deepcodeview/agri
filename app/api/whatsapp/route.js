import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { action, phone, message, recipients, campaign } = await request.json()

    // Simulate WhatsApp API calls
    switch (action) {
      case 'send_consultation_notification':
        console.log(`Sending consultation notification to ${phone}: ${message}`)
        return NextResponse.json({ 
          success: true, 
          message: 'Consultation notification sent via WhatsApp',
          messageId: Date.now()
        })

      case 'send_bulk_notification':
        console.log(`Sending bulk notification to ${recipients.length} users: ${message}`)
        return NextResponse.json({ 
          success: true, 
          message: `Bulk notification sent to ${recipients.length} users`,
          campaignId: Date.now(),
          messageIds: recipients.map(() => Date.now() + Math.random())
        })

      case 'send_weather_alert':
        console.log(`Sending weather alert to ${phone}: ${message}`)
        return NextResponse.json({ 
          success: true, 
          message: 'Weather alert sent via WhatsApp',
          messageId: Date.now()
        })

      case 'send_expert_assignment':
        console.log(`Sending expert assignment to ${phone}: ${message}`)
        return NextResponse.json({ 
          success: true, 
          message: 'Expert assignment notification sent',
          messageId: Date.now()
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    return NextResponse.json({ 
      error: 'WhatsApp API error',
      details: error.message 
    }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'get_accounts':
        return NextResponse.json({
          success: true,
          data: [
            { id: 1, phone: '+918123456789', status: 'active', name: 'BeejHealth Main' },
            { id: 2, phone: '+918987654321', status: 'active', name: 'BeejHealth Support' }
          ]
        })

      case 'get_campaigns':
        return NextResponse.json({
          success: true,
          data: [
            { id: 1, name: 'Weather Alerts', status: 'active', sent: 1250, delivered: 1180 },
            { id: 2, name: 'Expert Notifications', status: 'active', sent: 890, delivered: 845 },
            { id: 3, name: 'Consultation Updates', status: 'paused', sent: 2340, delivered: 2280 }
          ]
        })

      case 'get_received_messages':
        return NextResponse.json({
          success: true,
          data: [
            { id: 1, from: '+918123456789', message: 'Need help with tomato disease', time: '10:30 AM' },
            { id: 2, from: '+918987654321', message: 'Thank you for the consultation', time: '09:45 AM' },
            { id: 3, from: '+918765432109', message: 'When is the next expert available?', time: '09:15 AM' }
          ]
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    return NextResponse.json({ 
      error: 'WhatsApp API error',
      details: error.message 
    }, { status: 500 })
  }
}
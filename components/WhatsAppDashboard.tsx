'use client'
import { useState, useEffect } from 'react'
import { MessageCircle, Send, Users, BarChart3, Settings, Phone, Bell, Download, Upload } from 'lucide-react'

export default function WhatsAppDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [accounts, setAccounts] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [receivedMessages, setReceivedMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWhatsAppData()
  }, [])

  const fetchWhatsAppData = async () => {
    try {
      const [accountsRes, campaignsRes, messagesRes] = await Promise.all([
        fetch('/api/whatsapp?action=get_accounts'),
        fetch('/api/whatsapp?action=get_campaigns'),
        fetch('/api/whatsapp?action=get_received_messages')
      ])

      const accountsData = await accountsRes.json()
      const campaignsData = await campaignsRes.json()
      const messagesData = await messagesRes.json()

      setAccounts(accountsData.data || [])
      setCampaigns(campaignsData.data || [])
      setReceivedMessages(messagesData.data || [])
    } catch (error) {
      console.error('Failed to fetch WhatsApp data:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendBulkNotification = async () => {
    const message = prompt('Enter notification message:')
    if (!message) return

    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_bulk_notification',
          message,
          recipients: ['+918123456789', '+918987654321'],
          campaign: 'Admin Notification'
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('Bulk notification sent successfully!')
      }
    } catch (error) {
      alert('Failed to send notification')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">WhatsApp Management</h2>
            <p className="text-neutral-600">Manage WhatsApp notifications and campaigns</p>
          </div>
        </div>
        <button 
          onClick={sendBulkNotification}
          className="btn-primary flex items-center"
        >
          <Send size={16} className="mr-2" />
          Send Bulk Notification
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <Phone className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{accounts.length}</p>
          <p className="text-sm text-neutral-600">Active Accounts</p>
        </div>
        <div className="card p-4 text-center">
          <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{campaigns.length}</p>
          <p className="text-sm text-neutral-600">Campaigns</p>
        </div>
        <div className="card p-4 text-center">
          <Send className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{campaigns.reduce((sum, c) => sum + c.sent, 0)}</p>
          <p className="text-sm text-neutral-600">Messages Sent</p>
        </div>
        <div className="card p-4 text-center">
          <Bell className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{receivedMessages.length}</p>
          <p className="text-sm text-neutral-600">Received Today</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-neutral-200 rounded-xl p-1">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'accounts', label: 'Accounts', icon: Phone },
          { id: 'campaigns', label: 'Campaigns', icon: Send },
          { id: 'messages', label: 'Messages', icon: MessageCircle }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-green-600 shadow-card' 
                : 'text-neutral-600 hover:text-neutral-800'
            }`}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Campaign Performance</h3>
            <div className="space-y-3">
              {campaigns.map(campaign => (
                <div key={campaign.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-sm text-neutral-600">{campaign.sent} sent, {campaign.delivered} delivered</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Messages</h3>
            <div className="space-y-3">
              {receivedMessages.map(msg => (
                <div key={msg.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-sm">{msg.from}</p>
                    <span className="text-xs text-neutral-500">{msg.time}</span>
                  </div>
                  <p className="text-sm text-neutral-600">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'accounts' && (
        <div className="card">
          <div className="p-6 border-b border-neutral-100">
            <h3 className="text-lg font-semibold">WhatsApp Accounts</h3>
          </div>
          <div className="p-6">
            <div className="grid gap-4">
              {accounts.map(account => (
                <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-sm text-neutral-600">{account.phone}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    account.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {account.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="card">
          <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold">WhatsApp Campaigns</h3>
            <button className="btn-primary">Create Campaign</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="text-left p-4 font-medium">Campaign</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Sent</th>
                  <th className="text-left p-4 font-medium">Delivered</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(campaign => (
                  <tr key={campaign.id} className="border-t">
                    <td className="p-4 font-medium">{campaign.name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="p-4">{campaign.sent}</td>
                    <td className="p-4">{campaign.delivered}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button className="btn-secondary px-3 py-1 text-sm">Edit</button>
                        <button className="text-red-600 hover:bg-red-50 px-3 py-1 rounded text-sm">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="card">
          <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Received Messages</h3>
            <div className="flex space-x-2">
              <button className="btn-secondary flex items-center">
                <Download size={16} className="mr-2" />
                Export
              </button>
              <button className="btn-secondary flex items-center">
                <Upload size={16} className="mr-2" />
                Import
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {receivedMessages.map(msg => (
              <div key={msg.id} className="p-4 border rounded-lg hover:bg-neutral-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{msg.from}</p>
                      <p className="text-xs text-neutral-500">{msg.time}</p>
                    </div>
                  </div>
                  <button className="btn-secondary px-3 py-1 text-sm">Reply</button>
                </div>
                <p className="text-neutral-700 ml-11">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
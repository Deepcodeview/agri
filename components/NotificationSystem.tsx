'use client'
import { useState, useEffect } from 'react'
import { Bell, X, CheckCircle, AlertTriangle, Info, MessageSquare } from 'lucide-react'

interface Notification {
  id: number
  type: 'success' | 'warning' | 'info' | 'message'
  title: string
  message: string
  timestamp: string
  read: boolean
  userId?: number
}

interface NotificationSystemProps {
  userRole: string
  userName: string
}

export default function NotificationSystem({ userRole, userName }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'success',
      title: 'Consultation Completed',
      message: 'Your Apple disease diagnosis is ready. Confidence: 96.7%',
      timestamp: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Expert Available',
      message: 'Dr. Rajesh Kumar is now available for consultation',
      timestamp: '5 minutes ago',
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'Weather Alert',
      message: 'Heavy rain expected. Protect your crops from fungal diseases',
      timestamp: '1 hour ago',
      read: true
    }
  ])

  const [showNotifications, setShowNotifications] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'message': return <MessageSquare className="w-5 h-5 text-blue-600" />
      default: return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-xl transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-neutral-200 z-50">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="font-semibold text-neutral-900">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 hover:bg-neutral-100 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-neutral-600">No notifications</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`p-4 border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer ${
                    !notification.read ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {getIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium ${!notification.read ? 'text-neutral-900' : 'text-neutral-700'}`}>
                        {notification.title}
                      </h4>
                      <p className="text-sm text-neutral-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-neutral-500 mt-2">{notification.timestamp}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
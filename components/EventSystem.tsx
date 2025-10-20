'use client'
import { useState, useEffect } from 'react'
import { Calendar, User, Activity, AlertCircle, CheckCircle, Clock, Filter, Search } from 'lucide-react'

interface Event {
  id: number
  type: 'user_registration' | 'user_login' | 'consultation_created' | 'consultation_completed' | 'expert_approved' | 'system_action'
  user: string
  action: string
  details: string
  timestamp: string
  severity: 'info' | 'success' | 'warning' | 'error'
}

interface EventSystemProps {
  userRole: string
}

export default function EventSystem({ userRole }: EventSystemProps) {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      type: 'user_registration',
      user: 'राम कुमार',
      action: 'New User Registration',
      details: 'Farmer registered from Punjab',
      timestamp: '2024-01-15 10:30:00',
      severity: 'success'
    },
    {
      id: 2,
      type: 'consultation_created',
      user: 'सुनीता देवी',
      action: 'Consultation Started',
      details: 'Tomato disease consultation with Dr. Rajesh Kumar',
      timestamp: '2024-01-15 11:15:00',
      severity: 'info'
    },
    {
      id: 3,
      type: 'expert_approved',
      user: 'Dr. Priya Sharma',
      action: 'Expert Approved',
      details: 'Agricultural expert approved by Super Admin',
      timestamp: '2024-01-15 12:00:00',
      severity: 'success'
    },
    {
      id: 4,
      type: 'consultation_completed',
      user: 'राम कुमार',
      action: 'Consultation Completed',
      details: 'Apple scab diagnosis completed with 85.4% confidence',
      timestamp: '2024-01-15 14:30:00',
      severity: 'success'
    },
    {
      id: 5,
      type: 'system_action',
      user: 'System',
      action: 'Database Backup',
      details: 'Automated daily backup completed successfully',
      timestamp: '2024-01-15 23:00:00',
      severity: 'info'
    },
    {
      id: 6,
      type: 'user_login',
      user: 'Dr. Rajesh Kumar',
      action: 'Expert Login',
      details: 'Expert logged in from mobile device',
      timestamp: '2024-01-16 08:15:00',
      severity: 'info'
    }
  ])

  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events)
  const [filterType, setFilterType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => {
    let filtered = events

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.details.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter(event => 
        event.timestamp.startsWith(dateFilter)
      )
    }

    setFilteredEvents(filtered.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ))
  }, [events, filterType, searchTerm, dateFilter])

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'user_registration': return <User className="w-5 h-5" />
      case 'user_login': return <Activity className="w-5 h-5" />
      case 'consultation_created': return <Calendar className="w-5 h-5" />
      case 'consultation_completed': return <CheckCircle className="w-5 h-5" />
      case 'expert_approved': return <CheckCircle className="w-5 h-5" />
      case 'system_action': return <AlertCircle className="w-5 h-5" />
      default: return <Clock className="w-5 h-5" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const addEvent = (type: Event['type'], user: string, action: string, details: string, severity: Event['severity'] = 'info') => {
    const newEvent: Event = {
      id: Date.now(),
      type,
      user,
      action,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      severity
    }
    setEvents(prev => [newEvent, ...prev])
  }

  // Auto-generate events for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const demoEvents = [
        { type: 'user_login' as const, user: 'किसान राज', action: 'User Login', details: 'Farmer logged in from Android app', severity: 'info' as const },
        { type: 'consultation_created' as const, user: 'मीरा देवी', action: 'New Consultation', details: 'Potato late blight consultation started', severity: 'info' as const },
        { type: 'system_action' as const, user: 'System', action: 'AI Model Update', details: 'Plant disease model accuracy improved to 94.2%', severity: 'success' as const }
      ]
      
      const randomEvent = demoEvents[Math.floor(Math.random() * demoEvents.length)]
      addEvent(randomEvent.type, randomEvent.user, randomEvent.action, randomEvent.details, randomEvent.severity)
    }, 30000) // Add new event every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (userRole !== 'superadmin') {
    return null // Only show to super admin
  }

  return (
    <div className="card">
      <div className="p-6 border-b border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Activity className="w-6 h-6 mr-2 text-blue-600" />
            System Events & Activity Log
          </h2>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Live Monitoring
            </span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field w-full"
          >
            <option value="all">All Events</option>
            <option value="user_registration">User Registration</option>
            <option value="user_login">User Login</option>
            <option value="consultation_created">Consultations</option>
            <option value="expert_approved">Expert Actions</option>
            <option value="system_action">System Actions</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="input-field w-full"
          />

          <button
            onClick={() => {
              setFilterType('all')
              setSearchTerm('')
              setDateFilter('')
            }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            <Activity className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-700 mb-2">No Events Found</h3>
            <p className="text-neutral-500">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {filteredEvents.map(event => (
              <div key={event.id} className="p-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${getSeverityColor(event.severity)}`}>
                    {getEventIcon(event.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-neutral-900">{event.action}</h4>
                      <span className="text-sm text-neutral-500">{event.timestamp}</span>
                    </div>
                    
                    <p className="text-sm text-neutral-600 mb-1">
                      <span className="font-medium">User:</span> {event.user}
                    </p>
                    
                    <p className="text-sm text-neutral-600">{event.details}</p>
                  </div>
                  
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.severity === 'success' ? 'bg-green-100 text-green-800' :
                    event.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    event.severity === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {event.severity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event Statistics */}
      <div className="p-4 bg-neutral-50 border-t border-neutral-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{events.length}</p>
            <p className="text-sm text-neutral-600">Total Events</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {events.filter(e => e.severity === 'success').length}
            </p>
            <p className="text-sm text-neutral-600">Success</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">
              {events.filter(e => e.severity === 'warning').length}
            </p>
            <p className="text-sm text-neutral-600">Warnings</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">
              {events.filter(e => e.severity === 'error').length}
            </p>
            <p className="text-sm text-neutral-600">Errors</p>
          </div>
        </div>
      </div>
    </div>
  )
}
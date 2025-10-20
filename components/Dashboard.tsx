'use client'
import { useState, useEffect } from 'react'
import { Users, FileText, Activity, TrendingUp, LogOut, Leaf, Bell } from 'lucide-react'
import NotificationSystem from './NotificationSystem'
import WeatherWidget from './WeatherWidget'
import CropCalendar from './CropCalendar'
import HelpSupport from './HelpSupport'
import ConsultationWorkflow from './ConsultationWorkflow'
import ModernConsultationDashboard from './ModernConsultationDashboard'

interface DashboardProps {
  user: any
  onLogout: () => void
  onStartConsultation?: () => void
}

export default function Dashboard({ user, onLogout, onStartConsultation }: DashboardProps) {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showConsultation, setShowConsultation] = useState(false)
  const [showReports, setShowReports] = useState(false)
  const [showExperts, setShowExperts] = useState(false)
  const [showWeatherAlerts, setShowWeatherAlerts] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Leaf className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Leaf className="h-8 w-8 text-green-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">BeejHealth</h1>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationSystem userRole={user.role} userName={user.name} />
            <span className="text-gray-600">Welcome, {user.name}</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {user.role}
            </span>
            <button onClick={onLogout} className="btn-secondary flex items-center">
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.totalUsers || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Consultations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.totalConsultations || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">System Status</p>
                <p className="text-2xl font-bold text-green-600">
                  {dashboardData?.systemHealth?.status || 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.systemHealth?.uptime ? 
                    formatUptime(dashboardData.systemHealth.uptime) : '0h 0m'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <WeatherWidget />
          <CropCalendar />
          <div className="card p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => onStartConsultation?.()}
                className="btn-primary w-full"
              >
                Start New Consultation
              </button>
              <button 
                onClick={() => setShowReports(true)}
                className="btn-secondary w-full"
              >
                View My Reports
              </button>
              <button 
                onClick={() => setShowExperts(true)}
                className="btn-secondary w-full"
              >
                Find Experts
              </button>
              <button 
                onClick={() => setShowWeatherAlerts(true)}
                className="btn-secondary w-full"
              >
                Weather Alerts
              </button>
            </div>
          </div>
        </div>

        <ConsultationWorkflow userRole="farmer" userId={1} userName={user.name} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Consultation Completed</p>
                  <p className="text-sm text-gray-600">Apple - Scab Disease</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Today</p>
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Disease Statistics */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Diseases Detected</h3>
            <div className="space-y-3">
              {dashboardData?.diseaseStats?.length > 0 ? (
                dashboardData.diseaseStats.map((stat: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700">{stat.disease || 'Unknown'}</span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                      {stat.count} cases
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No disease data available</p>
              )}
            </div>
          </div>
        </div>

        <HelpSupport />
      </div>
      
      {/* Quick Action Modals */}
      {showReports && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6">
            <h3 className="text-xl font-bold mb-4">My Reports</h3>
            <div className="space-y-3 mb-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">Apple - Early Blight</h4>
                <p className="text-sm text-gray-600">Consultation Date: Today</p>
                <p className="text-sm text-green-600">Status: Treated</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">Tomato - Leaf Spot</h4>
                <p className="text-sm text-gray-600">Consultation Date: Yesterday</p>
                <p className="text-sm text-orange-600">Status: In Progress</p>
              </div>
            </div>
            <button onClick={() => setShowReports(false)} className="btn-primary">Close</button>
          </div>
        </div>
      )}
      
      {showExperts && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Find Experts</h3>
            <div className="space-y-3 mb-6">
              <div className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">Dr. Rajesh Kumar</h4>
                  <p className="text-sm text-gray-600">Plant Pathology Expert</p>
                  <p className="text-sm text-green-600">Available Now</p>
                </div>
                <button className="btn-primary">Connect</button>
              </div>
              <div className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">Dr. Priya Sharma</h4>
                  <p className="text-sm text-gray-600">Crop Disease Specialist</p>
                  <p className="text-sm text-orange-600">Available in 2 hours</p>
                </div>
                <button className="btn-secondary">Schedule</button>
              </div>
            </div>
            <button onClick={() => setShowExperts(false)} className="btn-primary">Close</button>
          </div>
        </div>
      )}
      
      {showWeatherAlerts && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Weather Alerts</h3>
            <div className="space-y-3 mb-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800">⚠️ Heavy Rain Alert</h4>
                <p className="text-sm text-red-600">Expected heavy rainfall in next 24 hours</p>
                <p className="text-xs text-red-500">Protect your crops from waterlogging</p>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800">🌡️ Temperature Drop</h4>
                <p className="text-sm text-yellow-600">Temperature may drop to 5°C tonight</p>
                <p className="text-xs text-yellow-500">Consider frost protection measures</p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800">☀️ Good Weather</h4>
                <p className="text-sm text-green-600">Perfect conditions for spraying pesticides</p>
                <p className="text-xs text-green-500">Wind speed: 5 km/h, Humidity: 60%</p>
              </div>
            </div>
            <button onClick={() => setShowWeatherAlerts(false)} className="btn-primary">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
'use client'
import { useState, useEffect } from 'react'
import { Users, FileText, Activity, TrendingUp, LogOut, Leaf, Bell, Camera, History, BarChart3, User, RefreshCw, Calendar, MapPin, Thermometer, Droplets, Wind, Sun, CloudRain, AlertTriangle, CheckCircle, Clock, MessageSquare } from 'lucide-react'
import NotificationSystem from './NotificationSystem'
import WeatherWidget from './WeatherWidget'
import CropCalendar from './CropCalendar'
import HelpSupport from './HelpSupport'
import ConsultationWorkflow from './ConsultationWorkflow'
import ModernConsultationDashboard from './ModernConsultationDashboard'
import API from '../lib/api'

interface DashboardProps {
  user: any
  onLogout: () => void
  onStartConsultation?: () => void
}

export default function Dashboard({ user, onLogout, onStartConsultation }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [myConsultations, setMyConsultations] = useState([])
  const [weatherData, setWeatherData] = useState(null)
  const [cropRecommendations, setCropRecommendations] = useState([])
  const [showConsultation, setShowConsultation] = useState(false)
  const [showReports, setShowReports] = useState(false)
  const [showExperts, setShowExperts] = useState(false)
  const [showWeatherAlerts, setShowWeatherAlerts] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      // Load dashboard data
      const dashboardResponse = await fetch('/api/farmer/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (dashboardResponse.ok) {
        const data = await dashboardResponse.json()
        setDashboardData(data)
      }
      
      // Load my consultations
      const consultationsResponse = await fetch('/api/farmer/consultations', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (consultationsResponse.ok) {
        const consultations = await consultationsResponse.json()
        setMyConsultations(consultations)
      }
      
      // Load weather data
      const weatherResponse = await fetch('/api/weather', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (weatherResponse.ok) {
        const weather = await weatherResponse.json()
        setWeatherData(weather)
      }
      
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
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-neutral-200 rounded-xl p-1 mb-6">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'consultations', label: 'My Consultations', icon: MessageSquare },
            { id: 'history', label: 'History', icon: History },
            { id: 'weather', label: 'Weather', icon: Sun },
            { id: 'profile', label: 'Profile', icon: User }
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
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">My Consultations</p>
                    <p className="text-2xl font-bold">{myConsultations.length}</p>
                    <p className="text-green-200 text-xs">Total reports</p>
                  </div>
                  <FileText className="h-8 w-8 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Pending Reports</p>
                    <p className="text-2xl font-bold">{myConsultations.filter(c => c.status === 'pending').length}</p>
                    <p className="text-blue-200 text-xs">Awaiting results</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Diseases Detected</p>
                    <p className="text-2xl font-bold">{dashboardData?.diseaseStats?.length || 0}</p>
                    <p className="text-orange-200 text-xs">Different types</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Success Rate</p>
                    <p className="text-2xl font-bold">94%</p>
                    <p className="text-purple-200 text-xs">Treatment success</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-200" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <WeatherWidget />
              <CropCalendar />
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-neutral-900">Quick Actions</h3>
                  <button onClick={fetchDashboardData} className="p-2 text-gray-500 hover:text-gray-700">
                    <RefreshCw size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  <button 
                    onClick={() => onStartConsultation?.()}
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    <Camera size={16} className="mr-2" />
                    Start New Consultation
                  </button>
                  <button 
                    onClick={() => setActiveTab('consultations')}
                    className="btn-secondary w-full flex items-center justify-center"
                  >
                    <FileText size={16} className="mr-2" />
                    View My Reports
                  </button>
                  <button 
                    onClick={() => setShowExperts(true)}
                    className="btn-secondary w-full flex items-center justify-center"
                  >
                    <Users size={16} className="mr-2" />
                    Find Experts
                  </button>
                  <button 
                    onClick={() => setActiveTab('weather')}
                    className="btn-secondary w-full flex items-center justify-center"
                  >
                    <Sun size={16} className="mr-2" />
                    Weather Alerts
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {myConsultations.slice(0, 3).map((consultation, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{consultation.crop_type}</p>
                        <p className="text-sm text-gray-600">{consultation.disease_detected || 'Analysis pending'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{new Date(consultation.created_at).toLocaleDateString()}</p>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          consultation.status === 'completed' ? 'bg-green-100 text-green-800' :
                          consultation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {consultation.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {myConsultations.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No consultations yet</p>
                  )}
                </div>
              </div>

              {/* Disease Statistics */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">My Disease History</h3>
                <div className="space-y-3">
                  {dashboardData?.diseaseStats?.length > 0 ? (
                    dashboardData.diseaseStats.map((stat: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-700">{stat.disease || 'Unknown'}</span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                          {stat.count} times
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No disease history available</p>
                  )}
                </div>
              </div>
            </div>
            
            <HelpSupport />
          </div>
        )}
        
        {/* Consultations Tab */}
        {activeTab === 'consultations' && (
          <div className="space-y-6">
            <ConsultationWorkflow userRole="farmer" userId={user.id} userName={user.name} />
          </div>
        )}
        
        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Consultation History</h2>
              <p className="text-gray-600 mt-1">Your past consultations and reports</p>
            </div>
            <div className="divide-y">
              {myConsultations.map(consultation => (
                <div key={consultation.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-semibold text-gray-900 mr-3">{consultation.crop_type}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          consultation.status === 'completed' ? 'bg-green-100 text-green-800' :
                          consultation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {consultation.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">
                        Disease: {consultation.disease_detected || 'Analysis pending'}
                      </p>
                      {consultation.confidence_score && (
                        <p className="text-sm text-gray-500 mb-2">
                          Confidence: {consultation.confidence_score}%
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        Date: {new Date(consultation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="btn-secondary">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Weather Tab */}
        {activeTab === 'weather' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-500 text-white rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Temperature</p>
                    <p className="text-2xl font-bold">{weatherData?.temperature || 25}°C</p>
                  </div>
                  <Thermometer className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              <div className="bg-green-500 text-white rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Humidity</p>
                    <p className="text-2xl font-bold">{weatherData?.humidity || 65}%</p>
                  </div>
                  <Droplets className="h-8 w-8 text-green-200" />
                </div>
              </div>
              <div className="bg-purple-500 text-white rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Wind Speed</p>
                    <p className="text-2xl font-bold">{weatherData?.windSpeed || 12} km/h</p>
                  </div>
                  <Wind className="h-8 w-8 text-purple-200" />
                </div>
              </div>
              <div className="bg-orange-500 text-white rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Condition</p>
                    <p className="text-lg font-bold">{weatherData?.condition || 'Sunny'}</p>
                  </div>
                  <Sun className="h-8 w-8 text-orange-200" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Weather Alerts & Recommendations</h3>
              <div className="space-y-3">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 flex items-center">
                    <AlertTriangle size={16} className="mr-2" />
                    Heavy Rain Alert
                  </h4>
                  <p className="text-sm text-red-600">Expected heavy rainfall in next 24 hours</p>
                  <p className="text-xs text-red-500 mt-1">Protect your crops from waterlogging</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 flex items-center">
                    <CheckCircle size={16} className="mr-2" />
                    Good Weather for Spraying
                  </h4>
                  <p className="text-sm text-green-600">Perfect conditions for pesticide application</p>
                  <p className="text-xs text-green-500 mt-1">Low wind speed and optimal humidity</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Farmer Profile</h2>
              <p className="text-gray-600 mt-1">Manage your personal information</p>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input type="text" value={user.name} className="input-field w-full" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" value={user.email} className="input-field w-full" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input type="tel" value={user.phone} className="input-field w-full" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input type="text" placeholder="Enter your location" className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Farm Size (acres)</label>
                  <input type="number" placeholder="Enter farm size" className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Crops</label>
                  <input type="text" placeholder="e.g., Tomato, Potato, Apple" className="input-field w-full" />
                </div>
              </div>
              <div className="mt-6">
                <button className="btn-primary">Update Profile</button>
              </div>
            </div>
          </div>
        )}
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
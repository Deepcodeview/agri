'use client'
import { useState, useEffect } from 'react'
import { Users, UserCheck, Settings, Trash2, Edit, Plus, Shield, Database, Activity, Eye, BarChart3, TrendingUp, AlertTriangle, Download, Upload, RefreshCw, Calendar, MapPin, Bell, MessageCircle } from 'lucide-react'
import EventSystem from './EventSystem'
import ConsultationWorkflow from './ConsultationWorkflow'
import WhatsAppDashboard from './WhatsAppDashboard'
import { API_CONFIG } from '../lib/config'

interface SuperAdminDashboardProps {
  user: any
  onLogout: () => void
}

export default function SuperAdminDashboard({ user, onLogout }: SuperAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard')
  
  // Load data from API on component mount and when tab changes
  useEffect(() => {
    loadDashboardData()
  }, [])
  
  useEffect(() => {
    // Reload data when switching tabs to ensure fresh data
    if (activeTab !== 'dashboard') {
      loadDashboardData()
    }
  }, [activeTab])
  
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      console.log('Loading dashboard data with token:', token ? 'Present' : 'Missing')
      
      // Load users from real backend
      const usersResponse = await fetch('https://backend.cvframeiq.in/api/users.php', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      console.log('Users response status:', usersResponse.status)
      
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        console.log('Users data received:', usersData)
        setUsers(Array.isArray(usersData.data) ? usersData.data : [])
      } else {
        console.log('Failed to load users from backend')
        setUsers([])
      }
      
      // Load experts from real backend
      const expertsResponse = await fetch('https://backend.cvframeiq.in/api/experts.php', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (expertsResponse.ok) {
        const expertsData = await expertsResponse.json()
        setExperts(Array.isArray(expertsData.data) ? expertsData.data : [])
      }
      
      // Load consultations from real backend
      const consultationsResponse = await fetch('https://backend.cvframeiq.in/api/consultations.php', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (consultationsResponse.ok) {
        const consultationsData = await consultationsResponse.json()
        setConsultations(Array.isArray(consultationsData.data) ? consultationsData.data : [])
      }
      
      // Load states from real backend
      const statesResponse = await fetch('https://backend.cvframeiq.in/api/states.php', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (statesResponse.ok) {
        const statesData = await statesResponse.json()
        setStates(Array.isArray(statesData.data) ? statesData.data : [])
      }
      
      // Load crops from real backend
      const cropsResponse = await fetch('https://backend.cvframeiq.in/api/crops.php', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (cropsResponse.ok) {
        const cropsData = await cropsResponse.json()
        setCrops(Array.isArray(cropsData.data) ? cropsData.data : [])
      }
      
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setDataLoadError(true)
      
      // Set empty arrays if backend fails
      setUsers([])
      setExperts([])
      setConsultations([])
      
      console.log('⚠️ Backend connection failed.')
    } finally {
      setLoading(false)
    }
  }
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [dataLoadError, setDataLoadError] = useState(false)
  
  const [experts, setExperts] = useState([])

  const [consultations, setConsultations] = useState([])

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [states, setStates] = useState([
    { id: 1, name: 'Punjab', code: 'PB', districts: 22, status: 'active' },
    { id: 2, name: 'Haryana', code: 'HR', districts: 22, status: 'active' },
    { id: 3, name: 'Uttar Pradesh', code: 'UP', districts: 75, status: 'active' },
    { id: 4, name: 'Maharashtra', code: 'MH', districts: 36, status: 'active' },
    { id: 5, name: 'Karnataka', code: 'KA', districts: 30, status: 'active' }
  ])
  const [crops, setCrops] = useState([
    { id: 1, name: 'Apple', emoji: '🍎', category: 'Fruit', diseases: 8, status: 'active' },
    { id: 2, name: 'Orange', emoji: '🍊', category: 'Fruit', diseases: 6, status: 'active' },
    { id: 3, name: 'Tomato', emoji: '🍅', category: 'Vegetable', diseases: 12, status: 'active' },
    { id: 4, name: 'Potato', emoji: '🥔', category: 'Vegetable', diseases: 9, status: 'active' },
    { id: 5, name: 'Corn', emoji: '🌽', category: 'Cereal', diseases: 7, status: 'active' },
    { id: 6, name: 'Grape', emoji: '🍇', category: 'Fruit', diseases: 10, status: 'active' },
    { id: 7, name: 'Rice', emoji: '🌾', category: 'Cereal', diseases: 15, status: 'active' },
    { id: 8, name: 'Wheat', emoji: '🌾', category: 'Cereal', diseases: 11, status: 'active' }
  ])
  const [showStateModal, setShowStateModal] = useState(false)
  const [showCropModal, setShowCropModal] = useState(false)
  const [editingState, setEditingState] = useState<any>(null)
  const [editingCrop, setEditingCrop] = useState<any>(null)
  const [whatsappConfig, setWhatsappConfig] = useState({
    apiSecret: localStorage.getItem('whatsapp_secret') || '',
    accountId: localStorage.getItem('whatsapp_account_id') || '',
    baseUrl: localStorage.getItem('whatsapp_base_url') || 'https://wa.bitseva.in/api'
  })
  const [analytics, setAnalytics] = useState({
    dailyUsers: [120, 135, 148, 162, 180, 195, 210],
    consultationsToday: 45,
    revenueThisMonth: 125000,
    systemHealth: 98.5,
    activeExperts: 12,
    pendingReports: 8,
    topDiseases: [
      { name: 'Early Blight', count: 45, trend: '+12%' },
      { name: 'Powdery Mildew', count: 38, trend: '+8%' },
      { name: 'Leaf Spot', count: 32, trend: '-5%' }
    ],
    regionStats: [
      { state: 'Punjab', users: 450, consultations: 120 },
      { state: 'Haryana', users: 380, consultations: 95 },
      { state: 'UP', users: 620, consultations: 180 }
    ]
  })
  const [systemLogs, setSystemLogs] = useState([
    { id: 1, type: 'info', message: 'System backup completed', time: '10:30 AM', user: 'System' },
    { id: 2, type: 'warning', message: 'High server load detected', time: '10:15 AM', user: 'Monitor' },
    { id: 3, type: 'success', message: 'New expert approved', time: '09:45 AM', user: 'Admin' }
  ])
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Server Maintenance', message: 'Scheduled for tonight 2 AM', type: 'info', read: false },
    { id: 2, title: 'New Expert Registration', message: '3 experts pending approval', type: 'warning', read: false }
  ])

  const handleDeleteUser = async (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const deletedUser = users.find(u => u.id === userId)
          console.log(`Event: User ${deletedUser?.name} deleted by Super Admin`)
          console.log('User deleted successfully')
          loadDashboardData()
        } else {
          const error = await response.json()
          console.log(`Error: ${error.message || 'Failed to delete user'}`)
        }
      } catch (error) {
        console.error('Delete user error:', error)
        console.log('Network error. Please try again.')
      }
    }
  }

  const handleToggleUserStatus = async (userId: number) => {
    const user = users.find(u => u.id === userId)
    const newStatus = user?.status === 'active' ? 'inactive' : 'active'
    
    try {
      const response = await fetch(`/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        console.log(`Event: User ${user?.name} status changed to ${newStatus}`)
        console.log(`User status updated to ${newStatus}`)
        loadDashboardData()
      } else {
        const error = await response.json()
        console.log(`Error: ${error.message || 'Failed to update user status'}`)
      }
    } catch (error) {
      console.error('Update user status error:', error)
      console.log('Network error. Please try again.')
    }
  }

  const handleApproveExpert = async (expertId: number) => {
    try {
      const response = await fetch(`/api/experts/${expertId}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const expert = experts.find(e => e.id === expertId)
        console.log(`Event: Expert ${expert?.name} approved by Super Admin`)
        console.log('Expert approved successfully')
        loadDashboardData()
      } else {
        const error = await response.json()
        console.log(`Error: ${error.message || 'Failed to approve expert'}`)
      }
    } catch (error) {
      console.error('Approve expert error:', error)
      console.log('Network error. Please try again.')
    }
  }

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalExperts: experts.length,
    pendingExperts: experts.filter(e => e.status === 'pending').length,
    totalConsultations: consultations.length,
    completedConsultations: consultations.filter(c => c.status === 'completed').length
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Super Admin Panel</h1>
              <p className="text-red-100 text-sm">BeejHealth System Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {dataLoadError && (
              <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-100 text-xs">Backend Offline</span>
              </div>
            )}
            <div className="relative">
              <Bell className="w-6 h-6 text-white cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            </div>
            <span className="text-white">Admin: {user.name}</span>
            <span className="px-3 py-1 bg-red-800 text-white rounded-full text-sm font-medium">
              SUPER ADMIN
            </span>
            <button onClick={onLogout} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="card p-4 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-neutral-900">{stats.totalUsers}</p>
            <p className="text-sm text-neutral-600">Total Users</p>
          </div>
          <div className="card p-4 text-center">
            <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-neutral-900">{stats.activeUsers}</p>
            <p className="text-sm text-neutral-600">Active Users</p>
          </div>
          <div className="card p-4 text-center">
            <UserCheck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-neutral-900">{stats.totalExperts}</p>
            <p className="text-sm text-neutral-600">Total Experts</p>
          </div>
          <div className="card p-4 text-center">
            <Settings className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-neutral-900">{stats.pendingExperts}</p>
            <p className="text-sm text-neutral-600">Pending Approval</p>
          </div>
          <div className="card p-4 text-center">
            <Database className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-neutral-900">{stats.totalConsultations}</p>
            <p className="text-sm text-neutral-600">Consultations</p>
          </div>
          <div className="card p-4 text-center">
            <Eye className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-neutral-900">{stats.completedConsultations}</p>
            <p className="text-sm text-neutral-600">Completed</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-neutral-200 rounded-xl p-1 mb-6 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'experts', label: 'Experts', icon: UserCheck },
            { id: 'states', label: 'States', icon: MapPin },
            { id: 'crops', label: 'Crops', icon: Database },
            { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'system', label: 'System', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-red-600 shadow-card' 
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Advanced Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Real-time Analytics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Today's Consultations</p>
                    <p className="text-2xl font-bold">{analytics.consultationsToday}</p>
                    <p className="text-blue-200 text-xs">+15% from yesterday</p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-200" />
                </div>
              </div>
              <div className="card p-4 bg-gradient-to-r from-green-500 to-green-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Revenue (Month)</p>
                    <p className="text-2xl font-bold">₹{(analytics.revenueThisMonth/1000).toFixed(0)}K</p>
                    <p className="text-green-200 text-xs">+22% growth</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-200" />
                </div>
              </div>
              <div className="card p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">System Health</p>
                    <p className="text-2xl font-bold">{analytics.systemHealth}%</p>
                    <p className="text-purple-200 text-xs">All systems operational</p>
                  </div>
                  <Shield className="w-8 h-8 text-purple-200" />
                </div>
              </div>
              <div className="card p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Active Experts</p>
                    <p className="text-2xl font-bold">{analytics.activeExperts}</p>
                    <p className="text-orange-200 text-xs">Online now</p>
                  </div>
                  <UserCheck className="w-8 h-8 text-orange-200" />
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Top Diseases Chart */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Top Diseases This Week</h3>
                <div className="space-y-3">
                  {analytics.topDiseases.map((disease, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div>
                        <p className="font-medium">{disease.name}</p>
                        <p className="text-sm text-neutral-600">{disease.count} cases</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        disease.trend.startsWith('+') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {disease.trend}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regional Statistics */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Regional Performance</h3>
                <div className="space-y-3">
                  {analytics.regionStats.map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{region.state}</p>
                          <p className="text-sm text-neutral-600">{region.users} users</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{region.consultations}</p>
                        <p className="text-xs text-neutral-500">consultations</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* System Logs */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">System Activity Logs</h3>
                <button className="btn-secondary flex items-center">
                  <RefreshCw size={16} className="mr-2" />
                  Refresh
                </button>
              </div>
              <div className="space-y-2">
                {systemLogs.map(log => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        log.type === 'success' ? 'bg-green-500' : 
                        log.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium">{log.message}</p>
                        <p className="text-xs text-neutral-500">by {log.user}</p>
                      </div>
                    </div>
                    <span className="text-xs text-neutral-500">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Management */}
        {activeTab === 'users' && (
          <div className="card">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold">User Management</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={loadDashboardData}
                  className="btn-secondary flex items-center"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Refresh
                </button>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="btn-primary flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Add User
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-neutral-700">Name</th>
                    <th className="text-left p-4 font-medium text-neutral-700">Email</th>
                    <th className="text-left p-4 font-medium text-neutral-700">Role</th>
                    <th className="text-left p-4 font-medium text-neutral-700">Status</th>
                    <th className="text-left p-4 font-medium text-neutral-700">Join Date</th>
                    <th className="text-left p-4 font-medium text-neutral-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-t border-neutral-100">
                      <td className="p-4 font-medium">{user.name}</td>
                      <td className="p-4 text-neutral-600">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'expert' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-600">{user.joinDate}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={`p-2 rounded-lg ${
                              user.status === 'active' 
                                ? 'text-red-600 hover:bg-red-50' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                          >
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Experts Management */}
        {activeTab === 'experts' && (
          <div className="card">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Expert Management</h2>
              <button 
                onClick={loadDashboardData}
                className="btn-secondary flex items-center"
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh
              </button>
            </div>
            <div className="p-6 space-y-4">
              {experts.map(expert => (
                <div key={expert.id} className="border border-neutral-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{expert.name}</h3>
                      <p className="text-neutral-600">{expert.specialization}</p>
                      <p className="text-sm text-neutral-500">Experience: {expert.experience} | Rating: {expert.rating}⭐</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        expert.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {expert.status}
                      </span>
                      {expert.status === 'pending' && (
                        <button
                          onClick={() => handleApproveExpert(expert.id)}
                          className="btn-primary px-4 py-2"
                        >
                          Approve
                        </button>
                      )}
                      <button className="btn-secondary px-4 py-2">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Consultations */}
        {activeTab === 'consultations' && (
          <ConsultationWorkflow userRole="expert" userId={user.id} userName={user.name} />
        )}

        {/* States Management */}
        {activeTab === 'states' && (
          <div className="card">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold">State Management</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={loadDashboardData}
                  className="btn-secondary flex items-center"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Refresh
                </button>
                <button 
                  onClick={() => setShowStateModal(true)}
                  className="btn-primary flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Add State
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-neutral-700">State Name</th>
                    <th className="text-left p-4 font-medium text-neutral-700">Code</th>
                    <th className="text-left p-4 font-medium text-neutral-700">Districts</th>
                    <th className="text-left p-4 font-medium text-neutral-700">Status</th>
                    <th className="text-left p-4 font-medium text-neutral-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {states.map(state => (
                    <tr key={state.id} className="border-t border-neutral-100">
                      <td className="p-4 font-medium">{state.name}</td>
                      <td className="p-4 text-neutral-600">{state.code}</td>
                      <td className="p-4 text-neutral-600">{state.districts}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          state.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {state.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingState(state)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('Are you sure you want to delete this state?')) {
                                try {
                                  const response = await fetch(`/api/states/${state.id}`, {
                                    method: 'DELETE',
                                    headers: {
                                      'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                      'Content-Type': 'application/json'
                                    }
                                  })
                                  
                                  if (response.ok) {
                                    console.log('State deleted successfully')
                                    loadDashboardData()
                                  } else {
                                    const error = await response.json()
                                    console.log(`Error: ${error.message || 'Failed to delete state'}`)
                                  }
                                } catch (error) {
                                  console.error('Delete state error:', error)
                                  console.log('Network error. Please try again.')
                                }
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Crops Management */}
        {activeTab === 'crops' && (
          <div className="card">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Crop Management</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={loadDashboardData}
                  className="btn-secondary flex items-center"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Refresh
                </button>
                <button 
                  onClick={() => setShowCropModal(true)}
                  className="btn-primary flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Add Crop
                </button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {crops.map(crop => (
                <div key={crop.id} className="border border-neutral-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{crop.emoji}</span>
                      <div>
                        <h3 className="font-semibold">{crop.name}</h3>
                        <p className="text-sm text-neutral-600">{crop.category}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      crop.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {crop.status}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-3">{crop.diseases} diseases tracked</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingCrop(crop)}
                      className="flex-1 btn-secondary py-2 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Are you sure you want to delete this crop?')) {
                          try {
                            const response = await fetch(`/api/crops/${crop.id}`, {
                              method: 'DELETE',
                              headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                'Content-Type': 'application/json'
                              }
                            })
                            
                            if (response.ok) {
                              console.log('Crop deleted successfully')
                              loadDashboardData()
                            } else {
                              const error = await response.json()
                              console.log(`Error: ${error.message || 'Failed to delete crop'}`)
                            }
                          } catch (error) {
                            console.error('Delete crop error:', error)
                            console.log('Network error. Please try again.')
                          }
                        }
                      }}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">User Growth</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>This Week</span>
                    <span className="font-semibold text-green-600">+24 users</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Month</span>
                    <span className="font-semibold text-green-600">+156 users</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Growth Rate</span>
                    <span className="font-semibold text-blue-600">18.5%</span>
                  </div>
                </div>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Consultation Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Success Rate</span>
                    <span className="font-semibold text-green-600">94.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Response Time</span>
                    <span className="font-semibold text-blue-600">2.3 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expert Rating</span>
                    <span className="font-semibold text-yellow-600">4.8/5</span>
                  </div>
                </div>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Revenue Analytics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Today</span>
                    <span className="font-semibold text-green-600">₹4,250</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Week</span>
                    <span className="font-semibold text-green-600">₹28,400</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Target</span>
                    <span className="font-semibold text-orange-600">78% achieved</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Export & Reports */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Data Export & Reports</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="btn-primary flex items-center justify-center">
                  <Download size={16} className="mr-2" />
                  Export Users
                </button>
                <button className="btn-primary flex items-center justify-center">
                  <Download size={16} className="mr-2" />
                  Export Consultations
                </button>
                <button className="btn-primary flex items-center justify-center">
                  <Download size={16} className="mr-2" />
                  Revenue Report
                </button>
                <button className="btn-primary flex items-center justify-center">
                  <Calendar size={16} className="mr-2" />
                  Monthly Summary
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Advanced Analytics Filters</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <select className="input-field">
                  <option>Select State</option>
                  <option>Punjab</option>
                  <option>Haryana</option>
                  <option>UP</option>
                </select>
                <select className="input-field">
                  <option>Select Crop</option>
                  <option>Apple</option>
                  <option>Tomato</option>
                  <option>Potato</option>
                </select>
                <select className="input-field">
                  <option>Time Period</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                </select>
                <button className="btn-primary">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WhatsApp Management */}
        {activeTab === 'whatsapp' && (
          <WhatsAppDashboard />
        )}

        {/* System Management */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            {/* System Health */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card p-4 text-center">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">98.5%</p>
                <p className="text-sm text-neutral-600">System Uptime</p>
              </div>
              <div className="card p-4 text-center">
                <Database className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">2.4GB</p>
                <p className="text-sm text-neutral-600">Database Size</p>
              </div>
              <div className="card p-4 text-center">
                <Activity className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-600">45ms</p>
                <p className="text-sm text-neutral-600">Avg Response</p>
              </div>
              <div className="card p-4 text-center">
                <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">2</p>
                <p className="text-sm text-neutral-600">Active Alerts</p>
              </div>
            </div>

            {/* Bulk Operations */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Bulk Operations</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button className="btn-secondary flex items-center justify-center">
                  <Upload size={16} className="mr-2" />
                  Bulk Import Users
                </button>
                <button className="btn-secondary flex items-center justify-center">
                  <Download size={16} className="mr-2" />
                  Backup Database
                </button>
                <button className="btn-secondary flex items-center justify-center">
                  <RefreshCw size={16} className="mr-2" />
                  Sync Data
                </button>
                <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-xl flex items-center justify-center">
                  <Bell size={16} className="mr-2" />
                  Send Notifications
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center justify-center">
                  <AlertTriangle size={16} className="mr-2" />
                  Emergency Mode
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center justify-center">
                  <Shield size={16} className="mr-2" />
                  Security Scan
                </button>
              </div>
            </div>

            {/* System Configuration */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">System Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Platform Name</label>
                    <input type="text" value="BeejHealth" className="input-field w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Max File Size (MB)</label>
                    <input type="number" value="10" className="input-field w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Session Timeout (min)</label>
                    <input type="number" value="30" className="input-field w-full" />
                  </div>
                  <button className="btn-primary w-full">Save Settings</button>
                </div>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">WhatsApp API Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">API Secret Key</label>
                    <input 
                      type="password" 
                      placeholder="Enter WhatsApp API Secret" 
                      className="input-field w-full"
                      value={whatsappConfig.apiSecret}
                      onChange={(e) => setWhatsappConfig({...whatsappConfig, apiSecret: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Account Unique ID</label>
                    <input 
                      type="text" 
                      placeholder="Enter WhatsApp Account Unique ID (Optional - for specific account operations)" 
                      className="input-field w-full"
                      value={whatsappConfig.accountId}
                      onChange={(e) => setWhatsappConfig({...whatsappConfig, accountId: e.target.value})}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This will be auto-filled when you link a WhatsApp account. Leave empty if you don't have one yet.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">API Base URL</label>
                    <input 
                      type="url" 
                      className="input-field w-full"
                      value={whatsappConfig.baseUrl}
                      onChange={(e) => setWhatsappConfig({...whatsappConfig, baseUrl: e.target.value})}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={async () => {
                        try {
                          // Save to localStorage for immediate use
                          localStorage.setItem('whatsapp_secret', whatsappConfig.apiSecret)
                          localStorage.setItem('whatsapp_account_id', whatsappConfig.accountId)
                          localStorage.setItem('whatsapp_base_url', whatsappConfig.baseUrl)
                          
                          // Also save to database via API
                          const response = await fetch('/api/config', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                              type: 'whatsapp', 
                              data: {
                                api_secret: whatsappConfig.apiSecret,
                                account_id: whatsappConfig.accountId,
                                base_url: whatsappConfig.baseUrl
                              }
                            })
                          })
                          
                          if (response.ok) {
                            console.log('✅ WhatsApp API configuration saved successfully!')
                          } else {
                            console.log('⚠️ Configuration saved locally but failed to save to database')
                          }
                        } catch (error) {
                          console.error('Error saving configuration:', error)
                          console.log('❌ Error saving configuration')
                        }
                      }}
                      className="btn-primary flex-1"
                    >
                      Save API Config
                    </button>
                    <button 
                      onClick={async () => {
                        if (!whatsappConfig.apiSecret) {
                          console.log('Please enter API Secret first')
                          return
                        }
                        try {
                          // Test connection by getting accounts
                          const response = await fetch(`${whatsappConfig.baseUrl}/get/wa.accounts?secret=${whatsappConfig.apiSecret}`)
                          
                          if (response.ok) {
                            const result = await response.json()
                            if (result.status === 200) {
                              console.log(`✅ Connection successful! Found ${result.data?.length || 0} WhatsApp accounts.`)
                            } else {
                              console.log(`❌ API Error: ${result.message || 'Unknown error'}`)
                            }
                          } else {
                            console.log('❌ Connection failed. Please check your API secret.')
                          }
                        } catch (error) {
                          console.error('Error testing connection:', error)
                          console.log('❌ Network error. Please check your internet connection.')
                        }
                      }}
                      className="btn-secondary px-4"
                    >
                      Test Connection
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Maintenance Mode</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 font-medium">Scheduled Maintenance</p>
                    <p className="text-yellow-600 text-sm">Next: Tonight 2:00 AM - 4:00 AM</p>
                  </div>
                  <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-xl w-full">
                    Enable Maintenance Mode
                  </button>
                  <button className="btn-secondary w-full">Schedule Maintenance</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Event System */}
            <EventSystem userRole={user.role} />
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">System Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Platform Name
                    </label>
                    <input type="text" value="BeejHealth" className="input-field w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Max File Upload Size (MB)
                    </label>
                    <input type="number" value="10" className="input-field w-full" />
                  </div>
                  <button className="btn-primary">Save Settings</button>
                </div>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Database Management</h3>
                <div className="space-y-3">
                  <button className="btn-secondary w-full">Backup Database</button>
                  <button className="btn-secondary w-full">Export User Data</button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl w-full">
                    Clear All Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Add State Modal */}
      {showStateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Add New State</h3>
            <form id="stateForm" className="space-y-4">
              <input type="text" name="name" placeholder="State Name" className="input-field w-full" required />
              <input type="text" name="code" placeholder="State Code (e.g., PB)" className="input-field w-full" required />
              <input type="number" name="districts" placeholder="Number of Districts" className="input-field w-full" />
              <div className="flex space-x-3">
                <button 
                  onClick={async () => {
                    const formData = new FormData(document.getElementById('stateForm') as HTMLFormElement)
                    const stateData = {
                      name: formData.get('name'),
                      code: formData.get('code'),
                      districts: parseInt(formData.get('districts') as string) || 0
                    }
                    
                    try {
                      const response = await fetch('https://backend.cvframeiq.in/api/states.php', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify(stateData)
                      })
                      
                      if (response.ok) {
                        console.log('State added successfully')
                        loadDashboardData()
                        setShowStateModal(false)
                      } else {
                        console.log('Failed to add state')
                      }
                    } catch (error) {
                      console.error('Error adding state:', error)
                    }
                  }}
                  className="btn-primary flex-1"
                >
                  Add State
                </button>
                <button onClick={() => setShowStateModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Add Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Add New Crop</h3>
            <form id="cropForm" className="space-y-4">
              <input type="text" name="name" placeholder="Crop Name" className="input-field w-full" required />
              <input type="text" name="emoji" placeholder="Emoji (e.g., 🌱)" className="input-field w-full" />
              <select name="category" className="input-field w-full" required>
                <option value="">Select Category</option>
                <option value="Fruit">Fruit</option>
                <option value="Vegetable">Vegetable</option>
                <option value="Cereal">Cereal</option>
                <option value="Pulse">Pulse</option>
              </select>
              <input type="number" name="diseases" placeholder="Number of Diseases" className="input-field w-full" />
              <div className="flex space-x-3">
                <button 
                  onClick={async () => {
                    const formData = new FormData(document.getElementById('cropForm') as HTMLFormElement)
                    const cropData = {
                      name: formData.get('name'),
                      emoji: formData.get('emoji') || '🌱',
                      category: formData.get('category'),
                      diseases: parseInt(formData.get('diseases') as string) || 0
                    }
                    
                    try {
                      const response = await fetch('https://backend.cvframeiq.in/api/crops.php', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify(cropData)
                      })
                      
                      if (response.ok) {
                        console.log('Crop added successfully')
                        loadDashboardData()
                        setShowCropModal(false)
                      } else {
                        console.log('Failed to add crop')
                      }
                    } catch (error) {
                      console.error('Error adding crop:', error)
                    }
                  }}
                  className="btn-primary flex-1"
                >
                  Add Crop
                </button>
                <button onClick={() => setShowCropModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
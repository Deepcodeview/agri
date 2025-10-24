'use client'
import { useState, useEffect } from 'react'
import { Users, FileText, Clock, CheckCircle, Eye, MessageSquare, RefreshCw, User, Settings, BarChart3, Calendar } from 'lucide-react'
import ConsultationWorkflow from './ConsultationWorkflow'

interface ExpertDashboardProps {
  user: any
  onLogout: () => void
}

export default function ExpertDashboard({ user, onLogout }: ExpertDashboardProps) {
  const [activeTab, setActiveTab] = useState('consultations')
  const [pendingCases, setPendingCases] = useState([])
  const [completedCases, setCompletedCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCase, setSelectedCase] = useState<any>(null)
  const [consultation, setConsultation] = useState('')
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    totalFarmers: 0,
    successRate: 0
  })
  
  useEffect(() => {
    loadDashboardData()
  }, [])
  
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      // Load expert consultations
      const response = await fetch('/api/expert/consultations', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPendingCases(data.pending || [])
        setCompletedCases(data.completed || [])
        setStats(data.stats || stats)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProvideConsultation = async (caseId: number) => {
    if (!consultation.trim()) {
      alert('कृपया consultation लिखें')
      return
    }

    try {
      const response = await fetch(`/api/expert/consultations/${caseId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          consultation: consultation,
          status: 'completed'
        })
      })
      
      if (response.ok) {
        setSelectedCase(null)
        setConsultation('')
        alert('Consultation successfully provided!')
        loadDashboardData()
      } else {
        const error = await response.json()
        alert(`Error: ${error.message || 'Failed to submit consultation'}`)
      }
    } catch (error) {
      console.error('Submit consultation error:', error)
      alert('Network error. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-green-600">Expert Dashboard</h1>
            <p className="text-gray-600">Agricultural Expert Panel</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Dr. {user.name}</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Expert
            </span>
            <button onClick={onLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-neutral-200 rounded-xl p-1 mb-6">
          {[
            { id: 'consultations', label: 'Consultations', icon: MessageSquare },
            { id: 'history', label: 'History', icon: Calendar },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
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
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending Cases</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Farmers</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalFarmers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-purple-600">{stats.successRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Consultations Tab */}
        {activeTab === 'consultations' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Pending Consultation Cases</h2>
                <p className="text-gray-600 mt-1">Review farmer queries and provide expert consultation</p>
              </div>
              <button 
                onClick={loadDashboardData}
                className="btn-secondary flex items-center"
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-2 text-neutral-600">Loading consultations...</p>
              </div>
            ) : (
            <div className="divide-y">
              {pendingCases.map(case_ => (
              <div key={case_.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 mr-4">
                        {case_.farmerName}
                      </h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {case_.crop}
                      </span>
                      <span className="ml-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                        Pending
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">AI Diagnosis:</p>
                        <p className="font-medium text-red-700">{case_.disease}</p>
                        <p className="text-sm text-gray-500">Confidence: {case_.confidence}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Submitted:</p>
                        <p className="text-gray-800">{case_.submittedAt}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Farmer's Query:</p>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{case_.query}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Symptoms:</p>
                      <p className="text-gray-700">{case_.symptoms}</p>
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col space-y-2">
                    <button
                      onClick={() => setSelectedCase(case_)}
                      className="btn-primary flex items-center"
                    >
                      <MessageSquare size={16} className="mr-2" />
                      Provide Consultation
                    </button>
                    <button className="btn-secondary flex items-center">
                      <Eye size={16} className="mr-2" />
                      View Images
                    </button>
                  </div>
                </div>
              </div>
            ))}

              {pendingCases.length === 0 && (
                <div className="p-12 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">All Cases Completed!</h3>
                  <p className="text-gray-600">No pending consultation cases at the moment.</p>
                </div>
              )}
            </div>
            )}
          </div>
        )}
        
        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Consultation History</h2>
              <p className="text-gray-600 mt-1">Your completed consultations</p>
            </div>
            <div className="divide-y">
              {completedCases.map(case_ => (
                <div key={case_.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{case_.farmerName}</h3>
                      <p className="text-sm text-gray-600">{case_.crop} - {case_.disease}</p>
                      <p className="text-xs text-gray-500 mt-1">Completed: {case_.completedAt}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Performance Analytics</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Monthly Performance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Cases Resolved</span>
                      <span className="font-semibold">{stats.completed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Response Time</span>
                      <span className="font-semibold">2.3 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Farmer Satisfaction</span>
                      <span className="font-semibold">4.8/5</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Top Diseases Treated</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Early Blight</span>
                      <span className="font-semibold">15 cases</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Powdery Mildew</span>
                      <span className="font-semibold">12 cases</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Late Blight</span>
                      <span className="font-semibold">8 cases</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Expert Profile</h2>
              <p className="text-gray-600 mt-1">Manage your professional information</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                  <input type="text" placeholder="e.g., Plant Pathology" className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <input type="text" placeholder="e.g., 10 years" className="input-field w-full" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea className="input-field w-full h-24" placeholder="Brief description about your expertise..."></textarea>
                </div>
              </div>
              <div className="mt-6">
                <button className="btn-primary">Update Profile</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Consultation Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold">Provide Expert Consultation</h3>
              <p className="text-gray-600 mt-1">Case: {selectedCase.farmerName} - {selectedCase.crop}</p>
            </div>

            <div className="p-6">
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">AI Diagnosis:</h4>
                <p className="text-red-700 font-medium">{selectedCase.disease}</p>
                <p className="text-sm text-gray-600">Confidence: {selectedCase.confidence}%</p>
              </div>

              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Farmer's Query:</h4>
                <p className="text-gray-800">{selectedCase.query}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Expert Consultation (Hindi/English):
                </label>
                <textarea
                  value={consultation}
                  onChange={(e) => setConsultation(e.target.value)}
                  placeholder="किसान को विस्तृत सलाह दें... (Provide detailed advice to farmer...)"
                  className="input-field w-full h-40 resize-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Include treatment steps, preventive measures, and follow-up advice
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleProvideConsultation(selectedCase.id)}
                  className="btn-primary flex-1"
                >
                  Submit Consultation
                </button>
                <button
                  onClick={() => {setSelectedCase(null); setConsultation('')}}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
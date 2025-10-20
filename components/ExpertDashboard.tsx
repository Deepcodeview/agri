'use client'
import { useState, useEffect } from 'react'
import { Users, FileText, Clock, CheckCircle, Eye, MessageSquare } from 'lucide-react'
import ConsultationWorkflow from './ConsultationWorkflow'

interface ExpertDashboardProps {
  user: any
  onLogout: () => void
}

export default function ExpertDashboard({ user, onLogout }: ExpertDashboardProps) {
  const [pendingCases, setPendingCases] = useState([
    {
      id: 1,
      farmerName: 'राम कुमार',
      crop: 'Tomato',
      disease: 'Early Blight',
      confidence: 85.4,
      images: ['leaf1.jpg', 'leaf2.jpg'],
      symptoms: 'Dark spots on leaves, yellowing',
      query: 'मेरे टमाटर के पत्तों पर काले धब्बे हैं। क्या करूं?',
      submittedAt: '2024-01-15 10:30 AM',
      status: 'pending'
    },
    {
      id: 2,
      farmerName: 'सुनीता देवी',
      crop: 'Potato',
      disease: 'Late Blight',
      confidence: 92.1,
      images: ['potato1.jpg'],
      symptoms: 'Brown patches, wilting',
      query: 'आलू के पत्ते भूरे हो रहे हैं और मुरझा रहे हैं।',
      submittedAt: '2024-01-15 11:15 AM',
      status: 'pending'
    }
  ])
  
  const [selectedCase, setSelectedCase] = useState<any>(null)
  const [consultation, setConsultation] = useState('')

  const handleProvideConsultation = (caseId: number) => {
    if (!consultation.trim()) {
      alert('कृपया consultation लिखें')
      return
    }

    setPendingCases(cases => 
      cases.map(c => 
        c.id === caseId 
          ? { ...c, status: 'completed', expertConsultation: consultation }
          : c
      )
    )
    
    setSelectedCase(null)
    setConsultation('')
    alert('Consultation successfully provided!')
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
        <ConsultationWorkflow userRole="expert" userId={1} userName={user.name} />
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending Cases</p>
                <p className="text-2xl font-bold text-orange-600">
                  {pendingCases.filter(c => c.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {pendingCases.filter(c => c.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Farmers</p>
                <p className="text-2xl font-bold text-blue-600">24</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-purple-600">94%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Cases */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Pending Consultation Cases</h2>
            <p className="text-gray-600 mt-1">Review farmer queries and provide expert consultation</p>
          </div>

          <div className="divide-y">
            {pendingCases.filter(c => c.status === 'pending').map(case_ => (
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

            {pendingCases.filter(c => c.status === 'pending').length === 0 && (
              <div className="p-12 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">All Cases Completed!</h3>
                <p className="text-gray-600">No pending consultation cases at the moment.</p>
              </div>
            )}
          </div>
        </div>
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
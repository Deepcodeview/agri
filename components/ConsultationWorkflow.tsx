'use client'
import { useState, useEffect } from 'react'
import { User, Clock, CheckCircle, MessageSquare, Phone, Star, Send } from 'lucide-react'
import ConsultationChat from './ConsultationChat'

interface Consultation {
  id: number
  farmerId: number
  farmerName: string
  expertId?: number
  expertName?: string
  crop: string
  disease: string
  confidence: number
  images: string[]
  symptoms: string
  query: string
  status: 'pending' | 'assigned' | 'in_progress' | 'completed'
  aiDiagnosis: string
  expertResponse?: string
  rating?: number
  createdAt: string
  updatedAt: string
}

interface ConsultationWorkflowProps {
  userRole: 'farmer' | 'expert'
  userId: number
  userName: string
}

export default function ConsultationWorkflow({ userRole, userId, userName }: ConsultationWorkflowProps) {
  const [consultations, setConsultations] = useState<Consultation[]>([
    {
      id: 1,
      farmerId: 1,
      farmerName: 'राम कुमार',
      expertId: 2,
      expertName: 'Dr. Rajesh Kumar',
      crop: 'Tomato',
      disease: 'Early Blight',
      confidence: 85.4,
      images: ['leaf1.jpg', 'leaf2.jpg'],
      symptoms: 'Dark spots on leaves, yellowing',
      query: 'मेरे टमाटर के पत्तों पर काले धब्बे हैं। क्या करूं?',
      status: 'in_progress',
      aiDiagnosis: 'Early Blight detected with 85.4% confidence. Apply copper fungicide.',
      expertResponse: 'आपके टमाटर में Early Blight है। तुरंत copper fungicide का छिड़काव करें। प्रभावित पत्तियों को हटा दें।',
      createdAt: '2024-01-15 10:30:00',
      updatedAt: '2024-01-15 14:30:00'
    },
    {
      id: 2,
      farmerId: 3,
      farmerName: 'सुनीता देवी',
      crop: 'Potato',
      disease: 'Late Blight',
      confidence: 92.1,
      images: ['potato1.jpg'],
      symptoms: 'Brown patches, wilting',
      query: 'आलू के पत्ते भूरे हो रहे हैं और मुरझा रहे हैं।',
      status: 'pending',
      aiDiagnosis: 'Late Blight detected with 92.1% confidence. Immediate action required.',
      createdAt: '2024-01-15 11:15:00',
      updatedAt: '2024-01-15 11:15:00'
    }
  ])

  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)
  const [expertResponse, setExpertResponse] = useState('')
  const [rating, setRating] = useState(0)
  const [showChat, setShowChat] = useState(false)
  const [activeChatConsultation, setActiveChatConsultation] = useState<Consultation | null>(null)

  // Filter consultations based on user role
  const filteredConsultations = userRole === 'farmer' 
    ? consultations.filter(c => c.farmerId === userId)
    : consultations.filter(c => !c.expertId || c.expertId === userId)

  const handleAssignExpert = (consultationId: number) => {
    setConsultations(prev => 
      prev.map(c => 
        c.id === consultationId 
          ? { ...c, expertId: userId, expertName: userName, status: 'assigned', updatedAt: new Date().toISOString() }
          : c
      )
    )
  }

  const handleStartConsultation = (consultationId: number) => {
    setConsultations(prev => 
      prev.map(c => 
        c.id === consultationId 
          ? { ...c, status: 'in_progress', updatedAt: new Date().toISOString() }
          : c
      )
    )
  }

  const handleSubmitExpertResponse = (consultationId: number) => {
    if (!expertResponse.trim()) return

    setConsultations(prev => 
      prev.map(c => 
        c.id === consultationId 
          ? { 
              ...c, 
              expertResponse, 
              status: 'completed', 
              updatedAt: new Date().toISOString() 
            }
          : c
      )
    )
    setExpertResponse('')
    setSelectedConsultation(null)
  }

  const handleRateExpert = (consultationId: number, rating: number) => {
    setConsultations(prev => 
      prev.map(c => 
        c.id === consultationId 
          ? { ...c, rating }
          : c
      )
    )
    alert('Thank you for rating the expert!')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'assigned': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-orange-100 text-orange-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Waiting for Expert'
      case 'assigned': return 'Expert Assigned'
      case 'in_progress': return 'In Progress'
      case 'completed': return 'Completed'
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-900">
          {userRole === 'farmer' ? 'My Consultations' : 'Expert Consultations'}
        </h2>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
            {filteredConsultations.length} Total
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
            {filteredConsultations.filter(c => c.status === 'pending' || c.status === 'in_progress').length} Active
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredConsultations.map(consultation => (
          <div key={consultation.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">
                    {userRole === 'farmer' ? `Consultation #${consultation.id}` : consultation.farmerName}
                  </h3>
                  <p className="text-neutral-600">{consultation.crop} - {consultation.disease}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(consultation.status)}`}>
                  {getStatusText(consultation.status)}
                </span>
                <div className="text-sm text-neutral-500">
                  {new Date(consultation.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* AI Diagnosis */}
            <div className="bg-blue-50 p-4 rounded-xl mb-4">
              <h4 className="font-medium text-blue-800 mb-2">AI Diagnosis</h4>
              <p className="text-blue-700 text-sm">{consultation.aiDiagnosis}</p>
              <p className="text-blue-600 text-xs mt-1">Confidence: {consultation.confidence}%</p>
            </div>

            {/* Farmer Query */}
            <div className="mb-4">
              <h4 className="font-medium text-neutral-800 mb-2">Farmer's Query:</h4>
              <p className="text-neutral-600 bg-neutral-50 p-3 rounded-lg">{consultation.query}</p>
            </div>

            {/* Expert Response */}
            {consultation.expertResponse && (
              <div className="bg-green-50 p-4 rounded-xl mb-4">
                <h4 className="font-medium text-green-800 mb-2">Expert Response:</h4>
                <p className="text-green-700 text-sm">{consultation.expertResponse}</p>
                <p className="text-green-600 text-xs mt-2">By: {consultation.expertName}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              <div className="flex items-center space-x-2">
                {consultation.images.map((image, index) => (
                  <div key={index} className="w-8 h-8 bg-neutral-200 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-neutral-600">{index + 1}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                {/* Farmer Actions */}
                {userRole === 'farmer' && (
                  <>
                    {consultation.status === 'completed' && !consultation.rating && (
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-neutral-600">Rate:</span>
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => handleRateExpert(consultation.id, star)}
                            className="text-yellow-400 hover:text-yellow-500"
                          >
                            <Star size={16} fill={star <= rating ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                    )}
                    <button 
                      onClick={() => {
                        setActiveChatConsultation(consultation)
                        setShowChat(true)
                      }}
                      className="btn-secondary flex items-center"
                    >
                      <MessageSquare size={16} className="mr-2" />
                      Chat
                    </button>
                  </>
                )}

                {/* Expert Actions */}
                {userRole === 'expert' && (
                  <>
                    {consultation.status === 'pending' && (
                      <button
                        onClick={() => handleAssignExpert(consultation.id)}
                        className="btn-primary"
                      >
                        Take Case
                      </button>
                    )}
                    
                    {consultation.status === 'assigned' && (
                      <button
                        onClick={() => handleStartConsultation(consultation.id)}
                        className="btn-primary"
                      >
                        Start Consultation
                      </button>
                    )}
                    
                    {consultation.status === 'in_progress' && (
                      <button
                        onClick={() => setSelectedConsultation(consultation)}
                        className="btn-primary flex items-center"
                      >
                        <Send size={16} className="mr-2" />
                        Provide Response
                      </button>
                    )}
                    
                    <button 
                      onClick={() => {
                        setActiveChatConsultation(consultation)
                        setShowChat(true)
                      }}
                      className="btn-secondary flex items-center mr-2"
                    >
                      <MessageSquare size={16} className="mr-2" />
                      Chat
                    </button>
                    <button className="btn-secondary flex items-center">
                      <Phone size={16} className="mr-2" />
                      Call Farmer
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredConsultations.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-700 mb-2">No Consultations</h3>
            <p className="text-neutral-500">
              {userRole === 'farmer' 
                ? 'Start your first consultation to get expert advice' 
                : 'No pending consultations at the moment'}
            </p>
          </div>
        )}
      </div>

      {/* Expert Response Modal */}
      {selectedConsultation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-100">
              <h3 className="text-xl font-semibold">Provide Expert Consultation</h3>
              <p className="text-neutral-600 mt-1">
                Case: {selectedConsultation.farmerName} - {selectedConsultation.crop}
              </p>
            </div>

            <div className="p-6">
              <div className="mb-4 p-4 bg-blue-50 rounded-xl">
                <h4 className="font-medium mb-2">AI Diagnosis:</h4>
                <p className="text-blue-700">{selectedConsultation.aiDiagnosis}</p>
              </div>

              <div className="mb-4 p-4 bg-neutral-50 rounded-xl">
                <h4 className="font-medium mb-2">Farmer's Query:</h4>
                <p className="text-neutral-700">{selectedConsultation.query}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Your Expert Response (Hindi/English):
                </label>
                <textarea
                  value={expertResponse}
                  onChange={(e) => setExpertResponse(e.target.value)}
                  placeholder="किसान को विस्तृत सलाह दें..."
                  className="input-field w-full h-32 resize-none"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleSubmitExpertResponse(selectedConsultation.id)}
                  className="btn-primary flex-1"
                >
                  Submit Response
                </button>
                <button
                  onClick={() => {setSelectedConsultation(null); setExpertResponse('')}}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Chat System */}
      {showChat && activeChatConsultation && (
        <ConsultationChat
          consultationId={activeChatConsultation.id}
          currentUserId={userId}
          currentUserName={userName}
          currentUserRole={userRole}
          farmerName={activeChatConsultation.farmerName}
          expertName={activeChatConsultation.expertName || 'Expert'}
          isActive={activeChatConsultation.status === 'in_progress'}
          onClose={() => {
            setShowChat(false)
            setActiveChatConsultation(null)
          }}
        />
      )}
    </div>
  )
}
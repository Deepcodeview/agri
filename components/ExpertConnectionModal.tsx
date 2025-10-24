'use client'
import { useState } from 'react'
import { X, MapPin, Star, Phone, MessageCircle, User, Clock } from 'lucide-react'
import ConsultationChat from './ConsultationChat'

interface ExpertConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  cropType: string
  disease: string
}

const mockExperts = [
  {
    id: 1,
    name: 'Dr. Rajesh Kumar',
    specialization: 'Plant Pathology',
    experience: '15 years',
    rating: 4.8,
    location: 'Punjab',
    phone: '+91 98765-43210',
    expertise: ['Apple', 'Orange', 'Grape', 'Peach', 'Cherry'],
    languages: ['Hindi', 'English', 'Punjabi'],
    availability: 'Available now',
    consultationFee: '₹500',
    image: '👨🔬'
  },
  {
    id: 2,
    name: 'Dr. Priya Sharma',
    specialization: 'Crop Disease Management',
    experience: '12 years',
    rating: 4.9,
    location: 'Haryana',
    phone: '+91 87654-32109',
    expertise: ['Tomato', 'Potato', 'Pepper', 'Corn', 'Rice'],
    languages: ['Hindi', 'English'],
    availability: 'Available in 2 hours',
    consultationFee: '₹600',
    image: '👩🔬'
  },
  {
    id: 3,
    name: 'Dr. Amit Singh',
    specialization: 'Fruit Crop Diseases',
    experience: '10 years',
    rating: 4.7,
    location: 'Uttar Pradesh',
    phone: '+91 76543-21098',
    expertise: ['Wheat', 'Cotton', 'Banana', 'Mango', 'Strawberry'],
    languages: ['Hindi', 'English'],
    availability: 'Available tomorrow',
    consultationFee: '₹450',
    image: '👨🌾'
  }
]

export default function ExpertConnectionModal({ isOpen, onClose, cropType, disease }: ExpertConnectionModalProps) {
  const [selectedExpert, setSelectedExpert] = useState<any>(null)
  const [selectedState, setSelectedState] = useState('')
  const [showChat, setShowChat] = useState(false)
  const [chatExpert, setChatExpert] = useState<any>(null)

  if (!isOpen) return null

  const filteredExperts = mockExperts.filter(expert => 
    expert.expertise.includes(cropType) && 
    (selectedState === '' || expert.location === selectedState)
  )

  const handleConnectExpert = (expert: any) => {
    alert(`Connecting with ${expert.name}. You will receive a call within 15 minutes.`)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="relative bg-gradient-to-r from-secondary-500 to-secondary-600 p-6 text-white">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Connect with Agricultural Experts</h2>
              <p className="text-secondary-100 text-sm">Get personalized consultation for {cropType} - {disease}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Filter by State/Location:
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="input-field w-full max-w-xs"
            >
              <option value="">All States</option>
              <option value="Punjab">Punjab</option>
              <option value="Haryana">Haryana</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
            </select>
          </div>

          <div className="grid gap-4 max-h-96 overflow-y-auto">
            {filteredExperts.map(expert => (
              <div key={expert.id} className="card p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center text-3xl">
                      {expert.image}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-neutral-900">{expert.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-neutral-700">{expert.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-secondary-600 font-medium mb-2">{expert.specialization}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="flex items-center text-sm text-neutral-600 mb-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {expert.location}
                          </div>
                          <div className="flex items-center text-sm text-neutral-600 mb-1">
                            <Clock className="w-4 h-4 mr-1" />
                            {expert.availability}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-neutral-600 mb-1">
                            <span className="font-medium">Experience:</span> {expert.experience}
                          </p>
                          <p className="text-sm text-neutral-600 mb-1">
                            <span className="font-medium">Fee:</span> {expert.consultationFee}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-neutral-600 mb-2">
                          <span className="font-medium">Expertise:</span> {expert.expertise.join(', ')}
                        </p>
                        <p className="text-sm text-neutral-600">
                          <span className="font-medium">Languages:</span> {expert.languages.join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => handleConnectExpert(expert)}
                      className="btn-primary flex items-center px-4 py-2"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </button>
                    <button
                      onClick={() => {
                        setChatExpert(expert)
                        setShowChat(true)
                      }}
                      className="btn-secondary flex items-center px-4 py-2"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredExperts.length === 0 && (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-700 mb-2">No experts found</h3>
                <p className="text-neutral-500">Try selecting a different state or check back later.</p>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-primary-50 rounded-xl">
            <h4 className="font-semibold text-primary-800 mb-2">How it works:</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-primary-700">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">1</span>
                Select an expert based on expertise and location
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">2</span>
                Click "Call Now" to schedule consultation
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">3</span>
                Receive personalized treatment advice
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showChat && chatExpert && (() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const userName = userData.name || 'Farmer';
        const userId = userData.id || 1;
        
        return (
          <ConsultationChat
            consultationId={Date.now()}
            currentUserId={userId}
            currentUserName={userName}
            currentUserRole="farmer"
            farmerName={userName}
            expertName={chatExpert.name}
            isActive={true}
            onClose={() => {
              setShowChat(false)
              setChatExpert(null)
            }}
          />
        );
      })()}
    </div>
  )
}
'use client'
import { useState, useEffect, useRef } from 'react'
import { Send, Phone, Video, Image, Clock, User, CheckCircle2, Circle } from 'lucide-react'

interface Message {
  id: number
  senderId: number
  senderName: string
  senderRole: 'farmer' | 'expert'
  message: string
  timestamp: string
  type: 'text' | 'image' | 'system'
  read: boolean
}

interface ConsultationChatProps {
  consultationId: number
  currentUserId: number
  currentUserName: string
  currentUserRole: 'farmer' | 'expert'
  farmerName: string
  expertName: string
  isActive: boolean
  onClose: () => void
}

export default function ConsultationChat({ 
  consultationId, 
  currentUserId, 
  currentUserName, 
  currentUserRole,
  farmerName,
  expertName,
  isActive,
  onClose 
}: ConsultationChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  
  // Initialize chat with consultation data
  useEffect(() => {
    const consultationData = JSON.parse(localStorage.getItem('consultationData') || '{}')
    const cropType = consultationData.selectedCrop || 'Apple'
    const disease = consultationData.disease || 'Apple Scab'
    const confidence = consultationData.confidence || '85'
    const recommendations = consultationData.recommendations || 'Apply fungicide treatment'
    const analysisAnswers = consultationData.analysisAnswers || {}
    
    const initialMessages: Message[] = [
      {
        id: 1,
        senderId: 0,
        senderName: 'System',
        senderRole: 'farmer',
        message: `Consultation started for ${cropType}. Expert has been assigned.`,
        timestamp: new Date().toISOString(),
        type: 'system',
        read: true
      },
      {
        id: 2,
        senderId: 0,
        senderName: 'System',
        senderRole: 'farmer',
        message: `📋 Analysis Summary:\n🌱 Crop: ${cropType}\n🦠 Disease: ${disease}\n🎯 Confidence: ${confidence}%\n💊 Treatment: ${recommendations}`,
        timestamp: new Date().toISOString(),
        type: 'system',
        read: true
      },
      {
        id: 3,
        senderId: 2,
        senderName: expertName,
        senderRole: 'expert',
        message: `नमस्ते! मैंने आपकी ${cropType} की तस्वीरें और AI analysis देखी है। ${disease} की पुष्टि हुई है (${confidence}% confidence)। ${recommendations}`,
        timestamp: new Date().toISOString(),
        type: 'text',
        read: true
      }
    ]
    
    setMessages(initialMessages)
  }, [expertName])

  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [lastSeen, setLastSeen] = useState('2 minutes ago')
  const [consultationTimer, setConsultationTimer] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Consultation timer
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setConsultationTimer(prev => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isActive])

  // Simulate typing indicator
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.senderId !== currentUserId) {
        setIsTyping(true)
        const timeout = setTimeout(() => setIsTyping(false), 2000)
        return () => clearTimeout(timeout)
      }
    }
  }, [messages, currentUserId])

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatTimer = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now(),
      senderId: currentUserId,
      senderName: currentUserName,
      senderRole: currentUserRole,
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
      read: false
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simulate expert auto-reply after farmer message
    if (currentUserRole === 'farmer') {
      setTimeout(() => {
        const autoReply: Message = {
          id: Date.now() + 1,
          senderId: 2,
          senderName: expertName,
          senderRole: 'expert',
          message: 'मैं आपका सवाल समझ गया हूं। कृपया थोड़ा इंतजार करें, मैं विस्तार से जवाब दे रहा हूं।',
          timestamp: new Date().toISOString(),
          type: 'text',
          read: false
        }
        setMessages(prev => [...prev, autoReply])
      }, 3000)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const message: Message = {
        id: Date.now(),
        senderId: currentUserId,
        senderName: currentUserName,
        senderRole: currentUserRole,
        message: `📷 Image: ${file.name}`,
        timestamp: new Date().toISOString(),
        type: 'image',
        read: false
      }
      setMessages(prev => [...prev, message])
    }
  }

  const markAsRead = (messageId: number) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20"></div>
          <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <User className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">
                  {currentUserRole === 'farmer' ? expertName : farmerName}
                </h3>
                <div className="flex items-center space-x-3 text-sm text-green-100">
                  <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-300 animate-pulse shadow-lg' : 'bg-gray-400'}`}></div>
                  <span className="font-medium">{isActive ? '🟢 Online - Available for consultation' : `Last seen ${lastSeen}`}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                <div className="text-xs text-green-100 font-medium">⏱️ Session Time</div>
                <div className="font-mono text-xl font-bold">{formatTimer(consultationTimer)}</div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105">
                  <Video className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    // Get consultation data from localStorage
                    const consultationData = JSON.parse(localStorage.getItem('consultationData') || '{}')
                    const cropType = consultationData.selectedCrop || 'Apple'
                    const disease = consultationData.disease || 'Apple Scab'
                    const confidence = consultationData.confidence || '85'
                    const recommendations = consultationData.recommendations || 'Apply fungicide treatment'
                    const analysisAnswers = consultationData.analysisAnswers || {}
                    
                    const reportHTML = `
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <meta charset="UTF-8">
                        <title>BeejHealth Complete Report - ${cropType}</title>
                        <style>
                          * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
                          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #1a202c; background: white; }
                          .container { max-width: 210mm; margin: 0 auto; padding: 20mm; }
                          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important; color: white !important; padding: 30px; border-radius: 15px; margin-bottom: 30px; }
                          .section { margin: 25px 0; background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px; }
                          .chat-message { margin: 10px 0; padding: 15px; border-radius: 10px; }
                          .farmer-msg { background: #e0f2fe; border-left: 4px solid #0284c7; }
                          .expert-msg { background: #f0fdf4; border-left: 4px solid #059669; }
                          .system-msg { background: #f8fafc; border-left: 4px solid #64748b; text-align: center; }
                          .footer { background: #1f2937 !important; color: white !important; padding: 30px; border-radius: 15px; margin-top: 40px; text-align: center; }
                          .step-card { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%) !important; padding: 20px; border-radius: 12px; margin: 15px 0; border-left: 5px solid #0284c7; }
                          .diagnosis-card { background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%) !important; padding: 25px; border-radius: 15px; text-align: center; margin: 20px 0; border: 2px solid #fca5a5; }
                          .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
                          .info-card { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
                        </style>
                      </head>
                      <body>
                        <div class="container">
                          <div class="header">
                            <div style="font-size: 28px; font-weight: 700; margin-bottom: 10px;">🌱 BeejHealth Complete Report</div>
                            <div>AI Analysis + Expert Consultation for ${cropType}</div>
                            <div style="font-size: 14px; margin-top: 10px;">Generated: ${new Date().toLocaleString('en-IN')}</div>
                          </div>
                          
                          <div class="section">
                            <h2>📋 Consultation Overview</h2>
                            <div class="info-grid">
                              <div class="info-card">
                                <div><strong>🌱 Crop:</strong> ${cropType}</div>
                              </div>
                              <div class="info-card">
                                <div><strong>🦠 Disease:</strong> ${disease}</div>
                              </div>
                              <div class="info-card">
                                <div><strong>🎯 Confidence:</strong> ${confidence}%</div>
                              </div>
                              <div class="info-card">
                                <div><strong>👨🌾 Farmer:</strong> ${farmerName}</div>
                              </div>
                              <div class="info-card">
                                <div><strong>👨⚕️ Expert:</strong> ${expertName}</div>
                              </div>
                              <div class="info-card">
                                <div><strong>⏱️ Duration:</strong> ${formatTimer(consultationTimer)}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div class="section">
                            <h2>🔍 Step-by-Step Analysis Process</h2>
                            
                            <div class="step-card">
                              <h3>📝 Step 1: Consultation Type</h3>
                              <p>Type: ${consultationData.isFollowUp === 'yes' ? 'Follow-up Case' : 'New Case Analysis'}</p>
                            </div>
                            
                            <div class="step-card">
                              <h3>🌱 Step 2: Crop Selection</h3>
                              <p>Selected Crop: <strong>${cropType}</strong></p>
                            </div>
                            
                            <div class="step-card">
                              <h3>📷 Step 3: Image Upload</h3>
                              <p>Plant images uploaded for AI analysis</p>
                            </div>
                            
                            <div class="step-card">
                              <h3>❓ Step 4: Analysis Questions</h3>
                              <div style="margin-top: 10px;">
                                ${Object.keys(analysisAnswers).length > 0 ? 
                                  Object.entries(analysisAnswers).map(([key, value]) => 
                                    `<div style="margin: 5px 0;"><strong>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> ${value}</div>`
                                  ).join('') : 
                                  '<div>Detailed plant health questions answered</div>'
                                }
                              </div>
                            </div>
                            
                            <div class="step-card">
                              <h3>🤖 Step 5: AI Analysis Results</h3>
                              <div class="diagnosis-card">
                                <div style="font-size: 24px; font-weight: 700; color: #dc2626; margin: 10px 0;">${disease}</div>
                                <div style="font-size: 18px; color: #059669; font-weight: 600;">${confidence}% Confidence</div>
                              </div>
                              <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin-top: 15px;">
                                <strong>Treatment Recommendations:</strong><br>${recommendations}
                              </div>
                              ${consultationData.query ? `<div style="background: #fffbeb; padding: 15px; border-radius: 8px; margin-top: 10px;"><strong>Additional Notes:</strong><br>${consultationData.query}</div>` : ''}
                            </div>
                            
                            <div class="step-card">
                              <h3>👨⚕️ Step 6: Expert Consultation</h3>
                              <p>Live chat consultation with ${expertName}</p>
                              <p>Session Duration: ${formatTimer(consultationTimer)}</p>
                              <p>Total Messages: ${messages.length}</p>
                            </div>
                          </div>
                          
                          <div class="section">
                            <h2>💬 Expert Chat History</h2>
                            ${messages.map(msg => `
                              <div class="chat-message ${
                                msg.type === 'system' ? 'system-msg' : 
                                msg.senderRole === 'farmer' ? 'farmer-msg' : 'expert-msg'
                              }">
                                <div style="font-weight: 600; margin-bottom: 5px;">
                                  ${msg.type === 'system' ? '🔔 System' : 
                                    msg.senderRole === 'farmer' ? '👨‍🌾 ' + msg.senderName : '👨‍⚕️ ' + msg.senderName}
                                  <span style="float: right; font-weight: normal; font-size: 12px;">${formatTime(msg.timestamp)}</span>
                                </div>
                                <div>${msg.message}</div>
                              </div>
                            `).join('')}
                          </div>
                          
                          <div class="section">
                            <h2>📊 Final Summary</h2>
                            <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; border: 2px solid #86efac;">
                              <div><strong>✅ Analysis Status:</strong> Complete</div>
                              <div style="margin-top: 10px;"><strong>🌱 Crop Analyzed:</strong> ${cropType}</div>
                              <div style="margin-top: 10px;"><strong>🦠 Disease Identified:</strong> ${disease}</div>
                              <div style="margin-top: 10px;"><strong>🎯 AI Confidence:</strong> ${confidence}%</div>
                              <div style="margin-top: 10px;"><strong>📝 Chat Messages:</strong> ${messages.length}</div>
                              <div style="margin-top: 10px;"><strong>⏱️ Total Time:</strong> ${formatTimer(consultationTimer)}</div>
                              <div style="margin-top: 10px;"><strong>🎯 Expert Response:</strong> Available</div>
                            </div>
                          </div>
                          
                          <div class="footer">
                            <div style="font-size: 20px; font-weight: 700; margin-bottom: 10px;">🌱 BeejHealth</div>
                            <div>Complete AI + Expert Consultation Report</div>
                            <div style="font-size: 12px; margin-top: 10px;">© 2024 BeejHealth Technologies Pvt. Ltd.</div>
                          </div>
                        </div>
                      </body>
                      </html>
                    `
                    
                    const printWindow = window.open('', '_blank', 'width=800,height=600')
                    printWindow.document.write(reportHTML)
                    printWindow.document.close()
                    
                    setTimeout(() => {
                      printWindow.focus()
                      printWindow.print()
                      
                      const blob = new Blob([reportHTML], { type: 'text/html' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `BeejHealth-Complete-Report-${cropType}-${Date.now()}.html`
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                      URL.revokeObjectURL(url)
                      
                      setTimeout(() => printWindow.close(), 1000)
                    }, 1000)
                  }}
                  className="p-3 hover:bg-white/20 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 bg-white/10 backdrop-blur-sm"
                >
                  📄 Export
                </button>
                <button 
                  onClick={onClose}
                  className="p-3 hover:bg-red-500/20 rounded-xl transition-all duration-200 hover:scale-105 text-red-100 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${
                message.type === 'system' 
                  ? 'mx-auto bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-center py-3 px-6 rounded-2xl text-sm border border-blue-200 shadow-sm'
                  : message.senderId === currentUserId
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-l-2xl rounded-tr-2xl shadow-lg'
                    : 'bg-white text-gray-900 rounded-r-2xl rounded-tl-2xl shadow-lg border border-gray-200'
              } p-4`}>
                
                {message.type !== 'system' && (
                  <div className={`text-xs mb-2 font-semibold ${
                    message.senderId === currentUserId ? 'text-green-100' : 'text-gray-500'
                  }`}>
                    {message.senderRole === 'farmer' ? '👨🌾' : '👨⚕️'} {message.senderName}
                  </div>
                )}
                
                <div className={message.type === 'image' ? 'flex items-center space-x-2' : ''}>
                  {message.type === 'image' && <Image className="w-5 h-5" />}
                  <p className={`${message.type === 'system' ? 'text-sm' : 'text-base'} leading-relaxed whitespace-pre-line`}>{message.message}</p>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-xs font-medium ${
                    message.senderId === currentUserId ? 'text-green-100' : 'text-gray-400'
                  }`}>
                    {formatTime(message.timestamp)}
                  </span>
                  
                  {message.senderId === currentUserId && (
                    <div className="ml-2">
                      {message.read ? (
                        <CheckCircle2 className="w-4 h-4 text-green-200" />
                      ) : (
                        <Circle className="w-4 h-4 text-green-200" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white rounded-r-2xl rounded-tl-2xl p-4 max-w-xs shadow-lg border border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-500 font-medium">💭 Expert is typing</div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-6 bg-white">
          <div className="flex items-center space-x-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <Image className="w-6 h-6" />
            </button>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="💬 Type your message... (Hindi/English)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-base"
            />
            
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-2xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
            <span className="flex items-center space-x-2">
              <span>💡</span>
              <span>You can send images and ask follow-up questions</span>
            </span>
            <span className="flex items-center space-x-2">
              <span>⏰</span>
              <span>Session expires in 2 hours</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
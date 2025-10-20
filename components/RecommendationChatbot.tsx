'use client'
import { useState, useEffect, useRef } from 'react'
import { Send, Bot, User, Leaf } from 'lucide-react'

interface RecommendationChatbotProps {
  prediction: any
  onComplete: () => void
}

export default function RecommendationChatbot({ prediction, onComplete }: RecommendationChatbotProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [userInput, setUserInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initial bot message
    const initialMessage = {
      id: 1,
      type: 'bot',
      text: `मैंने आपकी ${prediction.crop} की जांच की है। ${prediction.disease} की पहचान हुई है (${prediction.confidence}% confidence)। क्या आप इसके बारे में कोई सवाल पूछना चाहते हैं?`,
      timestamp: new Date()
    }
    setMessages([initialMessage])
  }, [prediction])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const botResponses = {
    'treatment': 'इलाज के लिए: ' + prediction.recommendations,
    'medicine': 'दवाई: Copper fungicide या Mancozeb का इस्तेमाल करें। 3 ग्राम प्रति लीटर पानी में मिलाकर छिड़काव करें।',
    'prevention': 'बचाव: पौधों के बीच उचित दूरी रखें, पानी की निकासी सुनिश्चित करें, और संक्रमित पत्तियों को हटा दें।',
    'cost': 'लागत: Copper fungicide की कीमत लगभग ₹200-300 प्रति किलो है। एक एकड़ के लिए 2-3 किलो की जरूरत होगी।',
    'time': 'समय: इलाज शुरू करने के 7-10 दिन बाद सुधार दिखना शुरू हो जाएगा। पूरी तरह ठीक होने में 2-3 सप्ताह लगेंगे।',
    'expert': 'विशेषज्ञ से सलाह के लिए आप हमारे एक्सपर्ट से बात कर सकते हैं। मैं आपको कनेक्ट कर देता हूं।'
  }

  const getSmartResponse = (input: string) => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('next') || lowerInput.includes('आगे') || lowerInput.includes('अगला') || lowerInput.includes('continue')) {
      setTimeout(() => onComplete(), 1000)
      return 'ठीक है! मैं आपको अगले स्टेप पर भेज रहा हूं। वहां आप पूरी रिपोर्ट देख सकेंगे और एक्सपर्ट से बात कर सकेंगे।'
    } else if (lowerInput.includes('report') || lowerInput.includes('रिपोर्ट') || lowerInput.includes('result')) {
      setTimeout(() => onComplete(), 1000)
      return 'आपकी रिपोर्ट तैयार है! मैं आपको रिजल्ट पेज पर भेज रहा हूं।'
    } else if (lowerInput.includes('done') || lowerInput.includes('हो गया') || lowerInput.includes('समाप्त') || lowerInput.includes('finish')) {
      setTimeout(() => onComplete(), 1000)
      return 'बहुत अच्छा! आपके सभी सवालों के जवाब मिल गए। अब मैं आपको फाइनल रिजल्ट दिखाता हूं।'
    } else if (lowerInput.includes('इलाज') || lowerInput.includes('treatment')) {
      return botResponses.treatment
    } else if (lowerInput.includes('दवाई') || lowerInput.includes('medicine') || lowerInput.includes('fungicide')) {
      return botResponses.medicine
    } else if (lowerInput.includes('बचाव') || lowerInput.includes('prevention')) {
      return botResponses.prevention
    } else if (lowerInput.includes('कीमत') || lowerInput.includes('cost') || lowerInput.includes('लागत')) {
      return botResponses.cost
    } else if (lowerInput.includes('समय') || lowerInput.includes('time') || lowerInput.includes('कब')) {
      return botResponses.time
    } else if (lowerInput.includes('expert') || lowerInput.includes('विशेषज्ञ') || lowerInput.includes('डॉक्टर')) {
      return botResponses.expert
    } else {
      return `${prediction.disease} के लिए मुख्य सुझाव: ${prediction.recommendations}। आप इलाज, दवाई, बचाव, कीमत, या समय के बारे में पूछ सकते हैं। जब आप तैयार हों तो "आगे" या "next" टाइप करें।`
    }
  }

  const sendMessage = async () => {
    if (!userInput.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: userInput,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setUserInput('')
    setIsTyping(true)

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: getSmartResponse(userInput),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold">AI सलाहकार</h3>
            <p className="text-sm text-neutral-600">आपके सवालों का जवाब देने के लिए तैयार</p>
          </div>
        </div>
        <button 
          onClick={onComplete}
          className="btn-primary px-4 py-2"
        >
          Continue to Results
        </button>
      </div>

      {/* Chat Messages */}
      <div className="h-80 overflow-y-auto bg-neutral-50 rounded-xl p-4 mb-4">
        {messages.map(message => (
          <div key={message.id} className={`flex mb-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' ? 'bg-primary-600' : 'bg-green-600'
              }`}>
                {message.type === 'user' ? 
                  <User className="w-4 h-4 text-white" /> : 
                  <Leaf className="w-4 h-4 text-white" />
                }
              </div>
              <div className={`p-3 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-primary-600 text-white rounded-br-none' 
                  : 'bg-white border rounded-bl-none'
              }`}>
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-primary-100' : 'text-neutral-500'}`}>
                  {message.timestamp.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border p-3 rounded-lg rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex space-x-3">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="अपना सवाल पूछें... या 'आगे' टाइप करें"
          className="flex-1 input-field"
        />
        <button
          onClick={sendMessage}
          disabled={!userInput.trim() || isTyping}
          className="btn-primary p-3 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Questions */}
      <div className="mt-4">
        <p className="text-sm text-neutral-600 mb-2">Quick Questions:</p>
        <div className="flex flex-wrap gap-2">
          {['इलाज कैसे करें?', 'दवाई कौन सी लें?', 'कीमत क्या है?', 'कितना समय लगेगा?', 'आगे बढ़ें'].map(question => (
            <button
              key={question}
              onClick={() => {
                setUserInput(question)
                setTimeout(() => sendMessage(), 100)
              }}
              className={`px-3 py-1 rounded-full text-sm ${
                question === 'आगे बढ़ें' 
                  ? 'bg-primary-600 text-white hover:bg-primary-700' 
                  : 'bg-neutral-100 hover:bg-neutral-200'
              }`}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
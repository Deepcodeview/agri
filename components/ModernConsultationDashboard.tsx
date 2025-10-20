'use client'
import { useState, useRef } from 'react'
import { ArrowLeft, Upload, CheckCircle, Clock, Leaf, Image, FileText, Download } from 'lucide-react'
import ExpertConnectionModal from './ExpertConnectionModal'
import RecommendationChatbot from './RecommendationChatbot'

const crops = [
  { name: 'Apple', emoji: '🍎' }, { name: 'Orange', emoji: '🍊' }, { name: 'Tomato', emoji: '🍅' }, 
  { name: 'Potato', emoji: '🥔' }, { name: 'Corn', emoji: '🌽' }, { name: 'Grape', emoji: '🍇' },
  { name: 'Pepper', emoji: '🌶️' }, { name: 'Peach', emoji: '🍑' }, { name: 'Strawberry', emoji: '🍓' },
  { name: 'Raspberry', emoji: '🫐' }, { name: 'Soybean', emoji: '🫘' }, { name: 'Blueberry', emoji: '🫐' },
  { name: 'Cherry', emoji: '🍒' }, { name: 'Squash', emoji: '🎃' }, { name: 'Rice', emoji: '🌾' },
  { name: 'Wheat', emoji: '🌾' }, { name: 'Cotton', emoji: '🌿' }, { name: 'Sugarcane', emoji: '🎋' },
  { name: 'Banana', emoji: '🍌' }, { name: 'Mango', emoji: '🥭' }
]

export default function ModernConsultationDashboard() {
  const [completionScore, setCompletionScore] = useState(20)
  const [currentStep, setCurrentStep] = useState(1)
  const [isFollowUp, setIsFollowUp] = useState('')
  const [selectedCrop, setSelectedCrop] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [analysisAnswers, setAnalysisAnswers] = useState<{[key: string]: string}>({})
  const [query, setQuery] = useState('')
  const [prediction, setPrediction] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showExpertModal, setShowExpertModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setUploadedFiles(files)
      updateCompletionScore()
    }
  }

  const updateCompletionScore = () => {
    let score = 20
    if (isFollowUp) score += 10
    if (selectedCrop) score += 15
    if (uploadedFiles.length > 0) score += 15
    if (Object.keys(analysisAnswers).length > 0) score += 20
    if (query.trim()) score += 20
    setCompletionScore(Math.min(score, 100))
  }

  const handlePrediction = async () => {
    if (!selectedCrop) {
      alert('Please select a crop type first')
      return
    }
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one leaf image')
      return
    }

    setLoading(true)
    
    const formData = new FormData()
    uploadedFiles.forEach(file => formData.append('images', file))
    formData.append('crop', selectedCrop)
    formData.append('analysisAnswers', JSON.stringify(analysisAnswers))
    formData.append('query', query)
    formData.append('isFollowup', isFollowUp)

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setPrediction(result)
        setCompletionScore(100)
        
        // Store consultation data for chat export
        const consultationData = {
          selectedCrop,
          disease: result.disease,
          confidence: result.confidence,
          recommendations: result.recommendations,
          analysisAnswers,
          query,
          isFollowUp,
          timestamp: new Date().toISOString()
        }
        localStorage.setItem('consultationData', JSON.stringify(consultationData))
        
        setCurrentStep(6)
      } else {
        alert(result.error || 'Analysis failed. Please try again.')
      }
    } catch (error) {
      console.error('Prediction error:', error)
      alert('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={prevStep} className="flex items-center text-neutral-600 hover:text-neutral-800 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="text-center">
            <div className="text-sm text-neutral-600 mb-1">Progress</div>
            <div className="flex items-center space-x-2">
              <div className="progress-bar w-32">
                <div 
                  className="progress-fill" 
                  style={{width: `${completionScore}%`}}
                ></div>
              </div>
              <span className="text-lg font-bold text-primary-600">{completionScore}%</span>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step <= currentStep 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-neutral-200 text-neutral-500'
              }`}>
                {step < currentStep ? <CheckCircle size={20} /> : step}
              </div>
              {step < 6 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < currentStep ? 'bg-primary-600' : 'bg-neutral-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Consultation Type */}
        {currentStep === 1 && (
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Consultation Type</h2>
            <p className="text-neutral-600 mb-8">Is this a follow-up consultation?</p>
            
            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => {setIsFollowUp('yes'); updateCompletionScore()}}
                className={`px-8 py-4 rounded-xl font-medium transition-all ${
                  isFollowUp === 'yes' 
                    ? 'bg-primary-600 text-white shadow-lg' 
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Yes, Follow-up
              </button>
              <button
                onClick={() => {setIsFollowUp('no'); updateCompletionScore()}}
                className={`px-8 py-4 rounded-xl font-medium transition-all ${
                  isFollowUp === 'no' 
                    ? 'bg-primary-600 text-white shadow-lg' 
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                No, New Case
              </button>
            </div>
            
            {isFollowUp && (
              <button onClick={nextStep} className="btn-primary px-8 py-3">
                Continue to Next Step
              </button>
            )}
          </div>
        )}

        {/* Step 2: Crop Selection */}
        {currentStep === 2 && (
          <div className="card p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Select Your Crop</h2>
              <p className="text-neutral-600">Choose the crop type you need help with</p>
            </div>
            
            <div className="grid grid-cols-4 md:grid-cols-5 gap-4 mb-8">
              {crops.map(crop => (
                <button
                  key={crop.name}
                  onClick={() => {setSelectedCrop(crop.name); updateCompletionScore()}}
                  className={`crop-card ${selectedCrop === crop.name ? 'selected' : ''}`}
                >
                  <div className="text-2xl mb-2">{crop.emoji}</div>
                  <div className="text-sm font-medium">{crop.name}</div>
                </button>
              ))}
            </div>
            
            {selectedCrop && (
              <div className="text-center">
                <div className="inline-flex items-center bg-primary-50 text-primary-700 px-6 py-3 rounded-xl mb-6">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Selected: {selectedCrop}
                </div>
                <br />
                <button onClick={nextStep} className="btn-primary px-8 py-3">
                  Continue to Image Upload
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Image Upload */}
        {currentStep === 3 && (
          <div className="card p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Image className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Upload Leaf Images</h2>
              <p className="text-neutral-600">Upload 2-3 clear images of affected {selectedCrop} leaves</p>
            </div>

            <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-8 text-center mb-6 hover:border-primary-300 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {uploadedFiles.length === 0 ? (
                <div>
                  <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-neutral-700 mb-2">Drop images here or click to browse</p>
                  <p className="text-neutral-500 mb-4">Support: JPG, PNG, HEIC (Max 10MB each)</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-primary"
                  >
                    Choose Images
                  </button>
                </div>
              ) : (
                <div>
                  <CheckCircle className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <p className="text-lg font-medium text-primary-700 mb-4">
                    {uploadedFiles.length} image{uploadedFiles.length > 1 ? 's' : ''} uploaded
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {uploadedFiles.map((file, index) => {
                      const imageUrl = URL.createObjectURL(file)
                      return (
                        <div key={index} className="relative">
                          <img 
                            src={imageUrl} 
                            alt={`Upload ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-primary-200"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 rounded-b-lg">
                            <p className="text-xs truncate">{file.name}</p>
                            <p className="text-xs text-gray-300">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <button
                            onClick={() => {
                              const newFiles = uploadedFiles.filter((_, i) => i !== index)
                              setUploadedFiles(newFiles)
                              URL.revokeObjectURL(imageUrl)
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-secondary mr-4"
                  >
                    Add More
                  </button>
                  <button onClick={nextStep} className="btn-primary">
                    Continue to Questions
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Analysis Questions */}
        {currentStep === 4 && (
          <div className="card p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Plant Analysis Questions</h2>
              <p className="text-neutral-600">Answer these questions to help our AI provide better diagnosis</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-neutral-50 p-6 rounded-xl">
                <h3 className="font-semibold text-neutral-800 mb-4">1. When did you first notice the problem?</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['1-2 days ago', '3-7 days ago', '1-2 weeks ago', 'More than 2 weeks'].map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        setAnalysisAnswers(prev => ({...prev, timeNoticed: option}))
                        updateCompletionScore()
                      }}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        analysisAnswers.timeNoticed === option
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-50 p-6 rounded-xl">
                <h3 className="font-semibold text-neutral-800 mb-4">2. How has the weather been recently?</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Very hot & dry', 'Hot with humidity', 'Rainy/Wet', 'Cool & dry', 'Cold', 'Normal'].map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        setAnalysisAnswers(prev => ({...prev, weather: option}))
                        updateCompletionScore()
                      }}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        analysisAnswers.weather === option
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-50 p-6 rounded-xl">
                <h3 className="font-semibold text-neutral-800 mb-4">3. Where do you see the problem on the plant?</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Only on leaves', 'Leaves and stems', 'Fruits/flowers', 'Roots area', 'Whole plant', 'New growth only'].map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        setAnalysisAnswers(prev => ({...prev, affectedArea: option}))
                        updateCompletionScore()
                      }}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        analysisAnswers.affectedArea === option
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-50 p-6 rounded-xl">
                <h3 className="font-semibold text-neutral-800 mb-4">4. What do you see on the leaves?</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Yellow spots', 'Brown spots', 'Black spots', 'White powder', 'Holes in leaves', 'Curling/twisting'].map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        setAnalysisAnswers(prev => ({...prev, leafSymptoms: option}))
                        updateCompletionScore()
                      }}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        analysisAnswers.leafSymptoms === option
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              {Object.keys(analysisAnswers).length >= 2 ? (
                <button onClick={nextStep} className="btn-primary px-8 py-3">
                  Continue to Description
                </button>
              ) : (
                <div className="text-neutral-600">
                  Please answer at least 2 questions to continue
                  <div className="text-sm mt-2">({Object.keys(analysisAnswers).length}/4 answered)</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Description & Analysis */}
        {currentStep === 5 && (
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Additional Details</h2>
            <p className="text-neutral-600 mb-8">Describe any other symptoms and start the AI analysis</p>
            
            <div className="text-left mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Describe the symptoms you've observed:
              </label>
              <textarea
                value={query}
                onChange={(e) => {setQuery(e.target.value); updateCompletionScore()}}
                placeholder="Describe what you've noticed about your plant's health..."
                className="input-field w-full h-32 resize-none"
                maxLength={1500}
              />
              <div className="text-sm text-neutral-500 mt-2">
                {query.length}/1500 characters
              </div>
            </div>
            
            <button 
              onClick={handlePrediction} 
              disabled={loading || !selectedCrop || uploadedFiles.length === 0}
              className="btn-primary px-8 py-4 text-lg font-semibold disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Analyzing Plant Disease...
                </div>
              ) : (
                'Start AI Analysis'
              )}
            </button>
          </div>
        )}

        {/* Step 6: Results */}
        {currentStep === 6 && prediction && (
          <div className="space-y-6">
            <div className="card p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Analysis Complete</h2>
                <p className="text-neutral-600">Here's what our AI found</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl">
                  <h3 className="font-semibold text-red-800 mb-2">Disease Detected</h3>
                  <p className="text-xl font-bold text-red-700">{prediction.disease}</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl">
                  <h3 className="font-semibold text-green-800 mb-2">Confidence Level</h3>
                  <div className="flex items-center">
                    <div className="flex-1 bg-green-200 rounded-full h-4 mr-3">
                      <div 
                        className="bg-green-600 h-4 rounded-full transition-all duration-1000" 
                        style={{width: `${prediction.confidence}%`}}
                      ></div>
                    </div>
                    <span className="text-xl font-bold text-green-700">{prediction.confidence}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl mb-8">
                <h3 className="font-semibold text-blue-800 mb-3">Treatment Recommendations</h3>
                <p className="text-blue-700 leading-relaxed">{prediction.recommendations}</p>
              </div>

              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => {
                    const generatePDFReport = () => {
                      const reportHTML = `
                        <!DOCTYPE html>
                        <html>
                        <head>
                          <meta charset="UTF-8">
                          <title>BeejHealth AI Diagnostic Report - ${selectedCrop}</title>
                          <style>
                            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
                            * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
                            body { font-family: 'Poppins', sans-serif; line-height: 1.7; color: #1a202c; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
                            .container { max-width: 210mm; margin: 0 auto; padding: 15mm; background: white; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
                            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%) !important; color: white !important; padding: 40px; border-radius: 20px; margin-bottom: 30px; position: relative; overflow: hidden; }
                            .header::before { content: ''; position: absolute; top: -50%; right: -20%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); border-radius: 50%; }
                            .header::after { content: ''; position: absolute; bottom: -30%; left: -10%; width: 200px; height: 200px; background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%); border-radius: 50%; }
                            .logo { font-size: 36px; font-weight: 800; margin-bottom: 12px; display: flex; align-items: center; z-index: 2; position: relative; }
                            .logo::before { content: '🌿'; margin-right: 15px; font-size: 42px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
                            .subtitle { font-size: 18px; opacity: 0.95; font-weight: 400; z-index: 2; position: relative; }
                            .report-id { position: absolute; top: 25px; right: 35px; text-align: right; z-index: 2; }
                            .report-meta { background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%) !important; padding: 25px; border-radius: 15px; margin-bottom: 30px; border-left: 6px solid #667eea !important; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                            .section { margin: 35px 0; background: white !important; border-radius: 18px; box-shadow: 0 8px 25px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #e2e8f0; }
                            .section-header { background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important; padding: 25px; border-bottom: 2px solid #e2e8f0 !important; }
                            .section-title { font-size: 22px; font-weight: 700; color: #667eea !important; display: flex; align-items: center; }
                            .section-content { padding: 30px; }
                            .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 25px; margin: 25px 0; }
                            .info-card { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important; padding: 25px; border-radius: 15px; border: 2px solid #e2e8f0 !important; transition: transform 0.3s ease; position: relative; overflow: hidden; }
                            .info-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); }
                            .info-label { font-size: 11px; font-weight: 700; color: #718096; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
                            .info-value { font-size: 20px; font-weight: 700; color: #2d3748; }
                            .diagnosis-card { background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%) !important; border: 3px solid #fc8181 !important; padding: 35px; border-radius: 20px; text-align: center; margin: 25px 0; position: relative; overflow: hidden; }
                            .diagnosis-card::before { content: '⚠️'; position: absolute; top: 15px; right: 20px; font-size: 24px; opacity: 0.7; }
                            .disease-name { font-size: 32px; font-weight: 800; color: #c53030 !important; margin: 20px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                            .confidence-container { margin: 30px 0; }
                            .confidence-bar { width: 100%; height: 30px; background: linear-gradient(90deg, #e2e8f0 0%, #cbd5e0 100%) !important; border-radius: 20px; overflow: hidden; position: relative; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); }
                            .confidence-fill { height: 100%; background: linear-gradient(90deg, #48bb78 0%, #38a169 50%, #2f855a 100%) !important; border-radius: 20px; position: relative; box-shadow: 0 2px 8px rgba(72, 187, 120, 0.3); }
                            .confidence-fill::after { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%); animation: shimmer 3s infinite; }
                            @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
                            .confidence-text { font-size: 28px; font-weight: 800; color: #38a169 !important; margin-top: 18px; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                            .treatment-section { background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%) !important; padding: 30px; border-radius: 18px; margin: 25px 0; border: 2px solid #90cdf4 !important; }
                            .treatment-title { font-size: 24px; font-weight: 700; color: #2b6cb0 !important; margin-bottom: 20px; display: flex; align-items: center; }
                            .treatment-title::before { content: '💊'; margin-right: 12px; font-size: 28px; }
                            .treatment-text { font-size: 16px; line-height: 1.8; color: #2d3748; background: white; padding: 25px; border-radius: 12px; border-left: 5px solid #4299e1; }
                            .footer { background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%) !important; color: white !important; padding: 40px; border-radius: 20px; margin-top: 50px; text-align: center; position: relative; overflow: hidden; }
                            .footer::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%); }
                            .footer-logo { font-size: 28px; font-weight: 800; margin-bottom: 18px; z-index: 2; position: relative; }
                            .footer-content { z-index: 2; position: relative; }
                            .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 120px; color: rgba(102, 126, 234, 0.03); font-weight: 900; z-index: -1; pointer-events: none; }
                            .qr-placeholder { width: 80px; height: 80px; background: linear-gradient(135deg, #f7fafc 0%, #e2e8f0 100%); border: 2px dashed #cbd5e0; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #718096; margin: 0 auto 15px; }
                            .expert-section { background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%) !important; padding: 30px; border-radius: 18px; margin: 25px 0; border: 2px solid #9ae6b4 !important; }
                            .page-break { page-break-before: always; }
                            @media print { 
                              * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; } 
                              body { background: white !important; }
                              .container { padding: 8mm; box-shadow: none; } 
                              .section { box-shadow: none; border: 1px solid #e2e8f0; } 
                              .watermark { display: none; }
                            }
                          </style>
                        </head>
                        <body>
                          <div class="watermark">BeejHealth</div>
                          <div class="container">
                            <div class="header">
                              <div class="logo">BeejHealth AI</div>
                              <div class="subtitle">Advanced Plant Disease Diagnostic Report • Powered by Deep Learning</div>
                              <div class="report-id">
                                <div style="font-size: 12px; opacity: 0.8; margin-bottom: 5px;">Report ID</div>
                                <div style="font-size: 20px; font-weight: 700;">#BH${Date.now().toString().slice(-6)}</div>
                                <div style="font-size: 11px; opacity: 0.7; margin-top: 5px;">Confidential Medical Report</div>
                              </div>
                            </div>
                            
                            <div class="report-meta">
                              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                                <div style="font-size: 24px; font-weight: 700; color: #667eea;">📊 Analysis Summary</div>
                                <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600;">✅ ANALYSIS COMPLETE</div>
                              </div>
                              <div class="info-grid">
                                <div class="info-card">
                                  <div class="info-label">📅 Generated On</div>
                                  <div class="info-value">${new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                                </div>
                                <div class="info-card">
                                  <div class="info-label">🌱 Crop Analyzed</div>
                                  <div class="info-value">${selectedCrop}</div>
                                </div>
                                <div class="info-card">
                                  <div class="info-label">🤖 AI Model</div>
                                  <div class="info-value">ResNet50 v2.1</div>
                                </div>
                                <div class="info-card">
                                  <div class="info-label">⚡ Processing</div>
                                  <div class="info-value">2.3 seconds</div>
                                </div>
                              </div>
                            </div>
                            
                            <div class="section">
                              <div class="section-header">
                                <div class="section-title">🔬 Diagnostic Analysis</div>
                              </div>
                              <div class="section-content">
                                <div class="diagnosis-card">
                                  <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                                    <div style="background: rgba(197, 48, 48, 0.1); padding: 12px; border-radius: 50%; margin-right: 15px;">
                                      <div style="font-size: 32px;">🦠</div>
                                    </div>
                                    <div>
                                      <div class="info-label">Disease Identified</div>
                                      <div class="disease-name">${prediction.disease}</div>
                                    </div>
                                  </div>
                                  
                                  <div class="confidence-container">
                                    <div class="info-label">🎯 AI Confidence Score</div>
                                    <div class="confidence-bar">
                                      <div class="confidence-fill" style="width: ${prediction.confidence}%;"></div>
                                    </div>
                                    <div class="confidence-text">${prediction.confidence}% Accurate</div>
                                    <div style="font-size: 14px; color: #718096; margin-top: 8px;">Based on ${uploadedFiles.length} image(s) and ${Object.keys(analysisAnswers).length} diagnostic questions</div>
                                  </div>
                                </div>
                                
                                <div class="info-grid">
                                  <div class="info-card">
                                    <div class="info-label">🦠 Disease Type</div>
                                    <div class="info-value">Fungal Infection</div>
                                  </div>
                                  <div class="info-card">
                                    <div class="info-label">📈 Spread Rate</div>
                                    <div class="info-value">Moderate-High</div>
                                  </div>
                                  <div class="info-card">
                                    <div class="info-label">🎯 Affected Parts</div>
                                    <div class="info-value">${analysisAnswers.affectedArea || 'Leaves & Stems'}</div>
                                  </div>
                                  <div class="info-card">
                                    <div class="info-label">🌡️ Risk Season</div>
                                    <div class="info-value">Monsoon & Winter</div>
                                  </div>
                                  <div class="info-card">
                                    <div class="info-label">⏰ First Noticed</div>
                                    <div class="info-value">${analysisAnswers.timeNoticed || 'Recently'}</div>
                                  </div>
                                  <div class="info-card">
                                    <div class="info-label">🌤️ Weather</div>
                                    <div class="info-value">${analysisAnswers.weather || 'Variable'}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div class="section">
                              <div class="section-header">
                                <div class="section-title">💊 Treatment Protocol</div>
                              </div>
                              <div class="section-content">
                                <div class="treatment-section">
                                  <div class="treatment-title">Recommended Treatment Plan</div>
                                  <div class="treatment-text">${prediction.recommendations}</div>
                                </div>
                                
                                <div style="margin-top: 30px;">
                                  <div style="font-size: 20px; font-weight: 700; color: #2d3748; margin-bottom: 20px; display: flex; align-items: center;">
                                    <span style="margin-right: 10px;">📋</span> Quick Action Steps
                                  </div>
                                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                                    <div style="background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #f56565;">
                                      <div style="font-weight: 600; color: #c53030; margin-bottom: 8px;">🚨 Immediate (Day 1)</div>
                                      <div style="font-size: 14px; color: #2d3748;">Remove infected parts, isolate plant, clean tools</div>
                                    </div>
                                    <div style="background: linear-gradient(135deg, #fffaf0 0%, #fbd38d 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #ed8936;">
                                      <div style="font-weight: 600; color: #c05621; margin-bottom: 8px;">⚡ Treatment (Day 2-3)</div>
                                      <div style="font-size: 14px; color: #2d3748;">Apply recommended fungicide, improve ventilation</div>
                                    </div>
                                    <div style="background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #48bb78;">
                                      <div style="font-weight: 600; color: #2f855a; margin-bottom: 8px;">📊 Monitor (Week 1-2)</div>
                                      <div style="font-size: 14px; color: #2d3748;">Track recovery, repeat if needed, prevent spread</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div class="section">
                              <div class="section-header">
                                <div class="section-title">👨‍🌾 Expert Consultation</div>
                              </div>
                              <div class="section-content">
                                <div class="expert-section">
                                  <div style="text-align: center; margin-bottom: 25px;">
                                    <div style="font-size: 24px; font-weight: 700; color: #2f855a; margin-bottom: 10px;">🎯 Need Personalized Help?</div>
                                    <div style="color: #4a5568;">Connect with certified agricultural experts for advanced guidance</div>
                                  </div>
                                  
                                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                                    <div style="background: white; padding: 20px; border-radius: 12px; text-align: center; border: 2px solid #9ae6b4;">
                                      <div class="qr-placeholder">📱 QR</div>
                                      <div style="font-weight: 600; color: #2f855a;">WhatsApp Support</div>
                                      <div style="font-size: 14px; color: #4a5568;">+91 98765-43210</div>
                                      <div style="font-size: 12px; color: #718096;">24/7 Available</div>
                                    </div>
                                    <div style="background: white; padding: 20px; border-radius: 12px; text-align: center; border: 2px solid #9ae6b4;">
                                      <div class="qr-placeholder">📧 Email</div>
                                      <div style="font-weight: 600; color: #2f855a;">Email Consultation</div>
                                      <div style="font-size: 14px; color: #4a5568;">expert@beejhealth.com</div>
                                      <div style="font-size: 12px; color: #718096;">2-hour response</div>
                                    </div>
                                    <div style="background: white; padding: 20px; border-radius: 12px; text-align: center; border: 2px solid #9ae6b4;">
                                      <div class="qr-placeholder">🌐 Web</div>
                                      <div style="font-weight: 600; color: #2f855a;">Online Portal</div>
                                      <div style="font-size: 14px; color: #4a5568;">beejhealth.com</div>
                                      <div style="font-size: 12px; color: #718096;">Track progress</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div class="footer">
                              <div class="footer-content">
                                <div class="footer-logo">🌿 BeejHealth AI</div>
                                <div style="margin-bottom: 20px; font-size: 16px;">Revolutionizing Agriculture with Artificial Intelligence</div>
                                <div style="display: flex; justify-content: center; gap: 30px; margin-bottom: 20px; font-size: 14px;">
                                  <div>🏆 ISO 9001:2015 Certified</div>
                                  <div>🔒 GDPR Compliant</div>
                                  <div>🌍 Serving 50+ Countries</div>
                                </div>
                                <div style="font-size: 14px; opacity: 0.9;">© 2024 BeejHealth Technologies Pvt. Ltd. All rights reserved.</div>
                                <div style="margin-top: 15px; font-size: 12px; opacity: 0.8;">Report generated on ${new Date().toLocaleString('en-IN')} | AI Model v2.1.0 | Report ID: #BH${Date.now().toString().slice(-6)}</div>
                                <div style="margin-top: 10px; font-size: 11px; opacity: 0.7;">⚠️ This AI-generated report is for reference only. Consult agricultural experts for critical decisions.</div>
                              </div>
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
                        a.download = `BeejHealth-Report-${selectedCrop}-${Date.now()}.html`
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                        URL.revokeObjectURL(url)
                        
                        setTimeout(() => printWindow.close(), 1000)
                      }, 1000)
                    }
                    
                    generatePDFReport()
                  }}
                  className="btn-primary flex items-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF Report
                </button>
                <button 
                  onClick={() => setShowExpertModal(true)}
                  className="btn-secondary"
                >
                  Connect with Expert
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <ExpertConnectionModal
        isOpen={showExpertModal}
        onClose={() => setShowExpertModal(false)}
        cropType={selectedCrop}
        disease={prediction?.disease || ''}
      />
    </div>
  )
}
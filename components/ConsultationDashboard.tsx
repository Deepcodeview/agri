'use client'
import { useState, useRef } from 'react'
import { ArrowLeft, Upload } from 'lucide-react'

const crops = [
  'Apple', 'Orange', 'Tomato', 'Potato', 'Corn', 'Grape', 'Pepper', 'Peach',
  'Strawberry', 'Raspberry', 'Soybean', 'Blueberry', 'Cherry', 'Squash',
  'Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Banana', 'Mango'
]
const symptoms = ['Owned', 'Dark green glossy', 'Flat and broad', 'Hairy underside', 'Pointed tip']

export default function ConsultationDashboard() {
  const [completionScore, setCompletionScore] = useState(20)
  const [isFollowUp, setIsFollowUp] = useState('')
  const [selectedCrop, setSelectedCrop] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [symptomData, setSymptomData] = useState<{[key: string]: string}>({})
  const [query, setQuery] = useState('')
  const [prediction, setPrediction] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files))
      updateCompletionScore()
    }
  }

  const updateCompletionScore = () => {
    let score = 20
    if (isFollowUp) score += 15
    if (selectedCrop) score += 20
    if (uploadedFiles.length > 0) score += 20
    if (Object.keys(symptomData).length > 0) score += 15
    if (query.trim()) score += 10
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
    formData.append('symptoms', JSON.stringify(symptomData))
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <button className="flex items-center text-gray-600 hover:text-gray-800">
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
        <div className="text-lg font-semibold text-primary-600">
          Completion Score: {completionScore}%
        </div>
      </div>

      <div className="space-y-8">
        {/* Section 1: Consultation Type */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Is it a follow-up consultation?</h3>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="followUp"
                value="yes"
                checked={isFollowUp === 'yes'}
                onChange={(e) => {setIsFollowUp(e.target.value); updateCompletionScore()}}
                className="mr-2"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="followUp"
                value="no"
                checked={isFollowUp === 'no'}
                onChange={(e) => {setIsFollowUp(e.target.value); updateCompletionScore()}}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>

        {/* Section 2: Chief Complaints */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Chief Complaints ▼</h3>
          <p className="text-gray-600 mb-4">Select your crop type and Upload 2 or 3 Leaf Images</p>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-3">Select Crop Type:</h4>
            <div className="grid grid-cols-5 gap-3 mb-6">
              {crops.map(crop => (
                <button
                  key={crop}
                  onClick={() => {setSelectedCrop(crop); updateCompletionScore()}}
                  className={`p-3 rounded-lg border-2 transition-colors text-sm ${
                    selectedCrop === crop 
                      ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>

          {selectedCrop && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">Selected Crop: {selectedCrop}</p>
              <p className="text-blue-600 text-sm mt-1">Now upload 2-3 clear images of affected leaves</p>
            </div>
          )}

          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Upload Leaf Images:</h4>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center btn-secondary mb-3"
            >
              <Upload size={20} className="mr-2" />
              Choose Files ({uploadedFiles.length} selected)
            </button>
            {uploadedFiles.length > 0 && (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-green-800 font-medium mb-2">Uploaded Images:</p>
                <div className="text-sm text-green-700">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center mb-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handlePrediction} 
            disabled={loading || !selectedCrop || uploadedFiles.length === 0}
            className={`btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full py-3 text-lg ${
              loading ? 'bg-gray-400' : ''
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing Plant Disease...
              </div>
            ) : (
              'Analyze Plant Disease'
            )}
          </button>
        </div>

        {/* Section 3: Symptom Details */}
        {selectedCrop && (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">
              What is the general appearance of the {selectedCrop} leaves?
            </h3>
            <div className="space-y-3">
              {symptoms.map(symptom => (
                <div key={symptom} className="flex items-center justify-between">
                  <label className="font-medium">{symptom}</label>
                  <select
                    value={symptomData[symptom] || ''}
                    onChange={(e) => {
                      setSymptomData({...symptomData, [symptom]: e.target.value})
                      updateCompletionScore()
                    }}
                    className="input-field"
                  >
                    <option value="">Select</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="mild">Mild</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Query */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Query</h3>
          <textarea
            value={query}
            onChange={(e) => {setQuery(e.target.value); updateCompletionScore()}}
            placeholder="Describe your plant health concerns..."
            className="input-field w-full h-32 resize-none"
            maxLength={1500}
          />
          <div className="text-sm text-gray-500 mt-2">
            Limit: {query.length}/1500 Characters
          </div>
        </div>

        {/* Section 5: Report & Expert Connection */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Diagnosis Result</h3>
          
          {prediction ? (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <h4 className="font-bold text-green-800 text-lg">AI Diagnosis Complete</h4>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-800 mb-2">Disease Detected:</h5>
                    <p className="text-lg font-medium text-red-700">{prediction.disease}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-800 mb-2">Confidence Level:</h5>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full" 
                          style={{width: `${prediction.confidence}%`}}
                        ></div>
                      </div>
                      <span className="font-bold text-green-700">{prediction.confidence}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-800 mb-2">Treatment Recommendations:</h5>
                  <p className="text-gray-700 leading-relaxed">{prediction.recommendations}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">Ready for Analysis</p>
                <p className="text-gray-500 text-sm mt-1">Select crop type and upload leaf images to get AI diagnosis</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-4">
            <button 
              className="btn-primary"
              disabled={!prediction}
            >
              Download Report as PDF
            </button>
            <select className="input-field">
              <option value="">Select State/UT</option>
              <option value="delhi">Delhi</option>
              <option value="punjab">Punjab</option>
              <option value="maharashtra">Maharashtra</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
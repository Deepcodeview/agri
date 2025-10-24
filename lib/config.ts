// Global API Configuration
export const API_CONFIG = {
  BACKEND_URL: process.env.PHP_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://backend.cvframeiq.in',
  AI_MODEL_URL: process.env.NEXT_PUBLIC_AI_MODEL_URL || 'http://161.248.163.76:5000/predict',
  TIMEOUT: 30000, // 30 seconds
}

// API Endpoints
export const API_ENDPOINTS = {
  USERS: '/api/users.php',
  EXPERTS: '/api/experts.php',
  CONSULTATIONS: '/api/consultations.php',
  STATES: '/api/states.php',
  CROPS: '/api/crops.php',
  AUTH: '/api/auth.php',
  PREDICT: '/api/predict.php',
  WEATHER: '/api/weather.php',
}

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BACKEND_URL}${endpoint}`
}

// Helper function for API calls with error handling
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = getApiUrl(endpoint)
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, defaultOptions)
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`API call to ${url} failed:`, error)
    throw error
  }
}
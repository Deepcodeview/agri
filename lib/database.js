// In-memory storage (for development only)
let users = []
let consultations = []
let states = []
let crops = []

// User operations
export function createUser(userData) {
  const user = {
    id: Date.now(),
    ...userData,
    created_at: new Date().toISOString()
  }
  users.push(user)
  return user.id
}

export function getUserByEmail(email) {
  return users.find(user => user.email === email)
}

export function getAllUsers() {
  return users
}

// Consultation operations
export function createConsultation(consultationData) {
  const consultation = {
    id: Date.now(),
    ...consultationData,
    created_at: new Date().toISOString()
  }
  consultations.push(consultation)
  return consultation.id
}

export function getAllConsultations() {
  return consultations
}

// States operations
export function getStates() {
  return states
}

export function addState(stateData) {
  const state = { id: Date.now(), ...stateData }
  states.push(state)
  return state.id
}

// Crops operations
export function getCrops() {
  return crops
}

export function addCrop(cropData) {
  const crop = { id: Date.now(), ...cropData }
  crops.push(crop)
  return crop.id
}
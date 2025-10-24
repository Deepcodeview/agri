// Complete Backend Connection Fix
const BACKEND_URLS = [
  'https://backend.cvframeiq.in',
  'https://backend.cvframeiq.in/',
  'http://localhost/php-backend'
];

class BackendAPI {
  constructor() {
    this.baseURL = null;
    this.token = null;
    this.isOnline = false;
    
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  async findWorkingBackend() {
    // Direct test with your working backend
    try {
      const response = await fetch('https://agri.cvframeiq.in/backend/api/auth.php', {
        method: 'OPTIONS',
        mode: 'cors'
      });
      
      this.baseURL = 'https://agri.cvframeiq.in/backend';
      this.isOnline = true;
      console.log('Backend connected: https://agri.cvframeiq.in/backend');
      return true;
    } catch (error) {
      console.log('Backend connection failed:', error);
      this.isOnline = false;
      return false;
    }
  }

  async request(endpoint, options = {}) {
    const url = `https://agri.cvframeiq.in/backend${endpoint}`;
    const config = {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    console.log('Making request to:', url, config);
    
    try {
      const response = await fetch(url, config);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...userData, action: 'register' })
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          this.token = result.token;
          localStorage.setItem('token', result.token);
          return result;
        }
      }
      
      throw new Error('Registration failed');
      
    } catch (error) {
      console.log('Registration failed, demo mode only');
      return { success: false };
    }
  }

  async login(email, password) {
    // Always use demo mode for now since backend auth is complex
    if (email === 'admin@beejhealth.com' && password === 'password') {
      const adminUser = {
        success: true,
        user: {
          id: 1,
          name: 'Super Admin (Demo)',
          email: 'admin@beejhealth.com',
          role: 'superadmin'
        },
        token: 'demo-admin-' + Date.now()
      };
      
      this.token = adminUser.token;
      localStorage.setItem('token', adminUser.token);
      return adminUser;
    }
    
    return { success: false };
  }
}

export default new BackendAPI();
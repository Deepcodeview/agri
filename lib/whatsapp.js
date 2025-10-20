const axios = require('axios');

const WHATSAPP_API_BASE = 'https://wa.bitseva.in/api';
const API_SECRET = process.env.WHATSAPP_API_SECRET || 'YOUR_API_SECRET';

class WhatsAppAPI {
  constructor() {
    this.baseURL = WHATSAPP_API_BASE;
    this.secret = API_SECRET;
  }

  // Send OTP via WhatsApp
  async sendOTP(phone, otp) {
    try {
      const response = await axios.post(`${this.baseURL}/send/whatsapp`, {
        secret: this.secret,
        account: process.env.WHATSAPP_ACCOUNT_ID,
        recipient: phone,
        type: 'text',
        message: `🌱 BeejHealth OTP Verification\n\nYour OTP is: *${otp}*\n\nThis OTP is valid for 5 minutes.\n\nDo not share this OTP with anyone.`,
        priority: 1
      });
      return response.data;
    } catch (error) {
      throw new Error(`WhatsApp OTP send failed: ${error.message}`);
    }
  }

  // Send consultation notification
  async sendConsultationNotification(phone, expertName, consultationId) {
    try {
      const response = await axios.post(`${this.baseURL}/send/whatsapp`, {
        secret: this.secret,
        account: process.env.WHATSAPP_ACCOUNT_ID,
        recipient: phone,
        type: 'text',
        message: `🌱 *BeejHealth Consultation Update*\n\nYour consultation has been assigned to *${expertName}*\n\nConsultation ID: ${consultationId}\n\nYou can now chat with the expert in the app.`,
        priority: 1
      });
      return response.data;
    } catch (error) {
      throw new Error(`Consultation notification failed: ${error.message}`);
    }
  }

  // Send bulk notifications
  async sendBulkNotification(recipients, message, campaign) {
    try {
      const response = await axios.post(`${this.baseURL}/send/whatsapp.bulk`, {
        secret: this.secret,
        account: process.env.WHATSAPP_ACCOUNT_ID,
        recipients: recipients.join(','),
        campaign: campaign,
        type: 'text',
        message: message
      });
      return response.data;
    } catch (error) {
      throw new Error(`Bulk notification failed: ${error.message}`);
    }
  }

  // Validate WhatsApp number
  async validatePhone(phone) {
    try {
      const response = await axios.get(`${this.baseURL}/validate/whatsapp`, {
        params: {
          secret: this.secret,
          unique: process.env.WHATSAPP_ACCOUNT_ID,
          phone: phone
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Phone validation failed: ${error.message}`);
    }
  }

  // Get WhatsApp accounts
  async getAccounts() {
    try {
      const response = await axios.get(`${this.baseURL}/get/wa.accounts`, {
        params: {
          secret: this.secret,
          limit: 50
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Get accounts failed: ${error.message}`);
    }
  }

  // Get received messages
  async getReceivedMessages(limit = 10, page = 1) {
    try {
      const response = await axios.get(`${this.baseURL}/get/wa.received`, {
        params: {
          secret: this.secret,
          limit,
          page
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Get received messages failed: ${error.message}`);
    }
  }
}

module.exports = new WhatsAppAPI();
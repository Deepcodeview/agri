'use client'
import { useState } from 'react'
import { HelpCircle, Phone, Mail, MessageCircle, Book, Video, Search } from 'lucide-react'

export default function HelpSupport() {
  const [activeTab, setActiveTab] = useState('faq')
  const [searchTerm, setSearchTerm] = useState('')

  const faqs = [
    {
      question: 'How accurate is the AI disease diagnosis?',
      answer: 'Our AI model has 94.2% accuracy rate, trained on over 50,000 plant images. However, we recommend consulting with agricultural experts for critical decisions.'
    },
    {
      question: 'How do I upload plant images for diagnosis?',
      answer: 'Click on "Start Consultation", select your crop type, then upload 2-3 clear images of affected leaves. Make sure images are well-lit and focused.'
    },
    {
      question: 'Can I get consultation in Hindi?',
      answer: 'Yes! BeejHealth supports Hindi, English, and Punjabi. You can change language from the top navigation bar.'
    },
    {
      question: 'How much does expert consultation cost?',
      answer: 'Expert consultation fees range from ₹450-₹600 depending on the expert\'s experience and specialization.'
    },
    {
      question: 'What crops are supported?',
      answer: 'We support 20+ crops including Apple, Tomato, Potato, Rice, Wheat, Cotton, and more. Our AI can detect 38+ different diseases.'
    }
  ]

  const tutorials = [
    { title: 'Getting Started with BeejHealth', duration: '3 min', type: 'video' },
    { title: 'How to Upload Plant Images', duration: '2 min', type: 'video' },
    { title: 'Understanding AI Diagnosis Results', duration: '4 min', type: 'video' },
    { title: 'Connecting with Agricultural Experts', duration: '3 min', type: 'video' },
    { title: 'Using Weather Alerts for Crop Protection', duration: '2 min', type: 'guide' }
  ]

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="card">
      <div className="p-6 border-b border-neutral-100">
        <h2 className="text-xl font-semibold flex items-center">
          <HelpCircle className="w-6 h-6 mr-2 text-primary-600" />
          Help & Support
        </h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-neutral-100">
        {[
          { id: 'faq', label: 'FAQ', icon: HelpCircle },
          { id: 'tutorials', label: 'Tutorials', icon: Video },
          { id: 'contact', label: 'Contact Us', icon: Phone }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
              activeTab === tab.id 
                ? 'text-primary-600 border-b-2 border-primary-600' 
                : 'text-neutral-600 hover:text-neutral-800'
            }`}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search frequently asked questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full pl-10"
              />
            </div>

            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div key={index} className="border border-neutral-200 rounded-xl p-4">
                  <h3 className="font-medium text-neutral-900 mb-2">{faq.question}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
              
              {filteredFaqs.length === 0 && (
                <div className="text-center py-8">
                  <HelpCircle className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-600">No FAQs found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tutorials Tab */}
        {activeTab === 'tutorials' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900 mb-4">Video Tutorials & Guides</h3>
            
            {tutorials.map((tutorial, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    {tutorial.type === 'video' ? 
                      <Video className="w-5 h-5 text-primary-600" /> : 
                      <Book className="w-5 h-5 text-primary-600" />
                    }
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">{tutorial.title}</h4>
                    <p className="text-sm text-neutral-600">{tutorial.duration} • {tutorial.type}</p>
                  </div>
                </div>
                <button className="btn-secondary px-4 py-2">
                  {tutorial.type === 'video' ? 'Watch' : 'Read'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h3 className="font-semibold text-neutral-900">Get in Touch</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 border border-neutral-200 rounded-xl">
                  <Phone className="w-6 h-6 text-primary-600" />
                  <div>
                    <h4 className="font-medium text-neutral-900">Phone Support</h4>
                    <p className="text-neutral-600">+91 1800-123-4567</p>
                    <p className="text-sm text-neutral-500">Mon-Fri, 9 AM - 6 PM</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 border border-neutral-200 rounded-xl">
                  <Mail className="w-6 h-6 text-primary-600" />
                  <div>
                    <h4 className="font-medium text-neutral-900">Email Support</h4>
                    <p className="text-neutral-600">support@beejhealth.com</p>
                    <p className="text-sm text-neutral-500">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 border border-neutral-200 rounded-xl">
                  <MessageCircle className="w-6 h-6 text-primary-600" />
                  <div>
                    <h4 className="font-medium text-neutral-900">Live Chat</h4>
                    <p className="text-neutral-600">Available 24/7</p>
                    <button className="text-sm text-primary-600 hover:text-primary-700">
                      Start Chat →
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-primary-50 p-6 rounded-xl">
                <h4 className="font-semibold text-primary-800 mb-3">Quick Contact Form</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="input-field w-full"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="input-field w-full"
                  />
                  <select className="input-field w-full">
                    <option>Select Issue Type</option>
                    <option>Technical Problem</option>
                    <option>Account Issue</option>
                    <option>Expert Consultation</option>
                    <option>General Inquiry</option>
                  </select>
                  <textarea
                    placeholder="Describe your issue..."
                    className="input-field w-full h-24 resize-none"
                  ></textarea>
                  <button className="btn-primary w-full">Send Message</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
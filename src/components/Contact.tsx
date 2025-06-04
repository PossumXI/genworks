import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { useToastStore } from '../lib/store';

const Contact: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToastStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitted(true);
      setEmail('');
      setName('');
      setMessage('');
      
      addToast({
        title: 'Message Sent',
        description: 'Thank you for your interest! We\'ll be in touch soon.',
        type: 'success'
      });
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        type: 'error'
      });
    }
  };
  
  return (
    <div id="contact" className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Get Early Access</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join the waiting list to be among the first to experience GenWorks.
            Whether you're a vibe coder or looking to hire one, we'd love to have you.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Thank You!</h3>
                  <p className="text-gray-600">
                    We've received your request for early access. We'll be in touch soon with more information about GenWorks.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 className="text-xl font-semibold mb-6 text-gray-800">Request Access</h3>
                  
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Tell us about yourself
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      placeholder="Are you a developer, client, or both? What interests you about GenWorks?"
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="h-5 w-5" />
                    Request Early Access
                  </button>
                </form>
              )}
            </div>
            
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-lg p-8 text-white">
              <div>
                <h3 className="text-2xl font-bold mb-6">Why Join Early?</h3>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <p>Be among the first to experience AI-powered vibe coding and shape the future of the platform</p>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <p>Gain exclusive benefits including extended free trial periods and priority support</p>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <p>Connect with other pioneering developers in our early access community</p>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-sm font-bold">4</span>
                    </div>
                    <p>Provide direct feedback that will influence the development roadmap</p>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <p className="text-sm italic">
                  "GenWorks represents the future of AI-augmented software development, where creativity and technical expertise combine with powerful AI assistance."
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Jamie Chen</p>
                    <p className="text-xs text-white/80">Founder & CEO, GenWorks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
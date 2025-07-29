import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ExpertConsultation = () => {
  const [experts, setExperts] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [consultationHistory, setConsultationHistory] = useState([]);
  const [activeCall, setActiveCall] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Simulate expert data
    const expertData = [
      {
        id: 1,
        name: 'Dr. Sarah Chen',
        specialty: 'Plant Pathology',
        rating: 4.9,
        experience: '15 years',
        languages: ['English', 'Mandarin'],
        hourlyRate: 75,
        availability: 'online',
        image: '/api/placeholder/100/100',
        certifications: ['PhD Plant Pathology', 'Certified Crop Advisor'],
        description: 'Specialist in crop disease diagnosis and integrated pest management',
        consultations: 1247,
        successRate: 96
      },
      {
        id: 2,
        name: 'Prof. Ahmed Hassan',
        specialty: 'Soil Science',
        rating: 4.8,
        experience: '20 years',
        languages: ['English', 'Arabic'],
        hourlyRate: 85,
        availability: 'busy',
        image: '/api/placeholder/100/100',
        certifications: ['PhD Soil Science', 'Certified Soil Scientist'],
        description: 'Expert in soil health, fertility management, and sustainable agriculture',
        consultations: 892,
        successRate: 94
      },
      {
        id: 3,
        name: 'Dr. Maria Rodriguez',
        specialty: 'Organic Farming',
        rating: 4.9,
        experience: '12 years',
        languages: ['English', 'Spanish'],
        hourlyRate: 65,
        availability: 'online',
        image: '/api/placeholder/100/100',
        certifications: ['PhD Sustainable Agriculture', 'Organic Certification'],
        description: 'Organic farming methods, crop rotation, and natural pest control',
        consultations: 756,
        successRate: 98
      },
      {
        id: 4,
        name: 'Dr. James Thompson',
        specialty: 'Crop Nutrition',
        rating: 4.7,
        experience: '18 years',
        languages: ['English'],
        hourlyRate: 70,
        availability: 'online',
        image: '/api/placeholder/100/100',
        certifications: ['PhD Agronomy', 'Fertilizer Management Specialist'],
        description: 'Crop nutrition, fertilizer recommendations, and yield optimization',
        consultations: 1089,
        successRate: 95
      }
    ];

    setExperts(expertData);

    // Simulate consultation history
    const history = [
      {
        id: 1,
        expertName: 'Dr. Sarah Chen',
        date: '2024-01-15',
        duration: '45 min',
        topic: 'Tomato Blight Treatment',
        status: 'completed',
        rating: 5,
        notes: 'Excellent advice on fungicide application timing'
      },
      {
        id: 2,
        expertName: 'Prof. Ahmed Hassan',
        date: '2024-01-10',
        duration: '30 min',
        topic: 'Soil pH Management',
        status: 'completed',
        rating: 5,
        notes: 'Very helpful soil amendment recommendations'
      }
    ];

    setConsultationHistory(history);
  }, []);

  const startVideoCall = (expert) => {
    setActiveCall({
      expert,
      startTime: new Date(),
      duration: 0
    });
    setChatMessages([
      {
        id: 1,
        sender: 'system',
        message: `Video call started with ${expert.name}`,
        timestamp: new Date()
      },
      {
        id: 2,
        sender: 'expert',
        message: `Hi! I'm ${expert.name}. How can I help you with your farming concerns today?`,
        timestamp: new Date()
      }
    ]);
  };

  const endCall = () => {
    if (activeCall) {
      setConsultationHistory(prev => [...prev, {
        id: Date.now(),
        expertName: activeCall.expert.name,
        date: new Date().toISOString().split('T')[0],
        duration: `${Math.floor(activeCall.duration / 60)} min`,
        topic: 'Recent Consultation',
        status: 'completed',
        rating: 0,
        notes: ''
      }]);
    }
    setActiveCall(null);
    setChatMessages([]);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: 'user',
        message: newMessage,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');

      // Simulate expert response
      setTimeout(() => {
        const responses = [
          "That's a great question! Let me share my experience with this issue.",
          "I've seen this problem before. Here's what I recommend...",
          "Based on what you've described, this sounds like a common issue.",
          "Let me walk you through the best approach for this situation."
        ];
        const expertResponse = {
          id: Date.now() + 1,
          sender: 'expert',
          message: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, expertResponse]);
      }, 2000);
    }
  };

  const ExpertCard = ({ expert }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start space-x-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {expert.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
            expert.availability === 'online' ? 'bg-green-500' : 'bg-yellow-500'
          }`}></div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg text-gray-800">{expert.name}</h3>
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500">⭐</span>
              <span className="font-medium">{expert.rating}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-blue-600 font-medium">{expert.specialty}</p>
            <p className="text-sm text-gray-600">{expert.description}</p>
            
            <div className="flex flex-wrap gap-2">
              {expert.languages.map(lang => (
                <span key={lang} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                  {lang}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{expert.experience} experience</span>
              <span>{expert.consultations} consultations</span>
              <span>{expert.successRate}% success rate</span>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <span className="font-bold text-lg text-green-600">${expert.hourlyRate}/hour</span>
              <div className="space-x-2">
                <button
                  onClick={() => setSelectedExpert(expert)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  View Details
                </button>
                {expert.availability === 'online' && (
                  <button
                    onClick={() => startVideoCall(expert)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    📞 Call Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const VideoCallInterface = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-5/6 flex flex-col">
        {/* Call Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {activeCall.expert.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-bold">{activeCall.expert.name}</h3>
              <p className="text-sm text-gray-500">{activeCall.expert.specialty}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {Math.floor(activeCall.duration / 60).toString().padStart(2, '0')}:
              {(activeCall.duration % 60).toString().padStart(2, '0')}
            </span>
            <button
              onClick={endCall}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              End Call
            </button>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 flex">
          <div className="flex-1 bg-gray-900 relative">
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4">
                  {activeCall.expert.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-bold">{activeCall.expert.name}</h3>
                <p className="text-gray-300">Video call in progress</p>
              </div>
            </div>
            
            {/* Your video (small) */}
            <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg border-2 border-white">
              <div className="w-full h-full flex items-center justify-center text-white">
                <span>Your Video</span>
              </div>
            </div>

            {/* Call controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <button
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                className={`p-3 rounded-full ${isVideoEnabled ? 'bg-gray-700' : 'bg-red-600'} text-white`}
              >
                📹
              </button>
              <button
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                className={`p-3 rounded-full ${isAudioEnabled ? 'bg-gray-700' : 'bg-red-600'} text-white`}
              >
                🎤
              </button>
            </div>
          </div>

          {/* Chat Panel */}
          <div className="w-80 border-l flex flex-col">
            <div className="p-4 border-b">
              <h4 className="font-bold">Chat</h4>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg ${
                    msg.sender === 'user' 
                      ? 'bg-blue-500 text-white ml-4' 
                      : msg.sender === 'expert'
                      ? 'bg-gray-100 mr-4'
                      : 'bg-yellow-50 text-center text-sm text-gray-600 mx-4'
                  }`}
                >
                  {msg.sender !== 'system' && (
                    <p className="text-xs opacity-75 mb-1">
                      {msg.sender === 'user' ? 'You' : activeCall.expert.name}
                    </p>
                  )}
                  <p>{msg.message}</p>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-lg"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Expert Consultation</h1>
          <p className="text-gray-600">Connect with agricultural experts for personalized advice</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Available Experts</p>
                <p className="text-2xl font-bold">{experts.filter(e => e.availability === 'online').length}</p>
              </div>
              <div className="text-3xl">👨‍🌾</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Consultations</p>
                <p className="text-2xl font-bold">{consultationHistory.length}</p>
              </div>
              <div className="text-3xl">📞</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Avg Rating</p>
                <p className="text-2xl font-bold">4.8 ⭐</p>
              </div>
              <div className="text-3xl">⭐</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Specialties</p>
                <p className="text-2xl font-bold">8+</p>
              </div>
              <div className="text-3xl">🎯</div>
            </div>
          </div>
        </div>

        {/* Available Experts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Experts</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {experts.map(expert => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}
          </div>
        </div>

        {/* Consultation History */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Consultation History</h2>
          {consultationHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📞</div>
              <p>No consultations yet. Start your first consultation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {consultationHistory.map(consultation => (
                <div key={consultation.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold">{consultation.topic}</h4>
                      <p className="text-sm text-gray-500">
                        with {consultation.expertName} • {consultation.date} • {consultation.duration}
                      </p>
                      {consultation.notes && (
                        <p className="text-sm text-gray-600 mt-2">{consultation.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < consultation.rating ? 'text-yellow-500' : 'text-gray-300'
                            }`}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-green-600 font-medium">
                        {consultation.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Video Call Interface */}
        <AnimatePresence>
          {activeCall && <VideoCallInterface />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExpertConsultation;

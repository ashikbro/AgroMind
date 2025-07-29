import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI farming assistant. Ask me anything about crops, diseases, weather, or farming practices!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition for voice input
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startVoiceInput = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const generateAIResponse = async (userMessage) => {
    setIsTyping(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Smart farming responses based on keywords
    let response = '';
    const message = userMessage.toLowerCase();
    
    if (message.includes('disease') || message.includes('pest') || message.includes('bug')) {
      response = `🔬 For disease management, I recommend:
      
1. **Visual Inspection**: Upload photos to our Disease Diagnosis tool for AI analysis
2. **Common Treatments**: 
   - Fungal diseases: Apply copper-based fungicides
   - Bacterial issues: Use streptomycin sprays
   - Pest control: Neem oil or integrated pest management
3. **Prevention**: Ensure proper spacing, good drainage, and crop rotation
4. **Monitor**: Check plants daily for early detection

Would you like me to guide you to the Disease Diagnosis page?`;
    } else if (message.includes('weather') || message.includes('rain') || message.includes('temperature')) {
      response = `🌤️ Weather is crucial for farming success:

1. **Current Conditions**: Check our Weather Dashboard for live data
2. **7-Day Forecast**: Plan your activities based on upcoming weather
3. **Farming Tips**:
   - Plant before expected rain periods
   - Harvest during dry spells
   - Protect crops during extreme weather
4. **Alerts**: Enable notifications for weather warnings

Visit the Weather page for detailed forecasts and farming recommendations!`;
    } else if (message.includes('price') || message.includes('market') || message.includes('sell')) {
      response = `💰 Market intelligence for better profits:

1. **Live Prices**: Check current commodity prices in our Market Tracker
2. **Price Trends**: Analyze historical data to time your sales
3. **Alerts**: Set price alerts for your crops
4. **Best Markets**: Find the highest-paying markets in your region
5. **Timing**: Generally, prices are higher during off-seasons

Check the Market Price page for real-time data and alerts!`;
    } else if (message.includes('planting') || message.includes('sowing') || message.includes('calendar')) {
      response = `📅 Optimize your planting schedule:

1. **Seasonal Timing**: 
   - Kharif crops: Plant during monsoon (June-July)
   - Rabi crops: Plant post-monsoon (Oct-Dec)
   - Zaid crops: Plant in summer (Feb-Mar)
2. **Soil Preparation**: Start 2-3 weeks before planting
3. **Weather Consideration**: Avoid extreme weather periods
4. **Crop Calendar**: Use our Calendar feature to plan activities

Visit the Crop Calendar to schedule your farming activities!`;
    } else if (message.includes('fertilizer') || message.includes('nutrition') || message.includes('nutrients')) {
      response = `🌱 Proper nutrition for healthy crops:

1. **Soil Testing**: Test soil pH and nutrient levels first
2. **NPK Balance**: 
   - Nitrogen: For leaf growth
   - Phosphorus: For root development
   - Potassium: For disease resistance
3. **Organic Options**: Compost, manure, bio-fertilizers
4. **Application Timing**: 
   - Base dose at planting
   - Top dressing during growth phases
5. **Avoid Over-fertilization**: Can harm crops and environment

Consider getting a soil test for precise recommendations!`;
    } else if (message.includes('irrigation') || message.includes('water') || message.includes('watering')) {
      response = `💧 Smart irrigation for optimal growth:

1. **Water Requirements**: Vary by crop and growth stage
2. **Best Timing**: Early morning (6-8 AM) or evening (4-6 PM)
3. **Methods**:
   - Drip irrigation: Most efficient
   - Sprinkler: Good for large areas
   - Furrow: Traditional but water-intensive
4. **Signs of Stress**: Wilting, yellow leaves, stunted growth
5. **Conservation**: Mulching reduces water needs by 50%

Monitor soil moisture and weather forecasts for optimal watering!`;
    } else if (message.includes('organic') || message.includes('natural') || message.includes('bio')) {
      response = `🌿 Organic farming practices:

1. **Pest Control**: 
   - Neem oil, marigold companion planting
   - Beneficial insects like ladybugs
   - Crop rotation and resistant varieties
2. **Fertilizers**: Compost, vermicompost, green manures
3. **Soil Health**: Cover crops, minimal tillage
4. **Certification**: Follow organic standards for premium prices
5. **Market Demand**: Growing consumer preference for organic

Organic farming requires patience but offers better long-term returns!`;
    } else if (message.includes('seed') || message.includes('variety') || message.includes('hybrid')) {
      response = `🌾 Choosing the right seeds:

1. **Certified Seeds**: Always buy from authorized dealers
2. **Variety Selection**:
   - High-yielding varieties for maximum production
   - Disease-resistant varieties for problem areas
   - Local varieties for climate adaptation
3. **Hybrid vs Traditional**: 
   - Hybrids: Higher yield, uniform crop
   - Traditional: Can save seeds, better adaptation
4. **Seed Treatment**: Fungicide treatment prevents diseases
5. **Storage**: Keep in cool, dry place

Match variety selection to your local climate and market demands!`;
    } else if (message.includes('soil') || message.includes('land') || message.includes('field')) {
      response = `🌍 Healthy soil for productive farming:

1. **Soil Testing**: Check pH (6.0-7.5 ideal for most crops)
2. **Soil Types**:
   - Clay: Good water retention, may need drainage
   - Sandy: Good drainage, needs frequent watering
   - Loam: Best balance for most crops
3. **Improvement Methods**:
   - Add organic matter (compost, manure)
   - Proper drainage systems
   - Crop rotation and cover crops
4. **Erosion Control**: Contour farming, terracing

Invest in soil health for sustainable long-term productivity!`;
    } else if (message.includes('harvest') || message.includes('crop') || message.includes('yield')) {
      response = `🚜 Maximizing your harvest:

1. **Timing**: Harvest at optimal maturity for best quality
2. **Weather**: Choose dry days to prevent post-harvest losses
3. **Methods**: Use proper tools to avoid crop damage
4. **Post-Harvest**:
   - Quick cooling for vegetables
   - Proper drying for grains
   - Clean storage facilities
5. **Quality Grading**: Sort crops for better market prices

Proper harvesting can increase your income by 20-30%!`;
    } else if (message.includes('help') || message.includes('guide') || message.includes('how')) {
      response = `🤝 I'm here to help you succeed in farming!

**I can assist with**:
📊 Market prices and trends
🌤️ Weather forecasts and farming tips
🔬 Disease identification and treatment
📅 Crop planning and calendars
💧 Irrigation and water management
🌱 Fertilizer and nutrition advice
🌿 Organic farming practices
🚜 Harvesting and post-harvest care

**Voice Commands**: You can also talk to me! Try saying:
- "Weather forecast for tomorrow"
- "Price of wheat today"
- "How to treat leaf blight"
- "Best time to plant tomatoes"

What specific farming challenge can I help you with today?`;
    } else {
      response = `🌾 That's a great farming question! Based on your query, here are some general recommendations:

1. **Research**: Check our knowledge base and resources
2. **Expert Consultation**: Consider booking a session with our agricultural experts
3. **Community**: Connect with other farmers in your area
4. **Experimentation**: Try small-scale tests before full implementation
5. **Local Knowledge**: Consult with successful farmers in your region

For more specific advice, try asking about:
- Crop diseases and treatments
- Weather and planting schedules
- Market prices and trends
- Soil management and fertilizers
- Irrigation and water management

How can I help you with your farming goals today?`;
    }
    
    setIsTyping(false);
    return response;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Generate AI response
    const aiResponse = await generateAIResponse(inputMessage);
    
    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      content: aiResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "What crops should I plant this season?",
    "How to identify crop diseases?",
    "Best time for harvesting?",
    "Weather forecast for farming?",
    "Current market prices?",
    "Organic farming tips?"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                🤖
              </div>
              <div>
                <h3 className="text-xl font-bold">AI Farm Assistant</h3>
                <p className="text-green-100 text-sm">Your intelligent farming companion</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-6 py-2 border-t border-gray-100">
            <div className="text-sm font-medium text-gray-600 mb-2">Quick Questions:</div>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about farming..."
                  className="w-full p-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={startVoiceInput}
                  className={`w-12 h-12 rounded-xl transition-colors ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                  title="Voice Input"
                >
                  <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="w-12 h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-xl transition-colors"
                  title="Send Message"
                >
                  <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
            {isListening && (
              <div className="mt-2 text-sm text-red-500 flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                Listening... Speak your question now
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIChatbot;

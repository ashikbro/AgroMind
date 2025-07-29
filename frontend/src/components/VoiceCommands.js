import React, { useState, useEffect, useRef } from 'react';

const VoiceCommands = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          processVoiceCommand(finalTranscript.toLowerCase().trim());
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const processVoiceCommand = (command) => {
    console.log('Processing voice command:', command);

    // Define voice command patterns and their actions
    const commands = [
      {
        patterns: ['go to dashboard', 'open dashboard', 'show dashboard'],
        action: { type: 'navigate', path: '/dashboard' }
      },
      {
        patterns: ['diagnose crop', 'crop diagnosis', 'disease diagnosis', 'check disease'],
        action: { type: 'navigate', path: '/diagnosis' }
      },
      {
        patterns: ['show weather', 'weather forecast', 'check weather', 'weather dashboard'],
        action: { type: 'navigate', path: '/weather' }
      },
      {
        patterns: ['crop calendar', 'show calendar', 'farming calendar', 'planting schedule'],
        action: { type: 'navigate', path: '/calendar' }
      },
      {
        patterns: ['market prices', 'crop prices', 'price tracker', 'market data'],
        action: { type: 'navigate', path: '/market' }
      },
      {
        patterns: ['my crops', 'view crops', 'crop management', 'crops page'],
        action: { type: 'navigate', path: '/crops' }
      },
      {
        patterns: ['iot dashboard', 'sensor data', 'monitoring', 'iot sensors'],
        action: { type: 'navigate', path: '/iot' }
      },
      {
        patterns: ['automation', 'automation controls', 'farm automation', 'control systems'],
        action: { type: 'navigate', path: '/automation' }
      },
      {
        patterns: ['expert consultation', 'call expert', 'expert advice', 'video call'],
        action: { type: 'navigate', path: '/expert' }
      },
      {
        patterns: ['analytics', 'farm analytics', 'business intelligence', 'reports'],
        action: { type: 'navigate', path: '/analytics' }
      },
      {
        patterns: ['community', 'social hub', 'farmer community', 'community feed'],
        action: { type: 'navigate', path: '/community' }
      },
      {
        patterns: ['marketplace', 'buy products', 'sell products', 'farmer market'],
        action: { type: 'navigate', path: '/marketplace' }
      },
      {
        patterns: ['groups', 'farmer groups', 'forums', 'discussions'],
        action: { type: 'navigate', path: '/groups' }
      },
      {
        patterns: ['chat', 'messages', 'live chat', 'messaging'],
        action: { type: 'navigate', path: '/chat' }
      },
      {
        patterns: ['field mapping', 'satellite imagery', 'field analysis', 'mapping'],
        action: { type: 'navigate', path: '/field-mapping' }
      },
      {
        patterns: ['satellite dashboard', 'satellite data', 'satellite images', 'satellite analysis'],
        action: { type: 'navigate', path: '/satellite-dashboard' }
      },
      {
        patterns: ['financial dashboard', 'finances', 'farm finances', 'financial overview'],
        action: { type: 'navigate', path: '/financial-dashboard' }
      },
      {
        patterns: ['insurance claims', 'file claim', 'insurance portal', 'claims management'],
        action: { type: 'navigate', path: '/insurance-claims' }
      },
      {
        patterns: ['payment portal', 'make payment', 'payments', 'pay bills'],
        action: { type: 'navigate', path: '/payment-portal' }
      },
      {
        patterns: ['apply for loan', 'loan application', 'agricultural loan', 'farm loan'],
        action: { type: 'navigate', path: '/financial-dashboard' }
      },
      {
        patterns: ['insurance quote', 'get insurance', 'crop insurance', 'farm insurance'],
        action: { type: 'navigate', path: '/financial-dashboard' }
      },
      {
        patterns: ['sustainability dashboard', 'sustainability', 'environmental impact', 'sustainable farming'],
        action: { type: 'navigate', path: '/sustainability-dashboard' }
      },
      {
        patterns: ['carbon credits', 'carbon market', 'sell carbon credits', 'carbon trading'],
        action: { type: 'navigate', path: '/carbon-credits' }
      },
      {
        patterns: ['sustainability report', 'environmental report', 'carbon footprint report', 'esg report'],
        action: { type: 'navigate', path: '/sustainability-reporting' }
      },
      {
        patterns: ['carbon footprint', 'emissions', 'carbon sequestration', 'environmental metrics'],
        action: { type: 'navigate', path: '/sustainability-dashboard' }
      },
      {
        patterns: ['profile', 'my profile', 'user profile', 'account settings'],
        action: { type: 'navigate', path: '/profile' }
      },
      {
        patterns: ['logout', 'sign out', 'log out'],
        action: { type: 'logout' }
      },
      {
        patterns: ['help', 'voice commands', 'what can you do'],
        action: { type: 'help' }
      },
      {
        patterns: ['start listening', 'voice on', 'enable voice'],
        action: { type: 'start_listening' }
      },
      {
        patterns: ['stop listening', 'voice off', 'disable voice'],
        action: { type: 'stop_listening' }
      },
      {
        patterns: ['add crop', 'new crop', 'register crop'],
        action: { type: 'add_crop' }
      },
      {
        patterns: ['search', 'find', 'look for'],
        action: { type: 'search', query: command }
      },
      {
        patterns: ['refresh', 'reload', 'update data'],
        action: { type: 'refresh' }
      },
      {
        patterns: ['ask chatbot', 'talk to ai', 'farming question', 'ai assistant'],
        action: { type: 'open_chatbot' }
      },
      {
        patterns: ['how to', 'what is', 'when should', 'why does'],
        action: { type: 'farming_question', query: command }
      }
    ];

    // Find matching command
    let matchedCommand = null;
    for (const cmd of commands) {
      for (const pattern of cmd.patterns) {
        if (command.includes(pattern)) {
          matchedCommand = cmd.action;
          break;
        }
      }
      if (matchedCommand) break;
    }

    if (matchedCommand) {
      onCommand(matchedCommand);
      setTranscript('');
    } else {
      // Try to extract specific actions from natural language
      if (command.includes('weather for') || command.includes('weather in')) {
        const location = extractLocation(command);
        onCommand({ type: 'weather_location', location });
      } else if (command.includes('price of') || command.includes('cost of')) {
        const crop = extractCrop(command);
        onCommand({ type: 'crop_price', crop });
      } else {
        onCommand({ type: 'unknown', command });
      }
    }
  };

  const extractLocation = (command) => {
    const words = command.split(' ');
    const locationIndex = words.findIndex(word => word === 'for' || word === 'in');
    return locationIndex !== -1 && locationIndex < words.length - 1 
      ? words.slice(locationIndex + 1).join(' ') 
      : null;
  };

  const extractCrop = (command) => {
    const words = command.split(' ');
    const cropIndex = words.findIndex(word => word === 'of');
    return cropIndex !== -1 && cropIndex < words.length - 1 
      ? words.slice(cropIndex + 1).join(' ') 
      : null;
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span className="text-yellow-800">Voice commands are not supported in this browser.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="voice-commands-container">
      {/* Voice Command Toggle Button */}
      <button
        onClick={toggleListening}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg transition-all duration-300 z-50 ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
        title={isListening ? 'Stop Voice Commands' : 'Start Voice Commands'}
      >
        {isListening ? (
          <svg className="w-8 h-8 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>

      {/* Voice Status Indicator */}
      {isListening && (
        <div className="fixed bottom-24 right-6 bg-white rounded-lg shadow-lg p-4 max-w-xs z-40">
          <div className="flex items-center mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm font-medium text-gray-700">Listening...</span>
          </div>
          {transcript && (
            <div className="text-sm text-gray-600 border-t pt-2">
              <span className="font-medium">You said:</span>
              <p className="italic">"{transcript}"</p>
            </div>
          )}
          <div className="text-xs text-gray-500 mt-2">
            Say commands like "go to dashboard", "check weather", or "crop diagnosis"
          </div>
        </div>
      )}

      {/* Voice Commands Help */}
      <div className="voice-commands-help hidden">
        <h3 className="font-bold text-lg mb-4">Voice Commands</h3>
        <div className="space-y-2 text-sm">
          <div><strong>Navigation:</strong> "go to dashboard", "show weather", "crop diagnosis"</div>
          <div><strong>Weather:</strong> "weather for Delhi", "check weather"</div>
          <div><strong>Crops:</strong> "my crops", "add crop", "price of wheat"</div>
          <div><strong>Control:</strong> "help", "logout", "refresh"</div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCommands;

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Search, 
  Plus, 
  Send, 
  Phone, 
  Video, 
  MoreHorizontal,
  Paperclip,
  Smile,
  Image,
  Mic,
  Users,
  Settings,
  Bell,
  Pin,
  Star,
  Archive,
  Trash2,
  Edit,
  Reply,
  Forward,
  Copy,
  Info,
  Check,
  CheckCheck,
  Clock,
  Camera,
  FileText,
  Download,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MapPin,
  Calendar,
  Shield,
  Crown,
  Zap,
  Hash,
  AtSign
} from 'lucide-react';

const LiveChat = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadConversations();
    loadOnlineUsers();
    // Simulate WebSocket connection
    const interval = setInterval(() => {
      if (activeChat) {
        simulateIncomingMessage();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);

  const loadConversations = () => {
    setConversations(mockConversations);
    setMessages(mockMessages);
  };

  const loadOnlineUsers = () => {
    setOnlineUsers(mockOnlineUsers);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const simulateIncomingMessage = () => {
    if (Math.random() > 0.7) { // 30% chance of receiving a message
      const randomMessage = {
        id: Date.now(),
        text: 'Hello! How are your crops doing today?',
        sender: 'other',
        timestamp: new Date(),
        type: 'text',
        status: 'delivered'
      };

      setMessages(prev => ({
        ...prev,
        [activeChat.id]: [...(prev[activeChat.id] || []), randomMessage]
      }));

      // Update conversation last message
      setConversations(prev => prev.map(conv => 
        conv.id === activeChat.id 
          ? { ...conv, lastMessage: randomMessage.text, timestamp: randomMessage.timestamp }
          : conv
      ));
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'me',
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), message]
    }));

    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === activeChat.id 
        ? { ...conv, lastMessage: newMessage, timestamp: message.timestamp }
        : conv
    ));

    setNewMessage('');
    
    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [activeChat.id]: prev[activeChat.id].map(msg => 
          msg.id === message.id ? { ...msg, status: 'delivered' } : msg
        )
      }));
    }, 1000);

    // Simulate read receipt
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [activeChat.id]: prev[activeChat.id].map(msg => 
          msg.id === message.id ? { ...msg, status: 'read' } : msg
        )
      }));
    }, 3000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      setIsRecording(false);
      setRecordingTime(0);
      // Send voice message
      const voiceMessage = {
        id: Date.now(),
        text: 'Voice message',
        sender: 'me',
        timestamp: new Date(),
        type: 'voice',
        duration: recordingTime,
        status: 'sent'
      };
      
      setMessages(prev => ({
        ...prev,
        [activeChat.id]: [...(prev[activeChat.id] || []), voiceMessage]
      }));
    }, 3000); // Auto stop after 3 seconds for demo
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString();
  };

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 to-blue-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800">Messages</h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Plus size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Online Users */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">ONLINE NOW</h3>
          <div className="flex space-x-3 overflow-x-auto">
            {onlineUsers.map((user) => (
              <div key={user.id} className="flex-shrink-0 text-center">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <p className="text-xs text-gray-600 mt-1 truncate w-12">{user.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              whileHover={{ backgroundColor: '#f3f4f6' }}
              onClick={() => setActiveChat(conversation)}
              className={`p-4 cursor-pointer border-b border-gray-100 ${
                activeChat?.id === conversation.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="w-12 h-12 rounded-full"
                  />
                  {conversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-800 truncate">{conversation.name}</p>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">{formatTime(conversation.timestamp)}</span>
                      {conversation.unreadCount > 0 && (
                        <div className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                  <div className="flex items-center mt-1 space-x-2">
                    {conversation.badge && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-lg">
                        {conversation.badge}
                      </span>
                    )}
                    {conversation.isTyping && (
                      <span className="text-xs text-green-600 italic">typing...</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={activeChat.avatar}
                      alt={activeChat.name}
                      className="w-10 h-10 rounded-full"
                    />
                    {activeChat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-800">{activeChat.name}</h2>
                    <p className="text-sm text-gray-500">
                      {activeChat.isOnline ? 'Online' : `Last seen ${formatTime(activeChat.lastSeen)}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Phone size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Video size={20} className="text-gray-600" />
                  </button>
                  <button 
                    onClick={() => setShowProfile(!showProfile)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Info size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {(messages[activeChat.id] || []).map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isSelected={selectedMessages.includes(message.id)}
                  onSelect={(id) => {
                    if (selectedMessages.includes(id)) {
                      setSelectedMessages(selectedMessages.filter(msgId => msgId !== id));
                    } else {
                      setSelectedMessages([...selectedMessages, id]);
                    }
                  }}
                />
              ))}
              {isTyping && (
                <TypingIndicator user={activeChat} />
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              {selectedMessages.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600">
                      {selectedMessages.length} message(s) selected
                    </span>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Reply size={16} />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Forward size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 size={16} />
                      </button>
                      <button 
                        onClick={() => setSelectedMessages([])}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-end space-x-2">
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Image size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Camera size={20} className="text-gray-600" />
                  </button>
                </div>

                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    rows="1"
                    style={{ maxHeight: '100px' }}
                  />
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Smile size={20} />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  {isRecording ? (
                    <div className="flex items-center space-x-2 bg-red-100 text-red-600 px-3 py-2 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm">{recordingTime}s</span>
                    </div>
                  ) : (
                    <button 
                      onMouseDown={startVoiceRecording}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Mic size={20} className="text-gray-600" />
                    </button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className={`p-2 rounded-lg transition-colors ${
                      newMessage.trim()
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send size={20} />
                  </motion.button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-400">
                Choose a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Profile Sidebar */}
      <AnimatePresence>
        {showProfile && activeChat && (
          <ProfileSidebar 
            user={activeChat} 
            onClose={() => setShowProfile(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({ message, isSelected, onSelect }) => {
  const isMine = message.sender === 'me';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        onClick={() => onSelect(message.id)}
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg cursor-pointer transition-colors ${
          isSelected 
            ? 'ring-2 ring-blue-500' 
            : ''
        } ${
          isMine
            ? 'bg-green-600 text-white'
            : 'bg-white border border-gray-200 text-gray-800'
        }`}
      >
        {message.type === 'text' && (
          <p className="text-sm">{message.text}</p>
        )}
        
        {message.type === 'voice' && (
          <div className="flex items-center space-x-2">
            <button className="p-1 rounded-full bg-green-500 text-white">
              <Play size={12} />
            </button>
            <div className="flex-1 h-1 bg-green-200 rounded-full">
              <div className="w-1/3 h-full bg-green-400 rounded-full"></div>
            </div>
            <span className="text-xs">{message.duration}s</span>
          </div>
        )}
        
        {message.type === 'image' && (
          <div>
            <img 
              src={message.imageUrl} 
              alt="Shared" 
              className="rounded-lg max-w-full"
            />
            {message.text && <p className="text-sm mt-2">{message.text}</p>}
          </div>
        )}
        
        <div className={`flex items-center justify-between mt-1 text-xs ${
          isMine ? 'text-green-100' : 'text-gray-400'
        }`}>
          <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {isMine && (
            <div className="ml-2">
              {message.status === 'sent' && <Check size={12} />}
              {message.status === 'delivered' && <CheckCheck size={12} />}
              {message.status === 'read' && <CheckCheck size={12} className="text-blue-300" />}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Typing Indicator Component
const TypingIndicator = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="bg-gray-200 px-4 py-2 rounded-lg">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-xs text-gray-500 ml-2">{user.name} is typing...</span>
        </div>
      </div>
    </motion.div>
  );
};

// Profile Sidebar Component
const ProfileSidebar = ({ user, onClose }) => {
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="w-80 bg-white border-l border-gray-200 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Profile</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-6 text-center border-b border-gray-200">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h3 className="text-xl font-bold text-gray-800 mb-1">{user.name}</h3>
        <p className="text-gray-500 mb-2">{user.badge}</p>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className={`w-3 h-3 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-gray-600">
            {user.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Contact Info */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3">Contact Info</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Phone size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">Iowa, USA</span>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">Joined March 2023</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-2">
        <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <Bell size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">Notifications</span>
        </button>
        <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <Star size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">Add to Favorites</span>
        </button>
        <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <Archive size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">Archive Chat</span>
        </button>
        <button className="w-full flex items-center space-x-3 p-3 hover:bg-red-50 rounded-lg transition-colors text-red-600">
          <Trash2 size={16} />
          <span className="text-sm">Delete Chat</span>
        </button>
      </div>
    </motion.div>
  );
};

// Mock Data
const mockConversations = [
  {
    id: 1,
    name: 'Sarah Green',
    avatar: '/api/placeholder/40/40',
    lastMessage: 'How is your organic fertilizer working?',
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    unreadCount: 2,
    isOnline: true,
    badge: 'Organic Expert',
    isTyping: false
  },
  {
    id: 2,
    name: 'Tech Farmer',
    avatar: '/api/placeholder/40/40',
    lastMessage: 'Check out this new IoT sensor!',
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    unreadCount: 0,
    isOnline: true,
    badge: 'Technology Specialist',
    isTyping: true
  },
  {
    id: 3,
    name: 'Crop Doctor',
    avatar: '/api/placeholder/40/40',
    lastMessage: 'The disease samples look concerning...',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    unreadCount: 1,
    isOnline: false,
    badge: 'Plant Pathologist',
    lastSeen: new Date(Date.now() - 7200000)
  },
  {
    id: 4,
    name: 'Market Analyst',
    avatar: '/api/placeholder/40/40',
    lastMessage: 'Corn prices are expected to rise next week',
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    unreadCount: 0,
    isOnline: false,
    badge: 'Market Expert',
    lastSeen: new Date(Date.now() - 10800000)
  }
];

const mockMessages = {
  1: [
    {
      id: 1,
      text: 'Hi Sarah! The organic fertilizer is working great. My tomatoes are growing much better.',
      sender: 'me',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text',
      status: 'read'
    },
    {
      id: 2,
      text: 'That\'s wonderful to hear! What\'s the NPK ratio you\'re using?',
      sender: 'other',
      timestamp: new Date(Date.now() - 3300000),
      type: 'text',
      status: 'delivered'
    },
    {
      id: 3,
      text: 'I\'m using a 4-4-4 ratio. Should I adjust it for the flowering stage?',
      sender: 'me',
      timestamp: new Date(Date.now() - 3000000),
      type: 'text',
      status: 'read'
    },
    {
      id: 4,
      text: 'Voice message about fertilizer recommendations',
      sender: 'other',
      timestamp: new Date(Date.now() - 600000),
      type: 'voice',
      duration: 45,
      status: 'delivered'
    },
    {
      id: 5,
      text: 'How is your organic fertilizer working?',
      sender: 'other',
      timestamp: new Date(Date.now() - 300000),
      type: 'text',
      status: 'delivered'
    }
  ],
  2: [
    {
      id: 6,
      text: 'Hey! I just installed some new soil sensors. The data looks amazing!',
      sender: 'other',
      timestamp: new Date(Date.now() - 1800000),
      type: 'text',
      status: 'delivered'
    },
    {
      id: 7,
      text: 'That sounds interesting! Which brand did you go with?',
      sender: 'me',
      timestamp: new Date(Date.now() - 1500000),
      type: 'text',
      status: 'read'
    }
  ]
};

const mockOnlineUsers = [
  {
    id: 1,
    name: 'Sarah',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 2,
    name: 'Tech',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 3,
    name: 'Mike',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 4,
    name: 'Anna',
    avatar: '/api/placeholder/40/40'
  }
];

export default LiveChat;

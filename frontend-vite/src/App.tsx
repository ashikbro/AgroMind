import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import DiagnosisPage from './pages/DiagnosisPage';
import WeatherPage from './pages/WeatherPage';
import FarmAnalytics from './pages/FarmAnalytics';
import FinancialDashboard from './pages/FinancialDashboard';
import SustainabilityDashboard from './pages/SustainabilityDashboard';
import Marketplace from './pages/Marketplace';
import CommunityHub from './pages/CommunityHub';
import NotificationCenter from './pages/NotificationCenter';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import ExpertConsultation from './pages/ExpertConsultation';
import AIChatbot from './components/AIChatbot';
import AuthContextProvider from './context/AuthContext';
import AnalyticsContextProvider from './context/AnalyticsContext';
// import { useAnalytics } from './context/useAnalytics'; // Use in components as needed
// ...import other advanced pages/components as needed

const App: React.FC = () => {
  return (
    <AuthContextProvider>
      <AnalyticsContextProvider>
        <Router>
          <Navbar />
          <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/diagnosis" element={<DiagnosisPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/analytics" element={<FarmAnalytics />} />
          <Route path="/financial-dashboard" element={<FinancialDashboard />} />
          <Route path="/sustainability-dashboard" element={<SustainabilityDashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/community" element={<CommunityHub />} />
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/expert" element={<ExpertConsultation />} />
          <Route path="/chat" element={<ChatUI />} />
          {/* Add more advanced routes here: search, chat, settings, etc. */}
          </Routes>
          <AIChatbot />
        </Router>
      </AnalyticsContextProvider>
    </AuthContextProvider>
  );
};

// Chat UI Component (refactored to use CSS module)
import chatStyles from './components/ChatUI.module.css';
const ChatUI: React.FC = () => {
  const [messages, setMessages] = React.useState([
    { id: 1, user: 'Alice', text: 'Hello!', time: '10:00' },
    { id: 2, user: 'Bob', text: 'Hi Alice!', time: '10:01' },
  ]);
  const [input, setInput] = React.useState('');
  const [onlineUsers] = React.useState(['Alice', 'Bob', 'Charlie']);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, user: 'You', text: input, time: new Date().toLocaleTimeString() }]);
      setInput('');
    }
  };

  return (
    <div className={chatStyles['chat-container']}>
      <h2 className={chatStyles['chat-title']}>Expert Chat</h2>
      <div className={chatStyles['chat-online']}>
        <strong>Online:</strong> {onlineUsers.join(', ')}
      </div>
      <div className={chatStyles['chat-messages']}>
        {messages.map(msg => (
          <div key={msg.id} className={chatStyles['chat-message']}>
            <span className={msg.user === 'You' ? `${chatStyles['chat-user']} ${chatStyles['you']}` : chatStyles['chat-user']}>
              {msg.user}
            </span>
            <span className={chatStyles['chat-text']}>{msg.text}</span>
            <span className={chatStyles['chat-time']}>{msg.time}</span>
          </div>
        ))}
      </div>
      <div className={chatStyles['chat-input-row']}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          className={chatStyles['chat-input']}
        />
        <button onClick={handleSend} className={chatStyles['chat-send-btn']}>Send</button>
      </div>
    </div>
  );
};

export default App;

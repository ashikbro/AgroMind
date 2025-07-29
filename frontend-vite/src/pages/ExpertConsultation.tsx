import React, { useEffect, useRef, useState } from 'react';
import styles from './ExpertConsultation.module.css';
// Removed unused MUI imports

const ExpertConsultation: React.FC = () => {
  // Real-time chat state
  const [messages, setMessages] = useState([
    { id: 1, user: 'Expert', text: 'Welcome! Ask me anything about your crops.', time: '10:00' },
    { id: 2, user: 'You', text: 'How do I treat leaf blight?', time: '10:01' },
  ]);
  const [input, setInput] = useState('');
  const [onlineUsers] = useState(['Expert', 'You']);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulate expert reply
  useEffect(() => {
    if (messages.length > 2 && messages[messages.length - 1].user === 'You') {
      const timer = setTimeout(() => {
        setMessages(msgs => ([
          ...msgs,
          { id: msgs.length + 1, user: 'Expert', text: 'Leaf blight can be managed with proper fungicide and crop rotation.', time: new Date().toLocaleTimeString() }
        ]));
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, user: 'You', text: input, time: new Date().toLocaleTimeString() }]);
      setInput('');
    }
  };

  return (
    <div className={styles['expert-chat-container']}>
      <h2 className={styles['expert-chat-title']}>Expert Consultation</h2>
      <div className={styles['expert-chat-online']}>
        <strong>Online:</strong> {onlineUsers.join(', ')}
      </div>
      <div className={styles['expert-chat-messages']}>
        {messages.map(msg => (
          <div key={msg.id} className={styles['expert-chat-message']}>
            <span className={msg.user === 'You' ? `${styles['expert-chat-user']} ${styles['you']}` : styles['expert-chat-user']}>
              {msg.user}
            </span>
            <span className={styles['expert-chat-text']}>{msg.text}</span>
            <span className={styles['expert-chat-time']}>{msg.time}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles['expert-chat-input-row']}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your question..."
          className={styles['expert-chat-input']}
        />
        <button onClick={handleSend} className={styles['expert-chat-send-btn']}>Send</button>
      </div>
    </div>
  );
};

export default ExpertConsultation;

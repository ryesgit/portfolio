import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsChatDots, BsX, BsSend, BsRobot } from 'react-icons/bs';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { geminiChat, ChatMessage } from '../../services/geminiService';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when chat opens for the first time
      const welcomeMessage: ChatMessage = {
        role: 'assistant',
        content: "Hi! I'm Lee's AI assistant. I can tell you about his projects, skills, and experience. What would you like to know?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await geminiChat.sendMessage(inputMessage);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm having trouble responding right now. Please try again or contact Lee directly.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        className="chat-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        {isOpen ? <BsX size={24} /> : <BsChatDots size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-window"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-header-info">
                <BsRobot size={20} />
                <div>
                  <h4>Lee's AI Assistant</h4>
                  <span>Ask about projects & skills</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="chat-close-btn">
                <BsX size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="chat-messages">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`message ${message.role}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="message-content">
                    {message.role === 'assistant' ? (
                      <ReactMarkdown 
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          p: ({children}) => <p style={{margin: '0.5em 0'}}>{children}</p>,
                          ul: ({children}) => <ul style={{margin: '0.5em 0', paddingLeft: '1.2em'}}>{children}</ul>,
                          ol: ({children}) => <ol style={{margin: '0.5em 0', paddingLeft: '1.2em'}}>{children}</ol>,
                          li: ({children}) => <li style={{margin: '0.2em 0'}}>{children}</li>,
                          strong: ({children}) => <strong style={{fontWeight: '600'}}>{children}</strong>,
                          em: ({children}) => <em style={{fontStyle: 'italic'}}>{children}</em>,
                          code: ({children, className}) => {
                            const isInline = !className;
                            return isInline ? (
                              <code style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                padding: '0.1em 0.3em',
                                borderRadius: '3px',
                                fontSize: '0.85em',
                                fontFamily: 'monospace'
                              }}>{children}</code>
                            ) : (
                              <code className={className} style={{
                                display: 'block',
                                background: 'rgba(0, 0, 0, 0.1)',
                                padding: '0.5em',
                                borderRadius: '4px',
                                fontSize: '0.85em',
                                fontFamily: 'monospace',
                                overflow: 'auto'
                              }}>{children}</code>
                            );
                          },
                          a: ({children, href}) => (
                            <a 
                              href={href} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{
                                color: 'var(--color-accent-cyan)',
                                textDecoration: 'underline'
                              }}
                            >
                              {children}
                            </a>
                          )
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      message.content
                    )}
                  </div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  className="message assistant"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="chat-input-container">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Lee's projects, skills, or experience..."
                className="chat-input"
                rows={1}
                disabled={isLoading}
              />
              <button 
                onClick={handleSendMessage}
                className="chat-send-btn"
                disabled={!inputMessage.trim() || isLoading}
              >
                <BsSend size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
import React, { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiLock, FiSend } from 'react-icons/fi';
import { isAuthenticated } from '../utils/authUtils';
import { useNavigate } from 'react-router-dom';
import pancreasIcon from '../assets/pancreas-icon.png';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const PublicChatbot: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const authStatus = isAuthenticated();
    console.log('PublicChatbot - Auth status:', authStatus);
    setIsLoggedIn(authStatus);
    
    if (authStatus && messages.length === 0) {
      setMessages([{
        id: '1',
        text: "Hello! I'm PanInsight's AI assistant, specialized in pancreatic health. I can help you learn about pancreatic anatomy, diseases, symptoms, and treatments. How can I assist you today?",
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length]);

  
  useEffect(() => {
    const handleStorageChange = () => {
      const authStatus = isAuthenticated();
      setIsLoggedIn(authStatus);
      
      if (!authStatus) {
        
        setMessages([]);
      } else if (authStatus && messages.length === 0) {
        
        setMessages([{
          id: '1',
          text: "Hello! I'm PanInsight's AI assistant, specialized in pancreatic health. I can help you learn about pancreatic anatomy, diseases, symptoms, and treatments. How can I assist you today?",
          isUser: false,
          timestamp: new Date()
        }]);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    console.log('PublicChatbot - Sending message, isLoggedIn:', isLoggedIn);
    if (!isLoggedIn) {
      const loginMessage: Message = {
        id: Date.now().toString(),
        text: "Please log in to your PanInsight account to access the AI health assistant. The chatbot is only available for authenticated users.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages((prev: Message[]) => [...prev, loginMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mVF4JYfmpeE8ywod0P1cGzalCQNjG1kQ'
        },
        body: JSON.stringify({
          model: 'meta-llama/Meta-Llama-3-8B-Instruct',
          messages: [
            {
              role: 'system',
              content: `You are a specialized pancreatic health assistant. Provide concise, clear, and direct answers. Keep responses brief but informative. For simple questions, give short answers (1-2 sentences). For complex topics, provide comprehensive but concise explanations (2-3 sentences maximum). Always emphasize that information is for educational purposes only and users should consult healthcare professionals for medical advice.`
            },
            {
              role: 'user',
              content: inputMessage
            }
          ],
          max_tokens: 100,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.choices?.[0]?.message?.content || "I apologize, but I couldn't process your request. Please try again.",
          isUser: false,
          timestamp: new Date()
        };
        setMessages((prev: Message[]) => [...prev, botMessage]);
      } else {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm having trouble connecting to the AI service right now. Please try again in a moment.",
          isUser: false,
          timestamp: new Date()
        };
        setMessages((prev: Message[]) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages((prev: Message[]) => [...prev, errorMessage]);
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
             
               <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-6 xl:bottom-12 xl:right-12 bg-blue-500 hover:bg-green-500 hover:border-green-400 text-white rounded-full px-3 py-3 sm:px-4 sm:py-3 md:px-6 md:py-4 shadow-lg transition-all duration-300 z-[60] flex items-center space-x-1 sm:space-x-2 border border-blue-400 transform hover:scale-105 chatbot-button"
          aria-label="Ask AI assistant"
        >
          <img 
            src={pancreasIcon} 
            alt="Pancreas Icon" 
            className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
          />
          <span className="font-medium text-sm sm:text-base hidden sm:inline">Consult AI</span>
          <span className="font-medium text-sm sm:hidden">AI</span>
        </button>

             
               {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end p-0 sm:p-4 z-50"
            onClick={() => setIsOpen(false)}
          >
                         <div className="bg-white dark:bg-gray-800 rounded-none sm:rounded-lg shadow-xl w-full h-full sm:w-80 sm:h-96 md:w-96 md:h-[500px] lg:w-[300px] lg:h-[350px] xl:w-[500px] xl:h-[650px] 2xl:w-[550px] 2xl:h-[700px] flex flex-col chatbot-container">
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <FiMessageCircle className="text-white" size={16} />
                </div>
                                 <div>
                   <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base lg:text-lg">PanInsight AI</h3>
                   <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Pancreatic Health Assistant</p>
                 </div>
              </div>
            </div>
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 h-[calc(100vh-140px)] sm:h-80 md:h-96 lg:h-[200px] xl:h-[520px] 2xl:h-[580px] chatbot-messages">
               <div className="text-xs text-gray-500 mb-2">
                 
               </div>
               
                               {!isLoggedIn && messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                      <FiLock className="text-gray-500 dark:text-gray-400" size={16} />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                      Login Required
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 px-2 sm:px-4">
                      Please log in to your PanInsight account to access the AI health assistant.
                    </p>
                    <button
                      onClick={() => navigate('/login')}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                    >
                      Go to Login
                    </button>
                  </div>
                )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg px-3 py-2 sm:px-4 sm:py-2 rounded-lg chatbot-message ${
                      message.isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm break-words chatbot-message-content">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg max-w-[85%] sm:max-w-xs">
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
                         <div className="p-3 sm:p-4 pb-4 sm:pb-6 border-t border-gray-200 dark:border-gray-700 chatbot-input-container">
               <div className="flex space-x-2">
                 <input
                   type="text"
                   value={inputMessage}
                   onChange={(e) => setInputMessage(e.target.value)}
                   onKeyPress={handleKeyPress}
                   placeholder={isLoggedIn ? "Ask about pancreatic health..." : "Login required to chat"}
                   className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm chatbot-input"
                   disabled={isLoading || !isLoggedIn}
                 />
                 <button
                   onClick={handleSendMessage}
                   disabled={!inputMessage.trim() || isLoading || !isLoggedIn}
                   className="px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 >
                   <FiSend size={16} />
                 </button>
               </div>
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PublicChatbot;



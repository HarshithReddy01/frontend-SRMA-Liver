import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiMessageCircle, FiX, FiLock, FiHelpCircle } from 'react-icons/fi';
import { API_ENDPOINTS } from '../config/api';
import { isAuthenticated } from '../utils/authUtils';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const PublicChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check authentication status when component mounts and when modal opens
  useEffect(() => {
    const authStatus = isAuthenticated();
    console.log('PublicChatbot - Auth status:', authStatus);
    setIsLoggedIn(authStatus);
    
    if (authStatus && messages.length === 0) {
      // Initialize welcome message for logged-in users
      setMessages([{
        id: '1',
        text: "Hello! I'm PanInsight's AI assistant, specialized in pancreatic health. I can help you learn about pancreatic anatomy, diseases, symptoms, and treatments. How can I assist you today?",
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length]);

  // Listen for authentication changes
  useEffect(() => {
    const handleStorageChange = () => {
      const authStatus = isAuthenticated();
      setIsLoggedIn(authStatus);
      
      if (!authStatus) {
        // Clear messages when user logs out
        setMessages([]);
      } else if (authStatus && messages.length === 0) {
        // Initialize welcome message when user logs in
        setMessages([{
          id: '1',
          text: "Hello! I'm PanInsight's AI assistant, specialized in pancreatic health. I can help you learn about pancreatic anatomy, diseases, symptoms, and treatments. How can I assist you today?",
          isUser: false,
          timestamp: new Date()
        }]);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check on focus in case user logged in/out in another tab
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

    // Check if user is logged in before allowing chat
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
      // Direct call to DeepInfra API for logged-in users only
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
              content: `You are a specialized pancreatic health assistant. You only answer questions about pancreatic anatomy, diseases, symptoms, treatments, and related medical topics. If someone asks about other topics, politely redirect them to pancreatic health questions. Keep responses concise, educational, and always emphasize that you provide information for educational purposes only and that users should consult healthcare professionals for medical advice.`
            },
            {
              role: 'user',
              content: inputMessage
            }
          ],
          max_tokens: 500,
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
        // Fallback response if API fails
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
             {/* Floating Chat Button */}
       <button
         onClick={() => setIsOpen(true)}
         className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 hover:border-green-700 text-gray-700 hover:text-gray-900 rounded-full px-6 py-3 shadow-lg transition-all duration-300 z-50 flex items-center space-x-2 border border-gray-300"
         aria-label="Ask AI assistant"
       >
         <FiHelpCircle size={20} />
         <span className="font-medium">Need clarity? Ask our AI</span>
       </button>

             {/* Chat Modal */}
       {isOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end p-4 z-50">
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 h-screen max-h-screen flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <FiMessageCircle className="text-white " size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">PanInsight AI</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pancreatic Health Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FiX size={20} />
              </button>
            </div>

                         {/* Messages */}
             <div className="flex-1 overflow-y-auto p-4 space-y-4">
               {/* Debug info - remove this later */}
               <div className="text-xs text-gray-500 mb-2">
                 
               </div>
               
               {!isLoggedIn && messages.length === 0 && (
                 <div className="flex flex-col items-center justify-center h-full text-center">
                   <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                     <FiLock className="text-gray-500 dark:text-gray-400" size={24} />
                   </div>
                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                     Login Required
                   </h3>
                   <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                     Please log in to your PanInsight account to access the AI health assistant.
                   </p>
                   <button
                     onClick={() => window.location.href = '/#/login'}
                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
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
                  <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg">
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

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isLoggedIn ? "Ask about pancreatic health..." : "Login required to chat"}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isLoading || !isLoggedIn}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading || !isLoggedIn}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

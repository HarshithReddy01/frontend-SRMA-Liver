import React, { useState, useRef, useEffect, useContext } from 'react';
import { ThemeContext } from '../theme/ThemeContext';
import pancreasIcon from '../assets/pancreas-icon.png';
import { API_ENDPOINTS } from '../config/api';

interface ChatMessage {
  id: string;
  message: string;
  timestamp: string;
  isUserMessage: boolean;
}

const PancreaticChatbot: React.FC = () => {
  const { isDark } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId] = useState(() => 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: "Hello! I'm your pancreatic health assistant. Ask me about pancreatic diseases, symptoms, or treatments.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUserMessage: false
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);


  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUserMessage: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.CHATBOT_ASK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          message: userMessage.message,
          sessionId: sessionId 
        }),
      });

      const data = await response.json();

      if (data.reply) {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          message: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isUserMessage: false
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('No reply received');
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUserMessage: false
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-6 xl:bottom-12 xl:right-12 z-50 group items-center gap-2 px-3 py-3 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 border-2 chatbot-button ${isOpen ? 'hidden sm:flex' : 'flex'} ${
          isOpen
            ? 'bg-green-400 hover:bg-green-500 text-white border-green-300 shadow-green-400/40'
            : isDark 
              ? 'bg-gradient-to-r from-blue-500 to-blue-500 hover:from-green-600 hover:to-green-600 text-white border-transparent shadow-blue-500/30' 
              : 'bg-gradient-to-r from-blue-500 to-blue-500 hover:from-green-600 hover:to-green-600 text-white border-transparent shadow-blue-500/40'
        }`}
        aria-label="Toggle chatbot"
      >
      {isOpen ? (
        <>
          <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="hidden md:inline text-sm font-semibold whitespace-nowrap">Close Chat</span>
        </>
      ) : (
        <>
          <img 
            src={pancreasIcon} 
            alt="Pancreas Icon" 
            className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
          />
          <span className="hidden sm:inline text-sm font-semibold whitespace-nowrap">
            Consult AI
          </span>
        </>
      )}
    </button>

      {isOpen && (
                   <div className={`fixed inset-0 sm:inset-auto sm:bottom-20 sm:right-4 md:bottom-16 md:right-6 lg:bottom-24 lg:right-6 xl:bottom-20 xl:right-12 z-40 w-full h-full sm:w-80 sm:h-96 md:w-96 md:h-[500px] lg:w-[300px] lg:h-[350px] xl:w-[500px] xl:h-[650px] 2xl:w-[550px] 2xl:h-[700px] rounded-none sm:rounded-2xl shadow-2xl border transition-all duration-300 chatbot-container ${
           isDark 
             ? 'bg-slate-800 border-slate-600' 
             : 'bg-white border-gray-200'
         }`}>
          
                     <div className={`flex items-center justify-between p-3 sm:p-4 rounded-t-none sm:rounded-t-2xl ${
             isDark ? 'bg-slate-700' : 'bg-gradient-to-r from-green-400 to-green-400'
           } text-white`}>
             <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
               <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                 <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               </div>
                                                    <div className="flex-1 min-w-0">
                   <h3 className="font-semibold text-sm sm:text-base lg:text-lg truncate">Pancreatic Health Assistant</h3>
                   <p className="text-xs lg:text-sm opacity-90 truncate">Ask me about pancreatic health</p>
                 </div>
             </div>
             <div className="flex items-center flex-shrink-0 ml-2">
               <div className="hidden sm:block w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
               <button
                 onClick={() => setIsOpen(false)}
                 className="p-1.5 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 flex-shrink-0"
                 aria-label="Close chat"
               >
                 <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>
           </div>

          
                     <div className="flex-1 p-3 sm:p-4 overflow-y-auto h-[calc(100vh-140px)] sm:h-80 md:h-96 lg:h-[200px] xl:h-[520px] 2xl:h-[580px] chatbot-messages">
            <div className="space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUserMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg px-3 py-2 sm:px-4 sm:py-2 rounded-2xl chatbot-message ${
                      message.isUserMessage
                        ? isDark
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-500 text-white'
                        : isDark
                        ? 'bg-slate-700 text-slate-200'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words chatbot-message-content">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.isUserMessage 
                        ? 'text-blue-100' 
                        : isDark ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className={`max-w-[85%] sm:max-w-xs px-3 py-2 sm:px-4 sm:py-2 rounded-2xl ${
                    isDark ? 'bg-slate-700 text-slate-200' : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          
                                <div className={`p-3 sm:p-4 pb-4 sm:pb-6 border-t chatbot-input-container ${
              isDark ? 'border-slate-600 bg-slate-800' : 'border-gray-200 bg-white'
            }`}>
             <div className="flex space-x-2">
               <input
                 ref={inputRef}
                 type="text"
                 value={inputMessage}
                 onChange={(e) => setInputMessage(e.target.value)}
                 onKeyPress={handleKeyPress}
                 placeholder="Ask about pancreatic health..."
                 disabled={isLoading}
                 className={`flex-1 px-3 py-2.5 sm:px-4 sm:py-2.5 rounded-full text-sm border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 chatbot-input ${
                   isDark
                     ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                     : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                 } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
               />
               <button
                 onClick={handleSendMessage}
                 disabled={!inputMessage.trim() || isLoading}
                 className={`p-2.5 sm:p-2.5 rounded-full transition-all duration-200 ${
                   inputMessage.trim() && !isLoading
                     ? isDark
                       ? 'bg-blue-600 hover:bg-blue-700 text-white'
                       : 'bg-blue-500 hover:bg-blue-600 text-white'
                     : isDark
                     ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                     : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                 }`}
               >
                 <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                 </svg>
               </button>
             </div>
           </div>
        </div>
      )}
    </>
  );
};

export default PancreaticChatbot; 
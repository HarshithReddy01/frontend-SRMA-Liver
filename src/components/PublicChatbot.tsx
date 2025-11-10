import React, { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiSend } from 'react-icons/fi';
import pancreasIcon from '../assets/pancreas-icon.png';
import { getDeepInfraApiKey } from '../config/api';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const PublicChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: "Hello! I'm LiverProfile AI's assistant, specialized in liver health. I can help you learn about liver anatomy, diseases, symptoms, and treatments. How can I assist you today?",
    isUser: false,
    timestamp: new Date()
  }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

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
      const apiKey = getDeepInfraApiKey();
      const response = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'meta-llama/Meta-Llama-3-8B-Instruct',
          messages: [
            {
              role: 'system',
              content: `You are a specialized liver health assistant. Provide concise, clear, and direct answers. Keep responses brief but informative. For simple questions, give short answers (1-2 sentences). For complex topics, provide comprehensive but concise explanations (2-3 sentences maximum). Always emphasize that information is for educational purposes only and users should consult healthcare professionals for medical advice.`
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
          <span className="font-medium text-sm sm:text-base hidden sm:inline">Ask Liver AI</span>
          <span className="font-medium text-sm sm:hidden">AI</span>
        </button>

             
               {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end p-0 sm:p-4 z-50"
            onClick={() => setIsOpen(false)}
          >
                         <div 
              className="bg-white dark:bg-gray-800 rounded-none sm:rounded-lg shadow-xl w-full h-full sm:w-80 sm:h-96 md:w-96 md:h-[500px] lg:w-[300px] lg:h-[350px] xl:w-[500px] xl:h-[650px] 2xl:w-[550px] 2xl:h-[700px] flex flex-col chatbot-container"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <FiMessageCircle className="text-white" size={16} />
                </div>
                                 <div>
                   <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base lg:text-lg">LiverProfile AI</h3>
                   <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Liver Health Assistant</p>
                 </div>
              </div>
            </div>
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 h-[calc(100vh-140px)] sm:h-80 md:h-96 lg:h-[200px] xl:h-[520px] 2xl:h-[580px] chatbot-messages">
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
                   placeholder="Ask about liver health..."
                   className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm chatbot-input"
                   disabled={isLoading}
                 />
                 <button
                   onClick={handleSendMessage}
                   disabled={!inputMessage.trim() || isLoading}
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



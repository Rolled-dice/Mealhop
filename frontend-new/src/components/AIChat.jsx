import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FiX, FiSend, FiMessageSquare } from "react-icons/fi";

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: "bot", 
      text: "Hi! I'm MealHop AI Assistant. How can I help you today? 👋" 
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // FAQ responses - rule-based bot
  const getFAQResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    const faqResponses = [
      {
        keywords: ["order", "track", "status", "where"],
        response: "To track your order, go to the 'My Orders' section on your dashboard. You'll see real-time status updates there! 🚚"
      },
      {
        keywords: ["cancel", "refund", "money back"],
        response: "To cancel an order, please contact the restaurant directly before it's prepared. For refunds, contact our support team at support@mealhop.com 📧"
      },
      {
        keywords: ["delivery", "time", "arrive", "how long"],
        response: "Delivery time typically takes 30-45 minutes depending on the restaurant and your location. You can track your order in real-time! ⏱️"
      },
      {
        keywords: ["payment", "pay", "card", "cash", "cod"],
        response: "We accept multiple payment methods: Credit/Debit cards, UPI, and Cash on Delivery. Go to Payment section to complete your transaction! 💳"
      },
      {
        keywords: ["restaurant", "menu", "food", "cuisine"],
        response: "Browse restaurants in the 'Restaurants' section. You can filter by cuisine, rating, and delivery time! 🍕"
      },
      {
        keywords: ["account", "profile", "password", "login", "signin"],
        response: "You can manage your account from the dashboard. For password reset, use the 'Forgot Password' option on the login page! 🔐"
      },
      {
        keywords: ["contact", "support", "help", "speak", "human"],
        response: "For additional help, email us at support@mealhop.com or call our helpline. We're here to help! 📞"
      },
      {
        keywords: ["hello", "hi", "hey", "start"],
        response: "Hello! I can help you with:\n• Order tracking & status\n• Payment methods\n• Restaurant info\n• Account issues\n• Cancellations & refunds\n\nWhat would you like to know? 😊"
      },
      {
        keywords: ["thanks", "thank you", "appreciate"],
        response: "You're welcome! Is there anything else I can help you with? 😊"
      },
      {
        keywords: ["bye", "goodbye", "later"],
        response: "Goodbye! Thanks for using MealHop. Have a great day! 👋"
      }
    ];

    for (const faq of faqResponses) {
      for (const keyword of faq.keywords) {
        if (input.includes(keyword)) {
          return faq.response;
        }
      }
    }

    return "I'm not sure about that. For more help, please contact our support team at support@mealhop.com 📧\n\nI can help with:\n• Order tracking\n• Payment issues\n• Restaurant info\n• Account problems";
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate thinking
      const response = getFAQResponse(userMessage);
      setMessages(prev => [...prev, { role: "bot", text: response }]);
    } catch (error) {
      const fallbackResponse = getFAQResponse(userMessage);
      setMessages(prev => [...prev, { role: "bot", text: fallbackResponse }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full text-white shadow-2xl flex items-center justify-center text-3xl z-[100] transition-all duration-500 ${isOpen ? 'rotate-90 bg-gray-800' : 'bg-orange-500 hover:bg-orange-600 hover:scale-110'}`}
      >
        {isOpen ? <FiX /> : <FiMessageSquare />}
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-24 right-6 w-[350px] md:w-[400px] h-[550px] bg-white rounded-[2rem] shadow-2xl z-[100] flex flex-col overflow-hidden border border-orange-50 transition-all duration-500 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-20 pointer-events-none'}`}>
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/30">
                🤖
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <div className="font-bold text-lg leading-tight">MealHop Assistant</div>
              <div className="text-xs text-orange-100 font-medium">Online • Responds instantly</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === "user" 
                    ? "bg-orange-500 text-white rounded-tr-none" 
                    : "bg-white text-gray-700 border border-orange-50 rounded-tl-none"
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-orange-50 p-4 rounded-2xl rounded-tl-none">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="w-full pl-5 pr-14 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className={`absolute right-2 p-2.5 rounded-xl transition-all ${loading || !input.trim() ? "text-gray-300" : "text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30"}`}
            >
              <FiSend />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-3 text-center uppercase tracking-widest font-bold">
            Powered by MealHop AI
          </p>
        </div>
      </div>
    </>
  );
};

export default AIChat;
import React, { useState } from "react";
import { url } from "../App";
import axios from "axios";

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

  const primaryColor = "#ff4d2d";

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

    // Check for matching keywords
    for (const faq of faqResponses) {
      for (const keyword of faq.keywords) {
        if (input.includes(keyword)) {
          return faq.response;
        }
      }
    }

    // Default response
    return "I'm not sure about that. For more help, please contact our support team at support@mealhop.com 📧\n\nI can help with:\n• Order tracking\n• Payment issues\n• Restaurant info\n• Account problems";
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      // Check if OpenAI is configured
      const hasOpenAI = false; // Would check env in real app
      
      let response;
      
      if (hasOpenAI && process.env.REACT_APP_OPENAI_API_KEY) {
        // Would call OpenAI API here
        const res = await axios.post("https://api.openai.com/v1/chat/completions", {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful customer support assistant for MealHop food delivery app." },
            ...messages.map(m => ({ role: m.role, content: m.text })),
            { role: "user", content: userMessage }
          ]
        }, {
          headers: { Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}` }
        });
        response = res.data.choices[0].message.content;
      } else {
        // Use rule-based FAQ bot
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate thinking
        response = getFAQResponse(userMessage);
      }

      setMessages(prev => [...prev, { role: "bot", text: response }]);
    } catch (error) {
      // Fallback to FAQ on any error
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
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center text-2xl z-50"
        style={{ backgroundColor: primaryColor }}
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-white rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 text-white flex items-center gap-3" style={{ backgroundColor: primaryColor }}>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              🤖
            </div>
            <div>
              <div className="font-bold">MealHop AI Support</div>
              <div className="text-xs text-white/80">Available 24/7</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === "user" 
                      ? "text-white" 
                      : "bg-gray-100 text-gray-800"
                  }`}
                  style={{
                    backgroundColor: msg.role === "user" ? primaryColor : "#f3f4f6",
                    color: msg.role === "user" ? "white" : "#374151"
                  }}
                >
                  <pre className="whitespace-pre-wrap text-sm font-sans">{msg.text}</pre>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-4 py-2 rounded-lg text-white font-medium"
                style={{ 
                  backgroundColor: loading || !input.trim() ? "#ccc" : primaryColor,
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer"
                }}
              >
                Send
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              AI assistant • Add OPENAI_API_KEY for smarter responses
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;
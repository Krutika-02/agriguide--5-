import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Bot, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: "user" | "bot";
  text: string;
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hello! I am your AgriGuide AI assistant. How can I help you today? I can speak Kannada, Hindi, and English!" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: `You are AgriGuide, a helpful agricultural assistant. 
          Provide advice in the language the user speaks (English, Kannada, or Hindi). 
          Keep answers simple, conversational, and focused on farming, crops, diseases, and fertilizers. 
          If you don't know something specific about a local scheme, suggest contacting a local agricultural officer.`,
        }
      });

      const botResponse = response.text || "I'm sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role: "bot", text: botResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "bot", text: "Error connecting to AI. Please check your internet or API key." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-[90vw] sm:w-[400px] h-[500px] flex flex-col border border-harvest-200 overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-earth-600 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <Bot size={24} />
                <span className="font-serif font-bold text-lg">AgriGuide AI</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-earth-700 p-1 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-harvest-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.role === "user" 
                      ? "bg-earth-600 text-white rounded-tr-none" 
                      : "bg-white text-earth-800 border border-harvest-200 rounded-tl-none shadow-sm"
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl border border-harvest-200 rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-earth-400" />
                    <span className="text-xs text-earth-400">AgriGuide is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-harvest-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 bg-harvest-50 border border-harvest-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-earth-400"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-harvest-600 text-white p-2 rounded-full hover:bg-harvest-700 transition-colors disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-earth-600 text-white p-4 rounded-full shadow-lg hover:bg-earth-500 transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
};

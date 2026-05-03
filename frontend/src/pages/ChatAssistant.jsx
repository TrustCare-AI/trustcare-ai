import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import axios from 'axios';

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am TrustCare AI. How can I help you with your health today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), text: userMessage, sender: 'user' }]);
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/ai/chat', { message: userMessage });
      setMessages(prev => [...prev, { id: Date.now() + 1, text: res.data.reply, sender: 'ai' }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "I'm sorry, I'm having trouble connecting to my servers right now.", 
        sender: 'ai',
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Chat Assistant 💬</h1>
        <p className="text-slate-500 mt-1">Powered by advanced NLP models</p>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-teal-400 to-blue-500 text-white'
              }`}>
                {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : msg.isError 
                    ? 'bg-red-50 text-red-600 border border-red-100 rounded-tl-none'
                    : 'bg-slate-100 text-slate-800 rounded-tl-none'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 text-white flex items-center justify-center shrink-0">
                <Bot size={20} />
              </div>
              <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-blue-500" />
                <span className="text-slate-500 text-sm">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your symptoms or ask a medical question..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-4 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors disabled:opacity-50"
            >
              <Send size={20} className="ml-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;

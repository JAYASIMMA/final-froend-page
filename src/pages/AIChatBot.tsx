import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function AIChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Hello! I am your SkinTermo AI Assistant powered by Ollama. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<number[] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/ai/chat', {
        prompt: input,
        context: context
      });

      const aiMessage: Message = { role: 'ai', content: response.data.response };
      setMessages(prev => [...prev, aiMessage]);
      setContext(response.data.context);
    } catch (err: any) {
      console.error(err);
      const errorMessage: Message = { 
        role: 'ai', 
        content: err.response?.data?.detail || "Sorry, I'm having trouble connecting to my brain (Ollama). Please ensure it's running locally." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-lime rounded-2xl flex items-center justify-center shadow-lg shadow-brand-lime/20">
            <Bot className="text-brand-black" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Diagnostic Assistant</h1>
            <p className="text-xs text-gray-500 font-medium">Powered by jayasimma/helpsoft Model</p>
          </div>
        </div>
        <div className="bg-brand-lime/10 text-brand-black px-4 py-2 rounded-xl border border-brand-lime/20 text-xs font-bold flex items-center gap-2">
           <Sparkles size={14} className="text-brand-lime" />
           Ollama Local Engine
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-4 mb-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200"
      >
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-brand-black text-white' : 'bg-brand-lime text-brand-black'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-brand-black text-white rounded-tr-none' 
                  : 'bg-white border border-gray-100 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-lime text-brand-black flex items-center justify-center">
                  <Loader2 size={16} className="animate-spin" />
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl rounded-tl-none italic text-gray-400 text-sm">
                  Thinking...
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="relative">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask me about skin conditions or symptoms..."
          className="w-full bg-white border border-gray-200 rounded-[2rem] pl-6 pr-16 py-5 text-sm focus:border-brand-black outline-none shadow-xl transition-all"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-brand-black text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
        >
          <Send size={18} />
        </button>
      </form>
      <p className="text-[10px] text-center text-gray-400 mt-4 uppercase font-bold tracking-widest">
        Confidential AI Consultation Node • SkinTermo AI
      </p>
    </div>
  );
}

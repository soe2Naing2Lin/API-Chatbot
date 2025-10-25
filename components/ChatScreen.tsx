import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Agent, ChatMessage } from '../types';
import { useUsage } from '../hooks/useUsage';
import { sendMessageToGemini } from '../services/geminiService';
import { BackIcon, SendIcon } from './icons';
import PurchaseOptionsModal from './PurchaseOptionsModal';
import { FREE_TIER_LIMIT } from '../constants';

interface ChatScreenProps {
  agent: Agent;
  onGoBack: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ agent, onGoBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-message',
      text: agent.welcomeMessage,
      sender: 'agent',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { usage, incrementUsage, subscribe, isLimitReached, checkAndResetUsage } = useUsage();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAndResetUsage();
  }, [checkAndResetUsage]);

  const limitReached = isLimitReached();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || limitReached) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: input,
      sender: 'user',
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    incrementUsage();

    try {
      const responseText = await sendMessageToGemini(agent.id, input);
      const agentMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        text: responseText,
        sender: 'agent',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      console.error("Failed to get response from Gemini:", error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        text: "Sorry, I'm having trouble connecting. Please try again.",
        sender: 'agent',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubscribe = () => {
    subscribe();
  };

  return (
    <div className="flex flex-col h-full relative">
       {limitReached && <PurchaseOptionsModal onSubscribe={handleSubscribe} />}
      <header className={`flex items-center p-4 shadow-md z-10 border-b border-slate-700 ${agent.bgColor}`}>
        <button onClick={onGoBack} className="p-2 -ml-2 mr-2 rounded-full hover:bg-white/20 transition-colors">
          <BackIcon className="w-6 h-6 text-white" />
        </button>
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
          <agent.icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white leading-tight">{agent.name}</h1>
           {!usage.isPremium && (
                <div className="text-xs text-white/70 font-mono bg-white/10 px-2 py-0.5 rounded-full inline-block mt-1">
                    Questions: {Math.max(0, FREE_TIER_LIMIT - usage.messageCount)}/{FREE_TIER_LIMIT}
                </div>
            )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-800">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-lg' : 'bg-slate-700 text-slate-200 rounded-bl-lg'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-2xl bg-slate-700 text-slate-200 rounded-bl-lg">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-slate-900/50 backdrop-blur-sm border-t border-slate-700">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={limitReached ? "Message limit reached" : "Type your message..."}
            disabled={isLoading || limitReached}
            className="flex-1 bg-slate-700 rounded-full py-3 px-5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            aria-label="Chat input"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || limitReached}
            className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-indigo-500"
            aria-label="Send message"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatScreen;
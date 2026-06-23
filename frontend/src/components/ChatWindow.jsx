import React, { useRef, useEffect, useState } from 'react';
import MessageBubble from './MessageBubble';
import { Send, Trash2, Sparkles } from 'lucide-react';

export const ChatWindow = ({ messages, onSendMessage, onClearHistory, isSending }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    onSendMessage(input);
    setInput('');
  };

  const handleSuggestionClick = (suggestion) => {
    if (isSending) return;
    onSendMessage(suggestion);
  };

  const suggestions = [
    'How does my profile affect calorie needs?',
    'Suggest a high-protein diet guidelines.',
    'What exercises are best for general fitness?',
    'Provide hydration tips for active workouts.',
  ];

  return (
    <div className="flex h-[calc(100vh-11rem)] flex-col rounded-2xl glass-card overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/60 px-6 py-3.5 dark:border-slate-800 bg-white/40 dark:bg-[#151c2c]/40">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-350">MediCure AI Assistant</span>
        </div>
        {messages.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-2xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all focus:outline-none"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear Chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center px-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 mb-4 shadow-sm animate-bounce">
              <Sparkles className="h-5.5 w-5.5" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">Start a Conversation</h3>
            <p className="max-w-sm text-xs text-slate-400 dark:text-slate-500 mb-6">
              Ask MediCure AI anything about hydration levels, diet models, sleeping well, or workouts.
            </p>

            <div className="grid w-full max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="rounded-xl border border-slate-200 p-3 text-left text-2xs font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-500 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-white transition-all duration-150 focus:outline-none"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <MessageBubble key={index} message={msg} />
            ))}

            {/* Typing Loader */}
            {isSending && (
              <div className="flex w-full gap-3 justify-start mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white shadow-sm">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="rounded-2xl bg-white dark:bg-darkCard border border-slate-250 dark:border-slate-800 px-4 py-3 shadow-xs">
                  <div className="flex items-center gap-1.5 py-1 px-0.5">
                    <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:0.15s]" />
                    <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="border-t border-slate-200/60 p-4 dark:border-slate-800 bg-white/40 dark:bg-[#151c2c]/40">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSending}
            placeholder="Type your question (e.g. general hydration advice)..."
            className="flex-1 rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-xs focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/60 dark:focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus:outline-none"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;

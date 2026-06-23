import React from 'react';
import { Bot, User } from 'lucide-react';

export const MessageBubble = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  // Format assistant replies: render lists, bullet points, headers, paragraphs cleanly
  const formatContent = (text) => {
    return text.split('\n').map((line, index) => {
      const trimmed = line.trim();
      
      // Headers
      if (trimmed.startsWith('### ')) {
        return <h4 key={index} className="text-sm font-bold mt-2 mb-1 text-brand-600 dark:text-brand-400">{trimmed.replace('### ', '')}</h4>;
      }
      if (trimmed.startsWith('## ')) {
        return <h3 key={index} className="text-base font-bold mt-3 mb-1.5 text-brand-600 dark:text-brand-400">{trimmed.replace('## ', '')}</h3>;
      }
      if (trimmed.startsWith('# ')) {
        return <h2 key={index} className="text-lg font-extrabold mt-4 mb-2 text-brand-600 dark:text-brand-400">{trimmed.replace('# ', '')}</h2>;
      }
      
      // Bullets
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={index} className="ml-5 list-disc text-sm my-0.5 leading-relaxed text-slate-600 dark:text-slate-350">
            {trimmed.substring(2)}
          </li>
        );
      }
      
      // Numbered items
      const numberedMatch = trimmed.match(/^(\d+)\.\s(.*)/);
      if (numberedMatch) {
        return (
          <li key={index} className="ml-5 list-decimal text-sm my-0.5 leading-relaxed text-slate-600 dark:text-slate-355">
            {numberedMatch[2]}
          </li>
        );
      }

      // Empty line
      if (trimmed === '') {
        return <div key={index} className="h-2" />;
      }

      // Standard text line
      return <p key={index} className="text-sm my-1 leading-relaxed text-slate-700 dark:text-slate-300">{trimmed}</p>;
    });
  };

  return (
    <div className={`flex w-full gap-3 ${isAssistant ? 'justify-start' : 'justify-end'} mb-4`}>
      {isAssistant && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white shadow-sm">
          <Bot className="h-5 w-5" />
        </div>
      )}

      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-xs ${
          isAssistant
            ? 'bg-white dark:bg-darkCard border border-slate-200/60 dark:border-slate-800 text-slate-800 dark:text-slate-200'
            : 'bg-brand-500 text-white'
        }`}
      >
        <div className="space-y-1">
          {isAssistant ? (
            <div>{formatContent(message.content)}</div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
        <span
          className={`block text-[10px] mt-2 text-right font-medium ${
            isAssistant ? 'text-slate-400 dark:text-slate-500' : 'text-brand-200'
          }`}
        >
          {new Date(message.timestamp || message.createdAt || Date.now()).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      {!isAssistant && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-950/40 text-brand-600 dark:text-brand-300 shadow-sm font-bold text-sm">
          U
        </div>
      )}
    </div>
  );
};

export default MessageBubble;

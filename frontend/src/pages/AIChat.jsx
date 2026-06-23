import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import ChatWindow from '../components/ChatWindow';
import { Loader } from '../components/Loader';
import toast from 'react-hot-toast';

const fetchChatHistory = async () => {
  const { data } = await axiosInstance.get('/chat/history');
  return data;
};

const sendMessageApi = async (message) => {
  const { data } = await axiosInstance.post('/chat/message', { message });
  return data;
};

const clearChatHistoryApi = async () => {
  const { data } = await axiosInstance.delete('/chat/history');
  return data;
};

export const AIChat = () => {
  const queryClient = useQueryClient();

  // Load chat history
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['chatHistory'],
    queryFn: fetchChatHistory,
  });

  // Mutation to send a message
  const sendMutation = useMutation({
    mutationFn: sendMessageApi,
    onMutate: async (newMessage) => {
      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ['chatHistory'] });

      const previousChat = queryClient.getQueryData(['chatHistory']);

      // Optimistically add user's message to UI
      queryClient.setQueryData(['chatHistory'], (old) => [
        ...(old || []),
        { role: 'user', content: newMessage, timestamp: new Date() },
      ]);

      return { previousChat };
    },
    onError: (err, newMessage, context) => {
      // Rollback on error
      if (context?.previousChat) {
        queryClient.setQueryData(['chatHistory'], context.previousChat);
      }
    },
    onSuccess: (data) => {
      // Update cache with the actual response containing assistant content
      queryClient.setQueryData(['chatHistory'], (old) => {
        const listWithoutOptimistic = (old || []).slice(0, -1);
        return [
          ...listWithoutOptimistic,
          { role: 'user', content: data.userMessage || listWithoutOptimistic[listWithoutOptimistic.length - 1]?.content || '', timestamp: new Date() },
          { role: 'assistant', content: data.content, timestamp: data.timestamp },
        ];
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
    },
  });

  // Mutation to clear history
  const clearMutation = useMutation({
    mutationFn: clearChatHistoryApi,
    onSuccess: () => {
      toast.success('Chat history cleared.');
      queryClient.setQueryData(['chatHistory'], []);
    },
  });

  const handleSendMessage = (content) => {
    sendMutation.mutate(content);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your conversation history? This cannot be undone.')) {
      clearMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">MediCure AI Chat</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Discuss nutrition habits, fitness rules, recovery schedules, or general health concerns in real-time.
        </p>
      </div>

      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        onClearHistory={handleClearHistory}
        isSending={sendMutation.isPending}
      />
    </div>
  );
};

export default AIChat;

'use client';

import { useEffect, useMemo } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { useRealtime } from '@/hooks/useRealtime';
import { MessageBubble } from './MessageBubble';
import type { Message } from '@/types/message';

export function MessageList({ contactId }: { contactId: string }) {
  const { messages, setMessages, isLoading, refreshMessages } = useMessages(contactId);

  useRealtime((message: Message) => {
    if (message.receiver_id === contactId || message.user_id === contactId) {
      setMessages((prev) => (prev.some((item) => item.id === message.id) ? prev : [...prev, message]));
    }
  });

  const visibleMessages = useMemo(() => messages, [messages]);

  useEffect(() => {
    const onLocalMessageSent = () => {
      void refreshMessages(false);
    };

    window.addEventListener('message:sent', onLocalMessageSent);

    const timer = setTimeout(() => {
      const last = document.querySelector('#message-bottom');
      last?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('message:sent', onLocalMessageSent);
    };
  }, [visibleMessages, refreshMessages]);

  if (isLoading) {
    return <p className="p-4 text-sm text-slate-400">Loading messages...</p>;
  }

  return (
    <div className="flex-1 space-y-2 overflow-y-auto p-4">
      {visibleMessages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-sm text-slate-400">No messages yet. Start the conversation.</div>
      ) : (
        visibleMessages.map((message) => <MessageBubble key={message.id} message={message} />)
      )}
      <div id="message-bottom" />
    </div>
  );
}

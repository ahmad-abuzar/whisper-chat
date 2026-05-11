'use client';

import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { EmptyState } from './EmptyState';
import type { User } from '@/types/auth';

export function ChatWindow({
  selectedContact,
  onBack,
}: {
  selectedContact: User | null;
  onBack: () => void;
}) {
  if (!selectedContact) {
    return <EmptyState />;
  }

  return (
    <section className="flex flex-1 flex-col bg-[#0b141a]">
      <ChatHeader contact={selectedContact} onBack={onBack} />
      <MessageList contactId={selectedContact.id} />
      <MessageInput contactId={selectedContact.id} />
    </section>
  );
}

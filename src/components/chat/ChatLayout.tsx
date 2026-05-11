'use client';

import { useMemo, useState } from 'react';
import { Sidebar } from './Sidebar';
import { ChatWindow } from './ChatWindow';
import { useContacts } from '@/hooks/useContacts';
import type { User } from '@/types/auth';

export function ChatLayout() {
  const { contacts, isLoading } = useContacts();
  const [selectedContact, setSelectedContact] = useState<User | null>(null);

  const selectedContactId = useMemo(() => selectedContact?.id ?? null, [selectedContact]);

  return (
    <div className="flex h-screen w-full bg-[#0b141a] text-white">
      <Sidebar
        contacts={contacts}
        isLoading={isLoading}
        selectedContactId={selectedContactId}
        onSelectContact={setSelectedContact}
      />
      <ChatWindow
        selectedContact={selectedContact}
        onBack={() => setSelectedContact(null)}
      />
    </div>
  );
}

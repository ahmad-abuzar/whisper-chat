import { create } from 'zustand';
import type { Message } from '@/types/message';
import type { User } from '@/types/auth';

interface ChatStore {
  messages: Message[];
  contacts: User[];
  selectedContact: User | null;
  typing: boolean;
  setMessages: (messages: Message[]) => void;
  setContacts: (contacts: User[]) => void;
  setSelectedContact: (contact: User | null) => void;
  setTyping: (typing: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  contacts: [],
  selectedContact: null,
  typing: false,
  setMessages: (messages) => set({ messages }),
  setContacts: (contacts) => set({ contacts }),
  setSelectedContact: (selectedContact) => set({ selectedContact }),
  setTyping: (typing) => set({ typing }),
}));

'use client';

import { useEffect, useState } from 'react';
import { conversationService } from '@/services/conversation.service';
import type { User } from '@/types/auth';

export function useContacts() {
  const [contacts, setContacts] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await conversationService.getContacts();
        if (active) setContacts(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Failed to load contacts');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  return { contacts, isLoading, error, setContacts };
}

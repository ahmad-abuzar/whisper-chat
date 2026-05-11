'use client';

import { useEffect, useState, useRef } from 'react';
import { messageService } from '@/services/message.service';
import type { Message } from '@/types/message';

export function useMessages(contactId?: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const existingIds = useRef<Set<string>>(new Set());

  const loadMessages = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const data = await messageService.getMessages(contactId ?? undefined);
      // Deduplicate and sort by created_at ascending
      const unique: Message[] = [];
      const seen = new Set<string>();
      (data ?? [])
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .forEach((m) => {
          if (!seen.has(m.id)) {
            seen.add(m.id);
            unique.push(m);
          }
        });
      existingIds.current = new Set(Array.from(seen));
      setMessages(unique);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      setIsLoading(true);
      try {
        const data = await messageService.getMessages(contactId ?? undefined);
        if (active) {
          // Deduplicate and sort
          const unique: Message[] = [];
          const seen = new Set<string>();
          (data ?? [])
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            .forEach((m) => {
              if (!seen.has(m.id)) {
                seen.add(m.id);
                unique.push(m);
              }
            });
          existingIds.current = new Set(Array.from(seen));
          setMessages(unique);
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Failed to load messages');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void load();

    // Poll as a fallback when realtime events are delayed/missed.
    const interval = setInterval(() => {
      if (active) {
        void loadMessages(false);
      }
    }, 2000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [contactId]);

  return { messages, isLoading, error, setMessages, refreshMessages: loadMessages };
}

'use client';

import { useEffect, useState } from 'react';
import { messageService } from '@/services/message.service';
import type { Message } from '@/types/message';

export function useRealtime(onMessage?: (message: Message) => void) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const channel = messageService.subscribeToMessages((message) => {
      onMessage?.(message);
    });

    setConnected(true);

    return () => {
      channel.unsubscribe();
      setConnected(false);
    };
  }, [onMessage]);

  return { connected };
}

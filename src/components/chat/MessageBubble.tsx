'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatTime } from '@/lib/utils/formatTime';
import type { Message } from '@/types/message';

export function MessageBubble({ message }: { message: Message }) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    void supabase.auth.getUser().then(({ data }: { data: { user?: { id: string } | null } }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, []);

  const mine = currentUserId === message.user_id;

  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[72%] rounded-2xl px-4 py-2 text-sm ${mine ? 'rounded-br-sm bg-emerald-500 text-white' : 'rounded-bl-sm bg-[#1f2c33] text-white'}`}>
        <p className="break-words">{message.content}</p>
        <div className="mt-1 text-right text-[10px] text-white/60">{formatTime(message.created_at)}</div>
      </div>
    </div>
  );
}

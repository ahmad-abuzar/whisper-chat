'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { messageService } from '@/services/message.service';
import { TypingIndicator } from './TypingIndicator';

export function MessageInput({ contactId }: { contactId: string }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState('');

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSending(true);
    setError('');
    try {
      await messageService.sendMessage({ content: text.trim(), receiver_id: contactId });
      setText('');
      // Notify message list to refresh optimistically
      try {
        window.dispatchEvent(new Event('message:sent'));
      } catch {
        // ignore in non-browser environments
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border-t border-white/10 bg-[#111b21]">
      {typing ? <TypingIndicator /> : null}
      {error ? <p className="px-4 pt-2 text-xs text-red-400">{error}</p> : null}
      <form onSubmit={send} className="flex items-center gap-2 p-3">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setTyping(true);
            setTimeout(() => setTyping(false), 800);
          }}
          placeholder="Type a message"
          className="flex-1 rounded-full border border-white/10 bg-[#2a3942] px-4 py-2 outline-none placeholder:text-slate-400 focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

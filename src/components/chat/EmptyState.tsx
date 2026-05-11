'use client';

import { MessageCircle } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="rounded-full border border-white/10 bg-white/5 p-8">
        <MessageCircle size={64} className="text-emerald-500" />
      </div>
      <div>
        <h2 className="text-2xl font-light text-slate-200">Whisper for Web</h2>
        <p className="mt-2 max-w-md text-sm text-slate-400">
          Pick a contact from the sidebar to start chatting in real time.
        </p>
      </div>
    </div>
  );
}

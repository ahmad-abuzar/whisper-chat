'use client';

import { ArrowLeft, MoreVertical } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import type { User } from '@/types/auth';

export function ChatHeader({ contact, onBack }: { contact: User; onBack: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 bg-[#111b21] px-4 py-3">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white md:hidden">
          <ArrowLeft size={18} />
        </button>
        <Avatar name={contact.name || contact.email} />
        <div>
          <p className="font-medium">{contact.name || contact.email}</p>
          <p className="text-xs text-emerald-400">online</p>
        </div>
      </div>
      <button className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white">
        <MoreVertical size={18} />
      </button>
    </div>
  );
}

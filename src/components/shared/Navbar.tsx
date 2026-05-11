'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  return (
    <header className="border-b border-white/10 bg-[#111b21]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-white">
          Whisper
        </Link>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span className="hidden sm:inline">Real-time chat</span>
          <Button variant="secondary">Menu</Button>
        </div>
      </div>
    </header>
  );
}

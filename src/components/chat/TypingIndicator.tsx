'use client';

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-2 text-xs text-slate-400">
      <span>typing</span>
      <span className="flex gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
      </span>
    </div>
  );
}

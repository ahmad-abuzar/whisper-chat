import { Spinner } from '@/components/ui/Spinner';

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0b141a] text-white">
      <Spinner size="lg" />
      <p className="mt-4 text-sm text-slate-400">Loading Whisper...</p>
    </div>
  );
}

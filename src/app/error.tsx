'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0b141a] px-4 text-white">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="mt-2 max-w-md text-center text-gray-400">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}

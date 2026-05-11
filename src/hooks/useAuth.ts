'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';
import type { User } from '@/types/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void authService.getCurrentUser()
      .then(setUser)
      .catch((err) => setError(err instanceof Error ? err.message : 'Auth check failed'))
      .finally(() => setIsLoading(false));
  }, []);

  return { user, isLoading, error, setUser };
}

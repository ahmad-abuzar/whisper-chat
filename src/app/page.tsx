'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { ChatLayout } from '@/components/chat/ChatLayout';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Button } from '@/components/ui/Button';
import { LogOut } from 'lucide-react';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      if (!supabase) {
        // Client creation failed (env vars missing during build)
        setIsLoading(false);
        return;
      }
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(Boolean(data.session?.user));
      setIsLoading(false);
    };

    void checkSession();
  }, []);

  const handleAuthSuccess = () => setIsAuthenticated(true);

  const handleLogout = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <ErrorBoundary>
      {isAuthenticated ? (
        <div className="relative h-screen w-screen">
          <ChatLayout />
          <Button
            variant="danger"
            className="absolute right-4 top-4 z-50 inline-flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      ) : (
        <AuthScreen onAuthSuccess={handleAuthSuccess} />
      )}
    </ErrorBoundary>
  );
}

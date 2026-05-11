'use client';

import { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

export function AuthScreen({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <AuthLayout>
      {mode === 'login' ? (
        <LoginForm onSuccess={onAuthSuccess} onSwitchMode={() => setMode('signup')} />
      ) : (
        <SignupForm onSuccess={onAuthSuccess} onSwitchMode={() => setMode('login')} />
      )}
    </AuthLayout>
  );
}

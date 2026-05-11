'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/auth.service';

export function SignupForm({
  onSuccess,
  onSwitchMode,
}: {
  onSuccess: () => void;
  onSwitchMode: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.signup(email, password, name);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
        <p className="mt-2 text-sm text-slate-400">Join the conversation.</p>
      </div>
      <Input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Username" />
      <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
      <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <Button type="submit" className="w-full" isLoading={loading}>Sign up</Button>
      <button type="button" onClick={onSwitchMode} className="w-full text-sm text-emerald-400 hover:underline">
        Already have an account? Login
      </button>
    </form>
  );
}

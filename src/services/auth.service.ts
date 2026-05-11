import { createClient } from '@/lib/supabase/client';
import type { User } from '@/types/auth';

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const supabase = createClient();
    if (!supabase) {
      throw new Error('Supabase is not configured. Please check your environment variables.');
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error('Login failed');
    return {
      id: data.user.id,
      email: data.user.email ?? email,
      created_at: data.user.created_at,
    };
  },

  async signup(email: string, password: string, name?: string): Promise<User> {
    const supabase = createClient();
    if (!supabase) {
      throw new Error('Supabase is not configured. Please check your environment variables.');
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    if (error) throw error;
    if (!data.user) throw new Error('Signup failed');
    return {
      id: data.user.id,
      email: data.user.email ?? email,
      name: name,
      created_at: data.user.created_at,
    };
  },

  async logout() {
    const supabase = createClient();
    if (!supabase) {
      throw new Error('Supabase is not configured. Please check your environment variables.');
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    const supabase = createClient();
    if (!supabase) {
      return null;
    }
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    return {
      id: data.user.id,
      email: data.user.email ?? '',
      created_at: data.user.created_at,
    };
  },
};

import { createClient } from '@/lib/supabase/client';
import type { User } from '@/types/auth';

export const conversationService = {
  async getContacts(): Promise<User[]> {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) return [];

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .neq('id', data.user.id)
      .order('email', { ascending: true });

    if (error) throw error;
    return (users ?? []) as User[];
  },
};

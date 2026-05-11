import { createClient } from '@/lib/supabase/client';
import type { Message, MessageInput } from '@/types/message';

async function ensureUserRow(user: { id: string; email?: string | null; user_metadata?: { name?: string } }) {
  const supabase = createClient();

  const { error } = await supabase
    .from('users')
    .upsert(
      {
        id: user.id,
        email: user.email ?? '',
        name: user.user_metadata?.name ?? null,
      },
      { onConflict: 'id' }
    );

  if (error) throw error;
}

export const messageService = {
  async getMessages(contactId?: string): Promise<Message[]> {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) return [];

    let query = supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (contactId) {
      query = query.or(
        `and(user_id.eq.${data.user.id},receiver_id.eq.${contactId}),and(user_id.eq.${contactId},receiver_id.eq.${data.user.id})`
      );
    }

    const { data: messages, error } = await query;
    if (error) throw error;
    return (messages ?? []) as Message[];
  },

  async sendMessage(input: MessageInput): Promise<Message> {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new Error('Not authenticated');

    // Guard against missing profile rows when auth trigger has not run for older users.
    await ensureUserRow(data.user);

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        content: input.content,
        user_id: data.user.id,
        receiver_id: input.receiver_id ?? null,
      })
      .select('*')
      .single();

    if (error?.code === '23503') {
      throw new Error('Cannot send message yet. Ask both users to open profile once, then try again.');
    }
    if (error) throw error;
    return message as Message;
  },

  subscribeToMessages(onMessage: (message: Message) => void) {
    const supabase = createClient();
    if (!supabase) {
      // Return a no-op channel if client creation failed
      return { unsubscribe: () => {} } as any;
    }

    const channel = supabase
      .channel('messages-feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload: { new: any }) => {
        onMessage(payload.new as Message);
      })
      .subscribe();

    return channel;
  },
};

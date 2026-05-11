import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/profile';

export const profileService = {
  async getProfile(): Promise<Profile | null> {
    const supabase = createClient();
    if (!supabase) return null;
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    // If user doesn't exist in users table yet, create them
    if (error && error.code === 'PGRST116') {
      return {
        id: data.user.id,
        email: data.user.email ?? '',
        name: data.user.user_metadata?.name,
      };
    }

    if (error) throw error;
    return profile as Profile;
  },

  async updateProfile(input: Partial<Profile>): Promise<Profile> {
    const supabase = createClient();
    if (!supabase) throw new Error('Supabase is not configured. Please check your environment variables.');
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new Error('Not authenticated');

    // Check for username uniqueness if updating name
    if (input.name) {
      const { data: existingUsers } = await supabase
        .from('users')
        .select('id')
        .eq('name', input.name)
        .neq('id', data.user.id);

      if (existingUsers && existingUsers.length > 0) {
        throw new Error('Username already taken');
      }
    }

    // Build upsert object with all fields
    const upsertData = {
      id: data.user.id,
      email: data.user.email || '',
      name: input.name !== undefined ? input.name : null,
      bio: input.bio !== undefined ? input.bio : null,
      avatar: input.avatar !== undefined ? input.avatar : null,
    };

    const { data: profile, error } = await supabase
      .from('users')
      .upsert(upsertData, { onConflict: 'id' })
      .select('*')
      .single();

    if (error) {
      console.error('Profile update error:', error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
    return profile as Profile;
  },

  async deleteProfile(): Promise<void> {
    const supabase = createClient();
    if (!supabase) throw new Error('Supabase is not configured. Please check your environment variables.');
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new Error('Not authenticated');

    // Delete user profile from users table
    const { error: deleteUserError } = await supabase
      .from('users')
      .delete()
      .eq('id', data.user.id);

    if (deleteUserError) {
      console.error('Delete profile error:', deleteUserError);
      throw new Error(`Failed to delete profile: ${deleteUserError.message}`);
    }

    // Delete auth user account via server API route
    const response = await fetch('/api/delete-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Delete auth error:', error);
      throw new Error(error.error || 'Failed to delete account');
    }
  },
};

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current authenticated user
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Delete user account using admin API (server-side only)
    const { error } = await supabase.auth.admin.deleteUser(data.user.id);
    if (error) {
      console.error('Delete auth error:', error);
      return NextResponse.json(
        { error: `Failed to delete account: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete account route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

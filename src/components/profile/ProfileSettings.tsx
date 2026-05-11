'use client';

import { useState, useEffect } from 'react';
import { Check, X, Copy } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { profileService } from '@/services/profile.service';
import type { Profile } from '@/types/profile';

interface ProfileSettingsProps {
  profile: Profile | null;
  onUpdate: (profile: Profile) => void;
  onBack: () => void;
  onLogout?: () => void;
}

export function ProfileSettings({ profile, onUpdate, onBack, onLogout }: ProfileSettingsProps) {
  const [name, setName] = useState(profile?.name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Sync state when profile prop changes
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const handleCopyUserId = async () => {
    if (!profile?.id) return;
    await navigator.clipboard.writeText(profile.id);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleUpdateProfile = async () => {
    setError('');
    setSuccess('');

    try {
      if (!name.trim()) {
        throw new Error('Username cannot be empty');
      }
      if (name.length < 2) {
        throw new Error('Username must be at least 2 characters');
      }

      // Check if anything changed
      if (name === profile?.name && bio === profile?.bio) {
        setSuccess('No changes to save');
        return;
      }

      setLoading(true);
      const updated = await profileService.updateProfile({ 
        name: name.trim(),
        bio: bio.trim() 
      });
      onUpdate(updated);
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setError('');

    try {
      await profileService.deleteProfile();
      setSuccess('Account deleted successfully');
      setTimeout(() => {
        onLogout?.();
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete account';
      setError(errorMessage);
      console.error('Delete account error:', err);
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      {/* Profile Preview */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="mb-3 text-xs uppercase tracking-widest text-slate-400">Your Profile</p>
        <div className="flex items-center gap-3">
          <Avatar name={name || profile?.email || 'User'} size="lg" />
          <div className="flex-1">
            <p className="text-lg font-semibold">{name || '(No username set)'}</p>
            <p className="text-sm text-slate-400">{profile?.email || 'No email'}</p>
            {bio && <p className="mt-1 text-sm text-slate-300">{bio}</p>}
          </div>
        </div>

        {/* User ID Section */}
        <div className="mt-4 space-y-2">
          <p className="text-xs uppercase tracking-widest text-slate-400">User ID</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={profile?.id || ''}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 outline-none"
            />
            <button
              onClick={handleCopyUserId}
              className="flex items-center justify-center rounded-lg bg-emerald-500/20 px-3 py-2 text-emerald-400 transition hover:bg-emerald-500/30"
              title="Copy User ID"
            >
              <Copy size={16} />
            </button>
          </div>
          <p className="text-xs text-slate-500">
            {copySuccess ? '✓ Copied to clipboard!' : 'Share this ID with others to add you'}
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-4">
        <p className="text-xs uppercase tracking-widest text-slate-400">Edit Profile</p>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your username"
            type="text"
          />
          <p className="mt-1 text-xs text-slate-400">Must be at least 2 characters and unique</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
          <Input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself"
            type="text"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            <X size={16} />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
            <Check size={16} />
            {success}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="primary" className="flex-1" onClick={handleUpdateProfile} isLoading={loading}>
            Save Changes
          </Button>
          <Button variant="secondary" className="flex-1" onClick={onBack}>
            Back
          </Button>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-red-400">Danger Zone</p>
          <p className="mt-1 text-xs text-slate-400">Permanently delete your account and all data</p>
        </div>
        
        {!showDeleteConfirm ? (
          <Button 
            variant="danger" 
            className="w-full" 
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Account
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-red-400">
              ⚠️ This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="flex gap-2">
              <Button 
                variant="danger" 
                className="flex-1" 
                onClick={handleDeleteAccount}
                isLoading={deleteLoading}
              >
                Yes, Delete My Account
              </Button>
              <Button 
                variant="secondary" 
                className="flex-1" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

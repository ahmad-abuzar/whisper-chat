'use client';

import { useState } from 'react';
import { Search, Plus, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { conversationService } from '@/services/conversation.service';
import type { User } from '@/types/auth';

interface AddUserProps {
  currentUserId: string;
  onUserAdded?: (user: User) => void;
}

export function AddUserModal({ currentUserId, onUserAdded }: AddUserProps) {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSearch = async () => {
    setError('');
    setSuccess('');
    setSearchResults([]);

    if (!searchInput.trim()) {
      setError('Enter a User ID or email to search');
      return;
    }

    setLoading(true);
    try {
      // Search for user by ID or email
      const contacts = await conversationService.getContacts();
      const results = contacts.filter(
        (contact) =>
          contact.id.toLowerCase().includes(searchInput.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchInput.toLowerCase()) ||
          (contact.name && contact.name.toLowerCase().includes(searchInput.toLowerCase()))
      );

      if (results.length === 0) {
        setError('No users found with that ID or email');
      } else {
        setSearchResults(results);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      void handleSearch();
    }
  };

  const handleAddUser = (user: User) => {
    setSuccess(`Added ${user.name || user.email}!`);
    onUserAdded?.(user);
    setTimeout(() => {
      setSearchResults([]);
      setSearchInput('');
      setSuccess('');
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div>
        <p className="mb-3 text-xs uppercase tracking-widest text-slate-400">Add User</p>
        <div className="flex gap-2">
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Paste User ID or email..."
            type="text"
          />
          <Button
            variant="primary"
            onClick={handleSearch}
            isLoading={loading}
            className="px-4"
          >
            <Search size={16} />
          </Button>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Ask friends to share their User ID from their profile
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          <X size={16} />
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
          <Check size={16} />
          {success}
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-2">
          <p className="text-xs uppercase tracking-widest text-slate-400">
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={user.name || user.email} size="md" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user.name || user.email}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  onClick={() => handleAddUser(user)}
                  className="px-3 py-1"
                >
                  <Plus size={14} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

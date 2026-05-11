'use client';

import { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Search, Settings } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ProfileSettings } from '@/components/profile/ProfileSettings';
import { AddUserModal } from '@/components/contacts/AddUserModal';
import { profileService } from '@/services/profile.service';
import { useUIStore } from '@/store/uiStore';
import type { User } from '@/types/auth';
import type { Profile } from '@/types/profile';

interface SidebarProps {
  contacts: User[];
  isLoading: boolean;
  selectedContactId: string | null;
  onSelectContact: (contact: User) => void;
  onLogout?: () => void;
}

export function Sidebar({ contacts, isLoading, selectedContactId, onSelectContact, onLogout }: SidebarProps) {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery } = useUIStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    setProfileLoading(true);
    void profileService
      .getProfile()
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setProfileLoading(false));
  }, []);

  const filteredContacts = useMemo(
    () => contacts.filter((contact) => contact.email.toLowerCase().includes(searchQuery.toLowerCase())),
    [contacts, searchQuery]
  );

  return (
    <aside className="hidden w-96 flex-col border-r border-white/10 bg-[#111b21] md:flex">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Whisper</p>
          <h1 className="text-lg font-semibold">Chats</h1>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <button className={`rounded-lg p-2 ${activeTab === 'chats' ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`} onClick={() => setActiveTab('chats')}>
            <MessageCircle size={18} />
          </button>
          <button className={`rounded-lg p-2 ${activeTab === 'contacts' ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`} onClick={() => setActiveTab('contacts')}>
            <Search size={18} />
          </button>
          <button className={`rounded-lg p-2 ${activeTab === 'profile' ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`} onClick={() => setActiveTab('profile')}>
            <Settings size={18} />
          </button>
        </div>
      </div>

      <div className="border-b border-white/10 p-4">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search or start new chat"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'profile' ? (
          profileLoading ? (
            <p className="p-4 text-sm text-slate-400">Loading profile...</p>
          ) : (
            <ProfileSettings
              profile={profile}
              onUpdate={(updated) => {
                setProfile(updated);
              }}
              onBack={() => setActiveTab('chats')}
              onLogout={onLogout}
            />
          )
        ) : activeTab === 'contacts' ? (
          <div className="space-y-4 p-4">
            <AddUserModal
              currentUserId={profile?.id || ''}
              onUserAdded={(user) => {
                onSelectContact(user);
                setActiveTab('chats');
              }}
            />
            <div>
              <p className="mb-3 text-xs uppercase tracking-widest text-slate-400">All Users</p>
              {isLoading ? (
                <p className="text-sm text-slate-400">Loading users...</p>
              ) : filteredContacts.length === 0 ? (
                <p className="text-sm text-slate-400">No users found.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredContacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => {
                        onSelectContact(contact);
                        setActiveTab('chats');
                      }}
                      className="flex w-full items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left transition hover:bg-white/10"
                    >
                      <Avatar name={contact.name || contact.email} size="md" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-sm">{contact.name || contact.email}</p>
                        <p className="truncate text-xs text-slate-400">{contact.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : isLoading ? (
          <p className="p-4 text-sm text-slate-400">Loading contacts...</p>
        ) : filteredContacts.length === 0 ? (
          <p className="p-4 text-sm text-slate-400">No conversations yet. Start chatting!</p>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => {
                  onSelectContact(contact);
                  setActiveTab('chats');
                }}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/5 ${selectedContactId === contact.id ? 'bg-white/5' : ''}`}
              >
                <Avatar name={contact.name || contact.email} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{contact.name || contact.email}</p>
                  <p className="truncate text-xs text-slate-400">Tap to chat</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

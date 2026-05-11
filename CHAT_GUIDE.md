# How Users Can Chat - Complete Guide

## Overview

The chat application provides real-time messaging between users with contact discovery, message history, and instant notifications.

## Chat Flow

```
1. User logs in
   ↓
2. Select contact from sidebar
   ↓
3. Open chat window
   ↓
4. Type and send message
   ↓
5. Message appears in real-time
   ↓
6. Other user receives notification
```

---

## Step-by-Step Guide

### 1. Login/Signup
First, create an account:
1. Click **"Create account"** on signup form
2. Enter:
   - Username (unique, 2+ characters)
   - Email address
   - Password (min 6 characters)
3. Click **Sign up**
4. You're automatically logged in

### 2. View Available Contacts
Once logged in, you'll see the chat interface:
- **Left sidebar**: Shows all available users (except yourself)
- **Main area**: Chat window (empty until you select a contact)

### 3. Search for Users
To find a specific contact:
1. Click the **Search icon** (🔍) in the sidebar header
2. Type the email or username in the search box
3. Results filter in real-time
4. Click on a contact to select them

### 4. Start a Chat
To start messaging with a contact:
1. **Select a contact** from the sidebar
2. The **chat window** opens showing:
   - Contact's name and online status
   - Previous message history (if any)
   - Message input field at bottom
3. Type your message in the input field
4. Press **Enter** or click the **Send button** (➤)
5. Message appears instantly in your view

### 5. Receive Messages
When someone messages you:
- ✅ Message appears in real-time (no refresh needed)
- ✅ Sent at timestamp is shown
- ✅ Messages from others appear on the **left**
- ✅ Your messages appear on the **right**

### 6. View Message History
- All previous messages with a contact are loaded automatically
- Scroll up to see older messages
- Messages stay in conversation history

---

## Message UI

### Message Bubbles
```
Your Message (Right side, Green)
┌─────────────────┐
│ "Hello there!" │ 2:30 PM
└─────────────────┘

Contact's Message (Left side, Gray)
┌─────────────────┐
│ "Hi! How are you?" │ 2:31 PM
└─────────────────┘
```

### Typing Indicator
While composing a message, the other person sees typing dots:
```
Contact is typing... ●●●
```

### Empty State
If no messages exist yet:
```
"No messages yet. Start the conversation."
```

---

## Features

### Real-Time Messaging
- ✅ Messages update instantly without refreshing
- ✅ Powered by Supabase real-time subscriptions
- ✅ Supports concurrent chats with multiple users
- ✅ Automatic message deduplication

### Contact Management
- ✅ View all active users
- ✅ Search contacts by email/username
- ✅ Show user avatars with initials
- ✅ Display contact names or emails

### Message Management
- ✅ View full conversation history
- ✅ Auto-scroll to latest messages
- ✅ Timestamp on each message
- ✅ Empty state when no messages
- ✅ Loading state while fetching messages

### User Profile
- ✅ View your profile (Settings ⚙️)
- ✅ Edit username and bio
- ✅ Change account settings
- ✅ Delete account (with confirmation)

---

## Technical Implementation

### Components

**[ChatLayout.tsx](src/components/chat/ChatLayout.tsx)**
- Main container for the chat interface
- Manages selected contact state
- Loads contacts list

**[Sidebar.tsx](src/components/chat/Sidebar.tsx)**
- Shows contacts/chats/profile tabs
- Search functionality
- Contact list with filtering

**[ChatWindow.tsx](src/components/chat/ChatWindow.tsx)**
- Main chat area with header, messages, and input

**[MessageList.tsx](src/components/chat/MessageList.tsx)**
- Displays messages in a scrollable list
- Subscribes to real-time updates
- Auto-scrolls to latest message

**[MessageInput.tsx](src/components/chat/MessageInput.tsx)**
- Text input field for composing messages
- Send button
- Typing indicator

**[MessageBubble.tsx](src/components/chat/MessageBubble.tsx)**
- Individual message display
- Differentiates own vs other's messages
- Shows timestamp and avatar

### Services

**[message.service.ts](src/services/message.service.ts)**
```typescript
// Send a message
await messageService.sendMessage({
  content: "Hello!",
  receiver_id: "contact-id"
});

// Get conversation history
const messages = await messageService.getMessages("contact-id");

// Subscribe to real-time messages
messageService.subscribeToMessages((message) => {
  console.log("New message:", message);
});
```

**[conversation.service.ts](src/services/conversation.service.ts)**
```typescript
// Get all contacts
const contacts = await conversationService.getContacts();

// Get conversation with user
const conversation = await conversationService.getConversation("user-id");
```

### Hooks

**[useMessages.ts](src/hooks/useMessages.ts)**
- Fetches and manages messages for a contact
- Returns loading and error states
- Auto-updates when contactId changes

**[useRealtime.ts](src/hooks/useRealtime.ts)**
- Subscribes to real-time message updates
- Fires callback when new message arrives
- Cleans up subscription on unmount

**[useContacts.ts](src/hooks/useContacts.ts)**
- Loads all available contacts
- Filters out current user
- Supports search filtering

---

## Database Schema

### messages Table
```sql
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  receiver_id UUID NOT NULL REFERENCES public.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Key Points
- `user_id`: Sender's user ID
- `receiver_id`: Recipient's user ID
- `content`: Message text
- `created_at`: When message was sent

### Queries
```sql
-- Get conversation between two users
SELECT * FROM messages
WHERE (user_id = 'user1' AND receiver_id = 'user2')
   OR (user_id = 'user2' AND receiver_id = 'user1')
ORDER BY created_at ASC;

-- Get all messages sent by user
SELECT * FROM messages WHERE user_id = 'user-id';

-- Get all messages received by user
SELECT * FROM messages WHERE receiver_id = 'user-id';
```

---

## Real-Time Subscriptions

### How It Works
1. User opens a chat window with contact
2. `useRealtime` hook subscribes to message INSERT events
3. When new message inserted in database, Supabase pushes update
4. Callback fires and adds message to MessageList
5. UI updates instantly without page refresh

### Subscription Code
```typescript
const channel = supabase
  .channel('messages-feed')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => {
      onMessage(payload.new as Message);
    }
  )
  .subscribe();
```

---

## Error Handling

### Common Issues

#### "Not authenticated"
- User not logged in
- **Fix**: Login with your credentials first

#### "Cannot send empty message"
- Tried to send blank message
- **Fix**: Type something before sending

#### "Conversation not found"
- Selected user doesn't exist
- **Fix**: Refresh contacts or select another user

#### "Failed to load messages"
- Database connection issue
- **Fix**: Check internet connection, reload page

#### "Failed to send message"
- Database write error
- **Fix**: Try again, check if receiver still exists

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Enter | Send message |
| Shift+Enter | New line (if implemented) |
| Escape | Clear input / Close modals |
| Ctrl+K | Search (if implemented) |

---

## Privacy & Security

### Row Level Security (RLS)
- ✅ Users can only see their own messages
- ✅ Users can only read messages they sent or received
- ✅ Users can only insert messages as themselves
- ✅ Can't modify or delete messages (by design)

### RLS Policies
```sql
-- Users can only see messages they're involved in
CREATE POLICY "Users can read own messages"
  ON public.messages
  FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = receiver_id);

-- Users can only send messages as themselves
CREATE POLICY "Users can insert own messages"
  ON public.messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## Limitations & Future Enhancements

### Current Limitations
- ❌ No message editing/deletion
- ❌ No file attachments
- ❌ No message reactions
- ❌ No read receipts
- ❌ No typing indicators (UI only, not synced)
- ❌ No group chats
- ❌ No voice/video calls
- ❌ No message encryption

### Planned Features
- 🔄 Message editing
- 🔄 Message deletion
- 🔄 Image/file sharing
- 🔄 Emoji reactions
- 🔄 Read receipts ("seen" status)
- 🔄 Last message preview in contact list
- 🔄 Unread message badges
- 🔄 Online/offline status
- 🔄 Group messaging
- 🔄 End-to-end encryption

---

## Testing the Chat

### Quick Test (2 Users)
1. Open two browser windows
2. Sign up different users in each
3. In User A's window, select User B from contacts
4. In User B's window, select User A from contacts
5. Send message in User A → appears in User B in real-time
6. Send message in User B → appears in User A in real-time

### Test Real-Time Updates
1. Have two users in chat with each other
2. Send message from User A
3. Watch message appear instantly in User B (no refresh needed)

### Test Contact Search
1. Multiple users exist in system
2. In sidebar, click Search icon
3. Type partial email/username
4. Contacts filter in real-time

### Test Message History
1. Send multiple messages between two users
2. Close browser
3. Log back in
4. Select same contact
5. Previous messages appear (loaded from database)

---

## FAQ

**Q: Can I delete messages?**
A: Not yet - messages are permanent by design for accountability

**Q: Can I message multiple people at once?**
A: Only one-on-one chats supported currently (group chats coming soon)

**Q: Are messages encrypted?**
A: Not yet - encryption coming in future update

**Q: What happens to messages when I delete my account?**
A: All messages you sent/received are deleted (cascading delete)

**Q: Can I send files/images?**
A: Not yet - file sharing coming soon

**Q: How do I know if someone is online?**
A: Online status indicators coming soon


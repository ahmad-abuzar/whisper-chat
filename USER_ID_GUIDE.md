# User ID & Add User Feature Guide

## Overview

Users can now:
1. **View their User ID** in their profile
2. **Share their User ID** with others
3. **Search and add users** by User ID or email
4. **Start chatting** with added users

---

## How to Share Your User ID

### Step 1: Open Profile Settings
1. Click the **Settings icon** (⚙️) in the sidebar header
2. Your profile appears with your:
   - Username
   - Email address
   - Bio
   - **User ID**

### Step 2: Copy Your User ID
1. Find the **User ID** field (unique identifier)
2. Click the **Copy button** (📋) next to it
3. You'll see "✓ Copied to clipboard!"
4. Share this ID with friends

### Step 3: Share the ID
- Send via message, email, or social media
- Anyone can use this ID to add you
- Format: UUID (e.g., `a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6`)

---

## How to Add a User

### Step 1: Go to Contacts Tab
1. Click the **Search icon** (🔍) in sidebar header
2. This opens the **Contacts** tab

### Step 2: Add User Section
You'll see an "Add User" input field with a search button

### Step 3: Paste User ID or Enter Email
**Option A - Use User ID (Recommended)**
1. Ask the person for their User ID
2. Click in the search field
3. Paste the User ID: `a1b2c3d4-e5f6-g7h8...`
4. Click **Search** button

**Option B - Search by Email**
1. Enter their email address
2. Click **Search**

**Option C - Search by Username**
1. Enter their username
2. Click **Search**

### Step 4: View Results
- All matching users appear below
- Shows:
  - User avatar
  - Name (if set)
  - Email address

### Step 5: Add the User
1. Click the **Plus button** (+) on the user you want to add
2. See success message: "Added [User]!"
3. User automatically opens in chat window

### Step 6: Start Chatting
1. Type your message in the input field
2. Click **Send** (➤) or press **Enter**
3. Message appears instantly
4. Conversation history is saved

---

## User ID Format

### What is a User ID?
- Unique identifier assigned when you sign up
- Format: UUID (128-bit number)
- Example: `a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6`
- Never changes
- Different from username (which can be changed)

### Where to Find Your ID
1. **Profile Settings** (⚙️) → Your Profile section
2. Displayed in read-only field
3. Has copy button for easy sharing

---

## Search Examples

| Search Query | Result |
|---|---|
| `a1b2c3d4-e5f6-g7h8...` | Finds user with that exact ID |
| `john@example.com` | Finds user with that email |
| `john` | Finds users with "john" in email or username |
| `JD` (username) | Finds user "JD" |

---

## Sidebar Tabs Explained

### 💬 Chats Tab (Default)
- Shows your active conversations
- Search in this tab searches emails/names
- Click to open chat with someone

### 🔍 Contacts Tab (New)
- **Add User section** - Search by ID, email, or username
- **All Users section** - Browse all available users
- Click user to start/continue chatting

### ⚙️ Profile Tab
- View your profile
- Copy your User ID
- Edit username and bio
- Delete account

---

## Complete Chat Flow with User ID

```
Step 1: Share Your ID
┌──────────────────────┐
│ Settings → Profile   │
│ Copy User ID         │
│ Share with friend    │
└──────────────────────┘
          ↓
Step 2: Friend Adds You
┌──────────────────────┐
│ Search → Contacts    │
│ Paste your ID        │
│ Click Add (+)        │
└──────────────────────┘
          ↓
Step 3: Start Chatting
┌──────────────────────┐
│ Type message         │
│ Press Enter          │
│ Chat in real-time    │
└──────────────────────┘
```

---

## Features

✅ **Unique User IDs**
- Every user has a unique identifier
- Can't change (permanent)
- Different from username

✅ **Multiple Search Options**
- Search by User ID (exact match)
- Search by email (exact/partial)
- Search by username (partial)

✅ **User Discovery**
- Browse all available users
- See profiles before chatting
- Instant add with one click

✅ **Real-Time Chat**
- After adding, start chatting immediately
- Messages appear in real-time
- No page refresh needed

✅ **Profile Information**
- See username and bio before chatting
- View email address
- User avatar with initials

---

## Common Questions

**Q: Can I change my User ID?**
A: No, it's permanent and unique. Use username for display name if you want to change it.

**Q: Can I hide my User ID?**
A: No, it's public so others can find you. But you choose who to add.

**Q: Do I need to share my User ID?**
A: Only if you want to be discovered. Everyone in the system is visible in "All Users" anyway.

**Q: What if I search and can't find someone?**
A: Make sure:
- They've signed up
- You spelled their email/ID correctly
- Copy the exact User ID (includes hyphens)

**Q: Can I block users?**
A: Not yet, but coming in future updates.

**Q: What if someone uses my User ID by mistake?**
A: They can only message you. You can delete them from chats anytime.

---

## Security & Privacy

### What's Visible
- ✅ Your username
- ✅ Your email
- ✅ Your User ID
- ✅ Your bio
- ✅ Your avatar

### What's Hidden
- ❌ Your password
- ❌ Private messages (only visible to sender/receiver)
- ❌ Account details
- ❌ IP address

### Privacy Policies
- RLS (Row Level Security) ensures:
  - Only you can see your messages
  - Only recipients see received messages
  - Only account owner can edit profile
  - Only account owner can delete account

---

## Tips & Tricks

### 💡 Pro Tips
1. **Copy ID** - Use the copy button for easy sharing
2. **Search Quickly** - Just paste the full User ID
3. **Browse All** - Check "All Users" to discover new people
4. **Multiple Chats** - Switch between chats instantly in Chats tab
5. **Update Profile** - Change username anytime in Profile settings

### 🚀 Workflow
```
Get User ID → Share → Add User → Chat → Save History
```

---

## Future Enhancements

🔄 **Coming Soon**
- Add friends/contacts feature
- Favorite contacts
- Block/mute users
- User status (online/offline)
- Last seen timestamp
- Contact groups
- User search suggestions


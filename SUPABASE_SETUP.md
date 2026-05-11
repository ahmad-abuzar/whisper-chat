# Supabase Database Setup

## Required Tables

### 1. `users` Table
This table stores user profile information linked to Supabase Auth.

**Fields:**
- `id` (UUID) - **User ID** - Primary Key, references auth.users(id), unique identifier for each user
- `email` (TEXT) - User's email address, unique, searchable
- `name` (TEXT) - Username, unique, searchable, changeable
- `bio` (TEXT) - User biography/bio
- `avatar` (TEXT) - User avatar URL
- `created_at` (TIMESTAMP) - Account creation time
- `updated_at` (TIMESTAMP) - Last profile update time

**Search Capabilities:**
The User ID field (`id`) along with `email` and `name` enable searching for users:
- Search by **User ID** (exact UUID match)
- Search by **email** (exact or partial match)
- Search by **username/name** (partial match)

#### SQL to Create Table:
```sql
-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT UNIQUE,
  bio TEXT,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster name lookups
CREATE INDEX idx_users_name ON public.users(name);
CREATE INDEX idx_users_email ON public.users(email);

-- Enable RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read all profiles (needed for search/add user feature)
CREATE POLICY "Users can read all profiles"
  ON public.users
  FOR SELECT
  USING (true);

-- RLS Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policy: Service role can do anything (for development)
-- NOTE: Remove this in production - it's only for development convenience
CREATE POLICY "Enable all for service role"
  ON public.users
  USING (current_user = 'postgres')
  WITH CHECK (current_user = 'postgres');
```

### 2. `messages` Table
```sql
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_user_id ON public.messages(user_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own messages"
  ON public.messages
  FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert own messages"
  ON public.messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## User Search Queries

The application uses these queries to search for users when adding contacts:

### Search by User ID
```sql
-- Exact User ID match (most precise)
SELECT id, email, name, bio, avatar 
FROM public.users 
WHERE id = 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6'
LIMIT 1;
```

### Search by Email
```sql
-- Find user by email (case-insensitive)
SELECT id, email, name, bio, avatar 
FROM public.users 
WHERE LOWER(email) = LOWER('john@example.com')
LIMIT 1;
```

### Search by Username
```sql
-- Find user by username/name (partial match)
SELECT id, email, name, bio, avatar 
FROM public.users 
WHERE LOWER(name) LIKE LOWER('%john%')
LIMIT 10;
```

### Get All Users (Except Current User)
```sql
-- Get all users for the Contacts list
SELECT id, email, name, bio, avatar 
FROM public.users 
WHERE id != 'current-user-id'
ORDER BY name ASC;
```

## Setup Steps

1. **Go to Supabase Dashboard** → Your Project → SQL Editor
2. **Copy and paste the SQL above** into a new query
3. **Run the query** to create the tables and policies
4. **Create a trigger to populate users table on signup:**

```sql
-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    new.id,
    new.email,
    new.user_metadata->>'name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Troubleshooting

### "Cannot coerce the result to a single JSON object" Error (PGRST116)
This means the user doesn't have a row in the `users` table yet.

**Solution:**
1. The code now uses **UPSERT** to automatically create the row if it doesn't exist
2. Make sure RLS policies include an INSERT policy (added above)
3. If still failing, temporarily **disable RLS** on the users table:
```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```
Then try updating again. If it works, the issue is with RLS policies.

### "Users table does not exist" Error
- Make sure you've created the `users` table using the SQL above
- Check that the table is in the `public` schema
- Verify: Supabase → Table Editor → should show `users` table

### "Failed to update profile" Error
- Verify RLS policies are set up correctly
- Ensure the table has the columns: `id`, `email`, `name`, `bio`, `avatar`
- Check the browser console for the exact error message
- If using UPSERT, make sure the INSERT policy exists

### "Username already taken" Error
- This is expected - it means the username exists
- Try with a different username

### Can't find users in search
- Make sure RLS policy "Users can read all profiles" is enabled
- Check that the user you're searching for has completed signup
- Verify the email/username spelling
- Try searching by User ID for exact match

## Debug Steps

1. **Check if users table exists:**
```sql
SELECT * FROM public.users LIMIT 1;
```

2. **Check if the signed-in user has a profile:**
```sql
SELECT * FROM public.users WHERE id = 'YOUR_USER_ID';
```

3. **Check RLS policies:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'users';
```
Should see policy: "Users can read all profiles" with SELECT permission

4. **Test search functionality:**
```sql
-- Search by email
SELECT id, email, name FROM users 
WHERE LOWER(email) LIKE LOWER('%john%');

-- Search by username
SELECT id, email, name FROM users 
WHERE LOWER(name) LIKE LOWER('%john%');

-- Search by exact User ID
SELECT id, email, name FROM users 
WHERE id = 'exact-uuid-here';
```

5. **Check browser console** for detailed error messages

## Auth Metadata Setup

When users sign up with a username, it's stored in Supabase auth metadata AND the users table.

The auth signup metadata stores it temporarily, and the trigger moves it to the `users` table permanently.

## User ID Feature

### What is a User ID?
- The unique `id` field in the `users` table
- Generated as a UUID when user signs up
- Linked to `auth.users.id` via foreign key
- Used for sharing and finding users
- Example: `a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6`

### How User Search Works
Users can search and add each other using three methods:

**1. Search by User ID**
```sql
-- Returns single user if found
SELECT * FROM users WHERE id = 'provided-uuid';
```

**2. Search by Email**
```sql
-- Case-insensitive search
SELECT * FROM users 
WHERE LOWER(email) LIKE LOWER('%search-term%');
```

**3. Search by Username**
```sql
-- Partial match on username
SELECT * FROM users 
WHERE LOWER(name) LIKE LOWER('%search-term%');
```

### RLS Permissions for Search
The "Users can read all profiles" policy allows:
- ✅ Searching for other users
- ✅ Viewing public profiles (email, name, bio)
- ✅ Starting conversations with searched users
- ❌ Cannot modify other users' data
- ❌ Cannot see private information

### Database Indexes for Search Performance
Indexes are created for faster searches:
```sql
CREATE INDEX idx_users_email ON public.users(email);  -- For email search
CREATE INDEX idx_users_name ON public.users(name);    -- For username search
-- id is automatically indexed as PRIMARY KEY
```

### Adding Users Flow (Database Perspective)
```
1. User A searches → SELECT from users table
2. User B's profile found
3. No new records created (users just chat)
4. Messages stored in messages table
5. Both see conversation in chats list
```

### Important: User Privacy
- Emails and names are searchable but NOT private
- Use public information carefully
- Delete account removes all user data
- Messages stay private (RLS enforces)


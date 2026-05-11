# CRUD Operations Guide

Complete CRUD (Create, Read, Update, Delete) operations for user profiles in the chat application.

## Overview

All CRUD operations are handled through the `profileService` and `authService` in `src/services/`.

## Create (User Registration)

### Endpoint
`authService.signup(email, password, name)`

### Location
[src/services/auth.service.ts](src/services/auth.service.ts)

### How It Works
1. User signs up with email, password, and username
2. Supabase Auth creates the user in auth.users table
3. Username is stored in auth metadata
4. Database trigger automatically creates user profile in users table

### Code Example
```typescript
const user = await authService.signup('john@example.com', 'password123', 'john_doe');
```

### UI Component
[SignupForm.tsx](src/components/auth/SignupForm.tsx)

---

## Read (Get Profile)

### Endpoint
`profileService.getProfile()`

### Location
[src/services/profile.service.ts](src/services/profile.service.ts)

### How It Works
1. Gets current authenticated user from Supabase Auth
2. Fetches user profile from users table
3. If profile doesn't exist in table, returns data from auth metadata
4. Returns Profile object with id, email, name, bio, avatar

### Code Example
```typescript
const profile = await profileService.getProfile();
console.log(profile.name, profile.bio);
```

### UI Component
[ProfileSettings.tsx](src/components/profile/ProfileSettings.tsx) - Shows profile preview

---

## Update (Edit Profile)

### Endpoint
`profileService.updateProfile(input)`

### Location
[src/services/profile.service.ts](src/services/profile.service.ts)

### How It Works
1. Gets current authenticated user
2. Checks if new username is unique (if changing name)
3. Uses UPSERT operation - creates row if it doesn't exist, updates if it does
4. Returns updated Profile object

### Fields That Can Be Updated
- `name` - Username (must be unique, min 2 characters)
- `bio` - User biography
- `avatar` - Avatar URL

### Code Example
```typescript
const updated = await profileService.updateProfile({
  name: 'new_username',
  bio: 'My new bio'
});
```

### UI Component
[ProfileSettings.tsx](src/components/profile/ProfileSettings.tsx) - Edit form with Save Changes button

### Features
- ✅ Username uniqueness validation
- ✅ Real-time error handling
- ✅ Success feedback
- ✅ Automatic state sync when profile updates
- ✅ Input trimming and validation

---

## Delete (Remove Account)

### Endpoint
`profileService.deleteProfile()`

### Location
[src/services/profile.service.ts](src/services/profile.service.ts)

### How It Works
1. Gets current authenticated user
2. Deletes user profile from users table
3. Deletes user account from Supabase Auth
4. Automatically logs out user after deletion

### Cascade Effects
- ❌ User auth account deleted
- ❌ User profile deleted
- ❌ All related messages are deleted (due to ON DELETE CASCADE foreign key)
- ✅ User is logged out automatically

### Code Example
```typescript
await profileService.deleteProfile();
// User is automatically logged out and redirected to login
```

### UI Component
[ProfileSettings.tsx](src/components/profile/ProfileSettings.tsx) - "Danger Zone" section with:
- Delete Account button
- Confirmation dialog
- "Yes, Delete My Account" confirmation button

### Safety Features
- ⚠️ Two-step confirmation required
- ⚠️ Warning message shown
- ⚠️ Cannot be undone
- ⚠️ All data permanently deleted

---

## Service Layer Architecture

### profileService Methods
```typescript
export const profileService = {
  // Read
  getProfile(): Promise<Profile | null>
  
  // Update (Create or Update)
  updateProfile(input: Partial<Profile>): Promise<Profile>
  
  // Delete
  deleteProfile(): Promise<void>
}
```

### authService Methods
```typescript
export const authService = {
  // Create
  signup(email: string, password: string, name?: string): Promise<User>
  
  // Login
  login(email: string, password: string): Promise<User>
  
  // Logout
  logout(): Promise<void>
  
  // Read
  getCurrentUser(): Promise<User | null>
}
```

---

## Database Tables

### users Table (Profile Data)
```sql
- id: UUID (Primary Key, references auth.users)
- email: TEXT (Unique)
- name: TEXT (Unique, stores username)
- bio: TEXT (User biography)
- avatar: TEXT (Avatar URL)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Row Level Security (RLS) Policies
- ✅ Users can read their own profile
- ✅ Users can update their own profile
- ✅ Users can insert their own profile

---

## Error Handling

### Create Errors
- "Email already in use" - Email already registered
- "Signup failed" - Generic signup failure

### Read Errors
- "Not authenticated" - User not logged in
- User data from auth metadata returned if database row missing

### Update Errors
- "Username already taken" - Username exists for another user
- "Username cannot be empty" - Name validation failed
- "Username must be at least 2 characters" - Length validation
- "Failed to update profile" - Database error

### Delete Errors
- "Not authenticated" - User not logged in
- "Failed to delete profile" - Database deletion failed
- "Failed to delete account" - Auth deletion failed

---

## Testing CRUD Operations

### Test Create
1. Go to signup form
2. Enter email, password, and username
3. Submit
4. User created in auth and profile created in database

### Test Read
1. Login with credentials
2. Click Settings icon (⚙️)
3. See profile preview with username and bio from database

### Test Update
1. In profile settings, change username or bio
2. Click "Save Changes"
3. See success message
4. Profile updates in database and UI

### Test Delete
1. In profile settings, scroll to "Danger Zone"
2. Click "Delete Account"
3. Click "Yes, Delete My Account" to confirm
4. See success message
5. Automatically logged out and redirected to login
6. Cannot login with deleted account


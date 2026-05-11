export interface User {
  id: string;
  email: string;
  name?: string;
  bio?: string;
  avatar?: string;
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

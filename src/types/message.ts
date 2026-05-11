export interface Message {
  id: string;
  content: string;
  user_id: string;
  receiver_id?: string | null;
  created_at: string;
}

export interface MessageInput {
  content: string;
  receiver_id?: string | null;
}

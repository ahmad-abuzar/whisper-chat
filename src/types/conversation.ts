import type { Message } from './message';
import type { User } from './auth';

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
}

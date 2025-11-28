export interface ChatUser {
  id: number;
  name: string;
  avatar: string;
  role: string;
  online: boolean;
}

export interface Message {
  id: number;
  chatId: number;
  senderId: number;
  text?: string;
  fileUrl?: string;
  timestamp: Date;
  ai?: boolean;
}

export interface ChatRoom {
  id: number;
  name: string;
  users: number[];
  isGroup: boolean;
  lastMessage?: string;
}

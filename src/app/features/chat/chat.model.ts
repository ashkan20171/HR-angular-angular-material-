export interface ChatUser {
  id: number;
  name: string;
  avatar: string;
  role: string;
  online: boolean;
  lastSeen?: Date;   // اضافه شد
}

export interface Message {
  id: number;
  chatId: number;
  senderId: number;
  text?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  imageUrl?: string;
  audioUrl?: string;
  duration?: number;
  timestamp: Date;
  ai?: boolean; // پیام از طرف هوش مصنوعی؟
}

export interface ChatRoom {
  id: number;
  name: string;
  users: number[];
  isGroup: boolean;
  lastMessage?: string;      // آخرین پیام
  lastMessageTime?: Date;    // زمان آخرین پیام
}

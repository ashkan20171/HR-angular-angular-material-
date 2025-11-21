export interface Notification {
  id: number;
  text: string;
  type: 'info' | 'success' | 'warning' | 'error';
  created: string;
  read: boolean;
}

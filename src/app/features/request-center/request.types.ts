export type RequestStatus = 
  'pending' | 'accepted' | 'rejected' | 'manager-review' | 'hr-review';

export interface RequestItem {
  id: number;
  type: string;
  date: string;
  desc: string;
  status: RequestStatus;
  user: string;
  attachments?: string[];
  history: {
    date: string;
    action: string;
    by: string;
  }[];
}

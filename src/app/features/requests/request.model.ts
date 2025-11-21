export type RequestType =
  | 'leave'
  | 'loan'
  | 'mission'
  | 'overtime';

export type RequestStatus =
  | 'pending'
  | 'approved'
  | 'rejected';

export interface RequestItem {
  id: number;
  type: RequestType;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  days?: number;
  amount?: number;
  status: RequestStatus;
  userName: string;
  createdAt: string;
}

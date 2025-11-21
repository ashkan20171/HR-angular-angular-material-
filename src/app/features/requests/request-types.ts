export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface HRRequest {
  id: number;
  type: string;
  createdAt: string;
  user: string;
  details: string;
  status: RequestStatus;
}

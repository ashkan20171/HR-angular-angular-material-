export interface Applicant {
  id: number;
  jobId: number;
  name: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  experience: string;
  skills: string[];
  status: 'new' | 'review' | 'interview' | 'accepted' | 'rejected';
}

export interface Job {
  id: number;
  title: string;
  department: string;
  level: string; // Junior / Mid / Senior
  salary: string;
  description: string;
  status: 'open' | 'paused' | 'closed';
}

export interface KPI {
  id: number;
  title: string;
  weight: number; // درصد اهمیت
}

export interface Evaluation {
  kpiId: number;
  selfScore: number | null;
  managerScore: number | null;
  comment?: string;
}

export interface PerformanceRecord {
  id: number;
  user: string;
  period: string; // مثلا 1403-Q4
  kpis: KPI[];
  evaluations: Evaluation[];
  finalScore?: number;
}

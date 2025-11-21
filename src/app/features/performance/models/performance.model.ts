export interface KPI {
  title: string;
  scoreSelf: number;
  scoreManager: number;
  weight: number;
}

export interface Skill {
  title: string;
  self: number;
  manager: number;
}

export interface PerformanceReview {
  year: number;
  employee: {
    goals: string[];
    comments: string;
  };
  manager: {
    strengths: string[];
    improvements: string[];
    finalComment: string;
  };
  kpi: KPI[];
  skills: Skill[];
  finalScore: number;
}

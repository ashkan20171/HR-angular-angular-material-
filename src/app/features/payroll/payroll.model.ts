export interface SalaryRow {
  title: string;
  amount: number;
  type: 'plus' | 'minus'; // مزایا / کسورات
}

export interface PayrollRecord {
  id: number;
  month: string;
  baseSalary: number;
  rows: SalaryRow[];
  finalSalary: number;
}

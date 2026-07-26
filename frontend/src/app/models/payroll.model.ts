export interface SalaryStructureResponse {
  id: number;
  gradeId: number;
  gradeName: string;
  basicSalary: number;
  houseAllowance: number;
  medicalAllowance: number;
  transportAllowance: number;
  taxRate: number;
  providentFundRate: number;
}

export interface SalaryStructureRequest {
  gradeId: number;
  basicSalary: number;
  houseAllowance: number;
  medicalAllowance: number;
  transportAllowance: number;
  taxRate: number;
  providentFundRate: number;
}

export interface PayrollRunResponse {
  id: number;
  month: string;
  year: number;
  completed: boolean;
  totalEmployees: number;
}

export interface PayslipResponse {
  id: number;
  employeeId: number;
  employeeName: string;
  basicSalary: number;
  grossSalary: number;
  taxDeduction: number;
  providentFundDeduction: number;
  netSalary: number;
}

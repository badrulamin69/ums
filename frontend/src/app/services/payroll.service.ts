import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  SalaryStructureResponse,
  SalaryStructureRequest,
  PayrollRunResponse,
  PayslipResponse,
} from '../models/payroll.model';
import { ApiResponse } from '../models/common.model';

@Injectable({ providedIn: 'root' })
export class PayrollService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSalaryStructures(): Observable<ApiResponse<SalaryStructureResponse[]>> {
    return this.http.get<ApiResponse<SalaryStructureResponse[]>>(`${this.apiUrl}/salary-structures`);
  }

  createSalaryStructure(request: SalaryStructureRequest): Observable<ApiResponse<SalaryStructureResponse>> {
    return this.http.post<ApiResponse<SalaryStructureResponse>>(`${this.apiUrl}/salary-structures`, request);
  }

  runPayroll(month: string, year: number): Observable<ApiResponse<PayrollRunResponse>> {
    return this.http.post<ApiResponse<PayrollRunResponse>>(`${this.apiUrl}/payroll/run?month=${month}&year=${year}`, {});
  }

  getPayslipsByRun(runId: number): Observable<ApiResponse<PayslipResponse[]>> {
    return this.http.get<ApiResponse<PayslipResponse[]>>(`${this.apiUrl}/payroll/runs/${runId}/payslips`);
  }

  getPayslipsByEmployee(employeeId: number): Observable<ApiResponse<PayslipResponse[]>> {
    return this.http.get<ApiResponse<PayslipResponse[]>>(`${this.apiUrl}/payroll/employee/${employeeId}/payslips`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  EmployeeResponse,
  EmployeeRequest,
  AttendanceResponse,
  DesignationResponse,
  GradeResponse,
  LeaveRequestResponse,
} from '../models/hrm.model';
import { ApiResponse } from '../models/common.model';
import { EncryptionService } from './encryption.service';

@Injectable({ providedIn: 'root' })
export class HrmService {
  private readonly apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient, private encryption: EncryptionService) {}

  getEmployees(): Observable<ApiResponse<EmployeeResponse[]>> {
    return this.http.get<ApiResponse<EmployeeResponse[]>>(`${this.apiUrl}/employees`);
  }

  getEmployeeById(id: number): Observable<ApiResponse<EmployeeResponse>> {
    return this.http.get<ApiResponse<EmployeeResponse>>(`${this.apiUrl}/employees/${id}`);
  }

  createEmployee(request: EmployeeRequest): Observable<ApiResponse<EmployeeResponse>> {
    const encrypted = this.encryption.encryptSensitiveFields(request as any);
    return this.http.post<ApiResponse<EmployeeResponse>>(`${this.apiUrl}/employees`, encrypted);
  }

  updateEmployee(id: number, request: EmployeeRequest): Observable<ApiResponse<EmployeeResponse>> {
    const encrypted = this.encryption.encryptSensitiveFields(request as any);
    return this.http.put<ApiResponse<EmployeeResponse>>(`${this.apiUrl}/employees/${id}`, encrypted);
  }

  deactivateEmployee(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/employees/${id}`);
  }

  getAttendance(employeeId: number, startDate: string, endDate: string): Observable<ApiResponse<AttendanceResponse[]>> {
    return this.http.get<ApiResponse<AttendanceResponse[]>>(
      `${this.apiUrl}/attendance/employee/${employeeId}?startDate=${startDate}&endDate=${endDate}`
    );
  }

  checkIn(employeeId: number): Observable<ApiResponse<AttendanceResponse>> {
    return this.http.post<ApiResponse<AttendanceResponse>>(`${this.apiUrl}/attendance/check-in`, { employeeId });
  }

  checkOut(employeeId: number): Observable<ApiResponse<AttendanceResponse>> {
    return this.http.post<ApiResponse<AttendanceResponse>>(`${this.apiUrl}/attendance/check-out`, { employeeId });
  }

  getDesignations(): Observable<ApiResponse<DesignationResponse[]>> {
    return this.http.get<ApiResponse<DesignationResponse[]>>(`${this.apiUrl}/designations`);
  }

  getGrades(): Observable<ApiResponse<GradeResponse[]>> {
    return this.http.get<ApiResponse<GradeResponse[]>>(`${this.apiUrl}/grades`);
  }

  getLeaveRequests(employeeId: number): Observable<ApiResponse<LeaveRequestResponse[]>> {
    return this.http.get<ApiResponse<LeaveRequestResponse[]>>(`${this.apiUrl}/leave-requests/employee/${employeeId}`);
  }
}

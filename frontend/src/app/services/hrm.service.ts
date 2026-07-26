import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  EmployeeResponse,
  EmployeeRequest,
  AttendanceResponse,
  DesignationResponse,
  DesignationRequest,
  GradeResponse,
  GradeRequest,
  LeaveRequestResponse,
  LeaveRequestDto,
  PromotionResponse,
  PromotionRequest,
  SeparationResponse,
  SeparationRequest,
  AppraisalResponse,
  AppraisalRequest,
  JobPostingResponse,
  JobPostingRequest,
  ApprovalWorkflowResponse,
  ApprovalStepActionRequest,
} from '../models/hrm.model';
import { ApiResponse } from '../models/common.model';

@Injectable({ providedIn: 'root' })
export class HrmService {
  private readonly apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<ApiResponse<EmployeeResponse[]>> {
    return this.http.get<ApiResponse<EmployeeResponse[]>>(`${this.apiUrl}/employees`);
  }

  getEmployeeById(id: number): Observable<ApiResponse<EmployeeResponse>> {
    return this.http.get<ApiResponse<EmployeeResponse>>(`${this.apiUrl}/employees/${id}`);
  }

  getMyEmployee(): Observable<ApiResponse<EmployeeResponse>> {
    return this.http.get<ApiResponse<EmployeeResponse>>(`${this.apiUrl}/employees/me`);
  }

  createEmployee(request: EmployeeRequest): Observable<ApiResponse<EmployeeResponse>> {
    return this.http.post<ApiResponse<EmployeeResponse>>(`${this.apiUrl}/employees`, request);
  }

  updateEmployee(id: number, request: EmployeeRequest): Observable<ApiResponse<EmployeeResponse>> {
    return this.http.put<ApiResponse<EmployeeResponse>>(`${this.apiUrl}/employees/${id}`, request);
  }

  deactivateEmployee(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/employees/${id}`);
  }

  getAttendance(employeeId: number, startDate: string, endDate: string): Observable<ApiResponse<AttendanceResponse[]>> {
    return this.http.get<ApiResponse<AttendanceResponse[]>>(
      `${this.apiUrl}/attendance/employee/${employeeId}?start=${startDate}&end=${endDate}`
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

  createDesignation(request: DesignationRequest): Observable<ApiResponse<DesignationResponse>> {
    return this.http.post<ApiResponse<DesignationResponse>>(`${this.apiUrl}/designations`, request);
  }

  updateDesignation(id: number, request: DesignationRequest): Observable<ApiResponse<DesignationResponse>> {
    return this.http.put<ApiResponse<DesignationResponse>>(`${this.apiUrl}/designations/${id}`, request);
  }

  deleteDesignation(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/designations/${id}`);
  }

  getGrades(): Observable<ApiResponse<GradeResponse[]>> {
    return this.http.get<ApiResponse<GradeResponse[]>>(`${this.apiUrl}/grades`);
  }

  createGrade(request: GradeRequest): Observable<ApiResponse<GradeResponse>> {
    return this.http.post<ApiResponse<GradeResponse>>(`${this.apiUrl}/grades`, request);
  }

  updateGrade(id: number, request: GradeRequest): Observable<ApiResponse<GradeResponse>> {
    return this.http.put<ApiResponse<GradeResponse>>(`${this.apiUrl}/grades/${id}`, request);
  }

  getLeaveRequests(employeeId: number): Observable<ApiResponse<LeaveRequestResponse[]>> {
    return this.http.get<ApiResponse<LeaveRequestResponse[]>>(`${this.apiUrl}/leave-requests/employee/${employeeId}`);
  }

  createLeaveRequest(request: LeaveRequestDto): Observable<ApiResponse<LeaveRequestResponse>> {
    return this.http.post<ApiResponse<LeaveRequestResponse>>(`${this.apiUrl}/leave-requests`, request);
  }

  approveLeaveRequest(id: number): Observable<ApiResponse<LeaveRequestResponse>> {
    return this.http.post<ApiResponse<LeaveRequestResponse>>(`${this.apiUrl}/leave-requests/${id}/approve`, {});
  }

  rejectLeaveRequest(id: number): Observable<ApiResponse<LeaveRequestResponse>> {
    return this.http.post<ApiResponse<LeaveRequestResponse>>(`${this.apiUrl}/leave-requests/${id}/reject`, {});
  }

  createPromotion(request: PromotionRequest): Observable<ApiResponse<PromotionResponse>> {
    return this.http.post<ApiResponse<PromotionResponse>>(`${this.apiUrl}/promotions`, request);
  }

  getPromotions(employeeId: number): Observable<ApiResponse<PromotionResponse[]>> {
    return this.http.get<ApiResponse<PromotionResponse[]>>(`${this.apiUrl}/promotions/employee/${employeeId}`);
  }

  createSeparation(request: SeparationRequest): Observable<ApiResponse<SeparationResponse>> {
    return this.http.post<ApiResponse<SeparationResponse>>(`${this.apiUrl}/separations`, request);
  }

  createAppraisal(request: AppraisalRequest): Observable<ApiResponse<AppraisalResponse>> {
    return this.http.post<ApiResponse<AppraisalResponse>>(`${this.apiUrl}/appraisals`, request);
  }

  getAppraisals(employeeId: number): Observable<ApiResponse<AppraisalResponse[]>> {
    return this.http.get<ApiResponse<AppraisalResponse[]>>(`${this.apiUrl}/appraisals/employee/${employeeId}`);
  }

  createJobPosting(request: JobPostingRequest): Observable<ApiResponse<JobPostingResponse>> {
    return this.http.post<ApiResponse<JobPostingResponse>>(`${this.apiUrl}/job-postings`, request);
  }

  getJobPostings(): Observable<ApiResponse<JobPostingResponse[]>> {
    return this.http.get<ApiResponse<JobPostingResponse[]>>(`${this.apiUrl}/job-postings`);
  }

  approveApprovalStep(request: ApprovalStepActionRequest): Observable<ApiResponse<ApprovalWorkflowResponse>> {
    return this.http.post<ApiResponse<ApprovalWorkflowResponse>>(`${this.apiUrl}/approval-workflows/approve`, request);
  }

  getApprovalWorkflows(): Observable<ApiResponse<ApprovalWorkflowResponse[]>> {
    return this.http.get<ApiResponse<ApprovalWorkflowResponse[]>>(`${this.apiUrl}/approval-workflows`);
  }
}

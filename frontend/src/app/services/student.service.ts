import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StudentResponse, StudentRequest, YearResultResponse } from '../models/student.model';
import { ApiResponse } from '../models/common.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<ApiResponse<StudentResponse>> {
    return this.http.get<ApiResponse<StudentResponse>>(`${this.apiUrl}/${id}`);
  }

  getByUserId(userId: number): Observable<ApiResponse<StudentResponse>> {
    return this.http.get<ApiResponse<StudentResponse>>(`${this.apiUrl}/user/${userId}`);
  }

  getByRegistrationNumber(regNo: string): Observable<ApiResponse<StudentResponse>> {
    return this.http.get<ApiResponse<StudentResponse>>(`${this.apiUrl}/registration/${regNo}`);
  }

  listAll(page = 0, size = 20): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  updateProfile(id: number, request: StudentRequest): Observable<ApiResponse<StudentResponse>> {
    return this.http.put<ApiResponse<StudentResponse>>(`${this.apiUrl}/${id}/profile`, request);
  }

  deactivate(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  getYearResults(studentId: number): Observable<ApiResponse<YearResultResponse[]>> {
    return this.http.get<ApiResponse<YearResultResponse[]>>(`${environment.apiUrl}/year-results/student/${studentId}`);
  }

  enroll(applicantId: number): Observable<ApiResponse<StudentResponse>> {
    return this.http.post<ApiResponse<StudentResponse>>(`${this.apiUrl}/enroll/${applicantId}`, {});
  }
}

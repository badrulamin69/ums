import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AcademicSessionResponse,
  AcademicSessionRequest,
  CourseResponse,
  CourseRequest,
  CourseTeacherResponse,
  CourseTeacherRequest,
  YearLevelResponse,
  YearLevelRequest,
  StudentResultResponse,
  StudentResultRequest,
} from '../models/academic.model';
import { ApiResponse } from '../models/common.model';

@Injectable({ providedIn: 'root' })
export class AcademicService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAcademicSessions(): Observable<ApiResponse<AcademicSessionResponse[]>> {
    return this.http.get<ApiResponse<AcademicSessionResponse[]>>(`${this.apiUrl}/academic-sessions`);
  }

  getActiveSession(): Observable<ApiResponse<AcademicSessionResponse>> {
    return this.http.get<ApiResponse<AcademicSessionResponse>>(`${this.apiUrl}/academic-sessions/active`);
  }

  createAcademicSession(request: AcademicSessionRequest): Observable<ApiResponse<AcademicSessionResponse>> {
    return this.http.post<ApiResponse<AcademicSessionResponse>>(`${this.apiUrl}/academic-sessions`, request);
  }

  updateAcademicSession(id: number, request: AcademicSessionRequest): Observable<ApiResponse<AcademicSessionResponse>> {
    return this.http.put<ApiResponse<AcademicSessionResponse>>(`${this.apiUrl}/academic-sessions/${id}`, request);
  }

  getCourses(): Observable<ApiResponse<CourseResponse[]>> {
    return this.http.get<ApiResponse<CourseResponse[]>>(`${this.apiUrl}/courses`);
  }

  getCourseById(id: number): Observable<ApiResponse<CourseResponse>> {
    return this.http.get<ApiResponse<CourseResponse>>(`${this.apiUrl}/courses/${id}`);
  }

  getCoursesByYearLevel(yearLevelId: number): Observable<ApiResponse<CourseResponse[]>> {
    return this.http.get<ApiResponse<CourseResponse[]>>(`${this.apiUrl}/courses/year-level/${yearLevelId}`);
  }

  getCoursesByDepartment(departmentId: number): Observable<ApiResponse<CourseResponse[]>> {
    return this.http.get<ApiResponse<CourseResponse[]>>(`${this.apiUrl}/courses/department/${departmentId}`);
  }

  createCourse(request: CourseRequest): Observable<ApiResponse<CourseResponse>> {
    return this.http.post<ApiResponse<CourseResponse>>(`${this.apiUrl}/courses`, request);
  }

  updateCourse(id: number, request: CourseRequest): Observable<ApiResponse<CourseResponse>> {
    return this.http.put<ApiResponse<CourseResponse>>(`${this.apiUrl}/courses/${id}`, request);
  }

  getCourseTeachers(): Observable<ApiResponse<CourseTeacherResponse[]>> {
    return this.http.get<ApiResponse<CourseTeacherResponse[]>>(`${this.apiUrl}/course-teachers`);
  }

  getCourseTeachersBySession(sessionId: number): Observable<ApiResponse<CourseTeacherResponse[]>> {
    return this.http.get<ApiResponse<CourseTeacherResponse[]>>(`${this.apiUrl}/course-teachers/session/${sessionId}`);
  }

  assignCourseTeacher(request: CourseTeacherRequest): Observable<ApiResponse<CourseTeacherResponse>> {
    return this.http.post<ApiResponse<CourseTeacherResponse>>(`${this.apiUrl}/course-teachers`, request);
  }

  removeCourseTeacher(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/course-teachers/${id}`);
  }

  getYearLevelsByDepartment(departmentId: number): Observable<ApiResponse<YearLevelResponse[]>> {
    return this.http.get<ApiResponse<YearLevelResponse[]>>(`${this.apiUrl}/year-levels/department/${departmentId}`);
  }

  createYearLevel(request: YearLevelRequest): Observable<ApiResponse<YearLevelResponse>> {
    return this.http.post<ApiResponse<YearLevelResponse>>(`${this.apiUrl}/year-levels`, request);
  }

  getStudentResults(studentId: number, sessionId: number): Observable<ApiResponse<StudentResultResponse[]>> {
    return this.http.get<ApiResponse<StudentResultResponse[]>>(`${this.apiUrl}/student-results/student/${studentId}/session/${sessionId}`);
  }

  getCourseResults(courseId: number, sessionId: number): Observable<ApiResponse<StudentResultResponse[]>> {
    return this.http.get<ApiResponse<StudentResultResponse[]>>(`${this.apiUrl}/student-results/course/${courseId}/session/${sessionId}`);
  }

  enterResult(request: StudentResultRequest): Observable<ApiResponse<StudentResultResponse>> {
    return this.http.post<ApiResponse<StudentResultResponse>>(`${this.apiUrl}/student-results`, request);
  }

  publishResults(studentId: number, sessionId: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/student-results/publish/student/${studentId}/session/${sessionId}`, {});
  }
}

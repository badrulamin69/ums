import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  FacultyResponse,
  DepartmentResponse,
  AdmissionCircularResponse,
  ApplicantResponse,
  ApplicantRequest,
  MeritListResponse,
  SscResultResponse,
  HscResultResponse,
  AdmitCardResponse,
  ApplicantDocumentResponse,
  DocumentTypeResponse,
} from '../models/admission.model';
import { ApiResponse } from '../models/common.model';
import { EncryptionService } from './encryption.service';

@Injectable({ providedIn: 'root' })
export class AdmissionService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private encryption: EncryptionService) {}

  getFaculties(): Observable<ApiResponse<FacultyResponse[]>> {
    return this.http.get<ApiResponse<FacultyResponse[]>>(`${this.apiUrl}/faculties/active`);
  }

  getFacultyById(id: number): Observable<ApiResponse<FacultyResponse>> {
    return this.http.get<ApiResponse<FacultyResponse>>(`${this.apiUrl}/faculties/${id}`);
  }

  getDepartmentsByFaculty(facultyId: number): Observable<ApiResponse<DepartmentResponse[]>> {
    return this.http.get<ApiResponse<DepartmentResponse[]>>(`${this.apiUrl}/departments/faculty/${facultyId}`);
  }

  getAllDepartments(): Observable<ApiResponse<DepartmentResponse[]>> {
    return this.http.get<ApiResponse<DepartmentResponse[]>>(`${this.apiUrl}/departments`);
  }

  getAdmissionCirculars(): Observable<ApiResponse<AdmissionCircularResponse[]>> {
    return this.http.get<ApiResponse<AdmissionCircularResponse[]>>(`${this.apiUrl}/admission-circulars`);
  }

  getAdmissionCircularById(id: number): Observable<ApiResponse<AdmissionCircularResponse>> {
    return this.http.get<ApiResponse<AdmissionCircularResponse>>(`${this.apiUrl}/admission-circulars/${id}`);
  }

  registerApplicant(request: ApplicantRequest): Observable<ApiResponse<ApplicantResponse>> {
    const encrypted = this.encryption.encryptSensitiveFields(request as any);
    return this.http.post<ApiResponse<ApplicantResponse>>(`${this.apiUrl}/applicants`, encrypted);
  }

  getApplicantById(id: number): Observable<ApiResponse<ApplicantResponse>> {
    return this.http.get<ApiResponse<ApplicantResponse>>(`${this.apiUrl}/applicants/${id}`);
  }

  getMyProfile(): Observable<ApiResponse<ApplicantResponse>> {
    return this.http.get<ApiResponse<ApplicantResponse>>(`${this.apiUrl}/applicants/me`);
  }

  getMeritList(circularId: number): Observable<ApiResponse<MeritListResponse[]>> {
    return this.http.get<ApiResponse<MeritListResponse[]>>(`${this.apiUrl}/merit-lists/circular/${circularId}`);
  }

  getAdmitCard(applicantId: number): Observable<ApiResponse<AdmitCardResponse>> {
    return this.http.get<ApiResponse<AdmitCardResponse>>(`${this.apiUrl}/admit-cards/applicant/${applicantId}`);
  }

  getHscResults(applicantId: number): Observable<ApiResponse<HscResultResponse>> {
    return this.http.get<ApiResponse<HscResultResponse>>(`${this.apiUrl}/applicants/${applicantId}/hsc-results`);
  }

  getDocumentTypes(): Observable<ApiResponse<DocumentTypeResponse[]>> {
    return this.http.get<ApiResponse<DocumentTypeResponse[]>>(`${this.apiUrl}/document-types`);
  }

  getApplicantDocuments(applicantId: number): Observable<ApiResponse<ApplicantDocumentResponse[]>> {
    return this.http.get<ApiResponse<ApplicantDocumentResponse[]>>(`${this.apiUrl}/applicants/${applicantId}/documents`);
  }
}

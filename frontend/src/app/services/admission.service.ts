import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  FacultyResponse,
  FacultyRequest,
  DepartmentResponse,
  DepartmentRequest,
  AdmissionCircularResponse,
  AdmissionCircularRequest,
  ApplicantResponse,
  ApplicantRequest,
  MeritListResponse,
  SscResultResponse,
  SscResultRequest,
  HscResultResponse,
  HscResultRequest,
  AdmitCardResponse,
  ApplicantDocumentResponse,
  ApplicantDocumentRequest,
  DocumentTypeResponse,
  DocumentTypeRequest,
} from '../models/admission.model';
import { ApiResponse } from '../models/common.model';

@Injectable({ providedIn: 'root' })
export class AdmissionService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getFaculties(): Observable<ApiResponse<FacultyResponse[]>> {
    return this.http.get<ApiResponse<FacultyResponse[]>>(`${this.apiUrl}/faculties/active`);
  }

  getFacultyById(id: number): Observable<ApiResponse<FacultyResponse>> {
    return this.http.get<ApiResponse<FacultyResponse>>(`${this.apiUrl}/faculties/${id}`);
  }

  createFaculty(request: FacultyRequest): Observable<ApiResponse<FacultyResponse>> {
    return this.http.post<ApiResponse<FacultyResponse>>(`${this.apiUrl}/faculties`, request);
  }

  updateFaculty(id: number, request: FacultyRequest): Observable<ApiResponse<FacultyResponse>> {
    return this.http.put<ApiResponse<FacultyResponse>>(`${this.apiUrl}/faculties/${id}`, request);
  }

  getDepartmentsByFaculty(facultyId: number): Observable<ApiResponse<DepartmentResponse[]>> {
    return this.http.get<ApiResponse<DepartmentResponse[]>>(`${this.apiUrl}/departments/faculty/${facultyId}`);
  }

  getAllDepartments(): Observable<ApiResponse<DepartmentResponse[]>> {
    return this.http.get<ApiResponse<DepartmentResponse[]>>(`${this.apiUrl}/departments`);
  }

  createDepartment(request: DepartmentRequest): Observable<ApiResponse<DepartmentResponse>> {
    return this.http.post<ApiResponse<DepartmentResponse>>(`${this.apiUrl}/departments`, request);
  }

  updateDepartment(id: number, request: DepartmentRequest): Observable<ApiResponse<DepartmentResponse>> {
    return this.http.put<ApiResponse<DepartmentResponse>>(`${this.apiUrl}/departments/${id}`, request);
  }

  getAdmissionCirculars(): Observable<ApiResponse<AdmissionCircularResponse[]>> {
    return this.http.get<ApiResponse<AdmissionCircularResponse[]>>(`${this.apiUrl}/admission-circulars`);
  }

  getAdmissionCircularById(id: number): Observable<ApiResponse<AdmissionCircularResponse>> {
    return this.http.get<ApiResponse<AdmissionCircularResponse>>(`${this.apiUrl}/admission-circulars/${id}`);
  }

  createAdmissionCircular(request: AdmissionCircularRequest): Observable<ApiResponse<AdmissionCircularResponse>> {
    return this.http.post<ApiResponse<AdmissionCircularResponse>>(`${this.apiUrl}/admission-circulars`, request);
  }

  updateAdmissionCircular(id: number, request: AdmissionCircularRequest): Observable<ApiResponse<AdmissionCircularResponse>> {
    return this.http.put<ApiResponse<AdmissionCircularResponse>>(`${this.apiUrl}/admission-circulars/${id}`, request);
  }

  registerApplicant(request: ApplicantRequest): Observable<ApiResponse<ApplicantResponse>> {
    return this.http.post<ApiResponse<ApplicantResponse>>(`${this.apiUrl}/applicants`, request);
  }

  getApplicantById(id: number): Observable<ApiResponse<ApplicantResponse>> {
    return this.http.get<ApiResponse<ApplicantResponse>>(`${this.apiUrl}/applicants/${id}`);
  }

  getMyProfile(): Observable<ApiResponse<ApplicantResponse>> {
    return this.http.get<ApiResponse<ApplicantResponse>>(`${this.apiUrl}/applicants/me`);
  }

  getApplicantsByCircular(circularId: number): Observable<ApiResponse<ApplicantResponse[]>> {
    return this.http.get<ApiResponse<ApplicantResponse[]>>(`${this.apiUrl}/applicants/circular/${circularId}`);
  }

  getByApplicationNumber(applicationNumber: string): Observable<ApiResponse<ApplicantResponse>> {
    return this.http.get<ApiResponse<ApplicantResponse>>(`${this.apiUrl}/applicants/application/${applicationNumber}`);
  }

  getMeritList(circularId: number): Observable<ApiResponse<MeritListResponse[]>> {
    return this.http.get<ApiResponse<MeritListResponse[]>>(`${this.apiUrl}/merit-lists/circular/${circularId}`);
  }

  getAdmitCard(applicantId: number): Observable<ApiResponse<AdmitCardResponse>> {
    return this.http.get<ApiResponse<AdmitCardResponse>>(`${this.apiUrl}/admit-cards/applicant/${applicantId}`);
  }

  getSscResults(applicantId: number): Observable<ApiResponse<SscResultResponse>> {
    return this.http.get<ApiResponse<SscResultResponse>>(`${this.apiUrl}/applicants/${applicantId}/ssc-results`);
  }

  createSscResult(applicantId: number, request: SscResultRequest): Observable<ApiResponse<SscResultResponse>> {
    return this.http.post<ApiResponse<SscResultResponse>>(`${this.apiUrl}/applicants/${applicantId}/ssc-results`, request);
  }

  getHscResults(applicantId: number): Observable<ApiResponse<HscResultResponse>> {
    return this.http.get<ApiResponse<HscResultResponse>>(`${this.apiUrl}/applicants/${applicantId}/hsc-results`);
  }

  createHscResult(applicantId: number, request: HscResultRequest): Observable<ApiResponse<HscResultResponse>> {
    return this.http.post<ApiResponse<HscResultResponse>>(`${this.apiUrl}/applicants/${applicantId}/hsc-results`, request);
  }

  getDocumentTypes(): Observable<ApiResponse<DocumentTypeResponse[]>> {
    return this.http.get<ApiResponse<DocumentTypeResponse[]>>(`${this.apiUrl}/document-types`);
  }

  createDocumentType(request: DocumentTypeRequest): Observable<ApiResponse<DocumentTypeResponse>> {
    return this.http.post<ApiResponse<DocumentTypeResponse>>(`${this.apiUrl}/document-types`, request);
  }

  getApplicantDocuments(applicantId: number): Observable<ApiResponse<ApplicantDocumentResponse[]>> {
    return this.http.get<ApiResponse<ApplicantDocumentResponse[]>>(`${this.apiUrl}/applicant-documents/applicant/${applicantId}`);
  }

  uploadApplicantDocument(request: ApplicantDocumentRequest): Observable<ApiResponse<ApplicantDocumentResponse>> {
    return this.http.post<ApiResponse<ApplicantDocumentResponse>>(`${this.apiUrl}/applicant-documents`, request);
  }
}

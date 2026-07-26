import { AdmissionStatus, Gender } from './common.model';

export interface FacultyResponse {
  id: number;
  name: string;
  code: string;
  description: string;
  active: boolean;
}

export interface FacultyRequest {
  name: string;
  code: string;
  description: string;
}

export interface DepartmentResponse {
  id: number;
  name: string;
  code: string;
  facultyId: number;
  facultyName: string;
  active: boolean;
}

export interface DepartmentRequest {
  facultyId: number;
  name: string;
  code: string;
}

export interface AdmissionCircularResponse {
  id: number;
  title: string;
  session: string;
  facultyId: number;
  facultyName: string;
  registrationStartDate: string;
  registrationEndDate: string;
  applicationFee: number;
  totalSeats: number;
  active: boolean;
}

export interface AdmissionCircularRequest {
  title: string;
  session: string;
  facultyId: number;
  registrationStartDate: string;
  registrationEndDate: string;
  applicationFee: number;
  totalSeats: number;
}

export interface ApplicantResponse {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  gender: Gender;
  dateOfBirth: string;
  address: string;
  circularId: number;
  circularTitle: string;
  preferredDepartmentId: number;
  preferredDepartmentName: string;
  status: AdmissionStatus;
  emailVerified: boolean;
  paymentCompleted: boolean;
  applicationNumber: string;
  meritScore: number;
}

export interface ApplicantRequest {
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  gender: Gender;
  dateOfBirth: string;
  address: string;
  circularId: number;
  preferredDepartmentId: number;
}

export interface SscResultResponse {
  id: number;
  applicantId: number;
  board: string;
  examYear: number;
  rollNumber: string;
  registrationNumber: string;
  group: string;
  institution: string;
  gpa: number;
  scienceGpa: number;
  mathGpa: number;
  verified: boolean;
}

export interface HscResultResponse {
  id: number;
  applicantId: number;
  board: string;
  examYear: number;
  rollNumber: string;
  registrationNumber: string;
  group: string;
  institution: string;
  gpa: number;
  scienceGpa: number;
  mathGpa: number;
  verified: boolean;
}

export interface MeritListResponse {
  id: number;
  circularId: number;
  departmentId: number;
  departmentName: string;
  applicantId: number;
  applicantName: string;
  applicationNumber: string;
  meritScore: number;
  meritPosition: number;
  published: boolean;
}

export interface AdmitCardResponse {
  id: number;
  applicantId: number;
  applicationNumber: string;
  admitCardNumber: string;
  examDate: string;
  examCenter: string;
  downloaded: boolean;
}

export interface DocumentTypeResponse {
  id: number;
  name: string;
  description: string;
  required: boolean;
  allowedFormats: string;
  active: boolean;
}

export interface ApplicantDocumentResponse {
  id: number;
  applicantId: number;
  documentType: string;
  fileName: string;
  fileUrl: string;
  verified: boolean;
}

export interface HscResultRequest {
  board: string;
  examYear: number;
  rollNumber: string;
  registrationNumber: string;
  group: string;
  institution: string;
  gpa: number;
  scienceGpa: number;
  mathGpa: number;
}

export interface SscResultRequest {
  board: string;
  examYear: number;
  rollNumber: string;
  registrationNumber: string;
  group: string;
  institution: string;
  gpa: number;
  scienceGpa: number;
  mathGpa: number;
}

export interface DocumentTypeRequest {
  name: string;
  description: string;
  required: boolean;
  allowedFormats: string;
}

export interface ApplicantDocumentRequest {
  applicantId: number;
  documentType: string;
  fileName: string;
  fileUrl: string;
}

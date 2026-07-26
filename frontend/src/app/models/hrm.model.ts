import { EmployeeType, Gender, ApprovalStatus } from './common.model';

export interface EmployeeResponse {
  id: number;
  userId: number;
  employeeId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  gender: Gender;
  dateOfBirth: string;
  employeeType: EmployeeType;
  designationId: number;
  designationName: string;
  gradeId: number;
  gradeName: string;
  department: string;
  active: boolean;
}

export interface EmployeeRequest {
  userId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  gender: Gender;
  dateOfBirth: string;
  employeeType: EmployeeType;
  designationId: number;
  gradeId: number;
  department: string;
}

export interface DesignationResponse {
  id: number;
  name: string;
  description: string;
  level: number;
  active: boolean;
}

export interface DesignationRequest {
  name: string;
  description: string;
  level: number;
}

export interface GradeResponse {
  id: number;
  name: string;
  basicSalary: number;
  houseAllowance: number;
  medicalAllowance: number;
  transportAllowance: number;
  active: boolean;
}

export interface GradeRequest {
  name: string;
  basicSalary: number;
  houseAllowance: number;
  medicalAllowance: number;
  transportAllowance: number;
}

export interface AttendanceResponse {
  id: number;
  employeeId: number;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  status: string;
}

export interface AttendanceRequest {
  employeeId: number;
  checkInTime: string;
  checkOutTime: string;
}

export interface LeaveRequestResponse {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: string;
}

export interface LeaveRequestDto {
  employeeId: number;
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface PromotionResponse {
  id: number;
  employeeId: number;
  employeeName: string;
  fromDesignation: string;
  toDesignation: string;
  fromGrade: string;
  toGrade: string;
  type: string;
  effectiveDate: string;
  remarks: string;
}

export interface PromotionRequest {
  employeeId: number;
  fromDesignationId: number;
  toDesignationId: number;
  fromGradeId: number;
  toGradeId: number;
  type: string;
  effectiveDate: string;
  remarks: string;
}

export interface SeparationResponse {
  id: number;
  employeeId: number;
  employeeName: string;
  type: string;
  effectiveDate: string;
  reason: string;
  approved: boolean;
}

export interface SeparationRequest {
  employeeId: number;
  type: string;
  effectiveDate: string;
  reason: string;
}

export interface AppraisalResponse {
  id: number;
  employeeId: number;
  employeeName: string;
  appraisalDate: string;
  reviewYear: number;
  rating: string;
  comments: string;
  reviewerId: number;
  reviewerName: string;
}

export interface AppraisalRequest {
  employeeId: number;
  appraisalDate: string;
  reviewYear: number;
  rating: string;
  comments: string;
  reviewerId: number;
}

export interface JobPostingResponse {
  id: number;
  title: string;
  description: string;
  department: string;
  vacancies: number;
  postingDate: string;
  closingDate: string;
  active: boolean;
}

export interface JobPostingRequest {
  title: string;
  description: string;
  department: string;
  vacancies: number;
  postingDate: string;
  closingDate: string;
}

export interface InterviewResponse {
  id: number;
  jobApplicationId: number;
  scheduledAt: string;
  location: string;
  notes: string;
  completed: boolean;
  score: number;
}

export interface ApprovalWorkflowResponse {
  id: number;
  entityType: string;
  entityId: number;
  name: string;
  status: string;
  steps: ApprovalStepResponse[];
}

export interface ApprovalStepResponse {
  id: number;
  workflowId: number;
  stepOrder: number;
  approverRole: string;
  approverId: number;
  status: string;
  comments: string;
  decidedAt: string;
}

export interface ApprovalStepActionRequest {
  stepId: number;
  action: string;
  comments: string;
}

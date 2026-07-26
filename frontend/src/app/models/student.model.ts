export interface StudentResponse {
  id: number;
  userId: number;
  applicantId: number;
  registrationNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  cgpa: number;
  active: boolean;
}

export interface StudentRequest {
  firstName: string;
  middleName: string;
  lastName: string;
}

export interface YearResultResponse {
  yearNumber: number;
  academicSessionName: string;
  gpa: number;
  totalCreditHours: number;
}

export interface CourseResultResponse {
  courseCode: string;
  courseName: string;
  creditHours: number;
  grade: string;
  gradePoint: number;
}

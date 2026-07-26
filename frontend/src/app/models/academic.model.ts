export interface AcademicSessionResponse {
  id: number;
  name: string;
  startYear: number;
  endYear: number;
  active: boolean;
}

export interface AcademicSessionRequest {
  name: string;
  startYear: number;
  endYear: number;
}

export interface CourseResponse {
  id: number;
  courseCode: string;
  name: string;
  creditHours: number;
  yearLevelId: number;
  yearNumber: number;
  active: boolean;
}

export interface CourseRequest {
  courseCode: string;
  name: string;
  creditHours: number;
  yearLevelId: number;
}

export interface CourseTeacherResponse {
  id: number;
  courseId: number;
  courseName: string;
  courseCode: string;
  employeeId: number;
  employeeName: string;
  academicSessionId: number;
  academicSessionName: string;
}

export interface CourseTeacherRequest {
  courseId: number;
  employeeId: number;
  academicSessionId: number;
}

export interface YearLevelResponse {
  id: number;
  yearNumber: number;
  name: string;
  departmentId: number;
  departmentName: string;
}

export interface YearLevelRequest {
  departmentId: number;
  yearNumber: number;
  name: string;
}

export interface StudentResultResponse {
  id: number;
  studentId: number;
  studentName: string;
  courseId: number;
  courseName: string;
  courseCode: string;
  academicSessionId: number;
  academicSessionName: string;
  gradePoint: number;
  creditHours: number;
  letterGrade: string;
  published: boolean;
}

export interface StudentResultRequest {
  studentId: number;
  courseId: number;
  academicSessionId: number;
  gradePoint: number;
  creditHours: number;
  letterGrade: string;
}

export interface YearResultResponse {
  id: number;
  studentId: number;
  yearLevelId: number;
  yearNumber: number;
  academicSessionId: number;
  academicSessionName: string;
  gpa: number;
  totalCreditHours: number;
}

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'HR', 'PAYROLL'] },
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'faculties',
        loadComponent: () =>
          import('./features/admin/faculty/faculty-list.component').then((m) => m.FacultyListComponent),
      },
      {
        path: 'departments',
        loadComponent: () =>
          import('./features/admin/department/department-list.component').then((m) => m.DepartmentListComponent),
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./features/admin/student/student-list.component').then((m) => m.StudentListComponent),
      },
      {
        path: 'document-types',
        loadComponent: () =>
          import('./features/admin/document-type/document-type-list.component').then((m) => m.DocumentTypeListComponent),
      },
      {
        path: 'grades',
        loadComponent: () =>
          import('./features/admin/grade/grade-list.component').then((m) => m.GradeListComponent),
      },
      {
        path: 'designations',
        loadComponent: () =>
          import('./features/admin/designation/designation-list.component').then((m) => m.DesignationListComponent),
      },
      {
        path: 'academic-sessions',
        loadComponent: () =>
          import('./features/admin/academic-session/academic-session-list.component').then((m) => m.AcademicSessionListComponent),
      },
      {
        path: 'audit-logs',
        loadComponent: () =>
          import('./features/admin/audit-log/audit-log-list.component').then((m) => m.AuditLogListComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'admission',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'ADMISSION'] },
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: 'circulars',
        loadComponent: () =>
          import('./features/admission/circulars/circular-list.component').then((m) => m.CircularListComponent),
      },
      {
        path: 'applicants',
        loadComponent: () =>
          import('./features/admission/applicants/applicant-list.component').then((m) => m.ApplicantListComponent),
      },
      {
        path: 'merit-lists',
        loadComponent: () =>
          import('./features/admission/merit-list/merit-list.component').then((m) => m.MeritListPageComponent),
      },
      { path: '', redirectTo: 'circulars', pathMatch: 'full' },
    ],
  },
  {
    path: 'student',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['STUDENT'] },
    loadComponent: () =>
      import('./layouts/student-layout/student-layout.component').then((m) => m.StudentLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/student/dashboard/student-dashboard.component').then((m) => m.StudentDashboardComponent),
      },
      {
        path: 'face',
        loadComponent: () =>
          import('./features/student/face-verification/student-face.component').then((m) => m.StudentFaceComponent),
      },
      {
        path: 'results',
        loadComponent: () =>
          import('./features/student/results/student-results-view.component').then((m) => m.StudentResultsViewComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/student/profile/student-profile.component').then((m) => m.StudentProfileComponent),
      },
      {
        path: 'attendance',
        loadComponent: () =>
          import('./features/student/attendance/student-attendance.component').then((m) => m.StudentAttendanceComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'academic',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'FACULTY'] },
    loadComponent: () =>
      import('./layouts/faculty-layout/faculty-layout.component').then((m) => m.FacultyLayoutComponent),
    children: [
      {
        path: 'courses',
        loadComponent: () =>
          import('./features/academic/courses/course-list.component').then((m) => m.CourseListComponent),
      },
      {
        path: 'student-results',
        loadComponent: () =>
          import('./features/academic/student-results/student-result-list.component').then((m) => m.StudentResultListComponent),
      },
      {
        path: 'course-teachers',
        loadComponent: () =>
          import('./features/academic/course-teachers/course-teacher-list.component').then((m) => m.CourseTeacherListComponent),
      },
      { path: '', redirectTo: 'courses', pathMatch: 'full' },
    ],
  },
  {
    path: 'hrm',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'HR'] },
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: 'employees',
        loadComponent: () =>
          import('./features/hrm/employees/employee-list.component').then((m) => m.EmployeeListComponent),
      },
      {
        path: 'employees/:id',
        loadComponent: () =>
          import('./features/hrm/employees/employee-detail.component').then((m) => m.EmployeeDetailComponent),
      },
      {
        path: 'attendance',
        loadComponent: () =>
          import('./features/hrm/attendance/attendance.component').then((m) => m.AttendanceComponent),
      },
      {
        path: 'leave',
        loadComponent: () =>
          import('./features/hrm/leave/leave-list.component').then((m) => m.LeaveListComponent),
      },
      {
        path: 'face',
        loadComponent: () =>
          import('./features/hrm/face-verification/employee-face.component').then((m) => m.EmployeeFaceComponent),
      },
      {
        path: 'promotions',
        loadComponent: () =>
          import('./features/hrm/promotions/promotion-list.component').then((m) => m.PromotionListComponent),
      },
      {
        path: 'separations',
        loadComponent: () =>
          import('./features/hrm/separations/separation-list.component').then((m) => m.SeparationListComponent),
      },
      {
        path: 'job-postings',
        loadComponent: () =>
          import('./features/hrm/job-postings/job-posting-list.component').then((m) => m.JobPostingListComponent),
      },
      {
        path: 'appraisals',
        loadComponent: () =>
          import('./features/hrm/appraisals/appraisal-list.component').then((m) => m.AppraisalListComponent),
      },
      {
        path: 'approval-workflows',
        loadComponent: () =>
          import('./features/hrm/approval-workflow/approval-workflow-list.component').then((m) => m.ApprovalWorkflowListComponent),
      },
      { path: '', redirectTo: 'employees', pathMatch: 'full' },
    ],
  },
  {
    path: 'payroll',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'PAYROLL'] },
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: 'run',
        loadComponent: () =>
          import('./features/payroll/run/payroll-run.component').then((m) => m.PayrollRunComponent),
      },
      {
        path: 'salary-structures',
        loadComponent: () =>
          import('./features/payroll/salary-structure/salary-structure-list.component').then((m) => m.SalaryStructureListComponent),
      },
      { path: '', redirectTo: 'run', pathMatch: 'full' },
    ],
  },
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/notifications/notifications-page.component').then((m) => m.NotificationsPageComponent),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];

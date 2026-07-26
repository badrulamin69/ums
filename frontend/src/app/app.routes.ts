import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { PublicLayoutComponent } from './layout/public-layout.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./pages/public/home/home.component').then(m => m.HomeComponent) },
      { path: 'faculties', loadComponent: () => import('./pages/public/faculties/faculties.component').then(m => m.FacultiesComponent) },
      { path: 'admission', loadComponent: () => import('./pages/public/admission/admission.component').then(m => m.AdmissionComponent) },
      { path: 'notices', loadComponent: () => import('./pages/public/notices/notices.component').then(m => m.NoticesComponent) },
      { path: 'contact', loadComponent: () => import('./pages/public/contact/contact.component').then(m => m.ContactComponent) },
      { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'unauthorized', loadComponent: () => import('./pages/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent) },
    ],
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/student/dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/student/dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent),
      },
      {
        path: 'notifications',
        loadComponent: () => import('./pages/student/dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent),
      },
      {
        path: 'apply/:circularId',
        loadComponent: () => import('./pages/applicant/apply/apply.component').then(m => m.ApplyComponent),
      },
      {
        path: 'applicant',
        loadComponent: () => import('./pages/applicant/dashboard/applicant-dashboard.component').then(m => m.ApplicantDashboardComponent),
        canActivate: [RoleGuard],
        data: { roles: ['APPLICANT'] },
      },
      {
        path: 'employees',
        loadComponent: () => import('./pages/hr/employees/employee-directory.component').then(m => m.EmployeeDirectoryComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'HR', 'REGISTRAR'] },
      },
      {
        path: 'attendance',
        loadComponent: () => import('./pages/hr/attendance/attendance.component').then(m => m.AttendanceComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'HR'] },
      },
      {
        path: 'payment',
        loadComponent: () => import('./pages/payment/payment.component').then(m => m.PaymentComponent),
      },
      {
        path: 'admin/faculties',
        loadComponent: () => import('./pages/admin/admission/faculties/faculties.component').then(m => m.AdminFacultiesComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'REGISTRAR'] },
      },
      {
        path: 'admin/departments',
        loadComponent: () => import('./pages/admin/admission/departments/departments.component').then(m => m.AdminDepartmentsComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'REGISTRAR'] },
      },
      {
        path: 'admin/circulars',
        loadComponent: () => import('./pages/admin/admission/circulars/circulars.component').then(m => m.AdminCircularsComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'ADMISSION'] },
      },
      {
        path: 'hr/designations',
        loadComponent: () => import('./pages/hr/designations/designations.component').then(m => m.DesignationsComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'HR'] },
      },
      {
        path: 'hr/grades',
        loadComponent: () => import('./pages/hr/grades/grades.component').then(m => m.GradesComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'HR'] },
      },
      {
        path: 'hr/job-postings',
        loadComponent: () => import('./pages/hr/job-postings/job-postings.component').then(m => m.JobPostingsComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'HR'] },
      },
      {
        path: 'academic/sessions',
        loadComponent: () => import('./pages/academic/sessions/sessions.component').then(m => m.SessionsComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'FACULTY', 'REGISTRAR'] },
      },
      {
        path: 'academic/courses',
        loadComponent: () => import('./pages/academic/courses/courses.component').then(m => m.CoursesComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'FACULTY', 'REGISTRAR'] },
      },
      {
        path: 'academic/course-teachers',
        loadComponent: () => import('./pages/academic/course-teachers/course-teachers.component').then(m => m.CourseTeachersComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'FACULTY', 'REGISTRAR'] },
      },
      {
        path: 'academic/year-levels',
        loadComponent: () => import('./pages/academic/year-levels/year-levels.component').then(m => m.YearLevelsComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'FACULTY', 'REGISTRAR'] },
      },
      {
        path: 'academic/results',
        loadComponent: () => import('./pages/academic/results/results.component').then(m => m.ResultsComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'FACULTY', 'REGISTRAR'] },
      },
      {
        path: 'payroll/salary-structures',
        loadComponent: () => import('./pages/payroll/salary-structures/salary-structures.component').then(m => m.SalaryStructuresComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'PAYROLL'] },
      },
      {
        path: 'payroll/runs',
        loadComponent: () => import('./pages/payroll/payroll-runs/payroll-runs.component').then(m => m.PayrollRunsComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'PAYROLL'] },
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

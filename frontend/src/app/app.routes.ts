import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { PublicLayoutComponent } from './layout/public-layout.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout.component';

// Known gap: academic (sessions/courses/results/year-levels), HR appraisal/promotion/
// separation/job-posting/approval-workflow, and payroll/salary-structure modules have
// zero frontend service or page coverage. They exist only as backend API endpoints.

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
      { path: 'register', loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent) },
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
    ],
  },
  { path: '**', redirectTo: '' },
];

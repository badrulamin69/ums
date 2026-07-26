import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../layout/navbar/navbar.component';
import { AuthService } from '../services/auth.service';
import { HasRoleDirective } from '../directives/has-role.directive';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, HasRoleDirective],
  template: `
    <div class="layout">
      <app-navbar />
      <div class="dashboard-shell">
        <aside class="sidebar">
          <nav class="sidebar-nav">
            <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Dashboard
            </a>
            <a routerLink="/profile" routerLinkActive="active">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Profile
            </a>
            <a routerLink="/notifications" routerLinkActive="active">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              Notifications
            </a>
            <a routerLink="/payment" routerLinkActive="active">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              Payments
            </a>
            <a routerLink="/applicant" routerLinkActive="active">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              My Application
            </a>
            <ng-container *appHasRole="['ADMIN', 'HR', 'REGISTRAR']">
              <a routerLink="/employees" routerLinkActive="active">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Employees
              </a>
              <a routerLink="/attendance" routerLinkActive="active">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Attendance
              </a>
            </ng-container>
            <ng-container *appHasRole="['ADMIN', 'REGISTRAR']">
              <div class="nav-section">Admission</div>
              <a routerLink="/admin/faculties" routerLinkActive="active">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                Faculties
              </a>
              <a routerLink="/admin/departments" routerLinkActive="active">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                Departments
              </a>
              <a routerLink="/admin/circulars" routerLinkActive="active">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                Circulars
              </a>
            </ng-container>
            <ng-container *appHasRole="['ADMIN', 'HR']">
              <div class="nav-section">HR Management</div>
              <a routerLink="/hr/designations" routerLinkActive="active">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M2 21h20"/></svg>
                Designations
              </a>
              <a routerLink="/hr/grades" routerLinkActive="active">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                Grades
              </a>
              <a routerLink="/hr/job-postings" routerLinkActive="active">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                Job Postings
              </a>
            </ng-container>
            <ng-container *appHasRole="['ADMIN', 'FACULTY', 'REGISTRAR']">
              <div class="nav-section">Academic</div>
              <a routerLink="/academic/sessions" routerLinkActive="active">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Sessions
              </a>
              <a routerLink="/academic/courses" routerLinkActive="active">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                Courses
              </a>
              <a routerLink="/academic/course-teachers" routerLinkActive="active">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Course Teachers
              </a>
              <a routerLink="/academic/year-levels" routerLinkActive="active">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                Year Levels
              </a>
              <a routerLink="/academic/results" routerLinkActive="active">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                Results
              </a>
            </ng-container>
            <ng-container *appHasRole="['ADMIN', 'PAYROLL']">
              <div class="nav-section">Payroll</div>
              <a routerLink="/payroll/salary-structures" routerLinkActive="active">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                Salary Structures
              </a>
              <a routerLink="/payroll/runs" routerLinkActive="active">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                Payroll Runs
              </a>
            </ng-container>
          </nav>
        </aside>
        <main class="dashboard-main">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .dashboard-shell {
      display: flex;
      flex: 1;
    }
    .sidebar {
      width: 220px;
      background: var(--bg-card);
      border-right: 1px solid var(--border-light);
      padding: 1.5rem 0;
      flex-shrink: 0;
      position: sticky;
      top: 64px;
      height: calc(100vh - 64px);
      overflow-y: auto;
    }
    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      padding: 0 0.75rem;
      .nav-section {
        font-size: 0.6875rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-muted);
        padding: 1rem 0.875rem 0.375rem;
      }
      a {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.625rem 0.875rem;
        border-radius: var(--radius);
        color: var(--text-secondary);
        font-size: 0.875rem;
        font-weight: 500;
        transition: all var(--transition);
        text-decoration: none;
        &:hover {
          background: var(--bg-page);
          color: var(--text-primary);
        }
        &.active {
          background: rgba(15, 42, 74, 0.08);
          color: var(--primary);
          font-weight: 600;
        }
      }
    }
    .dashboard-main {
      flex: 1;
      min-width: 0;
    }
    @media (max-width: 768px) {
      .sidebar { display: none; }
    }
  `],
})
export class DashboardLayoutComponent {
  constructor(public authService: AuthService) {}
}

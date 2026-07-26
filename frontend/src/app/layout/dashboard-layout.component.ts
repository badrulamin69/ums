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

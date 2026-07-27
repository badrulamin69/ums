import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed()">
      <div class="sidebar-brand">
        <div class="brand-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill="var(--color-gold)"/>
            <path d="M8 20V8l6 4-6 4zm6-8l6 4V8l-6 4z" fill="var(--color-obsidian)"/>
          </svg>
        </div>
        @if (!collapsed()) {
          <div class="brand-text">
            <span class="brand-name">Smart</span>
            <span class="brand-sub">University</span>
          </div>
        }
      </div>

      <nav class="sidebar-nav">
        @for (item of filteredMenuItems; track item.route) {
          <a class="nav-item"
             [routerLink]="item.route"
             routerLinkActive="active">
            <span class="nav-icon" [innerHTML]="item.icon"></span>
            @if (!collapsed()) {
              <span class="nav-label">{{ item.label }}</span>
            }
          </a>
        }
      </nav>

      <div class="sidebar-footer">
        <a class="nav-item" (click)="auth.logout()">
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M6.75 15.75h-3a1.5 1.5 0 01-1.5-1.5v-9a1.5 1.5 0 011.5-1.5h3m4.5-3l3 3-3 3m3-3H6.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          @if (!collapsed()) {
            <span class="nav-label">Sign Out</span>
          }
        </a>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: var(--sidebar-width);
      background: var(--color-surface);
      border-right: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      z-index: 200;
      transition: width var(--duration-normal) var(--ease-out);
      overflow: hidden;

      &.collapsed {
        width: var(--sidebar-collapsed);
      }
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem 1.25rem;
      border-bottom: 1px solid var(--color-border);
      min-height: var(--navbar-height);
    }

    .brand-icon {
      flex-shrink: 0;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
      white-space: nowrap;
    }

    .brand-name {
      font-family: var(--font-display);
      font-size: 1.125rem;
      color: var(--color-text-primary);
    }

    .brand-sub {
      font-size: var(--fs-xs);
      color: var(--color-text-muted);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .sidebar-nav {
      flex: 1;
      padding: 0.75rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.875rem;
      border-radius: var(--radius-sm);
      color: var(--color-text-secondary);
      text-decoration: none;
      font-size: var(--fs-small);
      font-weight: var(--fw-medium);
      cursor: pointer;
      transition: all var(--duration-fast) var(--ease-out);
      position: relative;
      white-space: nowrap;

      &:hover {
        background: var(--color-surface-elevated);
        color: var(--color-text-primary);
      }

      &.active {
        background: var(--color-gold-dim);
        color: var(--color-gold);

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 4px;
          bottom: 4px;
          width: 2px;
          background: var(--color-gold);
          border-radius: 0 2px 2px 0;
        }
      }
    }

    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .sidebar-footer {
      padding: 0.75rem;
      border-top: 1px solid var(--color-border);

      .nav-item:hover {
        color: var(--color-danger);
      }
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        &.mobile-open { transform: translateX(0); }
      }
    }
  `],
})
export class SidebarComponent {
  collapsed = input(false);

  private allMenuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2.25 9L9 2.25 15.75 9M3.75 7.5V14.25a.75.75 0 00.75.75H7.5V11.25h3V15h3a.75.75 0 00.75-.75V7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      route: '/admin/dashboard',
      roles: ['ADMIN', 'HR', 'PAYROLL'],
    },
    {
      label: 'Faculties',
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2.25 7.5l6.75-3.75L15.75 7.5M3.75 8.25v6m10.5-6v6M2.25 14.25h13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      route: '/admin/faculties',
      roles: ['ADMIN'],
    },
    {
      label: 'Departments',
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2.25 7.5l6.75-3.75L15.75 7.5M3.75 8.25v6m10.5-6v6M2.25 14.25h13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      route: '/admin/departments',
      roles: ['ADMIN'],
    },
    {
      label: 'Admission Circulars',
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13.5 1.5h-9a1.5 1.5 0 00-1.5 1.5v12a1.5 1.5 0 001.5 1.5h9a1.5 1.5 0 001.5-1.5V3a1.5 1.5 0 00-1.5-1.5zM6 6h6M6 9h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
      route: '/admission/circulars',
      roles: ['ADMIN', 'ADMISSION'],
    },
    {
      label: 'Applicants',
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M12.75 15.75v-1.5a3 3 0 00-3-3h-1.5a3 3 0 00-3 3v1.5m7.5-9a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
      route: '/admission/applicants',
      roles: ['ADMIN', 'ADMISSION'],
    },
    {
      label: 'Merit Lists',
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4.5 10.5l3 3 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="2.25" y="2.25" width="13.5" height="13.5" rx="1.5" stroke="currentColor" stroke-width="1.5"/></svg>',
      route: '/admission/merit-lists',
      roles: ['ADMIN', 'ADMISSION'],
    },
    {
      label: 'Students',
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M12.75 15.75v-1.5a3 3 0 00-3-3h-1.5a3 3 0 00-3 3v1.5m7.5-9a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
      route: '/admin/students',
      roles: ['ADMIN', 'REGISTRAR'],
    },
    {
      label: 'Employees',
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M12.75 15.75v-1.5a3 3 0 00-3-3h-1.5a3 3 0 00-3 3v1.5m7.5-9a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
      route: '/hrm/employees',
      roles: ['ADMIN', 'HR'],
    },
    {
      label: 'Attendance',
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6.75" stroke="currentColor" stroke-width="1.5"/><path d="M9 5.25V9l2.25 2.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
      route: '/hrm/attendance',
      roles: ['ADMIN', 'HR'],
    },
    {
      label: 'Leave Requests',
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9h12M6.75 3v2.25M11.25 3v2.25M4.5 3h9a1.5 1.5 0 011.5 1.5v9A1.5 1.5 0 0113.5 15h-9A1.5 1.5 0 013 13.5v-9A1.5 1.5 0 014.5 3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
      route: '/hrm/leave',
      roles: ['ADMIN', 'HR'],
    },
    {
      label: 'Face Verification',
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="7" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M3 15.75c0-2.485 2.686-4.5 6-4.5s6 2.015 6 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="13.5" cy="4.5" r="1.5" stroke="currentColor" stroke-width="1"/></svg>',
      route: '/hrm/face',
      roles: ['ADMIN', 'HR'],
    },
    {
      label: 'Courses',
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2.25 7.5l6.75-3.75L15.75 7.5M3.75 8.25v6m10.5-6v6M2.25 14.25h13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      route: '/academic/courses',
      roles: ['ADMIN', 'FACULTY'],
    },
    {
      label: 'Student Results',
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4.5 10.5l3 3 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="2.25" y="2.25" width="13.5" height="13.5" rx="1.5" stroke="currentColor" stroke-width="1.5"/></svg>',
      route: '/academic/student-results',
      roles: ['ADMIN', 'FACULTY'],
    },
    {
      label: 'Payroll',
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1.5v15M5.25 4.5h4.5a2.25 2.25 0 010 4.5h-4.5m0 0h5.25a2.25 2.25 0 010 4.5H5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      route: '/payroll/run',
      roles: ['ADMIN', 'PAYROLL'],
    },
    {
      label: 'Audit Logs',
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2.25 3h13.5M2.25 6.75h13.5M2.25 10.5h9M2.25 14.25h5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
      route: '/admin/audit-logs',
      roles: ['ADMIN'],
    },
    {
      label: 'Student Dashboard',
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2.25 9L9 2.25 15.75 9M3.75 7.5V14.25a.75.75 0 00.75.75H7.5V11.25h3V15h3a.75.75 0 00.75-.75V7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      route: '/student/dashboard',
      roles: ['STUDENT'],
    },
    {
      label: 'Face Verification',
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="7" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M3 15.75c0-2.485 2.686-4.5 6-4.5s6 2.015 6 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="13.5" cy="4.5" r="1.5" stroke="currentColor" stroke-width="1"/></svg>',
      route: '/student/face',
      roles: ['STUDENT'],
    },
  ];

  get filteredMenuItems(): MenuItem[] {
    return this.allMenuItems.filter((item) => {
      if (!item.roles || item.roles.length === 0) return true;
      return this.auth.hasAnyRole(item.roles);
    });
  }

  constructor(public auth: AuthService) {}
}

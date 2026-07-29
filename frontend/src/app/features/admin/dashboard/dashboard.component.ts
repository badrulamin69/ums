import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page animate-fade-in-up">
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Welcome back, {{ auth.currentUserEmail() }}</p>
        </div>
      </div>

      <div class="stats-grid">
        @for (stat of stats; track stat.label; let i = $index) {
          <div class="stat-card animate-fade-in-up" [style.animation-delay]="(i * 0.05) + 's'">
            <div class="stat-icon" [style.background]="stat.bgColor" [style.color]="stat.color">
              <span [innerHTML]="stat.icon"></span>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>
        }
      </div>

      <div class="content-grid">
        <div class="card card-elevated animate-fade-in-up stagger-3">
          <div class="card-header">
            <h3>Recent Activity</h3>
          </div>
          <div class="card-body">
            <div class="empty-state">
              <p>No recent activity to display</p>
            </div>
          </div>
        </div>

        <div class="card card-elevated animate-fade-in-up stagger-4">
          <div class="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div class="card-body">
            <div class="quick-actions">
              <a class="quick-action" routerLink="/admin/faculties">
                <span>Manage Faculties</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </a>
              <a class="quick-action" routerLink="/admin/students">
                <span>View Students</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </a>
              <a class="quick-action" routerLink="/admin/audit-logs">
                <span>Audit Logs</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 1200px; }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }
    .page-title {
      font-family: var(--font-display);
      font-size: var(--fs-h1);
      margin-bottom: 0.25rem;
    }
    .page-subtitle {
      color: var(--color-text-muted);
      font-size: var(--fs-small);
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: border-color var(--duration-fast) var(--ease-out);
      &:hover { border-color: var(--color-border-hover); }
    }
    .stat-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    .stat-value {
      font-size: 1.5rem;
      font-weight: var(--fw-bold);
      color: var(--color-text-primary);
      line-height: 1;
    }
    .stat-label {
      font-size: var(--fs-xs);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-top: 0.25rem;
    }
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    .empty-state {
      text-align: center;
      padding: 2rem;
      color: var(--color-text-muted);
      font-size: var(--fs-small);
    }
    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .quick-action {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem;
      border-radius: var(--radius-sm);
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: all var(--duration-fast) var(--ease-out);
      &:hover {
        background: var(--color-surface-elevated);
        color: var(--color-gold);
      }
    }
    @media (max-width: 768px) {
      .content-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class DashboardComponent implements OnInit {
  stats: { label: string; value: string; icon: SafeHtml; color: string; bgColor: string }[];

  constructor(
    public auth: AuthService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
  ) {
    this.stats = [
      { label: 'Students', value: '...', icon: this.sanitizer.bypassSecurityTrustHtml('<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14.167 17.5v-1.667a3.333 3.333 0 00-3.334-3.333H5.834a3.333 3.333 0 00-3.334 3.333V17.5m8.334-10a3.333 3.333 0 11-6.667 0 3.333 3.333 0 016.667 0z" stroke="currentColor" stroke-width="1.5"/></svg>'), color: '#C8A96E', bgColor: 'rgba(200,169,110,0.12)' },
      { label: 'Employees', value: '...', icon: this.sanitizer.bypassSecurityTrustHtml('<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14.167 17.5v-1.667a3.333 3.333 0 00-3.334-3.333H5.834a3.333 3.333 0 00-3.334 3.333V17.5m8.334-10a3.333 3.333 0 11-6.667 0 3.333 3.333 0 016.667 0z" stroke="currentColor" stroke-width="1.5"/></svg>'), color: '#10B981', bgColor: 'rgba(16,185,129,0.12)' },
      { label: 'Active Circles', value: '...', icon: this.sanitizer.bypassSecurityTrustHtml('<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 2.5h-10a1.667 1.667 0 00-1.667 1.667v11.666A1.667 1.667 0 005 17.5h10a1.667 1.667 0 001.667-1.667V4.167A1.667 1.667 0 0015 2.5z" stroke="currentColor" stroke-width="1.5"/></svg>'), color: '#3B82F6', bgColor: 'rgba(59,130,246,0.12)' },
      { label: 'Pending Leave', value: '...', icon: this.sanitizer.bypassSecurityTrustHtml('<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3.333 10h13.334M7.5 3.333V5M12.5 3.333V5M5 3.333h10a1.667 1.667 0 011.667 1.667v10A1.667 1.667 0 0115 16.667H5A1.667 1.667 0 013.333 15V5A1.667 1.667 0 015 3.333z" stroke="currentColor" stroke-width="1.5"/></svg>'), color: '#F59E0B', bgColor: 'rgba(245,158,11,0.12)' },
    ];
  }

  ngOnInit(): void {
    const token = localStorage.getItem('ums_access_token');
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    const base = environment.apiUrl;

    const endpoints = [
      { key: 0, url: `${base}/students?page=0&size=1` },
      { key: 1, url: `${base}/employees?page=0&size=1` },
      { key: 2, url: `${base}/admission-circulars?page=0&size=1` },
      { key: 3, url: `${base}/leave-requests?page=0&size=1&status=PENDING` },
    ];

    endpoints.forEach(ep => {
      fetch(ep.url, { headers })
        .then(r => r.json())
        .then(d => {
          this.stats[ep.key].value = (d?.data?.totalElements ?? 0).toString();
          this.cdr.detectChanges();
        })
        .catch(() => {
          this.stats[ep.key].value = '0';
          this.cdr.detectChanges();
        });
    });
  }
}

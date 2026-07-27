import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  template: `
    <div class="page animate-fade-in-up">
      <div class="page-header">
        <div>
          <h1 class="page-title">Student Dashboard</h1>
          <p class="page-subtitle">Welcome, {{ auth.currentUserEmail() }}</p>
        </div>
      </div>

      <div class="welcome-card animate-fade-in-up stagger-1">
        <div class="welcome-content">
          <h2>Your Academic Journey</h2>
          <p>View your profile, results, and academic progress here.</p>
        </div>
        <div class="welcome-deco">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" opacity="0.15">
            <path d="M40 10L70 30V50L40 70L10 50V30L40 10Z" stroke="var(--color-gold)" stroke-width="2"/>
            <path d="M40 20L60 33V47L40 60L20 47V33L40 20Z" stroke="var(--color-gold)" stroke-width="1.5"/>
          </svg>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card animate-fade-in-up stagger-2">
          <span class="stat-label">CGPA</span>
          <span class="stat-value">--</span>
        </div>
        <div class="stat-card animate-fade-in-up stagger-3">
          <span class="stat-label">Completed Courses</span>
          <span class="stat-value">0</span>
        </div>
        <div class="stat-card animate-fade-in-up stagger-4">
          <span class="stat-label">Registration No.</span>
          <span class="stat-value" style="font-size: 1rem">--</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 1200px; }
    .page-header { margin-bottom: 2rem; }
    .page-title { font-family: var(--font-display); font-size: var(--fs-h1); margin-bottom: 0.25rem; }
    .page-subtitle { color: var(--color-text-muted); font-size: var(--fs-small); }

    .welcome-card {
      background: linear-gradient(135deg, var(--color-surface-elevated), var(--color-surface));
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 2rem;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h2 {
        font-family: var(--font-display);
        font-size: var(--fs-h2);
        margin-bottom: 0.5rem;
      }

      p { color: var(--color-text-secondary); font-size: var(--fs-small); }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .stat-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stat-label {
      font-size: var(--fs-xs);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: var(--fw-bold);
      color: var(--color-gold);
    }
  `],
})
export class StudentDashboardComponent {
  constructor(public auth: AuthService) {}
}

import { Component, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CrudService } from '../../../core/services/crud.service';

interface Circular {
  id: number; title: string; session: string; facultyId: number; facultyName: string;
  registrationStartDate: string; registrationEndDate: string;
  applicationFee: number; totalSeats: number; active: boolean;
}

@Component({
  selector: 'app-public-circulars',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page">
      <div class="page-inner">
        <div class="page-header animate-fade-in-up">
          <h1 class="page-title">Admission Circulars</h1>
          <p class="page-subtitle">Browse open admission circulars and apply now</p>
        </div>

        @if (loading()) {
          <div class="loading-state">
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
          </div>
        } @else if (circulars().length === 0) {
          <div class="empty-state animate-fade-in-up">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="1.5"/></svg>
            <h3>No Open Admissions</h3>
            <p>There are no active admission circulars at the moment. Please check back later.</p>
          </div>
        } @else {
          <div class="circulars-grid">
            @for (c of circulars(); track c.id; let i = $index) {
              <div class="circular-card animate-fade-in-up" [style.animation-delay]="(i * 0.05) + 's'">
                <div class="card-top">
                  <span class="badge badge-success">Active</span>
                  <span class="session-badge">{{ c.session }}</span>
                </div>
                <h2 class="card-title">{{ c.title }}</h2>
                <p class="card-faculty">{{ c.facultyName }}</p>
                <div class="card-details">
                  <div class="detail-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="1.5"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="1.5"/></svg>
                    <span>{{ c.registrationStartDate }} &mdash; {{ c.registrationEndDate }}</span>
                  </div>
                  <div class="detail-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="1.5"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/></svg>
                    <span>{{ c.totalSeats }} Total Seats</span>
                  </div>
                  <div class="detail-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" stroke-width="1.5"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" stroke-width="1.5"/></svg>
                    <span>{{ c.applicationFee }} BDT</span>
                  </div>
                </div>
                <a [routerLink]="['/apply', c.id]" class="btn btn-gold btn-block">Apply Now</a>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 3rem 2rem 5rem; }
    .page-inner { max-width: 1000px; margin: 0 auto; }
    .page-header { text-align: center; margin-bottom: 3rem; }
    .page-title {
      font-family: var(--font-display);
      font-size: var(--fs-h1);
      margin-bottom: 0.5rem;
    }
    .page-subtitle {
      color: var(--color-text-muted);
      font-size: var(--fs-body);
    }

    .loading-state {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .skeleton-card {
      height: 280px;
      border-radius: var(--radius-md);
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--color-text-muted);
    }
    .empty-state svg {
      margin-bottom: 1rem;
      opacity: 0.4;
    }
    .empty-state h3 {
      font-family: var(--font-display);
      font-size: var(--fs-h3);
      color: var(--color-text-secondary);
      margin-bottom: 0.5rem;
    }
    .empty-state p {
      font-size: var(--fs-small);
    }

    .circulars-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .circular-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 1.75rem;
      transition: border-color var(--duration-normal) var(--ease-out),
                  box-shadow var(--duration-normal) var(--ease-out),
                  transform var(--duration-normal) var(--ease-out);
    }
    .circular-card:hover {
      border-color: var(--color-gold);
      box-shadow: var(--shadow-gold);
      transform: translateY(-2px);
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .session-badge {
      font-size: var(--fs-xs);
      font-weight: var(--fw-semibold);
      color: var(--color-text-muted);
      background: var(--color-surface-elevated);
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-sm);
    }
    .card-title {
      font-family: var(--font-display);
      font-size: var(--fs-h3);
      margin-bottom: 0.25rem;
    }
    .card-faculty {
      font-size: var(--fs-small);
      color: var(--color-text-muted);
      margin-bottom: 1.25rem;
    }
    .card-details {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      margin-bottom: 1.5rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--color-border);
    }
    .detail-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: var(--fs-small);
      color: var(--color-text-secondary);
    }
    .detail-row svg {
      color: var(--color-text-muted);
      flex-shrink: 0;
    }
    .btn-block {
      width: 100%;
      justify-content: center;
    }
  `],
})
export class PublicCircularsComponent implements OnInit {
  circulars = signal<Circular[]>([]);
  loading = signal(true);

  constructor(private crud: CrudService) {}

  ngOnInit(): void {
    this.crud.list<Circular>('admission-circulars', 0, 20).subscribe({
      next: (d) => { this.circulars.set(d.content.filter(c => c.active)); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}

import { Component, signal, OnInit, inject , DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CrudService } from '../../../core/services/crud.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page">
      <div class="page-inner">
        <div class="success-card animate-fade-in-up">
          @if (loading()) {
            <div class="spinner-lg"></div>
            <h2>Verifying your email...</h2>
            <p class="desc">Please wait while we verify your email address.</p>
          } @else if (verified()) {
            <div class="success-icon">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" stroke-width="1.5"/><polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" stroke-width="1.5"/></svg>
            </div>
            <h2>Email Verified</h2>
            <p class="desc">Your email has been verified successfully. You can now sign in to your account.</p>
            <div class="actions">
              <a routerLink="/login" class="btn btn-gold">Sign In</a>
            </div>
          } @else {
            <div class="error-icon">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </div>
            <h2>Verification Failed</h2>
            <p class="desc">{{ error() }}</p>
            <div class="actions">
              <a routerLink="/" class="btn btn-gold">Back to Home</a>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 6rem 2rem; }
    .page-inner { max-width: 500px; margin: 0 auto; }
    .success-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 3rem;
      text-align: center;
    }
    .success-icon { color: var(--color-success); margin-bottom: 1.5rem; }
    .error-icon { color: var(--color-danger); margin-bottom: 1.5rem; }
    .success-card h2 {
      font-family: var(--font-display);
      font-size: var(--fs-h2);
      margin-bottom: 1rem;
    }
    .desc {
      color: var(--color-text-secondary);
      font-size: var(--fs-body);
      line-height: 1.7;
      margin-bottom: 2rem;
    }
    .actions { display: flex; gap: 0.75rem; justify-content: center; }
    .spinner-lg {
      width: 48px; height: 48px;
      border: 3px solid var(--color-border);
      border-top-color: var(--color-gold);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1.5rem;
    }
  `],
})
export class VerifyEmailComponent implements OnInit {
  loading = signal(true);
  verified = signal(false);
  error = signal('');

  private route = inject(ActivatedRoute);
  private crud = inject(CrudService);

  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.loading.set(false);
      this.error.set('No verification token provided.');
      return;
    }

    this.crud.customGet<any>(`auth/verify-email?token=${token}`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.loading.set(false);
        this.verified.set(true);
      },
      error: (err: any) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Invalid or expired verification token.');
      },
    });
  }
}

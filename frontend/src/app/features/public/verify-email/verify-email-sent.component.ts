import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-verify-email-sent',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page">
      <div class="page-inner">
        <div class="success-card animate-fade-in-up">
          <div class="success-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="M22 4L12 13 2 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2>Check Your Email</h2>
          <p class="desc">
            We've sent a verification link to your email address.
            Please check your inbox and click the link to verify your account.
          </p>
          <p class="hint">Didn't receive the email? Check your spam folder or contact support.</p>
          <div class="actions">
            <a routerLink="/" class="btn btn-gold">Back to Home</a>
            <a routerLink="/login" class="btn btn-outline-gold">Sign In</a>
          </div>
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
    .success-icon { color: var(--color-gold); margin-bottom: 1.5rem; }
    .success-card h2 {
      font-family: var(--font-display);
      font-size: var(--fs-h2);
      margin-bottom: 1rem;
    }
    .desc {
      color: var(--color-text-secondary);
      font-size: var(--fs-body);
      line-height: 1.7;
      margin-bottom: 1rem;
    }
    .hint {
      font-size: var(--fs-small);
      color: var(--color-text-muted);
      margin-bottom: 2rem;
    }
    .actions { display: flex; gap: 0.75rem; justify-content: center; }
  `],
})
export class VerifyEmailSentComponent {}

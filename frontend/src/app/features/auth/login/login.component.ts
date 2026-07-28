import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-bg">
        <div class="bg-pattern"></div>
        <div class="bg-gradient"></div>
      </div>

      <div class="auth-container animate-fade-in-up">
        <div class="auth-card">
          <div class="auth-header">
            <div class="brand-mark">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="12" fill="var(--color-gold)"/>
                <path d="M14 34V14l10 7-10 7zm10-7l10 7V14l-10 7z" fill="var(--color-obsidian)"/>
              </svg>
            </div>
            <h1 class="auth-title">Smart University</h1>
            <p class="auth-subtitle">Enterprise Management System</p>
          </div>

          <form class="auth-form" (ngSubmit)="onSubmit()">
            <div class="form-group animate-fade-in-up stagger-1">
              <label class="form-label">Email Address</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 5.25l6 3.75 6-3.75M3 5.25v7.5a1.5 1.5 0 001.5 1.5h9a1.5 1.5 0 001.5-1.5v-7.5M3 5.25h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <input type="email"
                       class="form-control"
                       [(ngModel)]="email"
                       name="email"
                       placeholder="you@university.edu"
                       required
                       autocomplete="email">
              </div>
            </div>

            <div class="form-group animate-fade-in-up stagger-2">
              <label class="form-label">Password</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="3" y="8.25" width="12" height="7.5" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M5.25 8.25V5.25a3.75 3.75 0 017.5 0v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <input [type]="showPassword() ? 'text' : 'password'"
                       class="form-control"
                       [(ngModel)]="password"
                       name="password"
                       placeholder="Enter your password"
                       required
                       autocomplete="current-password">
                <button type="button" class="password-toggle" (click)="showPassword.set(!showPassword())">
                  @if (showPassword()) {
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M1.5 9s3-5.25 7.5-5.25S16.5 9 16.5 9s-3 5.25-7.5 5.25S1.5 9 1.5 9z" stroke="currentColor" stroke-width="1.5"/><circle cx="9" cy="9" r="2.25" stroke="currentColor" stroke-width="1.5"/></svg>
                  } @else {
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2.25 2.25l13.5 13.5M7.17 7.17a2.25 2.25 0 003.18 3.18M1.5 9s3-5.25 7.5-5.25c1.13 0 2.18.3 3.12.78M16.5 9s-1.32 2.25-3.66 3.78" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                  }
                </button>
              </div>
            </div>

            <button type="submit"
                    class="btn btn-gold btn-full animate-fade-in-up stagger-3"
                    [disabled]="loading()">
              @if (loading()) {
                <span class="spinner-sm"></span>
                Signing in...
              } @else {
                Sign In
              }
            </button>
          </form>

          <div class="auth-footer animate-fade-in-up stagger-4">
          </div>
        </div>

        <div class="auth-decoration">
          <div class="deco-line"></div>
          <div class="deco-text">EST. 2026</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .auth-bg {
      position: absolute;
      inset: 0;
      z-index: 0;
    }

    .bg-pattern {
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(circle at 25% 25%, var(--color-gold-dim) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(200, 169, 110, 0.05) 0%, transparent 50%);
    }

    .bg-gradient {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 30% 50%, rgba(200, 169, 110, 0.08) 0%, transparent 60%);
    }

    .auth-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 420px;
      padding: 1rem;
    }

    .auth-card {
      background: rgba(17, 24, 32, 0.8);
      backdrop-filter: blur(20px);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      padding: 2.5rem;
      box-shadow: var(--shadow-lg);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .brand-mark {
      margin-bottom: 1.25rem;
      display: inline-block;
      animation: fadeInUp 0.6s var(--ease-spring) 0.1s both;
    }

    .auth-title {
      font-family: var(--font-display);
      font-size: var(--fs-hero);
      color: var(--color-text-primary);
      margin-bottom: 0.25rem;
      animation: fadeInUp 0.6s var(--ease-spring) 0.2s both;
    }

    .auth-subtitle {
      font-size: var(--fs-small);
      color: var(--color-text-muted);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      animation: fadeInUp 0.6s var(--ease-spring) 0.3s both;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 0.875rem;
      color: var(--color-text-muted);
      pointer-events: none;
      z-index: 1;
    }

    .form-control {
      padding-left: 2.75rem;
      height: 48px;
      font-size: var(--fs-body);
    }

    .password-toggle {
      position: absolute;
      right: 0.5rem;
      background: none;
      border: none;
      color: var(--color-text-muted);
      padding: 0.375rem;
      cursor: pointer;
      border-radius: var(--radius-sm);
      transition: color var(--duration-fast) var(--ease-out);

      &:hover { color: var(--color-gold); }
    }

    .btn-full {
      width: 100%;
      height: 48px;
      font-size: var(--fs-body);
      margin-top: 0.5rem;
    }

    .spinner-sm {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--color-border);
      font-size: var(--fs-small);
      color: var(--color-text-muted);

      a {
        color: var(--color-gold);
        font-weight: var(--fw-semibold);

        &:hover { text-decoration: underline; }
      }
    }

    .auth-decoration {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 2rem;
      animation: fadeIn 1s var(--ease-out) 0.8s both;
    }

    .deco-line {
      width: 1px;
      height: 32px;
      background: linear-gradient(to bottom, var(--color-gold), transparent);
    }

    .deco-text {
      font-family: var(--font-display);
      font-size: var(--fs-xs);
      color: var(--color-text-muted);
      letter-spacing: 0.2em;
    }
  `],
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = signal(false);
  loading = signal(false);

  constructor(
    private auth: AuthService,
    private toast: ToastService,
  ) {
    if (this.auth.isLoggedIn()) {
      this.auth.redirectAfterLogin();
    }
  }

  onSubmit(): void {
    if (!this.email || !this.password) return;

    this.loading.set(true);

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          this.toast.success('Welcome back!');
          this.auth.redirectAfterLogin();
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.toast.error(err?.error?.message || 'Login failed');
      },
    });
  }
}

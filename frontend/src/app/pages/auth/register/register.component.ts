import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-card card">
        <div class="auth-header">
          <h1>Create Account</h1>
          <p>Join Smart University — start your application today</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label" for="email">Email Address</label>
            <input id="email" type="email" class="form-input" formControlName="email" placeholder="you@example.com" />
            <div class="form-error" *ngIf="form.get('email')?.touched && form.get('email')?.invalid">
              Valid email is required.
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input id="password" type="password" class="form-input" formControlName="password" placeholder="Min 8 characters" />
            <div class="form-error" *ngIf="form.get('password')?.touched && form.get('password')?.invalid">
              Password must be at least 8 characters.
            </div>
          </div>
          <div class="form-error server-error" *ngIf="errorMsg">{{errorMsg}}</div>
          <button type="submit" class="btn btn-accent btn-lg" style="width:100%;" [disabled]="loading">
            {{loading ? 'Creating Account...' : 'Create Account'}}
          </button>
        </form>
        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign in here</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      background: linear-gradient(135deg, rgba(15, 42, 74, 0.03) 0%, rgba(201, 162, 39, 0.03) 100%);
    }
    .auth-card {
      width: 100%;
      max-width: 420px;
      padding: 2.5rem;
    }
    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
      h1 { font-family: var(--font-serif); color: var(--primary); margin-bottom: 0.5rem; }
      p { color: var(--text-secondary); font-size: 0.9375rem; }
    }
    .server-error { text-align: center; margin-bottom: 1rem; }
    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-light);
      p { font-size: 0.875rem; color: var(--text-secondary); }
      a { font-weight: 500; }
    }
  `],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    this.authService.register(this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err: any) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Registration failed. Please try again.';
      },
    });
  }
}

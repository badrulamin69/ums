import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-card card">
        <div class="auth-header">
          <h1>{{isRegister ? 'Create Account' : 'Welcome Back'}}</h1>
          <p>{{isRegister ? 'Join Smart University — start your application today' : 'Sign in to your Smart University account'}}</p>
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
            <input id="password" type="password" class="form-input" formControlName="password" [placeholder]="isRegister ? 'Min 8 characters' : 'Enter your password'" />
            <div class="form-error" *ngIf="form.get('password')?.touched && form.get('password')?.invalid">
              {{isRegister ? 'Password must be at least 8 characters.' : 'Password is required (min 6 characters).'}}
            </div>
          </div>
          <div class="form-error server-error" *ngIf="errorMsg">{{errorMsg}}</div>
          <button type="submit" class="btn btn-primary btn-lg" style="width:100%;" [disabled]="loading">
            {{loading ? (isRegister ? 'Creating Account...' : 'Signing in...') : (isRegister ? 'Create Account' : 'Sign In')}}
          </button>
        </form>
        <div class="auth-footer">
          <p *ngIf="!isRegister">Don't have an account? <a (click)="toggleMode()" style="cursor:pointer;font-weight:500;">Register here</a></p>
          <p *ngIf="isRegister">Already have an account? <a (click)="toggleMode()" style="cursor:pointer;font-weight:500;">Sign in here</a></p>
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
    }
  `],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  errorMsg = '';
  returnUrl = '/dashboard';
  isRegister = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    if (this.route.snapshot.queryParams['mode'] === 'register') {
      this.isRegister = true;
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
      this.form.get('password')?.updateValueAndValidity();
    }
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  toggleMode(): void {
    this.isRegister = !this.isRegister;
    this.errorMsg = '';
    if (this.isRegister) {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    } else {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
    this.form.get('password')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';

    if (this.isRegister) {
      this.authService.register(this.form.value).subscribe({
        next: () => this.router.navigate([this.returnUrl]),
        error: (err: any) => {
          this.loading = false;
          this.errorMsg = err.error?.message || 'Registration failed. Please try again.';
        },
      });
    } else {
      this.authService.login(this.form.value).subscribe({
        next: () => this.router.navigate([this.returnUrl]),
        error: (err: any) => {
          this.loading = false;
          this.errorMsg = err.error?.message || 'Invalid email or password.';
        },
      });
    }
  }
}

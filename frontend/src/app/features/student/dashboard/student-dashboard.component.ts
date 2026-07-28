import { Component, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CrudService } from '../../../core/services/crud.service';
import { ToastService } from '../../../core/services/toast.service';

interface ApplicantProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  applicationNumber: string;
  status: string;
  emailVerified: boolean;
  paymentCompleted: boolean;
  circularTitle: string;
  preferredDepartmentName: string;
}

interface PaymentInitiateResponse {
  id: number;
  transactionId: string;
  sslCommerzGatewayUrl: string;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page animate-fade-in-up">
      <div class="page-header">
        <div>
          <h1 class="page-title">Applicant Dashboard</h1>
          <p class="page-subtitle">Welcome, {{ auth.currentUserEmail() }}</p>
        </div>
      </div>

      @if (applicantProfile()) {
        <div class="welcome-card animate-fade-in-up stagger-1">
          <div class="welcome-content">
            <h2>{{ applicantProfile()!.firstName }} {{ applicantProfile()!.lastName }}</h2>
            <p>Application: {{ applicantProfile()!.applicationNumber }} | {{ applicantProfile()!.circularTitle }}</p>
          </div>
          <div class="welcome-deco">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" opacity="0.15">
              <path d="M40 10L70 30V50L40 70L10 50V30L40 10Z" stroke="var(--color-gold)" stroke-width="2"/>
              <path d="M40 20L60 33V47L40 60L20 47V33L40 20Z" stroke="var(--color-gold)" stroke-width="1.5"/>
            </svg>
          </div>
        </div>

        <div class="payment-section animate-fade-in-up stagger-2">
          <div class="card card-elevated">
            <div class="card-header"><h3>Payment Status</h3></div>
            <div class="card-body">
              <div class="check-list">
                <div class="check-item">
                  <span class="check-icon" [class.check-ok]="applicantProfile()!.emailVerified" [class.check-fail]="!applicantProfile()!.emailVerified">
                    @if (applicantProfile()!.emailVerified) {
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 9l3.5 3.5L14 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    } @else {
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                    }
                  </span>
                  <div class="check-content">
                    <span class="check-label">Email Verified</span>
                    <span class="check-status">{{ applicantProfile()!.emailVerified ? 'Verified' : 'Not Verified' }}</span>
                  </div>
                </div>

                <div class="check-item">
                  <span class="check-icon" [class.check-ok]="applicantProfile()!.paymentCompleted" [class.check-fail]="!applicantProfile()!.paymentCompleted">
                    @if (applicantProfile()!.paymentCompleted) {
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 9l3.5 3.5L14 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    } @else {
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                    }
                  </span>
                  <div class="check-content">
                    <span class="check-label">Application Fee</span>
                    <span class="check-status">{{ applicantProfile()!.paymentCompleted ? 'Paid' : 'Pending' }}</span>
                  </div>
                </div>

                <div class="check-item">
                  <span class="check-icon" [class.check-ok]="applicantProfile()!.status !== 'REGISTRATION_OPEN'" [class.check-fail]="applicantProfile()!.status === 'REGISTRATION_OPEN'">
                    @if (applicantProfile()!.status !== 'REGISTRATION_OPEN') {
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 9l3.5 3.5L14 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    } @else {
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                    }
                  </span>
                  <div class="check-content">
                    <span class="check-label">Application Status</span>
                    <span class="check-status">{{ applicantProfile()!.status }}</span>
                  </div>
                </div>
              </div>

              <div class="payment-action">
                @if (!applicantProfile()!.paymentCompleted && applicantProfile()!.emailVerified) {
                  <button class="btn btn-gold" (click)="initiatePayment()" [disabled]="processingPayment()">
                    @if (processingPayment()) {
                      <span class="spinner-sm"></span> Processing...
                    } @else {
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12v8H2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M2 6h12" stroke="currentColor" stroke-width="1.5"/></svg>
                      Pay Application Fee
                    }
                  </button>
                } @else if (applicantProfile()!.paymentCompleted) {
                  <div class="payment-done">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="#22c55e" stroke-width="1.5"/><path d="M6 10l2.5 2.5L14 7" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <span>Payment completed. Your admit card has been generated.</span>
                  </div>
                } @else if (!applicantProfile()!.emailVerified) {
                  <div class="payment-blocked">
                    <span>Please verify your email first to proceed with payment.</span>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card animate-fade-in-up stagger-3">
            <span class="stat-label">Status</span>
            <span class="stat-value" style="font-size: 1rem">{{ applicantProfile()!.status }}</span>
          </div>
          <div class="stat-card animate-fade-in-up stagger-4">
            <span class="stat-label">Department</span>
            <span class="stat-value" style="font-size: 1rem">{{ applicantProfile()!.preferredDepartmentName || '--' }}</span>
          </div>
          <div class="stat-card animate-fade-in-up stagger-5">
            <span class="stat-label">Application #</span>
            <span class="stat-value" style="font-size: 0.9rem">{{ applicantProfile()!.applicationNumber }}</span>
          </div>
        </div>

        <div class="content-grid">
          <div class="card card-elevated animate-fade-in-up stagger-4">
            <div class="card-header"><h3>Quick Links</h3></div>
            <div class="card-body">
              <div class="quick-actions">
                <a class="quick-action" routerLink="/student/profile">
                  <span>My Profile</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                </a>
                <a class="quick-action" routerLink="/student/face">
                  <span>Face Verification</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                </a>
                <a class="quick-action" routerLink="/student/results">
                  <span>View Results</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="card card-elevated animate-fade-in-up stagger-1">
          <div class="card-body">
            <div class="empty-state"><p>Loading your profile...</p></div>
          </div>
        </div>
      }
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
      h2 { font-family: var(--font-display); font-size: var(--fs-h2); margin-bottom: 0.25rem; }
      p { color: var(--color-text-secondary); font-size: var(--fs-small); }
    }

    .payment-section { margin-bottom: 2rem; }

    .check-list { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; }
    .check-item {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: var(--color-surface-elevated);
      border-radius: var(--radius-md);
    }
    .check-icon {
      width: 28px; height: 28px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      &.check-ok { background: rgba(34,197,94,0.12); color: #22c55e; }
      &.check-fail { background: rgba(239,68,68,0.12); color: #ef4444; }
    }
    .check-content { display: flex; flex-direction: column; }
    .check-label { font-size: var(--fs-small); font-weight: var(--fw-semibold); }
    .check-status { font-size: var(--fs-xs); color: var(--color-text-muted); }

    .payment-action { padding-top: 0.5rem; }
    .payment-done {
      display: flex; align-items: center; gap: 0.5rem;
      color: #22c55e; font-size: var(--fs-small); font-weight: var(--fw-medium);
    }
    .payment-blocked {
      color: var(--color-text-muted); font-size: var(--fs-small);
      padding: 0.75rem 1rem;
      background: rgba(245,158,11,0.08);
      border-radius: var(--radius-md);
      border-left: 3px solid #f59e0b;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
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
    .stat-label { font-size: var(--fs-xs); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
    .stat-value { font-size: 2rem; font-weight: var(--fw-bold); color: var(--color-gold); }

    .content-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }

    .quick-actions { display: flex; flex-direction: column; gap: 0.5rem; }
    .quick-action {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0.75rem; border-radius: var(--radius-sm);
      color: var(--color-text-secondary); text-decoration: none;
      transition: all var(--duration-fast) var(--ease-out);
      &:hover { background: var(--color-surface-elevated); color: var(--color-gold); }
    }

    .empty-state { text-align: center; padding: 2rem; color: var(--color-text-muted); font-size: var(--fs-small); }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius-md);
      font-weight: var(--fw-semibold);
      cursor: pointer;
      border: none;
      font-size: var(--fs-small);
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-gold {
      background: var(--color-gold);
      color: var(--color-bg);
      &:hover { opacity: 0.9; }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    .spinner-sm {
      width: 14px; height: 14px; border: 2px solid transparent;
      border-top-color: currentColor; border-radius: 50%;
      animation: spin 0.6s linear infinite; display: inline-block;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
})
export class StudentDashboardComponent implements OnInit {
  applicantProfile = signal<ApplicantProfile | null>(null);
  processingPayment = signal(false);

  constructor(
    public auth: AuthService,
    private crud: CrudService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadApplicantProfile();
  }

  loadApplicantProfile(): void {
    this.crud.customGet<ApplicantProfile>('applicants/me').subscribe({
      next: (data) => this.applicantProfile.set(data),
      error: () => this.toast.error('Failed to load profile'),
    });
  }

  initiatePayment(): void {
    const profile = this.applicantProfile();
    if (!profile) return;

    this.processingPayment.set(true);
    this.crud.create<any, PaymentInitiateResponse>('payments/initiate', {
      paymentType: 'APPLICATION_FEE',
      referenceEntityType: 'APPLICANT',
      referenceEntityId: profile.id,
      amount: 500,
    }).subscribe({
      next: (res) => {
        this.processingPayment.set(false);
        if (res.sslCommerzGatewayUrl) {
          window.location.href = res.sslCommerzGatewayUrl;
        }
      },
      error: () => {
        this.toast.error('Failed to initiate payment');
        this.processingPayment.set(false);
      },
    });
  }
}

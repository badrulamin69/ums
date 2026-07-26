import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmissionService } from '../../../services/admission.service';
import { ApplicantResponse } from '../../../models/admission.model';
import { AdmissionStatus } from '../../../models/common.model';

@Component({
  selector: 'app-applicant-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container dashboard">
      <div class="page-header" *ngIf="applicant">
        <div class="profile-header">
          <div class="avatar">{{applicant.firstName[0]}}{{applicant.lastName[0]}}</div>
          <div>
            <h1>{{applicant.firstName}} {{applicant.middleName ? applicant.middleName + ' ' : ''}}{{applicant.lastName}}</h1>
            <div class="profile-meta">
              <span class="app-number">Application #{{applicant.applicationNumber}}</span>
              <span class="badge" [class]="getStatusBadgeClass(applicant.status)">{{formatStatus(applicant.status)}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-grid" *ngIf="applicant">
        <div class="card status-card">
          <h3>Application Status</h3>
          <div class="stepper">
            <div class="step" *ngFor="let step of stepperSteps; let i = index"
                 [class.active]="step.active" [class.completed]="step.completed">
              <div class="step-dot">
                <svg *ngIf="step.completed" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span *ngIf="!step.completed">{{i + 1}}</span>
              </div>
              <div class="step-label">{{step.label}}</div>
            </div>
          </div>
        </div>

        <div class="card checklist-card">
          <h3>Application Checklist</h3>
          <div class="checklist">
            <div class="check-item" [class.done]="applicant.emailVerified">
              <div class="check-icon">
                <svg *ngIf="applicant.emailVerified" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <svg *ngIf="!applicant.emailVerified" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </div>
              <span>Email Verified</span>
            </div>
            <div class="check-item" [class.done]="applicant.paymentCompleted">
              <div class="check-icon">
                <svg *ngIf="applicant.paymentCompleted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <svg *ngIf="!applicant.paymentCompleted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </div>
              <span>Payment Completed</span>
            </div>
          </div>
        </div>

        <div class="card info-card">
          <h3>Personal Details</h3>
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Phone</span>
              <span class="info-value">{{applicant.phone}}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Gender</span>
              <span class="info-value">{{applicant.gender}}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date of Birth</span>
              <span class="info-value">{{applicant.dateOfBirth | date:'mediumDate'}}</span>
            </div>
            <div class="info-row" *ngIf="applicant.preferredDepartmentName">
              <span class="info-label">Preferred Department</span>
              <span class="info-value">{{applicant.preferredDepartmentName}}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Applied For</span>
              <span class="info-value">{{applicant.circularTitle}}</span>
            </div>
          </div>
        </div>

        <div class="card merit-card" *ngIf="showMeritScore">
          <h3>Merit Score</h3>
          <div class="merit-display">
            <div class="merit-value">{{applicant.meritScore?.toFixed(2) || 'N/A'}}</div>
            <div class="merit-label">Your Merit Position Score</div>
          </div>
        </div>
      </div>

      <div class="loading-state" *ngIf="!applicant && !error">
        <p>Loading your application...</p>
      </div>

      <div class="error-state card" *ngIf="error">
        <p>{{error}}</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { padding: 2rem 0 3rem; }
    .profile-header { display: flex; align-items: center; gap: 1.25rem; }
    .avatar {
      width: 64px; height: 64px; border-radius: 50%;
      background: var(--accent); color: var(--primary-dark);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 1.25rem; flex-shrink: 0;
    }
    .profile-meta { display: flex; align-items: center; gap: 0.75rem; margin-top: 0.25rem; }
    .app-number { font-family: monospace; font-size: 0.875rem; color: var(--text-secondary); }
    .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    .status-card, .checklist-card, .info-card, .merit-card { padding: 1.5rem; }
    h3 { font-size: 1rem; color: var(--primary); margin-bottom: 1rem; }
    .stepper { display: flex; flex-direction: column; gap: 0; }
    .step {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.75rem 0;
      position: relative;
      &:not(:last-child)::after {
        content: '';
        position: absolute;
        left: 15px;
        top: 3rem;
        width: 2px;
        height: calc(100% - 1.5rem);
        background: var(--border);
      }
      &.completed:not(:last-child)::after { background: var(--success); }
    }
    .step-dot {
      width: 32px; height: 32px; border-radius: 50%;
      border: 2px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; font-weight: 600; color: var(--text-muted);
      background: white; z-index: 1; flex-shrink: 0;
    }
    .step.active .step-dot { border-color: var(--primary); color: var(--primary); }
    .step.completed .step-dot {
      border-color: var(--success); background: var(--success); color: white;
    }
    .step-label { font-size: 0.875rem; color: var(--text-secondary); }
    .step.active .step-label { color: var(--primary); font-weight: 500; }
    .step.completed .step-label { color: var(--success); }
    .checklist { display: flex; flex-direction: column; gap: 0.75rem; }
    .check-item {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.75rem; border-radius: var(--radius);
      background: var(--bg-page);
      &.done { background: var(--success-bg); }
      span { font-size: 0.9375rem; }
      &.done span { color: var(--success); font-weight: 500; }
    }
    .check-icon { flex-shrink: 0; }
    .check-item:not(.done) .check-icon { color: var(--text-muted); }
    .check-item.done .check-icon { color: var(--success); }
    .info-grid { display: flex; flex-direction: column; gap: 0.5rem; }
    .info-row {
      display: flex; justify-content: space-between;
      padding: 0.5rem 0; border-bottom: 1px solid var(--border-light);
      &:last-child { border-bottom: none; }
      .info-label { font-size: 0.875rem; color: var(--text-muted); }
      .info-value { font-size: 0.875rem; font-weight: 500; }
    }
    .merit-display { text-align: center; padding: 1.5rem 0; }
    .merit-value { font-size: 3rem; font-weight: 700; color: var(--accent-dark); line-height: 1; }
    .merit-label { font-size: 0.875rem; color: var(--text-muted); margin-top: 0.5rem; }
    .loading-state, .error-state { text-align: center; padding: 4rem 0; color: var(--text-muted); }
    .error-state { color: var(--danger); }
    @media (max-width: 768px) { .dashboard-grid { grid-template-columns: 1fr; } }
  `],
})
export class ApplicantDashboardComponent implements OnInit {
  applicant: ApplicantResponse | null = null;
  error = '';
  stepperSteps: { label: string; active: boolean; completed: boolean }[] = [];
  showMeritScore = false;

  constructor(private admissionService: AdmissionService) {}

  ngOnInit(): void {
    this.admissionService.getMyProfile().subscribe({
      next: (res: any) => {
        this.applicant = res.data;
        if (this.applicant) {
          this.buildStepper();
          this.checkMeritScore();
        }
      },
      error: (err: any) => {
        this.error = err.status === 404
          ? 'No application found. Please apply first.'
          : 'Unable to load your application.';
      },
    });
  }

  private buildStepper(): void {
    const statusOrder: AdmissionStatus[] = [
      AdmissionStatus.REGISTRATION_OPEN,
      AdmissionStatus.REGISTRATION_CLOSED,
      AdmissionStatus.PAYMENT_PENDING,
      AdmissionStatus.PAYMENT_VERIFIED,
      AdmissionStatus.ADMITTED,
    ];
    const status = this.applicant!.status;
    const currentIndex = statusOrder.indexOf(status);

    const labels: Record<string, string> = {
      REGISTRATION_OPEN: 'Registration',
      REGISTRATION_CLOSED: 'Registration Closed',
      PAYMENT_PENDING: 'Payment Pending',
      PAYMENT_VERIFIED: 'Payment Verified',
      ADMITTED: 'Admitted',
      REJECTED: 'Rejected',
      WAITLISTED: 'Waitlisted',
    };

    if (status === AdmissionStatus.REJECTED) {
      this.stepperSteps = [
        { label: 'Registration', completed: true, active: false },
        { label: 'Under Review', completed: false, active: true },
        { label: 'Rejected', completed: false, active: false },
      ];
      return;
    }

    if (status === AdmissionStatus.WAITLISTED) {
      this.stepperSteps = [
        { label: 'Registration', completed: true, active: false },
        { label: 'Payment', completed: true, active: false },
        { label: 'Waitlisted', completed: false, active: true },
      ];
      return;
    }

    this.stepperSteps = statusOrder
      .filter((s) => s !== AdmissionStatus.REGISTRATION_CLOSED)
      .map((s, i) => ({
        label: labels[s] || s,
        completed: currentIndex > i,
        active: currentIndex === i,
      }));
  }

  private checkMeritScore(): void {
    const status = this.applicant!.status;
    this.showMeritScore =
      status === AdmissionStatus.ADMITTED ||
      status === AdmissionStatus.WAITLISTED;
  }

  formatStatus(status: AdmissionStatus): string {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  }

  getStatusBadgeClass(status: AdmissionStatus): string {
    switch (status) {
      case AdmissionStatus.ADMITTED: return 'badge-success';
      case AdmissionStatus.REJECTED: return 'badge-danger';
      case AdmissionStatus.WAITLISTED: return 'badge-warning';
      case AdmissionStatus.PAYMENT_PENDING: return 'badge-info';
      default: return 'badge-accent';
    }
  }
}

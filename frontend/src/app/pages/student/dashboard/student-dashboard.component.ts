import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { StudentService } from '../../../services/student.service';
import { NotificationService } from '../../../services/notification.service';
import { PaymentService } from '../../../services/payment.service';
import { StudentResponse } from '../../../models/student.model';
import { NotificationResponse } from '../../../models/notification.model';
import { PaymentResponse } from '../../../models/payment.model';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container dashboard">
      <div class="page-header" *ngIf="student">
        <div class="profile-header">
          <div class="avatar">{{student.firstName[0]}}{{student.lastName[0]}}</div>
          <div>
            <h1>{{student.firstName}} {{student.middleName ? student.middleName + ' ' : ''}}{{student.lastName}}</h1>
            <div class="profile-meta">
              <span class="reg-number">{{student.registrationNumber}}</span>
              <span class="badge" [class]="student.active ? 'badge-success' : 'badge-danger'">
                {{student.active ? 'Active' : 'Inactive'}}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="stat-card cgpa-card">
          <div class="stat-label">Current CGPA</div>
          <div class="stat-value cgpa-value">{{student?.cgpa?.toFixed(2) || 'N/A'}}</div>
        </div>

        <div class="card results-section" *ngIf="results.length">
          <h3>Year Results</h3>
          <div class="results-list">
            <div class="result-row" *ngFor="let r of results">
              <div class="result-info">
                <span class="year-label">Year {{r.yearNumber}}</span>
                <span class="session-name">{{r.academicSessionName}}</span>
              </div>
              <div class="result-stats">
                <div class="result-stat">
                  <span class="stat-mini-label">GPA</span>
                  <span class="stat-mini-value">{{r.gpa.toFixed(2)}}</span>
                </div>
                <div class="result-stat">
                  <span class="stat-mini-label">Credits</span>
                  <span class="stat-mini-value">{{r.totalCreditHours}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card notifications-section">
          <div class="section-header">
            <h3>Notifications</h3>
            <span class="badge badge-info" *ngIf="unreadCount > 0">{{unreadCount}} unread</span>
          </div>
          <div class="notification-list" *ngIf="notifications.length">
            <div class="notification-item" *ngFor="let n of notifications" [class.unread]="!n.read">
              <div class="notif-icon" [attr.data-type]="n.type">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <div class="notif-body">
                <div class="notif-title">{{n.title}}</div>
                <div class="notif-msg">{{n.message}}</div>
                <div class="notif-time">{{n.createdAt | date:'short'}}</div>
              </div>
            </div>
          </div>
          <div class="empty-state" *ngIf="!notifications.length">
            <p>No notifications yet.</p>
          </div>
        </div>

        <div class="card payments-section">
          <h3>Recent Payments</h3>
          <div class="payment-list" *ngIf="payments.length">
            <div class="payment-row" *ngFor="let p of payments">
              <div class="payment-info">
                <span class="payment-type">{{p.paymentType}}</span>
                <span class="payment-date">{{p.paidAt | date:'short'}}</span>
              </div>
              <div class="payment-amount">
                <span class="amount">{{p.amount | currency:p.currency:'symbol':'1.0-0'}}</span>
                <span class="badge" [class]="getStatusClass(p.status)">{{p.status}}</span>
              </div>
            </div>
          </div>
          <div class="empty-state" *ngIf="!payments.length">
            <p>No payment records.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { padding: 2rem 0 3rem; }
    .profile-header {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--primary);
      color: var(--text-inverse);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.25rem;
      flex-shrink: 0;
    }
    .profile-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.25rem;
    }
    .reg-number {
      font-family: monospace;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }
    .cgpa-card {
      text-align: center;
      padding: 1.5rem;
      .cgpa-value { font-size: 2.5rem; color: var(--accent-dark); }
      .stat-label { font-size: 0.875rem; }
    }
    .results-section, .notifications-section, .payments-section {
      padding: 1.5rem;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .results-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .result-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: var(--bg-page);
      border-radius: var(--radius);
    }
    .result-info {
      display: flex;
      flex-direction: column;
      .year-label { font-weight: 600; font-size: 0.9375rem; }
      .session-name { font-size: 0.8125rem; color: var(--text-muted); }
    }
    .result-stats { display: flex; gap: 1.5rem; }
    .result-stat {
      text-align: center;
      .stat-mini-label { display: block; font-size: 0.6875rem; color: var(--text-muted); text-transform: uppercase; }
      .stat-mini-value { font-weight: 600; font-size: 1rem; }
    }
    .notification-list { display: flex; flex-direction: column; gap: 0.5rem; max-height: 300px; overflow-y: auto; }
    .notification-item {
      display: flex;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: var(--radius);
      border: 1px solid var(--border-light);
      &.unread { background: rgba(15, 42, 74, 0.03); border-color: var(--primary); }
    }
    .notif-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--info-bg);
      color: var(--info);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .notif-body { flex: 1; min-width: 0; }
    .notif-title { font-weight: 500; font-size: 0.875rem; }
    .notif-msg { font-size: 0.8125rem; color: var(--text-secondary); margin-top: 0.125rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .notif-time { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem; }
    .payment-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .payment-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: var(--bg-page);
      border-radius: var(--radius);
    }
    .payment-info {
      display: flex;
      flex-direction: column;
      .payment-type { font-weight: 500; font-size: 0.875rem; }
      .payment-date { font-size: 0.75rem; color: var(--text-muted); }
    }
    .payment-amount {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      .amount { font-weight: 600; }
    }
    .empty-state { text-align: center; padding: 2rem 0; color: var(--text-muted); font-size: 0.875rem; }
    h3 { font-size: 1rem; color: var(--primary); margin-bottom: 1rem; }
    @media (max-width: 768px) {
      .dashboard-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class StudentDashboardComponent implements OnInit {
  student: StudentResponse | null = null;
  notifications: NotificationResponse[] = [];
  payments: PaymentResponse[] = [];
  results: any[] = [];
  unreadCount = 0;

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private notificationService: NotificationService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.loadStudent();
    this.loadNotifications();
  }

  private loadStudent(): void {
    this.studentService.listAll(0, 1).subscribe({
      next: (res: any) => {
        const students = res.data?.content || [];
        if (students.length > 0) {
          this.student = students[0];
        }
      },
      error: () => {},
    });
  }

  private loadNotifications(): void {
    this.notificationService.getMyNotifications().subscribe({
      next: (res: any) => {
        this.notifications = (res.data || []).slice(0, 10);
        this.unreadCount = this.notifications.filter((n: any) => !n.read).length;
      },
      error: () => {},
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'badge-success';
      case 'INITIATED': return 'badge-warning';
      case 'FAILED': return 'badge-danger';
      default: return 'badge-info';
    }
  }
}

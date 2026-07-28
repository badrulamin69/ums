import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CrudService } from '../../../core/services/crud.service';
import { ToastService } from '../../../core/services/toast.service';

interface PaymentResult {
  id: number;
  transactionId: string;
  paymentType: string;
  amount: number;
  currency: string;
  status: string;
  paidAt: string;
}

@Component({
  selector: 'app-payment-result',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="payment-result-page">
      <div class="result-card">
        @if (loading()) {
          <div class="result-loading">
            <div class="spinner"></div>
            <p>Verifying your payment...</p>
          </div>
        } @else if (payment()) {
          @if (payment()!.status === 'COMPLETED') {
            <div class="result-icon success">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="2"/>
                <path d="M20 32l8 8 16-16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h1>Payment Successful</h1>
            <p class="result-message">Your payment has been processed successfully.</p>
            <div class="payment-details">
              <div class="detail-row">
                <span>Transaction ID</span>
                <span>{{ payment()!.transactionId }}</span>
              </div>
              <div class="detail-row">
                <span>Amount</span>
                <span>{{ payment()!.amount }} {{ payment()!.currency }}</span>
              </div>
              <div class="detail-row">
                <span>Status</span>
                <span class="status-badge completed">{{ payment()!.status }}</span>
              </div>
              <div class="detail-row">
                <span>Paid At</span>
                <span>{{ payment()!.paidAt | date:'medium' }}</span>
              </div>
            </div>
            <p class="admit-card-note">Your admit card has been generated. You can view it on your dashboard.</p>
          } @else {
            <div class="result-icon failed">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="2"/>
                <path d="M22 22l20 20M42 22L22 42" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
            </div>
            <h1>Payment Failed</h1>
            <p class="result-message">Your payment could not be processed. Please try again.</p>
            <div class="payment-details">
              <div class="detail-row">
                <span>Transaction ID</span>
                <span>{{ payment()!.transactionId }}</span>
              </div>
              <div class="detail-row">
                <span>Status</span>
                <span class="status-badge failed">{{ payment()!.status }}</span>
              </div>
            </div>
          }
          <p class="redirect-note">Redirecting to dashboard in {{ countdown() }} seconds...</p>
          <button class="btn btn-primary" (click)="goToDashboard()">Go to Dashboard Now</button>
        } @else {
          <div class="result-icon failed">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="2"/>
              <path d="M32 20v16M32 44h.01" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
          <h1>Payment Not Found</h1>
          <p class="result-message">We couldn't find the payment details.</p>
          <button class="btn btn-primary" (click)="goToDashboard()">Go to Dashboard</button>
        }
      </div>
    </div>
  `,
  styles: [`
    .payment-result-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - var(--navbar-height) - 2 * var(--content-padding));
    }

    .result-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 3rem;
      text-align: center;
      max-width: 480px;
      width: 100%;
    }

    .result-loading {
      padding: 2rem 0;
      p { color: var(--color-text-muted); margin-top: 1rem; }
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--color-border);
      border-top-color: var(--color-gold);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .result-icon {
      margin-bottom: 1.5rem;
      &.success { color: #22c55e; }
      &.failed { color: #ef4444; }
    }

    h1 {
      font-family: var(--font-display);
      font-size: var(--fs-h2);
      margin-bottom: 0.5rem;
    }

    .result-message {
      color: var(--color-text-muted);
      font-size: var(--fs-small);
      margin-bottom: 1.5rem;
    }

    .payment-details {
      background: var(--color-surface-elevated);
      border-radius: var(--radius-md);
      padding: 1rem;
      margin-bottom: 1.5rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      font-size: var(--fs-small);
      border-bottom: 1px solid var(--color-border);
      &:last-child { border-bottom: none; }
      span:first-child { color: var(--color-text-muted); }
      span:last-child { font-weight: var(--fw-medium); }
    }

    .status-badge {
      padding: 0.15rem 0.5rem;
      border-radius: var(--radius-sm);
      font-size: var(--fs-xs);
      font-weight: var(--fw-semibold);
      &.completed { background: #22c55e20; color: #22c55e; }
      &.failed { background: #ef444420; color: #ef4444; }
    }

    .admit-card-note {
      color: var(--color-gold);
      font-size: var(--fs-small);
      margin-bottom: 1.5rem;
    }

    .redirect-note {
      color: var(--color-text-muted);
      font-size: var(--fs-xs);
      margin-bottom: 1rem;
    }

    .btn {
      padding: 0.75rem 2rem;
      border-radius: var(--radius-md);
      font-weight: var(--fw-semibold);
      cursor: pointer;
      border: none;
      font-size: var(--fs-small);
    }

    .btn-primary {
      background: var(--color-gold);
      color: var(--color-bg);
      &:hover { opacity: 0.9; }
    }
  `],
})
export class PaymentResultComponent implements OnInit {
  payment = signal<PaymentResult | null>(null);
  loading = signal(true);
  countdown = signal(5);

  private transactionId = '';
  private timer: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private crud: CrudService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.transactionId = this.route.snapshot.queryParamMap.get('transactionId') || '';
    const status = this.route.snapshot.queryParamMap.get('status') || '';

    if (this.transactionId) {
      this.loadPayment();
    } else {
      this.loading.set(false);
    }

    this.startCountdown();
  }

  loadPayment(): void {
    this.crud.getById<PaymentResult>('payments', this.transactionId).subscribe({
      next: (data) => {
        this.payment.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Failed to load payment details');
      },
    });
  }

  startCountdown(): void {
    this.timer = setInterval(() => {
      const current = this.countdown();
      if (current <= 1) {
        clearInterval(this.timer);
        this.goToDashboard();
      } else {
        this.countdown.set(current - 1);
      }
    }, 1000);
  }

  goToDashboard(): void {
    clearInterval(this.timer);
    this.router.navigate(['/student/dashboard']);
  }
}

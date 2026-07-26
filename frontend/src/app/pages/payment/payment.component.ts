import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container page-content">
      <div class="page-header">
        <h1>Make a Payment</h1>
        <p>Complete your payment securely via SSLCommerz.</p>
      </div>

      <div class="card form-card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label" for="paymentType">Payment Type *</label>
            <select id="paymentType" class="form-input" formControlName="paymentType">
              <option value="">Select type</option>
              <option value="APPLICATION_FEE">Application Fee</option>
              <option value="ADMISSION_FEE">Admission Fee</option>
              <option value="SEMESTER_FEE">Semester Fee</option>
            </select>
            <div class="form-error" *ngIf="form.get('paymentType')?.touched && form.get('paymentType')?.invalid">
              Payment type is required.
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="referenceEntityType">Reference Type *</label>
            <input id="referenceEntityType" type="text" class="form-input" formControlName="referenceEntityType" placeholder="e.g. APPLICANT" />
            <div class="form-error" *ngIf="form.get('referenceEntityType')?.touched && form.get('referenceEntityType')?.invalid">
              Reference type is required.
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="referenceEntityId">Reference ID *</label>
            <input id="referenceEntityId" type="number" class="form-input" formControlName="referenceEntityId" />
            <div class="form-error" *ngIf="form.get('referenceEntityId')?.touched && form.get('referenceEntityId')?.invalid">
              Reference ID is required.
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="amount">Amount (BDT) *</label>
            <input id="amount" type="number" class="form-input" formControlName="amount" min="1" step="0.01" />
            <div class="form-error" *ngIf="form.get('amount')?.touched && form.get('amount')?.invalid">
              Amount must be greater than 0.
            </div>
          </div>

          <div class="form-error server-error" *ngIf="errorMsg">{{errorMsg}}</div>
          <div class="success-msg" *ngIf="successMsg">{{successMsg}}</div>

          <button type="submit" class="btn btn-accent btn-lg" style="width:100%;" [disabled]="loading || !!successMsg">
            {{loading ? 'Initiating Payment...' : 'Pay Now'}}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-content { padding: 2rem 0 3rem; }
    .form-card { max-width: 520px; padding: 2rem; }
    .server-error { text-align: center; margin-bottom: 1rem; }
    .success-msg {
      text-align: center;
      margin-bottom: 1rem;
      padding: 0.75rem;
      background: var(--success-bg);
      color: var(--success);
      border-radius: var(--radius);
      font-size: 0.875rem;
      font-weight: 500;
    }
  `],
})
export class PaymentComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      paymentType: ['', Validators.required],
      referenceEntityType: ['', Validators.required],
      referenceEntityId: [null, [Validators.required, Validators.min(1)]],
      amount: [null, [Validators.required, Validators.min(0.01)]],
    });

    this.route.queryParams.subscribe((params: any) => {
      if (params['paymentType']) this.form.patchValue({ paymentType: params['paymentType'] });
      if (params['referenceEntityType']) this.form.patchValue({ referenceEntityType: params['referenceEntityType'] });
      if (params['referenceEntityId']) this.form.patchValue({ referenceEntityId: Number(params['referenceEntityId']) });
      if (params['amount']) this.form.patchValue({ amount: Number(params['amount']) });
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    this.paymentService.initiatePayment(this.form.value).subscribe({
      next: (res: any) => {
        this.loading = false;
        const data = res.data;
        if (data?.sslCommerzGatewayUrl) {
          this.successMsg = 'Redirecting to payment gateway...';
          window.location.href = data.sslCommerzGatewayUrl;
        } else {
          this.successMsg = 'Payment initiated. Transaction ID: ' + data?.transactionId;
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Payment initiation failed.';
      },
    });
  }
}

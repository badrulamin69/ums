import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayrollService } from '../../../services/payroll.service';
import { PayrollRunResponse, PayslipResponse } from '../../../models/payroll.model';

@Component({
  selector: 'app-payroll-runs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container page-content">
      <div class="page-header">
        <h1>Payroll Runs</h1>
        <p>Run payroll and view payslips</p>
      </div>

      <div class="card run-card">
        <h3>Run Payroll</h3>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Month *</label>
            <select class="form-input" [(ngModel)]="selectedMonth">
              <option value="">Select Month</option>
              <option *ngFor="let m of months" [value]="m">{{m}}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Year *</label>
            <input type="number" class="form-input" [(ngModel)]="selectedYear" placeholder="2026" />
          </div>
          <div class="form-group form-group-btn">
            <button class="btn btn-accent btn-sm" [disabled]="running || !selectedMonth || !selectedYear" (click)="runPayroll()">
              {{running ? 'Running...' : 'Run Payroll'}}
            </button>
          </div>
        </div>
        <div class="form-error" *ngIf="runError">{{runError}}</div>
      </div>

      <div class="card result-card" *ngIf="lastRun">
        <h3>Payroll Run Result</h3>
        <div class="result-grid">
          <div class="result-item">
            <span class="result-label">Run ID</span>
            <span class="result-value">{{lastRun.id}}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Month</span>
            <span class="result-value">{{lastRun.month}}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Year</span>
            <span class="result-value">{{lastRun.year}}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Total Employees</span>
            <span class="result-value">{{lastRun.totalEmployees}}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Status</span>
            <span class="badge" [class]="lastRun.completed ? 'badge-success' : 'badge-info'">
              {{lastRun.completed ? 'Completed' : 'Processing'}}
            </span>
          </div>
        </div>
      </div>

      <div class="card payslips-card">
        <h3>View Payslips</h3>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Run ID</label>
            <input type="number" class="form-input" [(ngModel)]="payslipRunId" placeholder="Enter Run ID" />
          </div>
          <div class="form-group form-group-btn">
            <button class="btn btn-primary btn-sm" [disabled]="loadingPayslips || !payslipRunId" (click)="loadPayslips()">
              {{loadingPayslips ? 'Loading...' : 'Load Payslips'}}
            </button>
          </div>
        </div>
      </div>

      <div class="table-container" *ngIf="payslips.length">
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Basic Salary</th>
              <th>Gross Salary</th>
              <th>Tax Deduction</th>
              <th>Provident Fund</th>
              <th>Net Salary</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of payslips">
              <td><span class="emp-id">{{p.employeeId}}</span></td>
              <td class="name-cell">
                <div class="emp-name">{{p.employeeName}}</div>
              </td>
              <td>{{p.basicSalary | currency}}</td>
              <td>{{p.grossSalary | currency}}</td>
              <td>{{p.taxDeduction | currency}}</td>
              <td>{{p.providentFundDeduction | currency}}</td>
              <td><strong>{{p.netSalary | currency}}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="!loadingPayslips && payslips.length === 0 && payslipRunId && payslipsLoaded">
        <p>No payslips found for this run.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-content { padding: 2rem 0 3rem; }
    .run-card, .result-card, .payslips-card { margin-bottom: 1.5rem; }
    .card { padding: 1.25rem; }
    .card h3 { font-size: 1rem; color: var(--primary); margin-bottom: 1rem; }
    .form-row { display: flex; gap: 0.75rem; align-items: flex-end; flex-wrap: wrap; }
    .form-group-btn { display: flex; align-items: flex-end; }
    .form-error { text-align: center; margin-top: 0.75rem; color: var(--danger); font-size: 0.8125rem; }
    .result-grid { display: flex; gap: 1.5rem; flex-wrap: wrap; }
    .result-item { display: flex; flex-direction: column; gap: 0.25rem; }
    .result-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
    .result-value { font-size: 0.9375rem; font-weight: 600; }
    .emp-id { font-family: monospace; font-size: 0.8125rem; font-weight: 500; color: var(--primary); }
    .name-cell { min-width: 160px; }
    .emp-name { font-weight: 500; font-size: 0.875rem; }
    .empty-state { text-align: center; padding: 2rem 0; color: var(--text-muted); }
  `],
})
export class PayrollRunsComponent implements OnInit {
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  selectedMonth = '';
  selectedYear: number | null = null;
  running = false;
  runError = '';
  lastRun: PayrollRunResponse | null = null;

  payslipRunId: number | null = null;
  payslips: PayslipResponse[] = [];
  loadingPayslips = false;
  payslipsLoaded = false;

  constructor(private payrollService: PayrollService) {}

  ngOnInit(): void {}

  runPayroll(): void {
    if (!this.selectedMonth || !this.selectedYear) return;
    this.running = true;
    this.runError = '';

    this.payrollService.runPayroll(this.selectedMonth, this.selectedYear).subscribe({
      next: (res: any) => {
        this.lastRun = res.data;
        this.running = false;
      },
      error: (err: any) => {
        this.running = false;
        this.runError = err.error?.message || 'Failed to run payroll.';
      },
    });
  }

  loadPayslips(): void {
    if (!this.payslipRunId) return;
    this.loadingPayslips = true;
    this.payslipsLoaded = false;

    this.payrollService.getPayslipsByRun(this.payslipRunId).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.payslips = Array.isArray(data) ? data : (data?.content || []);
        this.loadingPayslips = false;
        this.payslipsLoaded = true;
      },
      error: () => {
        this.loadingPayslips = false;
        this.payslipsLoaded = true;
      },
    });
  }
}

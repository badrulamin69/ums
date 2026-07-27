import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CrudService } from '../../../core/services/crud.service';
import { ToastService } from '../../../core/services/toast.service';

interface AttendanceResponse {
  id: number; employeeId: number; date: string; checkInTime: string; checkOutTime: string; status: string;
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent],
  template: `
    <app-page-header title="Attendance" subtitle="Track employee attendance and check-ins" />

    <div class="attendance-grid animate-fade-in-up stagger-1">
      <div class="card card-elevated">
        <div class="card-header"><h3>Quick Actions</h3></div>
        <div class="card-body">
          <div class="action-row">
            <button class="btn btn-gold btn-lg" (click)="checkIn()" [disabled]="checking()">
              @if (checking()) { <span class="spinner-sm"></span> Processing... } @else { Check In }
            </button>
            <button class="btn btn-outline-gold btn-lg" (click)="checkOut()" [disabled]="checking()">
              Check Out
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card card-elevated animate-fade-in-up stagger-2" style="margin-top: 1.5rem">
      <div class="card-header">
        <h3>Recent Records</h3>
      </div>
      <div class="card-body">
        @if (records().length === 0) {
          <div class="empty-state"><p>No attendance records found.</p></div>
        } @else {
          <div class="table-scroll">
            <table class="table">
              <thead><tr><th>Date</th><th>Check In</th><th>Check Out</th><th>Status</th></tr></thead>
              <tbody>
                @for (r of records(); track r.id) {
                  <tr>
                    <td>{{ r.date }}</td>
                    <td>{{ r.checkInTime || '--' }}</td>
                    <td>{{ r.checkOutTime || '--' }}</td>
                    <td><span class="badge" [class]="'badge-' + statusColor(r.status)">{{ r.status }}</span></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .attendance-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
    .action-row { display: flex; gap: 1rem; }
    .btn-lg { padding: 0.75rem 2rem; font-size: var(--fs-body); }
    .empty-state { text-align: center; padding: 2rem; color: var(--color-text-muted); font-size: var(--fs-small); }
    .table-scroll { overflow-x: auto; }
    .table { --bs-table-bg: transparent; --bs-table-color: var(--color-text-primary); --bs-table-border-color: var(--color-border); width: 100%; margin-bottom: 0;
      thead th { font-weight: var(--fw-semibold); color: var(--color-text-muted); text-transform: uppercase; font-size: var(--fs-xs); letter-spacing: 0.06em; padding: 0.75rem 1rem; border-bottom: 1px solid var(--color-border); }
      tbody td { padding: 0.75rem 1rem; font-size: var(--fs-small); border-bottom: 1px solid var(--color-border); }
    }
    .badge { font-size: var(--fs-xs); font-weight: var(--fw-semibold); padding: 0.25rem 0.625rem; border-radius: 999px; }
    .badge-success { background: var(--color-success-bg); color: var(--color-success); }
    .badge-warning { background: var(--color-warning-bg); color: var(--color-warning); }
    .badge-info { background: var(--color-info-bg); color: var(--color-info); }
    .spinner-sm { width: 14px; height: 14px; border: 2px solid transparent; border-top-color: currentColor; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block; }
  `],
})
export class AttendanceComponent implements OnInit {
  records = signal<AttendanceResponse[]>([]);
  checking = signal(false);
  private employeeId: number | null = null;

  constructor(private crud: CrudService, private toast: ToastService) {}
  ngOnInit(): void {
    this.crud.getById<any>('employees', 'me').subscribe({
      next: (employee) => {
        this.employeeId = employee?.id ?? null;
        if (this.employeeId) this.loadRecords(this.employeeId);
      },
      error: () => {},
    });
  }

  loadRecords(employeeId: number): void {
    this.crud.getById<AttendanceResponse[]>('attendance/employee', employeeId).subscribe({
      next: (data) => this.records.set(data || []),
      error: () => this.records.set([]),
    });
  }

  checkIn(): void {
    this.checking.set(true);
    this.crud.customPost<any, AttendanceResponse>('attendance/check-in', { date: new Date().toISOString().split('T')[0] }).subscribe({
      next: () => {
        this.toast.success('Checked in successfully');
        this.checking.set(false);
        if (this.employeeId) this.loadRecords(this.employeeId);
      },
      error: () => this.checking.set(false),
    });
  }

  checkOut(): void {
    this.checking.set(true);
    this.crud.customPost<any, AttendanceResponse>('attendance/check-out', { date: new Date().toISOString().split('T')[0] }).subscribe({
      next: () => {
        this.toast.success('Checked out successfully');
        this.checking.set(false);
        if (this.employeeId) this.loadRecords(this.employeeId);
      },
      error: () => this.checking.set(false),
    });
  }

  statusColor(s: string): string {
    const map: Record<string, string> = { PRESENT: 'success', ABSENT: 'danger', LATE: 'warning', ON_LEAVE: 'info' };
    return map[s] || 'info';
  }
}

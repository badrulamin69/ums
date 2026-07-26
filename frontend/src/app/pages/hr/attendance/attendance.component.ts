import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrmService } from '../../../services/hrm.service';
import { AttendanceResponse } from '../../../models/hrm.model';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container page-content">
      <div class="page-header">
        <h1>Attendance Management</h1>
        <p>Track and manage employee attendance</p>
      </div>

      <div class="checkin-bar card" *ngIf="ownEmployeeId">
        <span class="checkin-label">Quick Actions:</span>
        <button class="btn btn-primary btn-sm" (click)="doCheckIn()" [disabled]="checking">
          {{checking ? 'Processing...' : 'Check In'}}
        </button>
        <button class="btn btn-outline btn-sm" (click)="doCheckOut()" [disabled]="checking">
          {{checking ? 'Processing...' : 'Check Out'}}
        </button>
        <span class="checkin-msg success" *ngIf="checkMsg">{{checkMsg}}</span>
        <span class="checkin-msg error" *ngIf="checkErr">{{checkErr}}</span>
      </div>

      <div class="toolbar">
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label">Employee ID</label>
          <input type="number" class="form-input" [(ngModel)]="employeeId" placeholder="Employee ID" style="max-width:160px;" />
        </div>
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label">Start Date</label>
          <input type="date" class="form-input" [(ngModel)]="startDate" />
        </div>
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label">End Date</label>
          <input type="date" class="form-input" [(ngModel)]="endDate" />
        </div>
        <button class="btn btn-primary" (click)="loadAttendance()" [disabled]="!employeeId">Load</button>
      </div>

      <div class="table-container" *ngIf="records.length">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of records">
              <td>{{r.date | date:'mediumDate'}}</td>
              <td>{{r.checkInTime || '—'}}</td>
              <td>{{r.checkOutTime || '—'}}</td>
              <td>
                <span class="badge" [class]="getStatusClass(r.status)">{{r.status}}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="!loading && records.length === 0 && employeeId">
        <p>No attendance records found for this period.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-content { padding: 2rem 0 3rem; }
    .checkin-bar {
      display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;
      padding: 1rem 1.5rem; flex-wrap: wrap;
    }
    .checkin-label { font-weight: 500; font-size: 0.875rem; color: var(--text-secondary); }
    .checkin-msg { font-size: 0.8125rem; font-weight: 500;
      &.success { color: var(--success); }
      &.error { color: var(--danger); }
    }
    .toolbar {
      display: flex; align-items: flex-end; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap;
    }
    .empty-state { text-align: center; padding: 3rem 0; color: var(--text-muted); }
  `],
})
export class AttendanceComponent implements OnInit {
  records: AttendanceResponse[] = [];
  loading = false;
  employeeId: number | null = null;
  startDate = '';
  endDate = '';
  ownEmployeeId: number | null = null;
  checking = false;
  checkMsg = '';
  checkErr = '';

  constructor(private hrmService: HrmService) {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    this.startDate = firstDay.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.hrmService.getMyEmployee().subscribe({
      next: (res: any) => {
        if (res.data) {
          this.ownEmployeeId = res.data.id;
          this.employeeId = res.data.id;
        }
      },
      error: () => {},
    });
  }

  loadAttendance(): void {
    if (!this.employeeId) return;
    this.loading = true;
    this.hrmService.getAttendance(this.employeeId, this.startDate, this.endDate).subscribe({
      next: (res: any) => {
        this.records = res.data || [];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  doCheckIn(): void {
    if (!this.ownEmployeeId) return;
    this.checking = true;
    this.checkMsg = '';
    this.checkErr = '';
    this.hrmService.checkIn(this.ownEmployeeId).subscribe({
      next: (res: any) => {
        this.checking = false;
        this.checkMsg = 'Checked in successfully.';
        if (this.employeeId === this.ownEmployeeId) this.loadAttendance();
      },
      error: (err: any) => {
        this.checking = false;
        this.checkErr = err.error?.message || 'Check-in failed.';
      },
    });
  }

  doCheckOut(): void {
    if (!this.ownEmployeeId) return;
    this.checking = true;
    this.checkMsg = '';
    this.checkErr = '';
    this.hrmService.checkOut(this.ownEmployeeId).subscribe({
      next: (res: any) => {
        this.checking = false;
        this.checkMsg = 'Checked out successfully.';
        if (this.employeeId === this.ownEmployeeId) this.loadAttendance();
      },
      error: (err: any) => {
        this.checking = false;
        this.checkErr = err.error?.message || 'Check-out failed.';
      },
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PRESENT': return 'badge-success';
      case 'ABSENT': return 'badge-danger';
      case 'LATE': return 'badge-warning';
      case 'ON_LEAVE': return 'badge-info';
      default: return 'badge-accent';
    }
  }
}

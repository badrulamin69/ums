import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HrmService } from '../../../services/hrm.service';
import { EmployeeResponse } from '../../../models/hrm.model';
import { Gender, EmployeeType } from '../../../models/common.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()"></div>
    <div class="modal card">
      <div class="modal-header">
        <h3>{{editEmployee ? 'Edit Employee' : 'Add Employee'}}</h3>
        <button class="btn-close" (click)="close.emit()">&times;</button>
      </div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">First Name *</label>
            <input class="form-input" formControlName="firstName" />
          </div>
          <div class="form-group">
            <label class="form-label">Middle Name</label>
            <input class="form-input" formControlName="middleName" />
          </div>
          <div class="form-group">
            <label class="form-label">Last Name *</label>
            <input class="form-input" formControlName="lastName" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Phone *</label>
            <input class="form-input" formControlName="phone" placeholder="+8801XXXXXXXXX" />
          </div>
          <div class="form-group">
            <label class="form-label">Gender *</label>
            <select class="form-input" formControlName="gender">
              <option value="">Select</option>
              <option *ngFor="let g of genders" [value]="g">{{g}}</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Date of Birth *</label>
            <input type="date" class="form-input" formControlName="dateOfBirth" />
          </div>
          <div class="form-group">
            <label class="form-label">Employee Type *</label>
            <select class="form-input" formControlName="employeeType">
              <option value="">Select</option>
              <option *ngFor="let t of employeeTypes" [value]="t">{{t}}</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Department</label>
            <input class="form-input" formControlName="department" />
          </div>
          <div class="form-group">
            <label class="form-label">Designation ID</label>
            <input type="number" class="form-input" formControlName="designationId" />
          </div>
          <div class="form-group">
            <label class="form-label">Grade ID</label>
            <input type="number" class="form-input" formControlName="gradeId" />
          </div>
        </div>
        <div class="form-error server-error" *ngIf="errorMsg">{{errorMsg}}</div>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline btn-sm" (click)="close.emit()">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm" [disabled]="loading">
            {{loading ? 'Saving...' : (editEmployee ? 'Update' : 'Create')}}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 30;
    }
    .modal {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 90%; max-width: 640px; max-height: 90vh; overflow-y: auto;
      z-index: 31; padding: 1.5rem;
    }
    .modal-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;
      h3 { font-size: 1.125rem; color: var(--primary); }
    }
    .btn-close {
      background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted); padding: 0;
      &:hover { color: var(--danger); }
    }
    .form-row {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem;
    }
    .server-error { text-align: center; margin-bottom: 0.75rem; }
    .modal-actions {
      display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.25rem; padding-top: 1rem;
      border-top: 1px solid var(--border-light);
    }
  `],
})
export class EmployeeFormComponent implements OnInit {
  @Input() editEmployee: EmployeeResponse | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  form!: FormGroup;
  loading = false;
  errorMsg = '';
  genders = Object.values(Gender);
  employeeTypes = Object.values(EmployeeType);

  constructor(private fb: FormBuilder, private hrmService: HrmService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      userId: [this.editEmployee?.userId || null, Validators.required],
      firstName: [this.editEmployee?.firstName || '', Validators.required],
      middleName: [this.editEmployee?.middleName || ''],
      lastName: [this.editEmployee?.lastName || '', Validators.required],
      phone: [this.editEmployee?.phone || '', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      gender: [this.editEmployee?.gender || '', Validators.required],
      dateOfBirth: [this.editEmployee?.dateOfBirth || '', Validators.required],
      employeeType: [this.editEmployee?.employeeType || '', Validators.required],
      designationId: [this.editEmployee?.designationId || null],
      gradeId: [this.editEmployee?.gradeId || null],
      department: [this.editEmployee?.department || ''],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';

    const req = this.form.value;
    if (this.editEmployee) {
      this.hrmService.updateEmployee(this.editEmployee.id, req).subscribe({
        next: () => { this.saved.emit(); this.close.emit(); },
        error: (err: any) => { this.loading = false; this.errorMsg = err.error?.message || 'Update failed.'; },
      });
    } else {
      this.hrmService.createEmployee(req).subscribe({
        next: () => { this.saved.emit(); this.close.emit(); },
        error: (err: any) => { this.loading = false; this.errorMsg = err.error?.message || 'Creation failed.'; },
      });
    }
  }
}

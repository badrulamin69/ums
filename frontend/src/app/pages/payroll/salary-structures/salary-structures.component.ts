import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayrollService } from '../../../services/payroll.service';
import { SalaryStructureResponse, SalaryStructureRequest } from '../../../models/payroll.model';

@Component({
  selector: 'app-salary-structures',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container page-content">
      <div class="page-header">
        <h1>Salary Structures</h1>
        <p>Manage salary grades and allowances</p>
      </div>

      <div class="toolbar">
        <button class="btn btn-accent btn-sm" (click)="showForm=true; resetForm()">Add Salary Structure</button>
      </div>

      <div class="table-container" *ngIf="structures.length">
        <table>
          <thead>
            <tr>
              <th>Grade</th>
              <th>Basic Salary</th>
              <th>House Allowance</th>
              <th>Medical Allowance</th>
              <th>Transport Allowance</th>
              <th>Tax Rate</th>
              <th>Provident Fund Rate</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of structures">
              <td><span class="grade-name">{{s.gradeName}}</span></td>
              <td>{{s.basicSalary | currency}}</td>
              <td>{{s.houseAllowance | currency}}</td>
              <td>{{s.medicalAllowance | currency}}</td>
              <td>{{s.transportAllowance | currency}}</td>
              <td><span class="badge badge-info">{{s.taxRate}}%</span></td>
              <td><span class="badge badge-info">{{s.providentFundRate}}%</span></td>
              <td class="actions-cell">
                <button class="btn btn-outline btn-sm" (click)="editStructure=s; showForm=true">Edit</button>
                <button class="btn btn-danger btn-sm" (click)="deleteStructure(s)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="!loading && structures.length === 0">
        <p>No salary structures found.</p>
      </div>

      <div class="loading-state" *ngIf="loading">
        <p>Loading salary structures...</p>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showForm" (click)="showForm=false"></div>
    <div class="modal card" *ngIf="showForm">
      <div class="modal-header">
        <h3>{{editStructure ? 'Edit Salary Structure' : 'Add Salary Structure'}}</h3>
        <button class="btn-close" (click)="showForm=false">&times;</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Grade ID *</label>
          <input type="number" class="form-input" [(ngModel)]="formModel.gradeId" placeholder="Grade ID" />
        </div>
        <div class="form-group">
          <label class="form-label">Basic Salary *</label>
          <input type="number" class="form-input" [(ngModel)]="formModel.basicSalary" placeholder="0.00" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">House Allowance *</label>
          <input type="number" class="form-input" [(ngModel)]="formModel.houseAllowance" placeholder="0.00" />
        </div>
        <div class="form-group">
          <label class="form-label">Medical Allowance *</label>
          <input type="number" class="form-input" [(ngModel)]="formModel.medicalAllowance" placeholder="0.00" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Transport Allowance *</label>
          <input type="number" class="form-input" [(ngModel)]="formModel.transportAllowance" placeholder="0.00" />
        </div>
        <div class="form-group">
          <label class="form-label">Tax Rate (%) *</label>
          <input type="number" class="form-input" [(ngModel)]="formModel.taxRate" placeholder="0" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Provident Fund Rate (%) *</label>
          <input type="number" class="form-input" [(ngModel)]="formModel.providentFundRate" placeholder="0" />
        </div>
      </div>
      <div class="form-error server-error" *ngIf="errorMsg">{{errorMsg}}</div>
      <div class="modal-actions">
        <button type="button" class="btn btn-outline btn-sm" (click)="showForm=false">Cancel</button>
        <button type="button" class="btn btn-primary btn-sm" [disabled]="submitting" (click)="onSubmit()">
          {{submitting ? 'Saving...' : (editStructure ? 'Update' : 'Create')}}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .page-content { padding: 2rem 0 3rem; }
    .toolbar { display: flex; gap: 0.75rem; margin-bottom: 1.25rem; align-items: center; }
    .grade-name { font-weight: 500; font-size: 0.875rem; }
    .actions-cell { white-space: nowrap; display: flex; gap: 0.375rem; }
    .empty-state, .loading-state { text-align: center; padding: 3rem 0; color: var(--text-muted); }
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 30; }
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
    .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; }
    .server-error { text-align: center; margin-bottom: 0.75rem; }
    .modal-actions {
      display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.25rem; padding-top: 1rem;
      border-top: 1px solid var(--border-light);
    }
  `],
})
export class SalaryStructuresComponent implements OnInit {
  structures: SalaryStructureResponse[] = [];
  loading = true;
  showForm = false;
  editStructure: SalaryStructureResponse | null = null;
  submitting = false;
  errorMsg = '';

  formModel: SalaryStructureRequest = {
    gradeId: 0,
    basicSalary: 0,
    houseAllowance: 0,
    medicalAllowance: 0,
    transportAllowance: 0,
    taxRate: 0,
    providentFundRate: 0,
  };

  constructor(private payrollService: PayrollService) {}

  ngOnInit(): void {
    this.loadStructures();
  }

  loadStructures(): void {
    this.loading = true;
    this.payrollService.getSalaryStructures().subscribe({
      next: (res: any) => {
        const data = res.data;
        this.structures = Array.isArray(data) ? data : (data?.content || []);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  resetForm(): void {
    this.editStructure = null;
    this.errorMsg = '';
    this.formModel = {
      gradeId: 0,
      basicSalary: 0,
      houseAllowance: 0,
      medicalAllowance: 0,
      transportAllowance: 0,
      taxRate: 0,
      providentFundRate: 0,
    };
  }

  onSubmit(): void {
    if (!this.formModel.gradeId) return;
    this.submitting = true;
    this.errorMsg = '';

    this.payrollService.createSalaryStructure(this.formModel).subscribe({
      next: () => {
        this.showForm = false;
        this.loadStructures();
        this.submitting = false;
      },
      error: (err: any) => {
        this.submitting = false;
        this.errorMsg = err.error?.message || 'Failed to save salary structure.';
      },
    });
  }

  deleteStructure(s: SalaryStructureResponse): void {
    if (!confirm(`Delete salary structure for ${s.gradeName}?`)) return;
    this.payrollService.createSalaryStructure({ ...s, gradeId: s.gradeId }).subscribe({
      next: () => this.loadStructures(),
      error: () => {},
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrmService } from '../../../services/hrm.service';
import { GradeResponse, GradeRequest } from '../../../models/hrm.model';

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container page-content">
      <div class="page-header">
        <h1>Grades</h1>
        <p>Manage salary grades and allowances</p>
      </div>

      <div class="toolbar">
        <input type="text" class="form-input search-input" placeholder="Search grades..."
               [(ngModel)]="searchTerm" (ngModelChange)="filterGrades()" />
        <button class="btn btn-accent btn-sm" (click)="showForm=true; editGrade=null">Add Grade</button>
      </div>

      <div class="table-container" *ngIf="filteredGrades.length">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Basic Salary</th>
              <th>House Allowance</th>
              <th>Medical Allowance</th>
              <th>Transport Allowance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let g of filteredGrades">
              <td class="name-cell">{{g.name}}</td>
              <td>{{g.basicSalary | currency}}</td>
              <td>{{g.houseAllowance | currency}}</td>
              <td>{{g.medicalAllowance | currency}}</td>
              <td>{{g.transportAllowance | currency}}</td>
              <td>
                <span class="badge" [class]="g.active ? 'badge-success' : 'badge-danger'">
                  {{g.active ? 'Active' : 'Inactive'}}
                </span>
              </td>
              <td class="actions-cell">
                <button class="btn btn-outline btn-sm" (click)="editGrade=g; showForm=true">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="!loading && filteredGrades.length === 0">
        <p>{{searchTerm ? 'No grades match your search.' : 'No grades found.'}}</p>
      </div>

      <div class="loading-state" *ngIf="loading">
        <p>Loading grades...</p>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showForm" (click)="showForm=false"></div>
    <div class="modal card" *ngIf="showForm">
      <div class="modal-header">
        <h3>{{editGrade ? 'Edit Grade' : 'Add Grade'}}</h3>
        <button class="btn-close" (click)="showForm=false">&times;</button>
      </div>
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label class="form-label">Name *</label>
          <input type="text" class="form-input" [(ngModel)]="formData.name" name="name" required />
        </div>
        <div class="form-group">
          <label class="form-label">Basic Salary *</label>
          <input type="number" class="form-input" [(ngModel)]="formData.basicSalary" name="basicSalary" required />
        </div>
        <div class="form-group">
          <label class="form-label">House Allowance *</label>
          <input type="number" class="form-input" [(ngModel)]="formData.houseAllowance" name="houseAllowance" required />
        </div>
        <div class="form-group">
          <label class="form-label">Medical Allowance *</label>
          <input type="number" class="form-input" [(ngModel)]="formData.medicalAllowance" name="medicalAllowance" required />
        </div>
        <div class="form-group">
          <label class="form-label">Transport Allowance *</label>
          <input type="number" class="form-input" [(ngModel)]="formData.transportAllowance" name="transportAllowance" required />
        </div>
        <div class="form-error server-error" *ngIf="errorMsg">{{errorMsg}}</div>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline btn-sm" (click)="showForm=false">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm" [disabled]="loading">
            {{loading ? 'Saving...' : (editGrade ? 'Update' : 'Create')}}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page-content { padding: 2rem 0 3rem; }
    .toolbar {
      display: flex; gap: 0.75rem; margin-bottom: 1.25rem; align-items: center;
    }
    .search-input { max-width: 320px; }
    .name-cell { font-weight: 500; }
    .actions-cell { white-space: nowrap; display: flex; gap: 0.375rem; }
    .empty-state, .loading-state { text-align: center; padding: 3rem 0; color: var(--text-muted); }
    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 30;
    }
    .modal {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto;
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
    .server-error { text-align: center; margin-bottom: 0.75rem; }
    .modal-actions {
      display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.25rem; padding-top: 1rem;
      border-top: 1px solid var(--border-light);
    }
  `],
})
export class GradesComponent implements OnInit {
  grades: GradeResponse[] = [];
  filteredGrades: GradeResponse[] = [];
  loading = true;
  searchTerm = '';
  showForm = false;
  editGrade: GradeResponse | null = null;
  formData: GradeRequest = { name: '', basicSalary: 0, houseAllowance: 0, medicalAllowance: 0, transportAllowance: 0 };
  errorMsg = '';

  constructor(private hrmService: HrmService) {}

  ngOnInit(): void {
    this.loadGrades();
  }

  loadGrades(): void {
    this.loading = true;
    this.hrmService.getGrades().subscribe({
      next: (res: any) => {
        const data = res.data;
        this.grades = Array.isArray(data) ? data : (data?.content || []);
        this.filteredGrades = this.grades;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  filterGrades(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredGrades = this.grades.filter((g) => {
      return !term || g.name.toLowerCase().includes(term);
    });
  }

  onSubmit(): void {
    if (!this.formData.name) return;
    this.loading = true;
    this.errorMsg = '';

    if (this.editGrade) {
      this.hrmService.updateGrade(this.editGrade.id, this.formData).subscribe({
        next: () => { this.showForm = false; this.loadGrades(); },
        error: (err: any) => { this.loading = false; this.errorMsg = err.error?.message || 'Update failed.'; },
      });
    } else {
      this.hrmService.createGrade(this.formData).subscribe({
        next: () => { this.showForm = false; this.loadGrades(); },
        error: (err: any) => { this.loading = false; this.errorMsg = err.error?.message || 'Creation failed.'; },
      });
    }
  }
}

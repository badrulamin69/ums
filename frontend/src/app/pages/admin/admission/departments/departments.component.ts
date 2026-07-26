import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdmissionService } from '../../../../services/admission.service';
import { DepartmentResponse, DepartmentRequest, FacultyResponse } from '../../../../models/admission.model';

@Component({
  selector: 'app-admin-departments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container page-content">
      <div class="page-header">
        <h1>Departments</h1>
        <p>Manage university departments</p>
      </div>

      <div class="toolbar">
        <input type="text" class="form-input search-input" placeholder="Search departments..."
               [(ngModel)]="searchTerm" (ngModelChange)="filterDepartments()" />
        <select class="form-input filter-select" [(ngModel)]="filterFacultyId" (ngModelChange)="filterDepartments()">
          <option value="">All Faculties</option>
          <option *ngFor="let f of faculties" [value]="f.id">{{f.name}}</option>
        </select>
        <button class="btn btn-accent btn-sm" (click)="openForm()">Add Department</button>
      </div>

      <div class="table-container" *ngIf="filteredDepartments.length">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Faculty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let d of filteredDepartments">
              <td class="name-cell"><div class="emp-name">{{d.name}}</div></td>
              <td><span class="emp-id">{{d.code}}</span></td>
              <td>{{d.facultyName || '—'}}</td>
              <td>
                <span class="badge" [class]="d.active ? 'badge-success' : 'badge-danger'">
                  {{d.active ? 'Active' : 'Inactive'}}
                </span>
              </td>
              <td class="actions-cell">
                <button class="btn btn-outline btn-sm" (click)="openForm(d)">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="!loading && filteredDepartments.length === 0">
        <p>{{searchTerm || filterFacultyId ? 'No departments match your filters.' : 'No departments found.'}}</p>
      </div>

      <div class="loading-state" *ngIf="loading">
        <p>Loading departments...</p>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showForm" (click)="closeForm()"></div>
    <div class="modal card" *ngIf="showForm">
      <div class="modal-header">
        <h3>{{editDepartment ? 'Edit Department' : 'Add Department'}}</h3>
        <button class="btn-close" (click)="closeForm()">&times;</button>
      </div>
      <form (ngSubmit)="onSubmit()">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Faculty *</label>
            <select class="form-input" [(ngModel)]="form.facultyId" name="facultyId" required>
              <option [ngValue]="null">Select Faculty</option>
              <option *ngFor="let f of faculties" [ngValue]="f.id">{{f.name}}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Name *</label>
            <input type="text" class="form-input" [(ngModel)]="form.name" name="name" required />
          </div>
          <div class="form-group">
            <label class="form-label">Code *</label>
            <input type="text" class="form-input" [(ngModel)]="form.code" name="code" required />
          </div>
        </div>
        <div class="form-error server-error" *ngIf="errorMsg">{{errorMsg}}</div>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline btn-sm" (click)="closeForm()">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm" [disabled]="saving">
            {{saving ? 'Saving...' : (editDepartment ? 'Update' : 'Create')}}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page-content { padding: 2rem 0 3rem; }
    .toolbar { display: flex; gap: 0.75rem; margin-bottom: 1.25rem; align-items: center; }
    .search-input { max-width: 320px; }
    .filter-select { max-width: 200px; }
    .emp-id { font-family: monospace; font-size: 0.8125rem; font-weight: 500; color: var(--primary); }
    .name-cell { min-width: 180px; }
    .emp-name { font-weight: 500; font-size: 0.875rem; }
    .actions-cell { white-space: nowrap; display: flex; gap: 0.375rem; }
    .empty-state, .loading-state { text-align: center; padding: 3rem 0; color: var(--text-muted); }
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 30; }
    .modal {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 90%; max-width: 560px; max-height: 90vh; overflow-y: auto;
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
export class AdminDepartmentsComponent implements OnInit {
  departments: DepartmentResponse[] = [];
  filteredDepartments: DepartmentResponse[] = [];
  faculties: FacultyResponse[] = [];
  loading = true;
  searchTerm = '';
  filterFacultyId = '';
  showForm = false;
  editDepartment: DepartmentResponse | null = null;
  saving = false;
  errorMsg = '';
  form: DepartmentRequest = { facultyId: null as any, name: '', code: '' };

  constructor(private admissionService: AdmissionService) {}

  ngOnInit(): void {
    this.loadFaculties();
    this.loadDepartments();
  }

  loadFaculties(): void {
    this.admissionService.getFaculties().subscribe({
      next: (res: any) => {
        const data = res.data;
        this.faculties = Array.isArray(data) ? data : (data?.content || []);
      },
      error: () => {},
    });
  }

  loadDepartments(): void {
    this.loading = true;
    this.admissionService.getAllDepartments().subscribe({
      next: (res: any) => {
        const data = res.data;
        this.departments = Array.isArray(data) ? data : (data?.content || []);
        this.filteredDepartments = this.departments.filter(d => d.active);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  filterDepartments(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredDepartments = this.departments.filter(d => {
      const matchesSearch = !term || d.name.toLowerCase().includes(term) || d.code.toLowerCase().includes(term);
      const matchesFaculty = !this.filterFacultyId || d.facultyId === +this.filterFacultyId;
      return matchesSearch && matchesFaculty && d.active;
    });
  }

  openForm(department?: DepartmentResponse): void {
    this.editDepartment = department || null;
    this.form = department
      ? { facultyId: department.facultyId, name: department.name, code: department.code }
      : { facultyId: null as any, name: '', code: '' };
    this.errorMsg = '';
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editDepartment = null;
    this.errorMsg = '';
  }

  onSubmit(): void {
    if (!this.form.facultyId || !this.form.name || !this.form.code) return;
    this.saving = true;
    this.errorMsg = '';

    if (this.editDepartment) {
      this.admissionService.updateDepartment(this.editDepartment.id, this.form).subscribe({
        next: () => { this.saved(); },
        error: (err: any) => { this.saving = false; this.errorMsg = err.error?.message || 'Update failed.'; },
      });
    } else {
      this.admissionService.createDepartment(this.form).subscribe({
        next: () => { this.saved(); },
        error: (err: any) => { this.saving = false; this.errorMsg = err.error?.message || 'Creation failed.'; },
      });
    }
  }

  private saved(): void {
    this.saving = false;
    this.closeForm();
    this.loadDepartments();
  }
}

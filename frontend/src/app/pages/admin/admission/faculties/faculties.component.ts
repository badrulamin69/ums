import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdmissionService } from '../../../../services/admission.service';
import { FacultyResponse, FacultyRequest } from '../../../../models/admission.model';

@Component({
  selector: 'app-admin-faculties',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container page-content">
      <div class="page-header">
        <h1>Faculties</h1>
        <p>Manage university faculties</p>
      </div>

      <div class="toolbar">
        <input type="text" class="form-input search-input" placeholder="Search faculties..."
               [(ngModel)]="searchTerm" (ngModelChange)="filterFaculties()" />
        <button class="btn btn-accent btn-sm" (click)="openForm()">Add Faculty</button>
      </div>

      <div class="table-container" *ngIf="filteredFaculties.length">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let f of filteredFaculties">
              <td class="name-cell"><div class="emp-name">{{f.name}}</div></td>
              <td><span class="emp-id">{{f.code}}</span></td>
              <td>{{f.description || '—'}}</td>
              <td>
                <span class="badge" [class]="f.active ? 'badge-success' : 'badge-danger'">
                  {{f.active ? 'Active' : 'Inactive'}}
                </span>
              </td>
              <td class="actions-cell">
                <button class="btn btn-outline btn-sm" (click)="openForm(f)">Edit</button>
                <button class="btn btn-danger btn-sm" (click)="deactivate(f)" *ngIf="f.active">Deactivate</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="!loading && filteredFaculties.length === 0">
        <p>{{searchTerm ? 'No faculties match your search.' : 'No faculties found.'}}</p>
      </div>

      <div class="loading-state" *ngIf="loading">
        <p>Loading faculties...</p>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showForm" (click)="closeForm()"></div>
    <div class="modal card" *ngIf="showForm">
      <div class="modal-header">
        <h3>{{editFaculty ? 'Edit Faculty' : 'Add Faculty'}}</h3>
        <button class="btn-close" (click)="closeForm()">&times;</button>
      </div>
      <form (ngSubmit)="onSubmit()">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Name *</label>
            <input type="text" class="form-input" [(ngModel)]="form.name" name="name" required />
          </div>
          <div class="form-group">
            <label class="form-label">Code *</label>
            <input type="text" class="form-input" [(ngModel)]="form.code" name="code" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group full-width">
            <label class="form-label">Description</label>
            <textarea class="form-input" [(ngModel)]="form.description" name="description" rows="3"></textarea>
          </div>
        </div>
        <div class="form-error server-error" *ngIf="errorMsg">{{errorMsg}}</div>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline btn-sm" (click)="closeForm()">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm" [disabled]="saving">
            {{saving ? 'Saving...' : (editFaculty ? 'Update' : 'Create')}}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page-content { padding: 2rem 0 3rem; }
    .toolbar { display: flex; gap: 0.75rem; margin-bottom: 1.25rem; align-items: center; }
    .search-input { max-width: 320px; }
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
    .full-width { grid-column: 1 / -1; }
    .server-error { text-align: center; margin-bottom: 0.75rem; }
    .modal-actions {
      display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.25rem; padding-top: 1rem;
      border-top: 1px solid var(--border-light);
    }
  `],
})
export class AdminFacultiesComponent implements OnInit {
  faculties: FacultyResponse[] = [];
  filteredFaculties: FacultyResponse[] = [];
  loading = true;
  searchTerm = '';
  showForm = false;
  editFaculty: FacultyResponse | null = null;
  saving = false;
  errorMsg = '';
  form: FacultyRequest = { name: '', code: '', description: '' };

  constructor(private admissionService: AdmissionService) {}

  ngOnInit(): void {
    this.loadFaculties();
  }

  loadFaculties(): void {
    this.loading = true;
    this.admissionService.getFaculties().subscribe({
      next: (res: any) => {
        const data = res.data;
        this.faculties = Array.isArray(data) ? data : (data?.content || []);
        this.filteredFaculties = this.faculties.filter(f => f.active);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  filterFaculties(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredFaculties = this.faculties.filter(f => {
      const matchesSearch = !term || f.name.toLowerCase().includes(term) || f.code.toLowerCase().includes(term);
      return matchesSearch && f.active;
    });
  }

  openForm(faculty?: FacultyResponse): void {
    this.editFaculty = faculty || null;
    this.form = faculty
      ? { name: faculty.name, code: faculty.code, description: faculty.description }
      : { name: '', code: '', description: '' };
    this.errorMsg = '';
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editFaculty = null;
    this.errorMsg = '';
  }

  onSubmit(): void {
    if (!this.form.name || !this.form.code) return;
    this.saving = true;
    this.errorMsg = '';

    if (this.editFaculty) {
      this.admissionService.updateFaculty(this.editFaculty.id, this.form).subscribe({
        next: () => { this.saved(); },
        error: (err: any) => { this.saving = false; this.errorMsg = err.error?.message || 'Update failed.'; },
      });
    } else {
      this.admissionService.createFaculty(this.form).subscribe({
        next: () => { this.saved(); },
        error: (err: any) => { this.saving = false; this.errorMsg = err.error?.message || 'Creation failed.'; },
      });
    }
  }

  private saved(): void {
    this.saving = false;
    this.closeForm();
    this.loadFaculties();
  }

  deactivate(faculty: FacultyResponse): void {
    if (!confirm(`Deactivate ${faculty.name}?`)) return;
    this.admissionService.updateFaculty(faculty.id, { name: faculty.name, code: faculty.code, description: faculty.description }).subscribe({
      next: () => this.loadFaculties(),
      error: () => {},
    });
  }
}

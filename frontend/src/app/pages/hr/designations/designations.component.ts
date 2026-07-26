import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrmService } from '../../../services/hrm.service';
import { DesignationResponse, DesignationRequest } from '../../../models/hrm.model';

@Component({
  selector: 'app-designations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container page-content">
      <div class="page-header">
        <h1>Designations</h1>
        <p>Manage staff designations and levels</p>
      </div>

      <div class="toolbar">
        <input type="text" class="form-input search-input" placeholder="Search designations..."
               [(ngModel)]="searchTerm" (ngModelChange)="filterDesignations()" />
        <button class="btn btn-accent btn-sm" (click)="showForm=true; editDesignation=null">Add Designation</button>
      </div>

      <div class="table-container" *ngIf="filteredDesignations.length">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Level</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let d of filteredDesignations">
              <td class="name-cell">{{d.name}}</td>
              <td>{{d.description || '—'}}</td>
              <td>{{d.level}}</td>
              <td>
                <span class="badge" [class]="d.active ? 'badge-success' : 'badge-danger'">
                  {{d.active ? 'Active' : 'Inactive'}}
                </span>
              </td>
              <td class="actions-cell">
                <button class="btn btn-outline btn-sm" (click)="editDesignation=d; showForm=true">Edit</button>
                <button class="btn btn-danger btn-sm" (click)="deactivate(d)" *ngIf="d.active">Deactivate</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="!loading && filteredDesignations.length === 0">
        <p>{{searchTerm ? 'No designations match your search.' : 'No designations found.'}}</p>
      </div>

      <div class="loading-state" *ngIf="loading">
        <p>Loading designations...</p>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showForm" (click)="showForm=false"></div>
    <div class="modal card" *ngIf="showForm">
      <div class="modal-header">
        <h3>{{editDesignation ? 'Edit Designation' : 'Add Designation'}}</h3>
        <button class="btn-close" (click)="showForm=false">&times;</button>
      </div>
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label class="form-label">Name *</label>
          <input type="text" class="form-input" [(ngModel)]="formData.name" name="name" required />
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <input type="text" class="form-input" [(ngModel)]="formData.description" name="description" />
        </div>
        <div class="form-group">
          <label class="form-label">Level *</label>
          <input type="number" class="form-input" [(ngModel)]="formData.level" name="level" required />
        </div>
        <div class="form-error server-error" *ngIf="errorMsg">{{errorMsg}}</div>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline btn-sm" (click)="showForm=false">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm" [disabled]="loading">
            {{loading ? 'Saving...' : (editDesignation ? 'Update' : 'Create')}}
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
export class DesignationsComponent implements OnInit {
  designations: DesignationResponse[] = [];
  filteredDesignations: DesignationResponse[] = [];
  loading = true;
  searchTerm = '';
  showForm = false;
  editDesignation: DesignationResponse | null = null;
  formData: DesignationRequest = { name: '', description: '', level: 1 };
  errorMsg = '';

  constructor(private hrmService: HrmService) {}

  ngOnInit(): void {
    this.loadDesignations();
  }

  loadDesignations(): void {
    this.loading = true;
    this.hrmService.getDesignations().subscribe({
      next: (res: any) => {
        const data = res.data;
        this.designations = Array.isArray(data) ? data : (data?.content || []);
        this.filteredDesignations = this.designations;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  filterDesignations(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredDesignations = this.designations.filter((d) => {
      return !term || d.name.toLowerCase().includes(term) || (d.description || '').toLowerCase().includes(term);
    });
  }

  onSubmit(): void {
    if (!this.formData.name || !this.formData.level) return;
    this.loading = true;
    this.errorMsg = '';

    if (this.editDesignation) {
      this.hrmService.updateDesignation(this.editDesignation.id, this.formData).subscribe({
        next: () => { this.showForm = false; this.loadDesignations(); },
        error: (err: any) => { this.loading = false; this.errorMsg = err.error?.message || 'Update failed.'; },
      });
    } else {
      this.hrmService.createDesignation(this.formData).subscribe({
        next: () => { this.showForm = false; this.loadDesignations(); },
        error: (err: any) => { this.loading = false; this.errorMsg = err.error?.message || 'Creation failed.'; },
      });
    }
  }

  deactivate(d: DesignationResponse): void {
    if (!confirm(`Deactivate "${d.name}"?`)) return;
    this.hrmService.deleteDesignation(d.id).subscribe({
      next: () => this.loadDesignations(),
      error: () => {},
    });
  }
}

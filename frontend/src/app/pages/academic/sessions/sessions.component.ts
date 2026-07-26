import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcademicService } from '../../../services/academic.service';
import { AcademicSessionResponse, AcademicSessionRequest } from '../../../models/academic.model';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container page-content">
      <div class="page-header">
        <h1>Academic Sessions</h1>
        <p>Manage academic sessions</p>
      </div>

      <div class="toolbar">
        <button class="btn btn-accent btn-sm" (click)="showForm = true; editSession = null">Add Session</button>
      </div>

      <div class="table-container" *ngIf="sessions.length">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Start Year</th>
              <th>End Year</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of sessions">
              <td>{{ s.name }}</td>
              <td>{{ s.startYear }}</td>
              <td>{{ s.endYear }}</td>
              <td>
                <span class="badge" [class]="s.active ? 'badge-success' : 'badge-danger'">
                  {{ s.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="actions-cell">
                <button class="btn btn-outline btn-sm" (click)="editSession = s; showForm = true">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="!loading && sessions.length === 0">
        <p>No academic sessions found.</p>
      </div>

      <div class="loading-state" *ngIf="loading">
        <p>Loading academic sessions...</p>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showForm" (click)="showForm = false"></div>
    <div class="modal card" *ngIf="showForm">
      <div class="modal-header">
        <h3>{{ editSession ? 'Edit Session' : 'Add Session' }}</h3>
        <button class="btn-close" (click)="showForm = false">&times;</button>
      </div>
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label class="form-label">Name *</label>
          <input type="text" class="form-input" [(ngModel)]="formModel.name" name="name" required />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Start Year *</label>
            <input type="number" class="form-input" [(ngModel)]="formModel.startYear" name="startYear" required />
          </div>
          <div class="form-group">
            <label class="form-label">End Year *</label>
            <input type="number" class="form-input" [(ngModel)]="formModel.endYear" name="endYear" required />
          </div>
        </div>
        <div class="form-error server-error" *ngIf="errorMsg">{{ errorMsg }}</div>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline btn-sm" (click)="showForm = false">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm" [disabled]="saving">
            {{ saving ? 'Saving...' : (editSession ? 'Update' : 'Create') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page-content { padding: 2rem 0 3rem; }
    .toolbar { display: flex; gap: 0.75rem; margin-bottom: 1.25rem; align-items: center; }
    .actions-cell { white-space: nowrap; display: flex; gap: 0.375rem; }
    .empty-state, .loading-state { text-align: center; padding: 3rem 0; color: var(--text-muted); }
    .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; }
    .server-error { text-align: center; margin-bottom: 0.75rem; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border-light); }
  `],
})
export class SessionsComponent implements OnInit {
  sessions: AcademicSessionResponse[] = [];
  loading = true;
  saving = false;
  showForm = false;
  editSession: AcademicSessionResponse | null = null;
  errorMsg = '';

  formModel = { name: '', startYear: 0, endYear: 0 };

  constructor(private academicService: AcademicService) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.loading = true;
    this.academicService.getAcademicSessions().subscribe({
      next: (res: any) => {
        this.sessions = res.data || [];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onSubmit(): void {
    if (!this.formModel.name || !this.formModel.startYear || !this.formModel.endYear) return;
    this.saving = true;
    this.errorMsg = '';

    const req: AcademicSessionRequest = {
      name: this.formModel.name,
      startYear: this.formModel.startYear,
      endYear: this.formModel.endYear,
    };

    if (this.editSession) {
      this.academicService.updateAcademicSession(this.editSession.id, req).subscribe({
        next: () => { this.showForm = false; this.saving = false; this.loadSessions(); },
        error: (err: any) => { this.saving = false; this.errorMsg = err.error?.message || 'Update failed.'; },
      });
    } else {
      this.academicService.createAcademicSession(req).subscribe({
        next: () => { this.showForm = false; this.saving = false; this.loadSessions(); },
        error: (err: any) => { this.saving = false; this.errorMsg = err.error?.message || 'Creation failed.'; },
      });
    }
  }
}

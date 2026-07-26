import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrmService } from '../../../services/hrm.service';
import { JobPostingResponse, JobPostingRequest } from '../../../models/hrm.model';

@Component({
  selector: 'app-job-postings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container page-content">
      <div class="page-header">
        <h1>Job Postings</h1>
        <p>Manage open positions and recruitment</p>
      </div>

      <div class="toolbar">
        <input type="text" class="form-input search-input" placeholder="Search job postings..."
               [(ngModel)]="searchTerm" (ngModelChange)="filterJobPostings()" />
        <button class="btn btn-accent btn-sm" (click)="showForm=true; editPosting=null">Add Job Posting</button>
      </div>

      <div class="table-container" *ngIf="filteredPostings.length">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Department</th>
              <th>Vacancies</th>
              <th>Posting Date</th>
              <th>Closing Date</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of filteredPostings">
              <td class="name-cell">{{p.title}}</td>
              <td>{{p.department || '—'}}</td>
              <td>{{p.vacancies}}</td>
              <td>{{p.postingDate | date:'mediumDate'}}</td>
              <td>{{p.closingDate | date:'mediumDate'}}</td>
              <td>
                <span class="badge" [class]="p.active ? 'badge-success' : 'badge-danger'">
                  {{p.active ? 'Active' : 'Inactive'}}
                </span>
              </td>
              <td class="actions-cell">
                <button class="btn btn-outline btn-sm" (click)="editPosting=p; showForm=true">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="!loading && filteredPostings.length === 0">
        <p>{{searchTerm ? 'No job postings match your search.' : 'No job postings found.'}}</p>
      </div>

      <div class="loading-state" *ngIf="loading">
        <p>Loading job postings...</p>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showForm" (click)="showForm=false"></div>
    <div class="modal card" *ngIf="showForm">
      <div class="modal-header">
        <h3>{{editPosting ? 'Edit Job Posting' : 'Add Job Posting'}}</h3>
        <button class="btn-close" (click)="showForm=false">&times;</button>
      </div>
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label class="form-label">Title *</label>
          <input type="text" class="form-input" [(ngModel)]="formData.title" name="title" required />
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-input" rows="3" [(ngModel)]="formData.description" name="description"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Department *</label>
          <input type="text" class="form-input" [(ngModel)]="formData.department" name="department" required />
        </div>
        <div class="form-group">
          <label class="form-label">Vacancies *</label>
          <input type="number" class="form-input" [(ngModel)]="formData.vacancies" name="vacancies" required />
        </div>
        <div class="form-group">
          <label class="form-label">Posting Date *</label>
          <input type="date" class="form-input" [(ngModel)]="formData.postingDate" name="postingDate" required />
        </div>
        <div class="form-group">
          <label class="form-label">Closing Date *</label>
          <input type="date" class="form-input" [(ngModel)]="formData.closingDate" name="closingDate" required />
        </div>
        <div class="form-error server-error" *ngIf="errorMsg">{{errorMsg}}</div>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline btn-sm" (click)="showForm=false">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm" [disabled]="loading">
            {{loading ? 'Saving...' : (editPosting ? 'Update' : 'Create')}}
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
export class JobPostingsComponent implements OnInit {
  postings: JobPostingResponse[] = [];
  filteredPostings: JobPostingResponse[] = [];
  loading = true;
  searchTerm = '';
  showForm = false;
  editPosting: JobPostingResponse | null = null;
  formData: JobPostingRequest = { title: '', description: '', department: '', vacancies: 0, postingDate: '', closingDate: '' };
  errorMsg = '';

  constructor(private hrmService: HrmService) {}

  ngOnInit(): void {
    this.loadJobPostings();
  }

  loadJobPostings(): void {
    this.loading = true;
    this.hrmService.getJobPostings().subscribe({
      next: (res: any) => {
        const data = res.data;
        this.postings = Array.isArray(data) ? data : (data?.content || []);
        this.filteredPostings = this.postings;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  filterJobPostings(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredPostings = this.postings.filter((p) => {
      return !term || p.title.toLowerCase().includes(term) || (p.department || '').toLowerCase().includes(term);
    });
  }

  onSubmit(): void {
    if (!this.formData.title || !this.formData.department || !this.formData.vacancies || !this.formData.postingDate || !this.formData.closingDate) return;
    this.loading = true;
    this.errorMsg = '';

    this.hrmService.createJobPosting(this.formData).subscribe({
      next: () => { this.showForm = false; this.loadJobPostings(); },
      error: (err: any) => { this.loading = false; this.errorMsg = err.error?.message || 'Creation failed.'; },
    });
  }
}

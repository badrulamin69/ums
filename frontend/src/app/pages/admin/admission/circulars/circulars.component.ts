import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdmissionService } from '../../../../services/admission.service';
import { AdmissionCircularResponse, AdmissionCircularRequest, FacultyResponse } from '../../../../models/admission.model';

@Component({
  selector: 'app-admin-circulars',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container page-content">
      <div class="page-header">
        <h1>Admission Circulars</h1>
        <p>Manage admission circulars and sessions</p>
      </div>

      <div class="toolbar">
        <input type="text" class="form-input search-input" placeholder="Search circulars..."
               [(ngModel)]="searchTerm" (ngModelChange)="filterCirculars()" />
        <button class="btn btn-accent btn-sm" (click)="openForm()">Add Circular</button>
      </div>

      <div class="table-container" *ngIf="filteredCirculars.length">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Session</th>
              <th>Faculty</th>
              <th>Reg Start</th>
              <th>Reg End</th>
              <th>Fee</th>
              <th>Seats</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of filteredCirculars">
              <td class="name-cell"><div class="emp-name">{{c.title}}</div></td>
              <td><span class="emp-id">{{c.session}}</span></td>
              <td>{{c.facultyName || '—'}}</td>
              <td>{{c.registrationStartDate | date:'mediumDate'}}</td>
              <td>{{c.registrationEndDate | date:'mediumDate'}}</td>
              <td>{{c.applicationFee | currency}}</td>
              <td>{{c.totalSeats}}</td>
              <td>
                <span class="badge" [class]="c.active ? 'badge-success' : 'badge-danger'">
                  {{c.active ? 'Active' : 'Inactive'}}
                </span>
              </td>
              <td class="actions-cell">
                <button class="btn btn-outline btn-sm" (click)="openForm(c)">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="!loading && filteredCirculars.length === 0">
        <p>{{searchTerm ? 'No circulars match your search.' : 'No circulars found.'}}</p>
      </div>

      <div class="loading-state" *ngIf="loading">
        <p>Loading admission circulars...</p>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showForm" (click)="closeForm()"></div>
    <div class="modal card" *ngIf="showForm">
      <div class="modal-header">
        <h3>{{editCircular ? 'Edit Circular' : 'Add Circular'}}</h3>
        <button class="btn-close" (click)="closeForm()">&times;</button>
      </div>
      <form (ngSubmit)="onSubmit()">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Title *</label>
            <input type="text" class="form-input" [(ngModel)]="form.title" name="title" required />
          </div>
          <div class="form-group">
            <label class="form-label">Session *</label>
            <input type="text" class="form-input" [(ngModel)]="form.session" name="session" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Faculty *</label>
            <select class="form-input" [(ngModel)]="form.facultyId" name="facultyId" required>
              <option [ngValue]="null">Select Faculty</option>
              <option *ngFor="let f of faculties" [ngValue]="f.id">{{f.name}}</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Registration Start *</label>
            <input type="date" class="form-input" [(ngModel)]="form.registrationStartDate" name="registrationStartDate" required />
          </div>
          <div class="form-group">
            <label class="form-label">Registration End *</label>
            <input type="date" class="form-input" [(ngModel)]="form.registrationEndDate" name="registrationEndDate" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Application Fee *</label>
            <input type="number" class="form-input" [(ngModel)]="form.applicationFee" name="applicationFee" required min="0" />
          </div>
          <div class="form-group">
            <label class="form-label">Total Seats *</label>
            <input type="number" class="form-input" [(ngModel)]="form.totalSeats" name="totalSeats" required min="1" />
          </div>
        </div>
        <div class="form-error server-error" *ngIf="errorMsg">{{errorMsg}}</div>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline btn-sm" (click)="closeForm()">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm" [disabled]="saving">
            {{saving ? 'Saving...' : (editCircular ? 'Update' : 'Create')}}
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
export class AdminCircularsComponent implements OnInit {
  circulars: AdmissionCircularResponse[] = [];
  filteredCirculars: AdmissionCircularResponse[] = [];
  faculties: FacultyResponse[] = [];
  loading = true;
  searchTerm = '';
  showForm = false;
  editCircular: AdmissionCircularResponse | null = null;
  saving = false;
  errorMsg = '';
  form: AdmissionCircularRequest = {
    title: '', session: '', facultyId: null as any,
    registrationStartDate: '', registrationEndDate: '',
    applicationFee: 0, totalSeats: 0,
  };

  constructor(private admissionService: AdmissionService) {}

  ngOnInit(): void {
    this.loadFaculties();
    this.loadCirculars();
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

  loadCirculars(): void {
    this.loading = true;
    this.admissionService.getAdmissionCirculars().subscribe({
      next: (res: any) => {
        const data = res.data;
        this.circulars = Array.isArray(data) ? data : (data?.content || []);
        this.filteredCirculars = this.circulars;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  filterCirculars(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredCirculars = this.circulars.filter(c => {
      return !term || c.title.toLowerCase().includes(term) || c.session.toLowerCase().includes(term);
    });
  }

  openForm(circular?: AdmissionCircularResponse): void {
    this.editCircular = circular || null;
    this.form = circular
      ? {
          title: circular.title,
          session: circular.session,
          facultyId: circular.facultyId,
          registrationStartDate: circular.registrationStartDate?.split('T')[0] || '',
          registrationEndDate: circular.registrationEndDate?.split('T')[0] || '',
          applicationFee: circular.applicationFee,
          totalSeats: circular.totalSeats,
        }
      : { title: '', session: '', facultyId: null as any, registrationStartDate: '', registrationEndDate: '', applicationFee: 0, totalSeats: 0 };
    this.errorMsg = '';
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editCircular = null;
    this.errorMsg = '';
  }

  onSubmit(): void {
    if (!this.form.title || !this.form.session || !this.form.facultyId) return;
    this.saving = true;
    this.errorMsg = '';

    if (this.editCircular) {
      this.admissionService.updateAdmissionCircular(this.editCircular.id, this.form).subscribe({
        next: () => { this.saved(); },
        error: (err: any) => { this.saving = false; this.errorMsg = err.error?.message || 'Update failed.'; },
      });
    } else {
      this.admissionService.createAdmissionCircular(this.form).subscribe({
        next: () => { this.saved(); },
        error: (err: any) => { this.saving = false; this.errorMsg = err.error?.message || 'Creation failed.'; },
      });
    }
  }

  private saved(): void {
    this.saving = false;
    this.closeForm();
    this.loadCirculars();
  }
}

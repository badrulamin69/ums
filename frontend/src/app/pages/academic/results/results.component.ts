import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcademicService } from '../../../services/academic.service';
import { StudentResultResponse, StudentResultRequest } from '../../../models/academic.model';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container page-content">
      <div class="page-header">
        <h1>Student Results</h1>
        <p>Enter and manage student examination results</p>
      </div>

      <div class="toolbar">
        <input type="number" class="form-input" placeholder="Student ID" [(ngModel)]="filterStudentId" />
        <input type="number" class="form-input" placeholder="Session ID" [(ngModel)]="filterSessionId" />
        <button class="btn btn-primary btn-sm" (click)="loadResults()">Load</button>
        <button class="btn btn-accent btn-sm" (click)="showForm = true">Enter Result</button>
        <button class="btn btn-outline btn-sm" (click)="publish()" [disabled]="results.length === 0">Publish Results</button>
      </div>

      <div class="table-container" *ngIf="results.length">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Session</th>
              <th>Grade Point</th>
              <th>Letter Grade</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of results">
              <td>{{ r.studentName }}</td>
              <td><span class="emp-id">{{ r.courseCode }}</span></td>
              <td>{{ r.courseName }}</td>
              <td>{{ r.academicSessionName }}</td>
              <td>{{ r.gradePoint }}</td>
              <td><span class="badge badge-info">{{ r.letterGrade }}</span></td>
              <td>
                <span class="badge" [class]="r.published ? 'badge-success' : 'badge-danger'">
                  {{ r.published ? 'Published' : 'Draft' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="!loading && resultsLoaded && results.length === 0">
        <p>No results found for the given filters.</p>
      </div>

      <div class="empty-state" *ngIf="!loading && !resultsLoaded">
        <p>Enter a student ID and session ID, then click Load.</p>
      </div>

      <div class="loading-state" *ngIf="loading">
        <p>Loading results...</p>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showForm" (click)="showForm = false"></div>
    <div class="modal card" *ngIf="showForm">
      <div class="modal-header">
        <h3>Enter Result</h3>
        <button class="btn-close" (click)="showForm = false">&times;</button>
      </div>
      <form (ngSubmit)="onSubmit()">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Student ID *</label>
            <input type="number" class="form-input" [(ngModel)]="formModel.studentId" name="studentId" required />
          </div>
          <div class="form-group">
            <label class="form-label">Course ID *</label>
            <input type="number" class="form-input" [(ngModel)]="formModel.courseId" name="courseId" required />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Academic Session ID *</label>
          <input type="number" class="form-input" [(ngModel)]="formModel.academicSessionId" name="academicSessionId" required />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Grade Point *</label>
            <input type="number" step="0.01" class="form-input" [(ngModel)]="formModel.gradePoint" name="gradePoint" required />
          </div>
          <div class="form-group">
            <label class="form-label">Credit Hours *</label>
            <input type="number" class="form-input" [(ngModel)]="formModel.creditHours" name="creditHours" required />
          </div>
          <div class="form-group">
            <label class="form-label">Letter Grade *</label>
            <input type="text" class="form-input" [(ngModel)]="formModel.letterGrade" name="letterGrade" required />
          </div>
        </div>
        <div class="form-error server-error" *ngIf="errorMsg">{{ errorMsg }}</div>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline btn-sm" (click)="showForm = false">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm" [disabled]="saving">
            {{ saving ? 'Saving...' : 'Submit' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page-content { padding: 2rem 0 3rem; }
    .toolbar { display: flex; gap: 0.75rem; margin-bottom: 1.25rem; align-items: center; flex-wrap: wrap; }
    .toolbar .form-input { max-width: 160px; }
    .emp-id { font-family: monospace; font-size: 0.8125rem; font-weight: 500; color: var(--primary); }
    .empty-state, .loading-state { text-align: center; padding: 3rem 0; color: var(--text-muted); }
    .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; }
    .server-error { text-align: center; margin-bottom: 0.75rem; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border-light); }
  `],
})
export class ResultsComponent implements OnInit {
  results: StudentResultResponse[] = [];
  loading = false;
  saving = false;
  showForm = false;
  errorMsg = '';
  resultsLoaded = false;
  filterStudentId: number | null = null;
  filterSessionId: number | null = null;

  formModel: StudentResultRequest = {
    studentId: 0,
    courseId: 0,
    academicSessionId: 0,
    gradePoint: 0,
    creditHours: 0,
    letterGrade: '',
  };

  constructor(private academicService: AcademicService) {}

  ngOnInit(): void {}

  loadResults(): void {
    if (!this.filterStudentId || !this.filterSessionId) return;
    this.loading = true;
    this.resultsLoaded = false;
    this.academicService.getStudentResults(this.filterStudentId, this.filterSessionId).subscribe({
      next: (res: any) => {
        this.results = res.data || [];
        this.loading = false;
        this.resultsLoaded = true;
      },
      error: () => { this.loading = false; this.resultsLoaded = true; },
    });
  }

  onSubmit(): void {
    if (
      !this.formModel.studentId ||
      !this.formModel.courseId ||
      !this.formModel.academicSessionId ||
      !this.formModel.letterGrade
    ) return;
    this.saving = true;
    this.errorMsg = '';

    this.academicService.enterResult(this.formModel).subscribe({
      next: () => {
        this.showForm = false;
        this.saving = false;
        if (this.filterStudentId && this.filterSessionId) {
          this.loadResults();
        }
      },
      error: (err: any) => { this.saving = false; this.errorMsg = err.error?.message || 'Failed to enter result.'; },
    });
  }

  publish(): void {
    if (!this.filterStudentId || !this.filterSessionId) return;
    if (!confirm('Publish all results for this student and session?')) return;
    this.academicService.publishResults(this.filterStudentId, this.filterSessionId).subscribe({
      next: () => this.loadResults(),
      error: () => {},
    });
  }
}

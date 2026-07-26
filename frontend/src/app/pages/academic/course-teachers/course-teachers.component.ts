import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcademicService } from '../../../services/academic.service';
import { CourseTeacherResponse, CourseTeacherRequest } from '../../../models/academic.model';

@Component({
  selector: 'app-course-teachers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container page-content">
      <div class="page-header">
        <h1>Course-Teacher Assignments</h1>
        <p>Assign teachers to courses per session</p>
      </div>

      <div class="toolbar">
        <button class="btn btn-accent btn-sm" (click)="showForm = true">Assign Teacher</button>
      </div>

      <div class="table-container" *ngIf="assignments.length">
        <table>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Employee Name</th>
              <th>Session Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of assignments">
              <td><span class="emp-id">{{ a.courseCode }}</span></td>
              <td>{{ a.courseName }}</td>
              <td>{{ a.employeeName }}</td>
              <td>{{ a.academicSessionName }}</td>
              <td class="actions-cell">
                <button class="btn btn-danger btn-sm" (click)="remove(a)">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="!loading && assignments.length === 0">
        <p>No course-teacher assignments found.</p>
      </div>

      <div class="loading-state" *ngIf="loading">
        <p>Loading assignments...</p>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showForm" (click)="showForm = false"></div>
    <div class="modal card" *ngIf="showForm">
      <div class="modal-header">
        <h3>Assign Teacher</h3>
        <button class="btn-close" (click)="showForm = false">&times;</button>
      </div>
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label class="form-label">Course ID *</label>
          <input type="number" class="form-input" [(ngModel)]="formModel.courseId" name="courseId" required />
        </div>
        <div class="form-group">
          <label class="form-label">Employee ID *</label>
          <input type="number" class="form-input" [(ngModel)]="formModel.employeeId" name="employeeId" required />
        </div>
        <div class="form-group">
          <label class="form-label">Academic Session ID *</label>
          <input type="number" class="form-input" [(ngModel)]="formModel.academicSessionId" name="academicSessionId" required />
        </div>
        <div class="form-error server-error" *ngIf="errorMsg">{{ errorMsg }}</div>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline btn-sm" (click)="showForm = false">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm" [disabled]="saving">
            {{ saving ? 'Saving...' : 'Assign' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page-content { padding: 2rem 0 3rem; }
    .toolbar { display: flex; gap: 0.75rem; margin-bottom: 1.25rem; align-items: center; }
    .emp-id { font-family: monospace; font-size: 0.8125rem; font-weight: 500; color: var(--primary); }
    .actions-cell { white-space: nowrap; display: flex; gap: 0.375rem; }
    .empty-state, .loading-state { text-align: center; padding: 3rem 0; color: var(--text-muted); }
    .server-error { text-align: center; margin-bottom: 0.75rem; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border-light); }
  `],
})
export class CourseTeachersComponent implements OnInit {
  assignments: CourseTeacherResponse[] = [];
  loading = true;
  saving = false;
  showForm = false;
  errorMsg = '';

  formModel = { courseId: 0, employeeId: 0, academicSessionId: 0 };

  constructor(private academicService: AcademicService) {}

  ngOnInit(): void {
    this.loadAssignments();
  }

  loadAssignments(): void {
    this.loading = true;
    this.academicService.getCourseTeachers().subscribe({
      next: (res: any) => {
        this.assignments = res.data || [];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onSubmit(): void {
    if (!this.formModel.courseId || !this.formModel.employeeId || !this.formModel.academicSessionId) return;
    this.saving = true;
    this.errorMsg = '';

    const req: CourseTeacherRequest = {
      courseId: this.formModel.courseId,
      employeeId: this.formModel.employeeId,
      academicSessionId: this.formModel.academicSessionId,
    };

    this.academicService.assignCourseTeacher(req).subscribe({
      next: () => { this.showForm = false; this.saving = false; this.loadAssignments(); },
      error: (err: any) => { this.saving = false; this.errorMsg = err.error?.message || 'Assignment failed.'; },
    });
  }

  remove(a: CourseTeacherResponse): void {
    if (!confirm(`Remove ${a.employeeName} from ${a.courseCode}?`)) return;
    this.academicService.removeCourseTeacher(a.id).subscribe({
      next: () => this.loadAssignments(),
      error: () => {},
    });
  }
}

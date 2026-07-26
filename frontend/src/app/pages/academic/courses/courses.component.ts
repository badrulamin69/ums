import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcademicService } from '../../../services/academic.service';
import { CourseResponse, CourseRequest } from '../../../models/academic.model';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container page-content">
      <div class="page-header">
        <h1>Courses</h1>
        <p>Manage university courses</p>
      </div>

      <div class="toolbar">
        <input type="text" class="form-input search-input" placeholder="Search courses..."
               [(ngModel)]="searchTerm" (ngModelChange)="filterCourses()" />
        <button class="btn btn-accent btn-sm" (click)="showForm = true; editCourse = null">Add Course</button>
      </div>

      <div class="table-container" *ngIf="filteredCourses.length">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Credit Hours</th>
              <th>Year Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of filteredCourses">
              <td><span class="emp-id">{{ c.courseCode }}</span></td>
              <td>{{ c.name }}</td>
              <td>{{ c.creditHours }}</td>
              <td>{{ c.yearNumber || c.yearLevelId }}</td>
              <td class="actions-cell">
                <button class="btn btn-outline btn-sm" (click)="editCourse = c; showForm = true">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="!loading && filteredCourses.length === 0">
        <p>{{ searchTerm ? 'No courses match your search.' : 'No courses found.' }}</p>
      </div>

      <div class="loading-state" *ngIf="loading">
        <p>Loading courses...</p>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showForm" (click)="showForm = false"></div>
    <div class="modal card" *ngIf="showForm">
      <div class="modal-header">
        <h3>{{ editCourse ? 'Edit Course' : 'Add Course' }}</h3>
        <button class="btn-close" (click)="showForm = false">&times;</button>
      </div>
      <form (ngSubmit)="onSubmit()">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Course Code *</label>
            <input type="text" class="form-input" [(ngModel)]="formModel.courseCode" name="courseCode" required />
          </div>
          <div class="form-group">
            <label class="form-label">Name *</label>
            <input type="text" class="form-input" [(ngModel)]="formModel.name" name="name" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Credit Hours *</label>
            <input type="number" class="form-input" [(ngModel)]="formModel.creditHours" name="creditHours" required />
          </div>
          <div class="form-group">
            <label class="form-label">Year Level ID *</label>
            <input type="number" class="form-input" [(ngModel)]="formModel.yearLevelId" name="yearLevelId" required />
          </div>
        </div>
        <div class="form-error server-error" *ngIf="errorMsg">{{ errorMsg }}</div>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline btn-sm" (click)="showForm = false">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm" [disabled]="saving">
            {{ saving ? 'Saving...' : (editCourse ? 'Update' : 'Create') }}
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
    .actions-cell { white-space: nowrap; display: flex; gap: 0.375rem; }
    .empty-state, .loading-state { text-align: center; padding: 3rem 0; color: var(--text-muted); }
    .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; }
    .server-error { text-align: center; margin-bottom: 0.75rem; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border-light); }
  `],
})
export class CoursesComponent implements OnInit {
  courses: CourseResponse[] = [];
  filteredCourses: CourseResponse[] = [];
  loading = true;
  saving = false;
  showForm = false;
  searchTerm = '';
  editCourse: CourseResponse | null = null;
  errorMsg = '';

  formModel = { courseCode: '', name: '', creditHours: 0, yearLevelId: 0 };

  constructor(private academicService: AcademicService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.academicService.getCourses().subscribe({
      next: (res: any) => {
        this.courses = res.data || [];
        this.filteredCourses = this.courses;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  filterCourses(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredCourses = this.courses.filter((c) =>
      !term ||
      c.courseCode.toLowerCase().includes(term) ||
      c.name.toLowerCase().includes(term)
    );
  }

  onSubmit(): void {
    if (!this.formModel.courseCode || !this.formModel.name || !this.formModel.creditHours || !this.formModel.yearLevelId) return;
    this.saving = true;
    this.errorMsg = '';

    const req: CourseRequest = {
      courseCode: this.formModel.courseCode,
      name: this.formModel.name,
      creditHours: this.formModel.creditHours,
      yearLevelId: this.formModel.yearLevelId,
    };

    if (this.editCourse) {
      this.academicService.updateCourse(this.editCourse.id, req).subscribe({
        next: () => { this.showForm = false; this.saving = false; this.loadCourses(); },
        error: (err: any) => { this.saving = false; this.errorMsg = err.error?.message || 'Update failed.'; },
      });
    } else {
      this.academicService.createCourse(req).subscribe({
        next: () => { this.showForm = false; this.saving = false; this.loadCourses(); },
        error: (err: any) => { this.saving = false; this.errorMsg = err.error?.message || 'Creation failed.'; },
      });
    }
  }
}

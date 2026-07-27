import { Component, signal, OnInit, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CrudService } from '../../../core/services/crud.service';
import { ToastService } from '../../../core/services/toast.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

interface Course {
  id: number;
  courseCode: string;
  name: string;
  creditHours: number;
  yearLevelId: number;
  yearNumber: number;
  active: boolean;
}

interface CourseRequest {
  courseCode: string;
  name: string;
  creditHours: number;
  yearLevelId: number;
}

interface YearLevel {
  id: number;
  yearNumber: number;
  name: string;
  departmentId: number;
  departmentName: string;
}

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, DataTableComponent, ConfirmDialogComponent, NgbDropdownModule],
  template: `
    <div class="page animate-fade-in-up">
      <app-page-header title="Courses" subtitle="Manage academic courses and curricula">
        <button class="btn btn-gold" (click)="openModal()">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Add Course
        </button>
      </app-page-header>

      <div class="card card-elevated">
        <div class="card-body">
          <app-data-table
            [columns]="columns"
            [rows]="rows()"
            [page]="currentPage()"
            [totalPages]="totalPages()"
            [totalElements]="totalElements()"
            [loading]="loading()"
            emptyTitle="No courses found"
            emptySubtitle="Create your first course to get started."
            (pageChange)="loadPage($event)"
            (rowClick)="openModal($event)"
          />
        </div>
      </div>
    </div>

    @if (showModal()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal-panel animate-fade-in-up wide-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editing() ? 'Edit' : 'Create' }} Course</h2>
            <button class="btn-close" (click)="closeModal()">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13.5 4.5L4.5 13.5M4.5 4.5l9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
          </div>

          <form class="modal-body" (ngSubmit)="save()">
            <div class="form-group">
              <label class="form-label">Course Code <span class="required">*</span></label>
              <input type="text" class="form-control" [(ngModel)]="form.courseCode" name="courseCode" required placeholder="e.g. CS101">
            </div>

            <div class="form-group">
              <label class="form-label">Course Name <span class="required">*</span></label>
              <input type="text" class="form-control" [(ngModel)]="form.name" name="name" required placeholder="e.g. Introduction to Computer Science">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Credit Hours <span class="required">*</span></label>
                <input type="number" class="form-control" [(ngModel)]="form.creditHours" name="creditHours" required [min]="1" [max]="10" placeholder="e.g. 3">
              </div>
              <div class="form-group">
                <label class="form-label">Year Level <span class="required">*</span></label>
                <div class="dropdown-select" ngbDropdown>
                  <button class="form-control" ngbDropdownToggle [class.has-value]="form.yearLevelId">
                    {{ getYearLevelName(form.yearLevelId) }} {{ form.yearLevelId ? '–' : '' }}
                  </button>
                    @if (yearLevels().length > 0) {
                      <div class="dropdown-menu" ngbDropdown>
                        @for (year of yearLevels(); track year.id) {
                          <button class="dropdown-item" ngbDropdownItem (click)="selectYearLevel(year.id)">
                            Year {{ year.yearNumber }} - {{ year.departmentName }}
                          </button>
                        }
                      </div>
                    }
                  @if (yearLevels().length === 0) {
                    <div class="empty-state-dropdown">No year levels available</div>
                  }
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-ghost" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-gold" [disabled]="!form.courseCode || !form.name || !form.creditHours || !form.yearLevelId || saving()">
                @if (saving()) { <span class="spinner-sm"></span> Saving... } @else { {{ editing() ? 'Update' : 'Create' }} }
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    @if (confirmDelete()) {
      <app-confirm-dialog
        title="Delete Course"
        [message]="'Are you sure you want to deactivate ' + confirmDelete()!.name + '?'"
        confirmLabel="Deactivate"
        type="danger"
        (confirm)="doDelete()"
        (cancel)="confirmDelete.set(null)"
      />
    }
  `,
  styles: [`
    .page { max-width: 1200px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
    .page-title { font-family: var(--font-display); font-size: var(--fs-h1); margin-bottom: 0.25rem; }
    .page-subtitle { color: var(--color-text-muted); font-size: var(--fs-small); }

    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.6);
      backdrop-filter: blur(4px); display: flex; align-items: center;
      justify-content: center; z-index: 10001; animation: fadeIn 0.2s var(--ease-out);
    }
    .modal-panel {
      background: var(--color-surface); border: 1px solid var(--color-border);
      border-radius: var(--radius-lg); width: 90%; max-width: 560px;
      box-shadow: var(--shadow-lg); animation: fadeInUp 0.3s var(--ease-spring);
    }
    .wide-modal { max-width: 640px; }
    .modal-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--color-border);
      h2 { font-family: var(--font-display); font-size: var(--fs-h3); }
    }
    .btn-close {
      background: none; border: none; color: var(--color-text-muted); padding: 4px;
      cursor: pointer; border-radius: var(--radius-sm);
      &:hover { color: var(--color-text-primary); background: var(--color-surface-elevated); }
    }
    .modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
    .form-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
    }
    .form-group { display: flex; flex-direction: column; }
    .form-label { margin-bottom: 0.375rem; }
    .required { color: var(--color-danger); }
    .dropdown-select {
      position: relative; width: 100%;
      .form-control { cursor: pointer; }
      .has-value { color: var(--color-text-primary); }
    }
    .dropdown-menu {
      position: absolute; top: 100%; left: 0; right: 0;
      background: var(--color-surface); border: 1px solid var(--color-border);
      border-radius: var(--radius-md); max-height: 240px; overflow-y: auto;
      z-index: 10002; margin-top: 4px;
    }
    .dropdown-item {
      display: block; width: 100%; background: none; border: none;
      text-align: left; padding: 0.75rem 1rem; cursor: pointer;
      color: var(--color-text-primary); transition: all var(--duration-fast) var(--ease-out);
      &:hover { background: var(--color-surface-elevated); color: var(--color-gold); }
    }
    .empty-state-dropdown {
      padding: 0.75rem 1rem; color: var(--color-text-muted); font-style: italic;
    }
    .modal-footer {
      display: flex; justify-content: flex-end; gap: 0.75rem;
      padding-top: 1rem; margin-top: 0.5rem;
    }
    .spinner-sm {
      width: 14px; height: 14px; border: 2px solid transparent;
      border-top-color: currentColor; border-radius: 50%; animation: spin 0.6s linear infinite;
      display: inline-block;
    }
  `],
})
export class CourseListComponent implements OnInit {
  columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'courseCode', label: 'Code', sortable: true, width: '120px' },
    { key: 'creditHours', label: 'Credits', width: '100px', align: 'center' },
    { key: 'yearNumber', label: 'Year', width: '100px', align: 'center' },
    { key: 'departmentName', label: 'Department', width: '150px' },
    { key: 'active', label: 'Status', width: '100px', align: 'center' },
    { key: 'id', label: '', width: '80px', align: 'center' },
  ];

  rows = signal<Course[]>([]);
  yearLevels = signal<YearLevel[]>([]);
  loading = signal(false);
  currentPage = signal(0);
  totalPages = signal(1);
  totalElements = signal(0);

  showModal = signal(false);
  editing = signal<Course | null>(null);
  saving = signal(false);
  confirmDelete = signal<Course | null>(null);

  form: CourseRequest = { courseCode: '', name: '', creditHours: 1, yearLevelId: 0 };

  constructor(
    private crud: CrudService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadYearLevels();
    this.loadPage(0);
  }

  loadYearLevels(): void {
    this.crud.listAll<YearLevel>('year-levels').subscribe({
      next: (levels) => this.yearLevels.set(levels || []),
      error: () => this.yearLevels.set([]),
    });
  }

  loadPage(page: number): void {
    this.loading.set(true);
    this.crud.list<Course>('courses', page, 10).subscribe({
      next: (data) => {
        const rows = data.content.map(c => ({
          ...c,
          departmentName: this.getYearLevelName(c.yearLevelId, true)
        }));
        this.rows.set(rows);
        this.currentPage.set(data.number);
        this.totalPages.set(data.totalPages);
        this.totalElements.set(data.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openModal(course?: Course): void {
    if (course) {
      this.editing.set(course);
      this.form = {
        courseCode: course.courseCode,
        name: course.name,
        creditHours: course.creditHours,
        yearLevelId: course.yearLevelId,
      };
    } else {
      this.editing.set(null);
      this.form = { courseCode: '', name: '', creditHours: 1, yearLevelId: 0 };
    }
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editing.set(null);
  }

  selectYearLevel(yearLevelId: number): void {
    this.form.yearLevelId = yearLevelId;
  }

  getYearLevelName(yearLevelId: number, withDepartment?: boolean): string {
    const year = this.yearLevels().find(y => y.id === yearLevelId);
    if (!year) return 'Unknown';
    return withDepartment ? `${year.yearNumber} - ${year.departmentName}` : `Year ${year.yearNumber}`;
  }

  isValid(): boolean {
    return !!(this.form.courseCode && this.form.name && this.form.creditHours >= 1 && this.form.yearLevelId);
  }

  save(): void {
    if (!this.isValid()) return;
    this.saving.set(true);

    const obs = this.editing()
      ? this.crud.update<CourseRequest>('courses', this.editing()!.id, this.form)
      : this.crud.create<CourseRequest>('courses', this.form);

    obs.subscribe({
      next: () => {
        this.toast.success(this.editing() ? 'Course updated' : 'Course created');
        this.closeModal();
        this.loadPage(this.currentPage());
        this.saving.set(false);
      },
      error: () => this.saving.set(false),
    });
  }

  doDelete(): void {
    const course = this.confirmDelete();
    if (!course) return;

    this.crud.delete('courses', course.id).subscribe({
      next: () => {
        this.toast.success('Course deactivated');
        this.confirmDelete.set(null);
        this.loadPage(this.currentPage());
      },
    });
  }
}
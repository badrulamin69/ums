import { Component, signal, OnInit, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CrudService } from '../../../core/services/crud.service';
import { ToastService } from '../../../core/services/toast.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

interface StudentResult {
  id: number;
  studentId: number;
  studentName: string;
  courseId: number;
  courseName: string;
  courseCode: string;
  academicSessionId: number;
  academicSessionName: string;
  gradePoint: number;
  creditHours: number;
  letterGrade: string;
  published: boolean;
}

interface StudentResultRequest {
  studentId: number;
  courseId: number;
  academicSessionId: number;
  gradePoint: number;
  creditHours: number;
  letterGrade: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  enrollmentNumber: string;
}

interface AcademicSession {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-student-result-list',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, DataTableComponent, ConfirmDialogComponent, NgbDropdownModule],
  template: `
    <div class="page animate-fade-in-up">
      <app-page-header title="Student Results" subtitle="Enter and manage student examination results">
        <button class="btn btn-gold" (click)="openModal()">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Enter Result
        </button>
      </app-page-header>

      <div class="card card-elevated">
        <div class="card-body">
          @if (selectedStudent() && selectedSession()) {
            <app-data-table
              [columns]="columns"
              [rows]="rows()"
              [page]="currentPage()"
              [totalPages]="totalPages()"
              [totalElements]="totalElements()"
              [loading]="loading()"
              emptyTitle="No results found"
              emptySubtitle="Enter results for this student and session."
              (pageChange)="loadPage($event)"
              (rowClick)="openModal($event)"
            />
          } @else {
            <div class="selector-container">
              <h3 class="selector-title">Select Student & Session</h3>
              <div class="selector-row">
                <div class="selector-group">
                  <label class="form-label">Student</label>
                  <div class="dropdown-select" ngbDropdown>
                    <button class="form-control" [class.has-value]="selectedStudent()"
                            [class.has-error]="!selectedStudent() && selectedStudentError()"
                            ngbDropdownToggle>
                      {{ selectedStudent() ? getStudentName(selectedStudent()!) : 'Select a student...' }}
                    </button>
                  @if (students().length > 0) {
                    <div class="dropdown-menu">
                      @for (student of students(); track student.id) {
                        <button class="dropdown-item" ngbDropdownItem (click)="selectStudent(student.id)">
                          {{ student.name }} - {{ student.enrollmentNumber }}
                        </button>
                      }
                    </div>
                  }
                  </div>
                </div>
                <div class="selector-group">
                  <label class="form-label">Session</label>
                  <div class="dropdown-select" ngbDropdown>
                    <button class="form-control" [class.has-value]="selectedSession()"
                            [class.has-error]="!selectedSession() && selectedSessionError()"
                            [disabled]="!selectedStudent()"
                            ngbDropdownToggle>
                      {{ selectedSession() ? getSessionName(selectedSession()!) : 'Select a session...' }}
                    </button>
                    @if (academicSessions().length > 0 && selectedStudent()) {
                      <div class="dropdown-menu">
                        @for (session of filteredSessions(); track session.id) {
                          <button class="dropdown-item" ngbDropdownItem (click)="selectSession(session.id)">
                            {{ session.name }} ({{ session.startDate }} - {{ session.endDate }})
                          </button>
                        }
                      </div>
                    }
                    @if (selectedStudent() && academicSessions().length === 0) {
                      <div class="empty-state-dropdown">No sessions available</div>
                    }
                  </div>
                </div>
                @if (selectedStudent() && selectedSession()) {
                  <button class="btn btn-gold" (click)="loadPage(0)" [disabled]="loading()">
                    {{ loading() ? 'Loading...' : 'Load Results' }}
                  </button>
                  <button class="btn btn-ghost" (click)="publishResults()" [disabled]="rows().length === 0">
                    Publish Results
                  </button>
                }
              </div>
            </div>
          }
        </div>
      </div>

      @if (showModal()) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal-panel animate-fade-in-up wide-modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ editing() ? 'Edit' : 'Enter' }} Result</h2>
              <button class="btn-close" (click)="closeModal()">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13.5 4.5L4.5 13.5M4.5 4.5l9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </button>
            </div>

            <form class="modal-body" (ngSubmit)="save()">
              <div class="form-group">
                <label class="form-label">Student <span class="required">*</span></label>
                <div class="dropdown-select" ngbDropdown>
                  <button class="form-control" [class.has-value]="form.studentId"
                          [class.has-error]="!form.studentId && studentError"
                          ngbDropdownToggle>
                    {{ form.studentId ? getStudentName(form.studentId) : 'Select student...' }}
                  </button>
                    @if (students().length > 0) {
                      <div class="dropdown-menu">
                        @for (student of students(); track student.id) {
                          <button class="dropdown-item" ngbDropdownItem (click)="selectStudentModal(student.id)">
                            {{ student.name }} - {{ student.enrollmentNumber }}
                          </button>
                        }
                      </div>
                    }
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Course <span class="required">*</span></label>
                  <div class="dropdown-select" ngbDropdown>
                    <button class="form-control" [class.has-value]="form.courseId"
                            [class.has-error]="!form.courseId && courseError"
                            ngbDropdownToggle>
                      {{ form.courseId ? getCourseName(form.courseId) : 'Select course...' }}
                    </button>
                    @if (courses().length > 0) {
                      <div class="dropdown-menu">
                        @for (course of courses(); track course.id) {
                          <button class="dropdown-item" ngbDropdownItem (click)="selectCourseModal(course.id)">
                            {{ course.courseCode }} - {{ course.name }}
                          </button>
                        }
                      </div>
                    }
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Session <span class="required">*</span></label>
                  <div class="dropdown-select" ngbDropdown>
                    <button class="form-control" [class.has-value]="form.academicSessionId"
                            [class.has-error]="!form.academicSessionId && sessionError"
                            ngbDropdownToggle>
                      {{ form.academicSessionId ? getSessionName(form.academicSessionId) : 'Select session...' }}
                    </button>
                    @if (academicSessions().length > 0) {
                      <div class="dropdown-menu">
                        @for (session of academicSessions(); track session.id) {
                          <button class="dropdown-item" ngbDropdownItem (click)="selectSessionModal(session.id)">
                            {{ session.name }} ({{ session.startDate }} - {{ session.endDate }})
                          </button>
                        }
                      </div>
                    }
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Grade Point <span class="required">*</span></label>
                  <select class="form-control" [(ngModel)]="form.gradePoint" name="gradePoint" required>
                    <option [value]="" disabled selected>Select grade point</option>
                    @for (grade of gradeOptions(); track grade) {
                      <option [value]="grade">{{ grade }} - {{ getLetterGrade(grade) }}</option>
                    }
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Credit Hours <span class="required">*</span></label>
                  <input type="number" class="form-control" [(ngModel)]="form.creditHours" name="creditHours" required
                         [min]="1" [max]="10" placeholder="e.g. 3">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Letter Grade</label>
                <input type="text" class="form-control" [(ngModel)]="form.letterGrade" name="letterGrade"
                       [value]="getLetterGrade(form.gradePoint)"
                       readonly placeholder="A (4.0)">
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-ghost" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-gold" [disabled]="!isValid() || saving()">
                  @if (saving()) { <span class="spinner-sm"></span> Saving... } @else { {{ editing() ? 'Update' : 'Enter' }} }
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      @if (confirmDelete()) {
        <app-confirm-dialog
          title="Delete Result"
          [message]="'Are you sure you want to delete this result for ' + confirmDelete()!.courseName + '?'"
          confirmLabel="Delete"
          type="danger"
          (confirm)="doDelete()"
          (cancel)="confirmDelete.set(null)"
        />
      }
    </div>
  `,
  styles: [`
    .page { max-width: 1200px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
    .page-title { font-family: var(--font-display); font-size: var(--fs-h1); margin-bottom: 0.25rem; }
    .page-subtitle { color: var(--color-text-muted); font-size: var(--fs-small); }

    .selector-container {
      text-align: center; padding: 3rem;
    }
    .selector-title {
      font-family: var(--font-display); font-size: var(--fs-h3);
      color: var(--color-text-primary); margin-bottom: 2rem;
    }
    .selector-row {
      display: flex; justify-content: center; align-items: end; gap: 1.5rem; flex-wrap: wrap;
    }
    .selector-group {
      min-width: 280px;
      text-align: left;
    }
    .form-label { margin-bottom: 0.375rem; }

    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.6);
      backdrop-filter: blur(4px); display: flex; align-items: center;
      justify-content: center; z-index: 10001; animation: fadeIn 0.2s var(--ease-out);
    }
    .modal-panel {
      background: var(--color-surface); border: 1px solid var(--color-border);
      border-radius: var(--radius-lg); width: 90%; max-width: 640px;
      box-shadow: var(--shadow-lg); animation: fadeInUp 0.3s var(--ease-spring);
    }
    .wide-modal { max-width: 800px; }
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

    .dropdown-select {
      position: relative; width: 100%;
      .form-control { cursor: pointer; }
      .has-value { color: var(--color-text-primary); }
      .has-error { border-color: var(--color-danger); }
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

    .spinner-sm {
      width: 14px; height: 14px; border: 2px solid transparent;
      border-top-color: currentColor; border-radius: 50%; animation: spin 0.6s linear infinite;
      display: inline-block;
    }

    .required { color: var(--color-danger); }
    .text-danger { color: var(--color-danger); }
  `],
})
export class StudentResultListComponent implements OnInit {
  // Selection state
  students = signal<Student[]>([]);
  academicSessions = signal<AcademicSession[]>([]);
  courses = signal<any[]>([]);
  selectedStudent = signal<number | null>(null);
  selectedSession = signal<number | null>(null);
  studentError = signal(false);
  courseError = signal(false);
  sessionError = signal(false);
  selectedStudentError = signal(false);
  selectedSessionError = signal(false);

  // Selected data state
  selectedStudentName = signal('');
  selectedStudentEnrollment = signal('');

  // Result state
  rows = signal<StudentResult[]>([]);
  loading = signal(false);
  currentPage = signal(0);
  totalPages = signal(1);
  totalElements = signal(0);

  // CRUD state
  showModal = signal(false);
  editing = signal<StudentResult | null>(null);
  saving = signal(false);
  confirmDelete = signal<StudentResult | null>(null);
  hasResults = signal(false);

  form: StudentResultRequest = {
    studentId: 0,
    courseId: 0,
    academicSessionId: 0,
    gradePoint: 0,
    creditHours: 1,
    letterGrade: '',
  };

  gradeOptions = computed(() => [4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 1.3, 1.0, 0.7, 0.0]);

  constructor(
    private crud: CrudService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.crud.listAll<Student>('students').subscribe({
      next: (data) => this.students.set(data || []),
      error: () => this.students.set([]),
    });

    this.crud.listAll<AcademicSession>('academic-sessions').subscribe({
      next: (data) => this.academicSessions.set(data || []),
      error: () => this.academicSessions.set([]),
    });

    this.crud.list<{ id: number; courseCode: string; name: string }>('courses', 0, 100).subscribe({
      next: (data) => this.courses.set(data.content || []),
      error: () => this.courses.set([]),
    });
  }

  selectStudent(studentId: number): void {
    this.selectedStudent.set(studentId);
    this.selectedStudentError.set(false);
    this.selectedSession.set(null);
    this.hasResults.set(false);
  }

  selectStudentModal(studentId: number): void {
    this.form.studentId = studentId;
    this.studentError.set(false);
  }

  selectCourseModal(courseId: number): void {
    this.form.courseId = courseId;
    this.courseError.set(false);
    this.form.academicSessionId = 0;
    this.form.gradePoint = 0;
    this.form.creditHours = 1;
    this.form.letterGrade = '';
    this.sessionError.set(false);
  }

  selectSession(sessionId: number): void {
    this.selectedSession.set(sessionId);
    this.selectedSessionError.set(false);
  }

  selectSessionModal(sessionId: number): void {
    this.form.academicSessionId = sessionId;
    this.sessionError.set(false);
  }

  getStudentName(studentId: number): string {
    const student = this.students().find(s => s.id === studentId);
    return student ? student.name : 'Unknown';
  }

  getCourseName(courseId: number): string {
    const course = this.courses().find(c => c.id === courseId);
    return course ? `${course.courseCode} - ${course.name}` : 'Unknown';
  }

  getSessionName(sessionId: number): string {
    const session = this.academicSessions().find(s => s.id === sessionId);
    return session ? session.name : 'Unknown';
  }

  filteredSessions(): AcademicSession[] {
    if (!this.selectedStudent()) return this.academicSessions();
    return this.academicSessions().filter(session =>
      session.startDate && session.endDate
    );
  }

  isValid(): boolean {
    return !!(this.form.studentId && this.form.courseId && this.form.academicSessionId &&
             this.form.gradePoint >= 0 && this.form.gradePoint <= 4.0 &&
             this.form.creditHours >= 1 && this.form.creditHours <= 10);
  }

  getLetterGrade(gradePoint: number): string {
    const gradeMap: Record<number, string> = {
      4.0: 'A (Excellent)', 3.7: 'A- (Very Good)', 3.3: 'B+ (Good)',
      3.0: 'B (Good)', 2.7: 'B- (Satisfactory)', 2.3: 'C+ (Satisfactory)',
      2.0: 'C (Satisfactory)', 1.7: 'C- (Pass)', 1.3: 'D+ (Pass)',
      1.0: 'D (Pass)', 0.7: 'D- (Pass)', 0.0: 'F (Fail)',
    };
    return gradeMap[gradePoint] || 'Unknown';
  }

  openModal(result?: StudentResult): void {
    if (result) {
      this.editing.set(result);
      this.form = {
        studentId: result.studentId,
        courseId: result.courseId,
        academicSessionId: result.academicSessionId,
        gradePoint: result.gradePoint,
        creditHours: result.creditHours,
        letterGrade: result.letterGrade,
      };
    } else {
      this.editing.set(null);
      this.form = {
        studentId: 0,
        courseId: 0,
        academicSessionId: 0,
        gradePoint: 0,
        creditHours: 1,
        letterGrade: '',
      };
    }
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editing.set(null);
  }

  save(): void {
    if (!this.isValid()) return;
    this.saving.set(true);

    const obs = this.editing()
      ? this.crud.update<StudentResultRequest>('student-results', this.editing()!.id, this.form)
      : this.crud.create<StudentResultRequest>('student-results', this.form);

    obs.subscribe({
      next: () => {
        this.toast.success(this.editing() ? 'Result updated' : 'Result entered');
        this.closeModal();
        if (this.selectedStudent() && this.selectedSession()) {
          this.loadPage(0);
        }
        this.saving.set(false);
      },
      error: () => this.saving.set(false),
    });
  }

  doDelete(): void {
    const result = this.confirmDelete();
    if (!result) return;

    this.crud.delete('student-results', result.id).subscribe({
      next: () => {
        this.toast.success('Result deleted');
        this.confirmDelete.set(null);
        if (this.selectedStudent() && this.selectedSession()) {
          this.loadPage(this.currentPage());
        }
      },
    });
  }

  loadPage(page: number): void {
    if (!this.selectedStudent() || !this.selectedSession()) {
      this.selectedStudentError.set(!this.selectedStudent());
      this.selectedSessionError.set(!this.selectedSession());
      return;
    }

    this.loading.set(true);
    this.hasResults.set(false);

    this.crud.list<StudentResult>(
      `student-results/student/${this.selectedStudent()}/session/${this.selectedSession()}`, page, 10
    ).subscribe({
      next: (data) => {
        this.rows.set(data.content || []);
        this.currentPage.set(data.number);
        this.totalPages.set(data.totalPages);
        this.totalElements.set(data.totalElements);
        this.loading.set(false);
        this.hasResults.set(data.content && data.content.length > 0);
      },
      error: () => {
        this.loading.set(false);
        this.hasResults.set(false);
        this.toast.error('Failed to load results');
      },
    });
  }

  publishResults(): void {
    if (!this.selectedStudent() || !this.selectedSession()) return;

    this.crud.customPost(
      `student-results/publish/student/${this.selectedStudent()}/session/${this.selectedSession()}`, {}
    ).subscribe({
      next: () => {
        this.toast.success('Results published and GPA recalculated');
        this.loadPage(this.currentPage());
      },
      error: () => this.toast.error('Failed to publish results'),
    });
  }

  columns: TableColumn[] = [
    { key: 'courseName', label: 'Course', sortable: true },
    { key: 'courseCode', label: 'Code', width: '100px', align: 'center' },
    { key: 'gradePoint', label: 'Grade Point', width: '120px', align: 'center' },
    { key: 'letterGrade', label: 'Letter Grade', width: '120px', align: 'center' },
    { key: 'creditHours', label: 'Credits', width: '100px', align: 'center' },
    { key: 'academicSessionName', label: 'Session', width: '120px' },
    { key: 'published', label: 'Status', width: '100px', align: 'center' },
    { key: 'id', label: '', width: '80px', align: 'center' },
  ];
}
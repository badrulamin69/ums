import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { CrudService } from '../../../core/services/crud.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

interface StudentResult {
  id: number;
  courseName: string;
  courseCode: string;
  gradePoint: number;
  creditHours: number;
  letterGrade: string;
  academicSessionName: string;
  published: boolean;
}

interface AcademicSession {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-student-results-view',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, DataTableComponent],
  template: `
    <div class="page animate-fade-in-up">
      <app-page-header title="My Results" subtitle="View your academic results by session" />

      <div class="card card-elevated animate-fade-in-up stagger-1">
        <div class="card-header"><h3>Select Academic Session</h3></div>
        <div class="card-body">
          <div class="session-selector">
            <div class="form-group">
              <label class="form-label">Academic Session</label>
              <select class="form-select" [(ngModel)]="selectedSessionId" (change)="loadResults()">
                <option [ngValue]="0">Select a session</option>
                @for (session of sessions(); track session.id) {
                  <option [ngValue]="session.id">{{ session.name }}</option>
                }
              </select>
            </div>
          </div>
        </div>
      </div>

      @if (selectedSessionId > 0) {
        <div class="card card-elevated animate-fade-in-up stagger-2" style="margin-top:1.5rem">
          <div class="card-body">
            <app-data-table
              [columns]="columns"
              [rows]="results()"
              [page]="0"
              [totalPages]="1"
              [totalElements]="results().length"
              [loading]="loading()"
              emptyTitle="No results found"
              emptySubtitle="No results available for this session."
            />
          </div>
        </div>

        @if (results().length > 0) {
          <div class="summary-card card card-elevated animate-fade-in-up stagger-3" style="margin-top:1.5rem">
            <div class="card-header"><h3>Session Summary</h3></div>
            <div class="card-body">
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="summary-label">Courses</span>
                  <span class="summary-value">{{ results().length }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Total Credits</span>
                  <span class="summary-value">{{ totalCredits() }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Session GPA</span>
                  <span class="summary-value text-gold">{{ sessionGpa() }}</span>
                </div>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .page { max-width: 1000px; }
    .session-selector { max-width: 400px; }
    .form-group { display: flex; flex-direction: column; }
    .form-label { margin-bottom: 0.375rem; }
    .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
    .summary-item { display: flex; flex-direction: column; align-items: center; gap: 0.375rem; }
    .summary-label { font-size: var(--fs-xs); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
    .summary-value { font-size: 1.5rem; font-weight: var(--fw-bold); color: var(--color-text-primary); }
    .text-gold { color: var(--color-gold); }
    @media (max-width: 640px) { .summary-grid { grid-template-columns: 1fr; } }
  `],
})
export class StudentResultsViewComponent implements OnInit {
  columns: TableColumn[] = [
    { key: 'courseCode', label: 'Code', width: '100px', align: 'center' },
    { key: 'courseName', label: 'Course', sortable: true },
    { key: 'creditHours', label: 'Credits', width: '90px', align: 'center' },
    { key: 'gradePoint', label: 'GP', width: '70px', align: 'center' },
    { key: 'letterGrade', label: 'Grade', width: '100px', align: 'center' },
  ];

  sessions = signal<AcademicSession[]>([]);
  results = signal<StudentResult[]>([]);
  selectedSessionId = 0;
  loading = signal(false);

  totalCredits = signal(0);
  sessionGpa = signal('0.00');

  constructor(
    private crud: CrudService,
    private auth: AuthService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.crud.listAll<AcademicSession>('academic-sessions').subscribe({
      next: (data) => this.sessions.set(data || []),
      error: () => this.sessions.set([]),
    });
  }

  loadResults(): void {
    if (this.selectedSessionId === 0) {
      this.results.set([]);
      return;
    }

    this.loading.set(true);
    const userId = this.auth.getUserId();

    this.crud.list<StudentResult>(
      `student-results/student/${userId}/session/${this.selectedSessionId}`, 0, 200
    ).subscribe({
      next: (data) => {
        this.results.set(data.content || []);
        this.computeSummary(data.content || []);
        this.loading.set(false);
      },
      error: () => {
        this.results.set([]);
        this.loading.set(false);
        this.toast.error('Failed to load results');
      },
    });
  }

  computeSummary(results: StudentResult[]): void {
    const totalCredits = results.reduce((sum, r) => sum + r.creditHours, 0);
    const weightedSum = results.reduce((sum, r) => sum + (r.gradePoint * r.creditHours), 0);
    this.totalCredits.set(totalCredits);
    this.sessionGpa.set(totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : '0.00');
  }
}
